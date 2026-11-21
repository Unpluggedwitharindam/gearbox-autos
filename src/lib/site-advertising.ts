import { applySignals, canTrack, onConsentChange } from './consent';
import { googleTag, installWhatsAppConversions } from './whatsapp-conversion';

const DESTINATIONS = ['AW-18092790399', 'AW-18444054806', 'AW-17787125194'];

/** Existing destinations are preserved; one Google loader is reused for all three. */
export function installSiteAdvertising(): () => void {
  let disposed = false;
  let configured = false;
  const sync = async () => {
    const permitted = await canTrack('advertising');
    if (disposed) return;
    applySignals('advertising', permitted ? 'granted' : 'denied');
    if (!permitted || configured) return;
    const gtag = googleTag();
    if (!gtag) return;
    configured = true;
    gtag('set', 'developer_id.dZjgwMW', true);
    gtag('js', new Date());
    for (const id of DESTINATIONS) gtag('config', id);
    if (!document.querySelector('script[src*="googletagmanager.com/gtag/js"]')) {
      const script = document.createElement('script');
      script.src = `https://www.googletagmanager.com/gtag/js?id=${DESTINATIONS[0]}`;
      script.async = true;
      document.head.appendChild(script);
    }
  };
  void sync();
  const unsubscribe = onConsentChange(() => { void sync(); });
  const uninstallClicks = installWhatsAppConversions();
  return () => { disposed = true; unsubscribe(); uninstallClicks(); };
}
