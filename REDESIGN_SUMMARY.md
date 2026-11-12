# Gearbox Autos reference-led redesign

## Changed

- Rebuilt the public homepage with the exact supplied logo, white background, forest-green sections, yellow actions, responsive navigation and large Buy/Sell cards.
- Imported the supplied automotive imagery and made WebP copies for display. References remain references, not static page backgrounds. The favicon is padded to a square without stretching the logo.
- Connected homepage keyword, budget and body-style search to the existing live inventory and URL state. Added four current listings with real prices, details, and device-local wishlist persistence.
- Added locality shortcuts, trust information, five budget categories, five body categories, GBX Motor Club benefits, buying/selling steps, a neutral reviews section, visible FAQs with matching structured data, final actions, app-install entry and footer.
- Added separate pages for Jamshedpur, Bistupur, Sonari, Kadma, Sakchi, Mango, Adityapur and Telco. Each has unique guidance, metadata, canonical URL, breadcrumbs, visible FAQs and related links. Inventory location is shown honestly; nearby cars are not labelled as belonging to a locality when their records do not say so.
- Added a GBX Motor Club information page directing membership enquiries into the existing Contact Us form. Extended the existing sitemap with the nine new pages. Existing robots.txt already permits public crawling and references the sitemap, so it remains unchanged.

## Preserved

All existing public routes, database/schema, inventory reads, admin, authentication, form submission handlers, emails, LMS, WhatsApp/phone links, root tracking scripts, dealership schema and Android transport remain unchanged. Existing pages retain their shared shell; only the homepage and newly added pages use the new marketplace shell. No website deployment or Android release was performed.

## Controls and limitations

- Buy opens the existing inventory page; Sell opens the existing seller form; car details retain the existing test-drive form.
- Motor Club membership is an enquiry, not an automatic registration/payment system. Fees, eligibility and terms are confirmed with the team.
- Body style is derived from explicitly recognised model names because the database has no body-style field. Unknown models are excluded from body-category results, not guessed.
- Wishlist saves on the current device only; there is no account-level saved-car service.
- No verified customer reviews were available, so no names, ratings or testimonials were fabricated.
- Inspection messaging asks for completed checks on a specific vehicle, rather than asserting every listing is inspected. Seller charges remain consistent with the existing How It Works policy.
- The supplied hero is 858×249; it is used as supplied rather than regenerated. A higher-resolution original would improve very large desktop displays.

## Verification

20 inventory-filter and native-transport regression tests passed. Browser checks confirmed live listings, keyword and budget filtering, MUV category results, wishlist persistence, car-detail/test-drive form entry, Sell form entry, Motor Club-to-Contact form entry, all eight locality pages, sitemap inclusion, mobile menu navigation and no horizontal overflow at 390, 768, 1024 and 1440 widths. No broken homepage images or browser runtime errors were observed. Existing forms were not submitted again during this presentation-only change, avoiding new practice records or team emails. Latest automatic build validation passed.