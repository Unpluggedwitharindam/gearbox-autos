export interface ShareableVehicle {
  id: string;
  slug: string;
  name: string;
  is_active: boolean;
  inventory_status: string;
}
export interface CrmVehicleLink {
  url: string;
  name: string;
}
// Do not infer a vehicle from lead.car_name: custom and deleted records have no public identity.
export function resolveCrmVehicleLink(carId: string | null, vehicle: ShareableVehicle | null): CrmVehicleLink | null {
  if (!carId || !vehicle || vehicle.id !== carId || !vehicle.is_active || vehicle.inventory_status !== 'in_stock') return null;
  if (!vehicle.slug || vehicle.slug.length > 100 || !/^[a-z0-9-]+$/i.test(vehicle.slug)) return null;
  if (/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(vehicle.slug)) return null;
  return { url: `https://gearboxautos.in/car/${encodeURIComponent(vehicle.slug)}`, name: vehicle.name };
}