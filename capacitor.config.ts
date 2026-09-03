import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.gearboxautos.app',
  appName: 'Gearbox Autos',
  // Live wrapper: app loads the published website directly.
  // To switch to bundled offline mode, remove `server.url` and set
  // `webDir: 'dist'` after running `npm run build`.
  webDir: 'dist',
  server: {
    url: 'https://www.gearboxautos.in',
    cleartext: false,
    androidScheme: 'https',
    iosScheme: 'https',
  },
  android: {
    allowMixedContent: false,
  },
  ios: {
    contentInset: 'always',
    limitsNavigationsToAppBoundDomains: false,
    backgroundColor: '#0a0a0a',
  },
  plugins: {
    SplashScreen: {
      launchShowDuration: 1500,
      backgroundColor: '#0a0a0a',
      androidScaleType: 'CENTER_CROP',
      showSpinner: false,
      splashFullScreen: true,
      splashImmersive: true,
    },
    StatusBar: {
      style: 'DARK',
      backgroundColor: '#0a0a0a',
    },
  },
};

export default config;
