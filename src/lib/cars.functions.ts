import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { supabaseAdmin } from "@/integrations/supabase/client.server";
import { rowToCar, type CarRow, type Car } from "./cars";

export const listPublicCars = createServerFn({ method: "GET" }).handler(
  async (): Promise<Car[]> => {
    const { data, error } = await supabaseAdmin
      .from("cars")
      .select("*")
      .eq("is_active", true)
      .order("created_at", { ascending: false });
    if (error) throw new Error(error.message);
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
    if (error) throw new Error(error.message);
    return row ? rowToCar(row as CarRow) : null;
  });
