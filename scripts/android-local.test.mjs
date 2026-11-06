import { readFile } from 'node:fs/promises';
import assert from 'node:assert/strict';
import test from 'node:test';

test('Android starts from packaged files, never a remote website', async () => {
  const config = await readFile('capacitor.config.ts', 'utf8');
  assert.doesNotMatch(config, /\burl\s*:\s*['"]https?:/);
  assert.match(config, /webDir: 'android-web'/);
});

test('Android preparation cannot generate a placeholder or remote redirect', async () => {
  const script = await readFile('scripts/prepare-android.mjs', 'utf8');
  assert.doesNotMatch(script, /Connect to the internet to open the app/);
  assert.match(script, /index\.html/);
  assert.match(script, /assets/);
});