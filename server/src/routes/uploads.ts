import { Router, Request, Response } from 'express';
import multer from 'multer';
import { prisma } from '../config/prisma';
import { requireAuth, AuthenticatedRequest } from '../middlewares/auth';

const router = Router();
const upload = multer({ storage: multer.memoryStorage(), limits: { fileSize: 15 * 1024 * 1024 } });

function dataUri(buffer: Buffer, mimetype: string): string {
  return `data:${mimetype};base64,${buffer.toString('base64')}`;
}

// POST /api/uploads/case/:caseId - upload images for a case (stored in DB)
router.post('/case/:caseId', requireAuth, upload.array('images', 12), async (req: Request, res: Response) => {
  const user = (req as AuthenticatedRequest).user;
  try {
    const caseId = req.params.caseId as string;
    const files = (req.files as Express.Multer.File[]) || [];
    if (!files.length) return res.status(400).json({ status: 'error', message: 'No images provided' });

    const clinCase = await prisma.clinicalCase.findUnique({ where: { id: caseId } });
    if (!clinCase) return res.status(404).json({ status: 'error', message: 'Case not found' });
    if (clinCase.authorId !== user.id) return res.status(403).json({ status: 'error', message: 'Forbidden' });

    const uploaded: any[] = [];
    for (const file of files) {
      const imgData = dataUri(file.buffer, file.mimetype);
      const img = await prisma.caseImage.create({
        data: {
          caseId,
          uploadedBy: user.id,
          providerId: 'db',
          publicUrl: imgData,
          secureUrl: imgData,
          imageData: imgData,
          mimeType: file.mimetype,
          size: file.size,
        },
      });
      uploaded.push(img);
    }

    const first = uploaded[0];
    if (first) {
      await prisma.clinicalCase.update({
        where: { id: caseId },
        data: { coverImage: first.imageData || first.secureUrl },
      });
    }

    await prisma.activityLog.create({ data: { userId: user.id, action: 'upload_image', entityType: 'case', entityId: caseId, meta: { count: uploaded.length } as any } });
    res.status(201).json({ status: 'success', data: uploaded });
  } catch (e: any) {
    res.status(500).json({ status: 'error', message: e.message });
  }
});

export default router;
