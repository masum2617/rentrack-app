# Task: first runnable Home and local preference

Status: Step 2 complete — reviewed Home, bilingual state, navigation shell and demo/empty previews. SQLite preference and standalone APK remain later checkpoints.  
Owner: main implementation thread for the first authorized checkpoint  
Coordinator: main implementation thread

## Outcome and scope

Create the first inspectable native Home, then teach one persisted SQLite preference. Follow the separate checkpoints in [the roadmap](../implementation-roadmap.md); do not execute them as a single unattended full-app build.

Design checkpoint: [Home-only Figma draft](../design/home-review.md) completed with Bangla, English and empty Home states. Latest reference includes the raised center Home / হোম tab and compact inline language radio choices. The user authorized Steps 1 and 2 sequentially: Expo bootstrap followed by the reviewed Home implementation. Spring Boot connection is explicitly deferred.

Relevant family: [Home](../screens/home.md). Acceptance focus: A20–A22 for language/readability; A21 preference persistence at the SQLite checkpoint. A01 portfolio and A13 payment durability are not proven by a demo screen.

Included when authorized: minimal Expo bootstrap, shared minimum theme/UI/locale foundations, Home demo/empty presentation, clear development-only handling for unbuilt destinations, local preference persistence, Android emulator/iOS Simulator checks, and a standalone test APK for the owner's Android phone.

Excluded: real receipts/billing, database-derived portfolio metrics, auth, synchronization, uploaded documents and a complete backend.

## Ownership and dependencies

Canonical app root: mobile-app/. First writer owns bootstrap/configuration, minimal navigation/theme/i18n/shared UI/platform preference files, and src/features/home. A second writer is unnecessary for the first learning checkpoint.

Preserve existing project documentation. Compare nested mobile app copies before cleanup; avoid creating an app within an app. Test targets are confirmed: Android emulator, iOS Simulator and physical Android APK. Verify the reported native toolchains and review Figma Home content before the corresponding work.

Home uses a replaceable read input for explicit demo fixtures. Those fixtures are not financial records, database truth or queued operations. The later Ledger/domain readers replace them when real workflows exist.

## Proposed initial files, added only as needed

| Location | Responsibility |
|---|---|
| App.tsx | Small explicit entry point |
| src/application/ | Wire app-level providers when needed |
| src/navigation/ | One navigator, route definitions and the raised-center tab bar |
| src/theme/ | Shared palette, typography, spacing and platform shadow definitions |
| src/i18n/ | Locale context, translation keys/resources and language selector behavior |
| src/features/home/ | HomeScreen, a few Home sections, typed demo fixtures and empty presentation |
| src/shared/ui/ | Repeated presentation controls with no financial behavior |
| src/platform/database/ | SQLite initialization, versioned migration and preference read/write |

Preserve the broader domain folders but leave them unimplemented. Start with plain functions and direct imports; a Home fixture does not need an interface/adapter/service stack. Other tabs use a clearly labeled development-only unavailable view until their actual feature slice is built. Home actions also explain their unimplemented status rather than reporting a fake save.

The first coding checkpoint is Expo startup and a minimal native Home entry on Android, followed by iOS. The next checkpoint adds the reviewed Home UI and navigation shell; SQLite preference persistence and the standalone APK are later checkpoints. Each must leave an inspectable app and an updated lesson.

## Verification and learning handoff

At each checkpoint record actual commands/device, visible result, relevant language/large-text/error states, changed files, concepts taught and limitations. Verify persistence with a normal restart after the SQLite write, not just an in-memory toggle. Install the standalone APK on physical Android and verify launch with Metro stopped and airplane mode enabled; a development build that only loads from Metro does not meet that deliverable.

Update [delivery log](../delivery-log.md) and [external learning notes](../../../learning-notes/README.md). No device, backend or database success is claimed at planning time.

### Step 1 evidence — 23 October 2026

- Installed the blank TypeScript Expo stack in the existing canonical root; preserved all prior docs and nested copies. Concrete versions are in package.json/package-lock.json.
- `npm run typecheck`: passed after the final source change.
- `npm run check:dependencies`: dependencies up to date.
- `npx --yes expo-doctor@latest`: 20/20 checks passed.
- Android: Pixel_6, arm64 emulator; Gradle build successful, development APK installed, MainActivity foreground, 725-module bundle loaded from Metro; Home screenshot inspected.
- iOS: iPhone 17 Pro simulator, iOS 26.5; Xcode build succeeded with zero errors and two generated-build warnings; app installed and 724-module bundle loaded; Home screenshot inspected.
- Enlarged text inspected at Android font scale 1.5 and iOS accessibility-large. Both original settings restored afterward. This is a limited first-screen check, not full older-user usability or screen-reader certification.
- Resolved an IPv6-only localhost Metro binding by restarting with the default host binding. Allowed the Android emulator's development-network permission to load Metro.
- Upstream dependency audit warnings remain documented in the README. No forced Expo/React Native downgrade, dependency source edit or production-security claim.
- Evidence: [Android](../evidence/step-1/android.png), [iOS](../evidence/step-1/ios.png), [large-text Android](../evidence/step-1/android-large-text.png), [large-text iOS](../evidence/step-1/ios-large-text.png).
- Learning handoff: [lesson 02](../../../learning-notes/02-expo-first-run.md). Stop here before Step 2.


### Step 2 handoff — 24 October 2026

- Implemented shared theme/type/surfaces, bundled fonts/icons, typed translations, locale provider, language radio group, filter sheets and one bottom-tabs navigator.
- Home owns small summary/attention/empty sections and named demonstration fixtures. Other domains remain unimplemented. Temporary locale/filter state is intentionally separate from future persistence.
- `npm run typecheck`, four `npm test` checks, Expo dependency compatibility and Expo Doctor 20/20 passed. Native builds and screenshots passed; iOS interaction checks exercised language, property/month selection, unavailable action feedback and empty-state navigation.
- Evidence and precise limits: [Step 2 verification](../evidence/step-2/README.md). Learning: [lesson 03](../../../learning-notes/03-home-layout-and-language.md).
- Next: Step 3 SQLite locale preference, only when requested. No database-backed money, backend, standalone APK or physical phone verification in this checkpoint.
