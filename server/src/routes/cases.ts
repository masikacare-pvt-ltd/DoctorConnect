import { Router } from 'express';
import { prisma } from '../config/prisma';
import { requireAuth, AuthenticatedRequest } from '../middlewares/auth';
import { validate } from '../middlewares/validate';
import { getDefaultAvatar } from '../utils/avatar';
import { asString } from '../utils/query';
import { createCaseSchema } from '../validation/schemas';
import { Request, Response } from 'express';

const router = Router();
const viewedCases = new Set<string>();

async function generateCaseNumber(): Promise<string> {
  const today = new Date();
  const y = today.getFullYear();
  const m = String(today.getMonth() + 1).padStart(2, '0');
  const d = String(today.getDate()).padStart(2, '0');
  const dateStr = `${y}${m}${d}`;

  const lastCase = await prisma.clinicalCase.findFirst({
    where: { caseNumber: { startsWith: `MC-${dateStr}-` } },
    orderBy: { caseNumber: 'desc' },
    select: { caseNumber: true },
  });

  let nextSeq = 1;
  if (lastCase?.caseNumber) {
      const parts = lastCase.caseNumber.split('-');
      const lastSeq = parseInt(parts[2] || '0', 10);
    if (!isNaN(lastSeq)) nextSeq = lastSeq + 1;
  }

  return `MC-${dateStr}-${String(nextSeq).padStart(4, '0')}`;
}

function getAuthorAvatar(author: any): string {
  if (author.profile?.avatarData) return author.profile.avatarData;
  if (author.profile?.avatarUrl) return author.profile.avatarUrl;
  if (author.image) return author.image;
  return getDefaultAvatar(author.profile?.gender);
}

// GET /api/cases - list all cases with pagination
router.get('/', async (req: Request, res: Response) => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 20;
    const search = asString(req.query.search) || '';
    const specialization = asString(req.query.specialization);

    const where: any = { deletedAt: null };
    if (specialization) where.specialization = specialization;
    if (search) {
      where.OR = [
        { title: { contains: search, mode: 'insensitive' } },
        { description: { contains: search, mode: 'insensitive' } },
        { caseNumber: { contains: search, mode: 'insensitive' } },
      ];
    }

    const [cases, total] = await Promise.all([
      prisma.clinicalCase.findMany({
        where,
        include: {
          author: { include: { profile: true } },
          images: { take: 1, orderBy: { createdAt: 'asc' } },
          _count: { select: { comments: true, likes: true } },
        },
        orderBy: { createdAt: 'desc' },
        skip: (page - 1) * limit,
        take: limit,
      }),
      prisma.clinicalCase.count({ where }),
    ]);

    const formatted = cases.map((c) => ({
      id: c.id,
      caseNumber: c.caseNumber,
      title: c.title,
      description: c.description,
      authorId: c.authorId,
      authorName: c.author.profile?.displayName || c.author.name,
      authorAvatar: getAuthorAvatar(c.author),
      specialization: c.specialization,
      urgent: c.urgent,
      diseaseTags: c.diseaseTags,
      status: c.status,
      coverImage: c.images[0]?.imageData || c.images[0]?.secureUrl || null,
      viewsCount: c.viewsCount,
      commentsCount: c._count.comments,
      likesCount: c._count.likes,
      createdAt: c.createdAt,
      updatedAt: c.updatedAt,
    }));

    res.json({ status: 'success', data: formatted, total, page, limit });
  } catch (e: any) {
    res.status(500).json({ status: 'error', message: e.message });
  }
});

// GET /api/cases/:id - single case
router.get('/:id', async (req: Request, res: Response) => {
  try {
    const c = await prisma.clinicalCase.findFirst({
      where: { id: req.params.id as string, deletedAt: null },
      include: {
        author: { include: { profile: true } },
        images: { orderBy: { createdAt: 'asc' } },
        aiReport: true,
        _count: { select: { comments: true, likes: true } },
      },
    });
    if (!c) return res.status(404).json({ status: 'error', message: 'Case not found' });

    const user = (req as AuthenticatedRequest).user;
    const viewKey = user ? `${user.id}:${c.id}` : `anon:${req.ip}:${c.id}`;
    if (!viewedCases.has(viewKey)) {
      viewedCases.add(viewKey);
      await prisma.clinicalCase.update({ where: { id: c.id }, data: { viewsCount: { increment: 1 } } });
    }

    res.json({
      status: 'success',
      data: {
        id: c.id,
        caseNumber: c.caseNumber,
        title: c.title,
        description: c.description,
        authorId: c.authorId,
        authorName: c.author.profile?.displayName || c.author.name,
        authorAvatar: getAuthorAvatar(c.author),
        specialization: c.specialization,
        urgent: c.urgent,
        diseaseTags: c.diseaseTags,
        status: c.status,
        images: c.images.map(i => ({ ...i, downloadURL: i.imageData || i.secureUrl, thumbnailURL: i.imageData || i.secureUrl })),
        viewsCount: c.viewsCount + 1,
        commentsCount: c._count.comments,
        likesCount: c._count.likes,
        aiReport: c.aiReport ? (() => {
          const p = (typeof c.aiReport!.findings === 'object' ? c.aiReport!.findings : {}) as any;
          return {
            id: c.aiReport!.id,
            caseId: c.aiReport!.caseId,
            createdAt: c.aiReport!.createdAt,
            model: c.aiReport!.model,
            aiResponse: c.aiReport!.aiResponse || '',
            isMedical: c.aiReport!.isMedical ?? true,
            nonMedicalReason: c.aiReport!.nonMedicalReason || '',
            structured: {
              summary: c.aiReport!.summary || p.summary || '',
              differentials: (p.differentials || []).map((d: any) => ({ condition: d.condition || '', likelihood: d.likelihood || '' })),
              recommendations: c.aiReport!.recommendations || [],
              redFlags: c.aiReport!.redFlags || [],
              questionsToClinician: c.aiReport!.questionsToClinician || [],
              disclaimer: c.aiReport!.disclaimer || '',
            },
          };
        })() : null,
        createdAt: c.createdAt,
        updatedAt: c.updatedAt,
      },
    });
  } catch (e: any) {
    res.status(500).json({ status: 'error', message: e.message });
  }
});

