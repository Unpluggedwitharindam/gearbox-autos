# Build Garage used-car intelligence

## Product outcome
Turn `/garage` from a fixed prototype into a live, streaming Gearbox Autos assistant. It will answer as an Indian used-car analyst, use real Jamshedpur inventory, extract vehicle details, ask only for required missing facts, and show structured evidence without inventing listings or prices.

## Ask Garage and live AI
- Replace the fixed verdict flow with a persistent-on-page conversation using the full message history for every request.
- Add a secure streaming server endpoint using Lovable AI and the default reasoning model, with visible progress, stop/error states, markdown answers, and status-specific credit/rate-limit messages.
- Give the agent server-side tools for vehicle parsing, Gearbox inventory search, and deterministic valuation. The AI explains tool results; it never performs or overrides the valuation calculation.
- Enforce an Indian-market, dealer-aware system prompt: distinguish asking price, fair value, dealer buy price, listing price, and expected closing price; ask for missing required fields; never state unsupported market facts.

## Comparable and valuation engine
- Add typed, provider-neutral vehicle and listing schemas. Missing source fields remain `Unknown`.
- Implement progressive matching levels exactly from exact local matches through ownership, KM, variant, and geography relaxation, recording every relaxation shown to the user.
- Score relevance using the requested make/model/variant/fuel/transmission/ownership/KM/age/location weights; reject primary fuel mismatches; deduplicate by source ID/URL and vehicle fingerprint.
- Detect outliers with quartiles/IQR and trimmed distributions, then calculate evidence statistics, value ranges, buy/list/close estimates, margin opportunity, and the six-part Garage Score only when sufficient verified evidence exists.
- Keep external sources behind an adapter interface. No external provider is currently connected, so the shipped UI will explicitly report external market evidence as unavailable rather than fabricate “live” listings. A provider can later be added without changing valuation logic.

## Inventory and data model
- Extend inventory with structured make, model, variant, ownership, registration/manufacturing year, acquisition price/date, listing status, sold date/price, and condition/service/insurance fields needed by matching and dealer analytics.
- Preserve current listings and images; infer nothing uncertain during migration. Existing absent fields stay unknown and can be completed in the admin editor.
- Update public and admin inventory readers/forms to use the expanded schema, with server-side validation and existing admin authorization.

## Garage result experience
- Keep the existing Garage visual identity, but make the ask box the primary working surface.
- Render the parsed vehicle, missing-information prompts, Garage Score, value ranges, explanation, actual evidence counts, inventory matches, market statistics, distribution chart, and sortable comparable table.
- External rows always show source, freshness, location, and original URL. Empty, partial, broadened-search, provider-failure, loading, and insufficient-evidence states will be explicit.
- Keep the steering-wheel/pedal interactions as supporting controls, not as substitutes for analysis.

## Dealer dashboard
- Add a protected Garage Intelligence admin view with stock count, inventory age, purchase/list/sale metrics, margin, pricing alerts, demand opportunities, and a per-car market comparison table.
- Metrics with missing acquisition, sale, or external-market evidence show “Not enough data” rather than zero or an invented recommendation.

## Verification
- Unit-test matching levels, weighting, fuel isolation, deduplication, quartiles/outliers, valuation ranges, and insufficient-data rules.
- Invoke the real AI endpoint and verify streaming, tool use, inventory grounding, full-history follow-ups, and terminal/retryable error handling.
- Browser-test public Garage and protected admin flows on desktop and mobile, including sorting, source links, empty/provider-failure states, accessibility, and no console errors.

## Current limitation
A verified external Indian listing API/search feed and its credentials have not been provided. This build will deliver the complete adapter and honest fallback state, plus live AI grounded in Gearbox inventory. External comparable counts, market medians, and market-based valuations will activate only after a real source is connected.
