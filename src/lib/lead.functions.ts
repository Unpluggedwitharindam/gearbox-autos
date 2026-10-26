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

export const LEAD_STATUSES = [
  "new",
  "contacted",
  "follow_up",
  "test_drive",
  "negotiation",
  "won",
  "lost",
] as const;

export const LEAD_SOURCES = [
  "website",
  "whatsapp",
  "walk_in",
  "phone",
  "referral",
  "other",
] as const;

const phoneRe = /^[0-9+\-\s()]{7,20}$/;

const leadSchema = z.object({
  full_name: z.string().trim().min(1).max(120),
  phone: z.string().trim().regex(phoneRe),
  email: z.string().trim().email().max(255).optional().or(z.literal("")),
  source: z.enum(LEAD_SOURCES).default("other"),
  status: z.enum(LEAD_STATUSES).default("new"),
  car_id: z.string().uuid().optional().nullable(),
  car_name: z.string().trim().max(200).optional().nullable(),
  notes: z.string().trim().max(2000).optional().nullable(),
});

export const adminListLeadsLms = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    await assertAdmin(context.userId);
    const { data, error } = await supabaseAdmin
      .from("leads")
      .select("*")
      .order("created_at", { ascending: false });
    if (error) dbFail("adminListLeadsLms", error);
    return data;
  });

export const adminCreateLead = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d) => leadSchema.parse(d))
  .handler(async ({ data, context }) => {
    await assertAdmin(context.userId);
    const { error } = await supabaseAdmin.from("leads").insert({
      full_name: data.full_name,
      phone: data.phone,
      email: data.email || null,
      source: data.source,
      status: data.status,
      car_id: data.car_id || null,
      car_name: data.car_name || null,
      notes: data.notes || null,
      created_by: context.userId,
    });
    if (error) dbFail("adminCreateLead", error);
    return { ok: true as const };
  });

export const adminUpdateLead = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d) =>
    leadSchema.partial().extend({ id: z.string().uuid() }).parse(d),
  )
  .handler(async ({ data, context }) => {
    await assertAdmin(context.userId);
    const { id, ...fields } = data;
    const update: Record<string, unknown> = {};
    if (fields.full_name !== undefined) update.full_name = fields.full_name;
    if (fields.phone !== undefined) update.phone = fields.phone;
    if (fields.email !== undefined) update.email = fields.email || null;
    if (fields.source !== undefined) update.source = fields.source;
    if (fields.status !== undefined) update.status = fields.status;
    if (fields.car_id !== undefined) update.car_id = fields.car_id || null;
    if (fields.car_name !== undefined) update.car_name = fields.car_name || null;
    if (fields.notes !== undefined) update.notes = fields.notes || null;
    const { error } = await supabaseAdmin.from("leads").update(update).eq("id", id);
    if (error) dbFail("adminUpdateLead", error);
    return { ok: true as const };
  });

export const adminDeleteLead = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d) => z.object({ id: z.string().uuid() }).parse(d))
  .handler(async ({ data, context }) => {
    await assertAdmin(context.userId);
    const { error } = await supabaseAdmin.from("leads").delete().eq("id", data.id);
    if (error) dbFail("adminDeleteLead", error);
    return { ok: true as const };
  });
