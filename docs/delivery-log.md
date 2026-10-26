# Delivery log and presentation record

Purpose: a concise, evidence-based account that another agent can resume and the owner can use to explain the project. The [roadmap](implementation-roadmap.md) owns future sequencing; work items own task-level details; this log owns what actually happened.

## 23 October 2026 — Planning baseline

**Request:** begin with a small, runnable Home screen and learn React Native/Expo/SQLite incrementally, without starting code in this turn.

**Completed:** organized domain/agent/screen documentation, retained reference images, selected canonical mobile-app root, and wrote the incremental roadmap and external learning-note starting point.

**Confirmed product decisions:** Android/iOS; Warm Ledger; Bangla default with full English support; simple use across younger adults and ages approximately 45–70; separate rental/financial concepts; offline local records with explicit future sync.

**Planned next:** focused Home design review, minimal Expo run, Home UI, SQLite locale persistence, and a standalone Android test APK. Backend/PostgreSQL foundation is a subsequent small task, not a dependency for seeing the first screen.

**Confirmed testing targets:** Android emulator and iOS Simulator on the owner's Mac, plus installing a generated APK on their physical Android phone. Android Studio/Xcode installation was reported by the owner; working toolchains and actual builds are not yet verified. The physical-device APK must launch with the development server stopped.

**Not implemented or verified:** Expo installation/build/run, Home UI, SQLite tables, native device behavior, backend startup, database connection, API traffic, sync, financial calculations, exports or authorization.

**Workspace note:** nested mobile app copies were observed and left untouched. One canonical coding root is required before bootstrap.

**Presentation statement:** “We have established the product and engineering guidelines. Our next milestone is a Bangla-first Home screen on Android/iOS simulators, a small SQLite persistence exercise, and an installable Android preview APK. Server integration and rental workflows will be added in separate verified slices.”

## 23 October 2026 — Home-only Figma draft

**Authorized scope:** create a fresh Figma design for Home using the supplied internal-screen and bottom-navigation references. The owner will review colors/UI before requesting code; Spring Boot connection remains deferred.

