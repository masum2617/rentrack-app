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

## 27 October 2026 — Step 5 local house workflow

**Delivered:** implemented the reviewed whole-house list and shared Add/Edit form in `src/features/properties/`. Required name/location, optional multiline address, search across all three fields, explicit Edit, empty/no-match/loading/retry states, inline validation and retained-input save errors. A native full-screen form hides tabs, guards unsaved Back, blocks repeated Save taps and waits for SQLite success before returning. Its heading/fields scroll while Back and the keyboard-aware Save footer remain reachable. List search/scroll context survives a save. Home's empty-preview Add shortcut opens this workflow; Home money/counts remain labeled fixtures.

**Storage/structure:** schema v2 adds `properties` while preserving `device_preferences`. Feature-owned direct SQL handles trimmed create/read/update; stable local IDs identify houses independently of names. No runtime dependency, ORM, backend or synchronization system was added. Floors, units and house details are the following design slice. Current Save returns to the updated list; house-detail selection comes with Step 6.

**Verified:** typecheck, all 14 tests and diff checks pass. Property tests use actual SQLite and cover migration from version 1, reopen persistence, stable IDs, Bangla/quoted values, invalid input, rejected writes, missing-ID updates and search. Android emulator interaction verified create/edit, validation, keyboard-open Save, keep/discard/system Back, search/clear, English fit and full process-restart persistence. Native Android/iOS files read as schema v2 with existing locale preserved. Visually reviewed a 320 × 568 / 1.3× text keyboard layout, then restored emulator settings. iOS launched the updated bundle, but property CRUD there remains unverified. Independent review found no outstanding issues. Expo's compatibility command used its offline local map. `npm run apk` built the updated 91,366,109-byte test-signed preview successfully in 1m 16s; existing Gradle deprecation warnings remain.

**Learning/evidence:** [06 — House records and SQLite](../../learning-notes/06-properties-sqlite.md) explains state versus persistence, controlled fields, refs, async save, SQL parameters, migration, file flow and future parent IDs. [Step 5 evidence](evidence/step-5/README.md) contains screenshots and platform limits. Screen readers, iOS CRUD, physical-phone Step 5 offline testing, native error fault injection and older-user sessions remain manual checks. Spring Boot, floors/units, deletion and financial workflows were not started.

## 27 October 2026 — Bangla house-details and floor design

**Design-only result:** added `03 · House details & floors · বাংলা` to the existing Figma file. [Review board](design/house-floors-review.md) contains populated and empty house details, one shared floor form and compact Edit/validation/save/loading/retry/unsaved-change examples. The form has one required floor name and inherited read-only house context. Existing green/white tokens, Noto typography, shadows and navigation are reused. No separate English layout was created, per the owner's request.

**Verification/limit:** visually inspected the render and repaired text wrapping/height, auto-layout overlap and Back targets. Read-back found 79 text nodes, 47 instances, zero image-filled nodes and 48 × 48 Back controls. Main layouts are ready for review. One supporting loading description still has retry copy; the precise correction is in the review document. Figma's Starter-plan MCP limit rejected the final correction attempt. No application/database code or working floor/unit flow was added. [External learning note](../../learning-notes/07-house-floors-design.md).

## 27 October 2026 — Step 6A house details and floors

**Delivered:** connected house list → details → shared Add/Edit floor form, with SQLite-backed named floors. House identity opens details while Edit stays separate; new-house Save opens details and house edits return to their origin. List rows show actual floor totals and the agreed units-not-added message. Floors keep creation order, reject normalized duplicate names within their house and retain their parent/ID when renamed. Unit actions explain the following slice. Bangla and English strings, dirty Back, keyboard-safe forms, retained-input retry and house-scoped success feedback are implemented.

**Structure:** added the small React Navigation native-stack package for list/details inside Properties; existing full-screen Modals remain for forms. Schema v3 adds floor foreign keys and per-house unique name keys, preserving house/locale data. Foreign keys are enabled before migration transactions. Feature-owned direct SQL and a one-query property-summary reader avoid stored counters, generic repositories or a new state library. No Figma access, unit records, backend, sync, deletion, reordering or financial changes were made.

