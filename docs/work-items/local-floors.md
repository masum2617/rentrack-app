# Step 6A — House details and local floors

Implemented scope: house list → house details → shared Add/Edit floor form → updated details/list. Uses the reviewed green/white design without any Figma access or changes. Native and packaging evidence is recorded separately in the delivery log.

## Agreed behavior

- House identity opens details; Edit stays a separate labeled action. List search/scroll is preserved on return.
- A newly saved house opens its details. Editing returns to the originating list/details screen.
- List rows show a queried floor count and **ইউনিট: এখনো যোগ করা হয়নি**. No unit count is invented.
- A floor form contains its required name, optional floor code added in the follow-up fix, and inherited read-only house context. It hides tabs, protects unsaved Back for either field and preserves text on failures.
- Duplicate names within one house are rejected after NFC normalization, whitespace normalization and lowercasing. The same name can exist in different houses. Renaming keeps its ID, parent and creation order.
- SQLite success precedes closing the form. List/details refresh after writes; success feedback in details is scoped to the affected house.
- The Unit action explains that units come next. There is no unit screen/table, deletion, reordering, backend or financial change in this slice.

## Ownership and interfaces

Properties owns `floorStore.ts`, floor/house-detail presentation, validation and record readers. Platform owns schema v3 and connection migration. Navigation owns the two-screen native stack inside the Properties tab and existing full-screen Modal form coordination. Other tabs are unchanged.

`Floor` carries ID, property ID and name. Read/create/update functions use parameterized SQL; updates match both IDs. The new property-summary reader returns real floor totals in one query, while the existing property reader shape remains compatible. The house-form saved callback now returns its saved ID.

The v3 table references its parent house and has a unique `(property_id, name_key)` constraint. Foreign-key enforcement is enabled before the migration transaction. Existing houses and language preferences are retained. Error/empty/loading/missing-record states remain distinct.

Follow-up schema v4 rebuilds the floor table to add `floor_code_name`, copying existing IDs and data and retaining experimental v3 codes if the column was already present. Create/Read/Edit persist the optional trimmed code. Codes are not required or unique; floor-name uniqueness remains unchanged. Tests now total 23. Fully reopening the app applies the migration; Fast Refresh alone may keep the old connection.

## Acceptance

Run typecheck, real SQLite tests, native workflow checks and the APK command. Verify migration from existing versions, invalid parents, duplicates, stable ordering, failed writes/retry, per-house counts, house edit origin, new-house navigation, system Back, keyboard and restart persistence. Cover both dictionaries and document native/platform checks that could not be exercised. Explain the implementation in the external lesson rather than creating a second business specification.
