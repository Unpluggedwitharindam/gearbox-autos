import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { CarCard } from "@/components/CarCard";
import { listPublicCars } from "@/lib/cars.functions";

export const Route = createFileRoute("/inventory")({
  head: () => ({ meta: [{ title: "Our Inventory — Gearbox Autos" }, { name: "description", content: "Browse all verified used cars in our inventory." }]}),
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
    <section className="container-page pt-32 pb-12">
      <div className="eyebrow">Our Inventory</div>
      <h1 className="display-h1 mt-4">Every car<span className="text-primary">.</span> <br/><span className="text-muted-foreground">One trusted place.</span></h1>
      <p className="mt-5 text-muted-foreground max-w-xl">Quality assured, fully verified used cars — handpicked for Jamshedpur drivers.</p>
      <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {cars.map((c) => <CarCard key={c.id} car={c} />)}
      </div>
      {cars.length === 0 && <p className="mt-10 text-muted-foreground">No cars in inventory yet.</p>}
    </section>
  );
}
