# Publish Google Tag and Gearbox Garage

## Changes
- Add `/garage` to the public sitemap so Google can discover the page.
- Keep the existing Garage title, description, canonical URL, social metadata, and indexable robots settings.
- Keep the Google Ads tag loaded once from the shared site head so it appears on every page.

## Release and verification
- Run a fresh security scan because the available scan is stale, and review any critical findings before release.
- Publish the latest project to the connected `gearboxautos.in` domain.
- Confirm the live homepage contains Google tag `AW-18444054806`.
- Confirm `https://gearboxautos.in/garage` loads publicly with indexable metadata.
- Confirm `https://gearboxautos.in/sitemap.xml` includes `/garage`, then resubmit the sitemap to Google Search Console if the connection permits it.

## Expected result
The Google tag will be detectable on the live website, and Gearbox Garage will be publicly crawlable and submitted for indexing. Google controls crawl timing, so immediate search-result appearance cannot be guaranteed.
