import { useEffect, useState } from "react";
import { Download, X } from "lucide-react";

type PromptEvent = Event & { prompt: () => Promise<void>; userChoice: Promise<{ outcome: string }> };

export function InstallAppBanner() {
  const [evt, setEvt] = useState<PromptEvent | null>(null);
  const [show, setShow] = useState(false);
  const [help, setHelp] = useState(false);

  useEffect(() => {
    const standalone = window.matchMedia("(display-mode: standalone)").matches;
    if (standalone || sessionStorage.getItem("hideInstall")) return;
    setShow(true);
    const h = (e: Event) => { e.preventDefault(); setEvt(e as PromptEvent); };
    window.addEventListener("beforeinstallprompt", h);
    const done = () => setShow(false);
    window.addEventListener("appinstalled", done);
    return () => { window.removeEventListener("beforeinstallprompt", h); window.removeEventListener("appinstalled", done); };
  }, []);

  if (!show) return null;

  const install = async () => {
    if (evt) { await evt.prompt(); await evt.userChoice; setEvt(null); setShow(false); }
    else setHelp(true);
  };
  const close = () => { sessionStorage.setItem("hideInstall", "1"); setShow(false); };

  return (
    <div className="mb-6 bg-card border-l-4 border-primary p-4 flex flex-col sm:flex-row sm:items-center gap-3">
      <div className="flex-1">
        <p className="font-semibold">Get the Gearbox Autos app</p>
        <p className="text-sm text-muted-foreground">
          {help
            ? "On Android Chrome: tap ⋮ → Install app. On iPhone Safari: tap Share → Add to Home Screen."
            : "Install it on your phone for one-tap access to our latest cars."}
        </p>
      </div>
      <div className="flex gap-2">
        <button type="button" onClick={install} className="inline-flex items-center gap-2 bg-primary text-primary-foreground px-4 py-2 font-semibold">
          <Download className="h-4 w-4" /> Download app
        </button>
        <button type="button" onClick={close} aria-label="Dismiss" className="p-2 text-muted-foreground hover:text-foreground">
          <X className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}
