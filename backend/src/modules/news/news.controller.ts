import { Router, Request, Response } from 'express';
import { DataSource } from 'typeorm';
import { z } from 'zod';
import { News } from './news.entity';
import { cache } from '../../utils/cache';

export function createNewsRouter(ds: DataSource): Router {
  const router = Router();
  const repo = ds.getRepository(News);

  router.get('/', async (req: Request, res: Response) => {
    const query = z
      .object({
        page: z.coerce.number().int().min(1).default(1),
        limit: z.coerce.number().int().min(1).max(100).default(20),
        market: z.string().optional(),
        confidence_min: z.coerce.number().int().min(0).max(100).optional(),
      })
      .parse(req.query);

    const where: any = {};
    if (query.market) where.market = query.market;

    const cacheKey = `news:list:${JSON.stringify(query)}`;
    const cached = cache.get<{ items: News[]; total: number }>(cacheKey);
    if (cached) {
      res.setHeader('x-cache', 'HIT');
      return res.status(200).json({
        success: true,
        data: {
          news: cached.items,
          pagination: {
            page: query.page,
            limit: query.limit,
            total: cached.total,
            totalPages: Math.ceil(cached.total / query.limit),
            hasNext: query.page * query.limit < cached.total,
            hasPrev: query.page > 1,
          },
        },
      });
    }

    const [items, total] = await repo.findAndCount({
      where,
      order: { publishedAtSource: 'DESC', createdAt: 'DESC' },
      skip: (query.page - 1) * query.limit,
      take: query.limit,
    });

    cache.set(cacheKey, { items, total }, 5_000);
    res.setHeader('x-cache', 'MISS');

    return res.status(200).json({
      success: true,
      data: {
        news: items,
        pagination: {
          page: query.page,
          limit: query.limit,
          total,
          totalPages: Math.ceil(total / query.limit),
          hasNext: query.page * query.limit < total,
          hasPrev: query.page > 1,
        },
      },
    });
  });

  router.get('/:id', async (req: Request, res: Response) => {
    const id = z.string().uuid().parse(req.params.id);
    const cacheKey = `news:item:${id}`;
    const cached = cache.get<News>(cacheKey);
    if (cached) {
      res.setHeader('x-cache', 'HIT');
      return res.status(200).json({ success: true, data: cached });
    }
    const item = await repo.findOne({ where: { id } });
    if (!item) return res.status(404).json({ success: false, error: { code: 'RESOURCE_NOT_FOUND', message: 'News not found' } });
    cache.set(cacheKey, item, 10_000);
    res.setHeader('x-cache', 'MISS');
    return res.status(200).json({ success: true, data: item });
  });

  return router;
}


