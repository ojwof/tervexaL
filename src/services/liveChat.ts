import { SMARTSUPP_KEY, isAdminPathname } from '../config/brand';

declare global {
  interface Window {
    _smartsupp?: Record<string, unknown>;
    smartsupp?: ((...args: unknown[]) => void) & { _?: unknown[] };
  }
}

// Smartsupp's official loader snippet, injected at runtime so it can be skipped on the admin
// console (the admin path and #/admin share index.html with the public site). The script is
// async and loads after the app, so it never blocks the first paint.
export function loadLiveChat(): void {
  if (typeof window === 'undefined' || !SMARTSUPP_KEY) return;
  if (isAdminPathname(window.location.pathname) || window.location.hash.startsWith('#/admin')) return;
  if (window.smartsupp) return;

  window._smartsupp = window._smartsupp || {};
  window._smartsupp.key = SMARTSUPP_KEY;

  const queue: unknown[] = [];
  const smartsupp = Object.assign((...args: unknown[]) => { queue.push(args); }, { _: queue });
  window.smartsupp = smartsupp;

  const script = document.createElement('script');
  script.type = 'text/javascript';
  script.charset = 'utf-8';
  script.async = true;
  script.src = 'https://www.smartsuppchat.com/loader.js?';
  document.head.appendChild(script);
}
