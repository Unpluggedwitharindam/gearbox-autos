import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { supabaseAdmin } from "@/integrations/supabase/client.server";
import { rowToCar, type CarRow, type Car } from "./cars";

function dbFail(scope: string, error: { message: string }): never {
  console.error(`[DB Error:${scope}]`, error.message);
  throw new Error("Unable to load cars right now. Please try again.");
}

export const listPublicCars = createServerFn({ method: "GET" }).handler(
  async (): Promise<Car[]> => {
    const { data, error } = await supabaseAdmin
      .from("cars")
      .select("*")
      .eq("is_active", true)
      .order("created_at", { ascending: false });
    if (error) dbFail("listPublicCars", error);
    return (data as CarRow[]).map(rowToCar);
  },
);

export const getCarBySlug = createServerFn({ method: "GET" })
  .inputValidator((d: { slug: string }) =>
    z.object({ slug: z.string().min(1).max(100) }).parse(d),
  )
  .handler(async ({ data }): Promise<Car | null> => {
    const { data: row, error } = await supabaseAdmin
      .from("cars")
      .select("*")
      .eq("slug", data.slug)
      .eq("is_active", true)
      .maybeSingle();
    if (error) dbFail("getCarBySlug", error);
    return row ? rowToCar(row as CarRow) : null;
  });
