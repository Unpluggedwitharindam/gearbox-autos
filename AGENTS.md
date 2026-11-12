# Architecture rules

- Resolve CRM WhatsApp shares and copy-link actions through the same on-click admin-authenticated, fresh car lookup; only active in-stock slug URLs are shareable, never UUID or name-derived URLs, to preserve public vehicle identity.
- Run CRM handler unit tests with vitest.crm.config.ts so TanStack's RPC transform does not replace the tested handler with an SSR stub.

- Keep /buy filtering and its stored make/model projection page-specific with a separate query key; do not infer categories or alter shared homepage/native inventory contracts.

- Load the library's core token fonts through local font-face CSS and assets under src/assets/fonts so file-copy attach preserves automatic typography loading.

- Keep the homepage visual theme and its header/footer isolated from the shared site shell; homepage search filters the existing public inventory via URL state without changing other inventory routes or business logic.
- Keep reference-led marketplace presentation and locality content in preview-only modules excluded from library attach; reuse the existing public inventory query and form routes. Body categories use an explicit model map and leave unknown models uncategorised because inventory has no body-type field.

- Send app emails only from feature-specific server code through `src/lib/email-templates/send-email.ts`; managed delivery owns retries, suppression, and unsubscribe handling, so do not introduce queue-era infrastructure or browser send endpoints.
- Preserve the shared Vite configuration's VITE_-only client injection; load private environment values into process.env only and resolve email renderer entities imports to the hoisted compatible package to avoid SSR failures.
- Let `/lovable/*` requests bypass application redirects and error-page middleware; each managed route verifies its own caller.
- Package Android from the full TanStack client output and generated SPA shell; never set server.url or ship server output. Keep generated RPC calls with the native Fetch adapter targeting the canonical hosted backend directly and following redirects, cache only public inventory, and require the existing environment-provided upload key for Play release builds without committing signing material.
- Public car reads go through the server publishable-key client selecting only `PUBLIC_CAR_COLUMNS` from `src/lib/public-car-columns.ts`, filtered to active in-stock cars; the database grants client roles SELECT on exactly those columns, so keep the list and the grant in sync.
