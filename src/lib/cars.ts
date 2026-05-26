import xuv from "@/assets/car-xuv500.jpg";
import creta from "@/assets/car-creta-front.jpg";
import fortuner from "@/assets/car-fortuner.jpg";
import dzire from "@/assets/car-dzire.jpg";
import bmwX5 from "@/assets/hero-bmw-x5.jpg";
import amazeBlack from "@/assets/car-amaze-black.jpg";
import amazeBrown from "@/assets/car-amaze-brown.jpg";

export type Car = {
  id: string;
  slug: string;
  name: string;
  price: string;
  price_inr: number;
  year: number;
  km: string;
  rto: string;
  location: string;
  fuel: string;
  transmission: string;
  image: string;
  features?: string[];
  description?: string | null;
};

// Fallback image map for seeded cars (since storage isn't set up)
const imageBySlug: Record<string, string> = {
  xuv500: xuv,
  creta,
  fortuner,
  dzire,
  "bmw-x5": bmwX5,
  "honda-amaze-vx": amazeBlack,
  "honda-amaze-vx-brown": amazeBrown,
};

export function formatPriceINR(n: number): string {
  return "₹" + n.toLocaleString("en-IN");
}

export function formatKm(n: number): string {
  return n.toLocaleString("en-IN");
}

export type CarRow = {
  id: string;
  slug: string;
  name: string;
  price_inr: number;
  year: number;
  km: number;
  rto: string;
  location: string;
  fuel: string;
  transmission: string;
  image_url: string;
  features: string[] | null;
  description: string | null;
  is_active?: boolean;
};

export function rowToCar(r: CarRow): Car {
  const img = imageBySlug[r.slug] || r.image_url || "";
  return {
    id: r.id,
    slug: r.slug,
    name: r.name,
    price: formatPriceINR(r.price_inr),
    price_inr: r.price_inr,
    year: r.year,
    km: formatKm(r.km),
    rto: r.rto,
    location: r.location,
    fuel: r.fuel,
    transmission: r.transmission,
    image: img,
    features: r.features ?? undefined,
    description: r.description,
  };
}
