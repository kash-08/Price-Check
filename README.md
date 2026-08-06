# Price Check 🏷️

An AI-powered mobile app that identifies products from a photo, finds real live prices across major online retailers, and tells you whether to buy in-store or online.

Built with React Native (Expo) and a multi-API AI pipeline combining computer vision, live shopping data, and price comparison logic.

---

## 📸 Screenshots

<p align="center">
  <img src="https://github.com/user-attachments/assets/e398432a-75ba-4839-b4b2-07fad3c277c2" alt="Home" width="220"/>
  <img src="https://github.com/user-attachments/assets/f1f9afee-0c95-4102-bde2-7bfb2f38cf5b" alt="Camera" width="220"/>
  <img src="https://github.com/user-attachments/assets/1f5644fd-997e-4718-8da7-834d6888181b" alt="Result" width="220"/>
  <img src="https://github.com/user-attachments/assets/0d2b750c-8778-4232-9940-32200b644d59" alt="History" width="220"/>
</p>

<p align="center">
  <b>Home</b>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
  <b>Camera</b>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
  <b>Result</b>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
  <b>History</b>
</p>

## Live Demo

📱 **[Download the APK](#)** — install directly on Android (link to your EAS build download or a GitHub Release)

🎥 **[Watch a demo video](#)** — 30-60 second walkthrough of the full scan → compare → decide flow

---

## What it does

1. **Scan a product** — either take a photo in-store, or upload a screenshot of an online listing
2. **AI identifies it** — Google Gemini's vision model reads the image and identifies the specific product (brand, model, etc.)
3. **Real prices, live** — the app searches Google Shopping (via SerpApi) for actual current listings across Indian retailers like Amazon, Flipkart, and Croma
4. **Compare & decide** — enter the price you see in-store, and the app tells you whether to buy there or order online, with the exact savings
5. **Browse in-app** — tap any listing to view the real product page in an embedded browser, without leaving the app
6. **Track your scans** — every scan is saved locally so you can revisit past comparisons

---

## Tech stack

| Layer | Technology |
|---|---|
| Framework | React Native + Expo (SDK 57), TypeScript |
| Navigation | Expo Router (file-based routing, Stack navigator) |
| Vision AI | Google Gemini API (`gemini-3.5-flash-lite`) — multimodal image understanding |
| Shopping data | SerpApi (Google Shopping engine) — real-time price aggregation |
| Local storage | AsyncStorage — persistent scan history |
| In-app browsing | `react-native-webview` |
| Image handling | `expo-camera`, `expo-image-picker`, `expo-image-manipulator` |

---

## Architecture

The app follows a simple, linear pipeline rather than a tab-based structure, since the core flow is inherently sequential:

```
Home
 ├─→ Camera ─┐
 └─→ Gallery ─┴─→ Result (AI identify → live price search → comparison) ─→ WebView
                     │
                     └─→ saved to → History
```

**Two-stage AI + data pipeline:**
Rather than asking one model to both identify a product *and* know current prices (which produces unreliable guesses), the app splits the job:

1. **Identification stage** — Gemini's vision model looks at the photo and returns a structured, specific product name (e.g. "boAt Airdopes 141 TWS Earbuds") along with any visible listed price and general buying tips.
2. **Pricing stage** — that product name is passed to SerpApi's Google Shopping search, which returns real listings with actual current prices and links — not AI estimates.

This separation means the app never shows a fabricated price next to a "real" link — every price displayed is either something the user typed in themselves or something scraped from an actual live search result.

**Client-side price comparison:**
The buy-here-vs-buy-online recommendation is computed entirely on-device from data already fetched — no extra API call. It parses the price strings into numbers, compares the user's store price against the cheapest verified online price, and classifies the result (buy in-store / buy online / prices are similar) using a small tolerance threshold so trivial differences aren't over-stated.

---

## Key engineering decisions

- **Honest data, not confident guesses.** An earlier version had the AI *estimate* a price per store, which looked broken next to real listings once live search was added — mismatched numbers erode trust fast. The final version only ever displays a specific price if it came from a real search result or the user's own input.
- **Deduplication of live results.** SerpApi occasionally returns the same store multiple times (different listings/variants). Results are sorted cheapest-first and deduplicated by store name, so the displayed "best price" is guaranteed to be the actual lowest verified price per retailer.
- **Graceful two-stage failure handling.** Errors from the AI, the shopping search, or a missing API key each surface a specific, readable message rather than a generic crash — useful both for the user and for debugging during development.
- **No chart library.** The price comparison bar chart is built with plain `View`s and dynamic `width` percentages rather than pulling in a charting dependency — kept the app lighter and avoided another source of version conflicts.

---

## Notable challenges solved along the way

- **Native module version mismatches** between the Expo SDK and the Expo Go client — resolved by pinning to a stable SDK version.
- **Navigation architecture change** — the starter template used Android's native tab bar (`NativeTabs`), which silently ignores routes not explicitly registered as tabs. Migrated to a `Stack` navigator to support the app's actual linear flow.
- **File system API deprecation** — `expo-file-system`'s `readAsStringAsync` was replaced mid-project by the SDK; worked around by reading image data directly from the camera/picker as base64 instead of re-reading from disk.
- **Camera preview letterboxing** — `CameraView` wasn't filling the screen under flex layout on some devices due to native aspect-ratio handling; fixed by sizing it explicitly against `Dimensions.get('window')` instead of relying on `flex: 1`.
- **API cost/quota constraints** — built entirely on free tiers (Gemini free tier, SerpApi free plan), including swapping providers mid-project when hitting billing walls, without changing any UI code — a clean API boundary made this a one-file change.

---

## Running the project

### Option 1: Development mode (Expo Go)

```bash
npm install
npx expo start
```

Requires a `.env` file with:
```
EXPO_PUBLIC_GEMINI_API_KEY=your-gemini-key
EXPO_PUBLIC_SERPAPI_KEY=your-serpapi-key
```

Scan the QR code with Expo Go (Android/iOS) to run on a physical device.

### Option 2: Standalone APK (Android)

The app is also built as a standalone, installable Android APK — no Expo Go or dev server required. Built using [EAS Build](https://docs.expo.dev/build/introduction/):

```bash
npm install -g eas-cli
eas login
eas build:configure

# API keys must be set as EAS secrets so they're baked into the build
eas secret:create --scope project --name EXPO_PUBLIC_GEMINI_API_KEY --value your-gemini-key
eas secret:create --scope project --name EXPO_PUBLIC_SERPAPI_KEY --value your-serpapi-key

eas build -p android --profile preview
```

Once the cloud build finishes, download the `.apk` from the provided link and install it directly on an Android device (enable "install from unknown sources" if prompted). The installed app runs fully standalone with its own custom icon and splash screen — no Metro bundler or Expo Go dependency.

---

## Possible next steps

- Push notifications for price-drop alerts on previously scanned products
- Barcode scanning as a third input method alongside camera/gallery
- Multi-currency support beyond INR
- iOS build via EAS (currently Android-only)
- Publish to the Play Store (would require moving API keys behind a backend proxy, since client-embedded keys are extractable from a public APK)
