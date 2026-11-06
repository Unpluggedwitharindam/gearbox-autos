# Build the Gearbox Autos Android App (APK) — Zero Experience Needed

This guide assumes you have **never coded before**. Follow each step exactly,
in order. Total time: about 45–60 minutes (mostly waiting for downloads).

## What you are building

An Android app called **Gearbox Autos** that loads its existing frontend from packaged files. Inventory and forms use online services. Frontend changes now require a rebuilt app; inventory data changes do not.

---

## PART 1 — Install the tools (one time only)

### Step 1: Install Node.js
1. Go to https://nodejs.org
2. Click the big green **LTS** button and run the downloaded installer.
3. Click Next → Next → Install (accept all defaults).

### Step 2: Install Git
1. Go to https://git-scm.com/downloads
2. Download for your system (Windows/Mac) and install with all defaults.

### Step 3: Install Android Studio
1. Go to https://developer.android.com/studio
2. Download and install with all defaults.
3. Open Android Studio once — it will download extra components
   (this takes 10–20 minutes). When you see the "Welcome" screen, close it.

---

## PART 2 — Get the code onto your computer

### Step 4: Put this project on GitHub (from Lovable)
1. In Lovable, open the **Plus (+) menu** in the chat input (bottom left).
2. Click **GitHub → Connect project** and authorize.
3. Click **Create Repository**. Lovable creates your code repo on GitHub.

### Step 5: Download the code to your computer
1. Press the **Windows key**, type `cmd`, press Enter. (On Mac: open **Terminal**.)
2. Copy-paste this line, then press Enter:

   ```
   git clone https://github.com/YOUR-USERNAME/YOUR-REPO-NAME.git gearbox-autos
   ```

   (Replace with your actual GitHub repo URL — you can copy it from the
   green **Code** button on your GitHub repo page.)
3. Then run:

   ```
   cd gearbox-autos
   ```

**Keep this black window open for all the remaining steps.**

---

## PART 3 — Build the app

### Step 6: Install the project parts

```
npm install
```
(Wait 2–5 minutes. Warnings in yellow are normal.)

### Step 7: Sync everything

```
npm run app:build
npm run app:sync
```

### Step 8: Open the app in Android Studio

```
npm run app:open
```

Android Studio opens. **Wait** until the bar at the bottom says nothing is
running anymore ("Gradle sync" finished — can take 5–15 minutes the first time).

### Step 9: Build the APK file

In Android Studio's top menu:

**Build → Build Bundle(s) / APK(s) → Build APK(s)**

Wait 2–5 minutes. When a popup says "APK(s) generated successfully", click
**locate**. The file is called **app-debug.apk** — that is your app!

---

## PART 4 — Install it on your phone

1. Send **app-debug.apk** to your phone (WhatsApp it to yourself, email it,
   or use a USB cable).
2. Tap the file on your phone.
3. If Android warns about unknown sources, tap **Settings → Allow** on that
   screen, then tap the file again.
4. Tap **Install**, then **Open**.

🎉 You now have the Gearbox Autos app on your phone.

---

## Updating the app later

- **Inventory data changes:** the existing online backend supplies updated listings.
- **Frontend, icon, name or configuration changes:** build the frontend, sync Android, rebuild and distribute a new APK/AAB.

## Play Store (optional, later)

In Android Studio: **Build → Generate Signed Bundle / APK → Android App
Bundle (.aab)** — use the existing upload key and private environment settings described in `PLAY_STORE.md`; do not create a replacement key. Upload the .aab at
https://play.google.com/console (one-time $25 Google developer account).

## Troubleshooting

| Problem | Fix |
|---|---|
| `npm error Missing script: "app:sync"` | Your copy of the code is old. In the command window run `git pull` and try again. If that fails, delete the folder and repeat Step 5 to clone fresh. |
| `npm is not recognized` | Close and reopen the command window. If still broken, reinstall Node.js (Step 1) and restart the PC. |
| `git is not recognized` | Reinstall Git (Step 2), restart the command window. |
| Android Studio shows errors on open | Wait — it's still downloading components. Look at the bottom progress bar. |
| "SDK location not found" | In Android Studio: File → Settings → search "SDK" → install Android SDK, then try Step 9 again. |
| App shows old screens | Rebuild with `npm run app:build`, sync Android, and install the new APK. |
