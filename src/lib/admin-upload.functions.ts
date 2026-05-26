import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";
import { supabaseAdmin } from "@/integrations/supabase/client.server";

const BUCKET = "car-images";
const MAX_BYTES = 5 * 1024 * 1024;
const ALLOWED = ["image/jpeg", "image/png", "image/webp", "image/gif"];

async function assertAdmin(userId: string) {
  const { data, error } = await supabaseAdmin
    .from("user_roles")
    .select("role")
    .eq("user_id", userId)
    .eq("role", "admin")
    .maybeSingle();
  if (error) {
    console.error("[DB Error:assertAdmin]", error.message);
    throw new Error("Unable to verify access. Please try again.");
  }
  if (!data) throw new Error("Forbidden: admin role required");
}

export const uploadCarImage = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d) =>
    z
      .object({
        slug: z.string().min(1).max(100).regex(/^[a-z0-9-]+$/i),
        filename: z.string().min(1).max(200),
        contentType: z.string().min(1).max(100),
        // base64-encoded file content (without data URL prefix)
        base64: z.string().min(1),
      })
      .parse(d),
  )
  .handler(async ({ data, context }) => {
    await assertAdmin(context.userId);
    if (!ALLOWED.includes(data.contentType)) {
      throw new Error("Unsupported image type");
    }
    const buf = Buffer.from(data.base64, "base64");
    if (buf.byteLength > MAX_BYTES) throw new Error("Image exceeds 5MB");
    const ext = (data.filename.split(".").pop() || "jpg").toLowerCase().replace(/[^a-z0-9]/g, "");
    const path = `${data.slug}/${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${ext || "jpg"}`;
    const { error } = await supabaseAdmin.storage.from(BUCKET).upload(path, buf, {
      cacheControl: "3600",
      upsert: false,
      contentType: data.contentType,
    });
    if (error) {
      console.error("[Storage Error:uploadCarImage]", error.message);
      throw new Error("Upload failed. Please try again.");
    }
    const { data: pub } = supabaseAdmin.storage.from(BUCKET).getPublicUrl(path);
    return { url: pub.publicUrl };
  });
