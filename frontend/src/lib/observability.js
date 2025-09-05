export function initWebVitals(report) {
    // Lazy import to avoid adding weight to initial bundle
    import('web-vitals').then(({ onCLS, onFID, onLCP, onTTFB, onINP, onFCP }) => {
        onCLS((m) => report('CLS', m.value));
        onFID((m) => report('FID', m.value));
        onLCP((m) => report('LCP', m.value));
        onTTFB((m) => report('TTFB', m.value));
        // INP + FCP optionally
        if (onINP)
            onINP((m) => report('INP', m.value));
        if (onFCP)
            onFCP((m) => report('FCP', m.value));
    }).catch(() => {
        // ignore if not available
    });
}
export function initSentry(dsn) {
    if (!dsn)
        return;
    // Dynamic import to keep it optional
    import('@sentry/react').then((Sentry) => {
        Sentry.init({ dsn, tracesSampleRate: 0.1 });
    }).catch(() => {
        // ignore; optional
    });
}
