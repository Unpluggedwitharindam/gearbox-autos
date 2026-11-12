import { defineConfig } from 'vitest/config';

// Run handler unit tests without TanStack rewriting the module into an SSR RPC stub.
export default defineConfig({
  resolve: { alias: { '@': new URL('./src', import.meta.url).pathname } },
  test: { environment: 'node' },
});