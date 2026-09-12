import { createServerFn } from "@tanstack/react-start";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";
import { supabaseAdmin } from "@/integrations/supabase/client.server";
import { calculateValuation, rankComparables } from "./garage/engine";
import { loadVerifiedMarketListings } from "./garage/provider.server";
import { UNKNOWN, type VehicleProfile } from "./garage/types";

async function assertAdmin(userId: string) {
  const { data, error } = await supabaseAdmin.from("user_roles").select("role").eq("user_id", userId).eq("role", "admin").maybeSingle();
  if (error) throw new Error("Unable to verify admin access.");
  if (!data) throw new Error("Forbidden: admin role required");
}

const average = (values: number[]) => values.length ? Math.round(values.reduce((sum, value) => sum + value, 0) / values.length) : null;
const daysBetween = (start: string, end = new Date().toISOString()) => Math.max(0, Math.floor((new Date(end).getTime() - new Date(start).getTime()) / 86_400_000));

export const getGarageDashboard = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    await assertAdmin(context.userId);
    const [{ data: cars, error }, market] = await Promise.all([
      supabaseAdmin.from("cars").select("*").order("created_at", { ascending: false }),
      loadVerifiedMarketListings(),
    ]);
    if (error) throw new Error("Unable to load Garage intelligence.");
    const rows = cars ?? [];
    const inStock = rows.filter((car) => car.inventory_status === "in_stock" && car.is_active);
    const sold = rows.filter((car) => car.inventory_status === "sold");
    const acquisitionPrices = rows.flatMap((car) => car.acquisition_price_inr == null ? [] : [car.acquisition_price_inr]);
    const soldPrices = sold.flatMap((car) => car.sold_price_inr == null ? [] : [car.sold_price_inr]);
    const soldMargins = sold.flatMap((car) => car.sold_price_inr == null || car.acquisition_price_inr == null ? [] : [car.sold_price_inr - car.acquisition_price_inr]);
    const inventoryAges = inStock.map((car) => daysBetween(car.listed_at ?? car.created_at));
    const daysToSell = sold.flatMap((car) => !car.sold_at ? [] : [daysBetween(car.listed_at ?? car.created_at, car.sold_at)]);
    const vehicles = rows.map((car) => {
      const vehicle: VehicleProfile = {
        make: car.make ?? UNKNOWN,
        model: car.model ?? car.name,
        variant: car.variant ?? UNKNOWN,
        manufacturingYear: car.manufacturing_year ?? car.year,
        registrationYear: car.registration_year ?? UNKNOWN,
        fuel: car.fuel,
        transmission: car.transmission,
        ownerCount: car.owner_count ?? UNKNOWN,
        km: car.km,
        location: car.location,
        registrationState: car.registration_state ?? car.rto,
      };
      const ranked = rankComparables(vehicle, market.listings);
      const valuation = calculateValuation(car.price_inr, ranked.comparables, market.connected);
      let recommendation = "Add verified market data";
      let difference: number | null = null;
      let marketMedian: number | null = null;
      let garageScore: number | null = null;
      if (valuation.status === "available") {
        marketMedian = valuation.statistics.median;
        difference = car.price_inr - marketMedian;
        garageScore = valuation.garageScore;
        recommendation = difference > marketMedian * 0.04 ? `Review price; currently ₹${Math.abs(difference).toLocaleString("en-IN")} above median` : difference < -marketMedian * 0.04 ? "Priced below market; review margin opportunity" : "Price is close to verified market median";
      }
      return {
        id: car.id,
        name: car.name,
        status: car.inventory_status,
        askingPrice: car.price_inr,
        acquisitionPrice: car.acquisition_price_inr,
        daysInInventory: daysBetween(car.listed_at ?? car.created_at, car.sold_at ?? undefined),
        marketMedian,
        difference,
        garageScore,
        comparableCount: ranked.comparables.length,
        recommendation,
      };
    });
    return {
      providerConnected: market.connected,
      sourceStatuses: market.sourceStatuses,
      metrics: {
        totalInventory: rows.length,
        inStock: inStock.length,
        averageInventoryAge: average(inventoryAges),
        averageDaysToSell: average(daysToSell),
        averageBuyingPrice: average(acquisitionPrices),
        averageSellingPrice: average(soldPrices),
        averageGrossMargin: average(soldMargins),
        carsNeedingPriceChanges: vehicles.filter((vehicle) => vehicle.difference != null && vehicle.marketMedian != null && Math.abs(vehicle.difference) > vehicle.marketMedian * 0.04).length,
        pricedAboveMarket: vehicles.filter((vehicle) => vehicle.difference != null && vehicle.difference > 0).length,
        pricedBelowMarket: vehicles.filter((vehicle) => vehicle.difference != null && vehicle.difference < 0).length,
      },
      vehicles,
    };
  });