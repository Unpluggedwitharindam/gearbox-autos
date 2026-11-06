import { cp, mkdir, readFile, readdir, rm, stat, writeFile } from 'node:fs/promises';
import path from 'node:path';

const candidates = ['dist-capacitor/client', 'dist/client', '.output/public'];
let source;
let shell;
for (const candidate of candidates) {
  for (const name of ['android-shell.html', 'index.html']) {
    try {
      const html = await readFile(path.join(candidate, name), 'utf8');
      if (html.includes('<html') && html.includes('assets/') && html.includes('<script')) {
        source = candidate;
        shell = html;
        break;
      }
    } catch { /* Try another real build output. */ }
  }
  if (source) break;
}
if (!source || !shell) throw new Error('No production frontend shell found. Run npm run app:build first. No placeholder will be packaged.');
const assets = await readdir(path.join(source, 'assets'));
if (!assets.some((name) => name.endsWith('.js')) || !assets.some((name) => name.endsWith('.css'))) {
  throw new Error('Production JS/CSS assets are missing.');
}
await rm('android-web', { recursive: true, force: true });
await mkdir('android-web', { recursive: true });
await cp(source, 'android-web', { recursive: true });
await writeFile('android-web/index.html', shell);

// Lovable media pointers are website-relative; copy their original bytes locally.
async function copyMedia(directory) {
  for (const entry of await readdir(directory, { withFileTypes: true })) {
    const file = path.join(directory, entry.name);
    if (entry.isDirectory()) await copyMedia(file);
    else if (entry.name.endsWith('.asset.json')) {
      const pointer = JSON.parse(await readFile(file, 'utf8'));
      if (!pointer.url?.startsWith('/__l5e/')) continue;
      const response = await fetch(new URL(pointer.url, 'https://www.gearboxautos.in'));
      if (!response.ok) throw new Error(`Cannot package media: ${entry.name}`);
      const destination = path.join('android-web', pointer.url);
      await mkdir(path.dirname(destination), { recursive: true });
      await writeFile(destination, new Uint8Array(await response.arrayBuffer()));
    }
  }
}
await copyMedia('src/assets');
for (const match of shell.matchAll(/(?:src|href)="(\/assets\/[^"?#]+)[^"]*"/g)) {
  await stat(path.join('android-web', match[1]));
}
console.log(`Packaged full frontend from ${source}; ${assets.length} compiled assets. Server output is excluded.`);