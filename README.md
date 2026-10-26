# House Rent Tracker mobile app

Working project for the landlord-operated Android/iOS application. Bangla is the default, English is fully supported, and everyday workflows must remain straightforward for younger adults and adults aged approximately 45–70.

**Current checkpoint:** Step 3 — the reviewed Home, bilingual navigation and one durable device preference are implemented. Bangla remains the first-install default; the selected Bangla/English language is stored in SQLite and restored after a normal restart. Android and iOS restart evidence is in [Step 3 evidence](docs/evidence/step-3/README.md). Backend, real rental records and the standalone Android APK remain separate checkpoints.

Start with [AGENTS.md](AGENTS.md), then the [documentation index](docs/README.md).

## Run on this Mac

Use the canonical folder, not either nested `mobile app` copy:

~~~sh
cd '/Users/masumhasan/Workspace/Personal/Mobile APP/house-rent-tracker/mobile-app'
nvm use
~~~

Node 22.23.1 was already installed and is selected by `.nvmrc`. If a new terminal does not recognize `nvm`, open your usual terminal with NVM initialized. The installed global Node 26 also satisfies the current Expo engine range; the pinned Node version makes the learning setup reproducible.

For a fresh dependency checkout, run `npm ci`. The postinstall hook reapplies the recorded Expo native path-quoting patch. Dependencies are already installed for this checkpoint.

### Android emulator

~~~sh
npm run android
~~~

Daily command: starts Metro and opens the installed development app, starting an available emulator if needed. Android Studio does not need to be open. The launcher supplies the default Mac SDK path, current Node path and Java environment to child commands. Existing explicit environment values are respected. First install, or after adding/changing native modules, use `npm run build:android` instead. Expo can prompt for an emulator when multiple choices exist.

### iOS Simulator

~~~sh
npm run ios
~~~

Daily command: starts Metro and opens the installed development app in Simulator. The Xcode editor does not need to be open; the installed Xcode command-line tools and Simulator runtime are still required. First install, or after native module changes, use `npm run build:ios -- --device 'iPhone 17 Pro'`.

### Subsequent coding sessions

~~~sh
npm start
~~~

Keep one Metro terminal running. Press `a` to open Android or `i` to open iOS; both can share that server. Press Shift+A or Shift+I to choose a device. If Metro is already running on port 8081, rebuild another platform without starting a second server:

~~~sh
npm run build:android -- --no-bundler
npm run build:ios -- --device 'iPhone 17 Pro' --no-bundler
~~~

Use `npm run devices` to list available emulator/simulator targets and the resolved Node/Java/SDK paths. In VS Code, Command Palette → Tasks: Run Task provides the same commands as named Mobile tasks.

### Private Android test APK

```sh
npm run apk
```

This runs `app:assembleRelease` and prints the APK path: `android/app/build/outputs/apk/release/app-release.apk`. JavaScript and assets are bundled in that build. Current signing uses the generated test/debug key; preserve that key for test upgrades and configure production signing before store distribution. Physical-phone cold launch with Metro stopped, airplane-mode review and locale restart verification are Step 4 acceptance checks.

After installing a release APK onto the same emulator, use `npm run build:android` to return that emulator to the development app before using Fast Refresh. Both currently share the same package identity.

### Folder moves and native caches

The confirmed root above still has a space in `Mobile APP`. `patches/expo-modules-core+58.0.24.patch` records the owner's quoting fix, which prevents the Expo stub-PCH task from splitting quoted paths. Do not edit dependencies manually again: `npm ci` automatically reapplies it and fails if a future version cannot accept it.

Native/autolinking caches can embed absolute paths. A future folder move may require native regeneration. Do not use `prebuild --clean` routinely: it replaces native projects and may discard manual native changes. No automatic cache deletion or native regeneration runs in these convenience commands.

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
- Other tabs and money/property actions explain that their workflows are not built. Only the language preference is saved at this checkpoint.
- The language choice is a local SQLite preference and survives a normal app restart. Property/month filters and empty-preview state remain temporary React state and reset on a full restart. Deleting the app or clearing its data can remove the local preference; there is no account sync or backup yet.
- The floating gear is Expo’s development tooling, not an app feature or part of the release UI.

The starter icon assets are temporary and retain Expo's license under `assets/expo-template-LICENSE.txt`. The app's local preview package/bundle identifier is `com.houserenttracker.preview`.

## Known setup notes

- Use the default `npm start` binding on this Mac. A test with `--localhost` bound only to IPv6 (`::1`), while the development app requested IPv4 (`127.0.0.1`); restarting with the default binding resolved the iOS loading error.
- The 26 October dependency installation reported five high audit entries. Earlier compatibility/Doctor evidence belongs to its dated checkpoints; no clean security audit is claimed and no forced incompatible downgrade was applied. Recheck supported upstream fixes before distribution.
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

Generated `android/` and `ios/` folders are excluded by `.gitignore`; Expo generates them from app configuration. Do not treat the nested documentation copies as coding roots. This folder is a Git repository; convenience-command work does not commit or publish anything.

