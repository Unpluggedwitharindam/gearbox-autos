# Gearbox Autos — Google Play release

- Store title: Gearbox Autos: Buy & Sell Cars
- Android application ID: in.gearboxautos.app
- Home-screen name: Gearbox Autos
- Initial version: 1.0, version code 1
- Minimum Android: 7.0 (API 24)
- Target Android: API 36

Upload the signed `.aab` to Google Play Console. The `.apk` is for direct device testing, not the new-listing upload.
Enable Google Play App Signing and let Google generate the app-signing key; the supplied private key is the upload key.
Back up the private signing archive and its credentials outside the repository. Never publish it or attach it to the store listing.
Increase `versionCode` in `android/app/build.gradle` for every subsequent Play upload and use the same upload key.

## Rebuild

Use Node 22+, JDK 21, Android SDK 36, and build tools 36.0.0.
Run `npm install`, `npm run app:test`, and `npm run app:sync`.
Supply `ANDROID_KEYSTORE_PATH`, `ANDROID_KEYSTORE_PASSWORD`, `ANDROID_KEY_ALIAS`, and `ANDROID_KEY_PASSWORD` privately in the build environment.
Run `android/gradlew -p android bundleRelease`.

The GitHub workflow can also build the signed AAB after configuring repository Actions secrets `ANDROID_KEYSTORE_BASE64`, `ANDROID_KEYSTORE_PASSWORD`, `ANDROID_KEY_ALIAS`, and `ANDROID_KEY_PASSWORD`.

## Verification scope

The initial release was compiled with Gradle, validated with Google's bundletool, verified with jarsigner/apksigner, and passed configuration and Android unit tests.
Bundled Gearbox Autos icon and portrait/landscape splash assets were visually inspected.
No Android emulator or physical device was available, so app launch, navigation, form submission, and Google sign-in inside the native WebView have not been device-tested.
Google Play acceptance is not guaranteed: complete the privacy policy, Data safety, content rating, app access, and any required account-specific testing before requesting production access.