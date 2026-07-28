import { Router, Request, Response } from 'express';
import { prisma } from '../config/prisma';
import { requireAuth } from '../middlewares/auth';
import { z } from 'zod';

const router = Router();

// GET /api/hospitals - Search & list hospitals
router.get('/', async (req: Request, res: Response) => {
  try {
    const q = (req.query.q as string || '').trim();

    const dbHospitals = await prisma.hospital.findMany({
      where: q ? { hospitalName: { contains: q, mode: 'insensitive' } } : {},
      orderBy: { hospitalName: 'asc' },
      take: 20,
      select: { id: true, hospitalName: true },
    });

    res.json({ status: 'success', data: dbHospitals });
  } catch (e: any) {
    res.status(500).json({ status: 'error', message: e.message });
  }
});

// POST /api/hospitals - Create new hospital with case-insensitive deduplication
const createHospitalSchema = z.object({
  hospitalName: z.string().trim().min(1, 'Hospital name is required').max(200),
});

router.post('/', requireAuth, async (req: Request, res: Response) => {
  try {
    const parse = createHospitalSchema.safeParse(req.body);
    if (!parse.success) {
      return res.status(400).json({ status: 'error', message: parse.error.issues[0]?.message || 'Invalid hospital name' });
    }
    const hospitalName = parse.data.hospitalName.trim();

    // Case-insensitive check
    const existing = await prisma.hospital.findFirst({
      where: { hospitalName: { equals: hospitalName, mode: 'insensitive' } },
    });

    if (existing) {
      return res.json({ status: 'success', data: existing });
    }

    const created = await prisma.hospital.create({
      data: { hospitalName },
    });

    res.status(201).json({ status: 'success', data: created });
  } catch (e: any) {
    res.status(500).json({ status: 'error', message: e.message });
  }
});

export default router;
