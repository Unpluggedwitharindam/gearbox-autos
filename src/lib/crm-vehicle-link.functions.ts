import { createServerFn } from '@tanstack/react-start';
import { z } from 'zod';
import { requireSupabaseAuth } from '@/integrations/supabase/auth-middleware';
import { resolveCrmVehicleLink } from './crm-vehicle-link';

export const getCrmVehicleLink = createServerFn({ method: 'GET' })
  .middleware([requireSupabaseAuth])
  .inputValidator((data) => z.object({ carId: z.string().uuid() }).parse(data))
  .handler(async ({ data, context }) => {
    const { data: allowed, error: roleError } = await context.supabase.rpc('has_role', { _user_id: context.userId, _role: 'admin' });
    if (roleError) throw new Error('Unable to verify CRM sharing permissions. Please contact your administrator.');
    if (!allowed) throw new Error('Admin access required.');
    const { data: car, error } = await context.supabase.from('cars')
      .select('id,slug,name,is_active,inventory_status').eq('id', data.carId).maybeSingle();
    if (error) throw new Error('Unable to check vehicle availability. Please try again.');
    return resolveCrmVehicleLink(data.carId, car);
  });