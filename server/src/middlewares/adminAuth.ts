import { Request, Response, NextFunction } from 'express';
import { createHmac, timingSafeEqual } from 'node:crypto';

// In production, these MUST be set via environment variables.
// The server will refuse to start if they are missing or use known insecure defaults.
const ADMIN_ID = process.env.ADMIN_ID;
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD;
const SECRET = process.env.ADMIN_TOKEN_SECRET;

const INSECURE_DEFAULTS = new Set(['admin', 'Admin@123', 'fallback-dev-secret-change-me', 'password', '123456']);

export function validateAdminConfig(): void {
  const isProduction = process.env.NODE_ENV === 'production';

  // Warn if NODE_ENV is not explicitly set
  if (!process.env.NODE_ENV) {
    console.warn('[WARN] NODE_ENV is not set. Cookies will NOT be secured (no Secure flag, SameSite=lax). Set NODE_ENV=production on your deployment platform.');
  }

  // Validate BETTER_AUTH_SECRET
  if (!process.env.BETTER_AUTH_SECRET) {
    const msg = '[FATAL] BETTER_AUTH_SECRET is not set. All sessions are insecure.';
    console.error(msg);
    if (isProduction) process.exit(1);
  }

  if (!ADMIN_ID || !ADMIN_PASSWORD || !SECRET) {
    const missing = [
      !ADMIN_ID && 'ADMIN_ID',
      !ADMIN_PASSWORD && 'ADMIN_PASSWORD',
      !SECRET && 'ADMIN_TOKEN_SECRET',
    ].filter(Boolean).join(', ');
    const msg = `[FATAL] Missing required environment variables: ${missing}. Server cannot start safely.`;
    console.error(msg);
    if (isProduction) process.exit(1);
    console.warn('[WARN] Running with missing admin credentials — development only.');
    return;
  }

  if (isProduction) {
    if (INSECURE_DEFAULTS.has(ADMIN_ID) || INSECURE_DEFAULTS.has(ADMIN_PASSWORD) || INSECURE_DEFAULTS.has(SECRET)) {
      console.error('[FATAL] Admin credentials are using known insecure default values. Set unique strong values in environment variables.');
      process.exit(1);
    }
    if (ADMIN_PASSWORD.length < 12) {
      console.error('[FATAL] ADMIN_PASSWORD must be at least 12 characters in production.');
      process.exit(1);
    }
    if (SECRET.length < 32) {
      console.error('[FATAL] ADMIN_TOKEN_SECRET must be at least 32 characters in production.');
      process.exit(1);
    }
  }
}

// Use fallbacks ONLY for local dev (after validation has already warned).
const ADMIN_TOKEN_SECRET_KEY = SECRET || (process.env.NODE_ENV !== 'production' ? 'dev-only-secret-not-for-production' : '');

function signToken(): string {
  const expiry = Math.floor(Date.now() / 1000) + 86400;
  const payload = `admin:${expiry}`;
  const hmac = createHmac('sha256', ADMIN_TOKEN_SECRET_KEY).update(payload).digest('hex');
  return Buffer.from(`${payload}:${hmac}`).toString('base64url');
}

function verifyToken(token: string): boolean {
  try {
    const decoded = Buffer.from(token, 'base64url').toString('utf-8');
    const parts = decoded.split(':');
    if (parts.length !== 3) return false;
    const [, expiryStr, sig] = parts;
    const expiry = parseInt(expiryStr, 10);
    if (isNaN(expiry) || Date.now() / 1000 > expiry) return false;
    const payload = `admin:${expiry}`;
    const expectedSig = createHmac('sha256', ADMIN_TOKEN_SECRET_KEY).update(payload).digest('hex');
    if (sig.length !== expectedSig.length) return false;
    return timingSafeEqual(Buffer.from(sig), Buffer.from(expectedSig));
  } catch {
    return false;
  }
}

export function adminLogin(req: Request, res: Response) {
  const { adminId, password } = req.body || {};
  if (!adminId || !password) {
    return res.status(400).json({ status: 'error', message: 'Admin ID and password are required' });
  }
  // Reject login entirely if credentials are not configured
  if (!ADMIN_ID || !ADMIN_PASSWORD) {
    return res.status(503).json({ status: 'error', message: 'Admin authentication is not configured on this server.' });
  }
  if (adminId !== ADMIN_ID || password !== ADMIN_PASSWORD) {
    return res.status(401).json({ status: 'error', message: 'Invalid admin credentials' });
  }
  const token = signToken();
  res.json({ status: 'success', data: { token } });
}

export function requireAdmin(req: Request, res: Response, next: NextFunction) {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ status: 'error', message: 'Unauthorized: admin token required' });
  }
  const token = authHeader.slice(7);
  if (!verifyToken(token)) {
    return res.status(401).json({ status: 'error', message: 'Unauthorized: invalid or expired admin token' });
  }
  next();
}
