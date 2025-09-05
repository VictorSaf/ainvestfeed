import { getAccessToken } from './auth';

export async function apiFetch(path: string, options: RequestInit = {}) {
  const headers = new Headers(options.headers || {});
  const token = getAccessToken();
  if (token) headers.set('Authorization', `Bearer ${token}`);
  headers.set('Content-Type', 'application/json');
  const base = (import.meta as any).env?.VITE_API_BASE_URL || '';
  const url = base ? `${base}${path}` : path;
  const res = await fetch(url, { ...options, headers });
  return res;
}


