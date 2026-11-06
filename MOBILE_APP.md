# Gearbox Autos — Locally bundled Android app

The Android app now packages the existing TanStack Start/Vite frontend locally. It does not fetch a website document to start. Inventory, enquiries, authentication, uploads and administration still use the existing online services.

- Package: `in.gearboxautos.app`
- Launcher name: Gearbox Autos
- Play title: Gearbox Autos: Buy & Sell Cars
- Release: 1.1 / version code 2
- Capacitor Android/core/CLI: unchanged at 8.3.4
- Build prerequisites: Node 22+, JDK 21, Android SDK 36, build tools 36.0.0

## Build and sync

```bash
npm install
npm run app:test
npm run app:build
npm run app:sync
npm run app:open
```

`app:build` runs `vite build --config vite.capacitor.config.ts`, producing `dist-capacitor/client/index.html` and its compiled assets. `scripts/prepare-android.mjs` copies the full client output into `android-web`, packages the original logo/showroom media referenced by the existing asset pointers, and validates JS/CSS. It fails rather than generating a placeholder. The server output is not copied.

`app:sync` runs `cap sync android`, copying `android-web` to `android/app/src/main/assets/public` and updating native plugins/configuration. Root-relative `/assets/` paths work on Capacitor's HTTPS localhost server; nested routes resolve through the packaged shell.

## Android Studio

Open the existing `android/` project using `npm run app:open`. Wait for Gradle sync. Select an Android device/emulator and Run. For a debug APK, choose **Build → Build Bundle(s) / APK(s) → Build APK(s)**. Output: `android/app/build/outputs/apk/debug/app-debug.apk`.

For release, supply the existing upload-key settings privately in the environment that launches Android Studio: `ANDROID_KEYSTORE_PATH`, `ANDROID_KEYSTORE_PASSWORD`, `ANDROID_KEY_ALIAS`, `ANDROID_KEY_PASSWORD`. Do not create a replacement key. Choose **Build → Generate Signed Bundle / APK → Android App Bundle**, select the existing keystore and alias, choose release, and finish. The Gradle release guard also requires those environment settings.

Alternatively:

```bash
android/gradlew -p android bundleRelease assembleRelease
```

On Windows use `android\gradlew.bat -p android bundleRelease assembleRelease`.

AAB: `android/app/build/outputs/bundle/release/app-release.aab`.
Signed test APK: `android/app/build/outputs/apk/release/app-release.apk`.

## Behaviour and limitations

- Homepage and static screens render locally. Public inventory is cached on successful reads; connectivity errors show a warning and may show saved listings. No offline marketplace or offline enquiry queue is promised.
- Enquiry mutations fail visibly when disconnected and retain their input. A timed-out submission can have an uncertain outcome; check LMS before retrying.
- Car images uploaded to inventory still require connectivity unless the WebView has cached them. Local branded assets are packaged.
- Native server-function transport preserves TanStack serialization and bearer headers; native HTTP avoids WebView cross-origin restrictions. No database credentials are packaged.
- Back navigation uses app history, exiting only at the root. Internal pages stay local; external links use the platform/browser. WhatsApp uses native link handling.
- Google sign-in uses the browser and the hosted public `/app-auth` page, then returns through `in.gearboxautos.app://auth` with state verification. Publish the new hosted callback before testing Google sign-in in the release. Physical-device OAuth and WhatsApp/back behaviour remain device-test requirements.
- Inspection PDF export retains its existing online font/CDN dependencies.
- Every frontend change now requires rebuilding and distributing a new APK/AAB. Updating inventory data does not require a new app release. Increase version code for each Play upload.

The website's normal hosted SSR rendering is preserved; its build additionally emits an Android shell. iOS device behaviour is not verified by this Android task.