import { describe, it, expect } from 'vitest';
import { PUBLIC_CAR_COLUMN_LIST, isPubliclyAvailable } from './public-car-columns';

describe('public car fields', () => {
  it('never includes internal cost, sale or condition fields', () => {
    for (const hidden of ['acquisition_price_inr', 'acquisition_date', 'sold_price_inr', 'sold_at', 'condition_notes', 'accident_history', 'service_history', 'insurance_status', 'owner_count', 'seller_type'])
      expect(PUBLIC_CAR_COLUMN_LIST).not.toContain(hidden);
  });
  it('lists exactly the 20 approved fields', () => {
    expect(PUBLIC_CAR_COLUMN_LIST).toHaveLength(20);
  });
});

describe('public availability', () => {
  it('shows active in-stock cars', () => expect(isPubliclyAvailable({ is_active: true, inventory_status: 'in_stock' })).toBe(true));
  it('hides reserved cars', () => expect(isPubliclyAvailable({ is_active: true, inventory_status: 'reserved' })).toBe(false));
  it('hides sold cars', () => expect(isPubliclyAvailable({ is_active: true, inventory_status: 'sold' })).toBe(false));
  it('hides inactive in-stock cars', () => expect(isPubliclyAvailable({ is_active: false, inventory_status: 'in_stock' })).toBe(false));
});
