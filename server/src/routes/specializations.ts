import { Router, Request, Response } from 'express';
import { prisma } from '../config/prisma';

const router = Router();

const DEFAULT_SPECS = [
  { name: 'Cardiology', slug: 'cardiology', description: 'Heart and cardiovascular system', order: 1 },
  { name: 'Dermatology', slug: 'dermatology', description: 'Skin, hair, and nails', order: 2 },
  { name: 'Neurology', slug: 'neurology', description: 'Brain and nervous system', order: 3 },
  { name: 'Radiology', slug: 'radiology', description: 'Medical imaging', order: 4 },
  { name: 'Pediatrics', slug: 'pediatrics', description: 'Child and adolescent care', order: 5 },
  { name: 'Pathology', slug: 'pathology', description: 'Disease diagnosis', order: 6 },
  { name: 'General Medicine', slug: 'general-medicine', description: 'Primary and internal medicine', order: 7 },
];

// GET /api/specializations
router.get('/', async (_req: Request, res: Response) => {
  try {
    return res.json({ status: 'success', data: DEFAULT_SPECS });
  } catch (e: any) {
    res.status(500).json({ status: 'error', message: e.message });
  }
});

export default router;
