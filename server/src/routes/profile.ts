import { Router, Request, Response } from 'express';
import { prisma } from '../config/prisma';
import { requireAuth, AuthenticatedRequest } from '../middlewares/auth';
import { validate } from '../middlewares/validate';
import { completeProfileSchema, avatarUploadSchema } from '../validation/schemas';
import { getDefaultAvatar } from '../utils/avatar';

const router = Router();

// GET /api/profile/me
router.get('/me', requireAuth, async (req: Request, res: Response) => {
  const user = (req as AuthenticatedRequest).user;
  try {
    const profile = await prisma.profile.findUnique({ where: { userId: user.id } });
    if (profile && !profile.avatarData && !profile.avatarUrl) {
      profile.avatarData = getDefaultAvatar(profile.gender || 'male');
    }
    res.json({ status: 'success', data: profile });
  } catch (e: any) {
    res.status(500).json({ status: 'error', message: e.message });
  }
});

// POST /api/profile/complete
router.post('/complete', requireAuth, validate(completeProfileSchema), async (req: Request, res: Response) => {
  const user = (req as AuthenticatedRequest).user;
  try {
    let { firstName, lastName, designation, specializationId, hospital, mobile, bio, gender } = req.body;
    if (!firstName || !lastName) {
      const nameParts = (user.name || '').split(' ');
      firstName = firstName || nameParts[0] || '';
      lastName = lastName || (nameParts.length > 1 ? nameParts.slice(1).join(' ') : nameParts[0]) || '';
    }
    const profile = await prisma.profile.upsert({
      where: { userId: user.id },
      update: { firstName, lastName, displayName: `Dr. ${firstName} ${lastName}`, designation, specialization: specializationId, hospital, mobile, bio, gender: gender || 'male' },
      create: {
        userId: user.id,
        firstName,
        lastName,
        displayName: `Dr. ${firstName} ${lastName}`,
        designation,
        specialization: specializationId,
        hospital,
        mobile,
        bio,
        gender: gender || 'male',
        avatarData: getDefaultAvatar(gender || 'male'),
      },
    });
    await prisma.activityLog.create({ data: { userId: user.id, action: 'complete_profile', entityType: 'profile', entityId: user.id } });
    res.status(201).json({ status: 'success', data: profile });
  } catch (e: any) {
    res.status(500).json({ status: 'error', message: e.message });
  }
});

// PATCH /api/profile
router.patch('/', requireAuth, async (req: Request, res: Response) => {
  const user = (req as AuthenticatedRequest).user;
  try {
    const { firstName, lastName, designation, specializationId, hospital, mobile, bio, gender } = req.body;
    const profile = await prisma.profile.update({
      where: { userId: user.id },
      data: {
        ...(firstName !== undefined && { firstName }),
        ...(lastName !== undefined && { lastName }),
        ...(firstName !== undefined || lastName !== undefined ? { displayName: `Dr. ${firstName || ''} ${lastName || ''}`.trim() } : {}),
        ...(designation !== undefined && { designation }),
        ...(specializationId !== undefined && { specialization: specializationId }),
        ...(hospital !== undefined && { hospital }),
        ...(mobile !== undefined && { mobile }),
        ...(bio !== undefined && { bio }),
        ...(gender !== undefined && { gender }),
      },
    });
    await prisma.activityLog.create({ data: { userId: user.id, action: 'update_profile', entityType: 'profile', entityId: user.id } });
    res.json({ status: 'success', data: profile });
  } catch (e: any) {
    res.status(500).json({ status: 'error', message: e.message });
  }
});

// POST /api/profile/avatar - upload avatar (base64 stored in DB)
router.post('/avatar', requireAuth, validate(avatarUploadSchema), async (req: Request, res: Response) => {
  const user = (req as AuthenticatedRequest).user;
  try {
    const { imageData } = req.body;
    const profile = await prisma.profile.upsert({
      where: { userId: user.id },
      update: { avatarData: imageData, avatarUrl: null },
      create: { userId: user.id, firstName: '', lastName: '', displayName: '', avatarData: imageData },
    });
    res.json({ status: 'success', data: profile });
  } catch (e: any) {
    res.status(500).json({ status: 'error', message: e.message });
  }
});

export default router;
