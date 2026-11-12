import type { Car } from './cars';

export interface BuyCar extends Car {
  make: string | null;
  model: string | null;
  created_at: string;
}
export interface BuyFilters {
  q: string;
  make: string;
  model: string;
  min: string;
  max: string;
  fuel: string;
  transmission: string;
  sort: string;
}
export const emptyBuyFilters: BuyFilters = { q: '', make: '', model: '', min: '', max: '', fuel: '', transmission: '', sort: 'latest' };
export const inventoryKey = (value: string) => value.trim().replace(/\s+/g, ' ').toLowerCase();
export function buyOptions(cars: BuyCar[], field: 'make' | 'model' | 'fuel' | 'transmission', make = '') {
  const options = new Map<string, string>();
  for (const car of cars) {
    if (make && inventoryKey(car.make ?? '') !== make) continue;
    const label = car[field]?.trim();
    if (label) options.set(inventoryKey(label), label);
  }
  return [...options].sort((a, b) => a[1].localeCompare(b[1]));
}
export function filterBuyCars(cars: BuyCar[], filters: BuyFilters) {
  const parse = (text: string) => text.trim() === '' ? undefined : Number(text);
  const min = parse(filters.min), max = parse(filters.max);
  if ([min, max].some(value => value !== undefined && (!Number.isFinite(value) || value < 0))) {
    return { cars: [] as BuyCar[], error: 'Enter valid, non-negative prices in rupees.' };
  }
  if (min !== undefined && max !== undefined && min > max) {
    return { cars: [] as BuyCar[], error: 'Minimum price must not exceed maximum price.' };
  }
  const words = inventoryKey(filters.q).split(' ').filter(Boolean);
  const result = cars.filter(car => {
    const searchable = inventoryKey([car.name, car.make, car.model, car.fuel].filter(Boolean).join(' '));
    return words.every(word => searchable.includes(word))
      && (!filters.make || inventoryKey(car.make ?? '') === filters.make)
      && (!filters.model || inventoryKey(car.model ?? '') === filters.model)
      && (!filters.fuel || inventoryKey(car.fuel) === filters.fuel)
      && (!filters.transmission || inventoryKey(car.transmission) === filters.transmission)
      && (min === undefined || car.price_inr >= min)
      && (max === undefined || car.price_inr <= max);
  });
  result.sort((a, b) => {
    switch (filters.sort) {
      case 'price-low': return a.price_inr - b.price_inr;
      case 'price-high': return b.price_inr - a.price_inr;
      case 'year-new': return b.year - a.year;
      case 'km-low': return Number(a.km.replaceAll(',', '')) - Number(b.km.replaceAll(',', ''));
      default: return Date.parse(b.created_at) - Date.parse(a.created_at);
    }
  });
  return { cars: result, error: null };
}