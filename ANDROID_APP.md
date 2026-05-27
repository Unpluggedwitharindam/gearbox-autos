# Gearbox Autos — Android App

This project is wired up with **Capacitor** to package the live website
(`https://www.gearboxautos.in`) as a native Android APK.

- App name: **Gearbox Autos**
- Package ID: **com.gearboxautos.app**
- Mode: **Live wrapper** — the APK loads the published site, so any
  change you publish on Lovable appears in the app instantly without
  rebuilding the APK.

> APKs cannot be built inside Lovable's sandbox — Android Studio and the
> Android SDK only run on your local machine. Follow the steps below
> once on your computer; after that you only re-run them when you want
> to ship a new APK version (e.g. for a Play Store update).

## One-time setup on your computer

1. Install [Node.js 20+](https://nodejs.org/) and
   [Android Studio](https://developer.android.com/studio) (includes the
   Android SDK).
2. In Lovable, click **GitHub → Export to GitHub** (top right) and
   create a repository.
3. Clone it locally and install dependencies:
   ```bash
   git clone <your-repo-url> gearbox-autos
   cd gearbox-autos
   npm install
   ```
4. Add the Android platform (creates an `android/` folder):
   ```bash
   npx cap add android
   ```

## Build the APK

```bash
npm run build          # builds the web app into /dist
npx cap sync android   # copies config + web assets into the Android project
npx cap open android   # opens Android Studio
```

In Android Studio:

1. Wait for Gradle to finish syncing (first time can take a few minutes).
2. **Build → Build Bundle(s) / APK(s) → Build APK(s)**.
3. Click **locate** in the popup — the APK is in
   `android/app/build/outputs/apk/debug/app-debug.apk`.
4. Transfer to your phone, enable "Install from unknown sources", tap to
   install.

## Publishing to the Play Store

1. In Android Studio: **Build → Generate Signed Bundle / APK → Android App
   Bundle (.aab)**.
2. Create a new keystore the first time (keep the file + passwords safe —
   you'll need them for every future update).
3. Upload the `.aab` to the [Play Console](https://play.google.com/console).

## Updating the app later

Because this is a **live wrapper**, you usually don't need to rebuild
the APK. Just publish changes on Lovable — users see them instantly.

You only need a new APK when you change:
- The app icon, splash screen, or name
- The `capacitor.config.ts` file
- Native capabilities (camera, push notifications, etc.)

To rebuild after such a change:
```bash
git pull
npm install
npm run build
npx cap sync android
# then Build → Build APK in Android Studio
```

## Switching to a bundled offline app

If you'd rather ship the website inside the APK (works offline, but
every change needs a new APK), edit `capacitor.config.ts`:

```ts
// Remove the `server` block entirely. webDir stays as 'dist'.
```

Then `npm run build && npx cap sync android` and rebuild.
