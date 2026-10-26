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
  "test_drive",
  "negotiation",
  "won",
  "lost",
] as const;

export const LEAD_TYPES = ["buyer", "seller", "general"] as const;

export const LEAD_SOURCES = [
  "website",
  "test_drive_booking",
  "sell_form",
  "whatsapp",
  "instagram",
  "olx",
  "walk_in",
  "phone",
  "referral",
  "other",
] as const;

export const LEAD_PRIORITIES = ["hot", "warm", "cold"] as const;

const phoneRe = /^[0-9+\-\s()]{7,20}$/;

const leadSchema = z.object({
  full_name: z.string().trim().min(1).max(120),
  phone: z.string().trim().regex(phoneRe),
  email: z.string().trim().email().max(255).optional().or(z.literal("")),
  city: z.string().trim().max(100).optional().nullable(),
  lead_type: z.enum(LEAD_TYPES).default("buyer"),
  source: z.enum(LEAD_SOURCES).default("other"),
  status: z.enum(LEAD_STATUSES).default("new"),
  priority: z.enum(LEAD_PRIORITIES).default("warm"),
  car_id: z.string().uuid().optional().nullable(),
  car_name: z.string().trim().max(200).optional().nullable(),
  budget_inr: z.number().int().min(0).max(100_000_000).optional().nullable(),
  follow_up_date: z.string().optional().nullable(),
  lost_reason: z.string().trim().max(500).optional().nullable(),
  notes: z.string().trim().max(2000).optional().nullable(),
});

export type LeadRecord = {
  id: string;
  full_name: string;
  phone: string;
  email: string | null;
  city: string | null;
  lead_type: string;
  source: string;
  status: string;
  priority: string;
  car_id: string | null;
  car_name: string | null;
  budget_inr: number | null;
  follow_up_date: string | null;
  lost_reason: string | null;
  notes: string | null;
  created_at: string;
  updated_at: string;
};

export type LeadNote = {
  id: string;
  lead_id: string;
  note: string;
  created_at: string;
};

export const adminListLeadsLms = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    await assertAdmin(context.userId);
    const { data, error } = await supabaseAdmin
      .from("leads")
      .select("*")
      .order("created_at", { ascending: false });
    if (error) dbFail("adminListLeadsLms", error);
    return data as LeadRecord[];
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
      city: data.city || null,
      lead_type: data.lead_type,
      source: data.source,
      status: data.status,
      priority: data.priority,
      car_id: data.car_id || null,
      car_name: data.car_name || null,
      budget_inr: data.budget_inr ?? null,
      follow_up_date: data.follow_up_date || null,
      lost_reason: data.lost_reason || null,
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
    for (const key of [
      "full_name",
      "phone",
      "city",
      "lead_type",
      "source",
      "status",
      "priority",
      "car_name",
      "budget_inr",
      "follow_up_date",
      "lost_reason",
      "notes",
    ] as const) {
      if (fields[key] !== undefined) update[key] = fields[key] || null;
    }
    if (fields.full_name !== undefined) update.full_name = fields.full_name;
    if (fields.phone !== undefined) update.phone = fields.phone;
    if (fields.lead_type !== undefined) update.lead_type = fields.lead_type;
    if (fields.source !== undefined) update.source = fields.source;
    if (fields.status !== undefined) update.status = fields.status;
    if (fields.priority !== undefined) update.priority = fields.priority;
    if (fields.email !== undefined) update.email = fields.email || null;
    if (fields.car_id !== undefined) update.car_id = fields.car_id || null;
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

export const adminListLeadNotes = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d) => z.object({ lead_id: z.string().uuid() }).parse(d))
  .handler(async ({ data, context }) => {
    await assertAdmin(context.userId);
    const { data: notes, error } = await supabaseAdmin
      .from("lead_notes")
      .select("id, lead_id, note, created_at")
      .eq("lead_id", data.lead_id)
      .order("created_at", { ascending: false });
    if (error) dbFail("adminListLeadNotes", error);
    return notes as LeadNote[];
  });

export const adminAddLeadNote = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d) =>
    z
      .object({
        lead_id: z.string().uuid(),
        note: z.string().trim().min(1).max(2000),
      })
      .parse(d),
  )
  .handler(async ({ data, context }) => {
    await assertAdmin(context.userId);
    const { error } = await supabaseAdmin.from("lead_notes").insert({
      lead_id: data.lead_id,
      note: data.note,
      created_by: context.userId,
    });
    if (error) dbFail("adminAddLeadNote", error);
    return { ok: true as const };
  });

export const adminGetLeadFunnel = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    await assertAdmin(context.userId);
    const { data, error } = await supabaseAdmin.from("leads").select("status");
    if (error) dbFail("adminGetLeadFunnel", error);
    const funnel: Record<string, number> = {};
    for (const row of data ?? []) {
      funnel[row.status] = (funnel[row.status] ?? 0) + 1;
    }
    return {
      total: data?.length ?? 0,
      active: (data ?? []).filter((r) => r.status !== "won" && r.status !== "lost").length,
      byStatus: funnel,
    };
  });
