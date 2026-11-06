# Architecture rules

- Send app emails only from feature-specific server code through `src/lib/email-templates/send-email.ts`; managed delivery owns retries, suppression, and unsubscribe handling, so do not introduce queue-era infrastructure or browser send endpoints.
- Preserve the shared Vite configuration's VITE_-only client injection; load private environment values into process.env only and resolve email renderer entities imports to the hoisted compatible package to avoid SSR failures.
- Let `/lovable/*` requests bypass application redirects and error-page middleware; each managed route verifies its own caller.
- Package Android as a Capacitor HTTPS live-site wrapper with a generated local fallback, not the TanStack SSR build; Play release builds must require an environment-provided upload key and never commit signing material.