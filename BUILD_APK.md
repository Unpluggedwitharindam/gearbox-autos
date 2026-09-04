# Build the Gearbox Autos Android App (APK) — Zero Experience Needed

This guide assumes you have **never coded before**. Follow each step exactly,
in order. Total time: about 45–60 minutes (mostly waiting for downloads).

## What you are building

An Android app called **Gearbox Autos** that opens your live website
(**gearboxautos.in**) inside a real app. When you update the website on
Lovable and publish, the app updates automatically — **you never need to
rebuild the APK for website changes.**

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

### Step 7: Create the Android app files

```
npm run app:setup
```

### Step 8: Add the app icon and splash screen

```
npm run app:icons
```

### Step 9: Sync everything

```
npm run app:sync
```

### Step 10: Open the app in Android Studio

```
npm run app:open
```

Android Studio opens. **Wait** until the bar at the bottom says nothing is
running anymore ("Gradle sync" finished — can take 5–15 minutes the first time).

### Step 11: Build the APK file

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

- **Website changes (text, cars, design):** just publish on Lovable.
  The app shows the live site — no APK rebuild needed.
- **Only rebuild** if you change the app icon, app name, or
  `capacitor.config.ts`: run steps 9–11 again.

## Play Store (optional, later)

In Android Studio: **Build → Generate Signed Bundle / APK → Android App
Bundle (.aab)** — follow the wizard (it creates a "keystore" file — save that
file and its passwords somewhere safe forever), then upload the .aab at
https://play.google.com/console (one-time $25 Google developer account).

## Troubleshooting

| Problem | Fix |
|---|---|
| `npm is not recognized` | Close and reopen the command window. If still broken, reinstall Node.js (Step 1) and restart the PC. |
| `git is not recognized` | Reinstall Git (Step 2), restart the command window. |
| Android Studio shows errors on open | Wait — it's still downloading components. Look at the bottom progress bar. |
| "SDK location not found" | In Android Studio: File → Settings → search "SDK" → install Android SDK, then try Step 11 again. |
| App shows old website | The app loads the live site — publish your changes on Lovable and reopen the app. |
