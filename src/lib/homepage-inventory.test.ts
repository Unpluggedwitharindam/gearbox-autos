import { describe, expect, it } from "vitest";
import type { Car } from "./cars";
import {
  filterHomepageCars,
  inventoryMake,
  inventoryBody,
  withinBudget,
} from "./homepage-inventory";

const car = (id: string, name: string, price: number, fuel = "Petrol"): Car => ({
  id,
  name,
  price_inr: price,
  price: String(price),
  slug: id,
  year: 2024,
  km: "11,000",
  rto: "JH-05",
  location: "Jamshedpur",
  fuel,
  transmission: "Manual",
  image: "",
  images: [],
});
const cars = [
  car("wagonr", "Maruti Suzuki WagonR VXI", 495000),
  car("hector", "MG Hector", 785000),
  car("brezza", "Maruti Vitara Brezza", 675000, "Diesel"),
  car("boundary", "Honda Amaze", 500000),
];

describe("homepage inventory filters", () => {
  it("under ₹3 lakh excludes the ₹3 lakh boundary", () => {
    expect(withinBudget(299999, "300000")).toBe(true);
    expect(withinBudget(300000, "300000")).toBe(false);
  });
  it("₹3–5 lakh starts at ₹3 lakh and stops before ₹5 lakh", () => {
    expect(withinBudget(300000, "3-5")).toBe(true);
    expect(withinBudget(500000, "3-5")).toBe(false);
  });
  it("₹5–8 lakh starts at ₹5 lakh and stops before ₹8 lakh", () => {
    expect(withinBudget(500000, "5-8")).toBe(true);
    expect(withinBudget(800000, "5-8")).toBe(false);
  });
  it("₹8–12 lakh includes both endpoints", () => {
    expect(withinBudget(800000, "8-12")).toBe(true);
    expect(withinBudget(1200000, "8-12")).toBe(true);
    expect(withinBudget(1200001, "8-12")).toBe(false);
  });
  it("above ₹12 lakh excludes ₹12 lakh", () => {
    expect(withinBudget(1200000, "above-12")).toBe(false);
    expect(withinBudget(1200001, "above-12")).toBe(true);
  });
  it("body categories filter existing models and never classify unknown cars", () => {
    expect(filterHomepageCars(cars, { body: "Compact SUV" }).map((c) => c.id)).toEqual(["brezza"]);
    expect(inventoryBody(car("unknown", "Unlisted model", 1))).toBe("");
  });
  it("searches current make/model records without case sensitivity", () => {
    expect(filterHomepageCars(cars, { q: "WAGONR" }).map((c) => c.id)).toEqual(["wagonr"]);
  });
  it("under ₹5 lakh excludes a ₹5 lakh asking price", () => {
    expect(filterHomepageCars(cars, { budget: "500000" }).map((c) => c.id)).toEqual(["wagonr"]);
  });
  it("combines budget and fuel on real records", () => {
    expect(filterHomepageCars(cars, { budget: "800000", fuel: "Diesel" }).map((c) => c.id)).toEqual(
      ["brezza"],
    );
  });
  it("matches both Maruti naming formats to the same make", () => {
    expect(filterHomepageCars(cars, { make: "Maruti Suzuki" }).map((c) => c.id)).toEqual([
      "wagonr",
      "brezza",
    ]);
  });
  it("does not invent a make for an unlabelled model", () => {
    expect(inventoryMake(car("creta", "Creta 1.5", 900000))).toBe("");
  });
  it("returns no listings for an unmatched search", () => {
    expect(filterHomepageCars(cars, { q: "not-a-listed-car" })).toEqual([]);
  });
  it("matches transmission values regardless of inventory capitalisation", () => {
    expect(filterHomepageCars(cars, { transmission: "MANUAL" }).length).toBe(4);
  });
});
