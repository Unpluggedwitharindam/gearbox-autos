import {
  UNKNOWN,
  type ComparableListing,
  type GarageAnalysis,
  type InventoryComparable,
  type MarketStatistics,
  type MatchLevel,
  type RankedComparable,
  type VehicleProfile,
  type ValuationResult,
} from "./types";

const norm = (value: string | typeof UNKNOWN) =>
  value === UNKNOWN ? "" : value.toLowerCase().replace(/[^a-z0-9]/g, "");

const same = (a: string | typeof UNKNOWN, b: string | typeof UNKNOWN) =>
  Boolean(norm(a)) && norm(a) === norm(b);

export function locationTier(location: string | typeof UNKNOWN): 1 | 2 | 3 | 4 {
  const value = norm(location);
  if (value.includes("jamshedpur") || value.includes("sonari")) return 1;
  if (["ranchi", "dhanbad", "bokaro", "deoghar", "hazaribagh", "jharkhand", "adityapur", "chaibasa", "saraikela"].some((city) => value.includes(city))) return 2;
  if (["kolkata", "patna", "bhubaneswar", "odisha", "bihar", "westbengal"].some((city) => value.includes(city))) return 3;
  return 4;
}

function numericProximity(target: number | typeof UNKNOWN, candidate: number | typeof UNKNOWN, maximum: number) {
  if (target === UNKNOWN || candidate === UNKNOWN) return 0;
  return Math.max(0, 1 - Math.abs(target - candidate) / maximum);
}

export function relevanceScore(target: VehicleProfile, listing: ComparableListing) {
  if (!same(target.fuel, listing.fuel)) return 0;
  const score =
    (same(target.make, listing.make) ? 15 : 0) +
    (same(target.model, listing.model) ? 20 : 0) +
    (same(target.variant, listing.variant) ? 15 : 0) +
    10 +
    (same(target.transmission, listing.transmission) ? 10 : 0) +
    (target.ownerCount !== UNKNOWN && listing.ownerCount === target.ownerCount ? 5 : 0) +
    numericProximity(target.km, listing.km, 80_000) * 10 +
    numericProximity(target.manufacturingYear, listing.manufacturingYear, 8) * 5 +
    (5 - locationTier(listing.location)) * 2.5;
  return Math.round(score * 10) / 10;
}

function eligibleAtLevel(target: VehicleProfile, listing: ComparableListing, level: MatchLevel) {
  if (!same(target.make, listing.make) || !same(target.model, listing.model) || !same(target.fuel, listing.fuel)) return false;
  if (target.transmission !== UNKNOWN && !same(target.transmission, listing.transmission)) return false;
  if (level < 5 && target.variant !== UNKNOWN && !same(target.variant, listing.variant)) return false;
  if (level === 1 && target.ownerCount !== UNKNOWN && listing.ownerCount !== target.ownerCount) return false;
  if (level < 6 && locationTier(listing.location) > 2) return false;
  if (target.km !== UNKNOWN && listing.km !== UNKNOWN) {
    const ranges: Record<MatchLevel, number> = { 1: 20_000, 2: 20_000, 3: 30_000, 4: 40_000, 5: 40_000, 6: 60_000 };
    if (Math.abs(target.km - listing.km) > ranges[level]) return false;
  }
  return true;
}

const RELAXATION: Record<Exclude<MatchLevel, 1>, string> = {
  2: "Ownership was relaxed by up to one owner because exact-owner matches were limited.",
  3: "The kilometre range was expanded to ±30,000 km.",
  4: "The kilometre range was expanded to ±40,000 km.",
  5: "Closely related variants were included because exact-variant matches were limited.",
  6: "The search geography was expanded beyond nearby Jharkhand markets.",
};

export function rankComparables(target: VehicleProfile, input: ComparableListing[], limit = 100) {
  const deduped = deduplicateComparables(input);
  const selected = new Map<string, RankedComparable>();
  const relaxations: string[] = [];
  for (let level = 1 as MatchLevel; level <= 6; level = (level + 1) as MatchLevel) {
    for (const listing of deduped) {
      if (!selected.has(listing.id) && eligibleAtLevel(target, listing, level)) {
        selected.set(listing.id, {
          ...listing,
          relevance: relevanceScore(target, listing),
          matchLevel: level,
          distanceTier: locationTier(listing.location),
        });
      }
    }
    if (selected.size >= limit) break;
    if (level < 6 && selected.size < limit) relaxations.push(RELAXATION[(level + 1) as Exclude<MatchLevel, 1>]);
  }
  return {
    comparables: [...selected.values()].sort((a, b) => b.relevance - a.relevance).slice(0, limit),
    relaxations,
  };
}

export function deduplicateComparables(input: ComparableListing[]) {
  const seen = new Set<string>();
  return input.filter((listing) => {
    const fingerprint = listing.listingUrl !== UNKNOWN
      ? listing.listingUrl
      : [listing.source, norm(listing.make), norm(listing.model), listing.manufacturingYear, listing.km, listing.askingPriceInr, norm(listing.location)].join("|");
    if (seen.has(fingerprint)) return false;
    seen.add(fingerprint);
    return true;
  });
}

