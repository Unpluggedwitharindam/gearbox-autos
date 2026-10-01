import { describe, expect, it } from "vitest";
import { buildAnalysis, calculateValuation, deduplicateComparables, marketStatistics, rankComparables, relevanceScore } from "./engine";
import { UNKNOWN, type ComparableListing, type VehicleProfile } from "./types";
import { parseAskingPrice, parseVehicleConversation, parseVehicleQuestion } from "./parser";

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
    expect(result.relaxations).toEqual(["The kilometre range was expanded to ±40,000 km."]);
  });
  it("does not disclose relaxation when every included listing is exact", () => {
    const result = rankComparables(target, [listing("a"), listing("b")]);
    expect(result.relaxations).toEqual([]);
  });
  it("discloses only the actual differences in the displayed listings", () => {
    const result = rankComparables(target, [listing("a", { ownerCount: 2, variant: "S", location: "Kolkata", km: 97_000 })]);
    expect(result.relaxations).toEqual([
      "Some listings have a different or unknown owner count.",
      "Other or unknown variants of this model were included.",
      "The search geography was expanded beyond nearby Jharkhand markets.",
      "The kilometre range was expanded to ±60,000 km.",
    ]);
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
  it("withholds a deal score without an asking price and scores priced deals differently", () => {
    const rows = [listing("a"), listing("b", { askingPriceInr: 1_500_000 }), listing("c", { askingPriceInr: 1_600_000 })];
    const unknown = buildAnalysis(target, [], rows, true).valuation;
    const cheap = buildAnalysis(target, [], rows, true, [], 1_300_000).valuation;
    const expensive = buildAnalysis(target, [], rows, true, [], 1_900_000).valuation;
    expect(unknown.status === "available" && unknown.garageScore).toBeNull();
    expect(cheap.status === "available" && cheap.label).toBe("Strong buy");
    expect(expensive.status === "available" && expensive.label).toBe("Overpriced");
  });
  it("extracts explicit user asking prices, not mileage or assistant estimates", () => {
    expect(parseAskingPrice([{ role: "user", content: "Is ₹9L fair for a 2021 Swift with 42,000 km?" }])).toBe(900_000);
    expect(parseAskingPrice([{ role: "user", content: "2021 Swift with 42,000 km" }, { role: "assistant", content: "Market price is ₹9 lakh" }])).toBeNull();
    expect(parseAskingPrice([{ role: "user", content: "Swift price at 8.5 lakh" }, { role: "user", content: "Seller now asks ₹9 lakh" }])).toBe(900_000);
  });
  it("extracts a vehicle without including the question prefix", () => {
    const parsed = parseVehicleQuestion("What should I pay for a 2021 Hyundai Creta SX diesel automatic with 42,000 km, 1st owner, Jamshedpur?");
    expect(parsed).toMatchObject({ make: "Hyundai", model: "Creta", variant: "SX", manufacturingYear: 2021, fuel: "DIESEL", transmission: "AUTOMATIC", ownerCount: 1, km: 42000, location: "Jamshedpur" });
  });
  it("keeps vehicle facts across follow-up questions", () => {
    const parsed = parseVehicleConversation([
      { role: "user", content: "I have a 2021 Hyundai Creta SX diesel" },
      { role: "assistant", content: "How far has it run?" },
      { role: "user", content: "42,000 km, automatic, first owner in Jamshedpur" },
    ]);
    expect(parsed).toMatchObject({ make: "Hyundai", model: "Creta", manufacturingYear: 2021, km: 42000, transmission: "AUTOMATIC", ownerCount: 1, location: "Jamshedpur" });
  });
});