# Rollback: public.cars access restriction (migrations 0002 + 0003)

## Original live state (captured read-only from production, 2026-11-12)
- Table ACL: `postgres=arwdDxtm, anon=arwdDxtm, authenticated=arwdDxtm, service_role=arwdDxtm, sandbox_exec=ar`
  (arwdDxtm = SELECT, INSERT, UPDATE, DELETE, TRUNCATE, REFERENCES, TRIGGER, MAINTAIN)
- Column ACLs: none on any of the 35 columns.
- RLS enabled, not forced. Policies:
  - `Admins can manage cars` — ALL, authenticated, USING/CHECK `has_role(auth.uid(),'admin')` (unchanged by migration)
  - `Admins can view all cars` — SELECT, authenticated, USING `has_role(auth.uid(),'admin')` (unchanged)
  - `Anyone can view active cars` — SELECT, anon+authenticated, USING `is_active = true` (replaced)
- anon/authenticated are members of no other roles.

Re-capture this immediately before applying to production; if it differs, update the restore SQL to match.

## Option A — exact restoration (restores the original, insecure, state)
Apply as a new migration:
```sql
REVOKE SELECT (id, slug, name, price_inr, year, km, rto, location, fuel, transmission, image_url, images, features, description, make, model, is_active, inventory_status, created_at, updated_at) ON TABLE public.cars FROM anon, authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE, TRUNCATE, REFERENCES, TRIGGER, MAINTAIN ON TABLE public.cars TO anon, authenticated;
DROP POLICY IF EXISTS "Anyone can view in-stock cars" ON public.cars;
CREATE POLICY "Anyone can view active cars" ON public.cars FOR SELECT TO anon, authenticated USING (is_active = true);
COMMENT ON TABLE public.cars IS NULL;
```
service_role is unchanged by the migration and needs no restore.

## Option B — safe recovery (recommended if public pages break)
Restores only public visibility of active cars; keeps all client writes and hidden fields blocked:
```sql
DROP POLICY IF EXISTS "Anyone can view in-stock cars" ON public.cars;
CREATE POLICY "Anyone can view active cars" ON public.cars FOR SELECT TO anon, authenticated USING (is_active = true);
```

## Application code
Revert, in the same release as the database rollback:
- `src/lib/cars.functions.ts` and `src/lib/buy-inventory.functions.ts` to their pre-draft versions.
- Delete `src/lib/public-car-columns.ts`, `src/lib/public-car-columns.test.ts`, `src/lib/public-inventory-client.ts`.
With Option B the new code can stay (it only reads approved fields of in-stock cars).

## Verification after rollback
```sql
SELECT relacl FROM pg_class WHERE oid='public.cars'::regclass;
SELECT count(*) FROM pg_attribute WHERE attrelid='public.cars'::regclass AND attacl IS NOT NULL;
SELECT polname, pg_get_expr(polqual, polrelid) FROM pg_policy WHERE polrelid='public.cars'::regclass;
```
