import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { supabaseAdmin } from "@/integrations/supabase/client.server";

function dbFail(scope: string, error: { message: string }): never {
  console.error(`[DB Error:${scope}]`, error.message);
  throw new Error("Submission failed. Please try again later.");
}

const phoneRe = /^[0-9+\-\s()]{7,20}$/;

const sellSchema = z.object({
  full_name: z.string().trim().min(1).max(120),
  phone: z.string().trim().regex(phoneRe),
  email: z.string().trim().email().max(255).optional().or(z.literal("")),
  city: z.string().trim().min(1).max(100),
  car_model: z.string().trim().min(1).max(200),
  year: z.number().int().min(1980).max(2100).optional(),
  km: z.number().int().min(0).max(2_000_000).optional(),
});

export const submitSellLead = createServerFn({ method: "POST" })
  .inputValidator((d) => sellSchema.parse(d))
  .handler(async ({ data }) => {
    const { error } = await supabaseAdmin.from("sell_leads").insert({
      ...data,
      email: data.email || null,
    });
    if (error) dbFail("submitSellLead", error);
    return { ok: true as const };
  });

const bookingSchema = z.object({
  car_id: z.string().uuid().optional().nullable(),
  car_name: z.string().trim().max(200).optional(),
  full_name: z.string().trim().min(1).max(120),
  phone: z.string().trim().regex(phoneRe),
  email: z.string().trim().email().max(255).optional().or(z.literal("")),
  preferred_date: z.string().optional(),
  message: z.string().trim().max(1000).optional(),
});

export const submitTestDrive = createServerFn({ method: "POST" })
  .inputValidator((d) => bookingSchema.parse(d))
  .handler(async ({ data }) => {
    const { error } = await supabaseAdmin.from("test_drive_bookings").insert({
      car_id: data.car_id || null,
      car_name: data.car_name || null,
      full_name: data.full_name,
      phone: data.phone,
      email: data.email || null,
      preferred_date: data.preferred_date || null,
      message: data.message || null,
    });
    if (error) dbFail("submitTestDrive", error);
    return { ok: true as const };
  });

const contactSchema = z.object({
  full_name: z.string().trim().min(1).max(120),
  phone: z.string().trim().regex(phoneRe).optional().or(z.literal("")),
  email: z.string().trim().email().max(255),
  subject: z.string().trim().max(200).optional(),
  message: z.string().trim().min(1).max(2000),
});

export const submitContact = createServerFn({ method: "POST" })
  .inputValidator((d) => contactSchema.parse(d))
  .handler(async ({ data }) => {
    const { error } = await supabaseAdmin.from("contact_messages").insert({
      full_name: data.full_name,
      phone: data.phone || null,
      email: data.email,
      subject: data.subject || null,
      message: data.message,
    });
    if (error) dbFail("submitContact", error);
    return { ok: true as const };
  });
