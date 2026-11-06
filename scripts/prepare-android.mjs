import { mkdir, writeFile } from 'node:fs/promises';

// This is a live-site wrapper, not a bundle of the SSR site's server output.
await mkdir('android-web', { recursive: true });
await writeFile('android-web/index.html', '<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"><title>Gearbox Autos</title></head><body><h1>Gearbox Autos</h1><p>Connect to the internet to open the app.</p><a href="https://www.gearboxautos.in">Open Gearbox Autos</a></body></html>');