**Verified:** final typecheck, 20 real-SQLite tests and diff checks pass. Android UI verified new-house return, empty/required/duplicate states, add/rename, dirty keep/discard/system Back, keyboard Save, real counts, preserved search and process-restart persistence. English house edits returned to both origin screens correctly. Narrow/enlarged text was checked and emulator settings restored. Native Android/iOS files reached schema v3 with locale preserved; iOS CRUD/gestures remain manual. Follow-up code review passed after correcting notice scope and minimum touch height. Expo's compatibility check used its offline map. The final APK built in 11s, 91,403,709 bytes, with existing Gradle warnings. A separate app occupied 8081, so verification used Metro 8082 without stopping it.

**Learning/evidence:** [08 — Connecting houses and floors](../../learning-notes/08-house-floors-sqlite.md) explains parent/child IDs, foreign keys, duplicate keys, navigation, refresh and count queries. [Step 6A evidence](evidence/step-6a/README.md) records screenshots, the ADB development-keyboard shortcut issue and verification limits. Next is the unit-list/form planning slice; screen readers, iOS interaction and physical-phone Step 6A checks remain unverified.

## 27 October 2026 — Floor code and schema-v4 correction

Reproduced `no such column: floor_code_name` against an existing v3-shaped database. Editing its original CREATE TABLE block had not upgraded installed tables. Added a transactional v4 table rebuild, copying existing floor IDs, parent links, names and timestamps before dropping/renaming. It also preserves experimental code values on v3 databases that already have the column. Connected code values through Create/Read/Edit, fixed shared input refs/name-error placement and included code-only edits in the unsaved guard. The code remains optional and trimmed.

Three new real-SQLite tests failed before the correction; all 23 tests and typecheck passed afterward. No native interaction test, APK rebuild or Figma work was performed for this focused fix. A full app close/reopen is needed to run startup migration against an existing connection. [External lesson](../../learning-notes/09-floor-code-migration.md).

## 28 October 2026 — Step 7 local tenant identity

**Delivered:** replaced the Tenants placeholder with a searchable directory and shared Add/Edit identity form. Name is required; phone/address are optional. ID type/number, emergency contact and notes are behind a labeled expandable control; existing extra values expand on Edit and collapsing preserves them. Rows show routine contact information and explicit Edit without invented unit assignments or balances. Search handles name/address and Bangla/English phone digits, including spaces/dashes in stored phone numbers. Same-name/phone people remain distinct stable records.

**Storage and structure:** appended schema v7 `tenants` without changing existing migrations, houses, floors, units or preferences. Tenant-owned parameterized SQL trims surrounding whitespace and preserves text identifiers/leading zeros. Save awaits SQLite, prevents repeated taps, retains drafts on failure and refreshes the list through a tenant-specific revision. Dirty Back includes hidden optional values. Promoted the existing input to shared FormField while retaining PropertyField's compatibility export. No runtime dependency, backend, tenancy link or Figma action was added.

**Verified and limits:** TypeScript passes. Independent read-only review found no critical or important defects; its delivery-log follow-up is addressed here. Diff whitespace checks pass. Tenant regression cases were authored and historical migration fixtures/schema guards maintained, but no test cases were executed, carrying forward the owner's instruction. No device interaction, schema-v7 native migration/restart, enlarged-text/keyboard/screen-reader result or fresh APK is claimed. Existing APK predates this slice. Optional identity fields use ordinary local SQLite; protected storage, access, backup and sync remain unimplemented. Home financial data remains labeled demo data.

**Learning and next:** [10 — Tenant identity and SQLite](../../learning-notes/10-tenants-sqlite.md) explains person versus tenancy, IDs, controlled drafts, progressive disclosure, in-flight refs, migrations, parameterized SQL and list refresh. [Work item](work-items/local-tenants.md) records scope and pending manual checks. Step 8 will connect a tenant to a unit under dated terms; financial policy decisions belong before their affected calculations.

Automatic approval review rejected an optional formatting-cleanup script because rebuilding files from Git could remove unrelated unit work. The script was not run; current code was left intact and functional work continued.

## 28 October 2026 — Step 8 local tenancy terms

