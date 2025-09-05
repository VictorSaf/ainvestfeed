import { Router, Response } from 'express';
import { DataSource } from 'typeorm';
import { z } from 'zod';
import { requireAuth, AuthenticatedRequest } from '../auth/requireAuth';
import { User } from './user.entity';

export function createUserRouter(ds: DataSource): Router {
  const router = Router();
  const users = ds.getRepository(User);

  router.get('/profile', requireAuth, async (req: AuthenticatedRequest, res: Response) => {
    const current = await users.findOneByOrFail({ id: req.user!.id });
    return res.status(200).json({
      success: true,
      data: {
        user: {
          id: current.id,
          email: current.email,
          role: current.role,
          firstName: current.firstName,
          lastName: current.lastName,
          language: current.language,
          timezone: current.timezone,
        },
      },
    });
  });

  router.put('/profile', requireAuth, async (req: AuthenticatedRequest, res: Response) => {
    const body = z
      .object({
        firstName: z.string().max(100).optional(),
        lastName: z.string().max(100).optional(),
        language: z.string().max(10).optional(),
        timezone: z.string().max(64).optional(),
      })
      .parse(req.body);

    await users.update({ id: req.user!.id }, body);
    const updated = await users.findOneByOrFail({ id: req.user!.id });
    return res.status(200).json({ success: true, data: { user: updated } });
  });

  return router;
}


