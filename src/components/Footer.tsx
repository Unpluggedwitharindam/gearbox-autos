import { Link } from "@tanstack/react-router";
import { Instagram, MessageCircle } from "lucide-react";
import { Logo } from "./Logo";

export function Footer() {
  return (
    <footer className="bg-card border-t border-border mt-20 pt-16 pb-8">
      <div className="container-page">
        <div className="grid gap-12 md:grid-cols-4 mb-14">
          <div className="md:col-span-2">
            <Logo className="text-4xl" />
            <p className="mt-6 text-sm text-muted-foreground max-w-md leading-relaxed">
              Gearbox Autos is Jamshedpur's trusted marketplace for verified pre-owned cars. We connect buyers and
              sellers directly with a 0% commission model that puts you first.
            </p>
            <div className="mt-6 flex items-center gap-3">
              <a href="https://www.instagram.com/gearbox_autos_usedcars/" target="_blank" rel="noopener noreferrer" aria-label="Instagram" className="h-10 w-10 border border-border grid place-items-center hover:border-primary hover:text-primary transition-colors">
                <Instagram className="h-4 w-4" />
              </a>
              <a href="https://wa.me/919065591253" target="_blank" rel="noopener noreferrer" aria-label="WhatsApp" className="h-10 w-10 border border-border grid place-items-center hover:border-primary hover:text-primary transition-colors">
                <MessageCircle className="h-4 w-4" />
              </a>
            </div>
          </div>
          <div>
            <h4 className="text-xs font-bold uppercase tracking-[0.2em] mb-6">Showroom</h4>
            <ul className="space-y-3 text-sm text-muted-foreground">
              <li className="flex items-start gap-2"><span className="text-primary font-bold">A:</span><span>4/9 Awas Tower, Sonari,<br />Jamshedpur, Jharkhand</span></li>
              <li className="flex items-center gap-2"><span className="text-primary font-bold">T:</span><span>+91 90655 91253</span></li>
              <li className="flex items-start gap-2"><span className="text-primary font-bold">E:</span><span className="break-all">gearboxautotechgbat@gmail.com</span></li>
            </ul>
          </div>
          <div>
            <h4 className="text-xs font-bold uppercase tracking-[0.2em] mb-6">Navigation</h4>
            <ul className="space-y-3 text-sm text-muted-foreground uppercase font-semibold tracking-wide">
              <li><Link to="/buy" className="hover:text-primary">Buy a Used Car</Link></li>
              <li><Link to="/sell" className="hover:text-primary">Sell Your Car</Link></li>
              <li><Link to="/inventory" className="hover:text-primary">Our Inventory</Link></li>
              <li><Link to="/how-it-works" className="hover:text-primary">How It Works</Link></li>
              <li><Link to="/about" className="hover:text-primary">About Us</Link></li>
              <li><Link to="/contact" className="hover:text-primary">Contact Us</Link></li>
            </ul>
          </div>
        </div>
        <div className="pt-8 border-t border-border flex flex-col md:flex-row justify-between items-center gap-4 text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
          <span>© {new Date().getFullYear()} Gearbox Autos. All rights reserved.</span>
          <span>100% Transparent · 0% Commission · <Link to="/login" className="hover:text-primary">Admin</Link></span>
        </div>
      </div>
    </footer>
  );
}
