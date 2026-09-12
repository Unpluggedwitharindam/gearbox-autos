import { UNKNOWN, type VehicleProfile } from "./types";

const FUELS = ["petrol", "diesel", "cng", "ev", "electric", "hybrid"];
const TRANSMISSIONS = ["automatic", "manual", "amt", "cvt", "dct"];

export function parseVehicleQuestion(question: string): VehicleProfile {
  const text = question.trim();
  const lower = text.toLowerCase();
  const year = lower.match(/\b(19[89]\d|20[0-2]\d)\b/);
  const km = lower.match(/\b([\d,.]+)\s*(?:km|kms|kilometres|kilometers)\b/);
  const owner = lower.match(/\b(\d)(?:st|nd|rd|th)?\s*owner\b/);
  const fuel = FUELS.find((item) => lower.includes(item));
  const transmission = TRANSMISSIONS.find((item) => lower.includes(item));
  const location = ["jamshedpur", "ranchi", "dhanbad", "bokaro", "kolkata", "patna", "bhubaneswar"]
    .find((item) => lower.includes(item));
  const makes = ["Hyundai", "Maruti Suzuki", "Maruti", "Tata", "Mahindra", "Honda", "Toyota", "Kia", "Renault", "Nissan", "Ford", "Volkswagen", "Skoda", "MG", "BMW", "Mercedes-Benz", "Audi", "Jeep"];
  const make = makes.find((item) => lower.includes(item.toLowerCase()));
  const makeIndex = make ? lower.indexOf(make.toLowerCase()) : -1;
  const vehicleSegment = makeIndex >= 0
    ? text.slice(makeIndex + (make?.length ?? 0)).split(/,|\bwith\b|\b(?:has|at)\s+[\d,.]+\s*(?:km|kms)|\b\d[\d,.]*\s*(?:km|kms)/i)[0]?.trim() ?? ""
    : "";
  const vehicleWords = vehicleSegment.split(/\s+/).filter(Boolean);
  return {
    make: make ?? UNKNOWN,
    model: vehicleWords[0] ?? UNKNOWN,
    variant: vehicleWords.slice(1).filter((word) => !FUELS.includes(word.toLowerCase()) && !TRANSMISSIONS.includes(word.toLowerCase())).join(" ") || UNKNOWN,
    manufacturingYear: year ? Number(year[0]) : UNKNOWN,
    registrationYear: UNKNOWN,
    fuel: fuel === "electric" ? "EV" : fuel ? fuel.toUpperCase() : UNKNOWN,
    transmission: transmission ? transmission.toUpperCase() : UNKNOWN,
    ownerCount: owner ? Number(owner[1]) : UNKNOWN,
    km: km ? Number(km[1]?.replace(/[,.]/g, "")) : UNKNOWN,
    location: location ? location[0]?.toUpperCase() + location.slice(1) : UNKNOWN,
    registrationState: lower.includes("jharkhand") || location === "jamshedpur" ? "Jharkhand" : UNKNOWN,
  };
}