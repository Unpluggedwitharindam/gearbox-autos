import { beforeEach, afterEach, describe, expect, it, vi } from 'vitest';
const { permission } = vi.hoisted(() => ({ permission: vi.fn() }));
vi.mock('./consent', () => ({ canTrack: permission }));
import { installWhatsAppConversions, isTrackedWhatsAppUrl, WHATSAPP_FALLBACK_MS } from './whatsapp-conversion';

const gtag = vi.fn();
const assign = vi.fn();
const replace = vi.fn();
let listener: (event: object) => void;
class Anchor {
  target = '_blank'; href = 'https://wa.me/919065591253';
  hasAttribute() { return false; }
  closest() { return this; }
}
const click = (href = 'https://wa.me/919065591253', target = '_blank') => {
  const anchor = new Anchor(); anchor.href = href; anchor.target = target;
  return { target: anchor, button: 0, defaultPrevented: false, preventDefault() { this.defaultPrevented = true; } };
};
const flush = async () => { await Promise.resolve(); await Promise.resolve(); await Promise.resolve(); };
beforeEach(() => {
  vi.useFakeTimers(); permission.mockReset().mockResolvedValue(true); gtag.mockReset(); assign.mockReset(); replace.mockReset();
  vi.stubGlobal('Element', Anchor); vi.stubGlobal('HTMLAnchorElement', Anchor);
  vi.stubGlobal('window', { gtag, open: vi.fn(() => ({ opener: {}, closed: false, location: { replace } })), location: { assign }, setTimeout, clearTimeout });
  vi.stubGlobal('document', { addEventListener: vi.fn((_type, fn) => { listener = fn; }), removeEventListener: vi.fn() });
});
afterEach(() => { vi.useRealTimers(); vi.unstubAllGlobals(); });
describe('dealership WhatsApp conversion', () => {
  it.each(['https://wa.me/919065591253', 'https://wa.me/919065591253?text=Hello'])('matches only the required contact, preserving query text: %s', href => expect(isTrackedWhatsAppUrl(href)).toBe(true));
  it.each(['https://wa.me/919065591254', 'https://wa.me/?text=share', 'tel:+919065591253', 'https://instagram.com/gearbox', 'http://wa.me/919065591253', 'https://wa.me.evil.test/919065591253', 'https://wa.me/919065591253/extra'])('excludes unrelated actions: %s', href => expect(isTrackedWhatsAppUrl(href)).toBe(false));
  it('does not emit on installation/page load', () => { installWhatsAppConversions(); expect(gtag).not.toHaveBeenCalled(); });
  it('sends the exact requested payload only once for one click, and callback navigates once', async () => {
    installWhatsAppConversions(); const e = click(); listener(e); listener(e); await flush();
    expect(gtag).toHaveBeenCalledTimes(1);
    expect(gtag).toHaveBeenCalledWith('event', 'conversion', expect.objectContaining({ send_to: 'AW-17787125194/GZ3mCIm30LwdEMr7x6FC', value: 1.0, currency: 'INR' }));
    const callback = gtag.mock.calls[0]?.[2].event_callback; callback(); callback(); vi.advanceTimersByTime(1000);
    expect(replace).toHaveBeenCalledTimes(1); expect(replace).toHaveBeenCalledWith('https://wa.me/919065591253');
  });
  it('denied advertising navigates without reporting', async () => { permission.mockResolvedValue(false); installWhatsAppConversions(); listener(click()); await flush(); expect(gtag).not.toHaveBeenCalled(); expect(replace).toHaveBeenCalledTimes(1); });
  it('withdrawal during permission lookup blocks reporting', async () => { permission.mockResolvedValueOnce(true).mockResolvedValueOnce(false); installWhatsAppConversions(); listener(click()); await flush(); expect(gtag).not.toHaveBeenCalled(); expect(replace).toHaveBeenCalledTimes(1); });
  it('missing callback uses an 800ms fallback for a same-tab journey', async () => { installWhatsAppConversions(); listener(click('https://wa.me/919065591253?text=hello', '')); await flush(); expect(assign).not.toHaveBeenCalled(); vi.advanceTimersByTime(WHATSAPP_FALLBACK_MS); expect(assign).toHaveBeenCalledWith('https://wa.me/919065591253?text=hello'); });
  it('missing Google tag never prevents WhatsApp opening', async () => { delete (window as unknown as { gtag?: unknown }).gtag; installWhatsAppConversions(); listener(click()); await flush(); expect(replace).toHaveBeenCalledTimes(1); });
  it('a blocked popup leaves normal browser navigation intact', async () => { vi.mocked(window.open).mockReturnValue(null); installWhatsAppConversions(); const e=click(); listener(e); await flush(); expect(e.defaultPrevented).toBe(false); expect(gtag).toHaveBeenCalledTimes(1); });
  it('does not replay a click after permission times out', async () => { let resolve: (v: boolean) => void = () => {}; permission.mockImplementation(() => new Promise<boolean>(r => { resolve=r; })); installWhatsAppConversions(); listener(click()); vi.advanceTimersByTime(800); resolve(true); await flush(); expect(gtag).not.toHaveBeenCalled(); expect(replace).toHaveBeenCalledTimes(1); });
});
