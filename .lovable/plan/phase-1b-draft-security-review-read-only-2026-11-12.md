# Phase 1B draft security review (read-only)

## Where the review must run
The draft's code isn't visible from the main project, and only the draft's own chat can send it instructions. The review therefore runs in the "Phase 1B least-privilege admin check" draft chat. You paste the prompt below there. Nothing is edited, migrated, accepted, published or started for Phase 1C.

## Preliminary finding from the live database (read-only)
The live database's car rules, which the draft left unchanged:
- "Anyone can view active cars": signed-out visitors and signed-in users can read rows where `is_active = true`.
- "Admins can view all cars" and "Admins can manage cars": both use `has_role(admin)`.

Implications the review must prove or disprove:
1. **Sold and reserved cars are publicly readable.** The public rule checks only `is_active`, not `inventory_status`, so sold or reserved cars stay readable while they are active. The share code's own in-stock filter is what blocks those links, so that filter is the real safeguard.
2. **Business-only columns may be exposed.** The rule limits rows, not columns. Unless column permissions restrict them, visitors can read `acquisition_price_inr`, `sold_price_inr`, `acquisition_date`, `condition_notes` and similar fields on active cars. That would be an existing exposure unrelated to the draft. The draft only reads id, slug, name, is_active and inventory_status, which already appear on public car pages. It must be reported either way.

## Prompt to paste into the draft chat
```text
Read-only security review of this draft. Do not edit, migrate, accept, merge, publish, or start Phase 1C.
1. Using the draft database, show the exact pg_policies rows for public.cars, plus table-level and column-level grants for anon/authenticated (information_schema.role_table_grants and column_privileges, plus has_column_privilege checks for acquisition_price_inr, sold_price_inr, acquisition_date, condition_notes). Prove with an actual anon query using the publishable key exactly which rows and columns are readable. State whether sold or reserved but is_active rows are readable.
2. Confirm getCrmVehicleLink selects only id, slug, name, is_active, inventory_status, and that each value is already shown by the public /car/$slug page or public inventory API.
3. Confirm the server client reads process.env.SUPABASE_PUBLISHABLE_KEY (or the configured equivalent) inside the handler, that it exists in preview and published runtime config, that no service-role key, client.server import or secret is used, and that the code never logs or returns the key.
4. Trace the handler order: auth middleware, then is_current_user_admin, then a fresh single-row lookup by validated UUID, then resolveCrmVehicleLink filtering (active + in_stock + valid non-UUID slug + id match). Confirm custom and no-car leads cannot reach it, and that errors and logs contain no row data or internals.
5. For is_current_user_admin: show pg_proc owner, prosecdef, proconfig (search_path=''), the full definition, and proacl. Confirm only fully qualified names, use of auth.uid() from the request JWT, no arguments, no dynamic SQL, and no EXECUTE for anon or PUBLIC. Note any SECURITY DEFINER concerns.
6. Show the full diff against main (git diff from the draft base) and list every file. Confirm only the migration, the CRM function, its tests, generated types or migration metadata, roadmap/docs and the draft seed changed. Confirm no policy or table-grant change by diffing pg_policies and grants before/after the migration.
7. Re-run the full test suite (including vitest.crm.config.ts) and report exact pass/fail counts; confirm the preview build status.
8. Recommend accept or revise with specific evidence. Treat any pre-existing exposure (for example cost or sold-price columns readable by anon) as a separate finding, not fixed here. Stop for review.
