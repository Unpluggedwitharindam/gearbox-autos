# Gearbox Autos — Prioritised Implementation Plan

## Scope and approval boundaries

Both audit deliverables read completely. Recheck the audit baseline (47 sitemap URLs, 19 active cars) before implementation.

**This is planning only.** No application code, data, settings, integrations or releases change now. Plan approval permits only unblocked batches; pricing, tracking, indexability, storage and schedule decisions below still need explicit answers.

Preserve routes, tables, records, integrations, workflows, homepage branding/design and Android functionality. No deployment/rebuild, invented claims or fees. Reuse controls/styles. Preserve changed-file snapshots outside the checkout before significant edits; retain version history. Backup before separately approved additive migrations; no destructive changes or blanket test-data cleanup.

## Phase 1 — Critical functionality and business accuracy

All paths below are existing unless marked proposed.

| Order | Fix and exact affected files/routes | Dependencies and limits |
|---|---|---|
| 1A | `/buy`: `src/routes/buy.tsx`, brand parsing `src/lib/seo-areas.ts`; tested page-local filter helper if needed | Wire make/model, min/max, Filters, sort, keyword and reset to real inventory. `Car` lacks separate make/model: inspect stored fields before additive public mapping; no guessed categories |
| 1B | `/admin/lms`: `src/routes/admin.lms.tsx`; `src/lib/admin.functions.ts` if slug lookup needed | Resolve car_id to existing slug; custom/unavailable cars never generate broken links |
| 1C | `/admin/cars`: `src/routes/admin.cars.tsx`, `src/lib/admin.functions.ts` | Nullable fields optional, blanks→null; preserve core validation; unsold cars need no sold date/price |
| 1D | Fee-copy routes/files listed below | Blocked until approved wording; metadata/FAQ/text only, no redesign |
| 1E | `/sell`, `/contact`, `/car/$id`, `/admin/{lms,leads,bookings,messages}`: corresponding route files; `src/lib/{leads.functions.ts,lead.functions.ts}`, `src/lib/email-templates/{registry.ts,new-inquiry-alert.tsx,send-email.ts}` | Fault-test submission→CRM→email. Event-derived idempotency and atomic persistence or recoverable reconciliation; separately approve additive schema. Saved enquiries survive email failure; surface staff failures/suppression |
| 1F | `/admin/lms`, lead functions; proposed `src/lib/lms-reminders.server.ts` and fixed-purpose `/api/public/lms-follow-up-reminders` | First verify Resend sender, scheduler availability and dry-run selection. External digest provider already approved; managed app emails cannot send recipient lists. External setup/costs, real tests and activation separate |
| 1G | `/admin/inspection`, `/inspection-tool.html`: `src/routes/admin.inspection.tsx`, `public/inspection-tool.html` | Replace absent window.storage only after storage/access decision. Photo-safe quota handling; preserve recoverable drafts and PDF workflow |

### Fee wording: affected pages and confirmation

- `/sell`, `/sell-car-jamshedpur`: zero-commission/100%-proceeds/free-listing claims, body and metadata.
- `/used-cars-in-jamshedpur` and `/used-cars-in-jamshedpur/$brand` (nine current brands): metadata, benefits, seller CTA, RC wording.
- `/`, `/how-it-works`: buyer 0%, seller service charge, homepage FAQ/schema.
- `/buy`, `/car/$id`, `/about`, `/contact`: unqualified commission copy/metadata.
- All eight `/second-hand-cars-in-{jamshedpur,bistupur,sonari,kadma,sakchi,mango,adityapur,telco}` via `src/showcase/locality-page.tsx`, `src/lib/marketplace-areas.ts`.
- Shared `src/components/Footer.tsx`, `/buy`'s `src/components/TrustBar.tsx`, root default description `src/routes/__root.tsx`; review `src/showcase/marketplace.tsx` for inherited copy. Recheck llms wording in Phase 2.

**Please confirm:** buyers pay 0% commission; sellers pay a service charge only after successful sale; RTO fees separate? Is listing free? Is RC assistance free (not RTO charges)? Keep seller charge unspecified or supply an approved amount/formula? No pricing edits before answers.

### Reminder agreement and choices

