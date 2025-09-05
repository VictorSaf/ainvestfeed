import React from 'react';
import { createRoot } from 'react-dom/client';
import './styles.css';
import App from './App';
import { initSentry, initWebVitals } from './lib/observability';

const SENTRY_DSN = (import.meta as any).env?.VITE_SENTRY_DSN as string | undefined;
initSentry(SENTRY_DSN);
initWebVitals((name, value) => {
  // Replace with real endpoint if needed
  // eslint-disable-next-line no-console
  console.debug('[web-vitals]', name, value);
});

createRoot(document.getElementById('root')!).render(<App />);


