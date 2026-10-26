# Step 5 plan: first local property workflow

Status: Figma design draft ready for owner review; application code not started. Step 4 was confirmed complete by the owner. See [the Step 5 review](../design/properties-review.md).

## Outcome

An owner can open বাড়ি / Properties, create a building record, see it in the list, edit it, and find the saved values after a normal offline restart. This is the first business-record workflow following the persisted language exercise. It begins implementing property identity from requirements §5.1/A01 without claiming complete portfolio accounting or authorization.

## Deliver in small checkpoints

1. Review the property list and add/edit form layout, Bangla/English copy and keyboard/back behavior. Use the current green/white design system and stable bottom navigation. No need to design all later screens.
2. After design approval, add a versioned properties migration and a few domain-owned read/create/update functions. Stable IDs identify records, not their names; names can repeat across locations. Keep locale preferences intact. A property has required name/location and optional address. The owner excluded notes from this house form.
3. Connect list → create → list → edit. Require name/location, trim blank input, display validation next to fields, prevent repeated save taps, and navigate only after successful persistence. Retain form values on storage errors and offer retry. Confirm leaving a dirty form; preserve context when language changes.
4. Verify both languages, empty/loading/error/saved states, keyboard and narrow/large-text layout, create/edit after offline restart, and schema-upgrade preservation of the language preference. Add an external learning lesson and update the delivery log with actual results.

## Screen boundaries

- List purpose: find/open a building; `নতুন বাড়ি` action and a labeled `এডিট` action per row. Show name/location/address if useful. Do not fabricate occupied/vacant/unit counts before units/tenancies exist. Distinguish an empty portfolio from read failure.
- Form purpose: create or edit one building. One primary Save action, visible field labels, optional fields clearly identified. User-entered names/notes retain their script.
- Keep the existing Home sample money/counts explicitly separate. Do not combine real property records and fictional finances into a purported live overview. Real Home integration follows actual unit/tenancy/ledger readers.
- Saved status means saved on this phone. Do not show pending/synced badges without a synchronization implementation.

## Scope and ownership

Properties owns record validation/read/write and screens under `src/features/properties/`. Platform owns migration/connection; navigation and i18n changes have one coordinated writer. Continue simple functions/direct SQL and the existing navigator; introduce no ORM, generic repository stack or full backend for this slice.

Excluded: unit creation, occupancy/tenancy, financial totals, photos/documents, deletion/archive, owner/helper auth, server APIs, sync and backup. Add/edit is a private local learning slice; real shared or financial use still needs access/recovery foundations.

## Following slices

- Step 6: property detail → create named floors → add units under a floor. Unit details use structured counts for bedrooms, drawing rooms, total/attached bathrooms, balconies/facing, size in square feet and optional notes. Attached bathrooms are included in the total; precise facing scope remains to be settled during that design slice.
- Step 7: tenant identity list/form.
- Step 8: start tenancy linking tenant and unit with dated terms/opening values.
- Then bill review/dues before recording actual payments; add electricity and departure workflows afterwards.

Introduce Spring Boot/PostgreSQL/access and the first one-domain sync slice when explicitly requested and before claiming shared production records. Keep personal explanations in the [external learning notes](../../../learning-notes/README.md), with a new lesson linked when the implementation is written.
