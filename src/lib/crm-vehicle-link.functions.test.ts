import { beforeEach, describe, expect, it, vi } from 'vitest';

vi.mock('@tanstack/react-start', () => ({
  createServerFn: () => ({
    middleware: () => ({
      inputValidator: () => ({ handler: (handler: unknown) => handler }),
    }),
  }),
}));
vi.mock('@/integrations/supabase/auth-middleware', () => ({ requireSupabaseAuth: {} }));

import { getCrmVehicleLink } from './crm-vehicle-link.functions';

const id = '12345678-1234-1234-1234-123456789012';
const vehicle = { id, slug: 'stored-wagonr-slug', name: 'WagonR', is_active: true, inventory_status: 'in_stock' };
const rpc = vi.fn();
const maybeSingle = vi.fn();
const eq = vi.fn(() => ({ maybeSingle }));
const select = vi.fn(() => ({ eq }));
const from = vi.fn(() => ({ select }));
// The mock exposes the handler so these tests exercise authorization and database lookup, not RPC transport.
const invoke = getCrmVehicleLink as unknown as (args: {
  data: { carId: string };
  context: { userId: string; supabase: { rpc: typeof rpc; from: typeof from } };
}) => Promise<{ url: string; name: string } | null>;
const run = () => invoke({ data: { carId: id }, context: { userId: 'requesting-admin', supabase: { rpc, from } } });

beforeEach(() => {
  vi.clearAllMocks();
  rpc.mockResolvedValue({ data: true, error: null });
  maybeSingle.mockResolvedValue({ data: vehicle, error: null });
});

describe('CRM sharing server authorization and fresh lookup', () => {
  it('checks the caller role before looking up the exact vehicle ID', async () => {
    expect(await run()).toEqual({ url: 'https://gearboxautos.in/car/stored-wagonr-slug', name: 'WagonR' });
    expect(rpc).toHaveBeenCalledWith('has_role', { _user_id: 'requesting-admin', _role: 'admin' });
    expect(from).toHaveBeenCalledWith('cars');
    expect(eq).toHaveBeenCalledWith('id', id);
    expect(rpc.mock.invocationCallOrder[0]).toBeLessThan(from.mock.invocationCallOrder[0] ?? 0);
  });
  it('denies a non-admin without reading inventory', async () => {
    rpc.mockResolvedValue({ data: false, error: null });
    await expect(run()).rejects.toThrow('Admin access required');
    expect(from).not.toHaveBeenCalled();
  });
  it('fails closed when role permissions are unavailable', async () => {
    rpc.mockResolvedValue({ data: null, error: { message: 'permission denied' } });
    await expect(run()).rejects.toThrow('Unable to verify CRM sharing permissions');
    expect(from).not.toHaveBeenCalled();
  });
  it('rechecks availability on the next action instead of reusing a link', async () => {
    expect(await run()).not.toBeNull();
    maybeSingle.mockResolvedValue({ data: { ...vehicle, inventory_status: 'sold' }, error: null });
    expect(await run()).toBeNull();
    expect(maybeSingle).toHaveBeenCalledTimes(2);
  });
  it('returns no link for a deleted row', async () => {
    maybeSingle.mockResolvedValue({ data: null, error: null });
    expect(await run()).toBeNull();
  });
  it('does not expose a link or raw details after a lookup failure', async () => {
    maybeSingle.mockResolvedValue({ data: null, error: { message: 'private database details' } });
    await expect(run()).rejects.toThrow('Unable to check vehicle availability. Please try again.');
  });
});