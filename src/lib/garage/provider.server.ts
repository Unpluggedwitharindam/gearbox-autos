import { supabaseAdmin } from "@/integrations/supabase/client.server";
import type { Json } from "@/integrations/supabase/types";
import { UNKNOWN, type ComparableListing, type MarketSourceStatus, type VehicleProfile } from "./types";

type MarketRow = Record<string, unknown>;
type RawItem = Record<string, unknown>;
type Source = MarketSourceStatus["source"];
type InsertRow = {
  source: Source;
  source_listing_id: string;
  listing_url: string;
  make: string;
  model: string;
  variant: string | null;
  manufacturing_year: number | null;
  registration_year: number | null;
  fuel: string;
  transmission: string | null;
  owner_count: number | null;
  km: number;
  asking_price_inr: number;
  location: string;
  registration_state: string | null;
  seller_type: "dealer" | "private" | "unknown";
  listed_at: string | null;
  observed_at: string;
  raw_data: Json;
};

const ACTORS: Record<Source, string> = {
  Cars24: "fR5CQzPKrJ2z3W6Ud",
  Spinny: "2coeJAaXcmWpbFTAf",
  CarDekho: "Tx4vKBWNWT4uMbpft",
  OLX: "Q7GhqBvTkIMcXdfPc",
};
const SOURCES = Object.keys(ACTORS) as Source[];
const CACHE_HOURS = 24;
const MAX_ITEMS = 30;
const GATEWAY = "https://connector-gateway.lovable.dev/apify";

