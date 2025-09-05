import 'reflect-metadata';
import { DataSource } from 'typeorm';
import { config } from '../config/env';

// Entities will be added here progressively
import { User } from '../modules/users/user.entity';
import { UserSession } from '../modules/users/user-session.entity';
import { News } from '../modules/news/news.entity';
import { ScrapingConfig } from '../modules/scraping/scraping-config.entity';
import { ScrapingRun } from '../modules/scraping/scraping-run.entity';
import { AnalysisSummary } from '../modules/analysis/analysis-summary.entity';
import { AnalysisDetail } from '../modules/analysis/analysis-detail.entity';
import { Bookmark } from '../modules/bookmarks/bookmark.entity';
import { Device } from '../modules/devices/device.entity';

export const AppDataSource = new DataSource({
  type: 'postgres',
  url: process.env.DATABASE_URL,
  synchronize: false,
  logging: config.NODE_ENV !== 'production' ? ['error'] : false,
  entities: [User, UserSession, News, ScrapingConfig, ScrapingRun, AnalysisSummary, AnalysisDetail, Bookmark, Device],
  migrations: ['dist/db/migrations/*.js'],
});

// default export removed to ensure a single DataSource export for TypeORM CLI


