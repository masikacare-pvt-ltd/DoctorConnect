import { Request, Response, NextFunction } from 'express';
import { createHmac, timingSafeEqual } from 'node:crypto';

const ADMIN_ID = process.env.ADMIN_ID || 'admin';
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'Admin@123';
const SECRET = process.env.ADMIN_TOKEN_SECRET || 'fallback-dev-secret-change-me';

function signToken(): string {
  const expiry = Math.floor(Date.now() / 1000) + 86400;
  const payload = `admin:${expiry}`;
  const hmac = createHmac('sha256', SECRET).update(payload).digest('hex');
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
    const expectedSig = createHmac('sha256', SECRET).update(payload).digest('hex');
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
