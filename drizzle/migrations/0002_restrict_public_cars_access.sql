-- 1. Remove every table-level privilege from client roles.
REVOKE ALL ON TABLE public.cars FROM anon, authenticated;

-- 2. Explicitly remove any column-level privileges (not reliably cleared by table-level REVOKE).
REVOKE SELECT, INSERT, UPDATE, REFERENCES (
  id, slug, name, price_inr, year, km, rto, location, fuel, transmission, image_url, features,
  description, is_active, created_at, updated_at, images, make, model, variant, manufacturing_year,
  registration_year, owner_count, seller_type, registration_state, accident_history, service_history,
  insurance_status, condition_notes, acquisition_price_inr, acquisition_date, listed_at,
  inventory_status, sold_at, sold_price_inr
) ON TABLE public.cars FROM anon, authenticated;

-- 3. Read-only access to approved public listing fields only.
GRANT SELECT (
  id, slug, name, price_inr, year, km, rto, location, fuel, transmission,
  image_url, images, features, description, make, model,
  is_active, inventory_status, created_at, updated_at
) ON TABLE public.cars TO anon, authenticated;

-- 4. Server-side admin code keeps full access.
GRANT ALL ON TABLE public.cars TO service_role;

-- 5. Public row rule: only active AND in-stock cars are publicly visible.
DROP POLICY IF EXISTS "Anyone can view active cars" ON public.cars;
CREATE POLICY "Anyone can view in-stock cars" ON public.cars
  FOR SELECT TO anon, authenticated
  USING (is_active = true AND inventory_status = 'in_stock');

COMMENT ON TABLE public.cars IS 'Client roles (anon, authenticated) may SELECT only approved public listing columns of active in-stock cars; all writes and internal fields go through server-side admin code.';