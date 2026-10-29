# Source instructions

Read [app instructions](../AGENTS.md) and [architecture](../docs/architecture.md) before implementation.

This tree contains Home, shared UI/theme/locale, SQLite houses/floors/units, tenant identity and tenancy terms. Properties uses HouseList → HouseDetails → FloorDetails → UnitDetails. Setup forms are full-screen Modals. Tenancies owns dated tenant/unit links, setup corrections and occupancy readers; Tenants owns independent identity. See the delivery log for verification limits. Ledger guards corrections while finalized bills exist.

Feature business behavior stays inside its owning feature. Application wires dependencies; navigation registers routes; theme/i18n/shared UI provide consistent presentation; platform supplies local/remote integrations.

Follow [agent workflow](../docs/agent-workflow.md) for shared paths and [verification](../docs/verification.md) for evidence. Implement only the requested slice, adding internal layers when they have concrete work to do.


Step 9A adds Ledger-owned rent bills, transactions and outstanding projections. Unit/portfolio bills share screen implementations; no other feature writes bill amounts or balances. Read the rent-bills work item for unexecuted verification and exact policy.

Step 9B adds Tenancies-owned charge settings and Ledger-owned additional bill lines. Read [additional charges](../docs/work-items/additional-charges.md) before changing version periods, bill amounts or source signatures. Bill amountPaisa is now the all-line total; rentAmountPaisa is rent-specific. Keep future payment allocation on the existing outstanding projection.

Step 10A adds Ledger-owned payments, immutable allocations/receipt snapshots and reversal metadata. Bill paidPaisa/outstandingPaisa are derived from recorded allocations; gross amountPaisa remains unchanged. Read [local payments](../docs/work-items/local-payments.md) for retry identity, void protection and unexecuted acceptance checks.

Step 10B Home composes real Property/Ledger read interfaces without another balance store. Read [live Home](../docs/work-items/live-home.md) before changing summary periods, scoped Ledger requests or payment Modal placement. Schema remains v11; regression/native acceptance is pending.
