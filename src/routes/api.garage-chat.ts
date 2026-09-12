import { createFileRoute } from "@tanstack/react-router";
import { streamText, type ModelMessage } from "ai";
import { z } from "zod";
import { createGarageAi, withGarageRunId } from "@/lib/ai-gateway.server";
import { supabaseAdmin } from "@/integrations/supabase/client.server";
import { parseVehicleQuestion } from "@/lib/garage/parser";
import { buildAnalysis } from "@/lib/garage/engine";
import { loadVerifiedMarketListings } from "@/lib/garage/provider.server";
import { UNKNOWN, type InventoryComparable } from "@/lib/garage/types";

const Body = z.object({ messages: z.array(z.object({ role: z.enum(["user", "assistant"]), content: z.string().max(8000) })).min(1).max(30) });

const SYSTEM = `You are Garage, the Indian used-car intelligence analyst for Gearbox Autos in Jamshedpur.
Be analytical, conservative, transparent, dealer-aware and specific to Indian ownership and resale realities.
Never invent a listing, price, kilometre figure, owner count, source, market statistic, analysis count, or inventory vehicle.
The deterministic evidence JSON below is authoritative. Never override its valuation or claim external evidence when providerStatus is unavailable.
If required vehicle facts are missing, ask only for the missing facts before giving a valuation.
Clearly distinguish asking price, fair market value, dealer buying price, recommended listing price and expected closing price.
When external evidence is unavailable, say so plainly and still help with inspection, ownership, negotiation and inventory-grounded advice without quoting a market value.
Use Indian rupees and lakh formatting. Keep answers concise but explain every conclusion.`;

async function anonymousSessionId(request: Request) {
  const forwarded = request.headers.get("cf-connecting-ip") ?? request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "unknown";
  const bytes = new TextEncoder().encode(`garage:${forwarded}`);
  const digest = await crypto.subtle.digest("SHA-256", bytes);
  return Array.from(new Uint8Array(digest)).map((byte) => byte.toString(16).padStart(2, "0")).join("");
}

async function evidenceFor(question: string) {
  const vehicle = parseVehicleQuestion(question);
  const [{ data: rows }, market] = await Promise.all([
    supabaseAdmin.from("cars").select("*").eq("is_active", true).order("created_at", { ascending: false }),
    loadVerifiedMarketListings(),
  ]);
  const inventory = (rows ?? []).map((car): InventoryComparable => ({
    id: car.id, name: car.name, slug: car.slug, make: car.make ?? UNKNOWN, model: car.model ?? car.name, variant: car.variant ?? UNKNOWN,
    manufacturingYear: car.manufacturing_year ?? car.year, registrationYear: car.registration_year ?? UNKNOWN, fuel: car.fuel,
    transmission: car.transmission, ownerCount: car.owner_count ?? UNKNOWN, km: car.km, location: car.location,
    registrationState: car.registration_state ?? car.rto, askingPriceInr: car.price_inr, status: car.inventory_status,
    listedAt: car.listed_at ?? car.created_at, daysInInventory: Math.max(0, Math.floor((Date.now() - new Date(car.listed_at ?? car.created_at).getTime()) / 86_400_000)),
  })).filter((car) => {
    const make = vehicle.make === UNKNOWN ? "" : vehicle.make.toLowerCase();
    const model = vehicle.model === UNKNOWN ? "" : vehicle.model.toLowerCase();
    return (!make || car.name.toLowerCase().includes(make)) && (!model || car.name.toLowerCase().includes(model));
  }).slice(0, 20);
  return buildAnalysis(vehicle, inventory, market.listings, market.connected);
}

export const Route = createFileRoute("/api/garage-chat")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        const started = Date.now();
        try {
          const body = Body.parse(await request.json());
          const latest = [...body.messages].reverse().find((message) => message.role === "user")?.content ?? "";
          const sessionId = await anonymousSessionId(request);
          const oneHourAgo = new Date(Date.now() - 3_600_000).toISOString();
          const { count } = await supabaseAdmin.from("garage_queries").select("id", { count: "exact", head: true }).eq("session_id", sessionId).gte("created_at", oneHourAgo);
          if ((count ?? 0) >= 15) return Response.json({ message: "Garage has reached its hourly question limit. Please try again later." }, { status: 429, headers: { "Retry-After": "3600" } });
          const evidence = await evidenceFor(latest);
          const key = process.env["LOVABLE_API_KEY"];
          if (!key) return Response.json({ message: "Garage AI is not configured." }, { status: 500 });
          const gateway = createGarageAi(key, request.headers.get("X-Lovable-AIG-Run-ID") ?? undefined);
          const result = streamText({
            model: gateway.provider.responses("openai/gpt-6-astra"),
            system: `${SYSTEM}\n\nCURRENT VERIFIED EVIDENCE JSON:\n${JSON.stringify(evidence)}`,
            messages: body.messages as ModelMessage[],
            providerOptions: { openai: { forceReasoning: true, reasoningEffort: "medium", reasoningSummary: "auto", store: false, include: ["reasoning.encrypted_content"] } },
            maxRetries: 2,
            onFinish: async () => {
              const status = evidence.valuation.status === "available" ? "completed" : evidence.providerStatus === "unavailable" ? "provider_unavailable" : "insufficient_data";
              const { error } = await supabaseAdmin.from("garage_queries").insert({ session_id: sessionId, question: latest, parsed_vehicle: evidence.vehicle, status, internal_match_count: evidence.inventoryComparables.length, external_match_count: evidence.externalComparables.length, latency_ms: Date.now() - started });
              if (error) console.error("[Garage query log]", error.message);
            },
          });
          return withGarageRunId(result.toTextStreamResponse(), gateway);
        } catch (error) {
          console.error("[Garage chat]", error);
          const message = error instanceof Error ? error.message : "Garage could not answer right now.";
          const status = message.includes("credits") ? 402 : message.includes("rate") ? 429 : 400;
          return Response.json({ message }, { status });
        }
      },
    },
  },
});