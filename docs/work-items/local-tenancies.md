# Step 8 — Start and correct a local tenancy

Date: 28 October 2026. Implemented source; runtime acceptance remains pending. No Figma work or backend.

## Approved behavior

House → Floor → Unit details → Start tenancy → choose existing tenant → terms → review → Save. Unit identity opens details; Edit unit stays separate. Tabs remain visible on details and hidden by forms. Forms preserve drafts across Back/Next, confirm leaving with changes, prevent repeated saves and retain input on failure. Drafts are not persisted across process restarts. Existing tenants only: the empty selector directs users to add a person through the Tenants tab first. One primary tenant represents a household; the same person may rent several units.

Start date defaults to today and may be today or earlier. Rent is required/positive; due day is 1–31; notice is a nonnegative whole number of months; agreed notice advance is nonnegative. All numeric fields begin blank for creation. Explicit zero notice/advance is valid. Bangla/English digits and up to two monetary decimal places are accepted; unsafe/invalid numbers fail validation. A due day absent from a month means that month's last day; actual bill due-date calculation belongs to Step 9.

Review displays tenant/contact and unit/house/floor context plus all five terms. Save creates a rental arrangement only. Existing open rentals offer correction through the same terms/review UI, with tenant/unit fixed. This is correction of unbilled setup; effective-dated rent increases are not implemented. Step 9 must guard this interface once financial postings exist, preserving historical terms.

## Ownership and interfaces

- Tenancies: validation, setup Modal, chooser, terms fields/summary, `createTenancy`, `correctTenancy`, `getCurrentTenancy`, `listFloorOccupancy`.
- Properties: `getUnitContext`, Unit details and tappable unit rows. Existing unit readers are compatible; occupancy is read through Tenancies rather than a mutable unit flag.
- Navigation: UnitDetails receives only unit ID, reads current context from SQLite, and restores its origin. AppNavigator refreshes affected property screens on save; tenant-directory edits also refresh current-rental presentation.
- Shared money: exact decimal-to-integer-paisa parser and lossless input/display helpers. Parsed amounts are bounded by Number.MAX_SAFE_INTEGER.
- Platform: appended schema v8, tenant/unit foreign keys and partial unique open-unit index. `ended_on` is reserved for future history; no end workflow exists.

Creation checks current availability; SQLite uniqueness protects concurrent inserts. Corrections match tenancy ID + unit ID + open state. Missing parents/records give explicit errors rather than false success. Foreign-key enforcement remains outside migration transactions. No prior table is dropped by v8.

## Dependencies and verification

Expo installed `@react-native-community/datetimepicker` 9.2.1 and registered its config plugin. Both Android/iOS development clients were rebuilt and installed (Pixel_6 and iPhone 17 Pro). Subsequent clean installations need the same rebuild. System picker language follows OS behavior; app labels are fully bilingual. Android compilation succeeded in 56s; iOS compilation succeeded with zero errors/two warnings. Picker interaction, schema-v8 restart persistence and a fresh standalone APK were not verified for this checkpoint. No Metro-dependent preview is presented as a standalone release.

TypeScript/static-review outcomes are in the delivery log. Authored `tests/tenancies.test.mjs` covers exact money/calendar validation, v7 upgrade preservation, create/correct/reopen, per-unit uniqueness, multi-unit tenants, missing parents and rejected writes. No test case was executed per user instruction. Historical fixtures drop newer tables only inside isolated test databases before replaying older versions; this does not describe app migration behavior.

Pending authorized checks: migration with existing records, full setup/correction, date picker, search/no-tenant, Back/Next/dirty-leave, repeated Save, failed-write draft retention, both languages, 320px/enlarged-text keyboard layouts, process restart and physical APK cold offline launch. Migration/occupancy/persistence outcomes are not claimed from code review alone.

## Exclusions

No opening dues, actual advance collection/held balance, recurring charges, billing, payments, receipts, future reservations, ending/deletion/reassignment, backend or sync. Backdated starts create no historical charges. Home money remains demo data.

[External lesson](../../../learning-notes/11-tenancies-sqlite.md). Next: Step 9 bills/dues, with financial opening and partial-month rules agreed before their calculations.
