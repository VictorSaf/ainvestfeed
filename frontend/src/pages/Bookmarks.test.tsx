import { render, screen, waitFor } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import Bookmarks from './Bookmarks';
import { AuthProvider } from '../contexts/AuthContext';

describe('Bookmarks page', () => {
  afterEach(() => vi.restoreAllMocks());

  it('requires login and then lists bookmarks', async () => {
    // not logged in
    vi.spyOn(window.localStorage.__proto__, 'getItem').mockReturnValue(null);
    render(<AuthProvider><Bookmarks /></AuthProvider>);
    expect(screen.getByText(/Please login/)).toBeInTheDocument();

    // logged in
    vi.spyOn(window.localStorage.__proto__, 'getItem').mockReturnValue('token');
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue({ json: () => Promise.resolve({ data: { bookmarks: [ { id: 'b1', news: { id: 'n1', title: 'Saved one' } } ] } }) } as any));
    render(<AuthProvider><Bookmarks /></AuthProvider>);
    await waitFor(() => expect(screen.getByText('Saved one')).toBeInTheDocument());
  });
});


