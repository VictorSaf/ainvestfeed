import { jsx as _jsx } from "react/jsx-runtime";
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import Feed from './Feed';
import { AuthProvider } from '../contexts/AuthContext';
function renderWithProviders(ui) {
    return render(_jsx(AuthProvider, { children: ui }));
}
describe('Feed UX', () => {
    afterEach(() => vi.restoreAllMocks());
    it('alerts when bookmarking unauthenticated', async () => {
        const list = { data: { news: [{ id: 'n1', title: 'Item 1' }] } };
        vi.stubGlobal('fetch', vi.fn().mockResolvedValue({ json: () => Promise.resolve(list) }));
        const alertSpy = vi.spyOn(window, 'alert').mockImplementation(() => { });
        renderWithProviders(_jsx(Feed, {}));
        await screen.findByText('Item 1');
        fireEvent.click(screen.getByTestId('bm-n1'));
        await waitFor(() => expect(alertSpy).toHaveBeenCalled());
    });
    // Authenticated toggle covered in Feed.ux.auth.test.tsx
});
