import { canTrack } from './consent';

export const WHATSAPP_CONVERSION = {
  send_to: 'AW-17787125194/GZ3mCIm30LwdEMr7x6FC',
  value: 1.0,
  currency: 'INR',
} as const;
export const WHATSAPP_FALLBACK_MS = 800;

type Gtag = (...args: unknown[]) => void;
export function googleTag(): Gtag | undefined {
  return (window as unknown as { gtag?: Gtag }).gtag;
}

export function isTrackedWhatsAppUrl(href: string): boolean {
  try {
    const url = new URL(href);
    return url.protocol === 'https:' && url.hostname === 'wa.me' && !url.port &&
      !url.username && !url.password && url.pathname === '/919065591253';
  } catch { return false; }
}

/** One delegated handler covers nested icons and future links without changing their markup. */
export function installWhatsAppConversions(): () => void {
  const handled = new WeakSet<Event>();
  const onClick = (event: MouseEvent) => {
    if (handled.has(event) || event.defaultPrevented || event.button !== 0) return;
    const target = event.target instanceof Element ? event.target : null;
    const anchor = target?.closest('a[href]');
    if (!(anchor instanceof HTMLAnchorElement) || anchor.hasAttribute('download') ||
      !isTrackedWhatsAppUrl(anchor.href)) return;
    handled.add(event);
    const href = anchor.href;
    const newTab = anchor.target === '_blank' || event.ctrlKey || event.metaKey || event.shiftKey;
    // Reserve the tab within the original gesture; opening after the async callback is blocked by browsers.
    const tab = newTab ? window.open('', '_blank') : null;
    if (tab) tab.opener = null;
    const canDelay = !newTab || tab !== null;
    if (canDelay) event.preventDefault();
    let finished = false;
    const navigate = () => {
      if (finished) return;
      finished = true;
      window.clearTimeout(timeout);
      if (!canDelay) return; // Preserve normal link navigation when popups are unavailable.
      if (tab && !tab.closed) tab.location.replace(href);
      else if (!newTab) window.location.assign(href);
    };
    const timeout = window.setTimeout(navigate, WHATSAPP_FALLBACK_MS);
    void canTrack('advertising').then(async (allowed) => {
      // Re-read after lookup: refusal/withdrawal wins, and a timed-out click is never replayed.
      if (!allowed || finished || !(await canTrack('advertising'))) { navigate(); return; }
      const gtag = googleTag();
      if (!gtag) { navigate(); return; }
      try {
        gtag('event', 'conversion', {
          ...WHATSAPP_CONVERSION,
          event_callback: navigate,
          event_timeout: WHATSAPP_FALLBACK_MS,
        });
      } catch { navigate(); }
    }).catch(navigate);
  };
  document.addEventListener('click', onClick);
  return () => document.removeEventListener('click', onClick);
}
