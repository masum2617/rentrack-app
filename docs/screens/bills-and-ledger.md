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

