import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { useSuspenseQuery } from "@tanstack/react-query";
import { ArrowRight } from "lucide-react";
import { CarCard } from "@/components/CarCard";
import { listPublicCars } from "@/lib/cars.functions";
import { brandOf, brandLabel } from "@/lib/seo-areas";

const carsQuery = { queryKey: ["cars", "public"], queryFn: () => listPublicCars() } as const;

export const Route = createFileRoute("/used-cars-in-jamshedpur/$brand")({
  head: ({ params }) => {
    const label = brandLabel(params.brand);
    return {
      meta: [
        { title: `Used ${label} Cars in Jamshedpur — Second Hand ${label} | Gearbox Autos` },
        { name: "description", content: `Verified second hand ${label} cars for sale in Jamshedpur at 0% commission. Compare prices and KMs, inspect the car yourself, and book a free test drive with Gearbox Autos.` },
        { property: "og:title", content: `Used ${label} Cars in Jamshedpur — Gearbox Autos` },
        { property: "og:description", content: `Second hand ${label} cars for sale in Jamshedpur, fully verified at 0% commission.` },
        { property: "og:url", content: `https://gearboxautos.in/used-cars-in-jamshedpur/${params.brand}` },
      ],
      links: [{ rel: "canonical", href: `https://gearboxautos.in/used-cars-in-jamshedpur/${params.brand}` }],
    };
  },

  loader: async ({ context, params }) => {
    const cars = await context.queryClient.ensureQueryData(carsQuery);
    const matches = cars.filter((c) => brandOf(c.name) === params.brand.toLowerCase());
    if (matches.length === 0) throw notFound();
    return { cars: matches };
  },

  component: BrandPage,
});

function BrandPage() {
  const { cars } = Route.useLoaderData();
  useSuspenseQuery(carsQuery); // keep client cache warm
  const { brand } = Route.useParams();
  const label = brandLabel(brand);

  return (
    <section className="container-page pt-12 pb-16">
      <div className="eyebrow">
        <Link to="/used-cars-in-jamshedpur" className="hover:text-primary">Used cars in Jamshedpur</Link> / {label}
      </div>
      <h1 className="display-h1 mt-4">
        Used <span className="text-primary">{label}</span> cars in Jamshedpur
      </h1>
      <p className="mt-5 text-muted-foreground max-w-2xl leading-relaxed">
        {cars.length} verified second hand {label} {cars.length === 1 ? "car" : "cars"} available in Jamshedpur right
        now. Every listing is inspected, priced directly by the owner, and sold at{" "}
        <strong className="text-foreground">0% commission</strong> — with free RC transfer assistance at the
        Jamshedpur RTO.
      </p>

      <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {cars.map((c) => <CarCard key={c.id} car={c} />)}
      </div>

      <div className="mt-14 bg-card p-8 md:p-10 border-l-8 border-primary flex flex-col md:flex-row md:items-center gap-6 justify-between">
        <div>
          <h2 className="display-h2">Don't see the {label} you want?</h2>
          <p className="text-muted-foreground mt-2 max-w-lg">Tell us your budget and model — we'll alert you as soon as a matching car gets listed.</p>
        </div>
        <a href="https://wa.me/919065591253" target="_blank" rel="noopener noreferrer" className="btn-primary px-8 py-4 inline-flex items-center gap-2 shrink-0">
          WhatsApp us <ArrowRight className="h-4 w-4" />
        </a>
      </div>
    </section>
  );
}
