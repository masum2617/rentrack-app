# Home

Owner: src/features/home. Purpose: identify the next useful task for the authorized property/period scope. Read [navigation](../navigation.md) and domain read interfaces from [architecture](../architecture.md).

Current visual artifact: [Home-only Figma draft](../design/home-review.md), containing Bangla, English and empty Home states with explicit fictional data. Step 2 implements the reviewed native layout, temporary locale switching, navigation shell and named demo/empty states. Demo selectors change fixture presentation only. SQLite and backend work remain deferred. See the delivery log for actual native verification.

## Information and actions

Show scope first, then one financial summary: charges for the chosen billing period, money received in the explicit receipt-date range, and outstanding across all months. These measures need not reconcile as one equation.

Primary action: Record payment → common [payment flow](payments-and-receipts.md). Secondary named shortcuts: readings and bill review. Attention rows cover real incomplete readings, draft bills, approaching departures, and actionable sync issues. Occupancy/vacancy is a compact summary, not a photo gallery.

A first-use empty state leads to property → unit → tenancy setup. A property choice is visible; changing a report month does not silently change a receipt-date definition.

## State and role coverage

Owner sees authorized portfolio; helper sees assigned properties only. Locally available data stays visible during refresh. Missing offline data is not zero. Pending work is quiet; rejection/conflict is actionable. Home does not fabricate aggregate totals from incomplete sources or mutate balances.

Acceptance: A01, A13, A16, A20–A23. Reporting cutoffs and exact upcoming-departure thresholds need agreed meaning; do not invent urgency policy. S55/S56 remain historical alternative layouts, not additional screens.

