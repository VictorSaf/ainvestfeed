import { NextFunction, Request, Response } from 'express';
import { verifyAccessToken } from './jwt';

export interface AuthenticatedRequest extends Request {
  user?: { id: string; email: string; role: string };
}

export function requireAuth(req: AuthenticatedRequest, res: Response, next: NextFunction) {
  const header = req.headers.authorization;
  if (!header || !header.startsWith('Bearer ')) {
    return res.status(401).json({ success: false, error: { code: 'AUTHENTICATION_REQUIRED', message: 'Missing token' } });
  }
  const token = header.substring('Bearer '.length).trim();
  try {
    const payload = verifyAccessToken(token);
    req.user = { id: payload.sub, email: payload.email, role: payload.role };
    next();
  } catch {
    return res.status(401).json({ success: false, error: { code: 'AUTHENTICATION_REQUIRED', message: 'Invalid token' } });
  }
}


