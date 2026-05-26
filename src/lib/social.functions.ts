import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";
import { supabaseAdmin } from "@/integrations/supabase/client.server";

async function assertAdmin(userId: string) {
  const { data, error } = await supabaseAdmin
    .from("user_roles").select("role").eq("user_id", userId).eq("role", "admin").maybeSingle();
  if (error) throw new Error("Auth check failed");
  if (!data) throw new Error("Forbidden: admin role required");
}

export const generateCarCaption = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d) => z.object({ carId: z.string().uuid() }).parse(d))
  .handler(async ({ data, context }) => {
    await assertAdmin(context.userId);

    const { data: car, error } = await supabaseAdmin
      .from("cars").select("*").eq("id", data.carId).maybeSingle();
    if (error || !car) throw new Error("Car not found");

    const key = process.env.LOVABLE_API_KEY;
    if (!key) throw new Error("AI not configured");

    const priceStr = `₹${Number(car.price_inr).toLocaleString("en-IN")}`;
    const featuresStr = (car.features ?? []).slice(0, 8).join(", ") || "well maintained";

    const prompt = `You are a social media expert for Gearbox Autos, a used car dealership in Jamshedpur, India. Write an engaging WhatsApp share caption for this car listing.

Car: ${car.name}
Year: ${car.year}
KMs: ${Number(car.km).toLocaleString("en-IN")}
Fuel: ${car.fuel}
Transmission: ${car.transmission}
Location: ${car.location} (${car.rto})
Price: ${priceStr}
Features: ${featuresStr}
Description: ${car.description ?? ""}

Rules:
- 3-5 short lines, punchy and exciting, use 2-3 relevant emojis
- Include price, year, KMs, fuel
- End with a clear call-to-action (DM / call to book test drive)
- Then on a NEW line, exactly 5 highly optimized hashtags (mix brand + city + niche like #UsedCars #Jamshedpur #GearboxAutos etc.)
- No markdown, no quotes, plain text only.`;

    const res = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${key}`,
      },
      body: JSON.stringify({
        model: "google/gemini-2.5-flash",
        messages: [{ role: "user", content: prompt }],
      }),
    });

    if (!res.ok) {
      const txt = await res.text();
      console.error("[AI error]", res.status, txt);
      if (res.status === 429) throw new Error("AI rate limit hit. Try again in a moment.");
      if (res.status === 402) throw new Error("AI credits exhausted. Add credits in Workspace settings.");
      throw new Error("Caption generation failed");
    }
    const json = await res.json();
    const caption = json?.choices?.[0]?.message?.content?.trim();
    if (!caption) throw new Error("Empty caption");

    return { caption, name: car.name, slug: car.slug };
  });
