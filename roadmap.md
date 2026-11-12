# Reference-led marketplace redesign (preview only)

# Phase 1A — Buy inventory filters only

- [ ] Wire actual stored make/model, keyword, price, combined filters, sorting and reset on /buy
- [ ] Verify individual/combined filters, counts, invalid ranges and desktop/mobile; no publish or other phases

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
