import { createFileRoute, Link } from "@tanstack/react-router";
import { useSuspenseQuery } from "@tanstack/react-query";
import { ArrowRight, MapPin, ShieldCheck, BadgePercent, FileCheck } from "lucide-react";
import { CarCard } from "@/components/CarCard";
import { TrustBar } from "@/components/TrustBar";
import { listPublicCars } from "@/lib/cars.functions";
import { brandOf, brandLabel, NEARBY_AREAS } from "@/lib/seo-areas";
import { breadcrumbSchema, SITE_URL } from "@/lib/seo";
import type { Car } from "@/lib/cars";

const carsQuery = { queryKey: ["cars", "public"], queryFn: () => listPublicCars() } as const;

export const Route = createFileRoute("/used-cars-in-jamshedpur/")({
  head: ({ loaderData }) => {
    const cars = (loaderData as unknown as Car[] | undefined) ?? [];
    return {
    meta: [
      { title: "Used Cars in Jamshedpur — Verified Second Hand Cars | Gearbox Autos" },
      { name: "description", content: "Buy verified second hand cars in Jamshedpur at 0% commission. Compare prices, KMs, fuel & RTO (JH-05), inspect the car yourself, and get free RC transfer help from Gearbox Autos, Sonari." },
      { property: "og:title", content: "Used Cars in Jamshedpur — Gearbox Autos" },
      { property: "og:description", content: "Verified second hand cars for sale in Jamshedpur at 0% commission. Book a free test drive today." },
      { property: "og:url", content: "https://gearboxautos.in/used-cars-in-jamshedpur" },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: [{ rel: "canonical", href: "https://gearboxautos.in/used-cars-in-jamshedpur" }],
    scripts: [
      {
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "CollectionPage",
          name: "Used Cars in Jamshedpur",
          url: "https://gearboxautos.in/used-cars-in-jamshedpur",
          about: { "@id": `${SITE_URL}/#dealership` },
        }),
      },
      {
        type: "application/ld+json",
        children: JSON.stringify(breadcrumbSchema([
          { name: "Home", url: SITE_URL },
          { name: "Used Cars in Jamshedpur", url: `${SITE_URL}/used-cars-in-jamshedpur` },
        ])),
      },
      {
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "ItemList",
          name: "Verified used cars in Jamshedpur",
          numberOfItems: cars.length,
          itemListElement: cars.map((car, index) => ({
            "@type": "ListItem",
            position: index + 1,
            name: `${car.year} ${car.name}`,
            url: `${SITE_URL}/car/${car.slug}`,
          })),
        }),
      },
    ],
    };
  },

  component: UsedCarsJamshedpur,
  loader: async ({ context }) => context.queryClient.ensureQueryData(carsQuery),
});

function UsedCarsJamshedpur() {
  const { data: cars = [] } = useSuspenseQuery(carsQuery);
  const brands = Array.from(new Set(cars.map((c) => brandOf(c.name)).filter(Boolean))).sort();

  return (
    <section className="container-page pt-12 pb-16">
      <div className="eyebrow">Jamshedpur, Jharkhand</div>
      <h1 className="display-h1 mt-4">
        Used cars in <span className="text-primary">Jamshedpur</span>
      </h1>
      <p className="mt-5 text-muted-foreground max-w-2xl leading-relaxed">
        Looking to buy a second hand car in Jamshedpur? Gearbox Autos lists fully verified used cars from local
        owners — every vehicle is inspected, documents are checked, and you deal directly with the owner at{" "}
        <strong className="text-foreground">0% commission</strong>. Visit our showroom near Golden Town, opp. BSS School, Adarsh Nagar, Sonari, or
        book a free test drive on any listing below.
      </p>

      <div className="mt-10 grid gap-4 sm:grid-cols-3">
        <div className="bg-card p-6 border-l-4 border-primary">
          <ShieldCheck className="h-6 w-6 text-primary mb-3" />
          <h2 className="font-head text-xl">Verified Listings</h2>
          <p className="text-sm text-muted-foreground mt-2">Every car is physically inspected and papers verified before it goes live.</p>
        </div>
        <div className="bg-card p-6 border-l-4 border-primary">
          <BadgePercent className="h-6 w-6 text-primary mb-3" />
          <h2 className="font-head text-xl">0% Commission</h2>
          <p className="text-sm text-muted-foreground mt-2">No dealer margin, no hidden charges — the price you see is the owner's ask.</p>
        </div>
        <div className="bg-card p-6 border-l-4 border-primary">
          <FileCheck className="h-6 w-6 text-primary mb-3" />
          <h2 className="font-head text-xl">JH-05 RC Transfer Help</h2>
          <p className="text-sm text-muted-foreground mt-2">We assist with ownership transfer at the Jamshedpur RTO and other JH series RTOs.</p>
        </div>
      </div>

      {brands.length > 0 && (
        <div className="mt-14">
          <h2 className="display-h2">Browse by <span className="text-primary">brand</span></h2>
          <div className="mt-6 flex flex-wrap gap-3">
            {brands.map((b) => (
              <Link
                key={b}
                to="/used-cars-in-jamshedpur/$brand"
                params={{ brand: b }}
                className="border border-border px-5 py-2.5 font-head text-lg tracking-wide hover:bg-primary hover:border-primary hover:text-primary-foreground transition-colors"
              >
                {brandLabel(b)}
              </Link>
            ))}
          </div>
        </div>
      )}

      <div className="mt-14 flex items-end justify-between gap-4">
        <h2 className="display-h2">Available <span className="text-primary">now</span></h2>
        <span className="text-sm text-muted-foreground shrink-0">{cars.length} cars in stock</span>
      </div>
      <div className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {cars.map((c) => <CarCard key={c.id} car={c} />)}
      </div>
      {cars.length === 0 && (
        <p className="mt-8 text-muted-foreground">
          No cars listed right now — check back soon or{" "}
          <a href="https://wa.me/919065591253" className="text-primary underline">WhatsApp us</a> with what you're looking for.
        </p>
      )}

      <TrustBar />

      <div className="mt-16">
        <h2 className="display-h2">Areas we <span className="text-primary">serve</span></h2>
        <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {NEARBY_AREAS.map((a) => (
            <div key={a.name} className="bg-card p-6">
              <div className="flex items-center gap-2 font-head text-xl"><MapPin className="h-4 w-4 text-primary" />{a.name}</div>
              <p className="text-sm text-muted-foreground mt-2">{a.note}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="mt-16 bg-card p-8 md:p-10 border-l-8 border-primary flex flex-col md:flex-row md:items-center gap-6 justify-between">
        <div>
          <h2 className="display-h2">Selling your car instead?</h2>
          <p className="text-muted-foreground mt-2 max-w-lg">List it free with Gearbox Autos and reach genuine buyers across Jamshedpur — still 0% commission.</p>
        </div>
        <Link to="/sell" className="btn-primary px-8 py-4 inline-flex items-center gap-2 shrink-0">
          Sell your car <ArrowRight className="h-4 w-4" />
        </Link>
      </div>
    </section>
  );
}
