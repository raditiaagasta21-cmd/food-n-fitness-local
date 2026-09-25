# Export EatTrack to Android Studio (Capacitor)

EatTrack keeps all data in the device's localStorage and needs no server. Capacitor is already configured (`capacitor.config.json`, web dir `dist/client`).

## Steps (on your computer)
1. Connect the project to GitHub in Lovable, clone it, run `npm install`.
2. Build the Android web bundle (static `dist/client/index.html`):
   ```bash
   npm run build:android
   ```
   (The normal `npm run build` is unchanged and still used for the published site.)
3. First time only:
   ```bash
   npx cap add android
   ```
4. Sync and open Android Studio:
   ```bash
   npx cap sync android
   npx cap open android
   ```
   Press Run to install on a device or emulator.

## After every change
```bash
npm run cap:sync
```

## Notes
- Data survives app restarts. Uninstalling deletes it — use More > Settings & Data > Export first.
- No internet permission is required.
