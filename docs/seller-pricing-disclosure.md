# Controlled seller pricing disclosure — 12 November 2026

Preview only. The owner-approved disclosure is sourced from `src/showcase/seller-pricing.ts`, which is already excluded from design-library attach by the existing showcase exclusion. No new library component, form behavior, database change or publication is introduced.

## Policy

Seller assistance fees are based on the final vehicle selling price:
- Below ₹3,00,000: ₹10,000
- ₹3,00,000 to ₹5,00,000 inclusive: ₹15,000
- Above ₹5,00,000: 3% of the entire final selling price.

For example, a car sold for ₹6,00,000 attracts a seller assistance fee of ₹18,000.

No payment timing, listing price, optionality, GST, refund, cancellation, buyer commission or RTO policy is inferred. Existing explicitly buyer-facing commission/RTO wording is unchanged, not newly confirmed. Unrelated inspection, customer statistics, privacy and Motor Club issues remain deferred.

## Verification

- Five pricing tests pass: 299999 → 10000; 300000 → 15000; 500000 → 15000; 500100 → 15003; 600000 → 18000.
- Existing Buy tests: 20 pass. Existing homepage inventory tests: 13 pass.
- Browser: eight affected routes at 1280×1800 and 390×844; no document overflow; both full disclosures present; Sell form remains usable for local entry without submission; seller FAQ expands and its schema reflects fees.
- Preview build log: build OK.

The calculator is used to derive the disclosed example; it is not connected to checkout, invoicing or lead submissions. It does not define handling for invalid values or currency rounding.