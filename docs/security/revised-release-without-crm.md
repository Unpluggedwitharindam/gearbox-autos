# Revised release candidate — CRM sharing excluded

Published baseline: `f8d5e0e15454d225bf6072c75ea8cd2b5b79b6be`.
The candidate identifier is the current repository HEAD after this report is saved; no manual Git commit, merge or deployment is performed.

## Runtime application differences from published baseline
- Added `src/lib/buy-inventory.functions.ts`
- Added `src/lib/buy-inventory.ts`
- Updated `src/routes/buy.tsx`
- Updated `src/lib/cars.functions.ts`
- Added `src/lib/public-car-columns.ts`
- Added `src/lib/public-inventory-client.ts`

## Excluded from the previously accepted candidate
- Restored `src/routes/admin.lms.tsx` byte-for-byte from the published baseline.
- Removed `src/lib/crm-vehicle-link.functions.ts`, `src/lib/crm-vehicle-link.ts`, and both associated test files.
- Removed `vitest.crm.config.ts` and its obsolete architecture rule and attach exclusion.
- Archived Phase 1B plan documents remain historical documentation only, not executable code.

## Preserved
Security Hardening v2 migrations 0002/0003, snapshots, approved public columns, active/in-stock queries, rollback documentation, Phase 1A filters/sorting/reset, and their existing tests. No migration files or live database permissions were changed during this revision.

## Verification
- Existing unit tests: Phase 1A 20/20; public-column and availability 6/6; shared homepage-inventory regression 13/13.
- Source byte-equivalence with production: LMS route, lead handlers, admin handlers, admin car editor, social-caption handlers.
- Signed-in real-data UI: lead list/board, drawer, WhatsApp custom-message action captured locally (no message sent), no copy-link button, quick-add open/close, list view.
- Real-data Buy UI: initial inventory, WagonR search, combined maximum-price empty state, reset restoring listings, price-sort selection.
- Signed-in admin UI: 19 real inventory rows, existing-car editor open/cancel. No save, delete, lead mutation or message delivery was performed.
- No browser runtime errors in the completed verification. Preview build log reports build OK after the code changes.
- No executable `getCrmVehicleLink`, `resolveCrmVehicleLink` or `is_current_user_admin` implementation remains in source or migrations.

## Limitations and recommendation
Candidate is suitable for approval as a release containing Security Hardening v2 plus Phase 1A, without the unfinished Phase 1B sharing implementation. It is not published.

The published legacy Send inventory link action still constructs `/car/{car_id}` rather than using a stored slug. Restoring production behaviour preserves this known broken-link limitation; this revision does not claim to fix vehicle sharing. CRM create/update/delete/note writes and admin saves were not repeated against the live database. Physical Android-device checks remain outstanding. The admin editor's previously reported optional-field validation issue remains unchanged.