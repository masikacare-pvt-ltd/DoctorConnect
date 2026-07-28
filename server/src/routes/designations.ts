import { Router, Request, Response } from 'express';
import { prisma } from '../config/prisma';
import { requireAuth, requireApproved } from '../middlewares/auth';
import { z } from 'zod';

const router = Router();

const DEFAULT_DESIGNATIONS = [
  'Attending Physician',
  'Cardiologist',
  'Chief Resident',
  'Consultant',
  'Dermatologist',
  'Fellow Specialist',
  'Neurologist',
  'Radiologist',
  'Specialist Physician',
];

// GET /api/designations - Search & list designations
router.get('/', async (req: Request, res: Response) => {
  try {
    const q = (req.query.q as string || '').trim();
    
    // Seed defaults if table is empty
    const count = await prisma.designation.count();
    if (count === 0) {
      await prisma.designation.createMany({
        data: DEFAULT_DESIGNATIONS.map((name) => ({ name })),
        skipDuplicates: true,
      });
    }

    const dbDesignations = await prisma.designation.findMany({
      where: q ? { name: { contains: q, mode: 'insensitive' } } : {},
      orderBy: { name: 'asc' },
      select: { id: true, name: true },
    });

    res.json({ status: 'success', data: dbDesignations });
  } catch (e: any) {
    res.status(500).json({ status: 'error', message: e.message });
  }
});

// POST /api/designations - Create new designation
const createDesignationSchema = z.object({
  name: z.string().trim().min(1, 'Name is required').max(100),
});

router.post('/', requireAuth, requireApproved, async (req: Request, res: Response) => {
  try {
    const parse = createDesignationSchema.safeParse(req.body);
    if (!parse.success) {
      return res.status(400).json({ status: 'error', message: parse.error.issues[0]?.message || 'Invalid name' });
    }
    const name = parse.data.name;

    // Case-insensitive lookup
    const existing = await prisma.designation.findFirst({
      where: { name: { equals: name, mode: 'insensitive' } },
    });

    if (existing) {
      return res.json({ status: 'success', data: existing });
    }

    const created = await prisma.designation.create({
      data: { name },
    });

    res.status(201).json({ status: 'success', data: created });
  } catch (e: any) {
    res.status(500).json({ status: 'error', message: e.message });
  }
});

export default router;
