import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { CarCard } from "@/components/CarCard";
import { listPublicCars } from "@/lib/cars.functions";

export const Route = createFileRoute("/inventory")({
  head: ({ loaderData }) => ({
    meta: [
      { title: "Used Car Inventory in Jamshedpur — Gearbox Autos" },
      { name: "description", content: "Full inventory of verified used cars available in Jamshedpur, Jharkhand — hatchbacks, sedans and SUVs with transparent pricing." },
      { property: "og:title", content: "Used Car Inventory in Jamshedpur — Gearbox Autos" },
      { property: "og:description", content: "Every verified second hand car we have in stock in Jamshedpur." },
      { property: "og:url", content: "https://gearboxautos.in/inventory" },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: [{ rel: "canonical", href: "https://gearboxautos.in/inventory" }],
    scripts: [{
      type: "application/ld+json",
      children: JSON.stringify({
        "@context": "https://schema.org",
        "@type": "ItemList",
        name: "Gearbox Autos used car inventory",
        numberOfItems: loaderData?.length ?? 0,
        itemListElement: (loaderData ?? []).map((car, index) => ({
          "@type": "ListItem",
          position: index + 1,
          name: `${car.year} ${car.name}`,
          url: `https://gearboxautos.in/car/${car.slug}`,
        })),
      }),
    }],
  }),

  component: Inventory,
  loader: async ({ context }) =>
    context.queryClient.ensureQueryData({
      queryKey: ["cars", "public"],
      queryFn: () => listPublicCars(),
    }),
});

function Inventory() {
  const { data: cars = [] } = useQuery({ queryKey: ["cars", "public"], queryFn: () => listPublicCars() });
  return (
    <section className="container-page pt-12 pb-12">
      <div className="eyebrow">Our Inventory</div>
      <h1 className="display-h1 mt-4">Every car<span className="text-primary">.</span> <br /><span className="text-muted-foreground"> One trusted place.</span></h1>
      <p className="mt-5 text-muted-foreground max-w-xl">Quality assured, fully verified used cars — handpicked for Jamshedpur drivers.</p>
      <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {cars.map((c) => <CarCard key={c.id} car={c} />)}
      </div>
      {cars.length === 0 && <p className="mt-10 text-muted-foreground">No cars in inventory yet.</p>}
    </section>
  );
}
