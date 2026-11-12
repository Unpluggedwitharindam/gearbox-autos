# Gearbox Autos — Prioritised Implementation Plan

## Scope and approval boundaries

Read both audit deliverables completely. Baseline: 47 sitemap URLs, 19 active cars, working homepage search; these are audit-time counts, not permanent limits. Recheck before each batch.

**This is planning only.** No application code, data, settings, integrations or releases change now. Plan approval permits only unblocked batches; pricing, tracking, indexability, storage and schedule decisions below still need explicit answers.

Preserve all routes, tables, records, integrations, working workflows, homepage design/branding and Android functionality. No production deployment, Android rebuild or automatic schedule activation. Reuse existing controls/styles. No invented claims, fees, distances, reviews or statistics. Preserve changed-file snapshots outside the checkout before significant edits; use existing version history, never reset it. Take an approved backup before any additive database migration; no destructive migration or blanket test-data cleanup.

## Phase 1 — Critical functionality and business accuracy

| Order | Small batch | Exact affected routes and implementation surface | Dependency / limit |
|---|---|---|---|
| 1A | Repair make/model, min/max price, Filters and sorting on `/buy`; combine with keyword search, clear filters and honest empty results | `src/routes/buy.tsx`; existing `src/lib/seo-areas.ts` brand parsing; new page-local tested filter helper if needed | Keep real `listPublicCars()` source. Public `Car` currently lacks separate make/model: inspect stored values before adding optional public fields; no guessed models/body types or schema change |
| 1B | Correct CRM vehicle-sharing URLs from UUID to existing slug | `/admin/lms`; `src/routes/admin.lms.tsx`, `src/lib/admin.functions.ts` only if lookup needs slug | Resolve car_id to verified inventory slug; custom/unavailable cars must not generate broken links. Keep car_id relationships |
| 1C | Make nullable inventory fields optional and normalize blanks | `/admin/cars`; `src/routes/admin.cars.tsx`, `src/lib/admin.functions.ts` | Keep required core listing fields and server validation. Do not require sold date/price for unsold cars or infer a new sold-field policy |
| 1D | Align approved commission/fee wording across affected pages, metadata and FAQ/schema | Complete impact list below | **Blocked by approved business wording.** Text-only, no homepage restyling |
| 1E | Review and repair source submission → CRM → notification reliability | `/sell`, `/contact`, `/car/$id`, `/admin/lms`, `/admin/leads`, `/admin/bookings`, `/admin/messages`; `src/lib/leads.functions.ts`, `src/lib/lead.functions.ts`, `src/lib/email-templates/{registry.ts,new-inquiry-alert.tsx,send-email.ts}` | First fault-test existing paths. Propose event-derived idempotency and atomic persistence or recoverable CRM reconciliation. Any additive data tracking gets its own migration review. Saved enquiries must survive email failures; expose staff-visible failures/suppression without bypassing them |
| 1F | Investigate and then implement missing reminders, in two separate batches | `/admin/lms`; existing lead functions; proposed `src/lib/lms-reminders.server.ts`, fixed-purpose scheduler endpoint `/api/public/lms-follow-up-reminders` only after platform/scheduler verification | No inspected implementation exists. Check linked Resend sender/access, scheduler availability and dry-run eligibility first. External provider already approved; managed app email cannot send this four-person digest. Separate approval for external setup, charges, real tests and activation |
| 1G | Repair inspection drafts without altering inspection UI/PDF workflow | `/admin/inspection`, `/inspection-tool.html`; `src/routes/admin.inspection.tsx`, `public/inspection-tool.html` | `window.storage` is absent. Confirm local-only vs account-private storage and standalone-page access before implementation. Photos need quota-safe storage, not unbounded localStorage. Preserve any recoverable drafts |

### Every currently identified fee statement surface

- `/sell`: title, descriptions and “You keep 100%” benefit.
- `/sell-car-jamshedpur`: title/descriptions, free listing, 0% forever and 100% proceeds claims.
- `/used-cars-in-jamshedpur`: metadata, benefits and seller CTA; nine current brand pages `/used-cars-in-jamshedpur/$brand`: metadata and buyer/RC wording.
- `/`, `/how-it-works`: existing buyer 0%, seller service-charge wording; homepage FAQ/schema.
- `/buy`, `/car/$id`, `/about`, `/contact`: unqualified commission statements in metadata/body.
- All eight `/second-hand-cars-in-{jamshedpur,bistupur,sonari,kadma,sakchi,mango,adityapur,telco}`: shared copy/metadata/FAQ through `src/showcase/locality-page.tsx` and `src/lib/marketplace-areas.ts`.
- `src/components/Footer.tsx` across the older shared-shell routes; `src/components/TrustBar.tsx` on `/buy`; default description in `src/routes/__root.tsx`. Review `src/showcase/marketplace.tsx` for inherited wording; currently no fee match there. Review `public/llms.txt` during its authorised Phase 2 update.

