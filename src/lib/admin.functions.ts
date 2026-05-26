import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";
import { supabaseAdmin } from "@/integrations/supabase/client.server";

function dbFail(scope: string, error: { message: string }): never {
  console.error(`[DB Error:${scope}]`, error.message);
  throw new Error("An unexpected error occurred. Please try again.");
}

async function assertAdmin(userId: string) {
  const { data, error } = await supabaseAdmin
    .from("user_roles")
    .select("role")
    .eq("user_id", userId)
    .eq("role", "admin")
    .maybeSingle();
  if (error) dbFail("assertAdmin", error);
  if (!data) throw new Error("Forbidden: admin role required");
}

export const checkIsAdmin = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    const { data, error } = await supabaseAdmin
      .from("user_roles")
      .select("role")
      .eq("user_id", context.userId)
      .eq("role", "admin")
      .maybeSingle();
    if (error) dbFail("checkIsAdmin", error);
    return { isAdmin: !!data };
  });

export const adminListCars = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    await assertAdmin(context.userId);
    const { data, error } = await supabaseAdmin
      .from("cars")
      .select("*")
      .order("created_at", { ascending: false });
    if (error) dbFail("adminListCars", error);
    return data;
  });

const carSchema = z.object({
  id: z.string().uuid().optional(),
  slug: z.string().min(1).max(100).regex(/^[a-z0-9-]+$/i),
  name: z.string().min(1).max(200),
  price_inr: z.number().int().min(0),
  year: z.number().int().min(1980).max(2100),
  km: z.number().int().min(0),
  rto: z.string().min(1).max(20),
  location: z.string().min(1).max(100),
  fuel: z.string().min(1).max(40),
  transmission: z.string().min(1).max(40),
  image_url: z.string().url().max(500).or(z.literal("")),
  images: z.array(z.string().url().max(500)).max(5).default([]),
  features: z.array(z.string().max(120)).max(30),
  description: z.string().max(2000).optional().nullable(),
  is_active: z.boolean(),
});

export const adminUpsertCar = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d) => carSchema.parse(d))
  .handler(async ({ data, context }) => {
    await assertAdmin(context.userId);
    const { error } = await supabaseAdmin.from("cars").upsert(data, { onConflict: "id" });
    if (error) dbFail("adminUpsertCar", error);
    return { ok: true as const };
  });

export const adminDeleteCar = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d) => z.object({ id: z.string().uuid() }).parse(d))
  .handler(async ({ data, context }) => {
    await assertAdmin(context.userId);
    const { error } = await supabaseAdmin.from("cars").delete().eq("id", data.id);
    if (error) dbFail("adminDeleteCar", error);
    return { ok: true as const };
  });

export const adminListLeads = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    await assertAdmin(context.userId);
    const { data, error } = await supabaseAdmin
      .from("sell_leads")
      .select("*")
      .order("created_at", { ascending: false });
    if (error) dbFail("adminListLeads", error);
    return data;
  });

export const adminListBookings = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    await assertAdmin(context.userId);
    const { data, error } = await supabaseAdmin
      .from("test_drive_bookings")
      .select("*")
      .order("created_at", { ascending: false });
    if (error) dbFail("adminListBookings", error);
    return data;
  });

export const adminListMessages = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    await assertAdmin(context.userId);
    const { data, error } = await supabaseAdmin
      .from("contact_messages")
      .select("*")
      .order("created_at", { ascending: false });
    if (error) dbFail("adminListMessages", error);
    return data;
  });

export const adminGetCounts = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    await assertAdmin(context.userId);
    const [cars, leads, bookings, messages] = await Promise.all([
      supabaseAdmin.from("cars").select("*", { count: "exact", head: true }),
      supabaseAdmin.from("sell_leads").select("*", { count: "exact", head: true }),
      supabaseAdmin.from("test_drive_bookings").select("*", { count: "exact", head: true }),
      supabaseAdmin.from("contact_messages").select("*", { count: "exact", head: true }),
    ]);
    return {
      cars: cars.count ?? 0,
      leads: leads.count ?? 0,
      bookings: bookings.count ?? 0,
      messages: messages.count ?? 0,
    };
  });
