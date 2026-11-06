import { useEffect, useState } from 'react';
import { useRouter } from '@tanstack/react-router';
import { App } from '@capacitor/app';
import { Browser } from '@capacitor/browser';
import { supabase } from '@/integrations/supabase/client';
import { isNativeApp, WEBSITE_ORIGIN } from '@/lib/native-app';
import { toast } from 'sonner';

export function useNativeApp() {
  const router = useRouter();
  const [offline, setOffline] = useState(false);
  useEffect(() => {
    if (!isNativeApp()) return;
    const disconnected = () => setOffline(true);
    const serviceRestored = () => setOffline(false);
    const restored = () => { setOffline(false); void router.invalidate(); };
    setOffline(!navigator.onLine);
    window.addEventListener('offline', disconnected);
    window.addEventListener('online', restored);
    window.addEventListener('gearbox:connection-error', disconnected);
    window.addEventListener('gearbox:connection-restored', serviceRestored);
    const external = (event: MouseEvent) => {
      const target = event.target;
      if (!(target instanceof Element)) return;
      const anchor = target.closest('a');
      if (!anchor || anchor.download || event.defaultPrevented) return;
      const url = new URL(anchor.href);
      if (url.origin === location.origin || ['javascript:', 'data:', 'blob:'].includes(url.protocol)) return;
      if (url.origin === WEBSITE_ORIGIN && !url.pathname.startsWith('/api/')) {
        event.preventDefault();
        router.history.push(url.pathname + url.search + url.hash);
        return;
      }
      // Capacitor's native WebView client dispatches tel/mailto/WhatsApp intents.
      if (url.protocol !== 'https:' && url.protocol !== 'http:') return;
      if (url.hostname === 'wa.me' || url.hostname === 'api.whatsapp.com') return;
      event.preventDefault();
      void Browser.open({ url: url.href });
    };
    document.addEventListener('click', external);
    const back = App.addListener('backButton', () => {
      if (router.history.canGoBack()) router.history.back();
      else void App.exitApp();
    });
    const callback = async (url: string) => {
      const parsed = new URL(url);
      if (parsed.protocol !== 'in.gearboxautos.app:' || parsed.hostname !== 'auth') return;
      const values = new URLSearchParams(parsed.hash.slice(1));
      const expected = localStorage.getItem('gearbox-app-auth-state');
      if (!expected || values.get('state') !== expected) return;
      const access_token = values.get('access_token');
      const refresh_token = values.get('refresh_token');
      if (!access_token || !refresh_token) return;
      const result = await supabase.auth.setSession({ access_token, refresh_token });
      if (result.error) { toast.error('Unable to finish sign-in. Check your connection and try again.'); return; }
      localStorage.removeItem('gearbox-app-auth-state');
      await Browser.close().catch(() => {});
      router.history.replace('/admin');
    };
    const opened = App.addListener('appUrlOpen', ({ url }) => { void callback(url); });
    void App.getLaunchUrl().then((result) => { if (result?.url) void callback(result.url); });
    return () => {
      window.removeEventListener('offline', disconnected);
      window.removeEventListener('online', restored);
      window.removeEventListener('gearbox:connection-error', disconnected);
      window.removeEventListener('gearbox:connection-restored', serviceRestored);
      document.removeEventListener('click', external);
      void back.then((handle) => handle.remove());
      void opened.then((handle) => handle.remove());
    };
  }, [router]);
  return offline;
}