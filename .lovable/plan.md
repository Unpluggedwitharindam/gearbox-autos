# Fix Garage price output

## Goal
Make Garage return a useful, clearly sourced used-car price range whenever sufficient real evidence exists, while never presenting an invented number as a market valuation.

## Confirmed diagnosis
- The AI endpoint is working: recent requests completed successfully.
- The verified external market-listings table currently contains **0 listings**. The valuation engine therefore returns “unavailable” by design.
- Recent saved questions show that one Hyundai Creta prompt was parsed incorrectly on the live site.
- Follow-up answers are analysed as standalone questions, so details supplied in the previous message can be lost.
- Current Gearbox inventory contains real asking prices, but many records do not have structured make, model, variant, ownership, or manufacturing-year values.

## Changes
1. **Fix vehicle understanding**
   - Parse the full conversation, not only the latest message.
   - Correct make/model extraction for natural questions such as “What should I pay for a 2021 Hyundai Creta…”.
   - Recognise common Indian registration, owner, fuel, transmission, lakh-price, and kilometre formats.
   - Show the interpreted vehicle details before calculating so users can correct them.

2. **Add a guided valuation form**
   - Collect make, model, variant, year, fuel, transmission, kilometres, ownership, registration location, condition, and the quoted price.
   - Ask only for fields still missing from the conversation.
   - Preserve values through follow-up messages.

3. **Provide evidence-based price tiers**
   - Keep verified external listings as the primary market valuation source.
   - Add a separate **Gearbox inventory indication** when sufficiently similar in-stock or sold cars exist.
   - Label asking price, estimated fair-market range, dealer purchase range, recommended listing price, and expected closing price separately.
   - Display evidence count, match quality, location coverage, and confidence beside every range.
   - If evidence is insufficient, explain exactly what is missing instead of showing a misleading price.

4. **Aggregate Cars24, Spinny, CarDekho, and OLX listings**
   - Connect a licensed marketplace-data API that covers these four sources; direct unapproved scraping will not be used.
   - Search each source using the parsed make, model, variant, year, fuel, transmission, kilometres, ownership, and location.
   - Store the source name, original listing URL, observed date, vehicle facts, location, and listed price for traceability.
   - Refresh relevant results on demand with a short cache, then discard stale listings and deduplicate cars repeated across sources.
   - Show each marketplace separately and calculate an overall average, median, and trimmed price range only from genuinely comparable cars.
   - Add an admin import option as a fallback for verified listing data when a source is temporarily unavailable.
   - Before implementation, connect the selected licensed data provider and securely add its API credential. Provider fees and coverage depend on the selected service.

5. **Improve current inventory data quality**
   - Backfill structured make/model/year fields from existing listing names where unambiguous.
   - Flag ambiguous records for admin review rather than guessing.
   - Require the important valuation fields on future inventory entries.

6. **Validate the result**
   - Add tests for the exact Creta and XUV700 questions seen in recent usage, including multi-turn follow-ups.
   - Test no-data, inventory-only, insufficient-comparable, outlier, and verified-market scenarios.
   - Verify that Garage produces a visible range only when its evidence and confidence rules pass.

## Expected outcome
Garage will retain the car details and return an evidence-backed listed-price average from Cars24, Spinny, CarDekho, and OLX when enough comparable listings are available. It will display source links, per-source counts, the median, the trimmed range, and confidence instead of presenting one unexplained number.

## Technical details
- Keep the deterministic valuation engine authoritative; AI explains results but cannot override calculated values.
- Introduce explicit valuation source and confidence fields in the response model.
- Require a minimum number of comparable records and retain fuel isolation, locality tiers, deduplication, and outlier removal.
- Do not treat a simple arithmetic mean as the final valuation: calculate it for transparency, but use median and outlier-trimmed evidence to reduce distortion from unrealistic asking prices.
- Preserve the existing Garage page, inventory features, admin security, and all other website routes.
