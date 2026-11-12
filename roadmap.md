# Reference-led marketplace redesign (preview only)

## Controlled seller pricing disclosure — preview only
- [x] Align seller fee disclosures, shared wording, metadata and seller FAQs without changing forms or policies outside this scope
- [x] Verify five fee boundaries, affected metadata and desktop/mobile layouts; report exact diff without publication

# Phase 1A — Buy inventory filters only

# Phase 1B — CRM vehicle links only

- Deferred outside this release: fresh public-slug lookup, copy-link and own-user authorization remain in the unaccepted Phase 1B draft. The candidate restores the entire LMS page byte-for-byte to the published baseline; no CRM permission repair is included.

- [x] Wire actual stored make/model, keyword, price, combined filters, sorting and reset on /buy
- [x] Verify individual/combined filters, counts, invalid ranges and desktop/mobile; no publish or other phases

- [x] Match supplied homepage references and use the uploaded automotive asset pack
- [x] Connect budget/body filters, wishlist, locality links, and existing buyer/seller forms
- [x] Add eight useful locality pages and a GBX Motor Club enquiry page without changing backend workflows
- [x] Extend sitemap and verify desktop/mobile, real inventory, navigation, and SEO; do not publish

# Public homepage redesign (preview only)

- [x] Create an isolated editorial homepage with the official logo and current inventory
- [x] Connect search, budget/make browsing, car details, and existing seller/contact paths
- [x] Verify desktop/mobile layout and search-to-car flow; do not publish

# SEO and AEO roadmap

- [x] Audit live public routes and crawler behavior
- [x] Consolidate dealership structured data
- [x] Repair brand-page canonicals, headings, breadcrumbs, and private-page indexing controls
- [x] Complete per-route metadata and structured data
- [x] Improve sitemap freshness and failure handling
- [x] Add AI-readable public-site guide
- [x] Correct inventory URL/data mismatch
- [x] Validate SSR pages, metadata, schema, sitemap, and crawl files
- [x] Validate design-library wiring and exports
- [ ] Re-run SEO scan and publish verified changes

# Garage intelligence roadmap

- [x] Replace the Garage prototype response with live, streaming Indian used-car AI
- [x] Add structured vehicle parsing and missing-detail follow-ups
- [x] Build deterministic comparable ranking, deduplication, outlier, valuation, and Garage Score modules
- [x] Connect real Gearbox Autos inventory and separate it from external evidence
- [x] Add a pluggable external-listing provider boundary with honest unavailable/partial-data states
- [x] Build valuation evidence, price distribution, comparable sorting, source links, and disclosure UI
- [x] Extend inventory records for variant, ownership, acquisition, status, and days-in-stock analytics
- [x] Add the protected Garage dealer intelligence dashboard
- [x] Test AI calls, valuation math, public Garage flows, admin analytics, and mobile layouts
- [x] Connect Cars24, Spinny, CarDekho, and OLX listing collectors through managed Apify
- [x] Fix multi-turn vehicle parsing
- [x] Show source-level average, median, trimmed range, and evidence counts
- [x] Validate live marketplace pricing and Garage valuation output

# LMS / CRM roadmap

- [x] Create unified leads pipeline table with stages, types, sources, priority, follow-up dates
- [x] Add timestamped lead notes history table
- [x] Build /admin/lms with Kanban board, list view, quick-add, lead drawer, search/filters
- [x] Add one-click WhatsApp template engine and click-to-call on every lead
- [x] Flow website forms (sell, test drive, contact) into the LMS pipeline automatically
- [x] Add sales funnel counters to the admin dashboard
- [x] Verify LMS end-to-end in preview and publish
- [x] Connect external email service for four-recipient follow-up reminders
- [ ] Implement and test daily 10 AM / 12 PM IST reminders — awaiting a verified Resend sender address; connected key permits sending but not reading domains
- [ ] Activate reminder schedule after sender verification and deployment

# Google Play release

- [x] Apply the selected Android package ID and keep the short home-screen name
- [x] Verify native Android compilation, signatures, unit tests, and bundled branded assets (device execution unavailable)
- [x] Create and deliver the first upload key in a private signing backup for the confirmed new listing
- [x] Deliver and verify a signed Play Store AAB and a signed APK for device testing

# Locally bundled Android conversion

- [x] Build the existing frontend locally without a remote starting URL
- [x] Preserve hosted backend calls and submissions; signed-in LMS verified with an injected session
- [x] Add offline and Android navigation handling without redesign
- [x] Verify local startup, assets, routes, Android sync, and signed release packaging in an isolated workspace
- [x] Deliver updated configuration, commands, and signed-bundle instructions using the existing upload key
- [x] Verify signed AAB, test APK, unchanged private signing backup, and updated guide are Ready in Files
- [ ] Publish the new hosted /app-auth callback — awaits an explicit publish request
- [ ] Verify Google browser callback, WhatsApp, Back, inspection export, and launch on an Android device — no emulator/physical device available

# Android live inventory release v1.2

- [x] Reproduce and fix the native inventory domain redirect; add regression coverage
- [x] Verify real live inventory through the locally packaged interface (native bridge browser check)
- [x] Build and validate versionCode 3 AAB and APK using the unchanged upload key
- [x] Make the updated release and upload instructions available in Files

## Phase 1 security hardening: public car data (accepted; application release pending approval)
- [x] Column-level read-only grants on approved public car fields; all client writes revoked
- [x] Public visibility limited to active in-stock cars (database rule + public queries)
- [x] Public car queries use approved fields via the publishable-key server client
- [x] Production migrations 0002 and 0003 are already applied in order; Phase 1B migration is absent
- [x] Explicit per-privilege column revokes (0003) and exact rollback plan (docs/security/cars-public-access-rollback.md)
- [x] Read-only production permission comparison confirms approved column grants and active/in-stock policy

## Future: security review of other tables (separate task)
- [ ] Leads, contact messages, sell requests, test drives, user roles: remove broad visitor/signed-in permissions

## Future: admin car form (separate task)
- [ ] Make Variant, Sold price, Sold date and other optional fields optional; require sold fields only when status is Sold

## Outstanding verification
- Deferred: CRM vehicle sharing (Phase 1B draft, own-user admin check) not yet accepted and excluded from this release
- [ ] Android physical-device check of in-stock-only inventory

## Revised release candidate — without unfinished CRM vehicle sharing
- [x] Preserve Security Hardening v2 code, migrations, tests and rollback documentation and Phase 1A filters
- [x] Restore published LMS page; remove unfinished CRM lookup, copy-link, associated tests and test-only configuration
- [x] Verify live public inventory and Buy search/price/reset/sort; 39 relevant existing unit tests pass
- [x] Verify signed-in CRM leads, drawer, locally captured message, no copy-link, quick-add and list; verify live admin inventory and editor open/cancel without database writes
- [x] Confirm published byte-equivalence of LMS route, lead handlers, admin handlers/editor and social handlers; no unfinished CRM implementation or helper remains
- [x] Record release comparison and limitations in docs/security/revised-release-without-crm.md; stop for approval without publication