**Delivered source:** connected floor unit identity → Unit details → existing-tenant selection → terms → review → SQLite save. Unit details shows house/floor/location, layout and current rental or Start tenancy; explicit Edit unit remains separate. Corrections reuse terms/review with tenant/unit fixed. Drafts survive stage Back/Next, dirty Close/exit asks confirmation, repeated Save is guarded synchronously, and failed writes preserve input. Fields and messages are complete in Bangla/English, reusing the current green/white system. A validation-attempt focus signal prevents error clearing from stealing keyboard focus.

**Rules/storage:** appended schema v8 with tenant/unit foreign keys, safe integer paisa terms, local calendar start date, due day, notice months, agreed advance and reserved nullable end date. A partial unique index permits one open tenancy per unit while allowing one person several units. Availability is checked before insertion and enforced by SQLite; corrections target tenancy ID + unit ID + open state. Occupancy is queried rather than maintained as another unit flag. Tenant edits refresh property views, keeping joined contact details current. Shared exact-money helpers preserve decimal precision without floating-point multiplication. No advance receipt, held balance, opening dues or historical bill is invented. Step 9 must guard corrections once financial postings exist.

**Checks:** TypeScript and diff whitespace checks pass. An independent static review identified stale-contact refresh and Node test-import extension issues; both were fixed and follow-up review found no outstanding actionable findings. Its date-button accessibility suggestion was also fixed. Six tenancy regression cases and maintained historical fixtures are present, but no test case was executed, following the owner's restriction. Native functional/picker/keyboard/enlarged-text/screen-reader checks, v8 device persistence and physical offline acceptance remain pending.

**Native dependency/builds:** Expo installed compatible date picker 9.2.1 and registered its config plugin; the existing Expo Modules Core patch reapplied successfully. Android development build succeeded in 56s and installed/opened on Pixel_6, using the existing Metro on 8082. iOS development rebuild succeeded with zero errors/two warnings, installed on iPhone 17 Pro and opened against Metro 8082. Build/install success does not establish the pending functional acceptance outcomes. No fresh standalone release APK was built. Existing Gradle/Kotlin deprecation warnings remain. Installation reported 10 dependency audit findings (six low/four high); no unrelated forced upgrade or clean-audit claim was made. An initial rebuild command combined mutually exclusive Expo port/no-bundler flags; retry with the port option alone succeeded.

**Learning/next:** [11 — Tenancy links, exact money and calendar dates](../../learning-notes/11-tenancies-sqlite.md) explains actual file flow, constraints, native dependencies, forms and refresh. [Work item](work-items/local-tenancies.md) records boundaries and pending checks. Next is Step 9 bills/dues, with partial-month/opening policies settled before their dependent calculations. No Figma, backend, ending/reassignment or financial posting was added; Home finances remain demo data.

## 28 October 2026 — Occupancy summaries and tenant context

**Delivered source:** tenant rows now display all active building/floor/unit locations. House summaries group floor/unit/rented-unit counts in one wrapping row. Floor cards show unit/rented counts, no-unit/vacant/partial/full status and every active unit/tenant pair. Tenant names beside unit occupancy and on Unit details open the shared editable tenant form by stable ID. The form's readonly Current tenancies section shows start month/year and elapsed residence, with the originating unit first/marked. Other active rentals remain visible; identity fields and existing Save/dirty/error behavior are preserved.

**Read models/structure:** extended active occupancy with tenant IDs/unit names and added joined scoped rental projections. Directory reads batch identities/rentals and group in memory rather than querying per card. Tenant editing reloads current identity/context by ID; one Modal owns loader/error/body states and delegates native Back to the body's current dirty guard. No counters/durations/duplicate rental labels are stored. Combined revision signals refresh tenant locations after tenancy, identity and house/floor/unit edits. Duration is pure completed calendar months with clamped month-end anniversaries; it updates on opening/resume and formats months/years in both languages.

**Verification:** TypeScript, new regression-file syntax and diff whitespace checks pass. Independent read-only review found no actionable findings. Regression cases were authored for zero/vacant/partial/full summaries, multi-unit/multi-house people, ended-rental exclusion, ID selection, renames, unchanged terms and calendar boundaries. The earlier tenancy case was adjusted for the expanded occupancy shape. No test case, native layout/touch/navigation/screen-reader check, build or APK generation was executed for this follow-up, as requested. Source/static review is not claimed as native acceptance.

