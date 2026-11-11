# Architecture rules

- Keep the homepage visual theme and its header/footer isolated from the shared site shell; homepage search filters the existing public inventory via URL state without changing other inventory routes or business logic.

- Send app emails only from feature-specific server code through `src/lib/email-templates/send-email.ts`; managed delivery owns retries, suppression, and unsubscribe handling, so do not introduce queue-era infrastructure or browser send endpoints.
- Preserve the shared Vite configuration's VITE_-only client injection; load private environment values into process.env only and resolve email renderer entities imports to the hoisted compatible package to avoid SSR failures.
- Let `/lovable/*` requests bypass application redirects and error-page middleware; each managed route verifies its own caller.
- Package Android from the full TanStack client output and generated SPA shell; never set server.url or ship server output. Keep generated RPC calls with the native Fetch adapter targeting the canonical hosted backend directly and following redirects, cache only public inventory, and require the existing environment-provided upload key for Play release builds without committing signing material.