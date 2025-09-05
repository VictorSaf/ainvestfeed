import { jsx as _jsx } from "react/jsx-runtime";
import { createRoot } from 'react-dom/client';
import './styles.css';
import App from './App';
import { initSentry, initWebVitals } from './lib/observability';
const SENTRY_DSN = import.meta.env?.VITE_SENTRY_DSN;
initSentry(SENTRY_DSN);
initWebVitals((name, value) => {
    // Replace with real endpoint if needed
    // eslint-disable-next-line no-console
    console.debug('[web-vitals]', name, value);
});
createRoot(document.getElementById('root')).render(_jsx(App, {}));
