import { Router, Request, Response } from 'express';
import { DataSource } from 'typeorm';
import { z } from 'zod';
import { News } from '../news/news.entity';

export function createSearchRouter(ds: DataSource): Router {
  const router = Router();
  const repo = ds.getRepository(News);

  router.get('/search', async (req: Request, res: Response) => {
    const query = z
      .object({
        q: z.string().min(1),
        limit: z.coerce.number().int().min(1).max(50).default(20),
        market: z.string().optional(),
      })
      .safeParse(req.query);

    if (!query.success) {
      return res.status(400).json({ success: false, error: { code: 'VALIDATION_ERROR', message: 'Invalid query' } });
    }

    const { q, limit, market } = query.data;
    const qb = repo
      .createQueryBuilder('n')
      .where('(n.title ILIKE :q OR n.content_clean ILIKE :q)', { q: `%${q}%` })
      .orderBy('n.published_at_source', 'DESC', 'NULLS LAST')
      .addOrderBy('n.created_at', 'DESC')
      .limit(limit);

    if (market) qb.andWhere('n.market = :market', { market });

    const results = await qb.getMany();
    return res.status(200).json({ success: true, data: { results, totalResults: results.length, query: q } });
  });

  return router;
}


