import { createFileRoute } from '@tanstack/react-router';
import { useEffect, useState } from 'react';
import { lovable } from '@/integrations/lovable';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';

export const Route = createFileRoute('/app-auth')({
  head: () => ({ meta: [
    { title: 'Android Sign-in — Gearbox Autos' },
    { name: 'description', content: 'Securely return to the Gearbox Autos Android app after signing in.' },
    { name: 'robots', content: 'noindex, nofollow, noarchive' },
    { property: 'og:title', content: 'Android Sign-in — Gearbox Autos' },
    { property: 'og:description', content: 'Secure sign-in for the Gearbox Autos Android app.' },
    { property: 'og:type', content: 'website' },
    { name: 'twitter:card', content: 'summary_large_image' },
  ] }),
  component: AppAuth,
});

function AppAuth() {
  const [error, setError] = useState('');
  const [ready, setReady] = useState(false);
  useEffect(() => {
    const run = async () => {
      const state = new URLSearchParams(location.search).get('state');
      if (state && /^[0-9a-f-]{36}$/.test(state)) sessionStorage.setItem('gearbox-native-auth', state);
      const saved = sessionStorage.getItem('gearbox-native-auth');
      if (!saved) { setError('Please start sign-in from the Android app.'); return; }
      const { data } = await supabase.auth.getSession();
      if (data.session) { setReady(true); return; }
      const result = await lovable.auth.signInWithOAuth('google', { redirect_uri: location.origin + '/app-auth' });
      if (result.error) setError('Sign-in failed. Please try again from the app.');
      else if (!result.redirected) setReady(true);
    };
    void run();
  }, []);
  const returnToApp = async () => {
    const state = sessionStorage.getItem('gearbox-native-auth');
    const { data } = await supabase.auth.getSession();
    if (!state || !data.session) { setError('Sign-in expired. Please try again.'); return; }
    const values = new URLSearchParams({ state, access_token: data.session.access_token, refresh_token: data.session.refresh_token });
    sessionStorage.removeItem('gearbox-native-auth');
    location.href = `in.gearboxautos.app://auth#${values}`;
  };
  return <section className="container-page py-12"><h1 className="text-2xl font-bold">Gearbox Autos sign-in</h1><p role="status" className="mt-4 text-muted-foreground">{error || (ready ? 'Signed in successfully.' : 'Signing in…')}</p>{ready && <Button onClick={() => void returnToApp()} className="mt-6">Return to Gearbox Autos</Button>}</section>;
}