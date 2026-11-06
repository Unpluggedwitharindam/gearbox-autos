# Gearbox Autos — Google Play local release 1.1

## Downloads

- `gearbox-autos-v1.1-local-play-store.aab`: signed bundle to upload to Google Play.
- `gearbox-autos-v1.1-local-android.apk`: signed APK for direct phone testing.
- `gearbox-autos-private-signing-backup-v1.zip`: unchanged existing upload-key backup. Keep private; never upload it to Play or a public repository.
- `gearbox-autos-play-upload-guide-v2.md`: this guide plus configuration and change details.

Package `in.gearboxautos.app`; Play title **Gearbox Autos: Buy & Sell Cars**; launcher **Gearbox Autos**; version **1.1**, code **2**; minimum Android 7 / API 24; target API 36.

## Before submitting

1. Install the signed test APK on a phone. Verify startup in airplane mode, reconnect, browse cars, search, open galleries, submit Sell/Test Drive/Contact forms, and check LMS.
2. Publish the project’s new `/app-auth` callback page before testing Google sign-in. This release keeps inventory/forms on the existing hosted service but never loads a remote homepage.
3. Test Android Back, WhatsApp links, phone/email links, inspection/export and Google sign-in on a real device. Browser native-bridge tests do not replace these checks.
4. In Play Console, choose this app → Testing → Internal testing → Create release, and upload the **v1.1 local AAB**, not the old v1.0 website-wrapper AAB or the APK.
5. Enable Play App Signing. Use Google’s generated app-signing key while retaining this existing upload key. Complete Data safety, privacy policy, content rating, app access and account-specific testing requirements.

## Build again

Install Node 22+, JDK 21, Android SDK 36/build tools 36.0.0. From the project root:

```bash
npm install
npm run app:test
npm run app:build
npm run app:sync
npm run app:open
```

The exact frontend command is `vite build --config vite.capacitor.config.ts && node scripts/prepare-android.mjs`.
The exact sync command is `cap sync android` (or `npx cap sync android`).

Set `ANDROID_KEYSTORE_PATH`, `ANDROID_KEYSTORE_PASSWORD`, `ANDROID_KEY_ALIAS`, `ANDROID_KEY_PASSWORD` privately from the existing backup, never in source or chat. Then:

```bash
android/gradlew -p android bundleRelease assembleRelease
```

Android Studio: open `android/`, wait for sync, then **Build → Generate Signed Bundle / APK → Android App Bundle**, select the **existing** key/alias and release. Launch Studio with the private signing environment configured because the existing Gradle guard requires it.

The GitHub workflow builds the local frontend before sync. Signed AAB generation requires existing upload-key Actions secrets and the public `VITE_SUPABASE_URL`, `VITE_SUPABASE_PUBLISHABLE_KEY`, `VITE_SUPABASE_PROJECT_ID` build variables from the project’s environment. Never add a private/service key as a VITE variable.

## Verification completed

- Production frontend build and Capacitor Android sync succeeded.
- Signed Gradle AAB/APK and Android unit-test tasks succeeded.
- Bundletool validation, AAB signature and APK signature verification passed. Existing signing certificate retained.
- Both archives contain local index.html, compiled JS/CSS, logo/showroom assets and no remote `server.url`.
- Browser tests at `https://localhost` with native-bridge simulation: homepage, inventory, Buy, Sell, Contact, About, How It Works and detail routes render; local images load; real Sell/Test Drive/Contact submissions return success; offline submissions fail without clearing input; offline homepage remains visible; an injected admin session opens LMS; mobile homepage has no horizontal overflow.
- Test enquiries named **TEST local Android…** with phone **9000000001** were created by verification; remove these practice records from LMS.

## Still to verify

No emulator/physical device was available. Actual device launch, native Back/WhatsApp, inspection export and browser Google callback round-trip are not certified. The hosted callback must be published. Google Play approval is not guaranteed. Database-backed content remains online-dependent.