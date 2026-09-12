# Connect Garage to live Indian car listings without manual API keys

## Goal
Give Garage current comparable asking prices from Cars24, Spinny, CarDekho, and OLX without requiring the owner to obtain or paste an API key.

## Approach
1. **Use Lovable’s managed Apify connection**
   - Open the secure connection screen after approval.
   - The owner signs in or creates an account there; no credential is pasted into chat or committed to the project.
   - Run dedicated marketplace collectors for Cars24, Spinny, CarDekho, and OLX through the connected service.

2. **Create a server-side marketplace adapter**
   - Convert results from all four marketplaces into one strict comparable-listing format.
   - Preserve source name, original listing URL, observed date, make, model, variant, year, fuel, transmission, kilometres, ownership, location, and asking price.
   - Cache recent results in the existing verified-listings table so repeated questions are fast and traceable.
   - Surface source failures clearly; never replace missing results with invented cars.

3. **Fix vehicle extraction and follow-ups**
   - Correct the live parsing bug affecting natural prompts such as “What should I pay for a 2021 Hyundai Creta…”.
   - Merge details from the full conversation so follow-up answers do not lose the earlier car information.
   - Recognise Indian number, registration, owner, fuel, transmission, kilometre, and lakh-price formats.

4. **Calculate transparent listed-price evidence**
   - Match exact make/model/fuel first, then progressively relax variant, kilometre, year, and geography with visible disclosures.
   - Deduplicate repeated vehicles across sources and remove statistical outliers.
   - Show per-marketplace counts and averages, plus the combined average, median, trimmed range, and confidence.
   - Keep asking-price evidence distinct from fair-market value, dealer buying price, recommended listing price, and expected closing price.

5. **Improve the Garage experience**
   - Add guided fields for the car details needed for a useful valuation.
   - Show the interpreted vehicle and allow corrections before calculating.
   - If a marketplace is unavailable or evidence is too thin, explain exactly what is missing.

6. **Validate**
   - Test the recent Creta and XUV700 questions, including multi-turn follow-ups.
   - Test all four source adapters, duplicate removal, stale data, outliers, partial source failures, and no-result cases.
   - Make a real Garage request and verify visible source links and the calculated range.

## Limits
- Marketplace pages can change or block automated access, so an Apify-based integration needs monitoring and may incur Apify usage charges.
- Garage will use only successfully retrieved, attributable listings. It will not claim a live average when fewer than the required comparable records are available.
- Existing website pages, inventory behavior, and admin security remain unchanged.