**Learning/boundaries:** [12 — Occupancy read models](../../learning-notes/12-occupancy-read-models.md) explains joins, derived counts, batched queries, stable IDs, Modal/draft separation and local-calendar duration. [Work item](work-items/occupancy-context.md) records acceptance gaps. Schema remains v8; no dependency, migration, Figma action, financial posting or native rebuild was required. Next feature remains Step 9 bills and dues; Home finances stay labeled demo data.

## 28 October 2026 — Occupancy labels and icon actions

Replaced visible rental arrow paths with building-first labels and a wrapping Floor/Unit row in tenant lists and readonly form context. Floor rental pairs now show Unit and Rented by on separate lines. Unit tenant links use the exact “ভাড়া আছেন: {name}” wording in a rounded green 48px-minimum control without underline, including the link on Unit details. Replaced Edit action text with one shared 52px pencil control and contextual accessibility labels; rental-term editing is beside its section heading. Form titles remain descriptive.

TypeScript and diff whitespace checks pass. Independent static review found no actionable findings and confirmed original callbacks/sibling controls remain intact. No test cases, device checks, builds or Figma actions were run. Native text wrapping/touch/screen-reader acceptance remains pending. No database, duration, navigation or dependency changes were required. Updated the owning screen/design specifications, occupancy work item and [existing external learning lesson](../../learning-notes/12-occupancy-read-models.md).

## 28 October 2026 — Step 9A local monthly rent bills

**Delivered source:** Unit details now opens tenancy bills and shows finalized outstanding rent. Ledger is a portfolio bill list with property/month filters and optional voided history. Both paths share draft entry and bill review/details. Drafts persist in SQLite, remain outside dues and support edit/discard. Finalization is separately confirmed and idempotent. Finalized amounts, due dates and calculation snapshots cannot be edited; reasoned voiding preserves history and enables a distinct replacement draft. Lists refresh after successful writes. Bangla/English controls reuse labeled locations, rounded controls and contextual pencil actions; Home finances remain labeled demo data.

**Rules/storage:** appended schema v9 bill headers/lines and a partial unique index for one current bill per tenancy/month, preserving earlier migrations. Calendar calculations use inclusive actual-day coverage, whole-taka half-up partial proposals, exact full-month paisa and billed-month due-day clamping. Reviewed overrides require a reason; zero bills have no outstanding amount. Historical references explicitly use current stored rent. Finalization detects stale source terms. Tenancy correction locking is enforced inside its write transaction whenever a non-void finalized bill exists. Dues are derived from finalized charges rather than stored as an editable balance.

**Transaction correction:** static review found Expo's exclusive transaction helper opens a separate connection without inheriting foreign-key enforcement. The app now configures that dedicated connection before BEGIN, preserving existing store APIs and ensuring financial writes/migrations use foreign keys and atomic commit/rollback. This is source-reviewed behavior; native runtime acceptance remains pending.

**Verification:** TypeScript, regression-file syntax and diff whitespace checks pass. Independent static review found no remaining concrete defects after the transaction fix and accessible bill-row context were addressed. Regression cases were authored for v8 preservation, restart persistence, calendar boundaries/rounding, overrides, duplicates, rollback, stale drafts, immutable snapshots, void/reissue and correction locks. No test cases were executed, following the owner's restriction. No native interaction, device migration/restart, keyboard, enlarged-text, screen-reader, runtime transaction, APK or native build result is claimed for this slice. Fully close/reopen the development app to run schema v9; no new dependency or native rebuild is required.

**Learning/next:** [13 — Monthly rent bills](../../learning-notes/13-monthly-rent-bills.md) explains draft/finalized records, proposals, exact proration, snapshots, transactions, uniqueness and derived dues. [Work item](work-items/local-rent-bills.md) records scope and pending acceptance. Additional charges are reserved for 9B and payment allocation/receipts for Step 10; no backend, automatic generation, opening balance or advance application was added.

## 29 October 2026 — Step 9B fixed and monthly additional charges

