/**
 * Cases API route tests.
 * Prisma and auth middlewares are mocked in setup.ts — no real DB needed.
 */
import { describe, it, expect, vi, beforeEach } from 'vitest';
import express from 'express';
import request from 'supertest';
import { prisma } from '../config/prisma';
import * as authMiddleware from '../middlewares/auth';

import casesRouter from '../routes/cases';

function buildApp() {
  const app = express();
  app.use(express.json());
  app.use('/', casesRouter);
  return app;
}

const mockCase = {
  id: 'case-1',
  caseNumber: 'MC-20260101-0001',
  title: 'Test Case',
  description: 'A test clinical case',
  authorId: 'user-123',
  author: {
    id: 'user-123',
    name: 'Test Doctor',
    image: null,
    profile: { displayName: 'Dr. Test', avatarData: null, avatarUrl: null, gender: 'male' },
  },
  specialization: 'Cardiology',
  caseType: 'Normal',
  urgent: false,
  diseaseTags: [],
  status: 'open',
  viewsCount: 0,
  commentsCount: 0,
  coverImage: null,
  images: [],
  _count: { comments: 0, likes: 0 },
  createdAt: new Date(),
  updatedAt: new Date(),
  deletedAt: null,
  aiReport: null,
};

// Type-safe mock helpers
const mockAuth = authMiddleware as any;

function setApprovedUser() {
  mockAuth.requireAuth.mockImplementation((req: any, _res: any, next: any) => {
    req.user = { id: 'user-123', name: 'Test Doctor', email: 'test@example.com', role: 'doctor', approvalStatus: 'approved' };
    req.session = { id: 'session-123' };
    next();
  });
  mockAuth.requireApproved.mockImplementation((req: any, res: any, next: any) => {
    if (!req.user) return res.status(401).json({ status: 'error', message: 'Unauthorized' });
    if (req.user.approvalStatus !== 'approved') {
      return res.status(403).json({ status: 'error', message: 'Account pending approval.' });
    }
    next();
  });
}

function setPendingUser() {
  mockAuth.requireAuth.mockImplementation((req: any, _res: any, next: any) => {
    req.user = { id: 'user-456', name: 'Pending Doctor', email: 'p@example.com', role: 'doctor', approvalStatus: 'pending' };
    next();
  });
}

beforeEach(() => {
  vi.clearAllMocks();
  setApprovedUser();
});

describe('GET /api/cases', () => {
  it('returns paginated cases', async () => {
    vi.mocked(prisma.clinicalCase.findMany).mockResolvedValue([mockCase] as any);
    vi.mocked(prisma.clinicalCase.count).mockResolvedValue(1);

    const res = await request(buildApp()).get('/');
    expect(res.status).toBe(200);
    expect(res.body.status).toBe('success');
    expect(Array.isArray(res.body.data)).toBe(true);
    expect(res.body.total).toBe(1);
  });

  it('filters by specialization when provided', async () => {
    vi.mocked(prisma.clinicalCase.findMany).mockResolvedValue([]);
    vi.mocked(prisma.clinicalCase.count).mockResolvedValue(0);

    await request(buildApp()).get('/?specialization=Cardiology');
    const callArgs = vi.mocked(prisma.clinicalCase.findMany).mock.calls[0][0] as any;
    expect(callArgs.where.specialization).toBe('Cardiology');
  });

  it('returns empty array when no cases exist', async () => {
    vi.mocked(prisma.clinicalCase.findMany).mockResolvedValue([]);
    vi.mocked(prisma.clinicalCase.count).mockResolvedValue(0);

    const res = await request(buildApp()).get('/');
    expect(res.status).toBe(200);
    expect(res.body.data).toEqual([]);
  });
});

describe('GET /api/cases/:id', () => {
  it('returns 404 for unknown case', async () => {
    vi.mocked(prisma.clinicalCase.findFirst).mockResolvedValue(null);
    const res = await request(buildApp()).get('/nonexistent-id');
    expect(res.status).toBe(404);
  });

  it('returns case data for known case', async () => {
    vi.mocked(prisma.clinicalCase.findFirst).mockResolvedValue({ ...mockCase, images: [] } as any);
    vi.mocked(prisma.activityLog.findFirst).mockResolvedValue(null);
    vi.mocked(prisma.activityLog.create).mockResolvedValue({} as any);
    vi.mocked(prisma.clinicalCase.update).mockResolvedValue(mockCase as any);

    const res = await request(buildApp()).get('/case-1');
    expect(res.status).toBe(200);
    expect(res.body.data.id).toBe('case-1');
    expect(res.body.data.caseType).toBe('Normal');
  });
});

describe('POST /api/cases', () => {
  it('returns 400 when description is missing', async () => {
    const res = await request(buildApp()).post('/').send({ title: 'Test' });
    expect(res.status).toBe(400);
  });

  it('rejects unapproved doctors with 403', async () => {
    setPendingUser();
    const res = await request(buildApp()).post('/').send({
      title: 'New Case',
      description: 'A valid case description',
    });
    expect(res.status).toBe(403);
  });
});

describe('DELETE /api/cases/:id', () => {
  it('returns 403 if user is not the author', async () => {
    vi.mocked(prisma.clinicalCase.findUnique).mockResolvedValue({
      ...mockCase,
      authorId: 'other-user',
    } as any);

    const res = await request(buildApp()).delete('/case-1');
    expect(res.status).toBe(403);
  });

  it('soft deletes when user is the author', async () => {
    vi.mocked(prisma.clinicalCase.findUnique).mockResolvedValue({
      ...mockCase,
      authorId: 'user-123',
    } as any);
    vi.mocked(prisma.clinicalCase.update).mockResolvedValue(mockCase as any);

    const res = await request(buildApp()).delete('/case-1');
    expect(res.status).toBe(200);
    expect(vi.mocked(prisma.clinicalCase.update).mock.calls[0][0]).toMatchObject({
      where: { id: 'case-1' },
      data: expect.objectContaining({ deletedAt: expect.any(Date) }),
    });
  });
});
