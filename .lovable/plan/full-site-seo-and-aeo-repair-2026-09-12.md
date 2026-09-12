# Full-site SEO and AEO repair

## Technical indexing
- Audit every public route against the sitemap and navigation, preserving all existing pages and features.
- Keep one canonical domain (`https://gearboxautos.in`) and ensure each indexable page has a self-referencing canonical.
- Add explicit `noindex, nofollow` metadata to login and the complete admin area, and remove the public footer link to admin.
- Keep robots.txt open for public pages and blocked for private tools.
- Keep the dynamic sitemap complete for public static pages, live brand pages, and live car listings. Add `lastmod` only where an authoritative car update timestamp exists; never use build time.

## Page metadata
- Give every content route a unique title, description, Open Graph title/description/type/URL, and Twitter card.
- Strengthen dynamic brand and car metadata so the H1, URL, canonical, and page topic agree.
- Keep social images only when an absolute, real image displayed on the page is available.
- Give 404 and missing-car states clear non-indexable metadata.

## Structured data and AEO
- Consolidate the dealership identity into one consistent schema using the real address, phone, hours, service area, and social profile.
- Remove duplicate or contradictory dealership schema from local listing pages.
- Add appropriate machine-readable structures: ItemList for inventory, BreadcrumbList for brand and car pages, HowTo for the visible process, and ContactPage/AboutPage/WebPage where applicable.
- Add concise, visible question-and-answer content only where the existing business facts support it; do not invent reviews, guarantees, statistics, or services.
- Add `/llms.txt` with safe public pages so AI assistants can identify and navigate the business.

## Internal discovery and quality
- Improve links among buying, selling, local inventory, brands, Garage, contact, and car details.
- Correct broken placeholder social links and any heading or URL/content mismatches that can be fixed safely in source.
- Preserve the website’s design and all working forms, inventory, sharing, admin, and Garage interactions.

## Verification
- Verify every public route in local SSR, sitemap output, robots.txt, metadata, canonical, JSON-LD, and internal links.
- Re-run the fast SEO checks after changes.
- Publishing and Google Search Console resubmission are separate final steps; indexing timing remains controlled by Google.

## Technical details
- Implement metadata through TanStack route `head()` functions.
- Reuse shared schema constants/helpers to prevent NAP drift between pages.
- Do not add artificial sitemap dates or unsupported FAQ rich-result markup.
