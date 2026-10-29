# Home

Owner: src/features/home. Purpose: identify the next useful task for the authorized property/period scope. Read [navigation](../navigation.md) and domain read interfaces from [architecture](../architecture.md).

Historical visual artifact: [Home-only Figma draft](../design/home-review.md). Step 10B preserves the reviewed layout and SQLite-backed language preference while replacing fixtures with real summaries and working actions. Read [live Home](../work-items/live-home.md) for current behavior and pending native/regression acceptance; earlier demonstration evidence is historical.

## Information and actions

Show scope first, then one financial summary: charges for the chosen billing period, money received in the explicit receipt-date range, and outstanding across all months. These measures need not reconcile as one equation.

Primary action: Record payment → common [payment flow](payments-and-receipts.md). Current secondary shortcuts: all-month outstanding/overdue bills and selected-month draft review. Meter/sync/departure attention remains future scope. Attention rows cover real incomplete readings, draft bills, approaching departures, and actionable sync issues. Occupancy/vacancy is a compact summary, not a photo gallery.

A first-use empty state leads to property → unit → tenancy setup. A property choice is visible; changing a report month does not silently change a receipt-date definition.

## State and role coverage

Owner sees authorized portfolio; helper sees assigned properties only. Current read refresh shows loading until a consistent snapshot is ready; selected filters and open payment forms stay intact. Missing offline data is not zero. Pending work is quiet; rejection/conflict is actionable. Home does not fabricate aggregate totals from incomplete sources or mutate balances.

Acceptance: A01, A13, A16, A20–A23. Reporting cutoffs and exact upcoming-departure thresholds need agreed meaning; do not invent urgency policy. S55/S56 remain historical alternative layouts, not additional screens.

## Step 10B current implementation

All-month outstanding, selected billing-month gross finalized charges and actual-date monthly collections are explicitly labeled. Current unit occupancy is independently scoped by property. Home payment selection groups by tenancy ID; payment/receipt reuses Ledger and closes back to Home. Background Home reads cannot unmount that flow. No-house onboarding, no-bill next actions, actual zeros, missing-property recovery and announced read error/Retry are present. Source/static review passed; native behavior remains pending. [Work item](../work-items/live-home.md).
