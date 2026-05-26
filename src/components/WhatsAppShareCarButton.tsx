import { useState } from "react";
import { useServerFn } from "@tanstack/react-start";
import { Loader2, MessageCircle, Copy, Check, X } from "lucide-react";
import { toast } from "sonner";
import { generateCarCaption } from "@/lib/social.functions";

export function WhatsAppShareCarButton({ carId }: { carId: string }) {
  const generate = useServerFn(generateCarCaption);
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const [caption, setCaption] = useState("");
  const [url, setUrl] = useState("");
  const [copied, setCopied] = useState(false);

  const onClick = async () => {
    setLoading(true);
    try {
      const out = await generate({ data: { carId } });
      const origin = typeof window !== "undefined" ? window.location.origin : "";
      const link = `${origin}/car/${out.slug}`;
      const full = `${out.caption}\n\n${link}`;
      setCaption(full);
      setUrl(link);
      setOpen(true);
    } catch (e: any) {
      toast.error(e?.message || "Failed to generate caption");
    } finally {
      setLoading(false);
    }
  };

  const copy = async () => {
    await navigator.clipboard.writeText(caption);
    setCopied(true);
    toast.success("Caption copied — paste in WhatsApp Status");
    setTimeout(() => setCopied(false), 1500);
  };

  const openWA = () => {
    const href = `https://wa.me/?text=${encodeURIComponent(caption)}`;
    window.open(href, "_blank", "noopener");
  };

  return (
    <>
      <button
        type="button"
        onClick={onClick}
        disabled={loading}
        title="Share on WhatsApp with AI caption"
        className="inline-flex items-center gap-1.5 rounded-md border border-border/70 px-2.5 py-1.5 text-xs hover:bg-card transition disabled:opacity-60"
      >
        {loading ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <MessageCircle className="h-3.5 w-3.5 text-[#25D366]" />}
        WhatsApp
      </button>

      {open && (
        <div className="fixed inset-0 bg-background/80 backdrop-blur z-[60] grid place-items-center p-4">
          <div className="surface p-5 max-w-md w-full">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-base font-semibold flex items-center gap-2"><MessageCircle className="h-4 w-4 text-[#25D366]" /> WhatsApp share</h3>
              <button onClick={() => setOpen(false)}><X className="h-4 w-4" /></button>
            </div>
            <textarea
              value={caption}
              onChange={(e) => setCaption(e.target.value)}
              rows={10}
              className="w-full rounded-md bg-input/60 border border-border/60 px-3 py-2 text-sm outline-none"
            />
            <p className="text-[11px] text-muted-foreground mt-2">
              Tip: for WhatsApp Status, tap Copy, then paste in your Status with the car photo.
            </p>
            <div className="flex gap-2 mt-3">
              <button onClick={copy} className="flex-1 rounded-md border border-border/70 px-3 py-2 text-sm hover:bg-card transition inline-flex items-center justify-center gap-2">
                {copied ? <Check className="h-4 w-4 text-primary" /> : <Copy className="h-4 w-4" />}
                {copied ? "Copied" : "Copy caption"}
              </button>
              <button onClick={openWA} className="flex-1 btn-primary rounded-md px-3 py-2 text-sm font-semibold inline-flex items-center justify-center gap-2">
                <MessageCircle className="h-4 w-4" /> Send on WhatsApp
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
