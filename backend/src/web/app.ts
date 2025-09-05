import express, { Request, Response, NextFunction } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import crypto from 'crypto';
import { DataSource } from 'typeorm';
import { createAuthRouter } from '../modules/auth/auth.controller';
import { createUserRouter } from '../modules/users/user.controller';
import { createNewsRouter } from '../modules/news/news.controller';
import { createBookmarkRouter } from '../modules/bookmarks/bookmark.controller';
import { createSearchRouter } from '../modules/search/search.controller';
import { register as metricsRegistry, httpMetrics } from '../observability/metrics';
import * as Sentry from '@sentry/node';
import { config } from '../config/env';
import rateLimit from 'express-rate-limit';
import { createDeviceRouter } from '../modules/devices/device.controller';
import { createSeedRouter } from './dev.seed.routes';

const app = express();

app.use(express.json());
app.use(cors());
app.use(helmet());
app.use(httpMetrics());
// CORS allow-list via env ALLOWED_ORIGINS (comma-separated)
const allowedOrigins = (config.ALLOWED_ORIGINS ?? '').split(',').map((s) => s.trim()).filter(Boolean);
app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin) return callback(null, true);
      if (allowedOrigins.length === 0 || allowedOrigins.includes(origin)) return callback(null, true);
      return callback(new Error('Not allowed by CORS'));
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization']
  })
);
// Global rate limit
app.use(rateLimit({ windowMs: 60_000, max: 1000 }));

// simple request id
app.use((req: Request, _res: Response, next: NextFunction) => {
  (req as Request & { requestId?: string }).requestId = crypto.randomUUID();
  next();
});

app.get('/health', (_req: Request, res: Response) => {
  res.status(200).json({ status: 'ok', service: 'ainvestfeed-api', version: '0.1.0' });
});

export function initRoutes(ds: DataSource) {
  if (config.SENTRY_DSN) {
    Sentry.init({ dsn: config.SENTRY_DSN });
  }
  app.use('/auth', createAuthRouter(ds));
  app.use('/user', createUserRouter(ds));
  app.use('/news', createNewsRouter(ds));
  app.use('/', createBookmarkRouter(ds));
  app.use('/', createSearchRouter(ds));
  app.use('/', createDeviceRouter(ds));
  if (process.env.NODE_ENV !== 'production') {
    app.use('/', createSeedRouter(ds));
  }
  app.get('/metrics', async (_req, res) => {
    res.setHeader('Content-Type', metricsRegistry.contentType);
    res.send(await metricsRegistry.metrics());
  });
}

export { app };