**Please confirm:** Is the approved policy “Buyers pay 0% commission; sellers pay a service charge only after a successful sale; applicable RTO fees are separate”? Is listing free, is RC assistance free (distinct from RTO charges), and should seller charges remain unspecified or show an approved amount/formula? No wording changes until answered.

### Reminder contract and outstanding choices

Already agreed: **10:00 AM and 12:00 PM Asia/Kolkata**, daily, to **arindam.banerjee@gearboxautos.in**, **vivekkumar@gearboxautos.in**, **arindammer1222@gmail.com**, **Vivekjnv07@gmail.com**. These four also receive Sell/Test Drive/Contact alerts; Garage AI alerts are excluded.

Proposed eligibility: follow_up_date today/overdue; exclude `won`/`lost`, future dates and missing dates; recompute at each send. Confirm whether closing a follow-up independently of the lead requires a separate control, and whether to skip empty digests. Proposed per-slot/per-recipient idempotency and authenticated scheduler access; no generic browser email endpoint. No reminder infrastructure through the managed app-email service. Activation stays pending while production deployment is prohibited.

**Phase 1 acceptance:** test combined filter/reset/sort/dependent models and invalid bounds; existing live car slug link opens that car; nullable fields save/read back as null with required validation intact. Fault-tests cover source failure, CRM failure, repeated submission, email failure and suppression. Approved test submissions read back in original inbox and authenticated CRM; exact test IDs retained. Verify all four recipient outcomes at the provider's supported evidence level—sent is not delivered/opened. Reminder tests assert both exact IST slots, due/overdue inclusion, closed exclusion and repeat prevention. Drafts including photos survive reload; denied/quota/corrupt storage gives a safe error; PDF export remains usable. No current records removed.

## Phase 2 — SEO and AEO

**2A — Approve page intent before canonical/indexability changes.** Proposed: `/buy` = interactive shopping; `/inventory` = simple stock catalogue; `/used-cars-in-jamshedpur` = city buying/brand hub; `/second-hand-cars-in-jamshedpur` = local viewing/document/location guide. Keep all URLs and self-canonicals initially while differentiating genuine content. If that cannot establish a useful distinction, present a specific consolidation proposal; no silent noindex, redirect or canonical-to-another-page. `/sell` stays the form; `/sell-car-jamshedpur` answers seller-process questions.

**2B — Local answers, not keyword duplication.** Touch the eight locality route files, `src/showcase/locality-page.tsx`, `src/lib/marketplace-areas.ts`; city/brand and seller routes listed above, `src/lib/seo-areas.ts` if needed. Answer “second hand cars in Jamshedpur”, “near me”, Bistupur, Sonari, buying and selling intent through distinct guides. Use confirmed Sonari address, real listing locations, viewing/document guidance and honest nearby-stock labels. Verify any new local fact; no inferred distance, neighbourhood stock or delivery guarantee. Do not claim exact geolocation without a real supported feature.

**2C — Data/schema/crawl accuracy.** `src/routes/car.$id.tsx`, `src/lib/cars.ts`, `src/lib/cars.functions.ts`, `src/lib/seo.ts`: preserve formatted UI kilometres, add numeric schema value from database; map availability from approved stock/reserved/sold/inactive policy. Add optional response fields compatibly; leave native transport/cache untouched. `public/llms.txt`: remove stale Garage references and list safe public pages only. `src/routes/sitemap[.]xml.ts`: preserve generator, add paginated public inventory input, stable ordering, failure→503 and genuine lastmod. No privileged-access expansion. Review affected leaf heads/internal links, `/gbx-motor-club` og:url, trailing slash/brand case and old Honda alias; permanent URL changes need approval. `public/robots.txt` stays unchanged unless a specific change is approved.

**Dependencies:** Phase 1 fee truth and availability decision → schema/content; page-intent decision → linking/canonicals/sitemap. Confirm Sonet year mismatch before any data/slug correction. Ask how reserved/sold listings and empty brand pages should behave rather than hiding stock silently.

**Phase 2 acceptance:** JSON-LD mileage is numeric; availability reflects each approved status; valid existing FAQ schema retained. Every kept public page has unique relevant metadata and one self-canonical on primary domain; filters do not spawn unintended landing pages. Sitemap tests span multiple source pages, include each eligible listing once, exclude private paths, escape XML and return 503 on any page failure. All llms links target safe existing pages. Verify local facts and fallback labels; no fabricated evidence. Index eligibility is tested separately from actual Google indexing; no ranking promise or automatic scan/publication.

## Phase 3 — Analytics, privacy and conversion tracking

**3A Read-only verification:** inspect existing root scripts, live network/consent behaviour and authorised Google Ads conversion definitions/tag snippets. Identify intended owners/destinations for **AW-18092790399** and **AW-18444054806**, check direct/GTM duplication and whether a GA4 destination exists account-side. No explicit `G-…` ID was found in source; do not invent one or treat platform visitor analytics as GA4.

