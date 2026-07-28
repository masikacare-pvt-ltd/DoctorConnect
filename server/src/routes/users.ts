import { Router, Request, Response } from 'express';
import { prisma } from '../config/prisma';
import { requireAuth, requireApproved, AuthenticatedRequest } from '../middlewares/auth';

const router = Router();

router.get('/search', requireAuth, requireApproved, async (req: Request, res: Response) => {
  try {
    const q = (req.query.q as string || '').trim();
    if (!q) return res.json({ status: 'success', data: [] });

    const currentUser = (req as AuthenticatedRequest).user;

    const users = await prisma.user.findMany({
      where: {
        id: { not: currentUser.id },
        OR: [
          { name: { contains: q, mode: 'insensitive' } },
          { profile: { displayName: { contains: q, mode: 'insensitive' } } },
        ],
      },
      include: { profile: true },
      take: 10,
    });

    res.json({
      status: 'success',
      data: users.map(u => ({
        id: u.id,
        name: u.profile?.displayName || u.name,
        email: u.email,
        image: u.profile?.avatarUrl || u.image || null,
      })),
    });
  } catch (e: any) {
    res.status(500).json({ status: 'error', message: e.message });
  }
});

export default router;
