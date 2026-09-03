export const BRAND_NAMES: Record<string, string> = {
  maruti: "Maruti Suzuki",
  hyundai: "Hyundai",
  honda: "Honda",
  tata: "Tata",
  mahindra: "Mahindra",
  toyota: "Toyota",
  bmw: "BMW",
  kia: "Kia",
  ford: "Ford",
  renault: "Renault",
  volkswagen: "Volkswagen",
  skoda: "Skoda",
  nissan: "Nissan",
  mg: "MG",
};

export function brandOf(name: string): string {
  return (name.trim().split(/\s+/)[0] || "").toLowerCase();
}

export function brandLabel(brand: string): string {
  return BRAND_NAMES[brand] ?? brand.charAt(0).toUpperCase() + brand.slice(1);
}

export const NEARBY_AREAS = [
  { name: "Adityapur", note: "Industrial hub next to Jamshedpur — we regularly inspect and list cars from Adityapur and the NH-33 belt." },
  { name: "Sonari", note: "Our showroom is in Sonari (Awas Tower). Walk in to see any listed car in person." },
  { name: "Bistupur & Sakchi", note: "Central Jamshedpur buyers can book a test drive and we bring the car to a convenient spot." },
  { name: "Ghatshila", note: "Sellers in Ghatshila can list remotely — we handle photography guidance and buyer meetings." },
  { name: "Chaibasa", note: "We help Chaibasa sellers reach Jamshedpur buyers and assist with JH-06 / JH-05 RC transfers." },
  { name: "Saraikela-Kharsawan", note: "Full support for buyers and sellers across the Saraikela-Kharsawan district." },
];
