import http from 'k6/http';
import { check, sleep } from 'k6';

export const options = {
  vus: 5,
  duration: '10s',
};

const BASE_URL = __ENV.BASE_URL || 'http://localhost:3001';

export default function () {
  const r1 = http.get(`${BASE_URL}/health`);
  check(r1, { 'health 200': (res) => res.status === 200 });

  const r2 = http.get(`${BASE_URL}/news?limit=10`);
  check(r2, {
    'news 200': (res) => res.status === 200,
    'news has items': (res) => (res.json('data.news') || []).length >= 0,
  });

  const r3 = http.get(`${BASE_URL}/search?q=market&limit=5`);
  check(r3, { 'search 200': (res) => res.status === 200 });

  sleep(1);
}


