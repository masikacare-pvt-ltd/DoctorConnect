import { Request, Response, NextFunction } from 'express';
import { auth } from '../config/auth';
import { prisma } from '../config/prisma';

export interface AuthenticatedRequest extends Request {
  user: { id: string; name: string; email: string; image?: string | null; role: string; approvalStatus: string };
  session: { id: string };
}

export const requireAuth = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const session = await auth.api.getSession({ headers: req.headers as any });
    if (!session?.user) {
      return res.status(401).json({ status: 'error', message: 'Unauthorized' });
    }
    // Fetch full user from DB to include custom fields
    const dbUser = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: { id: true, name: true, email: true, image: true, role: true, approvalStatus: true },
    });
    if (!dbUser) {
      return res.status(401).json({ status: 'error', message: 'User not found' });
    }
    (req as AuthenticatedRequest).user = dbUser as any;
    (req as AuthenticatedRequest).session = session.session as any;
    next();
  } catch {
    res.status(401).json({ status: 'error', message: 'Unauthorized' });
  }
};

export const requireRole = (...roles: string[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    const user = (req as AuthenticatedRequest).user;
    if (!user || !roles.includes(user.role)) {
      return res.status(403).json({ status: 'error', message: 'Forbidden: insufficient permissions' });
    }
    next();
  };
};

export const requireApproved = (req: Request, res: Response, next: NextFunction) => {
  const user = (req as AuthenticatedRequest).user;
  if (!user) {
    return res.status(401).json({ status: 'error', message: 'Unauthorized' });
  }
  if (user.approvalStatus !== 'approved') {
    return res.status(403).json({
      status: 'error',
      message: user.approvalStatus === 'pending'
        ? 'Account pending approval. Please wait for admin approval.'
        : 'Account rejected. Contact administrator.',
    });
  }
  next();
};