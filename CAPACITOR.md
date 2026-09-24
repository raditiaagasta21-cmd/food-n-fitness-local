# Export EatTrack to Android Studio (Capacitor)

EatTrack stores everything in the device's localStorage and needs no server, so it runs inside a Capacitor WebView.

## 1. Get the code
Connect the project to GitHub in Lovable, then clone it and run `npm install`.

## 2. Build a static (SPA) version
In `vite.config.ts` enable SPA mode so the build outputs a plain HTML shell:

```ts
export default defineConfig({
  tanstackStart: {
    server: { entry: "server" },
    spa: { enabled: true, prerender: { outputPath: "/index.html" } },
  },
});
```

Then run:

```bash
npm run build
```

The static files are in `dist/client` (contains `index.html`).

## 3. Add Capacitor
```bash
npm install @capacitor/core @capacitor/cli @capacitor/android
npx cap init EatTrack com.eattrack.app --web-dir dist/client
npx cap add android
npx cap sync android
npx cap open android
```

Android Studio opens; press Run to install on a device or emulator.

## 4. After every change
```bash
npm run build && npx cap sync android
```

## Notes
- Data lives in the WebView's localStorage and survives app restarts. Uninstalling the app deletes it — use More > Settings & Data > Export first.
- No internet permission is required for the app to work.
