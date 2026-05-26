import { Link } from "@tanstack/react-router";
import { Menu } from "lucide-react";
import { useState } from "react";
import { Logo } from "./Logo";

const links = [
  { to: "/buy", label: "Buy a Used Car" },
  { to: "/sell", label: "Sell Your Car" },
  { to: "/inventory", label: "Our Inventory" },
  { to: "/how-it-works", label: "How It Works" },
  { to: "/about", label: "About Us" },
  { to: "/contact", label: "Contact Us" },
] as const;

export function Header() {
  const [open, setOpen] = useState(false);
  return (
    <header className="absolute top-0 left-0 right-0 z-30">
      <div className="container-page flex items-center justify-between py-6">
        <Link to="/" aria-label="Gearbox Autos home"><Logo /></Link>
        <nav className="hidden lg:flex items-center gap-8">
          {links.map((l) => (
            <Link key={l.to} to={l.to} className="nav-link" activeProps={{ "data-status": "active" } as any}>
              {l.label}
            </Link>
          ))}
        </nav>
        <button aria-label="Menu" onClick={() => setOpen((v) => !v)} className="p-2 rounded-md border border-border/60 hover:bg-card/60">
          <Menu className="h-5 w-5" />
        </button>
      </div>
      {open && (
        <div className="lg:hidden border-t border-border/60 bg-background/95 backdrop-blur">
          <div className="container-page py-4 grid gap-3">
            {links.map((l) => (
              <Link key={l.to} to={l.to} className="nav-link" onClick={() => setOpen(false)}>{l.label}</Link>
            ))}
          </div>
        </div>
      )}
    </header>
  );
}
