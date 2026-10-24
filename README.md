# House Rent Tracker mobile app

Working project for the landlord-operated Android/iOS application. Bangla is the default, English is fully supported, and everyday workflows must remain straightforward for younger adults and adults aged approximately 45–70.

**Current checkpoint:** Step 3 — the reviewed Home, bilingual navigation and one durable device preference are implemented. Bangla remains the first-install default; the selected Bangla/English language is stored in SQLite and restored after a normal restart. Android and iOS restart evidence is in [Step 3 evidence](docs/evidence/step-3/README.md). Backend, real rental records and the standalone Android APK remain separate checkpoints.

Start with [AGENTS.md](AGENTS.md), then the [documentation index](docs/README.md).

## Run on this Mac

Use the canonical folder, not either nested `mobile app` copy:

~~~sh
cd '/Users/masumhasan/Workspace/Personal/Mobile APP/house rent tracker/mobile-app'
nvm use
~~~

Node 22.23.1 was already installed and is selected by `.nvmrc`. If a new terminal does not recognize `nvm`, open your usual terminal with NVM initialized. The installed global Node 26 also satisfies the current Expo engine range; the pinned Node version makes the learning setup reproducible.

For a fresh dependency checkout, run `npm ci`. Dependencies are already installed for this checkpoint.

### Android emulator

~~~sh
export ANDROID_HOME="$HOME/Library/Android/sdk"
export JAVA_HOME="$(/usr/libexec/java_home -v 17)"
npm run android
~~~

This generates the native Android project if needed, builds and installs the development app, and starts Metro. Use the existing Pixel_6 emulator. The first build downloads native build dependencies and may need an Android SDK platform required by Expo.

### iOS Simulator

~~~sh
npm run ios -- --device 'iPhone 17 Pro'
~~~

This generates the iOS project if needed, installs CocoaPods dependencies, and builds/launches the simulator app. A simulator build does not require signing for a physical iPhone or a paid Apple developer account.

### Subsequent coding sessions

~~~sh
npm start
~~~

Open the installed development app and use the local development server. Metro must keep running for this development workflow. If Metro is already running on port 8081, build another platform without starting a second server:

~~~sh
npm run android -- --no-bundler
npm run ios -- --device 'iPhone 17 Pro' --no-bundler
~~~

The future standalone Android APK is a separate checkpoint; this development app is not that artifact.

## Check the code

~~~sh
npm run typecheck
npm test
npm run check:dependencies
~~~

`typecheck` checks TypeScript. `test` runs the Home fixture/number-format checks and SQLite migration/preference checks with Node’s built-in runner. `check:dependencies` compares package versions with Expo's SDK recommendations; an offline fallback is less authoritative than a networked check. Neither replaces native testing; see recorded device evidence in the delivery log.

## First files to read

Follow `index.ts` → `App.tsx` → `src/i18n/LocaleProvider.tsx` → `src/platform/database/database.ts` → `src/platform/database/migrations.ts` → `src/platform/database/languagePreference.ts` → `src/navigation/AppNavigator.tsx` → `src/features/home/HomeScreen.tsx`. [Lesson 04 outside the app](../learning-notes/04-sqlite-language-preference.md) explains the persisted language flow.

## Review this checkpoint

- Home starts in Bangla. Choose English beside the heading to translate the preview; property names keep their entered script.
- Choose a property or billing month to inspect the named demo fixtures. All-month outstanding has a different scope from monthly billed/received.
- Open More → Development preview → Empty portfolio, then Home, to inspect first-use guidance. Select Sample portfolio to return. These controls exist only in development builds.
- Other tabs and money/property actions explain that their workflows are not built. Nothing is saved.
- The language choice is a local SQLite preference and survives a normal app restart. Property/month filters and empty-preview state remain temporary React state and reset on a full restart. Deleting the app or clearing its data can remove the local preference; there is no account sync or backup yet.
- The floating gear is Expo’s development tooling, not an app feature or part of the release UI.

The starter icon assets are temporary and retain Expo's license under `assets/expo-template-LICENSE.txt`. The app's local preview package/bundle identifier is `com.houserenttracker.preview`.

## Known setup notes

- Use the default `npm start` binding on this Mac. A test with `--localhost` bound only to IPv6 (`::1`), while the development app requested IPv4 (`127.0.0.1`); restarting with the default binding resolved the iOS loading error.
- Latest `npm audit` reports four high-severity entries: node-forge and its Expo CLI/code-signing dependency chain (GHSA-86w9-cpqp-85rv). Expo compatibility and Doctor 20/20 pass; this is not a clean security audit. No forced incompatible downgrade was applied. Recheck supported upstream fixes before distribution.
- Local Noto Sans/Bengali fonts and original Figma SVG icons are bundled. Their sources are recorded in [asset provenance](docs/design/home-assets.md). `expo-system-ui` now supplies Android light-appearance configuration.

## Layout

~~~
mobile-app/
  AGENTS.md
  GLOSSARY.md
  docs/
    product-requirements.md
    architecture.md
    design-system.md
    navigation.md
    localization-accessibility.md
    agent-workflow.md
    verification.md
    domains/
    screens/
    templates/
    work-items/
    references/
    adr/
  assets/
    fonts/
    icons/
  src/
    application/
    navigation/
    theme/
    i18n/
    shared/
      ui/
      money/
    platform/
      database/
      sync/
      network/
      files/
      secure-storage/
    features/
      home/
      properties/
      tenants/
      tenancies/
      ledger/
      electricity/
      reports/
      access/
      settings/
  tests/integration/
~~~

The accepted stack is React Native, Expo, SQLite, Spring Boot, PostgreSQL, and private file storage. This folder is the mobile client. Installed dependency versions are in `package.json` and `package-lock.json`; a native development client and safe-area handling are included. React Navigation plus SQLite-backed locale preference persistence are implemented. Real rental records, authentication, backend and file storage are not implemented.

Business modules follow rental domains, not one module per prototype frame. Empty directories reserve intended locations; create implementation layers only as a concrete feature needs them.

All working requirements, glossary, and ADR files live in this project. The parent workspace's optional docs/ forwarding folder is not required for development. Original interview/UX/prototype narratives are retained under docs/references as history. Reference images are design-review material, not runtime assets.

Generated `android/` and `ios/` folders are excluded by `.gitignore`; Expo regenerates them from app configuration. Do not treat the nested documentation copies as coding roots. The current folder has no Git repository initialized; this checkpoint does not commit or publish anything.

