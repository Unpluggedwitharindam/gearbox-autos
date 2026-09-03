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

const MODEL_TO_BRAND: Record<string, string> = {
  creta: "hyundai", venue: "hyundai", i10: "hyundai", i20: "hyundai", verna: "hyundai",
  fortuner: "toyota", innova: "toyota", glanza: "toyota",
  amaze: "honda", city: "honda", jazz: "honda", "wr-v": "honda",
  swift: "maruti", dzire: "maruti", baleno: "maruti", wagonr: "maruti", alto: "maruti", ertiga: "maruti", brezza: "maruti",
  nexon: "tata", harrier: "tata", punch: "tata", altroz: "tata",
  xuv: "mahindra", scorpio: "mahindra", thar: "mahindra", bolero: "mahindra",
  seltos: "kia", sonet: "kia", carens: "kia",
  kwid: "renault", kiger: "renault", captur: "renault", duster: "renault",
};

export function brandOf(name: string): string {
  const words = name.trim().toLowerCase().split(/[\s-]+/).filter(Boolean);
  for (const w of words) {
    if (BRAND_NAMES[w]) return w;
  }
  for (const w of words) {
    if (MODEL_TO_BRAND[w]) return MODEL_TO_BRAND[w];
  }
  return words[0] ?? "";
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
