# Reporting domain

Owner path: src/features/reports. Source rules: product requirements §5.12.

Own authorized statement/report projections, receipt/statement preview and PDF/CSV export coordination. Business calculations/financial mutations remain with Ledger, Tenancies and Electricity.

Distinguish charges for a period, cash actually received during a period, allocations to that period, noncash advance application, waivers, and contributions paid directly to a meter. Held advance appears separately. Occupancy comes from authorized property/tenancy records.

Use scoped domain read interfaces rather than a second balance calculation or direct mutation. Explain local/pending/conflicting/incomplete records and last sync context where relevant. A new offline phone cannot report records it has never received.

[Screens](../screens/reports-and-statements.md). Acceptance A01, A19, A21, A24. Cutoff definitions, pending receipt identity, export completeness, PDF/font integration and correction/refund presentation need the applicable decisions before implementation.

