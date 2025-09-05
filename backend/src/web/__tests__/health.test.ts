import request from 'supertest';
import { app } from '../app';

describe('GET /health', () => {
  it('returns 200 and expected payload quickly', async () => {
    const start = Date.now();
    const res = await request(app).get('/health');
    const duration = Date.now() - start;

    expect(res.status).toBe(200);
    expect(res.body).toMatchObject({ status: 'ok', service: 'ainvestfeed-api' });
    expect(duration).toBeLessThan(2000);
  });
});


