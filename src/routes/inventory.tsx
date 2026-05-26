import { createFileRoute } from "@tanstack/react-router";
import { CarCard } from "@/components/CarCard";
import { cars } from "@/lib/cars";

export const Route = createFileRoute("/inventory")({
  head: () => ({ meta: [{ title: "Our Inventory — Gearbox Autos" }, { name: "description", content: "Browse all verified used cars in our inventory." }]}),
  component: Inventory,
});

function Inventory() {
  const all = [...cars, ...cars, ...cars];
  return (
    <section className="container-page pt-32 pb-12">
      <div className="eyebrow">Our Inventory</div>
      <h1 className="display-h1 mt-4">Every car<span className="text-primary">.</span> <br/><span className="text-muted-foreground">One trusted place.</span></h1>
      <p className="mt-5 text-muted-foreground max-w-xl">Quality assured, fully verified used cars — handpicked for Jamshedpur drivers.</p>
      <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {all.map((c, i) => <CarCard key={c.id + i} car={c} />)}
      </div>
    </section>
  );
}
