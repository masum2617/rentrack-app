# Mobile architecture and domain ownership

Status: working organization for a single offline mobile client; not a claim of implemented modules or a new backend design.

## Module map

| Feature path | Owns | Reads or invokes |
|---|---|---|
| src/features/properties | Property/unit records and occupancy presentation | Tenancy associations |
| src/features/tenants | Identity, contacts, attachment metadata and document workflows | Tenancy summaries; private-file platform |
| src/features/tenancies | Dated rental terms, charge-rule configuration, opening workflow, notice/departure coordination | Properties, tenants, ledger, electricity |
| src/features/ledger | Bills/charge postings, money received, allocations, advance/prepayment records, approved financial adjustments, financial balances | Effective tenancy terms and electricity assessments |
| src/features/electricity | Meters, household associations, readings, configured rates, recharge source records and calculated consumption assessments | Ledger-posted charge/contribution/application results |
| src/features/access | Sign-in/local access, property authorization, helper assignments | Network and secure storage |
| src/features/reports | Authorized report/statement projections and export workflows | Domain-owned records and confirmed/pending context |
| src/features/home | Composes summary and attention views | Read interfaces of domains |
| src/features/settings | Language/device/account setting screens | i18n, access, platform status |

Detailed business responsibilities: [domain index](domains/README.md). Home and Settings are presentation/composition features, not new financial domains.

## One financial source

Ledger owns posted receivables and allocations. Electricity owns source readings/contributions and their assessment. Posting a reviewed electricity assessment uses a stable source identity and connects its contribution applications to the same ledger charge. The electricity screen reads posting results; it does not maintain a second editable debt.

Electricity carry-forward is an electricity-specific view reconciled from those same linked records. A contribution is applied once. A separate collection uses the existing charge and generic payment flow. Final command/data contracts are defined for the first implementation task, not invented here.

Tenancies owns contractual advance terms; Ledger owns monetary advance receipt/application balances. Departure coordinates those features rather than introducing another calculation engine. Opening values are dated starting facts, not newly received cash.

## Dependency rules

- A screen calls a feature's use-case/read interface. Domain calculations do not depend on React, navigation, translated strings, or network availability.
- When a feature needs internal organization, introduce domain, application, data, and presentation folders only as needed. Keep public exports explicit; other features do not import private repositories or write their tables directly.
- Cross-feature commands/read interfaces carry stable IDs, necessary scope, outcomes/errors, and sync state. A task records these before parallel callers are built.
- Shared UI contains generic presentation; shared/money contains exact numeric representation/operations, not tenancy-specific financial policies.
- Theme owns semantic tokens. i18n owns locale selection, resource loading, and formatting conventions. Route registration is owned by navigation.
- Platform owns SQLite access/migrations, transport, pending sync operations, local/private-file integration, and secure-storage adapters. Features own business validation and records.
- Application is the composition entry point. Dependency wiring may connect concrete adapters; business code should not reach into that entry point.
- Reporting and Home use read projections; they do not mutate business totals.

Prefer a few useful module interfaces to a mandatory interface for every class. No event bus, microservice split, event-sourcing framework, or generic repository hierarchy is selected by this structure.

## Pragmatic domain-driven slices

Use the same business vocabulary in code, tests, and screen specifications. A feature groups related business behavior rather than collecting unrelated screens under a tab name. Keep validation/calculation with its owning domain and expose useful use cases/read interfaces to presentation.

Identity and consistency scopes should follow the operation: a tenant identity, a dated tenancy, a reviewed bill with its historical values, a receipt with its allocations, or a meter reading/contribution linked to its period. A property does not require loading the entire portfolio as one mutable object. The concrete aggregate/storage boundaries are refined with the first implementation and its transaction requirements, not frozen by an empty folder.

For example, recording received money needs the receipt, allocations, and queued operation to succeed consistently. A screen cannot show completion after only the amount field changes. Departure coordinates existing domain operations; it does not duplicate their formulas. Integration tests exercise these cross-domain effects through the same public interfaces used by the app.

## Offline write boundary

A feature validates its operation and commits the local record plus pending sync work consistently through the persistence boundary. A local transaction succeeds before the UI says saved. A stable operation identity survives retries. Server rejection and conflict are explicit outcomes, not silent overwrites.

Preserve original receipt date, billing period, due date, effective term date, and sync time separately. Historical confirmed terms/rates remain attached to finalized calculations.

## Implementation choices still open

TypeScript, Expo/React Native, React Navigation and Expo SQLite are selected for the current native client. `src/platform/database/` opens `house-rent-tracker.db`, owns versioned schema migration, and currently stores only the device-local language preference. The direct parameterized SQL is deliberately small for this learning slice; it is not a generic repository pattern or a rental ledger schema. Money representation/rounding, sync contracts, authentication and real domain tables remain open for their authorized feature tasks. Record hard-to-reverse trade-offs in an ADR when warranted.

The backend stack is accepted, but no server routes, DTOs, schema, or library versions are established by these documents.