const knownString = (value: unknown) => typeof value === "string" && value.trim() ? value.trim() : UNKNOWN;
const knownNumber = (value: unknown) => typeof value === "number" && Number.isFinite(value) ? value : UNKNOWN;
const stringValue = (value: unknown) => typeof value === "string" && value.trim() ? value.trim() : null;
const numberValue = (value: unknown) => {
  if (typeof value === "number" && Number.isFinite(value)) return Math.round(value);
  if (typeof value === "string") {
    const parsed = Number(value.replace(/[^0-9.]/g, ""));
    return Number.isFinite(parsed) ? Math.round(parsed) : null;
  }
  return null;
};
const title = (value: string | null) => value ? value.replace(/\b\w/g, (character) => character.toUpperCase()) : null;
const isoDate = (value: unknown) => {
  if (typeof value !== "string") return null;
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? null : date.toISOString();
};
const safeId = (source: Source, id: unknown, url: string) => {
  const value = stringValue(id);
  if (value && !value.includes("*")) return value;
  const fromUrl = url.match(/(?:iid-|\/)([a-z0-9-]{8,})(?:[/?]|$)/i)?.[1];
  return fromUrl ?? `${source.toLowerCase()}-${url}`;
};
const validRow = (row: InsertRow | null): row is InsertRow => Boolean(row && row.make && row.model && row.fuel && row.km >= 0 && row.asking_price_inr > 0 && row.location && /^https:\/\//.test(row.listing_url));

function baseRow(source: Source, item: RawItem, values: Omit<InsertRow, "source" | "source_listing_id" | "observed_at" | "raw_data"> & { sourceId: unknown }): InsertRow {
  const observedAt = isoDate(item.scrapedAt) ?? new Date().toISOString();
  const { sourceId, ...rowValues } = values;
  return {
    ...rowValues,
    source,
    source_listing_id: safeId(source, sourceId, values.listing_url),
    observed_at: observedAt,
    raw_data: item as Json,
  };
}

function normalizeCars24(item: RawItem): InsertRow | null {
  const url = stringValue(item.listingUrl) ?? "";
  const row = baseRow("Cars24", item, {
    sourceId: item.id, listing_url: url, make: stringValue(item.make) ?? "", model: stringValue(item.model) ?? "",
    variant: stringValue(item.variant), manufacturing_year: numberValue(item.year), registration_year: null,
    fuel: title(stringValue(item.fuelType)) ?? "", transmission: title(stringValue(item.transmission)), owner_count: numberValue(item.owners),
    km: numberValue(item.odometerKm) ?? -1, asking_price_inr: numberValue(item.price) ?? 0, location: stringValue(item.city) ?? "",
    registration_state: null, seller_type: "dealer", listed_at: null,
  });
  return validRow(row) ? row : null;
}

function normalizeSpinny(item: RawItem): InsertRow | null {
  const url = stringValue(item.permanentUrl) ?? "";
  const row = baseRow("Spinny", item, {
    sourceId: url, listing_url: url, make: stringValue(item.make) ?? "", model: stringValue(item.model) ?? "",
    variant: stringValue(item.variant), manufacturing_year: numberValue(item.makeYear), registration_year: numberValue(item.registrationYear),
    fuel: title(stringValue(item.fuelType)) ?? "", transmission: title(stringValue(item.transmissionType)), owner_count: numberValue(item.ownerCount),
    km: numberValue(item.kmNumeric) ?? -1, asking_price_inr: numberValue(item.priceNumeric) ?? 0, location: stringValue(item.hubLocation) ?? stringValue(item.city) ?? "",
    registration_state: stringValue(item.rtoCode), seller_type: "dealer", listed_at: null,
  });
  return validRow(row) ? row : null;
}

function normalizeCarDekho(item: RawItem): InsertRow | null {
  const path = stringValue(item.vlink) ?? "";
  const url = path.startsWith("http") ? path : `https://www.cardekho.com${path}`;
  const fullModel = stringValue(item.model) ?? "";
  const make = stringValue(item.oem) ?? fullModel.split(" ")[0] ?? "";
  const model = fullModel.toLowerCase().startsWith(make.toLowerCase()) ? fullModel.slice(make.length).trim() : fullModel;
  const row = baseRow("CarDekho", item, {
    sourceId: item.used_car_id ?? item.ucid, listing_url: url, make, model, variant: stringValue(item.variant_name),
    manufacturing_year: numberValue(item.myear), registration_year: null, fuel: title(stringValue(item.ft)) ?? "",
    transmission: title(stringValue(item.tt)), owner_count: numberValue(item.owner), km: numberValue(item.km) ?? -1,
    asking_price_inr: numberValue(item.price) ?? 0, location: [stringValue(item.loc), stringValue(item.city)].filter(Boolean).join(", "),
    registration_state: null, seller_type: stringValue(item.utype)?.toLowerCase() === "dealer" ? "dealer" : "unknown", listed_at: null,
  });
  return validRow(row) ? row : null;
}

function normalizeOlx(item: RawItem): InsertRow | null {
  const parameters = Array.isArray(item.parameters) ? item.parameters as RawItem[] : [];
  const parameter = (key: string) => parameters.find((entry) => entry.key === key);
  const value = (key: string) => stringValue(parameter(key)?.value_name) ?? stringValue(parameter(key)?.formatted_value);
  const fuelEntry = parameters.find((entry) => entry.key_name === "Fuel");
  const locations = item.locationsResolved && typeof item.locationsResolved === "object" ? item.locationsResolved as RawItem : {};
  const price = item.price && typeof item.price === "object" ? item.price as RawItem : {};
  const url = stringValue(item.url) ?? "";
  const row = baseRow("OLX", item, {
    sourceId: item.id, listing_url: url, make: value("make") ?? "", model: value("model") ?? "", variant: value("variant"),
    manufacturing_year: numberValue(value("year")), registration_year: null,
    fuel: title(stringValue(fuelEntry?.value_name) ?? stringValue(fuelEntry?.formatted_value)) ?? "", transmission: title(value("transmission")),
    owner_count: numberValue(value("first_owner")), km: numberValue(value("mileage")) ?? -1, asking_price_inr: numberValue(price.raw) ?? 0,
    location: [stringValue(locations.SUBLOCALITY_LEVEL_1_name), stringValue(locations.ADMIN_LEVEL_3_name), stringValue(locations.ADMIN_LEVEL_1_name)].filter(Boolean).join(", "),
    registration_state: stringValue(locations.ADMIN_LEVEL_1_name), seller_type: stringValue(item.userType)?.toLowerCase() === "regular" ? "private" : "dealer",
    listed_at: isoDate(item.createdAt),
  });
  return validRow(row) ? row : null;
}

const NORMALIZERS: Record<Source, (item: RawItem) => InsertRow | null> = { Cars24: normalizeCars24, Spinny: normalizeSpinny, CarDekho: normalizeCarDekho, OLX: normalizeOlx };

function actorInput(source: Source, vehicle: VehicleProfile) {
  const make = vehicle.make === UNKNOWN ? "" : vehicle.make;
  const model = vehicle.model === UNKNOWN ? "" : vehicle.model;
  const year = vehicle.manufacturingYear === UNKNOWN ? null : vehicle.manufacturingYear;
  if (source === "Cars24") return { city: "all-india", make: make.toLowerCase(), model: model.toLowerCase(), minYear: year ? year - 2 : 2010, maxYear: year ? year + 2 : new Date().getFullYear(), maxItems: MAX_ITEMS, proxyConfiguration: { useApifyProxy: false } };
  if (source === "Spinny") return { city: "kolkata", maxItems: MAX_ITEMS, proxyConfiguration: { useApifyProxy: true } };
  if (source === "CarDekho") {
    const slug = `${make}-${model}`.trim().toLowerCase().replace(/[^a-z0-9]+/g, "-");
    return { urls: [`https://www.cardekho.com/used-${slug}+cars+in+kolkata`], offset: 0, ignore_url_failures: true, max_items_per_url: MAX_ITEMS };
  }
  return { searchTerms: [`${make} ${model} car`.trim()], sortSearchBy: "relevance", maxItems: MAX_ITEMS };
}

async function gateway(path: string, init?: RequestInit) {
  const lovableKey = process.env["LOVABLE_API_KEY"];
  const connectionKey = process.env["APIFY_API_KEY"];
  if (!lovableKey || !connectionKey) throw new Error("Marketplace connection is not configured.");
  const response = await fetch(`${GATEWAY}${path}`, { ...init, headers: { Authorization: `Bearer ${lovableKey}`, "X-Connection-Api-Key": connectionKey, "Content-Type": "application/json", ...init?.headers } });
  if (!response.ok) throw new Error(`Marketplace request failed [${response.status}]: ${await response.text()}`);
  return response.json() as Promise<unknown>;
}

async function runActor(source: Source, vehicle: VehicleProfile): Promise<RawItem[]> {
  const result = await gateway(`/acts/${ACTORS[source]}/run-sync-get-dataset-items?timeout=180&format=json&clean=true`, { method: "POST", body: JSON.stringify(actorInput(source, vehicle)) });
  if (!Array.isArray(result)) throw new Error("Marketplace collector returned an invalid response.");
  return result.filter((item): item is RawItem => Boolean(item) && typeof item === "object");
}

function fromRow(row: MarketRow): ComparableListing {
  return {
    id: String(row.id), source: String(row.source), sourceListingId: knownString(row.source_listing_id), listingUrl: knownString(row.listing_url),
    make: String(row.make), model: String(row.model), variant: knownString(row.variant), manufacturingYear: knownNumber(row.manufacturing_year), registrationYear: knownNumber(row.registration_year),
    fuel: String(row.fuel), transmission: knownString(row.transmission), ownerCount: knownNumber(row.owner_count), km: Number(row.km), askingPriceInr: Number(row.asking_price_inr),
    location: String(row.location), registrationState: knownString(row.registration_state), sellerType: knownString(row.seller_type), listedAt: knownString(row.listed_at), observedAt: String(row.observed_at),
    accidentHistory: knownString(row.accident_history), serviceHistory: knownString(row.service_history), insuranceStatus: knownString(row.insurance_status), conditionNotes: knownString(row.condition_notes),
  };
}

async function cachedRows(vehicle?: VehicleProfile, recentOnly = false) {
  let query = supabaseAdmin.from("external_market_listings").select("*").order("observed_at", { ascending: false }).limit(500);
  const make = vehicle?.make;
  const model = vehicle?.model;
  if (make && make !== UNKNOWN) query = query.ilike("make", make);
  if (model && model !== UNKNOWN) query = query.ilike("model", model);
  if (recentOnly) query = query.gte("observed_at", new Date(Date.now() - CACHE_HOURS * 3_600_000).toISOString());
  const { data, error } = await query;
  if (error) throw new Error(error.message);
  return (data ?? []) as MarketRow[];
}

async function refreshMarket(vehicle: VehicleProfile) {
  const outcomes = await Promise.all(SOURCES.map(async (source): Promise<MarketSourceStatus> => {
    try {
      const raw = await runActor(source, vehicle);
      const expectedMake = vehicle.make === UNKNOWN ? "" : vehicle.make.toLowerCase().replace(/[^a-z0-9]/g, "");
      const expectedModel = vehicle.model === UNKNOWN ? "" : vehicle.model.toLowerCase().replace(/[^a-z0-9]/g, "");
      const rows = raw.map(NORMALIZERS[source]).filter(validRow).filter((row) => {
        const make = row.make.toLowerCase().replace(/[^a-z0-9]/g, "");
        const model = row.model.toLowerCase().replace(/[^a-z0-9]/g, "");
        return (!expectedMake || make.includes(expectedMake) || expectedMake.includes(make)) && (!expectedModel || model.includes(expectedModel) || expectedModel.includes(model));
      });
      const uniqueRows = [...new Map(rows.map((row) => [`${row.source}:${row.source_listing_id}`, row])).values()];
      if (uniqueRows.length) {
        const { error } = await supabaseAdmin.from("external_market_listings").upsert(uniqueRows, { onConflict: "source,source_listing_id" });
        if (error) throw new Error(error.message);
      }
      return { source, status: uniqueRows.length ? "live" : "empty", listingCount: uniqueRows.length };
    } catch (error) {
      console.error(`[Garage ${source}]`, error instanceof Error ? error.message : error);
      return { source, status: "failed", listingCount: 0, message: "Source temporarily unavailable" };
    }
  }));
  return outcomes;
}

export async function loadVerifiedMarketListings(vehicle?: VehicleProfile, allowRefresh = false): Promise<{ connected: boolean; listings: ComparableListing[]; sourceStatuses: MarketSourceStatus[] }> {
  try {
    const recent = vehicle ? await cachedRows(vehicle, true) : [];
    let sourceStatuses: MarketSourceStatus[];
    const refreshVehicle = vehicle && vehicle.make !== UNKNOWN && vehicle.model !== UNKNOWN ? vehicle : null;
    if (allowRefresh && refreshVehicle && recent.length < 3) {
      sourceStatuses = await refreshMarket(refreshVehicle);
    } else {
      sourceStatuses = SOURCES.map((source) => ({ source, status: recent.some((row) => row.source === source) ? "cached" : "empty", listingCount: recent.filter((row) => row.source === source).length }));
    }
    const rows = vehicle ? await cachedRows(vehicle) : await cachedRows();
    if (allowRefresh) {
      sourceStatuses = sourceStatuses.map((status) => status.listingCount ? status : ({ ...status, listingCount: rows.filter((row) => row.source === status.source).length }));
    }
    return { connected: rows.length > 0, listings: rows.map(fromRow), sourceStatuses };
  } catch (error) {
    console.error("[Garage market provider]", error instanceof Error ? error.message : error);
    return { connected: false, listings: [], sourceStatuses: SOURCES.map((source) => ({ source, status: "failed", listingCount: 0, message: "Source temporarily unavailable" })) };
  }
}