import { describe, expect, it } from 'vitest';
import { resolveCrmVehicleLink, type ShareableVehicle } from './crm-vehicle-link';
const id = '12345678-1234-1234-1234-123456789012';
const car: ShareableVehicle = { id, slug: 'used-cars-in-jamshedpur-marutisuzuki-wagonr-2024', name: 'Maruti Suzuki WagonR VXI', is_active: true, inventory_status: 'in_stock' };
describe('CRM public vehicle sharing', () => {
  it('resolves the matching active vehicle to its actual slug and identity', () => expect(resolveCrmVehicleLink(id, car)).toEqual({ url: 'https://gearboxautos.in/car/used-cars-in-jamshedpur-marutisuzuki-wagonr-2024', name: 'Maruti Suzuki WagonR VXI' }));
  it('blocks sold vehicles even when still active', () => expect(resolveCrmVehicleLink(id, { ...car, inventory_status: 'sold' })).toBeNull());
  it.each(['reserved','inactive','unknown'])('blocks unavailable status %s', status => expect(resolveCrmVehicleLink(id, { ...car, inventory_status: status })).toBeNull());
  it('blocks inactive public listings', () => expect(resolveCrmVehicleLink(id, { ...car, is_active: false })).toBeNull());
  it('blocks deleted vehicles', () => expect(resolveCrmVehicleLink(id, null)).toBeNull());
  it('blocks custom records without a car ID', () => expect(resolveCrmVehicleLink(null, car)).toBeNull());
  it('never substitutes another vehicle identity', () => expect(resolveCrmVehicleLink('another-id', car)).toBeNull());
  it('never puts an internal UUID in the public route', () => expect(resolveCrmVehicleLink(id, { ...car, slug: id })).toBeNull());
  it.each(['','../admin','https://example.com'])('blocks invalid slug %s', slug => expect(resolveCrmVehicleLink(id, { ...car, slug })).toBeNull());
  it('blocks a missing slug', () => expect(resolveCrmVehicleLink(id, { ...car, slug: null } as unknown as ShareableVehicle)).toBeNull());
  it('blocks slugs the public lookup cannot accept', () => expect(resolveCrmVehicleLink(id, { ...car, slug: 'a'.repeat(101) })).toBeNull());
  it('uses a changed stored slug without guessing from the name', () => expect(resolveCrmVehicleLink(id, { ...car, slug: 'actual-new-slug', name: 'Unrelated lead description' })?.url).toBe('https://gearboxautos.in/car/actual-new-slug'));
});