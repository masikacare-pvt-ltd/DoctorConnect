import { Router, Request, Response } from 'express';
import { prisma } from '../config/prisma';
import { requireAuth, requireApproved, AuthenticatedRequest } from '../middlewares/auth';
import { validate } from '../middlewares/validate';
import { addCommentSchema } from '../validation/schemas';
import { getDefaultAvatar } from '../utils/avatar';

const router = Router();

function getCommentAuthorAvatar(author: any): string {
  if (author.profile?.avatarData) return author.profile.avatarData;
  if (author.profile?.avatarUrl) return author.profile.avatarUrl;
  if (author.image) return author.image;
  return getDefaultAvatar(author.profile?.gender);
}

// GET /api/comments/recent - recent comments across all cases
// Auth required: comments contain clinical content (PHI risk if public)
router.get('/recent', requireAuth, requireApproved, async (req: Request, res: Response) => {
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
        authorAvatar: getCommentAuthorAvatar(c.author),
        createdAt: c.createdAt,
      })),
    });
  } catch (e: any) {
    res.status(500).json({ status: 'error', message: e.message });
  }
});

// GET /api/comments?caseId=xxx
// Auth required: clinical case discussions are not public
router.get('/', requireAuth, requireApproved, async (req: Request, res: Response) => {
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
        authorAvatar: getCommentAuthorAvatar(c.author),
        createdAt: c.createdAt,
      })),
    });
  } catch (e: any) {
    res.status(500).json({ status: 'error', message: e.message });
  }
});

// POST /api/comments
router.post('/', requireAuth, requireApproved, validate(addCommentSchema), async (req: Request, res: Response) => {
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

    // Parse @mentions and notify mentioned users.
    // Extract @DisplayName tokens from the comment, then look up only those specific users.
    // This avoids loading the entire user table on every comment post.
    const mentionTokens = [...content.matchAll(/@([\w\s.'-]{1,60})(?=\s|$|[.,!?;])/g)]
      .map((m: RegExpMatchArray) => m[1].trim())
      .filter((t: string) => t.length > 0);

    if (mentionTokens.length > 0) {
      // Look up only the users whose display names appear as @mentions
      const mentionedUsers = await prisma.user.findMany({
        where: {
          id: { not: user.id },
          profile: {
            displayName: { in: mentionTokens, mode: 'insensitive' },
          },
        },
        select: { id: true },
      });

      if (mentionedUsers.length > 0) {
        await prisma.notification.createMany({
          data: mentionedUsers.map(mu => ({
            userId: mu.id,
            type: 'mention',
            text: `${user.name} mentioned you in a comment`,
            caseId,
            fromName: user.name,
          })),
        });
      }
    }

    res.status(201).json({
      status: 'success',
      data: {
        id: comment.id,
        caseId: comment.caseId,
        content: comment.content,
        authorId: comment.authorId,
        authorName: comment.author.profile?.displayName || comment.author.name,
        authorAvatar: getCommentAuthorAvatar(comment.author),
        createdAt: comment.createdAt,
      },
    });
  } catch (e: any) {
    res.status(500).json({ status: 'error', message: e.message });
  }
});

// DELETE /api/comments/:id
router.delete('/:id', requireAuth, requireApproved, async (req: Request, res: Response) => {
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
