import 'dotenv/config';
import { DataSourceOptions } from 'typeorm';

const config: DataSourceOptions = {
  type: 'postgres',
  url: process.env.DATABASE_URL,
  synchronize: false,
  logging: false,
  entities: ['dist/modules/**/*.entity.js'],
  migrations: ['dist/db/migrations/*.js']
};

export default config;


