# House Rent Tracker mobile app

Working project for the landlord-operated Android/iOS application. Bangla is the default, English is fully supported, and everyday workflows must remain straightforward for younger adults and adults aged approximately 45–70.

**Current checkpoint:** Step 1 — Expo/React Native/TypeScript bootstrap and a minimal Bangla Home screen. Native launch results are recorded in [the delivery log](docs/delivery-log.md). The full Figma layout, navigation, language switching, SQLite and backend belong to later steps.

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
npm run check:dependencies
~~~

`typecheck` checks TypeScript. `check:dependencies` compares package versions with Expo's SDK recommendations. Neither proves a native launch; see recorded device evidence in the delivery log.

## First files to read

Follow `index.ts` → `App.tsx` → `src/features/home/HomeScreen.tsx`. The screen imports shared colors from `src/theme/colors.ts`. Read [lesson 02 outside the app](../learning-notes/02-expo-first-run.md) for the file-by-file explanation and first editing experiment.

The starter icon assets are temporary and retain Expo's license under `assets/expo-template-LICENSE.txt`. The app's local preview package/bundle identifier is `com.houserenttracker.preview`.

## Known setup notes

- Use the default `npm start` binding on this Mac. A test with `--localhost` bound only to IPv6 (`::1`), while the development app requested IPv4 (`127.0.0.1`); restarting with the default binding resolved the iOS loading error.
- At this checkpoint, `npm audit` reports 15 high-severity dependency entries, rooted in `braces` and `node-forge` advisories and propagated through the Expo/Metro/React Native tree. Expo's compatibility check and all 20 Expo Doctor checks pass, but these are not a clean security audit. The suggested forced changes include incompatible Expo/React Native downgrades, so none were applied. Recheck supported upstream fixes before distribution.
- Android prebuild reports that global `userInterfaceStyle` enforcement needs `expo-system-ui`. The minimal screen uses explicit light colors; full appearance behavior and the Figma fonts remain part of Step 2.

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

The accepted stack is React Native, Expo, SQLite, Spring Boot, PostgreSQL, and private file storage. This folder is the mobile client. Installed dependency versions are in `package.json` and `package-lock.json`; a native development client and safe-area handling are included. Navigation, locale state, SQLite, authentication, backend and file storage are not implemented.

Business modules follow rental domains, not one module per prototype frame. Empty directories reserve intended locations; create implementation layers only as a concrete feature needs them.

All working requirements, glossary, and ADR files live in this project. The parent workspace's optional docs/ forwarding folder is not required for development. Original interview/UX/prototype narratives are retained under docs/references as history. Reference images are design-review material, not runtime assets.

Generated `android/` and `ios/` folders are excluded by `.gitignore`; Expo regenerates them from app configuration. Do not treat the nested documentation copies as coding roots. The current folder has no Git repository initialized; this checkpoint does not commit or publish anything.

