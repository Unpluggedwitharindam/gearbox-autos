import { createFileRoute } from "@tanstack/react-router";
import { listPublicCars } from "@/lib/cars.functions";
import { marketplaceAreas } from "@/lib/marketplace-areas";
import { LocalityPage, localityHead } from "@/showcase/locality-page";
const area = marketplaceAreas[2];
export const Route = createFileRoute("/second-hand-cars-in-sonari")({
  loader: ({ context }) =>
    context.queryClient.ensureQueryData({
      queryKey: ["cars", "public"],
      queryFn: () => listPublicCars(),
    }),
  head: () => localityHead(area),
  component: Page,
});
function Page() {
  const cars = Route.useLoaderData();
  return <LocalityPage area={area} cars={cars} />;
}
