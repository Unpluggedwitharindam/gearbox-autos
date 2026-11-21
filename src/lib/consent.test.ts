import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
let store: Map<string, string>;
const fetchTrace=vi.fn();
beforeEach(() => {
  vi.resetModules(); store=new Map(); fetchTrace.mockReset();
  vi.stubGlobal('localStorage', { getItem: (k: string) => store.get(k) ?? null, setItem: (k: string,v: string) => store.set(k,v) });
  vi.stubGlobal('location', { hostname: 'gearboxautos.in' }); vi.stubGlobal('navigator', {});
  vi.stubGlobal('window', Object.assign(new EventTarget(), { gtag: vi.fn() })); vi.stubGlobal('fetch', fetchTrace);
});
afterEach(() => vi.unstubAllGlobals());
const trace=(loc: string, host='gearboxautos.in') => fetchTrace.mockResolvedValue({ ok: true, text: async () => `h=${host}\nloc=${loc}` });
describe('per-purpose advertising consent', () => {
  it.each(['GB','DE','CH','CA','XX','T1'])('blocks unanswered advertising in %s', async country => { trace(country); const c=await import('./consent'); expect(await c.canTrack('advertising')).toBe(false); });
  it('permits ordinary advertising in India without a banner', async () => { trace('IN'); const c=await import('./consent'); expect(await c.canTrack('advertising')).toBe(true); expect(await c.needsAnswer(['analytics','advertising'])).toBe(false); });
  it('unknown region lookup and mismatched hosts fail closed', async () => { trace('IN','wrong.test'); const c=await import('./consent'); expect(await c.canTrack('advertising')).toBe(false); });
  it('network failure fails closed', async () => { fetchTrace.mockRejectedValue(new Error('offline')); const c=await import('./consent'); expect(await c.canTrack('advertising')).toBe(false); });
  it('analytics acceptance does not grant advertising', async () => { trace('GB'); const c=await import('./consent'); c.saveChoices({ analytics:'granted' }); expect(await c.canTrack('advertising')).toBe(false); });
  it('acceptance enables new advertising, withdrawal immediately blocks it', async () => { trace('GB'); const c=await import('./consent'); c.saveChoices({ advertising:'granted' }); expect(await c.canTrack('advertising')).toBe(true); c.saveChoices({ advertising:'denied' }); expect(await c.canTrack('advertising')).toBe(false); });
  it('explicit refusal overrides a non-consent region', async () => { trace('IN'); const c=await import('./consent'); c.saveChoices({ advertising:'denied' }); expect(await c.canTrack('advertising')).toBe(false); });
  it('Global Privacy Control overrides saved acceptance', async () => { trace('IN'); const c=await import('./consent'); c.saveChoices({ advertising:'granted' }); vi.stubGlobal('navigator',{globalPrivacyControl:true}); expect(await c.canTrack('advertising')).toBe(false); });
});
