import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import Profile from './Profile';

vi.mock('../contexts/AuthContext', () => ({
  useAuth: () => ({ isAuthenticated: true, token: 't', login: () => {}, logout: () => {} }),
  AuthProvider: ({ children }: any) => children,
}));

describe('Profile page', () => {
  afterEach(() => vi.restoreAllMocks());

  it('loads and saves profile', async () => {
    const fetchMock = vi.fn((url: string, opts?: any) => {
      if (url === '/user/profile' && (!opts || !opts.method)) return Promise.resolve({ json: () => Promise.resolve({ data: { email: 'u@example.com', firstName: 'John', lastName: 'Doe', language: 'en', timezone: 'UTC' } }) } as any);
      if (url === '/user/profile' && opts?.method === 'PUT') return Promise.resolve({ ok: true, json: () => Promise.resolve({ success: true }) } as any);
      return Promise.resolve({ json: () => Promise.resolve({}) } as any);
    });
    vi.stubGlobal('fetch', fetchMock as any);

    render(<Profile />);
    await screen.findByDisplayValue('u@example.com');
    fireEvent.change(screen.getByTestId('firstName'), { target: { value: 'Jane' } });
    fireEvent.click(screen.getByTestId('save'));
    await waitFor(() => expect(screen.getByTestId('saved')).toBeInTheDocument());
  });
});


