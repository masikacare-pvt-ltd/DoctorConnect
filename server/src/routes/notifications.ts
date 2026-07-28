import { Router, Request, Response } from 'express';
import { prisma } from '../config/prisma';
import { requireAuth, AuthenticatedRequest } from '../middlewares/auth';

const router = Router();

// GET /api/notifications
router.get('/', requireAuth, async (req: Request, res: Response) => {
  const user = (req as AuthenticatedRequest).user;
  try {
    const notifications = await prisma.notification.findMany({
      where: { userId: user.id },
      orderBy: { createdAt: 'desc' },
      take: 50,
    });
    res.json({ status: 'success', data: notifications });
  } catch (e: any) {
    res.status(500).json({ status: 'error', message: e.message });
  }
});

// PATCH /api/notifications/:id/read
router.patch('/:id/read', requireAuth, async (req: Request, res: Response) => {
  const user = (req as AuthenticatedRequest).user;
  try {
    await prisma.notification.updateMany({
      where: { id: req.params.id as string, userId: user.id },
      data: { read: true },
    });
    res.json({ status: 'success' });
  } catch (e: any) {
    res.status(500).json({ status: 'error', message: e.message });
  }
});

// DELETE /api/notifications/:id
router.delete('/:id', requireAuth, async (req: Request, res: Response) => {
  const user = (req as AuthenticatedRequest).user;
  try {
    await prisma.notification.deleteMany({
      where: { id: req.params.id as string, userId: user.id },
    });
    res.json({ status: 'success' });
  } catch (e: any) {
    res.status(500).json({ status: 'error', message: e.message });
  }
});

// PATCH /api/notifications/read-all
router.patch('/read-all', requireAuth, async (req: Request, res: Response) => {
  const user = (req as AuthenticatedRequest).user;
  try {
    await prisma.notification.updateMany({
      where: { userId: user.id, read: false },
      data: { read: true },
    });
    res.json({ status: 'success' });
  } catch (e: any) {
    res.status(500).json({ status: 'error', message: e.message });
  }
});

export default router;