Already agreed: daily **10:00 AM and 12:00 PM Asia/Kolkata**, to **arindam.banerjee@gearboxautos.in**, **vivekkumar@gearboxautos.in**, **arindammer1222@gmail.com**, **Vivekjnv07@gmail.com**. Four-person Sell/Test Drive/Contact alerts also agreed; no Garage AI alerts.

Propose today's/overdue follow-ups, excluding won/lost, future/missing dates; recompute each slot with per-recipient idempotency and verified scheduler caller. Confirm whether a follow-up can close independently of lead status and whether empty digests should be skipped. Confirm local-only versus account-private inspection drafts and access to the currently public standalone tool. No managed-email queues/cron or generic browser send endpoint. Schedule activation cannot happen while production deployment is prohibited.

**Phase 1 tests/acceptance:** combined filters, dependent models, reset/sort and invalid bounds; real slug opens correct vehicle, custom car safe; optional values save/read back null, required validation intact. Fault-test source/CRM/email failure, suppression and duplicate submissions. Approved test records read back in original inbox and authenticated CRM; retain exact IDs. Verify four recipients at provider evidence level (sent ≠ delivered/opened). Tests assert both IST slots, due/overdue inclusion, closed exclusion and duplicate prevention. Draft/photos survive reload; quota/denied/corrupt storage handled; PDF usable. No existing records removed.

## Phase 2 — SEO and AEO

**2A Intent strategy, approval first:** `/buy` interactive shopping; `/inventory` stock catalogue; `/used-cars-in-jamshedpur` city buying/brand hub; `/second-hand-cars-in-jamshedpur` local viewing/documents/location guide. `/sell` remains form; `/sell-car-jamshedpur` seller guide. Keep all URLs/self-canonicals initially. If useful differentiation fails, submit a specific consolidation proposal; no silent redirect/noindex/cross-page canonical.

**2B Local content:** exact files: four collection/city route files above, seller routes, eight locality route files, `src/showcase/locality-page.tsx`, `src/lib/{marketplace-areas.ts,seo-areas.ts}`. Answer Jamshedpur/near-me/Bistupur/Sonari buying and selling questions with verified Sonari address, recorded locations, document/viewing guidance, distinct local facts and honest nearby-stock labels. No invented distances, local stock, guarantees or unsupported precise geolocation.

**2C Schema/crawl:** `src/routes/car.$id.tsx`, `src/lib/{cars.ts,cars.functions.ts,seo.ts}`: retain formatted UI kilometres, use raw numeric schema mileage; availability from approved status policy. Optional public fields added compatibly; native transport/cache untouched. `public/llms.txt`: remove stale Garage references; safe public links only. `src/routes/sitemap[.]xml.ts`: preserve generator, paginate public records with stable order, genuine lastmod and failure→503; no access widening. Review leaf metadata/internal links, `src/routes/gbx-motor-club.tsx` og:url, slash/brand-case/Honda alias behavior. `public/robots.txt` unchanged absent specific approval.

**Dependencies/decisions:** approved fee wording → copy; intent strategy → linking/canonicals/sitemap. Confirm reserved/sold visibility and empty-brand treatment before availability/indexability changes; confirm Sonet 2020 slug/2021 record before any data/URL correction.

**Tests/acceptance:** numeric mileage and correct approved status mapping, valid FAQ retained; relevant unique heads and one canonical per kept public page on primary domain. Multi-page sitemap fixtures cover all eligible rows once, private exclusions, XML escaping and failed-page 503. Safe working llms links, truthful locality fallback. Index eligibility is not Google indexing; no ranking promise or automatic scan/publication.

## Phase 3 — Analytics, privacy and conversion tracking

**3A Read-only first:** verify root scripts, real network/consent behaviour and authorised Google Ads definitions/tag snippets for **AW-18092790399** and **AW-18444054806**. Check owners, duplicate direct/GTM paths and account-side GA4 destination. No explicit G-ID found in source; platform visitor analytics is not GA4. Existing semantic matches must be checked before new actions.

**3B Proposed events:** seller_form_submitted, contact_enquiry_submitted, test_drive_requested only after confirmed saves. Buyer enquiry uses existing contact/booking flow, not a new form or duplicate primary conversion. phone_link_clicked and whatsapp_link_clicked are secondary intent signals, not completed calls/messages. No invented value, enhanced matching or customer uploads.

