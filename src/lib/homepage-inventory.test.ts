import { describe, expect, it } from 'vitest';
import type { Car } from './cars';
import { filterHomepageCars, inventoryMake } from './homepage-inventory';

const car = (id: string, name: string, price: number, fuel = 'Petrol'): Car => ({
  id, name, price_inr: price, price: String(price), slug: id, year: 2024,
  km: '11,000', rto: 'JH-05', location: 'Jamshedpur', fuel,
  transmission: 'Manual', image: '', images: [],
});
const cars = [car('wagonr', 'Maruti Suzuki WagonR VXI', 495000), car('hector', 'MG Hector', 785000), car('brezza', 'Maruti Vitara Brezza', 675000, 'Diesel'), car('boundary', 'Honda Amaze', 500000)];

describe('homepage inventory filters', () => {
  it('searches current make/model records without case sensitivity', () => {
    expect(filterHomepageCars(cars, { q: 'WAGONR' }).map(c => c.id)).toEqual(['wagonr']);
  });
  it('under ₹5 lakh excludes a ₹5 lakh asking price', () => {
    expect(filterHomepageCars(cars, { budget: '500000' }).map(c => c.id)).toEqual(['wagonr']);
  });
  it('combines budget and fuel on real records', () => {
    expect(filterHomepageCars(cars, { budget: '800000', fuel: 'Diesel' }).map(c => c.id)).toEqual(['brezza']);
  });
  it('matches both Maruti naming formats to the same make', () => {
    expect(filterHomepageCars(cars, { make: 'Maruti Suzuki' }).map(c => c.id)).toEqual(['wagonr', 'brezza']);
  });
  it('does not invent a make for an unlabelled model', () => {
    expect(inventoryMake(car('creta', 'Creta 1.5', 900000))).toBe('');
  });
  it('returns no listings for an unmatched search', () => {
    expect(filterHomepageCars(cars, { q: 'not-a-listed-car' })).toEqual([]);
  });
});