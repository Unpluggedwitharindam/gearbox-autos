import { forwardRef, useEffect, useState, type HTMLAttributes } from "react";
import { Link } from "@tanstack/react-router";
import { ArrowRight, ChevronDown, Heart, MapPin, Menu, Phone, X, CarFront } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from "@/components/ui/accordion";
import type { Car } from "@/lib/cars";
import { cn } from "@/lib/utils";
import { marketplaceAreas } from "@/lib/marketplace-areas";
import { images } from "./marketplace-assets";

export interface MarketplaceHeaderProps extends HTMLAttributes<HTMLElement> {}
export const MarketplaceHeader = forwardRef<HTMLElement, MarketplaceHeaderProps>(
  function MarketplaceHeader({ className, ...props }, ref) {
    const [open, setOpen] = useState(false);
    return (
      <header
        ref={ref}
        {...props}
        className={cn("market-header border-b border-border bg-background", className)}
      >
        <div className="container-page grid grid-cols-[minmax(0,1fr)_auto] items-center gap-3 py-3 lg:flex lg:justify-between">
          <Link to="/" aria-label="Gearbox Autos home" className="shrink-0">
            <img
              src={images.logo}
              width="294"
              height="118"
              alt="Gearbox Autos"
              className="w-32 md:w-36 h-auto"
            />
          </Link>
          <nav
            aria-label="Main navigation"
            className="hidden lg:flex items-center gap-7 text-xs font-semibold"
          >
            <Link to="/" className="border-b-2 border-primary py-3">
              Home
            </Link>
            <details className="relative">
              <summary className="cursor-pointer flex items-center gap-1">
                Second Hand Cars <ChevronDown className="size-3" />
              </summary>
              <div className="absolute z-50 top-9 bg-background border border-border shadow-md p-4 w-56 grid gap-3">
                <Link to="/buy">All Cars</Link>
                {marketplaceAreas.map((a) => (
                  <Link key={a.slug} to={`/second-hand-cars-in-${a.slug}`}>
                    {a.name}
                  </Link>
                ))}
              </div>
            </details>
            <Link to="/sell">Sell Your Car</Link>
            <Link to="/gbx-motor-club">GBX Motor Club</Link>
            <Link to="/about">About Us</Link>
          </nav>
          <div className="flex items-center gap-2 shrink-0">
            <details className="relative hidden md:block">
              <summary className="cursor-pointer flex gap-1 items-center text-xs border border-border bg-secondary rounded-full px-3 py-2">
                <MapPin className="size-3.5" />
                Jamshedpur
                <ChevronDown className="size-3" />
              </summary>
              <div className="absolute right-0 top-10 z-50 bg-background border border-border shadow-md p-4 w-48 grid gap-3 text-sm">
                {marketplaceAreas.map((a) => (
                  <Link key={a.slug} to={`/second-hand-cars-in-${a.slug}`}>
                    {a.name}
                  </Link>
                ))}
              </div>
            </details>
            <Button asChild size="sm" className="hidden sm:inline-flex rounded-full">
              <Link to="/contact">
                <Phone />
                Contact Us
              </Link>
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="lg:hidden"
              aria-label={open ? "Close menu" : "Open menu"}
              aria-expanded={open}
              onClick={() => setOpen(!open)}
            >
              {open ? <X /> : <Menu />}
            </Button>
          </div>
        </div>
        {open && (
          <nav aria-label="Mobile navigation" className="container-page grid gap-4 py-5 lg:hidden">
            {(
              [
                ["/buy", "Second Hand Cars"],
                ["/sell", "Sell Your Car"],
                ["/gbx-motor-club", "GBX Motor Club"],
                ["/about", "About Us"],
                ["/contact", "Contact Us"],
              ] as const
            ).map(([to, label]) => (
              <Link to={to} key={to} onClick={() => setOpen(false)}>
                {label}
              </Link>
            ))}
          </nav>
        )}
      </header>
    );
  },
);
export interface MarketplaceCarsProps extends HTMLAttributes<HTMLDivElement> {
  cars: Car[];
}
export const MarketplaceCars = forwardRef<HTMLDivElement, MarketplaceCarsProps>(
  function MarketplaceCars({ cars, className, ...props }, ref) {
    const [saved, setSaved] = useState<string[]>([]);
    useEffect(() => {
      try {
        const data = JSON.parse(localStorage.getItem("gearbox:wishlist") ?? "[]");
        if (Array.isArray(data)) setSaved(data.filter((x): x is string => typeof x === "string"));
      } catch {}
    }, []);
    const toggle = (id: string) => {
      const next = saved.includes(id) ? saved.filter((x) => x !== id) : [...saved, id];
      setSaved(next);
      try {
        localStorage.setItem("gearbox:wishlist", JSON.stringify(next));
      } catch {}
    };
    return (
      <div
        ref={ref}
        {...props}
        className={cn("grid sm:grid-cols-2 lg:grid-cols-4 gap-4", className)}
      >
        {cars.map((car) => (
          <article
            key={car.id}
            className="market-car bg-card border border-border rounded-lg overflow-hidden flex flex-col"
          >
            <div className="relative">
              <Link
                to="/car/$id"
                params={{ id: car.slug }}
                className="block aspect-[16/10] bg-secondary"
              >
                {car.image ? (
                  <img
                    src={car.image}
                    alt={car.name}
                    width="640"
                    height="400"
                    sizes="(min-width:1024px) 280px, (min-width:640px) 45vw, 95vw"
                    loading="lazy"
                    decoding="async"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <CarFront className="size-12 mx-auto" />
                )}
              </Link>
              <Button
                variant="secondary"
                size="icon"
                className="absolute right-2 top-2 rounded-full size-8 bg-background/95"
                aria-label={`${saved.includes(car.id) ? "Remove" : "Save"} ${car.name} ${saved.includes(car.id) ? "from" : "to"} wishlist`}
                aria-pressed={saved.includes(car.id)}
                title="Save car"
                onClick={() => toggle(car.id)}
              >
                <Heart
                  className={
                    saved.includes(car.id) ? "fill-primary text-foreground" : "text-foreground"
                  }
                />
              </Button>
            </div>
            <div className="p-4 flex flex-col flex-1">
              <h3 className="font-bold text-sm leading-snug">
                <Link to="/car/$id" params={{ id: car.slug }}>
                  {car.name}
                </Link>
              </h3>
              <p className="text-xs text-muted-foreground mt-2 flex flex-wrap gap-x-2 gap-y-1">
                <span>{car.year}</span>
                <span>{car.fuel}</span>
                <span>{car.km} km</span>
                <span>{car.transmission}</span>
              </p>
              <p className="text-xs text-muted-foreground mt-2 flex gap-1">
                <MapPin className="size-3 shrink-0" />
                {car.location}
              </p>
              <div className="mt-auto pt-4 flex items-center justify-between gap-2">
                <strong className="text-lg">{car.price}</strong>
                <Button
                  asChild
                  variant="ghost"
                  size="icon"
                  className="rounded-full bg-secondary size-8"
                >
                  <Link
                    to="/car/$id"
                    params={{ id: car.slug }}
                    aria-label={`View Details: ${car.name}`}
                    title="View Details"
                  >
                    <ArrowRight />
                  </Link>
                </Button>
              </div>
            </div>
          </article>
        ))}
      </div>
    );
  },
);
export interface MarketplaceFaqProps extends HTMLAttributes<HTMLDivElement> {
  items: string[][];
}
export const MarketplaceFaq = forwardRef<HTMLDivElement, MarketplaceFaqProps>(
  function MarketplaceFaq({ items, className, ...props }, ref) {
    return (
      <div ref={ref} {...props} className={className}>
        <Accordion type="single" collapsible className="grid md:grid-cols-2 gap-x-5 gap-y-2">
          {items.map(([q, a], i) => (
            <AccordionItem
              key={q}
              value={`faq-${i}`}
              className="border border-border rounded-md px-4"
            >
              <AccordionTrigger className="text-sm font-semibold text-left">{q}</AccordionTrigger>
              <AccordionContent className="text-sm text-muted-foreground leading-relaxed">
                {a}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    );
  },
);
export interface MarketplaceFooterProps extends HTMLAttributes<HTMLElement> {}
export const MarketplaceFooter = forwardRef<HTMLElement, MarketplaceFooterProps>(
  function MarketplaceFooter({ className, ...props }, ref) {
    return (
      <footer ref={ref} {...props} className={cn("border-t border-border mt-12", className)}>
        <div className="container-page py-10 grid md:grid-cols-3 gap-8 text-sm">
          <div>
            <img src={images.logo} width="294" height="118" alt="Gearbox Autos" className="w-36" />
            <p className="text-muted-foreground mt-4 leading-relaxed">
              Your local second-hand car marketplace in Jamshedpur.
            </p>
            <a href="tel:+919065591253" className="block mt-4">
              +91 90655 91253
            </a>
            <a href="https://wa.me/919065591253" className="block mt-2">
              Chat on WhatsApp
            </a>
          </div>
          <nav aria-label="Explore" className="grid gap-3 content-start">
            <Link to="/buy">Buy a Car</Link>
            <Link to="/sell">Sell Your Car</Link>
            <Link to="/how-it-works">How It Works</Link>
            <Link to="/about">About Us</Link>
            <Link to="/contact">Contact Us</Link>
            <Link to="/privacy-policy">Privacy Policy</Link>
          </nav>
          <div>
            <h3 className="font-bold mb-3">Find cars near you</h3>
            <nav className="grid grid-cols-2 gap-3" aria-label="Nearby localities">
              {marketplaceAreas.map((a) => (
                <Link key={a.slug} to={`/second-hand-cars-in-${a.slug}`}>
                  {a.name}
                </Link>
              ))}
            </nav>
            <address className="not-italic text-xs text-muted-foreground mt-5 leading-relaxed">
              Near Golden Town, opposite BSS School,
              <br />
              Adarsh Nagar, Sonari, Jamshedpur 831011
            </address>
          </div>
        </div>
        <div className="container-page py-5 border-t border-border text-xs text-muted-foreground">
          © {new Date().getFullYear()} Gearbox Autos. All rights reserved.
        </div>
      </footer>
    );
  },
);
