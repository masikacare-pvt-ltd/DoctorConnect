import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import compression from 'compression';
import rateLimit from 'express-rate-limit';
import { config } from 'dotenv';
import { fileURLToPath } from 'node:url';
import { dirname, resolve } from 'node:path';
import { auth } from './config/auth';
import { prisma } from './config/prisma';

const __dirname = dirname(fileURLToPath(import.meta.url));
config({ path: resolve(__dirname, '../.env') });

export { prisma };

const app = express();
const PORT = process.env.PORT || 5000;

app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      imgSrc: ["'self'", "data:"],
      scriptSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'"],
      connectSrc: ["'self'"],
      fontSrc: ["'self'"],
    },
  },
  strictTransportSecurity: { maxAge: 31536000, includeSubDomains: true },
}));
app.use(cors({
  origin: process.env.CLIENT_URL || 'http://localhost:3000',
  credentials: true,
}));
app.use(compression());

app.use((req, _res, next) => {
  console.log(`${new Date().toISOString()} ${req.method} ${req.url}`);
  next();
});

app.use('/api', rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 200,
  standardHeaders: true,
  legacyHeaders: false,
  message: { status: 'error', message: 'Too many requests. Please wait before trying again.' },
}));

// NOTE: global express.json() is intentionally omitted; it consumes the body
// stream and breaks better-auth's internal raw-body read. JSON is parsed
// per-route inside the REST routers instead.
app.use(express.urlencoded({ extended: true }));

// Better Auth — call auth.api directly. toNodeHandler is unreliable here, so we
// invoke the API methods and forward the returned Web Response (cookies included).
// NOTE: global express.json() is intentionally omitted — it consumes the request
// body stream and breaks better-auth. We read the raw body here instead.
app.all('/api/auth/*', async (req, res) => {
  if (!req) return void res.status(500).json({ message: 'Internal error: request lost' });
  const r = req;
  const urlPart = r.url || '';
  const path = (r.params as any)[0] || (urlPart.split('?')[0] || '').replace('/api/auth/', '');
  const method = path
    .split(/[-/_]/)
    .map((seg: string, i: number) => (i === 0 ? seg : seg.charAt(0).toUpperCase() + seg.slice(1)))
    .join('');
  const fn = (auth.api as any)[method];
  if (typeof fn !== 'function') {
    res.status(404).json({ message: `Unknown auth action: ${path}` });
    return;
  }
  try {
    const plainHeaders: Record<string, string> = {};
    for (const [k, v] of Object.entries(r.headers)) {
      if (typeof v === 'string') plainHeaders[k] = v;
      else if (Array.isArray(v)) plainHeaders[k] = v.join(', ');
    }
    const raw = await new Promise<string>((resolve, reject) => {
      let data = '';
      let done = false;
      r.on('data', (c: any) => (data += c));
      r.on('end', () => { if (!done) { done = true; resolve(data); } });
      r.on('error', reject);
      setTimeout(() => { if (!done) { done = true; resolve(data); } }, 5000);
    });
    const body = raw ? JSON.parse(raw) : r.body;
    const response = await fn({
      body,
      query: r.query as Record<string, string>,
      headers: plainHeaders,
      asResponse: true,
    });
    const respText = await response.text();
    res.status(response.status);
    const setCookies = (response.headers as any).getSetCookie
      ? (response.headers as any).getSetCookie()
      : [];
    for (const c of setCookies) res.append('Set-Cookie', c);
    res.set('Content-Type', response.headers.get('content-type') || 'application/json');
    res.send(respText);
  } catch (e: any) {
    console.error('AUTH_ERROR', e?.stack || e);
    res.status(500).json({ message: e?.message || 'auth error' });
  }
});

// REST API routes — mount JSON parsing only for these (NOT for /api/auth, which
// reads the raw body itself).
app.use('/api/cases', express.json());
app.use('/api/comments', express.json());
app.use('/api/bookmarks', express.json());
app.use('/api/notifications', express.json());
app.use('/api/profile', express.json());
app.use('/api/uploads', express.json());
app.use('/api/ai', express.json());

import casesRouter from './routes/cases';
import commentsRouter from './routes/comments';
import bookmarksRouter from './routes/bookmarks';
import notificationsRouter from './routes/notifications';
import profileRouter from './routes/profile';
import uploadsRouter from './routes/uploads';
import aiRouter from './routes/ai';
import specializationsRouter from './routes/specializations';

app.use('/api/cases', casesRouter);
app.use('/api/comments', commentsRouter);
app.use('/api/bookmarks', bookmarksRouter);
app.use('/api/notifications', notificationsRouter);
app.use('/api/profile', profileRouter);
app.use('/api/uploads', uploadsRouter);
app.use('/api/ai', aiRouter);
app.use('/api/specializations', specializationsRouter);

app.get('/api/health', (_req, res) => {
  res.json({ status: 'ok', timestamp: new Date() });
});

app.use((err: any, _req: express.Request, res: express.Response, _next: express.NextFunction) => {
  console.error('[ERROR]', err);

  if (err?.code === 'P2025') {
    return res.status(404).json({ status: 'error', message: 'Resource not found' });
  }

  const status = err?.status || err?.statusCode || 500;
  const message = status === 500 ? 'Internal server error' : (err?.message || 'Internal server error');
  res.status(status).json({ status: 'error', message });
});

app.listen(PORT, () => {
  console.log(`✅ Server running on http://localhost:${PORT} ::pid=${process.pid}`);
});

export default app;
