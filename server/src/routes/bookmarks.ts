import { Router, Request, Response } from 'express';
import { prisma } from '../config/prisma';
import { requireAuth, AuthenticatedRequest } from '../middlewares/auth';
import { validate } from '../middlewares/validate';
import { toggleBookmarkSchema } from '../validation/schemas';

const router = Router();

// GET /api/bookmarks - get my bookmarks
router.get('/', requireAuth, async (req: Request, res: Response) => {
  const user = (req as AuthenticatedRequest).user;
  try {
    const bookmarks = await prisma.bookmark.findMany({
      where: { userId: user.id },
      include: {
        case: {
          include: {
            author: { include: { profile: true } },
            images: { take: 1 },
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    res.json({
      status: 'success',
      data: bookmarks.map((b) => ({
        id: b.id,
        caseId: b.caseId,
        caseTitle: b.case.title,
        caseCover: b.case.images[0]?.secureUrl || null,
        authorName: b.case.author.profile?.displayName || b.case.author.name,
        createdAt: b.createdAt,
      })),
    });
  } catch (e: any) {
    res.status(500).json({ status: 'error', message: e.message });
  }
});

// POST /api/bookmarks/toggle
router.post('/toggle', requireAuth, validate(toggleBookmarkSchema), async (req: Request, res: Response) => {
  const user = (req as AuthenticatedRequest).user;
  try {
    const { caseId } = req.body;

    const existing = await prisma.bookmark.findUnique({
      where: { userId_caseId: { userId: user.id, caseId } },
    });

    if (existing) {
      await prisma.bookmark.delete({ where: { userId_caseId: { userId: user.id, caseId } } });
      return res.json({ status: 'success', bookmarked: false });
    }

    await prisma.bookmark.create({ data: { userId: user.id, caseId } });
    res.json({ status: 'success', bookmarked: true });
  } catch (e: any) {
    res.status(500).json({ status: 'error', message: e.message });
  }
});

// GET /api/bookmarks/ids - get just bookmark caseIds for current user
router.get('/ids', requireAuth, async (req: Request, res: Response) => {
  const user = (req as AuthenticatedRequest).user;
  try {
    const bookmarks = await prisma.bookmark.findMany({
      where: { userId: user.id },
      select: { caseId: true },
    });
    res.json({ status: 'success', data: bookmarks.map((b) => b.caseId) });
  } catch (e: any) {
    res.status(500).json({ status: 'error', message: e.message });
  }
});

export default router;