**Delivered:** [new Home review file](https://www.figma.com/design/NbtxYyU5l1j2QSLTRBioUL?node-id=3-202), containing Bangla-default Home, equivalent English Home and empty-portfolio Home. The prior prototype was left untouched. The file is in the connected team workspace; a separate project container was not created.

**Verification:** read-back confirmed 79 editable text nodes, 60 instances, Noto Sans Bengali/Noto Sans and zero image-filled nodes inside the board. The exported composition was visually inspected, primary button wrapping repaired and the corrected screenshot reviewed. This is a static design board; no navigation prototype, live database or server behavior is claimed.

**Learning:** [lesson 01 outside the app](../../learning-notes/01-home-figma-review.md) explains design components/tokens and why a visual review precedes native code.

**Next:** owner color/UI feedback. Application bootstrap, SQLite, APK builds, Spring Boot and additional screens are not started.

## 23 October 2026 — Sage and white Home revision

**Request:** follow the latest reference's bottom navigation, green/white backgrounds and box shadows.

**Delivered:** revised the same three Home frames with pale green headers, white content, sage accents, shared soft shadows and a raised center Ledger tab. Bangla remains the default; English retains equivalent content. The existing five destinations and rental figures are preserved. [Updated review](design/home-review.md).

**Verification:** inspected the exported board, corrected inherited center icon/label overrides, and checked the corrected preview. Ledger labels and book icons are correct across all three views. The board still has 79 editable text nodes, 60 instances and no image-filled nodes. Calculated primary-label contrast is 4.98:1; white center-icon contrast is 3.31:1. These checks establish a static design review only.

**Documentation:** updated the design system, navigation and reference interpretation; retained reference 6. [External lesson 01](../../learning-notes/01-home-figma-review.md) now explains this revision. No application code, database or backend work was performed.

**Next:** owner color/UI review before requesting implementation.

## 23 October 2026 — Center Home and visible language choices

**Request:** make the raised center Home / হোম, remove শুরু as the Home tab label, and show বাংলা and English as easy radio-style choices.

**Delivered:** revised all three Home states. The tab order is Ledger, Properties, Home, Tenants, More; Home has a house icon in the raised center. A visible two-option radio group replaces the one-label language toggle. Bangla is selected in the default/empty views and English in the English view. Colors, shadows and financial content are retained.

**Verification:** inspected the exported composition and read back the navigation labels, two 175 × 48 language targets per frame, and selected states. The board contains 82 text nodes, 60 instances and zero image-filled nodes. Static review only; native interaction and language persistence remain unimplemented.

**Records:** updated navigation, localization, design-system guidance, review preview/state and the external learning note. No app code or backend work performed.

## 23 October 2026 — Compact inline language selector

**Request:** place smaller language choices beside এক নজরে on one header row.

**Delivered and checked:** updated all three Home headers to a compact 180 × 48 language group, with two 90 × 48 choices and 16-wide radio indicators. Text remains size 16. Headers now measure 68 high instead of 124, restoring content space. The exported board was visually inspected: titles, subtitles and both language labels fit. Existing selected states, colors and navigation are retained. Native large-text/narrow-screen validation remains future work; no application code changed.

## 23 October 2026 — Step 1 native bootstrap completed

**Authorized scope:** Expo/React Native/TypeScript setup, minimal Bangla Home, native launches and a learning explanation. The full Figma screen and all data/backend work remain separate steps.

**Delivered:** canonical mobile-app now contains the app entry/configuration, installed and locked dependencies, a small HomeScreen and shared palette/soft shadow. Generated native Android/iOS projects stay ignored. Existing docs, assets directories and nested copies were preserved; no Git repository, commit or publication was created.

**Toolchain:** selected the already installed Node 22.23.1 for these commands without changing global Node; npm 10.9.8; Java 17 for Android; Xcode 26.5; CocoaPods 1.16.2. Expo 58.0.17, React 19.3.0, React Native 0.88.0 and compatible development-client/safe-area packages are installed. Android automatically installed the required NDK 27.1.12297006 and SDK platform 37.0 under existing accepted SDK licenses.

**Verified:** TypeScript passed; Expo dependency compatibility passed; Expo Doctor passed 20/20 checks. Android Gradle build succeeded in 11m 24s on its first toolchain setup, installed to Pixel_6, loaded the Metro bundle and displayed Home. iPhone 17 Pro/iOS 26.5 simulator build succeeded with zero errors and two generated script-phase warnings, installed and displayed Home. Both screenshots were inspected. Enlarged-text checks passed for the small screen content at Android 1.5 font scale and iOS accessibility-large; original settings were restored.

**Resolved setup issue:** Metro's explicit localhost mode bound IPv6 only while the simulator requested IPv4. Restarted Metro with its normal host binding and successfully loaded the iOS bundle. Android's development-network permission was allowed on the emulator before its bundle loaded. These are development setup details, not product permissions for a future release.

**Limits:** npm audit reports 15 high dependency entries through Expo/Metro/React Native, rooted in braces/node-forge advisories. Its forced downgrade suggestions are incompatible with the selected stack, so no forced fix was applied. README records this and the Android light-mode enforcement warning. Figma font bundling, complete bilingual UI, navigation, SQLite, auth, financial calculations, server sync, standalone release APK and physical-device testing remain unimplemented. The generated debug APK requires the development workflow and is not the standalone APK milestone.

**Presentation statement:** “We now have the first native Android and iOS application running, with a minimal Bangla screen and verified development toolchains. The next step is implementing the reviewed Home layout; business data and persistence follow separately.”

**Evidence and learning:** [Android screenshot](evidence/step-1/android.png), [iOS screenshot](evidence/step-1/ios.png), [large Android text](evidence/step-1/android-large-text.png), [large iOS text](evidence/step-1/ios-large-text.png), [external lesson 02](../../learning-notes/02-expo-first-run.md), and [task handoff](work-items/home-foundation.md). Actual run commands are in the app README. No full-app acceptance scenario is claimed by this setup slice.

**Next:** user tries the lesson's text-edit experiment; Step 2 adds the reviewed Home, navigation shell and language switching when requested.


## 24 October 2026 — Step 2 reviewed Home implemented

**Scope and result:** implemented only the reviewed Home UI and shared foundations: pale green/white surfaces, soft elevation, original Figma icons, offline Noto fonts, Bangla-default/full English preview labels, compact language radio group, raised center Home, named demo fixtures, property/month selection, occupancy/attention and empty Home. Other tabs/actions truthfully explain their unavailable status. Development-only More controls switch sample/empty preview.

**Code approach:** small native components and StyleSheet, props/local state, one locale context, typed message keys and one React Navigation bottom-tabs navigator. No global state framework, generic repository stack or business-domain schema was introduced. The main thread was the single writer.

**Verified:** TypeScript, four focused fixture/format tests, Expo compatibility and Doctor20/20 passed. Android and iOS native builds succeeded, installed and displayed Home. iOS interactions covered translation, filtering, scope-preserving month changes, unavailable feedback and empty navigation. Bangla digit mapping fixed a native formatter difference. Narrow/enlarged Android and enlarged/scrolled iOS layouts were inspected; tab text scaling was bounded after observed crowding. Android required a cold emulator boot after System UI stalled. Final independent code review found and verified a raised-Home touch-bound fix; upper-halo tapping was confirmed on iOS. Original display/text settings were restored. See [precise evidence and limits](evidence/step-2/README.md).

**Limits:** all figures are samples; locale/filters are temporary and reset after a full restart. Android interaction automation, physical phone,320-wide/landscape, screen-reader and representative older-user sessions remain unverified. Audit reports four high entries in node-forge/Expo CLI’s code-signing chain; no forced downgrade or security-clean claim. Debug apps require Metro. SQLite, real payments/property records, backend/auth/sync and standalone APK remain unimplemented.

**Learning:** [lesson03 outside the coding project](../../learning-notes/03-home-layout-and-language.md) explains the actual file flow, components, props, state, language formatting and layout choices. The owner can study it later.

**Presentation statement:** “The reviewed Home screen now runs on Android and iOS with bilingual navigation, accessible layout adaptations and clearly identified sample data. We have verified this UI slice; persistent storage and real rental workflows follow in separate steps.”

**Next:** Step3, save the language preference using SQLite and verify normal-restart behavior. Stop at this checkpoint before expanding scope.

## 24 October 2026 — Step 3 SQLite language preference completed

**Scope and result:** added one local SQLite preference only. First install remains Bangla. Selecting বাংলা or English writes a constrained `bn`/`en` value in the app's `device_preferences` table; app startup migrates/reads the database before showing Home. A successful write changes the visible language; a failed write retains the prior language, and a storage-open failure presents a bilingual retry state.

**Code approach:** `src/platform/database/` owns the `house-rent-tracker.db` connection, a version-1 migration and parameterized read/upsert functions. `LocaleProvider` remains the locale/i18n owner and calls that small platform boundary. The table has one allowed row and values; no ORM, generic repository or business-domain schema was added.

**Verified:** TypeScript passed. Nine Node tests passed: the existing four Home/format tests plus five real-SQLite migration/preference tests. Android Pixel_6 and iPhone 17 Pro/iOS 26.5 development clients were rebuilt with `expo-sqlite`. On each device, English was selected, the app was fully force-stopped/terminated and relaunched, then visibly reopened in English. Screenshots and exact scope are in [Step 3 evidence](evidence/step-3/README.md). Expo dependency validation reported versions up to date from its local map while network access was disabled; this is not a networked registry check.

**Limits:** this proves one per-installation setting in Metro-connected development apps. It does not prove persistence after uninstall/clear-data, backup, account settings, synchronization, a physical Android launch, independent offline launch, financial records, authentication, backend/API work or the future standalone APK. Node's test runner prints experimental SQLite/module-type warnings; they are not test failures. No forced audit remediation was performed.

**Learning:** [lesson 04 outside the coding project](../../learning-notes/04-sqlite-language-preference.md) explains the actual files, schema, migration, transaction, SQL and test flow.

**Presentation statement:** “The Home app now remembers its Bangla or English setting locally after a normal Android or iOS restart. This is a small verified SQLite foundation—not yet a rental database, cloud sync or offline release build.”

**Next:** Step 4 is a standalone Android preview APK for physical-phone and Metro-independent launch testing, when requested.

## 26 October 2026 — VS Code development workflow rechecked

**Step 3 assessment:** complete. Inspected the committed SQLite language implementation and reran TypeScript plus all nine tests successfully in the confirmed moved project at `Mobile APP/house-rent-tracker/mobile-app`. The existing Step 3 restart evidence and external lesson remain available.

**Developer workflow:** added `scripts/mobile.mjs`, explicit daily/rebuild/APK/device package commands and VS Code tasks. Daily `android`/`ios` commands launch Metro and the target device through Expo. `build:android`/`build:ios` handle first native installation or native dependency changes. `apk` runs `app:assembleRelease`. The helper supplies child-process SDK/Node/Java paths, respects explicit environment configuration, passes arguments without shell splitting and preserves child exit status. Global shell/IDE settings were not changed.

**Owner's APK correction preserved:** recorded the already-working Expo Modules Core 58.0.24 stub-PCH quoted-path parser as `patches/expo-modules-core+58.0.24.patch`. Added `patch-package` and a failing-on-error postinstall hook; patch application passed. No generated native caches are included. Expo CLI is correctly nested under Expo; initial direct-root lookup was misleading, not a missing dependency.

**Verified:** Android daily command started Pixel_6, opened the app and Metro bundled the Android source; MainActivity was foreground and the Bangla Home screenshot was visually checked. iOS initially reported the development app missing on the selected simulator; `npm run build:ios -- --device 'iPhone 17 Pro' --no-bundler` installed CocoaPods, rebuilt successfully with zero errors/two generated warnings, installed and loaded Home from Metro. The Bangla iOS Home screenshot was visually checked. `npm run apk` succeeded in 1m 51s and produced a fresh 91,345,225-byte release APK. Command syntax/help checks passed. Independent review found no critical/important defects; its minor device-diagnostic suggestion was fixed. Dependency installation reported five high audit entries; no forced remediation or clean-audit claim.

**Learning:** [04a — VS Code workflow](../../learning-notes/04a-vscode-mobile-workflow.md). Step 4 remains the physical Android installation, cold launch with Metro stopped/airplane mode, and persisted-language check; a successful package build alone does not satisfy those device checks.

## Owner confirmation — Step 4 and next-slice planning

The owner reported Step 4 complete following the supplied APK installation/offline/restart instructions. The agent independently verified the APK build earlier; the physical-phone results are owner-confirmed rather than agent-observed. No new physical-device test or store release is claimed by this entry.

Next proposed slice: [Step 5 local properties](work-items/local-properties.md), beginning with a focused list/form review and then a real SQLite create/read/update workflow. Units and tenants follow in separate checkpoints. This update records planning only; no property screens, migration, API or backend implementation was started.

## 27 October 2026 — Step 5 property list/form design draft

**Authorized result:** created the [editable property review board](design/properties-review.md) on a separate page of the existing Home Figma file. Two layout families: Property list and one shared Add/Edit house form. Bangla-first main screens have equivalent English instances and compact supporting state variants. The owner requested `নতুন বাড়ি` and `এডিট`; those exact labels are used. The form contains only house name, location and optional address.

**Verified:** read-back confirmed 114 editable text nodes, 65 component instances, the two Noto font families and zero image-filled nodes. Visually inspected the board, repaired compact-state button clipping and gesture-indicator alignment, then checked the corrected render. Reused Home tokens, button and navigation assets; the Home review was preserved.

**Limits/next:** static design review only, pending owner feedback. No application code, SQLite property migration, backend, floor/unit screens or native keyboard/persistence behavior was implemented. Agreed future structure is House → Named floor → Rental unit. [External design lesson](../../learning-notes/05-property-design-review.md).

## Entry format for future checkpoints

- Date and linked task:
- User-visible result and actual changed areas:
- Why this step was chosen:
- Tests/demo performed and concrete outcomes:
- Limitations and unresolved policy:
- Lesson link outside the project:
- Next agreed checkpoint:

Write in completed tense only for observed outcomes. Attach relevant evidence/commands from the task handoff; do not turn planned behavior into presentation claims.

