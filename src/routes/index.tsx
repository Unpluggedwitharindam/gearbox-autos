import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, ChevronLeft, ChevronRight } from "lucide-react";
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
    <div className="container-page py-8">
      {/* Hero bento grid */}
      <div className="grid grid-cols-1 md:grid-cols-4 md:grid-rows-2 gap-4 h-auto md:h-[600px] mb-12">
        <div className="md:col-span-3 bg-card p-8 md:p-12 flex flex-col justify-center border-l-8 border-primary">
          <h1 className="display-h1 mb-6">
            Drive home your dream car at <span className="text-primary">0% commission</span>
          </h1>
          <div className="flex flex-wrap gap-4 mt-2">
            <Link to="/buy" className="btn-primary px-10 py-4">Buy a Car</Link>
            <Link to="/sell" className="border border-border hover:border-primary px-10 py-4 font-head text-lg tracking-wide transition-all">
              Sell a Car
            </Link>
          </div>
        </div>

        <div className="bg-primary text-primary-foreground p-8 flex flex-col justify-between group overflow-hidden relative min-h-[200px]">
          <div className="font-head text-7xl leading-none relative z-10">0%</div>
          <div className="relative z-10">
            <div className="font-head text-2xl leading-none">Commission</div>
            <p className="text-[11px] mt-2 uppercase font-bold tracking-widest opacity-80">No hidden charges, ever</p>
          </div>
          <div className="absolute -right-4 -bottom-6 font-head text-9xl opacity-10 rotate-12 group-hover:rotate-0 transition-transform duration-500">%</div>
        </div>

        <div className="md:col-span-2 bg-card relative overflow-hidden group min-h-[220px]">
          <img
            src={hero}
            alt="Premium used car from the Gearbox Autos inventory"
            className="h-full w-full object-cover grayscale opacity-60 group-hover:grayscale-0 group-hover:opacity-90 transition-all duration-700"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent" />
          <div className="absolute bottom-6 left-6">
            <span className="eyebrow">Premium Selection</span>
            <h2 className="font-head text-2xl mt-1">Jamshedpur's Finest</h2>
          </div>
        </div>

        <div className="md:col-span-2 bg-card p-8 flex items-center gap-8">
          <div className="flex-1">
            <p className="text-[11px] text-muted-foreground font-bold mb-2 uppercase tracking-widest">Expert Curation</p>
            <p className="text-lg leading-snug">
              Every car listed with Gearbox Autos is fully verified — meet the owner directly, inspect it yourself, and
              we handle the RC transfer.
            </p>
          </div>
          <div className="self-stretch w-1 bg-border" />
          <div className="text-center shrink-0">
            <div className="font-head text-4xl text-primary">500+</div>
            <div className="text-[10px] uppercase font-bold tracking-[0.2em] text-muted-foreground">Cars Sold</div>
          </div>
        </div>
      </div>

      {/* Scroll indicator */}
      <button onClick={scrollToInventory} aria-label="Scroll to inventory" className="w-full flex flex-col items-center gap-2 mb-16 group">
        <span className="text-[10px] font-bold uppercase tracking-[0.3em] text-muted-foreground group-hover:text-primary transition-colors">
          Explore Stock
        </span>
        <div className="w-px h-12 bg-gradient-to-b from-primary to-transparent animate-pulse" />
      </button>

      {/* Inventory tray */}
      <div id="inventory-tray" className="mb-8 flex justify-between items-center scroll-mt-24">
        <h2 className="display-h2">Latest <span className="text-primary">Arrivals</span></h2>
        <div className="hidden md:flex gap-2">
          <button onClick={() => scrollTray(-1)} aria-label="Scroll left" className="w-10 h-10 border border-border grid place-items-center hover:bg-primary hover:border-primary hover:text-primary-foreground transition-colors">
            <ChevronLeft className="h-5 w-5" />
          </button>
          <button onClick={() => scrollTray(1)} aria-label="Scroll right" className="w-10 h-10 border border-border grid place-items-center hover:bg-primary hover:border-primary hover:text-primary-foreground transition-colors">
            <ChevronRight className="h-5 w-5" />
          </button>
        </div>
      </div>

      <div ref={trayRef} className="flex gap-6 overflow-x-auto snap-x snap-mandatory scroll-smooth pb-4 [scrollbar-width:thin]">
        {cars.length === 0 && <div className="text-muted-foreground text-sm py-10">No cars in inventory yet.</div>}
        {cars.map((c) => (
          <div key={c.id} className="snap-start shrink-0 w-[85vw] sm:w-[380px]">
            <CarCard car={c} />
          </div>
        ))}
      </div>

      <div className="mt-10 flex justify-center">
        <Link to="/buy" className="inline-flex items-center gap-2 border border-border px-6 py-3 font-head text-lg tracking-wide hover:bg-primary hover:border-primary hover:text-primary-foreground transition-colors">
          View full inventory <ArrowRight className="h-4 w-4" />
        </Link>
      </div>
    </div>
  );
}
