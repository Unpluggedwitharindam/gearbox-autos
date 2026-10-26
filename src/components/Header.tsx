import { Link } from "@tanstack/react-router";
import { Menu } from "lucide-react";
import { useState } from "react";
import { Logo } from "./Logo";

const links = [
  { to: "/buy", label: "Buy" },
  { to: "/sell", label: "Sell Car" },
  { to: "/inventory", label: "Inventory" },
  { to: "/how-it-works", label: "How It Works" },
  { to: "/about", label: "About" },
  { to: "/contact", label: "Contact" },
] as const;

export function Header() {
  const [open, setOpen] = useState(false);
  return (
    <header className="sticky top-0 z-50 bg-background border-b border-card">
      <div className="container-page flex items-center justify-between py-4">
        <Link to="/" aria-label="Gearbox Autos home"><Logo /></Link>
        <nav className="hidden lg:flex items-center gap-8">
          {links.map((l) => (
            <Link key={l.to} to={l.to} className="nav-link" activeProps={{ "data-status": "active" } as any}>
              {l.label}
            </Link>
          ))}
        </nav>
        <div className="flex items-center gap-4">
          <span className="hidden sm:block text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
            Jamshedpur, Jharkhand
          </span>
          <a
            href="tel:+919065591253"
            className="hidden sm:inline-flex bg-primary text-primary-foreground px-5 py-2 text-[11px] font-bold uppercase tracking-widest hover:bg-primary/85 transition-all shadow-[4px_4px_0px_0px_rgba(232,93,58,0.25)] active:translate-x-[2px] active:translate-y-[2px] active:shadow-none"
          >
            Call Now
          </a>
          <button aria-label="Menu" onClick={() => setOpen((v) => !v)} className="lg:hidden p-2 border border-border hover:border-primary">
            <Menu className="h-5 w-5" />
          </button>
        </div>
      </div>
      {open && (
        <div className="lg:hidden border-t border-card bg-background">
          <div className="container-page py-4 grid gap-4">
            {links.map((l) => (
              <Link key={l.to} to={l.to} className="nav-link" onClick={() => setOpen(false)}>{l.label}</Link>
            ))}
            <a href="tel:+919065591253" className="nav-link text-primary">Call +91 90655 91253</a>
          </div>
        </div>
      )}
    </header>
  );
}
