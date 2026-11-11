import type { Car } from './cars';

export interface HomepageFilters {
  q?: string;
  budget?: string;
  make?: string;
  fuel?: string;
  transmission?: string;
}

export const homepageBudgets = [
  { value: '500000', label: 'Under ₹5 lakh', caption: 'Everyday value' },
  { value: '800000', label: 'Under ₹8 lakh', caption: 'More room to choose' },
  { value: '1000000', label: 'Under ₹10 lakh', caption: 'Your next upgrade' },
  { value: '', label: 'All budgets', caption: 'Explore the whole collection' },
];

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
  const budget = Number(filters.budget);
  return cars.filter(car =>
    (!keyword || `${car.name} ${car.fuel} ${car.transmission} ${car.location}`.toLowerCase().includes(keyword)) &&
    (!Number.isFinite(budget) || budget <= 0 || car.price_inr < budget) &&
    (!filters.make || inventoryMake(car) === filters.make) &&
    (!filters.fuel || car.fuel.toLowerCase() === filters.fuel.toLowerCase()) &&
    (!filters.transmission || car.transmission.toLowerCase() === filters.transmission.toLowerCase())
  );
}