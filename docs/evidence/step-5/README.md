# Step 5 verification — 27 October 2026

Scope: local whole-house list/create/edit. This begins A01 property identity only; floors, units, tenancy and accounting remain later work.

| Check | Observed result |
|---|---|
| `npm run typecheck` | Passed |
| `npm test` | 14 passed, including five property tests against real SQLite |
| `git diff --check` | Passed |
| `npm run check:dependencies` | Local Expo dependency map reported up to date; offline-mode warning means no live upstream validation |
| `npm run apk` | Passed in 1m 16s; generated 91,366,109-byte `android/app/build/outputs/apk/release/app-release.apk` |
| Independent code review | No outstanding critical/important/minor findings after preserving list context |
| Android emulator | Bangla list/form, required-field errors, create, keyboard-open Save, edit, keep/discard, system Back, no-match/clear, English labels and process-restart persistence verified |
| Native databases | Android and iOS startup databases read as schema v2; existing language rows remained. Android stored two fictional houses, including the edited Shanti Nibas record |
| Small layout | Screenshot visually reviewed at 320 × 568 logical size and 1.3× system text: field and Save visible above keyboard; original 1080 × 2400 physical display and 1.0 font scale restored |
| iOS Simulator | Updated bundle launched on iPhone 17 Pro; Home screenshot and schema-v2 startup verified. Native property CRUD/keyboard interaction was not exercised |

## Screenshots

- [Bangla saved list](android-bangla-list.png)
- [Bangla shared filled Edit form](android-bangla-form.png)
- [English saved list](android-english-list.png)
- [English shared Edit form](android-english-form.png)
- [Save above keyboard during entry](android-keyboard.png)
- [No search matches](android-no-results.png)
- [320 × 568, enlarged text and keyboard](android-narrow-keyboard.png)
- [iOS updated bundle startup](ios-home.png)

Screenshots show fictional records entered into the emulator through the UI. They are not seeded into the app. Expo's floating gear can appear in development captures; it is not app navigation and is absent from the standalone release build.

## What these checks do not establish

The source includes loading, read-retry and retained-input save-error states. Actual SQLite rejection tests verify the write boundary; native fault injection of a failed-save/read-error screen was not performed. Rapid duplicate taps are guarded by a synchronous ref plus disabled controls; a stress run was not performed. Screen-reader announcements/focus, iOS property CRUD, physical-phone Step 5 testing and representative older-user sessions remain manual checks. The narrow keyboard screenshot is visual evidence, not an automated accessibility assertion.

The APK is the existing test-signed local preview, not a store release. Its successful packaging does not prove a physical phone's cold offline launch. Android process-restart evidence used the development bundle supplied by Metro and confirms SQLite persistence, not a Metro-free cold start. No server sync, backup or financial completeness is implied.

## Manual review

Run `npm run android` or `npm run ios` from the canonical `mobile-app/`. If Metro already runs, use its `a`/`i` shortcuts. Open Properties, add a house, edit it, search by address and restart. On iOS, check all three fields with the keyboard and Back/dirty confirmation. Try VoiceOver/TalkBack and larger system text. For phone testing, install the fresh APK, stop Metro, cold-launch and verify saved house/language persistence.
