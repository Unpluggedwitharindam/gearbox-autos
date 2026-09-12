import { supabaseAdmin } from "@/integrations/supabase/client.server";
import { UNKNOWN, type ComparableListing } from "./types";

type MarketRow = Record<string, unknown>;

const knownString = (value: unknown) => typeof value === "string" && value.trim() ? value : UNKNOWN;
const knownNumber = (value: unknown) => typeof value === "number" ? value : UNKNOWN;

export async function loadVerifiedMarketListings(): Promise<{ connected: boolean; listings: ComparableListing[] }> {
  const { data, error } = await supabaseAdmin.from("external_market_listings").select("*").order("observed_at", { ascending: false }).limit(500);
  if (error) {
    console.error("[Garage market provider]", error.message);
    return { connected: false, listings: [] };
  }
  const rows = (data ?? []) as MarketRow[];
  return {
    connected: rows.length > 0,
    listings: rows.map((row) => ({
      id: String(row.id), source: String(row.source), sourceListingId: knownString(row.source_listing_id), listingUrl: knownString(row.listing_url),
      make: String(row.make), model: String(row.model), variant: knownString(row.variant), manufacturingYear: knownNumber(row.manufacturing_year), registrationYear: knownNumber(row.registration_year),
      fuel: String(row.fuel), transmission: knownString(row.transmission), ownerCount: knownNumber(row.owner_count), km: Number(row.km), askingPriceInr: Number(row.asking_price_inr),
      location: String(row.location), registrationState: knownString(row.registration_state), sellerType: knownString(row.seller_type), listedAt: knownString(row.listed_at), observedAt: String(row.observed_at),
      accidentHistory: knownString(row.accident_history), serviceHistory: knownString(row.service_history), insuranceStatus: knownString(row.insurance_status), conditionNotes: knownString(row.condition_notes),
    })),
  };
}