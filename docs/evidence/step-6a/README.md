# Step 6A verification — 27 October 2026

Implemented: house list → house details → create/edit named floors, saved locally. The native design follows the reviewed green/white system; no Figma tool was used or file changed.

| Check | Observed result |
|---|---|
| TypeScript | `npm run typecheck` passed |
| Real SQLite tests | All 20 tests passed, including six new floor tests |
| Migration | Existing v1/v2 preference/house scenarios pass; native Android and iOS database files read as schema v3 with their saved locale intact |
| Data integrity | Foreign keys, per-house normalized uniqueness, scoped updates, creation order, reopen persistence, failed writes/retry and queried counts pass |
| Android create flow | Added a new `Step6 Review House` through the UI; Save opened its details and empty-floor state |
| Android floors | Required-name focus/error, duplicate normalization, create, rename, dirty keep/discard, system Back and keyboard-open Save verified |
| Navigation/refresh | House edits returned to their originating list/details; floor writes updated the detail/list; search remained after visiting details; Unit action explained the deferred feature |
| Restart | Force-stopped/reopened the development app; Ground level and First floor remained attached to the review house, with count 2 |
| English | Labels, duplicate error, unsaved dialog, parent context and house-edit return behavior verified |
| Small layout | 320 × 568 logical viewport and 1.3× text: scrolled to floor entry, validated/focused/typed with keyboard and used dirty Back. Original 1080 × 2400 / 1.0 settings restored |
| iOS | Updated bundle launched on iPhone 17 Pro; schema v3 and retained locale verified from its native SQLite file. iOS floor touch/gesture/keyboard interaction was not exercised |
| Dependency check | Expo's offline local map reported dependencies up to date; this is not live upstream validation |
| APK | Final `npm run apk` passed in 11s; output 91,403,709 bytes at `android/app/build/outputs/apk/release/app-release.apk` |
| Independent review | No critical/important findings; minor notice scoping and touch-target findings fixed and follow-up review passed |

## Screenshots

- [House list with actual floor total](android-house-counts.png)
- [House details with floors](android-house-details.png)
- [Shared floor form and selected parent](android-floor-form.png)
- [Save above the keyboard](android-floor-keyboard.png)
- [Duplicate-name field error](android-floor-duplicate.png)
- [English detail](android-english-details.png)
- [English duplicate-name feedback](android-english-duplicate.png)
- [Narrow enlarged-text keyboard layout](android-narrow-keyboard.png)
- [Native iOS bundle startup](ios-startup.png)

The review house and its floors were entered for testing; they are not seeded fixtures. Existing house records were not edited. Screenshots can include Expo's floating development control, which is not product navigation. The Add floor action was widened to retain readable 18px text without clipping the Bangla label.

## Verification notes and limits

Another Java application occupied port 8081. Metro was started on 8082 and the simulator apps were pointed there; the other process was not stopped or reconfigured. Daily commands remain in the app README.

Fast hardware-key injection caused occasional development reloads: React Native recognizes two R key events within 200ms when the Activity's focused view is not an EditText, which can happen while a Modal owns the input window. Retrying with R key events separated by 300ms completed the flow. No product workaround was added; native soft-keyboard behavior is distinct from ADB hardware-event injection.

The database layer's rejection paths were tested against real SQLite. Native read/write fault injection, rapid-tap stress, VoiceOver/TalkBack and representative older-user sessions were not performed. iOS still needs manual house/floor CRUD, keyboard and back-gesture verification. The small-screen screenshot shows a scrolled form; labels remain in the scroll content rather than floating above inputs.

The APK uses the existing local test signing and has not been independently installed on a physical phone for this step. Native development restart checks verify SQLite durability with Metro available; they are not proof of standalone cold offline startup. Existing Gradle deprecation warnings remain. Dependency installation reported four high audit entries; no forced unrelated remediation or clean-audit claim was made.

## Quick manual check

Open Properties, create a house, add two floors and try a duplicate name. Rename one floor, return to the list and check the total. Reopen the app. Repeat on iOS and a physical Android phone using the fresh APK, including a cold launch with Metro stopped. Units are deliberately deferred and should never display a fabricated count.