// POST /api/cases - create case (auth required)
router.post('/', requireAuth, validate(createCaseSchema), async (req: Request, res: Response) => {
  const user = (req as AuthenticatedRequest).user;
  try {
    const { title, description, specialization, urgent, diseaseTags } = req.body;

    const newCase = await prisma.clinicalCase.create({
      data: {
        caseNumber: await generateCaseNumber(),
        title: title || description.split('.')[0].slice(0, 80) || 'Clinical Case',
        description,
        authorId: user.id,
        specialization: specialization || 'General Medicine',
        urgent: urgent || false,
        diseaseTags: diseaseTags || [],
      },
    });

    await prisma.activityLog.create({
      data: { userId: user.id, action: 'create_case', entityType: 'case', entityId: newCase.id },
    });

    res.status(201).json({ status: 'success', data: newCase });
  } catch (e: any) {
    res.status(500).json({ status: 'error', message: e.message });
  }
});

// PATCH /api/cases/:id - edit case (author only)
async function updateCase(req: Request, res: Response) {
  const user = (req as AuthenticatedRequest).user;
  const id = req.params.id as string;
  if (!id) return res.status(400).json({ status: 'error', message: 'Case ID is required' });
  try {
    const c = await prisma.clinicalCase.findUnique({ where: { id } });
    if (!c) return res.status(404).json({ status: 'error', message: 'Case not found' });
    if (c.authorId !== user.id) return res.status(403).json({ status: 'error', message: 'Forbidden' });

    const { title, description, specialization, urgent, diseaseTags } = req.body;
    const updated = await prisma.clinicalCase.update({
      where: { id },
      data: {
        ...(title !== undefined && { title }),
        ...(description !== undefined && { description }),
        ...(specialization !== undefined && { specialization }),
        ...(urgent !== undefined && { urgent }),
        ...(diseaseTags !== undefined && { diseaseTags }),
      },
    });

    res.json({ status: 'success', data: updated });
  } catch (e: any) {
    res.status(500).json({ status: 'error', message: e.message });
  }
}

router.patch('/:id', requireAuth, updateCase);
router.put('/:id', requireAuth, updateCase);

// PATCH /api/cases/:id/cover - update cover image
router.patch('/:id/cover', requireAuth, async (req: Request, res: Response) => {
  try {
    const { coverImage } = req.body;
    await prisma.clinicalCase.update({ where: { id: req.params.id as string }, data: { coverImage } });
    res.json({ status: 'success' });
  } catch (e: any) {
    res.status(500).json({ status: 'error', message: e.message });
  }
});

// DELETE /api/cases/:id - soft delete (author only)
router.delete('/:id', requireAuth, async (req: Request, res: Response) => {
  const user = (req as AuthenticatedRequest).user;
  try {
    const c = await prisma.clinicalCase.findUnique({ where: { id: req.params.id as string } });
    if (!c) return res.status(404).json({ status: 'error', message: 'Case not found' });
    if (c.authorId !== user.id) return res.status(403).json({ status: 'error', message: 'Forbidden' });
    await prisma.clinicalCase.update({ where: { id: req.params.id as string }, data: { deletedAt: new Date() } });
    res.json({ status: 'success' });
  } catch (e: any) {
    res.status(500).json({ status: 'error', message: e.message });
  }
});

// POST /api/cases/:id/like - like/unlike a case
router.post('/:id/like', requireAuth, async (req: Request, res: Response) => {
  const user = (req as AuthenticatedRequest).user;
  try {
    const existing = await prisma.like.findUnique({
      where: { userId_caseId: { userId: user.id, caseId: req.params.id as string } },
    });
    if (existing) {
      await prisma.like.delete({ where: { id: existing.id } });
      await prisma.clinicalCase.update({ where: { id: req.params.id as string }, data: { viewsCount: { increment: 0 } } });
      res.json({ status: 'success', liked: false });
    } else {
      await prisma.like.create({ data: { userId: user.id, caseId: req.params.id as string } });
      res.json({ status: 'success', liked: true });
    }
  } catch (e: any) {
    res.status(500).json({ status: 'error', message: e.message });
  }
});

// GET /api/cases/:id/likes - who liked this case
router.get('/:id/likes', requireAuth, async (req: Request, res: Response) => {
  try {
    const likes = await prisma.like.findMany({
      where: { caseId: req.params.id as string },
      include: { user: { include: { profile: true } } },
      orderBy: { createdAt: 'desc' },
    });
    const formatted = likes.map((l) => ({
      id: l.id,
      userId: l.userId,
      name: l.user.profile?.displayName || l.user.name,
      avatar: getAuthorAvatar({ profile: l.user.profile, image: l.user.image, name: l.user.name }),
      createdAt: l.createdAt,
    }));
    res.json({ status: 'success', data: formatted });
  } catch (e: any) {
    res.status(500).json({ status: 'error', message: e.message });
  }
});

export default router;
