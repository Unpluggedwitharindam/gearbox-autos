import { createFileRoute } from "@tanstack/react-router";
import { Search, SlidersHorizontal, RotateCcw, ArrowDown } from "lucide-react";
import { useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import hero from "@/assets/car-creta-front.jpg";
import { CarCard } from "@/components/CarCard";
import { TrustBar } from "@/components/TrustBar";
import { listBuyCars } from "@/lib/buy-inventory.functions";
import { buyOptions, emptyBuyFilters, filterBuyCars, type BuyFilters } from "@/lib/buy-inventory";
import { Button } from "@/components/ui/button";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import type { Car as CarListing } from "@/lib/cars";

export const Route = createFileRoute("/buy")({
  head: ({ loaderData }) => {
    const cars = (loaderData as unknown as CarListing[] | undefined) ?? [];
    return {
    meta: [
      { title: "Buy Second Hand Cars in Jamshedpur — Verified Used Cars | Gearbox Autos" },
      { name: "description", content: "Browse verified second hand cars for sale in Jamshedpur. Compare price, KMs, fuel and RTO, then book a free test drive — 0% commission." },
      { property: "og:title", content: "Buy Second Hand Cars in Jamshedpur — Gearbox Autos" },
      { property: "og:description", content: "Verified used cars for sale in Jamshedpur at 0% commission. Book a test drive today." },
      { property: "og:url", content: "https://gearboxautos.in/buy" },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: [{ rel: "canonical", href: "https://gearboxautos.in/buy" }],
    scripts: [{
      type: "application/ld+json",
      children: JSON.stringify({
        "@context": "https://schema.org",
        "@type": "ItemList",
        name: "Used cars for sale in Jamshedpur",
        numberOfItems: cars.length,
        itemListElement: cars.map((car, index) => ({
          "@type": "ListItem",
          position: index + 1,
          name: `${car.year} ${car.name}`,
          url: `https://gearboxautos.in/car/${car.slug}`,
        })),
      }),
    }],
    };
  },

  component: Buy,
  loader: async ({ context }) =>
    context.queryClient.ensureQueryData({
      queryKey: ["cars", "buy"],
      queryFn: () => listBuyCars(),
    }),
});

function Buy() {
  const initialCars = Route.useLoaderData();
  const { data: cars = [] } = useQuery({ queryKey: ["cars", "buy"], queryFn: () => listBuyCars(), initialData: initialCars });
  const [filters, setFilters] = useState<BuyFilters>({ ...emptyBuyFilters });
  const [expanded, setExpanded] = useState(false);
  const { cars: filtered, error } = useMemo(() => filterBuyCars(cars, filters), [cars, filters]);
  const update = (key: keyof BuyFilters, value: string) => setFilters(previous => ({ ...previous, [key]: value, ...(key === 'make' ? { model: '' } : {}) }));
  const reset = () => { setFilters({ ...emptyBuyFilters }); setExpanded(false); };
  const selector = (field: 'make' | 'model' | 'fuel' | 'transmission', label: string) => (
    <Select value={filters[field] || '__all'} onValueChange={value => update(field, value === '__all' ? '' : value)}>
      <SelectTrigger aria-label={label} className="h-10 min-w-0 border-0 bg-input/60 text-muted-foreground"><SelectValue /></SelectTrigger>
      <SelectContent><SelectItem value="__all">All {label === 'Make' ? 'Makes' : label === 'Model' ? 'Models' : label === 'Fuel' ? 'Fuels' : 'Transmissions'}</SelectItem>
        {buyOptions(cars, field, field === 'model' ? filters.make : '').map(([key, text]) => <SelectItem key={key} value={key}>{text}</SelectItem>)}
      </SelectContent>
    </Select>
  );

  return (
    <section className="relative">
      <img src={hero} alt="" className="absolute right-0 top-0 w-3/5 h-[520px] object-cover opacity-70 [mask-image:linear-gradient(to_left,black,transparent)]" />
      <div className="relative container-page pt-12 pb-10">
        <div className="eyebrow">Inventory</div>
        <h1 className="display-h1 mt-4">Find your <br /><span className="text-muted-foreground">perfect drive<span className="text-primary">.</span></span></h1>
        <p className="mt-5 text-muted-foreground max-w-md">Explore a wide range of quality used cars at the best value.</p>

        <div className="surface mt-10 p-3 grid gap-2 md:grid-cols-[1.5fr_repeat(4,1fr)_auto]">
          <div className="flex min-w-0 items-center gap-2 px-3 py-2.5 rounded-md bg-input/60">
            <Search className="h-4 w-4 text-muted-foreground" />
            <input aria-label="Search inventory" value={filters.q} onChange={(e) => update('q', e.target.value)} placeholder="Search make, model or type..." className="bg-transparent outline-none focus-visible:ring-1 focus-visible:ring-ring text-sm flex-1 min-w-0" />
          </div>
          {selector('make', 'Make')}
          {selector('model', 'Model')}
          {(['min', 'max'] as const).map(key => <input key={key} type="number" min="0" step="1" inputMode="numeric" aria-label={`${key === 'min' ? 'Minimum' : 'Maximum'} price in rupees`} aria-invalid={Boolean(error)} aria-describedby={error ? 'buy-price-error' : undefined} value={filters[key]} onChange={e => update(key, e.target.value)} placeholder={`${key === 'min' ? 'Min' : 'Max'} Price (₹)`} className="min-w-0 w-full rounded-md bg-input/60 px-3 py-2.5 text-sm outline-none focus-visible:ring-1 focus-visible:ring-ring" />)}
          <Button variant="ghost" onClick={() => setExpanded(value => !value)} aria-expanded={expanded} aria-controls="buy-extra-filters" className="h-10 bg-input/60">
            <SlidersHorizontal className="h-4 w-4" /> Filters
          </Button>
        </div>
        {expanded && <div id="buy-extra-filters" className="mt-2 grid gap-2 sm:grid-cols-2">{selector('fuel', 'Fuel')}{selector('transmission', 'Transmission')}</div>}
        {error && <p id="buy-price-error" role="alert" className="mt-3 text-sm text-destructive">{error}</p>}

        <div className="mt-8 flex flex-wrap gap-3 items-center justify-between">
          <div aria-live="polite" data-testid="inventory-count" className="text-sm text-muted-foreground"><span className="text-foreground font-semibold">{filtered.length}</span> Cars Available</div>
          <div className="text-sm flex flex-wrap items-center gap-2 text-muted-foreground">
            <Button variant="ghost" size="sm" onClick={reset}><RotateCcw />Reset Filters</Button>
            <span>Sort by:</span><Select value={filters.sort} onValueChange={value => update('sort', value)}>
              <SelectTrigger aria-label="Sort inventory" className="w-auto min-w-0 border-0 bg-input/60"><SelectValue /></SelectTrigger>
              <SelectContent>{[['latest','Latest Added'],['price-low','Price: Low to High'],['price-high','Price: High to Low'],['year-new','Year: Newest First'],['km-low','Kilometres: Low to High']].map(([value, label]) => <SelectItem key={value} value={value}>{label}</SelectItem>)}</SelectContent>
            </Select>
          </div>
        </div>
        {!filtered.length && !error && <p role="status" className="py-8 text-center text-muted-foreground">No cars match your filters.</p>}

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
