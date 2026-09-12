import { createFileRoute, Outlet } from "@tanstack/react-router";

export const Route = createFileRoute("/used-cars-in-jamshedpur")({
  component: UsedCarsLayout,
});

function UsedCarsLayout() {
  return <Outlet />;
}
