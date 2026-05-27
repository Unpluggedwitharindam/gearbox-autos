import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, Car, Tag, ChevronDown, ChevronLeft, ChevronRight } from "lucide-react";
import { useRef } from "react";
import { useQuery } from "@tanstack/react-query";
import hero from "@/assets/hero-bmw-x5.jpg";
import { CarCard } from "@/components/CarCard";
import { listPublicCars } from "@/lib/cars.functions";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Gearbox Autos — Buy & Sell Used Cars at 0% Commission" },
      { name: "description", content: "Jamshedpur's trusted used car marketplace. Drive home your dream car at 0% commission with no hidden charges." },
      { property: "og:title", content: "Gearbox Autos — Drive home your dream car at 0% Commission" },
      { property: "og:description", content: "Buy and sell quality used cars with full transparency." },
    ],
  }),
  component: Index,
  loader: async ({ context }) =>
    context.queryClient.ensureQueryData({
      queryKey: ["cars", "public"],
      queryFn: () => listPublicCars(),
    }),
});

function Index() {
  const { data: cars = [] } = useQuery({ queryKey: ["cars", "public"], queryFn: () => listPublicCars() });
  const trayRef = useRef<HTMLDivElement>(null);

  const scrollToInventory = () => {
    document.getElementById("inventory-tray")?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  const scrollTray = (dir: -1 | 1) => {
    const el = trayRef.current;
    if (!el) return;
    el.scrollBy({ left: dir * Math.min(el.clientWidth * 0.9, 600), behavior: "smooth" });
  };

  return (
    <>
      <section className="relative min-h-screen">
        <img src={hero} alt="Land Rover Defender at sunset" className="absolute inset-0 h-full w-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-r from-background via-background/85 to-background/20" />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent" />

        <div className="relative container-page pt-44 pb-32 min-h-screen flex flex-col justify-between">
          <div className="max-w-2xl">
            <h1 className="display-h1 text-foreground">
              Drive home <br /> your dream car at <br />
              <span className="text-muted-foreground">0% Commission</span> <br />
              and no hidden charges<span className="text-primary">.</span>
            </h1>
            <div className="mt-8 h-px w-24 bg-border" />
          </div>

          <div className="grid sm:grid-cols-2 gap-5 max-w-3xl">
            <CTA to="/buy" eyebrow="Find your drive" title="Buy a Used Car" Icon={Car} />
            <CTA to="/sell" eyebrow="Get the best value" title="Sell Your Car" Icon={Tag} />
          </div>
        </div>

        <button
          onClick={scrollToInventory}
          aria-label="Scroll to inventory"
          className="absolute bottom-6 left-1/2 -translate-x-1/2 z-10 flex flex-col items-center gap-2 text-muted-foreground hover:text-foreground transition group"
        >
          <span className="text-xs uppercase tracking-widest">Our Inventory</span>
          <span className="h-11 w-11 rounded-full border border-border grid place-items-center group-hover:border-primary animate-bounce">
            <ChevronDown className="h-5 w-5" />
          </span>
        </button>
      </section>

      <section id="inventory-tray" className="relative py-20 border-t border-border/60">
        <div className="container-page">
          <div className="flex items-end justify-between gap-4 mb-8">
            <div>
              <div className="eyebrow">Available now</div>
              <h2 className="display-h1 mt-3 text-3xl md:text-5xl">
                Cars in our <span className="text-muted-foreground">inventory<span className="text-primary">.</span></span>
              </h2>
            </div>
            <div className="hidden md:flex items-center gap-2">
              <button onClick={() => scrollTray(-1)} aria-label="Scroll left" className="h-11 w-11 rounded-full border border-border grid place-items-center hover:border-primary hover:text-primary transition">
                <ChevronLeft className="h-5 w-5" />
              </button>
              <button onClick={() => scrollTray(1)} aria-label="Scroll right" className="h-11 w-11 rounded-full border border-border grid place-items-center hover:border-primary hover:text-primary transition">
                <ChevronRight className="h-5 w-5" />
              </button>
            </div>
          </div>
        </div>

        <div className="relative">
          <div
            ref={trayRef}
            className="flex gap-5 overflow-x-auto snap-x snap-mandatory scroll-smooth px-[max(1.5rem,calc((100vw-1280px)/2+1.5rem))] pb-4 [scrollbar-width:thin]"
          >
            {cars.length === 0 && (
              <div className="text-muted-foreground text-sm py-10">No cars in inventory yet.</div>
            )}
            {cars.map((c) => (
              <div key={c.id} className="snap-start shrink-0 w-[85vw] sm:w-[360px]">
                <CarCard car={c} />
              </div>
            ))}
          </div>
        </div>

        <div className="container-page mt-10 flex justify-center">
          <Link to="/buy" className="surface inline-flex items-center gap-2 px-5 py-3 text-sm hover:border-primary/60 transition">
            View full inventory <ArrowRight className="h-4 w-4 text-primary" />
          </Link>
        </div>
      </section>
    </>
  );
}

function CTA({ to, eyebrow, title, Icon }: { to: string; eyebrow: string; title: string; Icon: any }) {
  return (
    <Link to={to} className="surface flex items-center gap-4 px-5 py-4 hover:border-primary/60 transition group">
      <div className="h-12 w-12 rounded-full border border-border grid place-items-center text-foreground/80">
        <Icon className="h-5 w-5" />
      </div>
      <div className="flex-1">
        <div className="eyebrow">{eyebrow}</div>
        <div className="text-lg font-semibold mt-0.5">{title}</div>
      </div>
      <ArrowRight className="h-5 w-5 text-primary group-hover:translate-x-1 transition" />
    </Link>
  );
}
