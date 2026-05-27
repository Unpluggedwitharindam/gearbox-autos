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
  },
  android: {
    allowMixedContent: false,
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
  },
};

export default config;
