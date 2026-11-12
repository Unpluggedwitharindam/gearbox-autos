// Approved public listing fields for public.cars. Must match the column-level
// SELECT grant to anon/authenticated in the database; internal cost, sale and
// condition fields are deliberately absent.
export const PUBLIC_CAR_COLUMN_LIST = [
  'id', 'slug', 'name', 'price_inr', 'year', 'km', 'rto', 'location', 'fuel', 'transmission',
  'image_url', 'images', 'features', 'description', 'make', 'model',
  'is_active', 'inventory_status', 'created_at', 'updated_at',
] as const;

export const PUBLIC_CAR_COLUMNS = PUBLIC_CAR_COLUMN_LIST.join(',');

/** Only active, in-stock cars are shown as available to the public. */
export const PUBLIC_AVAILABLE_STATUS = 'in_stock';

export function isPubliclyAvailable(car: { is_active?: boolean | null; inventory_status?: string | null }): boolean {
  return car.is_active === true && car.inventory_status === PUBLIC_AVAILABLE_STATUS;
}
