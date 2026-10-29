# Bills and ledger

Owner: src/features/ledger. Read [domain guide](../domains/ledger.md). Purpose: explain dues and charges and prepare reviewed monthly bills.

## Screens and actions

Ledger has Dues / Bills / Payments views with visible property and period/date scope. Bills shows billing months; Payments uses actual receipt dates. Outstanding across all months has an explicit label.

Bill detail shows original rent/water/service/one-off/electricity charges, contribution/credit applications, payment allocations, approved adjustments and remaining balance. Held advance remains outside ordinary dues. Primary action invokes [Record payment](payments-and-receipts.md); statement preview is secondary.

Bill review uses applicable terms/rates, due date and proposed partial-month adjustment. Missing readings/terms are visible incomplete inputs, not zero charges. Finalize only after review and under agreed authority.

Adjustment review preserves original charge, amount, actual date, person, reason and owner approval for a waiver. It is not a generic editable outstanding field or a Paid toggle.

## State and role coverage

Draft/finalized, unpaid/part-paid/paid, and pending/synced/conflicting are independent states. Separate no bills from unavailable offline or filtered-out records. Preserve finalized applied values after later configuration changes.

Acceptance: A07–A09, A12, A17–A19 and relevant language/accessibility cases. Use requirements §8's 11,752 gross / 11,252 current payable / 9,252 remaining example when verifying integration. Rounding, proration, finalization rights and correction mechanisms remain open.


## Step 9A implemented subset

Ledger is a real portfolio bill list with property/month scope and Include voided; defaults are all properties/months. Unit details opens tenancy-scoped bills and shows finalized rent outstanding. Both lists open the shared Bill detail/review composition. Create/Edit draft uses inherited tenant/location, year/month selectors, covered range, due date, reference/calculation/proposal, editable reviewed amount and conditional reason. Save draft persists before review; finalization is a separate confirmation. Drafts can be discarded; finalized bills offer reasoned void, preserved history and replacement draft. No paid toggle or payment action is exposed.

Zero charges show no outstanding, not money received. Draft/void records are excluded from dues; overdue requires finalized positive outstanding and a due date before today. Form errors retain input and dirty Back confirms leaving. Bill cards announce location, tenant, amount, status and due date accessibly. Current implementation is rent-only/local; additional financial views above remain future scope. Native/test acceptance is pending; see [work item](../work-items/local-rent-bills.md).

## Step 9B additional charges

Drafts append fixed/manual standard charges and named one-offs beneath rent, plus the combined total. Required monthly water cannot silently become zero. Fixed overrides require reasons; custom extras have labeled Remove actions. Shared details show saved line snapshots and all-line outstanding. Stale refresh and month change confirm before clearing entries. An ineligible saved draft keeps its original month/entries until explicit valid-month recalculation. [Work item](../work-items/additional-charges.md). Native layout and regression execution remain pending.

## Step 10A balance integration

Finalized bills show applied payments and remaining balance, with unpaid/partly-paid/settled status and separate overdue indication. Payment/history actions open the shared flow. Bill void is disabled with an explanation when recorded allocations exist; the transactional writer enforces the same rule. Portfolio cards distinguish gross total from outstanding and announce both accessibly. Totals exclude reversed allocations and draft/void charges. [Work item](../work-items/local-payments.md).