**3B Proposed outcomes:** seller_form_submitted, contact_enquiry_submitted and test_drive_requested fire only after confirmed saved submissions. Buyer enquiries reuse the existing contact/booking outcome, not a nonexistent form; avoid double-counting the booking as another primary lead. phone_link_clicked and whatsapp_link_clicked are secondary intent signals, **not proof of a completed call/message**. Prefer existing semantically matching provider conversions. No enhanced matching, customer uploads or monetary values without a separate request/evidence.

**3C Approval then wiring:** `src/routes/__root.tsx`, `/privacy-policy` (`src/routes/privacy-policy.tsx`), `/sell`, `/contact`, `/car/$id`, shared phone/WhatsApp components and `src/showcase/marketplace.tsx`; proposed consent/event helper only after approval. Keep IDs unchanged until verified and confirmed. Update disclosures to actual data/purposes/recipients. Proposed regional consent banner appears in EU/EEA, UK, Switzerland and Canada, with separate analytics/advertising choices; alternatively skip tracking in consent/unresolved regions. Ordinary tracking elsewhere remains subject to refusal/GPC. Builder chooses; no transmission authorised by planning.

**Dependencies/approval:** Phase 1 confirmed success events → conversions; verified IDs/definitions and consent choice → installation. Agree whether consent covers only web or also requires Android review; no Android change under this scope. New IDs/actions, any existing ID removal, consent implementation and test conversions need explicit approval. External definitions are read first, not invented.

**Phase 3 acceptance:** capture actual permitted success event once; rejected/failed submissions emit none; no names/emails/phones in ordinary event payloads. Test no-answer, reject, accept, withdrawal, GPC and cross-tab choices. Provider receipt verified separately from browser transmission; attribution remains unverified until provider reports it. Accurate privacy text; no Ads spend, campaign launch or publish.

## Phase 4 — Performance, accessibility and technical SEO

**4A Diagnose detail hydration:** `/car/$id`, `src/routes/car.$id.tsx`, related carousel/card or root code only if evidence identifies it. Reproduce the published warning against a preserved baseline, inspect SSR/client differences and fix the cause, not suppress errors. Do not guess that locale formatting is responsible.

**4B Media/fonts:** `src/components/{CarCard.tsx,CarImageCarousel.tsx}`, `src/showcase/marketplace.tsx`, `src/routes/__root.tsx`, `src/styles.css`, `src/assets/fonts/`. Inspect dimensions/requests before responsive image or font changes; preserve real photos, fonts, hero framing and design. Shared changes must be backward-compatible; retain local font loading for library attach.

**4C Accessible forms/admin states:** `/buy`, `/sell`, `/contact`, `/car/$id`; `/admin`, `/admin/cars`, `/admin/lms`, `/admin/leads`, `/admin/bookings`, `/admin/messages`; their route files, existing dialog/button/form components and admin functions only as necessary. Add labels/names, keyboard/focus behaviour, loading/error/retry states and failed-edit rollback; no visual overhaul or global UI-library refactor.

**4D True unknown-car 404:** move missing-result decision to the `/car/$id` loader; retain valid pages and service failures as distinguishable errors, not 404. Coordinate with approved sold/empty policy; preserve legacy URLs.

**Phase 4 acceptance:** no reproduced hydration error after a relevant fix; no document overflow at 390/740/1280px, clear unchanged hero/photo and fonts, keyboard-complete dialogs/forms and focus restoration. Admin slow/error states cannot masquerade as empty inventory or zero counts. HTTP unknown-car 404 + noindex, valid-car 200; backend outages not disguised as missing stock. Existing homepage/native regression tests pass; no native configuration, package, auth callback or transport edits. Report physical Android compatibility as unverified unless separately tested.

## Proposed implementation prompts and checkpoints

Use each independently; each ends with tests, a changed-file list, unresolved blockers and **no publish**.

1. “Implement Phase 1A only: working `/buy` filters/sort with real inventory; preserve design and homepage behaviour.”
2. “Implement Phase 1B only: valid CRM slug links, including custom/unavailable-car safeguards.”
3. “Implement Phase 1C only: optional inventory fields and null normalization; preserve required validation.”
4. “Apply Phase 1D using my confirmed fee wording only; cover the full affected-page list.”
5. “Investigate Phase 1E reliability and propose any additive data changes before applying them; then implement the approved repair.”
6. “Investigate Phase 1F sender/scheduler access and dry-run recipients/eligibility; do not send or activate.” Then approve delivery implementation/tests separately.
7. “Implement Phase 1G using my approved draft-storage/access model; preserve PDF workflow.”
8. “Draft Phase 2 intent/local-content changes for approval, preserving URLs.” Then implement approved content and schema/llms/pagination as separate batches.
9. “Perform Phase 3 read-only Ads/GA4/consent verification; return matching existing conversions and decisions.” Then approve privacy/consent/event wiring separately.
10. “Implement Phase 4 in separate diagnostic, media, accessibility/admin-state and true-404 batches.”

**First recommended implementation:** 1A, then 1B and 1C; they do not require inventing fees, changing tracking or activating services. Business decisions can be answered in parallel. Reminders remain pending activation until explicitly authorised deployment. No broad rewrite is authorised by approving this plan.
