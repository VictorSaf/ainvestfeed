import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import Feed from './Feed';
import { setAccessToken } from '../lib/auth';
import { AuthProvider } from '../contexts/AuthContext';

function renderWithProviders(ui: React.ReactNode) {
  return render(<AuthProvider>{ui}</AuthProvider>);
}

describe('Feed UX', () => {
  afterEach(() => vi.restoreAllMocks());

  it('alerts when bookmarking unauthenticated', async () => {
    const list = { data: { news: [ { id: 'n1', title: 'Item 1' } ] } };
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue({ json: () => Promise.resolve(list) } as any));
    const alertSpy = vi.spyOn(window, 'alert').mockImplementation(() => {});
    renderWithProviders(<Feed />);
    await screen.findByText('Item 1');
    fireEvent.click(screen.getByTestId('bm-n1'));
    await waitFor(() => expect(alertSpy).toHaveBeenCalled());
  });

  // Authenticated toggle covered in Feed.ux.auth.test.tsx
});


