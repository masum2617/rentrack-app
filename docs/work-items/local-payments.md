# Step 10A — Local payments, allocations and receipts

Date: 29 October 2026. Source implemented; test execution and native acceptance remain pending by owner instruction.

## Delivered flow

Unit details or finalized Bill details → Record payment → Review allocation → Save → in-app receipt. Unit and bill payment histories open the same receipt screen by stable ID. Form Modals cover bottom navigation; history/receipts use the originating Properties or Ledger native stack. Closing returns to the source without resetting bill filters/scroll. Revisions refresh unit/global balances and history; focused history/receipt screens also refresh on app resume.

Required received amount is positive, starts blank and accepts Bangla/English digits with up to two decimals. Actual receipt date defaults to today, cannot be future and may precede the tenancy start. Cash/bank/mobile-wallet method is required and initially unselected. Reference/notes are optional. This records received money, not a transfer, advance receipt or refund.

## Allocation and safeguards

One payment belongs to one tenancy, even when the same person rents multiple units. Eligible lines are finalized, non-void, with positive remaining balances. Unit suggestions use oldest billing month, then rent before ordered extras. Bill entry prioritizes that bill; owners can allocate to other months or specific charges. Changing the received amount regenerates the visible suggestion; direct allocation fields and Suggest again permit manual adjustment. Blank allocation fields count as zero; the entire received amount must be allocated before saving. Amounts exceeding total finalized dues, a selected line's remainder or safe integer limits are rejected.

The writer validates input, looks up a stable operation ID, then resolves current eligible lines inside the exclusive transaction. It checks tenancy ownership, unique allocation IDs, positive amounts, per-line caps and exact total. Payment plus every allocation commits or rolls back together. Identical retries return the same receipt ID before balance revalidation. A different valid payload with an already recorded operation returns the original receipt ID in an explicit conflict; the form provides Open recorded receipt. Separate submissions remain separate records.

Failed writes preserve form input; refreshed dues require confirmation before replacing allocations and retain receipt details. Dirty Back/Close confirms; Review Back retains all input. Repeated saves/reversals are guarded synchronously. Storage completion precedes receipt navigation.

## Receipts and reversal

Receipts preserve tenant/house/floor/unit names, actual receipt date/method, amount, reference/notes, recording timestamp and allocation month/category/name/amount. They also retain the tenancy's remaining balance at recording, clearly labeled as historical; current balances are still derived. Review shows total remaining dues including untouched charges. The local SQLite payment ID is the receipt reference, not a globally issued server number. Later identity/location renames or payments do not change these snapshots.

No Edit/Delete payment action exists. Reverse payment requires a reason and confirmation, preserves original amounts/allocations/recording time and marks the receipt reversed with timestamp/reason. Repeated reversal preserves the first reversal. Reversed allocations no longer reduce dues. This corrects an entry; it does not record a cash refund. Re-enter the correct payment as a new operation after returning to the unit/bill. A payment spanning several bills reverses all its allocations together.

Bill voiding is blocked in UI and transactional storage while recorded payments allocate to its lines. Reverse the affected payments first. Void/reissue continues to preserve all bill lines and reversed receipt history.

## Interfaces and schema

Ledger adds payment validation/suggestion, active-allocation readers, payment record/read/history/receipt/reversal interfaces and a SQLite-generated random operation token per open form. This is local retry identity, not a sync implementation.

`Bill` retains gross amount and rent-specific amount, and adds derived `paidPaisa` and `outstandingPaisa`; lines carry their applied amount. Unit/portfolio outstanding sums finalized non-void charges minus recorded allocations. Draft/void values contribute no debt. Zero-charge bills show no dues without implying cash received. Status is unpaid/partly paid/settled, with a separate overdue indicator only for positive remaining balance and a due date earlier than today.

Schema v11 appends payments and allocations with foreign keys, operation uniqueness, positive safe paisa, method/status checks and indexes. Prior migrations/data remain intact. Financial fields/allocations are immutable through public interfaces; reversal updates lifecycle metadata only. Use the existing configured writer connection with FK enforcement before BEGIN IMMEDIATE. No dependency or native rebuild is added; fully close/reopen for startup migration.

## Verification and boundaries

TypeScript and independent static review are the source checks; cases are authored, not executed. Independent review found no blocking defect in transaction, retry/conflict, tenancy isolation, balance, reversal, void-guard or stack paths. The final observed commands and pending acceptance are recorded in the delivery log.

Authored cases cover v10 preservation, partial/full/selected-later-charge payments, retry/conflicts, excess and cross-tenancy rejection, injected rollback, reversal/void protection, restart, receipt snapshots, zero bills and overdue/paid statuses. Existing migration rewind fixtures now drop payment child tables and expect v11; newer-schema rejection uses v12.

Native acceptance remains pending: v11 migration with existing data, keyboard/date picker, dirty Back and stage navigation, narrow/enlarged text, both languages, screen readers/focus, repeated taps, ambiguous-save retry, concurrent allocation/reversal changes, history scroll, reverse/re-enter and app restart. No runtime, native build or fresh APK result is claimed.

No prepayment/unallocated cash, advance collection/application, cash refunds, waivers, PDF/sharing, automatic billing, backend/sync or Figma. Home remains demo finances. Next is owner review and acceptance of the local workflow before planning another slice.

[External learning lesson](../../../learning-notes/15-payments-allocations-receipts.md).
