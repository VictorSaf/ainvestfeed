import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';

vi.mock('../contexts/AuthContext', async (orig) => {
  const m = await (orig as any)();
  return {
    ...m,
    useAuth: () => ({ isAuthenticated: true, token: 'token', login: () => {}, logout: () => {} }),
    AuthProvider: ({ children }: any) => children,
  };
});

import Feed from './Feed';

describe('Feed UX (auth)', () => {
  afterEach(() => vi.restoreAllMocks());

  it('toggles bookmarked state when authenticated', async () => {
    const list = { data: { news: [ { id: 'n1', title: 'Item 1' } ] } };
    const bookmarks = { data: { bookmarks: [] } };
    const fetchMock = vi.fn((url: string, opts?: any) => {
      if (url.startsWith('/news?')) return Promise.resolve({ json: () => Promise.resolve(list) } as any);
      if (url === '/user/bookmarks') return Promise.resolve({ json: () => Promise.resolve(bookmarks) } as any);
      if (url.includes('/bookmark')) return Promise.resolve({ ok: true, json: () => Promise.resolve({ success: true, data: { bookmarked: true } }) } as any);
      return Promise.resolve({ json: () => Promise.resolve({}) } as any);
    });
    vi.stubGlobal('fetch', fetchMock as any);

    render(<Feed />);
    await screen.findByText('Item 1');
    const btn = await screen.findByTestId('bm-n1');
    fireEvent.click(btn);
    await waitFor(() => {
      const called = (fetchMock as any).mock?.calls?.some((c: any[]) => typeof c[0] === 'string' && c[0].includes('/news/n1/bookmark'));
      expect(called).toBe(true);
    });
  });
});


