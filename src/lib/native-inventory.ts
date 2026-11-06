import { createMiddleware } from '@tanstack/react-start';
import type { Car } from './cars';
import { isNativeApp } from './native-app';

const CACHE_KEY = 'gearbox-public-inventory-v1';
export function cachedInventory(): Car[] {
  try { return JSON.parse(localStorage.getItem(CACHE_KEY) ?? '[]'); } catch { return []; }
}

// Only public reads may fall back. Mutations and protected data never do.
export const nativeInventoryCache = createMiddleware({ type: 'function' }).client(async (options) => {
  const { next } = options;
  if (!isNativeApp()) return next();
  try {
    const original = await next();
    const out = original as typeof original & { result?: unknown };
    try { localStorage.setItem(CACHE_KEY, JSON.stringify(out.result)); } catch { /* Storage can be full. */ }
    window.dispatchEvent(new Event('gearbox:connection-restored'));
    return original;
  } catch {
    window.dispatchEvent(new Event('gearbox:connection-error'));
    return { ...options, 'use functions must return the result of next()': true as const, headers: {}, result: cachedInventory() };
  }
});