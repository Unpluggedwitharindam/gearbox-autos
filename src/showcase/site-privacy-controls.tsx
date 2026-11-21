import { forwardRef, useEffect, useRef, useState, type HTMLAttributes } from 'react';
import { Link } from '@tanstack/react-router';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { cn } from '@/lib/utils';
import { needsAnswer, onConsentChange, readChoice, saveChoices } from '@/lib/consent';

export interface SitePrivacyControlsProps extends HTMLAttributes<HTMLDivElement> {}
/** Preview-app consent controls; excluded from the attached component library. */
export const SitePrivacyControls = forwardRef<HTMLDivElement, SitePrivacyControlsProps>(
  function SitePrivacyControls({ className, ...props }, ref) {
    const [open, setOpen] = useState(false);
    const [settings, setSettings] = useState(false);
    const [analytics, setAnalytics] = useState(false);
    const [advertising, setAdvertising] = useState(false);
    const [privacySignal, setPrivacySignal] = useState(false);
    const panel = useRef<HTMLDivElement>(null);
    const trigger = useRef<HTMLButtonElement>(null);
    useEffect(() => {
      let active = true;
      const refresh = () => {
        setAnalytics(readChoice('analytics') === 'granted');
        setAdvertising(readChoice('advertising') === 'granted');
        setPrivacySignal((navigator as Navigator & { globalPrivacyControl?: boolean }).globalPrivacyControl === true);
      };
      refresh();
      void needsAnswer(['analytics', 'advertising']).then(required => { if (active) setOpen(required); });
      const unsubscribe = onConsentChange(refresh);
      return () => { active = false; unsubscribe(); };
    }, []);
    useEffect(() => { if (open) panel.current?.focus(); }, [open]);
    const close = () => { setOpen(false); trigger.current?.focus(); };
    const choose = (granted: boolean) => {
      saveChoices({ analytics: granted ? 'granted' : 'denied', advertising: granted ? 'granted' : 'denied' });
      close();
    };
    return (
      <div {...props} ref={ref} className={cn('relative z-50', className)}>
        <div className="border-t border-border bg-background px-4 py-3 text-center">
          <Button ref={trigger} variant="link" size="sm" onClick={() => {
            setAnalytics(readChoice('analytics') === 'granted');
            setAdvertising(readChoice('advertising') === 'granted');
            setSettings(true); setOpen(true);
          }}>Cookie settings</Button>
        </div>
        {open && (
          <div ref={panel} role="dialog" aria-modal="false" aria-labelledby="privacy-choice-title" tabIndex={-1}
            className="fixed inset-x-0 bottom-0 mx-auto max-h-[85dvh] max-w-2xl overflow-y-auto border border-border bg-background p-5 shadow-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring">
            <h2 id="privacy-choice-title" className="text-lg font-semibold">Your privacy choices</h2>
            <p className="mt-2 text-sm text-muted-foreground">We count visits without cookies. If you accept analytics, we also measure clicks. Advertising cookies help measure WhatsApp clicks and personalise advertising.</p>
            <Link to="/privacy-policy" className="mt-2 inline-block text-sm text-primary underline">Privacy policy</Link>
            {settings && (
              <div className="mt-4 space-y-4">
                <div className="flex items-center justify-between gap-4 text-sm"><span>Necessary</span><span className="text-muted-foreground">Always on</span></div>
                <div className="flex items-center justify-between gap-4"><label htmlFor="analytics-choice" className="text-sm">Analytics, provided by Lovable</label><Switch id="analytics-choice" checked={analytics} onCheckedChange={setAnalytics} disabled={privacySignal} /></div>
                <div className="flex items-center justify-between gap-4"><label htmlFor="advertising-choice" className="text-sm">Advertising, provided by Google</label><Switch id="advertising-choice" checked={advertising} onCheckedChange={setAdvertising} disabled={privacySignal} /></div>
                {privacySignal && <p className="text-sm text-muted-foreground">Your browser’s privacy signal applies. Optional tracking stays off.</p>}
                <Button variant="outline" className="w-full" onClick={() => {
                  saveChoices({ analytics: analytics ? 'granted' : 'denied', advertising: advertising ? 'granted' : 'denied' }); close();
                }}>Save choices</Button>
              </div>
            )}
            <div className="mt-4 grid grid-cols-2 gap-3">
              <Button variant="outline" disabled={privacySignal} onClick={() => choose(true)}>Accept all</Button>
              <Button variant="outline" onClick={() => choose(false)}>Reject all</Button>
            </div>
            <Button variant="link" className="mt-2 w-full" onClick={() => settings ? close() : setSettings(true)}>{settings ? 'Close settings' : 'Cookie settings'}</Button>
          </div>
        )}
      </div>
    );
  },
);
