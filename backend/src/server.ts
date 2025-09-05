import http from 'http';
import { app, initRoutes } from './web/app';
import { AppDataSource } from './db/data-source';

const PORT = process.env.PORT ? Number(process.env.PORT) : 3001;

const server = http.createServer(app);

AppDataSource.initialize()
  .then(() => {
    initRoutes(AppDataSource);
    server.listen(PORT, () => {
      console.log(`API listening on port ${PORT}`);
    });
  })
  .catch((err: unknown) => {
    console.error('Failed to init datasource', err);
    process.exit(1);
  });

export default server;


