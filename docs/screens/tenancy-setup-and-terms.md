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


## Step 8 implemented subset

Entry is Unit details, from a floor's unit list. A vacant unit offers Start tenancy; an occupied unit shows tenant/contact and the five agreed terms, with Edit rental terms. Setup uses Choose existing tenant → Terms → Review; correction reuses Terms → Review with immutable links. Empty tenant selection directs users to the Tenants tab; no inline creation. Back/Next retains in-memory input, and leaving prompts when dirty. Date defaults to today; four numeric fields begin blank. Validation, retry-preserved input, loading/missing/read-error states and scoped saved feedback are bilingual.

Notice is nonnegative whole months, independent of advance. Advance is explicitly agreed-only. Due days 29–31 fall back to the month's last day when billing is implemented. Terms are stored as integer paisa and local calendar dates. System date picker requires rebuilt development clients; native acceptance remains pending. Drafts do not resume across restart. Charge configuration/opening values, tenancy ending and financial/account actions described above remain later scope.

## Step 9A correction lock

Any non-void finalized bill now blocks setup correction in both Unit details and the store transaction. The UI explains the lock rather than leaving an active Edit action. Voiding all finalized bills permits corrections; old financial snapshots remain unchanged. Drafts do not lock terms, but stale source signatures require refreshed editing/review before finalization. Effective-dated rent increases are still future scope.

## Step 9B optional charges and separate settings

New tenancy Terms exposes an expandable optional monthly-charge section, retained across stages and dirty Back; Review shows the choices. Unit details shows current settings and scheduled month labels with an accessible pencil action opening the full-screen version list/editor. Fixed amounts use persistent fields; water manual mode defers amount entry to each bill. Errors retain input and identify blocking finalized months. [Behavior and verification](../work-items/additional-charges.md).
