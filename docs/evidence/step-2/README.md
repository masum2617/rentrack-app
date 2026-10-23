# Step 2 native Home evidence — 24 October 2026

## Delivered

Reviewed green/white Home, soft elevation, local Noto fonts and original Figma icons; Bangla/English radio choices, explicit demo totals, property/month filters, occupancy/attention rows, empty Home and one five-destination navigation shell. No real records are created. Locale and filters live in React memory.

## Verification performed

- `npm run typecheck`: passed after final source changes.
- `npm test`: four checks passed: October totals, property scope/counts, monthly scope independent of all-month outstanding, Bengali digit/group formatting. These are fixture tests, not real ledger acceptance tests.
- `npm run check:dependencies`: dependencies up to date.
- `npx --yes expo-doctor@latest`: 20/20 passed with current dependencies.
- Android Pixel_6 / arm64: Gradle build succeeded in 1m30s. Expo’s readiness check timed out afterward; the resulting debug APK installed successfully with adb. The emulator’s System UI was stalled. A cold boot with `emulator -avd Pixel_6 -no-snapshot-load` preserved data and restored Home rendering. Metro loaded 957 modules. [Bangla Home](android-bn.png) visually inspected.
- Android display check: physical 1080×2400, original density420/font scale1.0. Temporarily used density480 (360 logical pixels) and font scale1.5; inspected stacked filters/summary and visible wrapped tab labels. [Narrow/large text](android-360-large.png). Restored density with `wm density reset` and font scale1.0.
- iPhone 17 Pro / iOS26.5: Xcode build succeeded with zero errors and two generated script-phase warnings, installed and loaded 967 Metro modules. [Bangla](ios-bn.png), [English](ios-en.png), [empty Bangla](ios-empty-bn.png), [empty English](ios-empty-en.png) inspected.
- iOS interactions: language selection translated Home/tab labels and amounts; property selection showed শান্তি নিকেতন, four units, BDT12,000 outstanding and October40,000/28,000. September changed monthly amounts to38,000/32,000 while outstanding stayed12,000. Single-item grammar displayed correctly. A property selection survived both a language switch and a Ledger → Home round trip. Payment action showed a truthful localized unavailable alert. More → Empty portfolio → Home showed first-use guidance without financial totals. Both empty languages inspected. Restart returned to Bangla/sample state as designed for this checkpoint.
- iOS accessibility-large: header/filters/financial metrics stacked. Dragging the content reached both attention rows and the sample-data note above the bar. [Scrolled result](ios-large-scrolled.png). Restored original content-size setting `large`. Navigation label caps were introduced after crowding was observed: 1.3× normally, 1.15× on narrow screens; body text remains fully scalable.

## Final review

A read-only reviewer identified that a negative margin placed the upper Home halo outside its touchable parent. The fix reserves the raised area inside the bar and renders its background separately. The reviewer confirmed the source fix with no remaining material findings. iOS verification opened Ledger then tapped the upper Home halo, which returned to Home. Android upper-halo tapping remains unverified. TypeScript and the four tests passed after the fix. Standard Bangla screenshots were refreshed; earlier English/empty/large screenshots document those scenario checks before this geometry-only repair.

## Practical limits

Android interaction automation was not completed; its native rendering and narrow/large layout were checked, while interaction scenarios were exercised on iOS. No 320-wide, landscape, VoiceOver/TalkBack session, physical phone or representative older-user study was performed. The five-tab text-scaling compromise should be revisited during usability testing. The floating gear in screenshots is Expo development tooling.

Font loading has a localized initial loading/error fallback. Home data itself is synchronous demo data, so no fake network loading/success/error states were added. No local-save or server-sync success is claimed.

`npm audit`: four high entries, node-forge advisory GHSA-86w9-cpqp-85rv and its Expo CLI/code-signing chain. No forced downgrade; this is not a clean audit. Native development builds require Metro. SQLite, preference durability, backend/auth/sync, real accounting, a standalone APK and offline physical-device launch remain future checkpoints.

## Reproduce

Use the app README’s development build commands, then `npm start` with its normal binding. If already running, use `--no-bundler` for native builds. The installed preview identifier is com.houserenttracker.preview. The source tree and lockfile are the reproducible artifacts; generated android/ios folders remain ignored.