**Delivered source:** optional water/service/gas settings are part of new tenancy Terms and Review, saved atomically with the tenancy. Unit details shows current and scheduled settings and a pencil action opening the effective-month history/editor. Water supports none/fixed/manual; service/gas support none/fixed. Draft bills populate fixed proposals, require explicit monthly water, accept named one-offs with Remove controls and require reasons for fixed overrides. Shared details show itemized lines and total; unit/global outstanding includes every finalized non-void line. Only rent is automatically prorated. Both languages reuse the existing green/white UI and full-screen form patterns.

**Storage/consistency:** appended schema v10 charge versions, bill settings signature and line metadata/indexes with ALTER operations that preserve old IDs/history. Settings writes reject finalized bills in the affected period and identify the blocking month; future changes outside that period remain available. Save/finalize recheck applicable settings and tenancy source terms inside the configured transaction. Draft refresh and month changes confirm before resetting entered extras. No settings edit rewrites bill snapshots. All amounts/totals retain safe exact integer paisa.

**Review fix:** independent static review found that editing a saved draft after a start-month correction could silently clamp its month and discard extras. Initialization now preserves the saved month/rent/extras, shows ineligible-month snapshots and blocks Save/refresh until explicit valid-month selection and confirmed recalculation. Follow-up review found no further concrete defects. Initial TypeScript found a UI loading/error union that prevented narrowing; the discriminated states were corrected before final checks.

**Observed checks:** `npm run typecheck`, syntax-only `node --check` across all regression files and `git diff --check` passed. Ten additional-charge regression cases are authored, not executed, covering upgrade preservation, atomic setup, mode/amount/reason validation, effective boundaries/locks, stale snapshots, restart, totals, duplicate submissions, void/reissue, rollback/overflow, isolation and start-month correction. Historical migration fixtures now expect v10; future-schema rejection uses v11. No test cases, native migration/runtime/keyboard/touch/screen-reader checks, dependency installation, build or APK generation were performed. Full app close/reopen is needed for startup v10 migration; no native rebuild is required. Native reset cancellation/cross-year recovery, concurrency, both locales and large-text acceptance remain pending.

**Learning/next:** [14 — Additional charges](../../learning-notes/14-additional-charges.md) explains actual file flow, effective-month settings, snapshots, stale review, atomic writes and derived totals. [Work item](work-items/additional-charges.md) records interfaces and acceptance limits. Updated requirements, domain/screen specs, navigation, roadmap and agent guidance. No automatic billing, meters/water splitting, electricity, opening balances, payments, receipts, backend or Figma work was added; Home remains demo finances. Review 9B before Step 10 payment allocation and receipts.

## 29 October 2026 — Step 10A local payments, allocations and receipts

**Delivered source:** Unit details and finalized bills open a full-screen receipt-entry/allocation form with a separate review stage. Amount starts blank; actual date defaults to today; cash/bank/mobile wallet is required; reference/notes are optional. Owner-adjustable suggestions use oldest month/rent first, or prioritize the originating bill. Save requires full allocation and rejects excess. Durable save opens an in-app receipt; Unit and bill histories open the same receipt routes in Properties/Ledger. Receipts preserve identity/location/charge snapshots, actual date/method, recording time and the historical remaining balance. Reversal requires reason/confirmation, preserves original financial data, restores all allocations and explicitly represents an entry correction rather than cash refund.

**Storage/integration:** appended schema v11 payments/allocations without replacing old records. Payment writes recheck eligible finalized lines, tenancy ownership, per-line caps and exact totals inside the configured exclusive transaction. Stable unique operation IDs return the same receipt on matching retry; changed payloads expose the original receipt in an explicit conflict. Current Unit/global balances derive finalized non-void charges minus recorded allocations. Bill status distinguishes unpaid/partly paid/settled from a separate positive-balance overdue indicator; zero-charge bills imply no receipt. UI and storage block bill void while active allocations exist. Gross bill/rent snapshots remain unchanged. Shared revisions and focused/resume reads refresh balances/history.

**Observed verification:** final `npm run typecheck`, syntax-only `node --check` across regression files and `git diff --check` passed. Independent static review and follow-up found no actionable defects in payment atomicity, retries/conflicts, tenancy isolation, reversal, void guards, receipt snapshots, remaining-balance SQL/wording or stack wiring. Initial TypeScript identified native View reference typing; ComponentRef corrected it before final checks. Ten payment regression cases were authored for migration, exact inputs, partial/full/later-charge allocation, duplicate retry, excess/isolation, rollback, reversal, restart/renames and zero/overdue states. Historical fixtures expect v11 and future-schema rejection uses v12. No test cases were executed.

