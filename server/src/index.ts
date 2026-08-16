import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import compression from 'compression';
import rateLimit from 'express-rate-limit';
import { config } from 'dotenv';
import { fileURLToPath } from 'node:url';
import { dirname, resolve } from 'node:path';
import { toNodeHandler } from 'better-auth/node';
import { auth } from './config/auth';
import { prisma } from './config/prisma';
import { logger } from './utils/logger';
import casesRouter from './routes/cases';
import commentsRouter from './routes/comments';
import bookmarksRouter from './routes/bookmarks';
import notificationsRouter from './routes/notifications';
import profileRouter from './routes/profile';
import uploadsRouter from './routes/uploads';
import aiRouter from './routes/ai';
import specializationsRouter from './routes/specializations';
import designationsRouter from './routes/designations';
import hospitalsRouter from './routes/hospitals';
import subcategoriesRouter from './routes/subcategories';
import adminRouter from './routes/admin';
import usersRouter from './routes/users';
import { adminLogin, validateAdminConfig } from './middlewares/adminAuth';

const __dirname = dirname(fileURLToPath(import.meta.url));
config({ path: resolve(__dirname, '../.env') });

export { prisma };

const app = express();
const PORT = process.env.PORT || 5000;

// Render (and most cloud platforms) sit behind a reverse proxy.
// Trust the first proxy so express-rate-limit can read the real client IP.
app.set('trust proxy', 1);

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

const allowedOrigins = [
  process.env.CLIENT_URL || 'http://localhost:3000',
  'http://localhost:3000',
  // Dev-only origins — excluded in production
  ...(process.env.NODE_ENV !== 'production' ? [
    'http://localhost:3001',
    'http://localhost:5173',
  ] : []),
].filter(Boolean);

app.use(cors({
  origin: (origin, callback) => {
    if (!origin) return callback(null, true);
    if (allowedOrigins.includes(origin)) return callback(null, true);
    callback(new Error(`CORS blocked: ${origin}`));
  },
  credentials: true,
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
}));
app.use(compression());

app.use((req, res, next) => {
  if (process.env.NODE_ENV !== 'production') {
    const start = Date.now();
    res.on('finish', () => logger.request(req.method, req.url, res.statusCode, Date.now() - start));
  }
  next();
});

app.use('/api', rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 200,
  standardHeaders: true,
  legacyHeaders: false,
  message: { status: 'error', message: 'Too many requests. Please wait before trying again.' },
}));

// NOTE: global express.json() is intentionally omitted here — it consumes the
// body stream and breaks better-auth's internal raw-body read. JSON is parsed
// per-route inside the REST routers instead.
app.use(express.urlencoded({ extended: true }));

// Better Auth — bridges Web Request/Response API to Node.js streams.
// global express.json() must NOT be mounted before this route.
app.all('/api/auth/*', toNodeHandler(auth));

// Mount JSON parsing per-route (NOT for /api/auth)
app.use('/api/cases', express.json());
app.use('/api/comments', express.json());
app.use('/api/bookmarks', express.json());
app.use('/api/notifications', express.json());
app.use('/api/profile', express.json());
app.use('/api/uploads', express.json());
app.use('/api/ai', express.json());
app.use('/api/designations', express.json());
app.use('/api/hospitals', express.json());
app.use('/api/subcategories', express.json());
app.use('/api/admin/auth', express.json());
app.use('/api/admin', express.json());
app.use('/api/users', express.json());

// Validate critical config before accepting any traffic.
// In production, missing/insecure credentials cause immediate process.exit(1).
validateAdminConfig();

app.use('/api/cases', casesRouter);
app.use('/api/comments', commentsRouter);
app.use('/api/bookmarks', bookmarksRouter);
app.use('/api/notifications', notificationsRouter);
app.use('/api/profile', profileRouter);
app.use('/api/uploads', uploadsRouter);
app.use('/api/ai', aiRouter);
app.use('/api/specializations', specializationsRouter);
app.use('/api/designations', designationsRouter);
app.use('/api/hospitals', hospitalsRouter);
app.use('/api/subcategories', subcategoriesRouter);
// Separate admin auth endpoint (not behind requireAdmin middleware)
app.post('/api/admin/auth/login', adminLogin);
app.use('/api/admin', adminRouter);
app.use('/api/users', usersRouter);

app.get('/api/health', (_req, res) => {
  res.json({ status: 'ok', timestamp: new Date() });
});

app.use((err: any, _req: express.Request, res: express.Response, _next: express.NextFunction) => {
  logger.error(err?.message || 'Unhandled error', {
    stack: err?.stack,
    code: err?.code,
    status: err?.status,
  });

  if (err?.code === 'P2025') {
    return res.status(404).json({ status: 'error', message: 'Resource not found' });
  }

  const status = err?.status || err?.statusCode || 500;
  const message = err?.message || 'Internal server error';
  res.status(status).json({ status: 'error', message });
});

app.listen(PORT, () => {
  logger.info(`Server running on http://localhost:${PORT}`, { pid: process.pid });
});

export default app;