**3C Approval then install:** `src/routes/__root.tsx`, `src/routes/privacy-policy.tsx`, seller/contact/car routes, `src/components/{Header.tsx,Footer.tsx,SocialFloat.tsx,ShareButton.tsx,WhatsAppShareCarButton.tsx}`, `src/showcase/marketplace.tsx`; proposed consent/event helper after approval. IDs unchanged until confirmed. Privacy describes actual data, purposes and recipients.

**Consent decision:** regional banner (EU/EEA, UK, Switzerland, Canada) with separate analytics/advertising choices, or skip tracking in consent/unresolved regions. Other visitors still subject to refusal/GPC. Ads clicks/impressions count either way; skip loses those regions' conversion/remarketing signal. No new sending permission from this plan. Scope consent to website unless separately approved Android review; no app changes.

**Dependencies/tests:** reliable Phase 1 success → events; verified IDs/definitions + consent approval → installation. Test success once, failure none; no personal details in ordinary events; accept/reject/no-answer/withdrawal/GPC/cross-tab behavior. Provider receipt separate from browser transmission and attribution. New IDs/actions, ID removal, consent changes and test conversions require approval. No campaign spend/launch/publish.

## Phase 4 — Performance, accessibility and technical SEO

1. **Hydration diagnosis:** `/car/$id`, `src/routes/car.$id.tsx`, related carousel/card/root only if evidence identifies them. Reproduce against preserved published baseline; fix SSR/client cause, never suppress or assume locale formatting.
2. **Media/fonts:** `src/components/{CarCard.tsx,CarImageCarousel.tsx}`, `src/showcase/marketplace.tsx`, `src/routes/__root.tsx`, `src/styles.css`, `src/assets/fonts/`. Inspect sizes/requests; optimize responsive delivery without changing fonts, hero framing, photos or design; keep local library font loading.
3. **Accessibility/admin states:** `/buy`, `/sell`, `/contact`, `/car/$id`, `/admin` and `/admin/{cars,lms,leads,bookings,messages}` corresponding route files; existing dialog/button/form controls and admin functions only as needed. Labels, keyboard/focus, loading/error/retry and failed-edit rollback; no global UI refactor.
4. **Unknown-car HTTP 404:** decision in `/car/$id` loader, preserving valid/legacy routes; distinguish service failure from missing car. Depends on sold-listing policy.

**Tests/acceptance:** reproduced hydration warning disappears after relevant fix; no document overflow at 390/740/1280px; unchanged clear hero/fonts. Keyboard-complete forms/dialogs and focus restoration. Slow/error admin data never looks like empty stock/zero count. Unknown-car HTTP 404 + noindex; valid-car 200; outages not disguised as 404. Existing homepage/native tests pass; no native configuration, package, callback or transport edits. Physical Android remains unverified unless separately tested.

## Proposed implementation prompts

Each is independent and ends with tests, changed-file list, blockers and **no publish**.

1. “Implement 1A only: real `/buy` filters/sort; preserve design and homepage behaviour.”
2. “Implement 1B only: CRM slug links and custom/unavailable-car safeguards.”
3. “Implement 1C only: optional inventory fields/null normalization; retain required validation.”
4. “Apply 1D with my approved fee wording across the complete impact list.”
5. “Investigate 1E reliability; approve additive data changes separately, then repair.”
6. “Investigate 1F sender/scheduler and dry-run eligibility; no sends/activation.” Approve implementation/tests separately.
7. “Implement 1G with my approved storage/access model; preserve PDF.”
8. “Draft Phase 2 intent/local copy for approval.” Implement approved copy, schema/llms and pagination in separate batches.
9. “Read-only Phase 3 Ads/GA4/consent verification; return existing conversion matches.” Approve wiring separately.
10. “Implement Phase 4 as separate diagnosis, media, accessibility/admin-state and 404 batches.”

**Start with 1A, then 1B/1C.** Business decisions can proceed in parallel. Stop after each verified batch for review; plan approval is not blanket permission for pricing, tracking, storage, indexability, external activation or release.
