import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { supabaseAdmin } from "@/integrations/supabase/client.server";
import { buildAnalysis } from "./garage/engine";
import { parseVehicleQuestion } from "./garage/parser";
import { loadVerifiedMarketListings } from "./garage/provider.server";
import { UNKNOWN, type InventoryComparable } from "./garage/types";

export const analyzeGarageQuestion = createServerFn({ method: "POST" })
  .inputValidator((input: unknown) => z.object({ question: z.string().trim().min(3).max(2000) }).parse(input))
  .handler(async ({ data }) => {
    const vehicle = parseVehicleQuestion(data.question);
    const { data: cars, error } = await supabaseAdmin.from("cars").select("*").eq("is_active", true).order("created_at", { ascending: false });
    if (error) throw new Error("Garage could not read the current inventory.");
    const normalizedMake = vehicle.make === UNKNOWN ? "" : vehicle.make.toLowerCase();
    const normalizedModel = vehicle.model === UNKNOWN ? "" : vehicle.model.toLowerCase();
    const inventory = (cars ?? []).filter((car) => {
      const name = String(car.name).toLowerCase();
      return (!normalizedMake || name.includes(normalizedMake)) && (!normalizedModel || name.includes(normalizedModel));
    }).slice(0, 20).map((car): InventoryComparable => ({
      id: car.id, name: car.name, slug: car.slug, make: car.make ?? UNKNOWN, model: car.model ?? car.name, variant: car.variant ?? UNKNOWN,
      manufacturingYear: car.manufacturing_year ?? car.year ?? UNKNOWN, registrationYear: car.registration_year ?? UNKNOWN,
      fuel: car.fuel ?? UNKNOWN, transmission: car.transmission ?? UNKNOWN, ownerCount: car.owner_count ?? UNKNOWN, km: car.km ?? UNKNOWN,
      location: car.location ?? UNKNOWN, registrationState: car.registration_state ?? car.rto ?? UNKNOWN, askingPriceInr: car.price_inr,
      status: car.inventory_status ?? (car.is_active ? "in_stock" : "inactive"), listedAt: car.listed_at ?? car.created_at ?? UNKNOWN,
      daysInInventory: car.listed_at || car.created_at ? Math.max(0, Math.floor((Date.now() - new Date(car.listed_at ?? car.created_at).getTime()) / 86_400_000)) : UNKNOWN,
    }));
    const market = await loadVerifiedMarketListings();
    return buildAnalysis(vehicle, inventory, market.listings, market.connected);
  });