import { Router, Request, Response } from 'express';
import { prisma } from '../config/prisma';
import { requireAuth, requireApproved } from '../middlewares/auth';
import { z } from 'zod';

const router = Router();

// GET /api/subcategories
router.get('/', async (req: Request, res: Response) => {
  try {
    const q = (req.query.q as string || '').trim();
    const subcategories = await prisma.subCategory.findMany({
      where: q ? { name: { contains: q, mode: 'insensitive' } } : {},
      orderBy: { name: 'asc' },
      select: { name: true },
    });
    res.json({ status: 'success', data: subcategories.map((s) => s.name) });
  } catch (e: any) {
    res.status(500).json({ status: 'error', message: e.message });
  }
});

// POST /api/subcategories
const createSchema = z.object({
  name: z.string().trim().min(1, 'Name is required').max(200),
});

router.post('/', requireAuth, requireApproved, async (req: Request, res: Response) => {
  try {
    const parse = createSchema.safeParse(req.body);
    if (!parse.success) {
      return res.status(400).json({ status: 'error', message: parse.error.issues[0]?.message || 'Invalid name' });
    }
    const name = parse.data.name;

    const existing = await prisma.subCategory.findFirst({
      where: { name: { equals: name, mode: 'insensitive' } },
    });
    if (existing) {
      return res.json({ status: 'success', data: existing });
    }

    const created = await prisma.subCategory.create({ data: { name } });
    res.status(201).json({ status: 'success', data: created });
  } catch (e: any) {
    res.status(500).json({ status: 'error', message: e.message });
  }
});

export default router;