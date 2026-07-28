import { Router, Request, Response } from 'express';
import { prisma } from '../config/prisma';
import { requireAuth, AuthenticatedRequest } from '../middlewares/auth';
import { validate } from '../middlewares/validate';
import { addCommentSchema } from '../validation/schemas';

const router = Router();

// GET /api/comments/recent - recent comments across all cases
router.get('/recent', async (req: Request, res: Response) => {
  try {
    const limit = Math.min(parseInt(req.query.limit as string) || 20, 50);
    const comments = await prisma.comment.findMany({
      where: { deletedAt: null },
      include: { author: { include: { profile: true } } },
      orderBy: { createdAt: 'desc' },
      take: limit,
    });
    res.json({
      status: 'success',
      data: comments.map((c) => ({
        id: c.id,
        caseId: c.caseId,
        content: c.content,
        authorId: c.authorId,
        authorName: c.author.profile?.displayName || c.author.name,
        authorAvatar: c.author.profile?.avatarUrl || c.author.image || `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(c.author.name)}`,
        createdAt: c.createdAt,
      })),
    });
  } catch (e: any) {
    res.status(500).json({ status: 'error', message: e.message });
  }
});

// GET /api/comments?caseId=xxx
router.get('/', async (req: Request, res: Response) => {
  try {
    const { caseId } = req.query;
    if (!caseId) return res.status(400).json({ status: 'error', message: 'caseId required' });

    const comments = await prisma.comment.findMany({
      where: { caseId: caseId as string, deletedAt: null },
      include: { author: { include: { profile: true } } },
      orderBy: { createdAt: 'asc' },
    });

    res.json({
      status: 'success',
      data: comments.map((c) => ({
        id: c.id,
        caseId: c.caseId,
        content: c.content,
        authorId: c.authorId,
        authorName: c.author.profile?.displayName || c.author.name,
        authorAvatar: c.author.profile?.avatarUrl || c.author.image || `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(c.author.name)}`,
        createdAt: c.createdAt,
      })),
    });
  } catch (e: any) {
    res.status(500).json({ status: 'error', message: e.message });
  }
});

// POST /api/comments
router.post('/', requireAuth, validate(addCommentSchema), async (req: Request, res: Response) => {
  const user = (req as AuthenticatedRequest).user;
  try {
    const { caseId, content } = req.body;

    const comment = await prisma.comment.create({
      data: { caseId, content, authorId: user.id },
      include: { author: { include: { profile: true } } },
    });

    // Update comment count on case
    await prisma.clinicalCase.update({
      where: { id: caseId },
      data: { commentsCount: { increment: 1 } },
    });

    // Create notification for case author
    const clinCase = await prisma.clinicalCase.findUnique({ where: { id: caseId } });
    if (clinCase && clinCase.authorId !== user.id) {
      await prisma.notification.create({
        data: {
          userId: clinCase.authorId,
          type: 'comment',
          text: `${user.name} commented on your case`,
          caseId,
          fromName: user.name,
        },
      });
    }

    res.status(201).json({
      status: 'success',
      data: {
        id: comment.id,
        caseId: comment.caseId,
        content: comment.content,
        authorId: comment.authorId,
        authorName: comment.author.profile?.displayName || comment.author.name,
        authorAvatar: comment.author.profile?.avatarUrl || comment.author.image || `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(comment.author.name)}`,
        createdAt: comment.createdAt,
      },
    });
  } catch (e: any) {
    res.status(500).json({ status: 'error', message: e.message });
  }
});

// DELETE /api/comments/:id
router.delete('/:id', requireAuth, async (req: Request, res: Response) => {
  const user = (req as AuthenticatedRequest).user;
  try {
    const comment = await prisma.comment.findUnique({ where: { id: req.params.id as string } });
    if (!comment) return res.status(404).json({ status: 'error', message: 'Not found' });
    if (comment.authorId !== user.id) return res.status(403).json({ status: 'error', message: 'Forbidden' });

    await prisma.comment.update({ where: { id: req.params.id as string }, data: { deletedAt: new Date() } });
    await prisma.clinicalCase.update({
      where: { id: comment.caseId },
      data: { commentsCount: { decrement: 1 } },
    });

    res.json({ status: 'success' });
  } catch (e: any) {
    res.status(500).json({ status: 'error', message: e.message });
  }
});

export default router;
