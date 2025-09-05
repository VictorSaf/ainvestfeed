export function initWebVitals(report: (name: string, value: number) => void) {
  // Lazy import to avoid adding weight to initial bundle
  import('web-vitals').then(({ onCLS, onFID, onLCP, onTTFB, onINP, onFCP }) => {
    onCLS((m) => report('CLS', m.value));
    onFID((m) => report('FID', m.value));
    onLCP((m) => report('LCP', m.value));
    onTTFB((m) => report('TTFB', m.value));
    // INP + FCP optionally
    if (onINP) (onINP as any)((m: any) => report('INP', m.value));
    if (onFCP) (onFCP as any)((m: any) => report('FCP', m.value));
  }).catch(() => {
    // ignore if not available
  });
}

export function initSentry(dsn?: string) {
  if (!dsn) return;
  // Dynamic import to keep it optional
  import('@sentry/react').then((Sentry) => {
    Sentry.init({ dsn, tracesSampleRate: 0.1 });
  }).catch(() => {
    // ignore; optional
  });
}


