import { Router, Request, Response } from 'express';
import { prisma } from '../config/prisma';
import { requireAdmin } from '../middlewares/adminAuth';
import { getDefaultAvatar } from '../utils/avatar';

const router = Router();

// All admin routes require admin token
router.use(requireAdmin);

function getAuthorAvatar(author: any): string {
  if (author.profile?.avatarData) return author.profile.avatarData;
  if (author.profile?.avatarUrl) return author.profile.avatarUrl;
  if (author.image) return author.image;
  return getDefaultAvatar(author.profile?.gender);
}

// ==================== DOCTORS ====================

// GET /api/admin/doctors - list all doctors with profile info
router.get('/doctors', async (req: Request, res: Response) => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 50;
    const search = (req.query.search as string) || '';
    const status = (req.query.status as string) || '';
    const sortBy = (req.query.sortBy as string) || 'createdAt';
    const sortOrder = (req.query.sortOrder as string) || 'desc';

    const where: any = { role: 'doctor' };
    if (status) where.approvalStatus = status;
    if (search) {
      where.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { email: { contains: search, mode: 'insensitive' } },
      ];
    }

    const orderBy: any = {};
    orderBy[sortBy] = sortOrder;

    const [doctors, total] = await Promise.all([
      prisma.user.findMany({
        where,
        include: { profile: true },
        orderBy,
        skip: (page - 1) * limit,
        take: limit,
      }),
      prisma.user.count({ where }),
    ]);

    const formatted = doctors.map((d) => ({
      id: d.id,
      name: d.name,
      email: d.email,
      role: d.role,
      approvalStatus: d.approvalStatus,
      createdAt: d.createdAt,
      profile: d.profile ? {
        firstName: d.profile.firstName,
        lastName: d.profile.lastName,
        displayName: d.profile.displayName,
        avatarData: d.profile.avatarData || getDefaultAvatar(d.profile.gender || 'male'),
        designation: d.profile.designation,
        specialization: d.profile.specialization,
        hospital: d.profile.hospital,
        mobile: d.profile.mobile,
        countryCode: d.profile.countryCode,
        countryIso: d.profile.countryIso,
        bio: d.profile.bio,
      } : null,
    }));

    res.json({ status: 'success', data: formatted, total, page, limit });
  } catch (e: any) {
    res.status(500).json({ status: 'error', message: e.message });
  }
});

// GET /api/admin/doctors/:id - get single doctor details
router.get('/doctors/:id', async (req: Request, res: Response) => {
  try {
    const id = req.params.id as string;
    const doctor = await prisma.user.findFirst({
      where: { id, role: 'doctor' },
      include: { profile: true },
    });
    if (!doctor) return res.status(404).json({ status: 'error', message: 'Doctor not found' });
    res.json({ status: 'success', data: doctor });
  } catch (e: any) {
    res.status(500).json({ status: 'error', message: e.message });
  }
});

// PATCH /api/admin/doctors/:id/approve - approve a doctor
router.patch('/doctors/:id/approve', async (req: Request, res: Response) => {
  try {
    const id = req.params.id as string;
    const doctor = await prisma.user.findFirst({
      where: { id, role: 'doctor' },
    });
    if (!doctor) return res.status(404).json({ status: 'error', message: 'Doctor not found' });
    await prisma.user.update({ where: { id }, data: { approvalStatus: 'approved' } });
    res.json({ status: 'success', message: 'Doctor approved successfully' });
  } catch (e: any) {
    res.status(500).json({ status: 'error', message: e.message });
  }
});

// PATCH /api/admin/doctors/:id/reject - reject a doctor
router.patch('/doctors/:id/reject', async (req: Request, res: Response) => {
  try {
    const id = req.params.id as string;
    const doctor = await prisma.user.findFirst({
      where: { id, role: 'doctor' },
    });
    if (!doctor) return res.status(404).json({ status: 'error', message: 'Doctor not found' });
    await prisma.user.update({ where: { id }, data: { approvalStatus: 'rejected' } });
    res.json({ status: 'success', message: 'Doctor rejected' });
  } catch (e: any) {
    res.status(500).json({ status: 'error', message: e.message });
  }
});

