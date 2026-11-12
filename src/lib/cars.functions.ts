import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { rowToCar, type CarRow, type Car } from "./cars";
import { nativeInventoryCache } from './native-inventory';
import { PUBLIC_CAR_COLUMNS, PUBLIC_AVAILABLE_STATUS } from './public-car-columns';
import { publicInventoryClient } from './public-inventory-client';

function dbFail(scope: string, error: { message: string }): never {
  console.error(`[DB Error:${scope}]`, error.message);
  throw new Error("Unable to load cars right now. Please try again.");
}

export const listPublicCars = createServerFn({ method: "GET" }).middleware([nativeInventoryCache]).handler(
  async (): Promise<Car[]> => {
    const { data, error } = await publicInventoryClient()
      .from("cars")
      .select(PUBLIC_CAR_COLUMNS)
      .eq("is_active", true)
      .eq("inventory_status", PUBLIC_AVAILABLE_STATUS)
      .order("created_at", { ascending: false });
    if (error) dbFail("listPublicCars", error);
    return ((data ?? []) as unknown as CarRow[]).map(rowToCar);
  },
);

export const getCarBySlug = createServerFn({ method: "GET" })
  .inputValidator((d: { slug: string }) =>
    z.object({ slug: z.string().min(1).max(100) }).parse(d),
  )
  .handler(async ({ data }): Promise<Car | null> => {
    const { data: row, error } = await publicInventoryClient()
      .from("cars")
      .select(PUBLIC_CAR_COLUMNS)
      .eq("slug", data.slug)
      .eq("is_active", true)
      .eq("inventory_status", PUBLIC_AVAILABLE_STATUS)
      .maybeSingle();
    if (error) dbFail("getCarBySlug", error);
    return row ? rowToCar(row as unknown as CarRow) : null;
  });
