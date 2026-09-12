import { createFileRoute, redirect } from "@tanstack/react-router";

export const Route = createFileRoute("/car/used-cars-in-jamshedpur-honda-amaze-2026")({
  beforeLoad: () => {
    throw redirect({
      to: "/car/$id",
      params: { id: "used-cars-in-jamshedpur-honda-amaze-2019" },
      statusCode: 301,
    });
  },
});