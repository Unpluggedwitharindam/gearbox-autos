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

4. **Make the market-data gap manageable**
   - Add an admin workflow to enter or import verified comparable listings with source URL, observed date, vehicle details, location, and asking price.
   - Reject incomplete, duplicate, stale, or unverifiable rows.
   - Do not scrape or fabricate listings. A third-party live market feed can be connected later if one is supplied.

5. **Improve current inventory data quality**
   - Backfill structured make/model/year fields from existing listing names where unambiguous.
   - Flag ambiguous records for admin review rather than guessing.
   - Require the important valuation fields on future inventory entries.

6. **Validate the result**
   - Add tests for the exact Creta and XUV700 questions seen in recent usage, including multi-turn follow-ups.
   - Test no-data, inventory-only, insufficient-comparable, outlier, and verified-market scenarios.
   - Verify that Garage produces a visible range only when its evidence and confidence rules pass.

## Expected outcome
Garage will stop appearing broken: it will retain the car details, explain its evidence, and return the best defensible price range available. A genuinely current market valuation still requires verified comparable listings or a connected licensed market-data provider; the system will not manufacture one.

## Technical details
- Keep the deterministic valuation engine authoritative; AI explains results but cannot override calculated values.
- Introduce explicit valuation source and confidence fields in the response model.
- Require a minimum number of comparable records and retain fuel isolation, locality tiers, deduplication, and outlier removal.
- Preserve the existing Garage page, inventory features, admin security, and all other website routes.
