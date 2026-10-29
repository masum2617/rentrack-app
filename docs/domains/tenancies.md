# Tenancies domain

Owner path: src/features/tenancies. Source rules: product requirements §5.2–§5.3, §5.5, §5.8–§5.9.

Own the dated arrangement between tenant and unit, rent/due/notice/advance terms, effective charge-rule configuration, and notice/departure coordination. Notice duration and advance amount are independent. A rent increase leaves the original held money unchanged.

Ledger owns bills, financial opening entries, actual advance balances/applications and receipts. Electricity owns measured assessments and contribution source records. Tenancy setup coordinates their public interfaces rather than directly writing their private stores.

Opening setup uses an effective date and separate older dues/held advance/electricity credit. It is not a new collection or reconstructed fictional history.

Departure reviews final charges, old dues, approved advance use, shortages/refunds, and actual collection/waiver outcomes; preserve the closed arrangement and make availability reflect approved closure.

[Setup/terms](../screens/tenancy-setup-and-terms.md), [departure](../screens/notice-and-departure.md). Acceptance A02, A09–A12, A17. Proration, due-day fallback, future-prepayment/rent-change handling, short notice, unused credit and closure with debt remain open; isolate dependent behavior.


## Step 8 local implementation

Tenant identity and units are linked through schema-v8 tenancies. Create/read and unbilled-setup correction live in `src/features/tenancies/`; occupancy is derived from open tenancies. One open rental per unit is enforced in SQLite; one tenant may rent several units. Start dates may be today/past only. Notice is whole months; monthly due day allows 1–31 with last-day fallback in short months. Agreed advance is a term, not money held. No Ledger entries are created. See [work item](../work-items/local-tenancies.md) for interfaces, checks and native rebuild requirements. Before Step 9 posts money, guard corrections and implement historical/effective-term behavior.

## Occupancy read projections

`listActiveRentals` returns open rental identity and tenant/house/floor/unit context, scoped by tenant/house when needed. Floor occupancy includes stable tenant IDs for editor links. Counts represent rented units, not distinct people. Residence durations are derived from calendar dates without storing another field or merging separate rental histories. See [occupancy follow-up](../work-items/occupancy-context.md).

## Step 9B charge configuration

Tenancies owns optional initial monthly-charge settings and effective-month versions. Water supports none/fixed/manual; service/gas none/fixed. Initial settings share the tenancy transaction. Separate settings editing checks finalized Ledger bills in the changed interval, without reopening locked rental terms. Existing effective-month boundaries remain fixed; add a new month to start a new period. See [work item](../work-items/additional-charges.md).
