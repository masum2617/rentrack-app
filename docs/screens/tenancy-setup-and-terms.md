# Tenancy account, setup and terms

Owner: src/features/tenancies. Read [domain guide](../domains/tenancies.md); [Ledger](../domains/ledger.md) owns monetary facts.

## Purpose and data

A tenancy account explains one rental arrangement. Show tenant/unit identity, dates/status, due amount with older/current breakdown, and separate held advance, future rent and electricity credit where relevant. Primary collection entry invokes the common payment flow. Terms, documents, charges and activity are clearly named secondary views.

Start tenancy: select property/unit and existing/new tenant → dates/rent/due date → notice duration and separately agreed advance → recurring/one-off charge rules → optional existing-rental opening values → review. Name is not re-entered in each step.

Opening values have an effective date and separate older dues, held advance and electricity credit. Do not pretend they were collected now. Prior future-month rent needs its agreed treatment.

Terms shows effective-dated rent/charge changes. Rent change previews the future effective month and states original held advance is unchanged. Advance view reads original/applied/remaining money from Ledger while explaining notice terms.

## State, role and actions

Label resumable setup as Draft. Retain values and allow Back/Next without loss. An existing tenant with several arrangements requires explicit tenancy selection. Helpers use only granted changes; unknown bill-finalization/advance permissions are not assumed.

Departure opens [notice review](notice-and-departure.md); ending occupancy preserves history. Financial entries go through the owning interface, not edits to displayed totals.

Acceptance: A02, A10–A12, A17, A20–A23. Proration, due dates in short months, historical/future prepayment mapping and overlap rules remain open in requirements §11.

