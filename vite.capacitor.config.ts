import { defineConfig } from '@lovable.dev/vite-tanstack-config';
import path from 'node:path';

// Same compiler and route tree as the website; only a local SPA shell is packaged.
export default defineConfig({
  nitro: false,
  tanstackStart: {
    server: { entry: 'server' },
    spa: { enabled: true, prerender: { outputPath: '/index' } },
    prerender: { autoStaticPathsDiscovery: false, crawlLinks: false, failOnError: true },
    sitemap: { enabled: false },
  },
  vite: {
    base: '/',
    build: { outDir: 'dist-capacitor' },
    resolve: { alias: {
      'entities/lib/decode.js': path.resolve('node_modules/entities/lib/decode.js'),
      'entities/lib/encode.js': path.resolve('node_modules/entities/lib/encode.js'),
      entities: path.resolve('node_modules/entities'),
    } },
  },
});