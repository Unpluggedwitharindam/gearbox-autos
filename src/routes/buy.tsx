import { createFileRoute } from "@tanstack/react-router";
import { Search, SlidersHorizontal, ChevronDown, ArrowDown } from "lucide-react";
import { useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import hero from "@/assets/inventory-hero.png";
import { CarCard } from "@/components/CarCard";
import { TrustBar } from "@/components/TrustBar";
import { listPublicCars } from "@/lib/cars.functions";

export const Route = createFileRoute("/buy")({
  head: () => ({ meta: [
    { title: "Buy a Used Car — Gearbox Autos" },
    { name: "description", content: "Explore a wide range of quality used cars at the best value in Jamshedpur." },
  ]}),
  component: Buy,
  loader: async ({ context }) =>
    context.queryClient.ensureQueryData({
      queryKey: ["cars", "public"],
      queryFn: () => listPublicCars(),
    }),
});

function Buy() {
  const { data: cars = [] } = useQuery({ queryKey: ["cars", "public"], queryFn: () => listPublicCars() });
  const [q, setQ] = useState("");

  const filtered = useMemo(() => {
    const s = q.trim().toLowerCase();
    if (!s) return cars;
    return cars.filter((c) => c.name.toLowerCase().includes(s) || c.fuel.toLowerCase().includes(s));
  }, [cars, q]);

  return (
    <section className="relative">
      <img src={hero} alt="" className="absolute right-0 top-0 w-3/5 h-[520px] object-cover opacity-70 [mask-image:linear-gradient(to_left,black,transparent)]" />
      <div className="relative container-page pt-32 pb-10">
        <div className="eyebrow">Inventory</div>
        <h1 className="display-h1 mt-4">Find your <br /><span className="text-muted-foreground">perfect drive<span className="text-primary">.</span></span></h1>
        <p className="mt-5 text-muted-foreground max-w-md">Explore a wide range of quality used cars at the best value.</p>

        <div className="surface mt-10 p-3 grid gap-2 md:grid-cols-[1.5fr_repeat(4,1fr)_auto]">
          <div className="flex items-center gap-2 px-3 py-2.5 rounded-md bg-input/60">
            <Search className="h-4 w-4 text-muted-foreground" />
            <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search make, model or type..." className="bg-transparent outline-none text-sm flex-1" />
          </div>
          {["All Makes", "All Models", "Min Price", "Max Price"].map((p) => (
            <button key={p} className="flex items-center justify-between rounded-md bg-input/60 px-3 py-2.5 text-sm">
              <span className="text-muted-foreground">{p}</span><ChevronDown className="h-4 w-4" />
            </button>
          ))}
          <button className="flex items-center gap-2 rounded-md bg-input/60 px-4 py-2.5 text-sm">
            <SlidersHorizontal className="h-4 w-4" /> Filters
          </button>
        </div>

        <div className="mt-8 flex items-center justify-between">
          <div className="text-sm text-muted-foreground"><span className="text-foreground font-semibold">{filtered.length}</span> Cars Available</div>
          <div className="text-sm flex items-center gap-2 text-muted-foreground">Sort by: <button className="flex items-center gap-1 rounded-md bg-input/60 px-3 py-1.5">Latest Added <ChevronDown className="h-3 w-3" /></button></div>
        </div>

        <div className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {filtered.map((c) => <CarCard key={c.id} car={c} />)}
        </div>

        <TrustBar />
        <div className="mt-6 flex justify-end items-center gap-3 text-sm text-muted-foreground">
          Scroll to explore <span className="h-10 w-10 rounded-full border border-border grid place-items-center"><ArrowDown className="h-4 w-4" /></span>
        </div>
      </div>
    </section>
  );
}
