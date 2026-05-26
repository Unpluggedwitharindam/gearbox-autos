import { Link } from "@tanstack/react-router";
import { Logo } from "./Logo";

export function Footer() {
  return (
    <footer className="border-t border-border mt-24">
      <div className="container-page py-12 grid gap-10 md:grid-cols-4">
        <div>
          <Logo />
          <p className="mt-4 text-sm text-muted-foreground max-w-xs">
            A trusted used car marketplace based in Jamshedpur. 0% commission, no hidden charges.
          </p>
        </div>
        <div>
          <h4 className="text-sm font-semibold mb-3">Explore</h4>
          <ul className="space-y-2 text-sm text-muted-foreground">
            <li><Link to="/buy">Buy a Used Car</Link></li>
            <li><Link to="/sell">Sell Your Car</Link></li>
            <li><Link to="/inventory">Our Inventory</Link></li>
          </ul>
        </div>
        <div>
          <h4 className="text-sm font-semibold mb-3">Company</h4>
          <ul className="space-y-2 text-sm text-muted-foreground">
            <li><Link to="/how-it-works">How It Works</Link></li>
            <li><Link to="/about">About Us</Link></li>
            <li><Link to="/contact">Contact Us</Link></li>
          </ul>
        </div>
        <div>
          <h4 className="text-sm font-semibold mb-3">Contact</h4>
          <ul className="space-y-2 text-sm text-muted-foreground">
            <li>+91 90655 91253</li>
            <li>gearboxautotechgbat@gmail.com</li>
            <li>4/9 Awas Tower, Sonari, Jamshedpur</li>
          </ul>
        </div>
      </div>
      <div className="border-t border-border">
        <div className="container-page py-5 text-xs text-muted-foreground flex justify-between">
          <span>© {new Date().getFullYear()} Gearbox Autos. All rights reserved.</span>
          <span>100% Transparent · 0% Commission</span>
        </div>
      </div>
    </footer>
  );
}
