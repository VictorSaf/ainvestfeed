import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { visualizer } from 'rollup-plugin-visualizer';

export default defineConfig(({ mode }) => ({
  plugins: [
    react(),
    (process.env.ANALYZE || mode === 'analyze') ? visualizer({ filename: 'dist/stats.html', template: 'treemap', gzipSize: true, brotliSize: true }) as any : undefined,
  ].filter(Boolean) as any,
  server: {
    proxy: {
      '/health': 'http://localhost:3002',
      '/news': 'http://localhost:3002',
      '/search': 'http://localhost:3002',
      '/auth': 'http://localhost:3002',
      '/user': 'http://localhost:3002',
      '/__seed': 'http://localhost:3002'
    }
  }
}));


