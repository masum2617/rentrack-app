# Verification by risk and change

The app has type checking and 20 focused Node tests covering Home/formatting, SQLite preferences, house records and floors. Floor tests verify migration preservation, foreign keys, normalized duplicate names, scoped updates, creation order, actual counts, rejected writes/retry and reopening. Expo compatibility checks and native builds remain available. Run checks appropriate to the change. The table below describes requirements for future business workflows; it does not claim those workflows exist. Checkpoint evidence lives in the delivery log.

| Change | Evidence needed |
|---|---|
| Documentation/folders | Working links, existing paths, consistent ownership/status, screen/acceptance coverage |
| Financial behavior | Meaningful domain tests for affected requirement examples and edge cases; local/server calculation agreement when both exist |
| Payment persistence | Restart after offline save; retry same operation without duplicate receipt; separately entered payment remains distinct |
| Electricity | Missing reading not zero; 69 kWh × 8 = 552; alternative 500/1,000 contributions; same debt reduced once by collection |
| Tenancy/departure | Preserve prior history and original advance; effective rent change; approved settlement outcomes remain distinct |
| Permissions | Test owner and relevant helper permissions, assigned/unassigned property access, server rejection where integrated |
| Localized UI | Bangla first launch on English device; switch/restart offline; no untranslated app messages; values/drafts preserved |
| Screen work | Relevant empty/loading/local-save/sync-error/conflict/success states; visible actions; real navigation return behavior |
| Export/documents | Offline availability truthful; Bengali PDF glyphs; private-file access; failed upload retention and retry when implemented |

For visible changes, verify Android and iOS behavior where available; narrow widths around 320/360 plus ordinary 390/430 layouts; large system text; keyboard/safe-area clearance; long Bangla/Latin names and realistic amounts; VoiceOver/TalkBack; reduced motion and measured contrast. Clearly state unavailable device/platform checks.

Use representative usability sessions across approximately 45–70 and younger adults to assess completion and mistakes in collection, balance explanation, lookup, and reading entry. Do not claim older-user usability from font size alone.

Match tests to changed behavior. Avoid tests that merely repeat implementation details or creating a test framework for a documentation-only task. Build/type/lint success is not proof of offline persistence, financial correctness, permission enforcement, or successful export.

Baseline acceptance IDs A01–A24 are in [product requirements §12](product-requirements.md#12-acceptance-scenarios-for-implementation). For the affected slice, link the IDs to evidence in the task handoff. Explicitly distinguish planned tests from tests executed.


## Step 7 status

See [local tenants](work-items/local-tenants.md). Tenant migration/persistence/search/rejected-write regression cases are authored in `tests/tenants.test.mjs`; they were not executed during this checkpoint. Historical migration fixtures and schema guards now target v7. Do not infer native, migration, restart or APK success from TypeScript/static review.

## Step 8 status

[Local tenancies](work-items/local-tenancies.md) records the authorized flow and pending checks. Regression cases are authored, not executed; TypeScript and independent static review are the permitted checks. The native date-picker development clients were rebuilt/installed on Android and iOS; that does not establish picker interaction or workflow acceptance. No v8 device migration/restart, accessibility acceptance, APK build or physical offline result is claimed without evidence.

## Occupancy follow-up status

[Occupancy context](work-items/occupancy-context.md) records implemented source and limits. TypeScript, syntax-only regression parsing and whitespace checks pass; independent review found no actionable issue. Regression cases are authored but not executed. Native layout, touch/Back, screen-reader and refresh interactions remain pending. No dependency/schema/native-build change is required for this JavaScript/read-model slice.

## Step 9A status

See [rent bills](work-items/local-rent-bills.md). Regression cases are authored without execution, per owner instruction. TypeScript/static review and syntax/whitespace checks are the observed evidence. Device v9 upgrade/restart, transaction isolation/FK behavior, complete billing forms, confirmation/dirty Back, both languages, narrow/enlarged text and screen readers remain pending. Full app close/reopen is needed to establish startup schema/configuration. No fresh APK/native build is claimed.

## Step 9B verification boundary

TypeScript, syntax and independent static review are authorized; test-case execution remains prohibited. `tests/additional-charges.test.mjs` covers migration preservation, atomic setup, modes/precision, periods/locks, stale snapshots, itemized totals, restart, rollback and identity isolation. Existing rewind fixtures reflect schema v10; newer-schema rejection uses v11. Cases are authored, not passing evidence.

Native acceptance remains pending for v10 migration, keyboard/dirty Back, large text, both locales, accessible controls, saved persistence, reset cancel/confirm after start-month correction (including cross-year), stale refresh cancellation and concurrent source changes. No fresh native build/APK is claimed. See [work item](work-items/additional-charges.md).

## Step 10A payment acceptance boundary

No test cases executed. TypeScript, syntax-only checks and independent static review are the source evidence; final command results are in the delivery log. `tests/payments.test.mjs` authors upgrade, exact inputs, partial/full and later-month allocations, retry/conflicts, isolation, rollback, reversal/void guards, receipt restart/renames and zero/overdue cases. Rewind fixtures drop payment child tables before v10/older parents; current version is v11 and newer-schema rejection uses v12.

Native v11 migration/persistence, keyboard/date picker, dirty Back/Review, both languages, narrow/enlarged text, TalkBack/VoiceOver, repeated taps, ambiguous-save retry, concurrent payments/reversals, source scroll retention and reverse/re-enter remain pending. No native build or fresh APK is claimed. Fully close/reopen for startup migration; no new dependency/rebuild is required.

## Step 10B verification boundary

Nine Home regression cases are authored in `tests/home-data.test.mjs`; no cases executed. They cover empty/live scopes, billing-vs-receipt date, allocation-aware dues, reversal/draft/void exclusion, tenancy grouping/search/renames, Ledger filters, calendar gaps, read failure and unsafe totals. Removed obsolete fixture assertions while keeping the existing independent digit-format test. Final TypeScript, syntax-only and whitespace evidence is in the delivery log; independent static review found no concrete defects in source or authored arithmetic/interfaces.

Native accepted behavior is still pending for property/month selections, both languages, narrow/enlarged text, error/Retry, screen readers, Home→Ledger scope/filter/scroll, payment→receipt→Home, open-form state during refresh, reversal updates and resume/restart. No emulator/device test, native build or fresh APK was performed. Schema remains v11.
