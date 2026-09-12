export const UNKNOWN = "Unknown" as const;

export type Known<T> = T | typeof UNKNOWN;

export type VehicleProfile = {
  make: Known<string>;
  model: Known<string>;
  variant: Known<string>;
  manufacturingYear: Known<number>;
  registrationYear: Known<number>;
  fuel: Known<string>;
  transmission: Known<string>;
  ownerCount: Known<number>;
  km: Known<number>;
  location: Known<string>;
  registrationState: Known<string>;
};

export type ComparableListing = VehicleProfile & {
  id: string;
  source: string;
  sourceListingId: Known<string>;
  listingUrl: Known<string>;
  askingPriceInr: number;
  sellerType: Known<string>;
  listedAt: Known<string>;
  observedAt: string;
  accidentHistory: Known<string>;
  serviceHistory: Known<string>;
  insuranceStatus: Known<string>;
  conditionNotes: Known<string>;
};

export type InventoryComparable = VehicleProfile & {
  id: string;
  name: string;
  slug: string;
  askingPriceInr: number;
  status: string;
  listedAt: Known<string>;
  daysInInventory: Known<number>;
};

export type MatchLevel = 1 | 2 | 3 | 4 | 5 | 6;

export type RankedComparable = ComparableListing & {
  relevance: number;
  matchLevel: MatchLevel;
  distanceTier: 1 | 2 | 3 | 4;
};

export type MarketStatistics = {
  count: number;
  minimum: number;
  maximum: number;
  median: number;
  mean: number;
  lowerQuartile: number;
  upperQuartile: number;
  interquartileRange: number;
  medianKm: number;
  outlierCount: number;
  sourceBreakdown: Array<{
    source: string;
    count: number;
    mean: number;
    median: number;
  }>;
};

export type MarketSourceStatus = {
  source: "Cars24" | "Spinny" | "CarDekho" | "OLX";
  status: "live" | "cached" | "empty" | "failed";
  listingCount: number;
  message?: string;
};

export type ValuationResult =
  | {
      status: "available";
      statistics: MarketStatistics;
      fairMarketValue: { low: number; high: number };
      dealerBuyingPrice: { low: number; high: number };
      recommendedSellingPrice: number;
      expectedClosingPrice: number;
      marginOpportunity: { low: number; high: number };
      garageScore: number;
      label: "Strong buy" | "Fair deal" | "Overpriced" | "Avoid";
    }
  | {
      status: "unavailable";
      reason: "provider_unavailable" | "no_comparables" | "insufficient_comparables";
      actualCount: number;
    };

export type GarageAnalysis = {
  vehicle: VehicleProfile;
  missingFields: string[];
  inventoryComparables: InventoryComparable[];
  externalComparables: RankedComparable[];
  relaxations: string[];
  valuation: ValuationResult;
  providerStatus: "connected" | "unavailable" | "failed";
  sourceStatuses: MarketSourceStatus[];
};