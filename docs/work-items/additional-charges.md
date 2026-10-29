# Step 9B — Fixed and monthly additional charges

Date: 29 October 2026. Source implemented; regression execution and native acceptance remain pending by instruction.

## Delivered behavior

Tenancy setup has an optional Other monthly charges section: water none/fixed/manual, service/gas none/fixed. All start as not applicable. Initial settings save in the same transaction as the tenancy, effective from its start month. Existing tenancies remain rent-only until settings are saved.

Unit details shows current charges, upcoming effective months and a contextual pencil action. The full-screen settings workspace lists complete effective-month versions and supports Add or Edit. Existing version boundaries stay fixed; change amounts/modes in that version or add another month. No deletion/reordering. Water readings/building-bill splits remain external manual calculations.

Drafts resolve the version applicable to the billing month. Fixed lines retain proposal/reviewed amount/reason; manual water requires explicit amount or zero. Named one-off extras can be added/removed and are unique after Unicode/whitespace/case normalization among other one-off names. Each bill has at most one standard water/service/gas line. Only rent is automatically prorated; other charges are entered as final monthly amounts. All lines share the bill due date.

Bill review/details show the itemized rent/additional charges and a safely derived total. Portfolio and unit outstanding use all finalized lines, excluding drafts/voids. No payment/credit/waiver is represented by a negative charge. Ordinary draft Save requires complete valid amounts; failure keeps entries in memory and does not change the prior saved draft.

## Effective periods and consistency

An effective-month version applies until the next version, exclusive. Before the first version no additional recurring charges apply. Months may be past/current/future, but saving a new version before the current tenancy start month is invalid. Initial settings retained after a permitted start-date correction still resolve by month; the bill eligibility guard independently prevents billing before the corrected start.

Settings saves take an exclusive write transaction, check the parent, boundaries and duplicates, and reject when any non-void finalized bill falls in the affected interval. The error identifies the first blocking month. Voiding affected bills permits changes; snapshots remain preserved. For January→April versions, editing January affects January–March, not April onward. Turning a charge off uses none in a new version.

Draft headers store the applicable settings signature. Save/finalization compare it to current month resolution alongside the existing rental-term signature. Changed settings require refreshed proposals and another saved review. Draft opening never silently replaces charge snapshots. Refresh confirms before clearing manual water, overrides and one-offs; cancellation preserves input. Month changes also confirm replacement of entries. If a tenancy correction makes the saved draft month ineligible, its original month, rent and extras remain visible; saving/refresh stay disabled until the owner selects a valid month and confirms recalculation.

## Ownership and interfaces

- Tenancies owns chargeSettings validation, list/applicable-version resolution and transactional settings writes. `createTenancy` accepts optional initial settings; rental-term correction remains a separate interface.
- Ledger owns additional-charge validation and line snapshots. `Bill.amountPaisa` is the total; `rentAmountPaisa` preserves the rent-specific value; `lines` carries itemized snapshots. Draft writes receive extras and the expected charge-settings signature.
- Portfolio reads batch lines and group them by bill rather than requesting each card separately. The common outstanding projection remains the integration point for future payment allocations.

Schema v10 appends the settings table, header signature and line metadata/indexes using ALTER operations, preserving existing bill/line IDs, amounts, reasons and timestamps. Existing v9 rent-only drafts remain valid when no settings have been added. Use the configured dedicated write connection with foreign keys enabled before BEGIN. No new dependency or native rebuild is required; fully close/reopen to run startup migration.

## Verification evidence and pending acceptance

TypeScript and static review were used; regression cases were authored, not executed. Independent review identified invalid-month draft initialization losing extras; the corrected flow preserves snapshots and requires an explicit reset, and follow-up review found no remaining concrete defect. Final command evidence is recorded in the delivery log.

Authored cases cover v9 preservation, atomic initial settings, modes/precision/reasons/zero amounts, normalized custom names, effective boundaries/future schedules, affected-period locks and void unlock, stale draft protection, restart persistence, itemized/global totals, duplicate submissions, rollback/overflow and tenancy isolation. Earlier migration fixtures are maintained for v10.

Pending native checks: migration on existing device data, save/restart persistence, keyboard/dirty Back, both languages, narrow/enlarged text, screen-reader focus, reset cancel/confirm after same-year and cross-year start correction, stale refresh cancellation and concurrent source changes. No test/native/build/APK success is claimed.

No automatic generation, meters/water splitting, electricity, opening balances, payments/advance applications, receipts, backend or Figma. Home finances remain demo data. Next is Step 10 payment allocation/receipts after this slice's owner review.

[External lesson](../../../learning-notes/14-additional-charges.md).
