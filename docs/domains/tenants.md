# Tenants domain

Owner path: src/features/tenants. Source rules: product requirements §5.2 and §5.11.

Own tenant identity, optional contact/identification data, and labeled attachment metadata. Name is initially required; other identity details are optional. A tenant is not an application account. Ending a tenancy preserves identity and document/history associations.

Financial history is read through the relevant tenancy/Ledger interface; do not merge different tenancies into an unexplained personal balance. Capture/download/view actions use Platform files with correct local/online/pending status and authorized access.

[Screen family](../screens/tenants-and-documents.md). Acceptance A02, A15, A16 and relevant A20–A24. New captures remain locally retained until upload acknowledgment; older files are offline only when selected. File limits, deletion/retention, compression, protection and restore policies remain open.


## Current local slice

Step 7 owns `tenantStore.ts`, directory/row and the shared identity form under `src/features/tenants/`. SQLite v7 adds independent tenant IDs and identity/contact fields. Names and phones are not unique keys; different people may share them. SQL uses bound parameters and trims surrounding whitespace; phone and ID numbers stay text so leading zeros survive. No house/unit foreign key belongs on this identity table; Step 8 will link tenant IDs to unit IDs through tenancies. See [local work item](../work-items/local-tenants.md) for verification limits.

## Active rental context

Tenant list/form reads joined active locations through the Tenancies interface. `tenantReadModel` groups batched reads; `getTenant` opens the correct identity by ID. TenantForm retains one Modal while loading/error/content changes; its form body owns dirty draft behavior. Read-only rental context stays above editable identity/contact fields, showing selected-unit rental first when opened from Properties. The identity writer still touches only tenant columns. See [occupancy work item](../work-items/occupancy-context.md).
