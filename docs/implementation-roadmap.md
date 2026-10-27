# Incremental implementation and learning roadmap

Status: Steps 1–5 implemented; Step 6A adds house details and named-floor create/edit with SQLite. The delivery log records actual verification and platform limits. Next is the unit list/form design and implementation slice. Backend connection remains deferred.

## Goal and scope of the first milestone

Deliver a native Home screen the owner can run and inspect, with Bangla default/full English strings, the approved visual language and native-safe layout. Teach the runtime first, then one local persistence concept, before expanding into rental workflows.

Confirmed test targets: Android emulator and iOS Simulator on the owner's Mac, plus an installable Android APK on their physical Android phone. Android/iOS development toolchains and native launches have been verified; the APK build was verified locally and the owner subsequently confirmed Step 4 complete. Physical-device results are owner-reported rather than independently observed by the agent. Store distribution/signing remains a separate concern.

Home metrics are explicitly labeled demo data at this stage. They are not an implementation of billing, cash collection, access control or portfolio accounting. The first meaningful SQLite write is a persisted locale preference; keep money fixtures separate from real business records.

## Checkpoints — proceed one at a time

### Simple code approach for the first milestone

- Use React Native + Expo + TypeScript, with compatible stable versions verified at bootstrap. Keep mobile-app/ as the sole coding root and preserve its existing docs.
- Recommend React Navigation with one bottom-tabs navigator and a custom visual tab bar matching Figma. App.tsx is the explicit entry point; navigation registration stays in src/navigation/. Do not combine two routing systems. React Navigation supports a custom tabBar through its [bottom-tabs API](https://reactnavigation.org/docs/bottom-tab-navigator/).
- Use React Native components and StyleSheet, small function components, props and local state. One locale context is sufficient for this slice. Keep styles beside their component and share repeated color/spacing/type decisions through src/theme/.
- Use complete Bangla/English message dictionaries with typed keys. Default to Bangla. Keep locale selection separate from demo business data; choose additional localization tooling only if actual formatting needs justify it.
- Start SQLite with direct parameterized SQL and a small versioned migration for preferences. A single settings row is a deliberate learning exercise before real property records, not a reason to introduce an ORM or a generic repository framework. Expo documents SQLite persistence across restarts in its [storage guide](https://docs.expo.dev/develop/user-interface/store-data/).
- Extract reusable controls only when they have a clear responsibility: language selector, primary button and bottom bar. Keep Home-specific financial summary and attention sections inside the Home feature. Add layers when a real workflow needs them.
- Keep fixtures in a named Home demo-data file with a demo label. Introduce no server requests, billing logic, sync queue, global state library or full-domain schema for this screen.
- The main implementation thread owns this learning milestone sequentially. After each checkpoint, show the runnable result, explain its actual file flow, update learning notes and the delivery log, then stop at that checkpoint.

| Checkpoint | Deliverable when requested | Completion evidence | Learning focus |
|---|---|---|---|
| Preparation: working root/toolchains | Use mobile-app as the only coding root; compare nested copies; verify reported Android Studio/Xcode setup | Known emulator/simulator targets and untouched user files | Project versus docs versus runtime |
| Preparation: focused Home design | Home in Bangla, English fit check, empty/demo state and large-text considerations; latest green/white and raised bottom-bar reference 6 | Reviewed Home hierarchy and sensible primary/secondary actions | Why design review precedes layout code |
| 1. Expo boot — complete | Minimal compatible Expo/React Native/TypeScript project, preserved docs and folders, first native screen | Android emulator and iOS Simulator launch/screenshots; exact commands in README | Expo, native components, development server and fast refresh |
| 2. Home UI — complete | Shared minimum tokens/components, readable Home with explicit demo data, locale switching and navigation shell | Visible native Home, both languages, narrow/large-text review | Components, props, state, layout and text |
| 3. SQLite introduction — complete | Minimal schema migration and preference read/write behind local-storage boundary | Language restored after true Android/iOS restart; migration/write failures have safe UI handling | Tables, queries, persistent versus temporary state |
| 4. Installable Android preview — owner-confirmed complete | Generate a signed test APK with bundled JavaScript/assets; install on physical Android | Agent verified APK build; owner confirmed Step 4 device checkpoint complete | Preview versus development build, APK versus AAB, local storage lifetime |
| Review before expansion | User tries Home; lesson and delivery evidence updated | Questions answered and next slice chosen | Explain the code/data flow before expansion |

Home design preparation is complete. Further Figma screens or reopening the 56-frame prototype require their own requested scope. Design review and device verification answer different questions.

Given the available native toolchains and APK goal, prefer development builds for the iterative emulator/simulator loop, followed by a standalone Android preview APK. Expo Go remains an optional quick learning aid, not the final milestone artifact. Verify compatible SDK/library versions at bootstrap. Record development-server dependence instead of presenting a Metro-dependent debug build as the standalone deliverable.

Prefer a local Android test-build path after checking the Mac's toolchain. Hosted EAS internal distribution is an alternative, not an implicit account/upload requirement. At the APK checkpoint, define test signing/package identity, bundle JavaScript and fonts/assets, and produce APK rather than a store-oriented AAB. A test APK is not a store release and does not imply backend, payments, backup or synchronization works. Use the same package/signing identity for later test upgrades where appropriate; local SQLite persistence after app restart does not promise survival after uninstall/clear-data.

Implement only Home as a real feature in the first milestone. Unbuilt destinations/actions must be honestly identified in development-only informational states, not dead controls, fake saves, or claimed working financial flows. They do not count as completed screens. The navigation owner determines the minimal shell consistent with the Home review.

A runtime/visual test in a browser is supplementary; it does not establish Android/iOS behavior. Offline persistence testing must distinguish disconnecting an already loaded preview from cold-launching an independently installed build.

## Implemented: Step 5, local properties

See [the Step 5 work item](work-items/local-properties.md). Implemented property list → add house → saved list → edit house with SQLite schema v2, required-field validation, search, dirty Back and retained-input retry. The language preference is preserved by migration. Native verification and its limits are recorded in the delivery log.

Do not add units, tenant links, accounting, deletion, accounts or backend/sync in this slice. Home financial fixtures remain explicitly marked demonstration data; do not blend stored property counts into fixture money. The follow-up unit slice introduces the parent/child relationship and meaningful unit counts.

## Recommended screen and feature sequence after Home

Step 6A now implements house details and named floors: [work item](work-items/local-floors.md). Floor totals are queried; units remain unavailable. Continue with the unit slice before displaying unit counts or occupancy.

| Order | Slice | Why it comes here |
|---|---|---|
| 1 | Home and local preference | Fastest feedback and smallest useful native/SQLite learning loop |
| 2 | Property list + add/edit property | First real local CRUD; easy relational identity |
| 3 | House detail → named floors → unit list/form | Learn connected parent/child records with the parent selected by navigation |
| 4 | Tenant list + minimal identity form | Find/create a person without document complexity |
| 5 | Start tenancy + tenancy account + opening values | Connect tenant and unit under dated terms; decide needed opening policies |
| 6 | Basic fixed-charge bill review + dues view | Establish the balance source before accepting payments; resolve applicable date/rounding rules |
| 7 | Payment, allocation and receipt | First complete money workflow with actual dates, clear allocation and persistence/retry proof |
| 8 | Meter setup, readings, contributions and electricity review | Integrate the shared charge and credit model once Ledger exists |
| 9 | Advance detail, notice and departure | Reuse the established ledger; resolve refunds/closure policies first |
| 10 | Documents, reports/exports, helper administration | Extend capabilities in separate small slices; reports read established records |

This order does not remove any agreed v1 capability. Operational owner access/security and sync foundations are introduced before real multi-device or financial use, not postponed until helper administration. Documents can be brought forward if their workflow becomes the learning priority.

## Backend and database progression

Keep the accepted simplest topology: one mobile app with local SQLite and one Spring Boot service with PostgreSQL. Domain packages are logical modules inside that server, not separate deployable services.

Proposed workspace when backend work is requested:
- mobile-app/ — native client and current app specifications.
- backend/ — sibling Spring Boot project, with the familiar controller → service → serviceImpl → repository flow grouped by domain as needed.
- learning-notes/ — explanatory lessons outside application source.

Do not create backend source files or an empty full-domain database now.

1. During the Home milestone, explain the interfaces and SQLite/PostgreSQL separation; implement only the eventual locale table at its authorized checkpoint.
2. After Home review, a small backend-foundation task can create Spring Boot startup, local PostgreSQL configuration, a migration mechanism and a verified database connection. Select versions/tools then.
3. Couple the first production property schema/API to the property slice. Define/reuse its contract and Postman requests before implementing it. A health check alone is not proof that the mobile flow works.
4. Add minimal owner authentication/authorized property scope and a first one-domain synchronization slice before claiming shared real records. Design retry identity, rejection/conflict and recovery with that slice; do not call a fetch-only refresh full offline sync.
5. Introduce tenant/tenancy/bill/payment tables and migrations as their use cases arrive. Local and server schemas can differ; compare business outcomes and exact money rules.
6. Before real financial use, prove restart durability, duplicate-safe retries, conflict handling, access and recovery. Current demo Home establishes none of these production guarantees.

A backend is not required just to see Home. Building a full server/database first would delay native learning; building every screen with independent mock balances would create integration debt. The sequence connects one small domain at a time.

## Documentation at each checkpoint

- Personal learning: add one short lesson under ../../learning-notes/ explaining actual work, file flow, concepts, why/trade-offs and a small experiment. Start from [the learning index](../../learning-notes/README.md).
- Agent/presentation record: append verified outcomes and remaining gaps to [delivery log](delivery-log.md).
- Task evidence: update the assigned work item under [work-items](work-items/README.md).
- Actual commands/status: update app README when tools really exist. Keep future plans separate from executable instructions.

Use a single main implementation thread for the early learning checkpoints. Parallelize a later independent slice only when its contracts are stable and coordination would not obscure learning.

## Known workspace issue

Read-only inspection found extra nested directories named mobile app under mobile-app/ and mobile-app/docs/. The canonical root remains mobile-app/. Compare contents before any cleanup; this plan neither deletes those folders nor treats them as second coding roots. Bootstrap must preserve existing documentation and avoid generating yet another nested app.

## Pending choices

Test targets and the latest Home layout are confirmed above. Installed versions live in package.json and package-lock.json; the delivery log records actual results. House details and named-floor creation/editing are implemented. Plan the unit fields and review their rough layout next; Figma remains paused until explicitly requested.

Official build references checked 23 October 2026: [Android APKs](https://docs.expo.dev/build-reference/apk/), [local release builds](https://docs.expo.dev/guides/local-app-production/), and [internal distribution](https://docs.expo.dev/build/internal-distribution/). These establish available workflows, not a completed build in this workspace.

