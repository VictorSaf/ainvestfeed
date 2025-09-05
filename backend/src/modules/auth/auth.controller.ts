import { Router, Request, Response } from 'express';
import { DataSource } from 'typeorm';
import { z } from 'zod';
import { User } from '../users/user.entity';
import { UserSession } from '../users/user-session.entity';
import { hashPassword, verifyPassword, sha256 } from '../../utils/hash';
import { signAccessToken, signRefreshToken, verifyRefreshToken } from './jwt';

export function createAuthRouter(ds: DataSource): Router {
  const router = Router();
  const users = ds.getRepository(User);
  const sessions = ds.getRepository(UserSession);

  router.post('/register', async (req: Request, res: Response) => {
    const body = z
      .object({ email: z.string().email(), password: z.string().min(8), firstName: z.string().optional(), lastName: z.string().optional() })
      .parse(req.body);

    const existing = await users.findOne({ where: { email: body.email } });
    if (existing) return res.status(409).json({ success: false, error: { code: 'DUPLICATE_RESOURCE', message: 'Email already in use' } });

    const user = users.create({ email: body.email, passwordHash: await hashPassword(body.password) });
    await users.save(user);
    return res.status(201).json({ success: true, data: { user: { id: user.id, email: user.email, role: user.role } } });
  });

  router.post('/login', async (req: Request, res: Response) => {
    const body = z.object({ email: z.string().email(), password: z.string().min(8) }).parse(req.body);
    const user = await users.findOne({ where: { email: body.email } });
    if (!user) return res.status(401).json({ success: false, error: { code: 'AUTHENTICATION_REQUIRED', message: 'Invalid credentials' } });
    const ok = await verifyPassword(body.password, user.passwordHash);
    if (!ok) return res.status(401).json({ success: false, error: { code: 'AUTHENTICATION_REQUIRED', message: 'Invalid credentials' } });

    const accessToken = signAccessToken({ sub: user.id, email: user.email, role: user.role });
    const refreshToken = signRefreshToken({ sub: user.id });

    const session = sessions.create({
      user,
      tokenHash: sha256(accessToken),
      refreshTokenHash: sha256(refreshToken),
      expiresAt: new Date(Date.now() + 1000 * 60 * 60 * 24 * 30),
    });
    await sessions.save(session);

    return res.status(200).json({ success: true, data: { user: { id: user.id, email: user.email, role: user.role }, tokens: { accessToken, refreshToken } } });
  });

  router.post('/refresh', async (req: Request, res: Response) => {
    const body = z.object({ refreshToken: z.string().min(10) }).parse(req.body);
    try {
      // Validate refresh token; payload is not needed here
      verifyRefreshToken(body.refreshToken);
    } catch {
      return res.status(401).json({ success: false, error: { code: 'AUTHENTICATION_REQUIRED', message: 'Invalid token' } });
    }

    const session = await sessions.findOne({ where: { refreshTokenHash: sha256(body.refreshToken) }, relations: ['user'] });
    if (!session || !session.user) return res.status(401).json({ success: false, error: { code: 'AUTHENTICATION_REQUIRED', message: 'Invalid session' } });

    const user = session.user;
    const accessToken = signAccessToken({ sub: user.id, email: user.email, role: user.role });
    return res.status(200).json({ success: true, data: { tokens: { accessToken } } });
  });

  router.post('/logout', async (req: Request, res: Response) => {
    const body = z.object({ refreshToken: z.string().min(10) }).parse(req.body);
    const hash = sha256(body.refreshToken);
    await sessions.delete({ refreshTokenHash: hash });
    return res.status(200).json({ success: true, message: 'Logged out' });
  });

  return router;
}


