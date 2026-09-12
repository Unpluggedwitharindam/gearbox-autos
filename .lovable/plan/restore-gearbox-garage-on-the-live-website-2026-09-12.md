# Restore Gearbox Garage on the live website

## Confirmed diagnosis

- The current preview Garage works end to end and returned a market-backed valuation using 20 comparable listings.
- The live `gearboxautos.in/garage` page is an older version and does not contain the current Ask Garage experience.
- The live `/api/garage-chat` request returns **404**, so the published website cannot run Garage even though the current project can.

## Plan

1. Publish the current project version to `gearboxautos.in`, including the Garage page, its chat endpoint, marketplace connection, and current server code.
2. Test the live Garage with a complete used-car question and confirm it returns an answer, valuation range, source counts, and comparable listings.
3. Verify live mobile and desktop behavior, including submission, loading, error messages, and source links.
4. Confirm the live page remains indexable and that `/garage` stays present in the sitemap.
5. If publication exposes a production-only error, inspect the live request response and server logs, fix only that failure, republish, and repeat the live test.

## Expected result

`https://gearboxautos.in/garage` will run the same working Garage currently available in preview, rather than the older non-functional release.