// ==================== STATS ====================

// GET /api/admin/stats - dashboard statistics
router.get('/stats', async (_req: Request, res: Response) => {
  try {
    const [totalDoctors, pendingApprovals, approvedDoctors, totalCases, recycleBinCount] = await Promise.all([
      prisma.user.count({ where: { role: 'doctor' } }),
      prisma.user.count({ where: { role: 'doctor', approvalStatus: 'pending' } }),
      prisma.user.count({ where: { role: 'doctor', approvalStatus: 'approved' } }),
      prisma.clinicalCase.count({ where: { deletedAt: null } }),
      prisma.clinicalCase.count({ where: { deletedAt: { not: null } } }),
    ]);

    res.json({
      status: 'success',
      data: {
        totalDoctors,
        pendingApprovals,
        approvedDoctors,
        totalCases,
        recycleBinCount,
      },
    });
  } catch (e: any) {
    res.status(500).json({ status: 'error', message: e.message });
  }
});

// ==================== CASES ====================

// GET /api/admin/cases - list all cases
router.get('/cases', async (req: Request, res: Response) => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 20;
    const search = (req.query.search as string) || '';

    const where: any = { deletedAt: null };
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

// GET /api/admin/cases/:id - single case with comments
router.get('/cases/:id', async (req: Request, res: Response) => {
  try {
    const id = req.params.id as string;
    const c = await prisma.clinicalCase.findFirst({
      where: { id, deletedAt: null },
      include: {
        author: { include: { profile: true } },
        images: { orderBy: { createdAt: 'asc' } },
        aiReport: true,
        comments: {
          include: { author: { include: { profile: true } } },
          orderBy: { createdAt: 'asc' },
        },
        _count: { select: { comments: true, likes: true } },
      },
    });
    if (!c) return res.status(404).json({ status: 'error', message: 'Case not found' });

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
        coverImage: null,
        viewsCount: c.viewsCount,
        commentsCount: c._count.comments,
        likesCount: c._count.likes,
        createdAt: c.createdAt,
        updatedAt: c.updatedAt,
        images: c.images.map((i) => ({
          id: i.id,
          downloadURL: i.imageData || i.secureUrl || '',
        })),
        aiReport: c.aiReport ? {
          id: c.aiReport.id,
          summary: c.aiReport.summary,
          aiResponse: c.aiReport.aiResponse,
          confidence: c.aiReport.confidence,
          findings: c.aiReport.findings,
          severity: c.aiReport.severity,
          status: c.aiReport.status,
          createdAt: c.aiReport.createdAt,
        } : null,
        comments: c.comments.map((co) => ({
          id: co.id,
          caseId: co.caseId,
          authorId: co.authorId,
          authorName: co.author.profile?.displayName || co.author.name,
          authorAvatar: getAuthorAvatar(co.author),
          content: co.content,
          createdAt: co.createdAt,
        })),
      },
    });
  } catch (e: any) {
    res.status(500).json({ status: 'error', message: e.message });
  }
});

// ==================== REPORTS ====================

// ==================== RECYCLE BIN ====================

// GET /api/admin/recycle-bin - list soft-deleted cases
router.get('/recycle-bin', async (req: Request, res: Response) => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 20;

    const where = { deletedAt: { not: null } };

    const [cases, total] = await Promise.all([
      prisma.clinicalCase.findMany({
        where,
        include: {
          author: { include: { profile: true } },
          images: { take: 1, orderBy: { createdAt: 'asc' } },
          _count: { select: { comments: true, likes: true } },
        },
        orderBy: { deletedAt: 'desc' },
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
      authorAvatar: c.author.profile?.avatarData || c.author.image || '',
      specialization: c.specialization,
      urgent: c.urgent,
      status: c.status,
      coverImage: c.images[0]?.imageData || c.images[0]?.secureUrl || null,
      viewsCount: c.viewsCount,
      commentsCount: c._count.comments,
      likesCount: c._count.likes,
      createdAt: c.createdAt,
      deletedAt: c.deletedAt,
    }));

    res.json({ status: 'success', data: formatted, total, page, limit });
  } catch (e: any) {
    res.status(500).json({ status: 'error', message: e.message });
  }
});

