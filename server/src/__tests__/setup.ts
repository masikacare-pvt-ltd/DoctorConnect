/**
 * Vitest global test setup.
 * Mocks Prisma so tests don't need a real DB connection.
 */
import { vi } from 'vitest';

// Mock the Prisma client — tests should not hit a real database
vi.mock('../config/prisma', () => ({
  prisma: {
    user: {
      findMany: vi.fn(),
      findUnique: vi.fn(),
      findFirst: vi.fn(),
      count: vi.fn(),
      create: vi.fn(),
      update: vi.fn(),
      delete: vi.fn(),
    },
    clinicalCase: {
      findMany: vi.fn(),
      findUnique: vi.fn(),
      findFirst: vi.fn(),
      count: vi.fn(),
      create: vi.fn(),
      update: vi.fn(),
      delete: vi.fn(),
    },
    comment: {
      findMany: vi.fn(),
      findUnique: vi.fn(),
      findFirst: vi.fn(),
      count: vi.fn(),
      create: vi.fn(),
      update: vi.fn(),
    },
    notification: {
      create: vi.fn(),
      createMany: vi.fn(),
    },
    activityLog: {
      findFirst: vi.fn(),
      create: vi.fn(),
    },
    aIReport: {
      findMany: vi.fn(),
      findUnique: vi.fn(),
      count: vi.fn(),
      delete: vi.fn(),
    },
    $transaction: vi.fn(),
    $executeRaw: vi.fn(),
  },
}));

// Mock better-auth config so it doesn't try to connect to a real DB/SMTP
vi.mock('../config/auth', () => ({
  auth: {
    api: {
      getSession: vi.fn().mockResolvedValue(null),
    },
  },
}));

// Mock the auth middlewares — inject a real user for authenticated routes
vi.mock('../middlewares/auth', async (importOriginal) => {
  const { Request, Response, NextFunction } = await import('express') as any;
  return {
    requireAuth: vi.fn((req: any, res: any, next: any) => {
      // Default: simulate an approved doctor
      req.user = { id: 'user-123', name: 'Test Doctor', email: 'test@example.com', role: 'doctor', approvalStatus: 'approved' };
      req.session = { id: 'session-123' };
      next();
    }),
    requireApproved: vi.fn((req: any, res: any, next: any) => {
      const user = req.user;
      if (!user) return res.status(401).json({ status: 'error', message: 'Unauthorized' });
      if (user.approvalStatus !== 'approved') {
        return res.status(403).json({ status: 'error', message: 'Account pending approval.' });
      }
      next();
    }),
    requireRole: vi.fn(() => (_req: any, _res: any, next: any) => next()),
  };
});

// Suppress console output during tests
vi.spyOn(console, 'log').mockImplementation(() => {});
vi.spyOn(console, 'warn').mockImplementation(() => {});
