/**
 * Admin authentication middleware tests.
 * These are the most security-critical paths — must always pass.
 */
import { describe, it, expect, beforeEach, vi } from 'vitest';
import express from 'express';
import request from 'supertest';

// Set env before importing the module under test
beforeEach(() => {
  process.env.ADMIN_ID = 'testadmin';
  process.env.ADMIN_PASSWORD = 'TestPassword123!';
  process.env.ADMIN_TOKEN_SECRET = 'a-test-secret-that-is-at-least-32-chars-long!!';
  process.env.NODE_ENV = 'test';
});

// Dynamic import so env vars are set first
async function getAdminAuth() {
  vi.resetModules();
  const mod = await import('../middlewares/adminAuth');
  return mod;
}

describe('adminLogin', () => {
  it('rejects missing credentials with 400', async () => {
    const { adminLogin } = await getAdminAuth();
    const app = express();
    app.use(express.json());
    app.post('/login', adminLogin);

    const res = await request(app).post('/login').send({});
    expect(res.status).toBe(400);
    expect(res.body.status).toBe('error');
  });

  it('rejects wrong credentials with 401', async () => {
    const { adminLogin } = await getAdminAuth();
    const app = express();
    app.use(express.json());
    app.post('/login', adminLogin);

    const res = await request(app).post('/login').send({ adminId: 'wrong', password: 'wrong' });
    expect(res.status).toBe(401);
  });

  it('returns token for correct credentials', async () => {
    const { adminLogin } = await getAdminAuth();
    const app = express();
    app.use(express.json());
    app.post('/login', adminLogin);

    const res = await request(app).post('/login').send({
      adminId: 'testadmin',
      password: 'TestPassword123!',
    });
    expect(res.status).toBe(200);
    expect(res.body.status).toBe('success');
    expect(res.body.data.token).toBeTruthy();
    expect(typeof res.body.data.token).toBe('string');
  });
});

describe('requireAdmin', () => {
  it('rejects requests without Authorization header', async () => {
    const { requireAdmin } = await getAdminAuth();
    const app = express();
    app.get('/protected', requireAdmin, (_req, res) => res.json({ ok: true }));

    const res = await request(app).get('/protected');
    expect(res.status).toBe(401);
  });

  it('rejects requests with a garbage token', async () => {
    const { requireAdmin } = await getAdminAuth();
    const app = express();
    app.get('/protected', requireAdmin, (_req, res) => res.json({ ok: true }));

    const res = await request(app)
      .get('/protected')
      .set('Authorization', 'Bearer not-a-real-token');
    expect(res.status).toBe(401);
  });

  it('allows requests with a valid token', async () => {
    const { adminLogin, requireAdmin } = await getAdminAuth();
    const app = express();
    app.use(express.json());
    app.post('/login', adminLogin);
    app.get('/protected', requireAdmin, (_req, res) => res.json({ ok: true }));

    // Get a real token first
    const loginRes = await request(app).post('/login').send({
      adminId: 'testadmin',
      password: 'TestPassword123!',
    });
    const { token } = loginRes.body.data;

    const res = await request(app)
      .get('/protected')
      .set('Authorization', `Bearer ${token}`);
    expect(res.status).toBe(200);
    expect(res.body.ok).toBe(true);
  });
});

describe('validateAdminConfig', () => {
  it('does not throw in non-production when vars are set', async () => {
    const { validateAdminConfig } = await getAdminAuth();
    expect(() => validateAdminConfig()).not.toThrow();
  });
});