// POST /api/admin/cases/:id/restore - restore a soft-deleted case
router.post('/cases/:id/restore', async (req: Request, res: Response) => {
  try {
    const id = req.params.id as string;
    const c = await prisma.clinicalCase.findUnique({ where: { id } });
    if (!c) return res.status(404).json({ status: 'error', message: 'Case not found' });
    if (!c.deletedAt) return res.status(400).json({ status: 'error', message: 'Case is not deleted' });
    await prisma.clinicalCase.update({ where: { id }, data: { deletedAt: null } });
    res.json({ status: 'success', message: 'Case restored' });
  } catch (e: any) {
    res.status(500).json({ status: 'error', message: e.message });
  }
});

// ==================== DELETE ====================

// DELETE /api/admin/users/:id - delete any user (with cascade)
router.delete('/users/:id', async (req: Request, res: Response) => {
  try {
    const id = req.params.id as string;
    const user = await prisma.user.findUnique({ where: { id } });
    if (!user) return res.status(404).json({ status: 'error', message: 'User not found' });
    await prisma.user.delete({ where: { id } });
    res.json({ status: 'success', message: 'User deleted' });
  } catch (e: any) {
    res.status(500).json({ status: 'error', message: e.message });
  }
});

// DELETE /api/admin/cases/:id - hard delete any case
router.delete('/cases/:id', async (req: Request, res: Response) => {
  try {
    const id = req.params.id as string;
    const c = await prisma.clinicalCase.findUnique({ where: { id } });
    if (!c) return res.status(404).json({ status: 'error', message: 'Case not found' });
    await prisma.clinicalCase.delete({ where: { id } });
    res.json({ status: 'success', message: 'Case deleted' });
  } catch (e: any) {
    res.status(500).json({ status: 'error', message: e.message });
  }
});

// DELETE /api/admin/reports/:id - hard delete any AI report
router.delete('/reports/:id', async (req: Request, res: Response) => {
  try {
    const id = req.params.id as string;
    const report = await prisma.aIReport.findUnique({ where: { id } });
    if (!report) return res.status(404).json({ status: 'error', message: 'Report not found' });
    await prisma.aIReport.delete({ where: { id } });
    res.json({ status: 'success', message: 'Report deleted' });
  } catch (e: any) {
    res.status(500).json({ status: 'error', message: e.message });
  }
});

// ==================== REPORTS ====================

// GET /api/admin/reports - list all AI reports
router.get('/reports', async (req: Request, res: Response) => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 20;

    const [reports, total] = await Promise.all([
      prisma.aIReport.findMany({
        include: {
          case: {
            select: {
              id: true,
              caseNumber: true,
              title: true,
              authorId: true,
              specialization: true,
            },
          },
        },
        orderBy: { createdAt: 'desc' },
        skip: (page - 1) * limit,
        take: limit,
      }),
      prisma.aIReport.count(),
    ]);

    const formatted = reports.map((r) => ({
      id: r.id,
      caseId: r.caseId,
      caseNumber: r.case.caseNumber,
      caseTitle: r.case.title,
      specialization: r.case.specialization,
      summary: r.summary,
      severity: r.severity,
      confidence: r.confidence,
      status: r.status,
      createdAt: r.createdAt,
    }));

    res.json({ status: 'success', data: formatted, total, page, limit });
  } catch (e: any) {
    res.status(500).json({ status: 'error', message: e.message });
  }
});

export default router;
