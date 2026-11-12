import { createServerFn } from '@tanstack/react-start';
import { createClient } from '@supabase/supabase-js';
import type { Database } from '@/integrations/supabase/types';
import { rowToCar } from './cars';
import type { BuyCar } from './buy-inventory';

// Page-specific projection; shared inventory/native callers keep their existing contract.
export const listBuyCars = createServerFn({ method: 'GET' }).handler(async (): Promise<BuyCar[]> => {
  const url = process.env['SUPABASE_URL'];
  const key = process.env['SUPABASE_PUBLISHABLE_KEY'];
  if (!url || !key) throw new Error('Inventory is unavailable. Please try again.');
  const client = createClient<Database>(url, key, {
    auth: { persistSession: false, autoRefreshToken: false },
    global: { fetch: (input, init) => {
      const headers = new Headers(init?.headers);
      if (key.startsWith('sb_') && headers.get('Authorization') === `Bearer ${key}`) headers.delete('Authorization');
      headers.set('apikey', key);
      return fetch(input, { ...init, headers });
    } },
  });
  const { data, error } = await client.from('cars')
    .select('id,slug,name,price_inr,year,km,rto,location,fuel,transmission,image_url,images,features,description,updated_at,make,model,created_at')
    .eq('is_active', true).order('created_at', { ascending: false });
  if (error) {
    console.error('[buy inventory]', error.message);
    throw new Error('Unable to load cars right now. Please try again.');
  }
  return (data ?? []).map(row => ({ ...rowToCar(row), make: row.make, model: row.model, created_at: row.created_at }));
});