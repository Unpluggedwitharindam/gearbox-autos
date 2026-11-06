import { readFile } from 'node:fs/promises';
import assert from 'node:assert/strict';
import test from 'node:test';

test('Android application ID is in.gearboxautos.app across native configuration', async () => {
  const config = await readFile('capacitor.config.ts', 'utf8');
  const gradle = await readFile('android/app/build.gradle', 'utf8');
  const strings = await readFile('android/app/src/main/res/values/strings.xml', 'utf8');
  const activity = await readFile('android/app/src/main/java/in/gearboxautos/app/MainActivity.java', 'utf8');
  assert.match(config, /appId: 'in\.gearboxautos\.app'/);
  assert.match(gradle, /applicationId "in\.gearboxautos\.app"/);
  assert.match(gradle, /namespace = "in\.gearboxautos\.app"/);
  assert.match(strings, /name="package_name">in\.gearboxautos\.app</);
  assert.match(activity, /^package in\.gearboxautos\.app;/);
});

test('Play listing title stays within the 30-character limit', () => {
  assert.equal('Gearbox Autos: Buy & Sell Cars'.length, 29);
  assert.ok('Gearbox Autos: Buy & Sell Cars'.length <= 30);
});

test('Release builds require upload signing configuration', async () => {
  const gradle = await readFile('android/app/build.gradle', 'utf8');
  assert.match(gradle, /throw new GradleException/);
  for (const name of ['ANDROID_KEYSTORE_PATH', 'ANDROID_KEYSTORE_PASSWORD', 'ANDROID_KEY_ALIAS', 'ANDROID_KEY_PASSWORD']) {
    assert.ok(gradle.includes(name), `Missing ${name}`);
  }
});