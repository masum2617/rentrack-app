# Tenancies domain

Owner path: src/features/tenancies. Source rules: product requirements §5.2–§5.3, §5.5, §5.8–§5.9.

Own the dated arrangement between tenant and unit, rent/due/notice/advance terms, effective charge-rule configuration, and notice/departure coordination. Notice duration and advance amount are independent. A rent increase leaves the original held money unchanged.

Ledger owns bills, financial opening entries, actual advance balances/applications and receipts. Electricity owns measured assessments and contribution source records. Tenancy setup coordinates their public interfaces rather than directly writing their private stores.

Opening setup uses an effective date and separate older dues/held advance/electricity credit. It is not a new collection or reconstructed fictional history.

Departure reviews final charges, old dues, approved advance use, shortages/refunds, and actual collection/waiver outcomes; preserve the closed arrangement and make availability reflect approved closure.

[Setup/terms](../screens/tenancy-setup-and-terms.md), [departure](../screens/notice-and-departure.md). Acceptance A02, A09–A12, A17. Proration, due-day fallback, future-prepayment/rent-change handling, short notice, unused credit and closure with debt remain open; isolate dependent behavior.

