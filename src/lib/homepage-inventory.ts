import type { Car } from './cars';

export interface HomepageFilters {
  q?: string;
  budget?: string;
  make?: string;
  fuel?: string;
  transmission?: string;
  body?: string;
}

export const homepageBudgets = [
  { value: '300000', label: 'Under ₹3 lakh', caption: 'Everyday value' },
  { value: '3-5', label: '₹3–5 lakh', caption: 'Smart city drives' },
  { value: '5-8', label: '₹5–8 lakh', caption: 'Room for more' },
  { value: '8-12', label: '₹8–12 lakh', caption: 'Your next upgrade' },
  { value: 'above-12', label: 'Above ₹12 lakh', caption: 'Premium choices' },
];

export const bodyTypes = ['Hatchback', 'Sedan', 'SUV', 'MUV', 'Compact SUV'];
export function inventoryBody(car: Car): string {
  const name = car.name.toLowerCase();
  const groups: Record<string, RegExp> = {
    'Compact SUV': /\b(brezza|venue|sonet|nexon|punch|kiger|ecosport|magnite)\b/,
    MUV: /\b(ertiga|carens|innova|rumion|xl6|marazzo|triber)\b/,
    SUV: /\b(creta|seltos|hector|harrier|safari|fortuner|kushaq|taigun|scorpio|thar|xuv\w*|bolero|x5|defender|duster)\b/,
    Sedan: /\b(amaze|city|dzire|verna|ciaz|slavia|virtus|rapid|vento|tigor)\b/,
    Hatchback: /\b(swift|baleno|wagon\s?r|alto|i10|i20|jazz|tiago|altroz|kwid|glanza|celerio|ignis)\b/,
  };
  return Object.entries(groups).find(([, pattern]) => pattern.test(name))?.[0] ?? '';
}

export function withinBudget(price: number, value?: string): boolean {
  if (!value) return true;
  if (value === 'above-12') return price > 1200000;
  const ranges: Record<string, [number, number]> = { '3-5': [300000, 500000], '5-8': [500000, 800000], '8-12': [800000, 1200000] };
  const range = ranges[value];
  if (range) return price >= range[0] && (value === '8-12' ? price <= range[1] : price < range[1]);
  const max = Number(value);
  return !Number.isFinite(max) || max <= 0 || price < max;
}

export function inventoryMake(car: Car): string {
  const match = car.name.match(/^(Maruti(?:\s+Suzuki)?|Hyundai|Honda|Kia|MG|Skoda|Tata|Toyota|BMW|Mahindra)\b/i);
  if (!match) return '';
  const key = match[1].toLowerCase();
  if (key.startsWith('maruti')) return 'Maruti Suzuki';
  if (key === 'bmw' || key === 'mg') return key.toUpperCase();
  return key[0].toUpperCase() + key.slice(1);
}

export function filterHomepageCars(cars: Car[], filters: HomepageFilters): Car[] {
  const keyword = (filters.q ?? '').trim().toLowerCase();
  return cars.filter(car =>
    (!keyword || `${car.name} ${car.fuel} ${car.transmission} ${car.location}`.toLowerCase().includes(keyword)) &&
    withinBudget(car.price_inr, filters.budget) &&
    (!filters.body || inventoryBody(car) === filters.body) &&
    (!filters.make || inventoryMake(car) === filters.make) &&
    (!filters.fuel || car.fuel.toLowerCase() === filters.fuel.toLowerCase()) &&
    (!filters.transmission || car.transmission.toLowerCase() === filters.transmission.toLowerCase())
  );
}