**Limits/learning/next:** native v11 migration, date/keyboard/dirty Back, narrow/enlarged text, both languages, screen readers, repeated taps, concurrent/ambiguous-save behavior and native persistence remain pending. No dependency installation, native build, fresh APK, Figma or backend action was performed. Fully close/reopen the development app to apply v11; no native rebuild is required for this slice. [15 — Payments, allocations and receipts](../../learning-notes/15-payments-allocations-receipts.md) is outside the app folder. [Work item](work-items/local-payments.md) records APIs and acceptance gaps; requirements, domain/screen specs, navigation, roadmap and agent guidance are updated. Prepayment/advance applications/refunds/waivers/PDF/sharing remain deferred, and Home financial values stay labeled demo data. Review the full local rental/payment flow before planning the next slice.

## 29 October 2026 — Step 10B live SQLite Home

**Delivered source:** Home now uses actual houses, units, current occupancy, bills and payments. Removed the fixture module and stopped wiring More's demo/empty controls. Preserved the approved green/white layout, soft summary/attention groups, scalable typography and compact language selector. Property choices are real records; month choices include calendar gaps from the first bill/receipt month through today. All-month outstanding reuses Ledger balances, selected-month billed uses gross finalized non-void charges and received uses actual receipt-date recorded payments. Labels explain the independent periods; reversals remove original receipt-month collections and restore dues.

**Actions/state:** Home payment chooses a tenancy with scoped positive all-month dues, then reuses the payment form/receipt and closes back to Home. Stable tenancy IDs distinguish one person's different units. Outstanding/overdue links initialize property/all-month Ledger filters; draft links include selected month. New explicit Home requests initialize keyed lists while detail Back and ordinary tab return preserve existing filters/scroll. No-house onboarding, no-final-bill guidance, real zero values, missing-property recovery and read-error/Retry are explicit. Home refreshes on focus/revisions/resume, while open payment/receipt state stays mounted outside loading/error branches.

**Read model:** Home composes public Property/Ledger interfaces with safe integer paisa totals. A short configured dedicated transaction gives related reads a consistent snapshot without writing rows; its BEGIN IMMEDIATE briefly serializes writers. The new Ledger payment-activity and bill-scope interfaces avoid a second financial balance engine or per-card queries. Schema remains v11; this slice adds no migration, dependency or native package.

**Observed verification:** `npm run typecheck`, syntax-only `node --check` across regression files and `git diff --check` passed. Independent read-only review and follow-up found no concrete correctness/data-loss defects in source or authored cases. Nine new Home cases cover real scopes/counts, billing/receipt periods, reversal/draft/void exclusion, grouping/search, links, calendar gaps, read failure and range errors. Removed obsolete demo assertions while preserving the digit-formatting case. No test cases were executed. No emulator/device interaction, build or fresh APK was performed; native layout/language/accessibility, filter/scroll behavior, payment/receipt/resume and persistence acceptance remain pending.

**Learning/next:** [16 — Live Home dashboard](../../learning-notes/16-live-home-dashboard.md) is outside the app folder and explains projections, independent periods, consistent reads, request identity and open-form state. [Work item](work-items/live-home.md) records interfaces and limits. Requirements, screen/domain specs, navigation, roadmap and agent guidance are updated. Reload the development app for source changes; no native rebuild is required. Next checkpoint is owner review and authorized end-to-end Android/iOS/device/APK acceptance. No backend/sync, electricity, opening/advance/prepayment, PDF/sharing or Figma work was added.

## Entry format for future checkpoints

- Date and linked task:
- User-visible result and actual changed areas:
- Why this step was chosen:
- Tests/demo performed and concrete outcomes:
- Limitations and unresolved policy:
- Lesson link outside the project:
- Next agreed checkpoint:

Write in completed tense only for observed outcomes. Attach relevant evidence/commands from the task handoff; do not turn planned behavior into presentation claims.