export function percentile(values: number[], p: number) {
  if (values.length === 0) return 0;
  const sorted = [...values].sort((a, b) => a - b);
  const position = (sorted.length - 1) * p;
  const lower = Math.floor(position);
  const upper = Math.ceil(position);
  if (lower === upper) return sorted[lower] ?? 0;
  return (sorted[lower] ?? 0) + ((sorted[upper] ?? 0) - (sorted[lower] ?? 0)) * (position - lower);
}

export function marketStatistics(comparables: RankedComparable[]): MarketStatistics | null {
  if (comparables.length < 3) return null;
  const prices = comparables.map((item) => item.askingPriceInr).sort((a, b) => a - b);
  const lowerQuartile = percentile(prices, 0.25);
  const upperQuartile = percentile(prices, 0.75);
  const interquartileRange = upperQuartile - lowerQuartile;
  const lowerFence = lowerQuartile - interquartileRange * 1.5;
  const upperFence = upperQuartile + interquartileRange * 1.5;
  const trimmed = comparables.filter((item) => item.askingPriceInr >= lowerFence && item.askingPriceInr <= upperFence);
  const accepted = trimmed.length >= 3 ? trimmed : comparables;
  const acceptedPrices = accepted.map((item) => item.askingPriceInr).sort((a, b) => a - b);
  const knownKm = accepted.flatMap((item) => item.km === UNKNOWN ? [] : [item.km]).sort((a, b) => a - b);
  const sourceBreakdown = [...new Set(accepted.map((item) => item.source))].map((source) => {
    const sourcePrices = accepted.filter((item) => item.source === source).map((item) => item.askingPriceInr);
    return {
      source,
      count: sourcePrices.length,
      mean: Math.round(sourcePrices.reduce((sum, value) => sum + value, 0) / sourcePrices.length),
      median: Math.round(percentile(sourcePrices, 0.5)),
    };
  });
  return {
    count: accepted.length,
    minimum: acceptedPrices[0] ?? 0,
    maximum: acceptedPrices.at(-1) ?? 0,
    median: Math.round(percentile(acceptedPrices, 0.5)),
    mean: Math.round(acceptedPrices.reduce((sum, value) => sum + value, 0) / acceptedPrices.length),
    lowerQuartile: Math.round(percentile(acceptedPrices, 0.25)),
    upperQuartile: Math.round(percentile(acceptedPrices, 0.75)),
    interquartileRange: Math.round(interquartileRange),
    medianKm: Math.round(percentile(knownKm, 0.5)),
    outlierCount: comparables.length - accepted.length,
    sourceBreakdown,
  };
}

export function calculateValuation(targetPrice: number | null, comparables: RankedComparable[], providerConnected: boolean): ValuationResult {
  if (!providerConnected) return { status: "unavailable", reason: "provider_unavailable", actualCount: 0 };
  if (comparables.length === 0) return { status: "unavailable", reason: "no_comparables", actualCount: 0 };
  const statistics = marketStatistics(comparables);
  if (!statistics) return { status: "unavailable", reason: "insufficient_comparables", actualCount: comparables.length };
  const fairLow = Math.round(statistics.median * 0.97);
  const fairHigh = Math.round(statistics.median * 1.03);
  const buyLow = Math.round(statistics.median * 0.86);
  const buyHigh = Math.round(statistics.median * 0.91);
  const listing = Math.round(statistics.median * 1.04);
  const closing = Math.round(statistics.median * 0.99);
  const priceScore = targetPrice ? Math.max(0, Math.min(30, 15 + ((statistics.median - targetPrice) / statistics.median) * 100)) : 15;
  const garageScore = Math.round(Math.min(100, priceScore + 15 + 10 + 10 + 8 + 7));
  const label = garageScore >= 80 ? "Strong buy" : garageScore >= 60 ? "Fair deal" : garageScore >= 40 ? "Overpriced" : "Avoid";
  return {
    status: "available",
    statistics,
    fairMarketValue: { low: fairLow, high: fairHigh },
    dealerBuyingPrice: { low: buyLow, high: buyHigh },
    recommendedSellingPrice: listing,
    expectedClosingPrice: closing,
    marginOpportunity: { low: closing - buyHigh, high: closing - buyLow },
    garageScore,
    label,
  };
}

export function missingVehicleFields(vehicle: VehicleProfile) {
  return (["make", "model", "manufacturingYear", "fuel", "transmission", "ownerCount", "km", "location"] as const)
    .filter((key) => vehicle[key] === UNKNOWN);
}

export function buildAnalysis(vehicle: VehicleProfile, inventoryComparables: InventoryComparable[], external: ComparableListing[], providerConnected: boolean, sourceStatuses: GarageAnalysis["sourceStatuses"] = []): GarageAnalysis {
  const ranked = rankComparables(vehicle, external);
  return {
    vehicle,
    missingFields: missingVehicleFields(vehicle),
    inventoryComparables,
    externalComparables: ranked.comparables,
    relaxations: ranked.relaxations,
    valuation: calculateValuation(null, ranked.comparables, providerConnected),
    providerStatus: providerConnected ? "connected" : "unavailable",
    sourceStatuses,
  };
}