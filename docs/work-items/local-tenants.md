# Step 7 — Local tenant identity

Date: 28 October 2026. Scope: implementation without Figma, backend or tenancy assignment.

## Delivered behavior

Tenants tab → searchable directory → Add/Edit full-screen identity form → SQLite success → refreshed directory. Directory rows show name, optional phone/address and a labeled Edit action; no invented tenancy status or balance. Search matches name, address and either-script phone digits. Name and phone duplicates are allowed: stable IDs identify people.

Form: required name; optional phone/address; expandable ID type, ID number, emergency contact and notes. Existing extra values open expanded. Collapsing retains entered text. Inline name error focuses the field; synchronous in-flight guard blocks repeat saves. Failed writes keep the draft. Back confirms unsaved changes, including hidden fields. Green/white shared tokens, scalable typography, 48–60 point controls, keyboard-aware layout, Bangla default and full English strings reuse the established pattern.

## Files and storage

- `src/features/tenants/`: store, list, row and form.
- `src/platform/database/migrations.ts`: append v7 tenants table; existing migrations unchanged apart from the supported-version guard.
- `src/navigation/AppNavigator.tsx`: tenant-specific state, form and refresh.
- `src/shared/ui/FormField.tsx`: promoted existing field; compatibility export remains at PropertyField.
- `src/i18n/messages.ts`: complete strings in both languages.

Tenant identity has no unit/house assignment columns. Step 8 creates dated tenancies between tenant IDs and unit IDs. Optional identifiers are plain local SQLite text; secure storage/access, attachment handling and backup are not implemented.

## Verification and remaining manual checks

TypeScript and static review results are recorded in the delivery log. Regression cases were written, not run, respecting the owner's instruction to avoid test-case execution. Existing rewind fixtures remove the newer tenants table before replaying historical migrations. No fresh APK or native interaction/restart result is claimed.

When checks are authorized: verify fresh/v6 migration with existing houses/floors/units and locale, name-only creation, optional details across Edit/restart, same-name people, Bangla/English search, failed writes, invalid IDs, keyboard-open Save, duplicate taps, dirty Back and 320px/enlarged-text layouts on Android/iOS. Then rebuild APK and verify physical offline cold launch.

## Boundaries and next checkpoint

No tenant deletion, tenant profile, documents, occupancy, tenancy, bills, payments, backend or sync. Home financial values remain demo data. Next: Step 8 Start tenancy, with agreed dated terms/overlap/opening policies before the affected financial code.

[Learning lesson outside the app](../../../learning-notes/10-tenants-sqlite.md).
