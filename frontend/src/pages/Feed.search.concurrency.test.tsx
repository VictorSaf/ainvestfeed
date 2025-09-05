import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import Feed from './Feed';
import { AuthProvider } from '../contexts/AuthContext';

function renderWithProviders(ui: React.ReactNode) {
  return render(<AuthProvider>{ui}</AuthProvider>);
}

describe('Feed search concurrency', () => {
  afterEach(() => vi.restoreAllMocks());

  it('latest search wins while previous is aborted', async () => {
    const slow = new Promise((resolve) => setTimeout(() => resolve({ json: () => Promise.resolve({ data: { results: [{ id: 's1', title: 'SLOW' }] } }) } as any), 50));
    const fast = Promise.resolve({ json: () => Promise.resolve({ data: { results: [{ id: 's2', title: 'FAST' }] } }) } as any);
    const fetchMock = vi.fn((url: string) => {
      if (url.startsWith('/search') && url.includes('slow')) return slow as any;
      if (url.startsWith('/search') && url.includes('fast')) return fast as any;
      return Promise.resolve({ json: () => Promise.resolve({ data: { news: [] } }) } as any);
    });
    vi.stubGlobal('fetch', fetchMock as any);

    renderWithProviders(<Feed />);
    const input = await screen.findByTestId('search-box');
    const button = screen.getByTestId('search-button');

    fireEvent.change(input, { target: { value: 'slow' } });
    fireEvent.click(button);
    fireEvent.change(input, { target: { value: 'fast' } });
    fireEvent.click(button);

    await waitFor(() => expect(screen.getByText('FAST')).toBeInTheDocument());
    expect(screen.queryByText('SLOW')).not.toBeInTheDocument();
  });
});


