# Gearbox Autos — Mobile Apps (Android + iOS)

This project is wired up with **Capacitor** to package the live website
(`https://www.gearboxautos.in`) as native **Android (APK/AAB)** and
**iOS (IPA)** apps.

- App name: **Gearbox Autos**
- Bundle / package ID: **com.gearboxautos.app**
- Mode: **Live wrapper** — the app loads the published site, so anything
  you publish on Lovable appears in the app instantly without rebuilding.

> Native builds cannot run inside Lovable's sandbox. Android Studio (any
> OS) and Xcode (macOS only) run on your machine. Do the setup once; after
> that you only rebuild when you change icons, name, or native config.

## One-time setup on your computer

1. Install [Node.js 20+](https://nodejs.org/).
   - Android: [Android Studio](https://developer.android.com/studio)
   - iOS: macOS + [Xcode](https://developer.apple.com/xcode/) + CocoaPods (`sudo gem install cocoapods`)
2. In Lovable, click **GitHub → Export to GitHub** and create a repository.
3. Clone it locally and install dependencies:
   ```bash
   git clone <your-repo-url> gearbox-autos
   cd gearbox-autos
   npm install
   ```
4. Add the platforms you need:
   ```bash
   npx cap add android   # creates android/
   npx cap add ios       # creates ios/  (macOS only)
   ```

## Build — Android

```bash
npm run build
npx cap sync android
npx cap open android
```

In Android Studio:

1. Wait for Gradle sync to finish.
2. **Build → Build Bundle(s) / APK(s) → Build APK(s)**.
3. Click **locate** — the APK is at
   `android/app/build/outputs/apk/debug/app-debug.apk`.
4. Transfer to your phone, allow "Install from unknown sources", install.

Play Store: **Build → Generate Signed Bundle / APK → Android App Bundle
(.aab)**, create a keystore the first time (keep the file + passwords
safe), then upload to the [Play Console](https://play.google.com/console).

## Build — iOS (macOS only)

```bash
npm run build
npx cap sync ios
npx cap open ios
```

In Xcode:

1. Select the **App** target → **Signing & Capabilities**, choose your
   Apple Developer team (a free account works for installing on your own
   device; a paid $99/yr account is required for the App Store).
2. Pick your connected iPhone (or a simulator) and press **Run** to install.
3. For the App Store: **Product → Archive → Distribute App → App Store
   Connect**, then submit in
   [App Store Connect](https://appstoreconnect.apple.com).

## Updating the apps later

Because this is a **live wrapper**, you usually don't rebuild. Publish on
Lovable and users see changes instantly.

Rebuild only when you change:
- app icon, splash screen, or app name
- `capacitor.config.ts`
- native capabilities (camera, push notifications, etc.)

```bash
git pull && npm install && npm run build
npx cap sync android   # and/or: npx cap sync ios
```

## Switching to a bundled offline app

Remove the `server` block from `capacitor.config.ts` (keep
`webDir: 'dist'`), then `npm run build && npx cap sync` and rebuild.
Every content change then needs a new app release.
