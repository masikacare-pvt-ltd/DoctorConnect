import { Request, Response, NextFunction } from 'express';
import { auth } from '../config/auth';

export interface AuthenticatedRequest extends Request {
  user: { id: string; name: string; email: string; image?: string | null };
  session: { id: string };
}

export const requireAuth = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const session = await auth.api.getSession({ headers: req.headers as any });
    if (!session?.user) {
      return res.status(401).json({ status: 'error', message: 'Unauthorized' });
    }
    (req as AuthenticatedRequest).user = session.user as any;
    (req as AuthenticatedRequest).session = session.session as any;
    next();
  } catch {
    res.status(401).json({ status: 'error', message: 'Unauthorized' });
  }
};
