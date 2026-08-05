# Price Check 🏷️

An AI-powered mobile app that identifies products from a photo, finds real live prices across major online retailers, and tells you whether to buy in-store or online.

Built with React Native (Expo) and a multi-API AI pipeline combining computer vision, live shopping data, and price comparison logic.

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

---

## Possible next steps

- Standalone APK/IPA build (via EAS Build) for direct installation outside Expo Go
- Push notifications for price-drop alerts on previously scanned products
- Barcode scanning as a third input method alongside camera/gallery
- Multi-currency support beyond INR
