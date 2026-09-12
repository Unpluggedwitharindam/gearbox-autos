import { describe, expect, it } from "vitest";
import { calculateValuation, deduplicateComparables, marketStatistics, rankComparables, relevanceScore } from "./engine";
import { UNKNOWN, type ComparableListing, type VehicleProfile } from "./types";
import { parseVehicleQuestion } from "./parser";

const target: VehicleProfile = { make: "Hyundai", model: "Creta", variant: "SX", manufacturingYear: 2021, registrationYear: 2021, fuel: "Diesel", transmission: "Automatic", ownerCount: 1, km: 48_000, location: "Jamshedpur", registrationState: "Jharkhand" };
const listing = (id: string, overrides: Partial<ComparableListing> = {}): ComparableListing => ({ id, source: "verified", sourceListingId: id, listingUrl: `https://example.com/${id}`, make: "Hyundai", model: "Creta", variant: "SX", manufacturingYear: 2021, registrationYear: 2021, fuel: "Diesel", transmission: "Automatic", ownerCount: 1, km: 50_000, askingPriceInr: 1_550_000, location: "Jamshedpur", registrationState: "Jharkhand", sellerType: "dealer", listedAt: UNKNOWN, observedAt: "2026-09-12T00:00:00Z", accidentHistory: UNKNOWN, serviceHistory: UNKNOWN, insuranceStatus: UNKNOWN, conditionNotes: UNKNOWN, ...overrides });

describe("Garage valuation engine", () => {
  it("rejects fuel mismatches from relevance", () => expect(relevanceScore(target, listing("p", { fuel: "Petrol" }))).toBe(0));
  it("deduplicates repeated source URLs", () => expect(deduplicateComparables([listing("a"), listing("b", { listingUrl: "https://example.com/a" })])).toHaveLength(1));
  it("uses exact matches before relaxed candidates", () => {
    const result = rankComparables(target, [listing("exact"), listing("far", { km: 85_000 })]);
    expect(result.comparables[0]?.id).toBe("exact");
    expect(result.comparables[0]?.matchLevel).toBe(1);
    expect(result.comparables.find((item) => item.id === "far")?.matchLevel).toBe(4);
  });
  it("removes extreme asking-price outliers with IQR", () => {
    const items = [14, 15, 15.2, 15.5, 16, 40].map((lakhs, index) => ({ ...listing(String(index), { askingPriceInr: lakhs * 100_000 }), relevance: 100, matchLevel: 1 as const, distanceTier: 1 as const }));
    expect(marketStatistics(items)?.outlierCount).toBe(1);
    expect(marketStatistics(items)?.maximum).toBe(1_600_000);
  });
  it("never produces a valuation without a verified provider", () => expect(calculateValuation(null, [], false)).toEqual({ status: "unavailable", reason: "provider_unavailable", actualCount: 0 }));
  it("requires at least three relevant comparables", () => {
    const result = rankComparables(target, [listing("a"), listing("b")]);
    expect(calculateValuation(null, result.comparables, true)).toEqual({ status: "unavailable", reason: "insufficient_comparables", actualCount: 2 });
  });
  it("extracts a vehicle without including the question prefix", () => {
    const parsed = parseVehicleQuestion("What should I pay for a 2021 Hyundai Creta SX diesel automatic with 42,000 km, 1st owner, Jamshedpur?");
    expect(parsed).toMatchObject({ make: "Hyundai", model: "Creta", variant: "SX", manufacturingYear: 2021, fuel: "DIESEL", transmission: "AUTOMATIC", ownerCount: 1, km: 42000, location: "Jamshedpur" });
  });
});