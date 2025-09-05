import { jsx as _jsx } from "react/jsx-runtime";
import { render, screen, waitFor } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import App from './App';
describe('App', () => {
    afterEach(() => {
        vi.restoreAllMocks();
    });
    it('shows backend health', async () => {
        vi.stubGlobal('fetch', vi.fn().mockResolvedValue({ json: () => Promise.resolve({ status: 'ok' }) }));
        render(_jsx(App, {}));
        await waitFor(() => expect(screen.getByTestId('health').textContent).toBe('ok'));
    });
});
