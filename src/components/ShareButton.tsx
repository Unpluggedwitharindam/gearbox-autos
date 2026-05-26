import { useState, useRef, useEffect } from "react";
import { Share2, Copy, Check, X, MessageCircle, Send, Facebook, Twitter, Mail, MessageSquare, Instagram } from "lucide-react";
import { toast } from "sonner";

type Props = {
  title: string;
  text?: string;
  path: string; // e.g. "/car/bmw-x5"
  className?: string;
  label?: string;
  compact?: boolean;
};

export function ShareButton({ title, text, path, className = "", label = "Share", compact = false }: Props) {
  const [open, setOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  const url = typeof window !== "undefined" ? `${window.location.origin}${path}` : path;
  const shareText = text ?? title;
  const enc = encodeURIComponent;

  useEffect(() => {
    if (!open) return;
    const onDoc = (e: MouseEvent) => { if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false); };
    document.addEventListener("mousedown", onDoc);
    return () => document.removeEventListener("mousedown", onDoc);
  }, [open]);

  const onClick = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (typeof navigator !== "undefined" && (navigator as any).share) {
      try {
        await (navigator as any).share({ title, text: shareText, url });
        return;
      } catch { /* user cancelled or fallback */ }
    }
    setOpen((v) => !v);
  };

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      toast.success("Link copied");
      setTimeout(() => setCopied(false), 1500);
    } catch {
      toast.error("Copy failed");
    }
  };

  const targets = [
    { name: "WhatsApp", Icon: MessageCircle, href: `https://wa.me/?text=${enc(`${shareText} ${url}`)}` },
    { name: "Messages (SMS)", Icon: MessageSquare, href: `sms:?&body=${enc(`${shareText} ${url}`)}` },
    { name: "Telegram", Icon: Send, href: `https://t.me/share/url?url=${enc(url)}&text=${enc(shareText)}` },
    { name: "Facebook", Icon: Facebook, href: `https://www.facebook.com/sharer/sharer.php?u=${enc(url)}` },
    { name: "X / Twitter", Icon: Twitter, href: `https://twitter.com/intent/tweet?url=${enc(url)}&text=${enc(shareText)}` },
    { name: "Email", Icon: Mail, href: `mailto:?subject=${enc(title)}&body=${enc(`${shareText}\n\n${url}`)}` },
    { name: "Instagram (copy)", Icon: Instagram, href: "#", onClick: copy },
  ];

  return (
    <div ref={ref} className={`relative inline-block ${className}`}>
      <button
        type="button"
        onClick={onClick}
        aria-label="Share"
        className={compact
          ? "h-9 w-9 grid place-items-center rounded-full bg-background/80 backdrop-blur border border-border/60 hover:bg-background transition"
          : "inline-flex items-center gap-2 rounded-md border border-border/70 px-3 py-2 text-sm hover:bg-card transition"}
      >
        <Share2 className="h-4 w-4" />
        {!compact && <span>{label}</span>}
      </button>

      {open && (
        <div className="absolute right-0 mt-2 z-50 w-64 surface p-3 shadow-xl">
          <div className="flex items-center justify-between mb-2">
            <div className="text-xs font-semibold text-muted-foreground">Share via</div>
            <button type="button" onClick={() => setOpen(false)} aria-label="Close" className="text-muted-foreground hover:text-foreground"><X className="h-4 w-4" /></button>
          </div>
          <div className="grid grid-cols-4 gap-2">
            {targets.map(({ name, Icon, href, onClick: oc }) => (
              <a
                key={name}
                href={href}
                target={href.startsWith("http") ? "_blank" : undefined}
                rel="noopener noreferrer"
                onClick={(e) => { if (oc) { e.preventDefault(); oc(); } setOpen(false); }}
                title={name}
                className="flex flex-col items-center gap-1 p-2 rounded-md hover:bg-card transition text-[10px] text-muted-foreground text-center"
              >
                <Icon className="h-5 w-5 text-foreground" />
                <span className="truncate w-full">{name.split(" ")[0]}</span>
              </a>
            ))}
          </div>
          <button
            type="button"
            onClick={copy}
            className="mt-3 w-full flex items-center justify-center gap-2 rounded-md border border-border/70 px-3 py-2 text-xs hover:bg-card transition"
          >
            {copied ? <Check className="h-4 w-4 text-primary" /> : <Copy className="h-4 w-4" />}
            {copied ? "Copied!" : "Copy link"}
          </button>
        </div>
      )}
    </div>
  );
}
