import { defineConfig } from '@playwright/test';

export default defineConfig({
  testDir: './tests',
  retries: process.env.CI ? 2 : 0,
  use: {
    baseURL: process.env.BASE_URL || 'http://localhost:5173',
    headless: true,
  },
  webServer: [
    {
      command: process.env.WEB_COMMAND || 'npm run build && npm run preview',
      cwd: '../frontend',
      port: Number(new URL(process.env.BASE_URL || 'http://localhost:5173').port || 5173),
      reuseExistingServer: !process.env.CI,
    },
  ],
});


