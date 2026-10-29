# Tenants and documents

Owner: src/features/tenants. Read [domain guide](../domains/tenants.md). Purpose: identify a person, access authorized documents, and enter the correct current/past tenancy.

## Screens and actions

Tenant directory: search by name/unit with current/past context; each group shows identity and rental association. Identity profile displays contact/optional ID information and separately identified tenancies. Open the selected [tenancy account](tenancy-setup-and-terms.md) for financial work.

Identity form requires name initially; phone, address, ID, emergency contact and notes remain optional. Keep routine fields first and optional detail available through labeled controls.

Documents list shows label/type and availability. Add document uses camera or existing file, confirms label/capture, and saves a local file plus metadata before showing queued status. Viewer supports available local content and explicit remote retrieval; actual viewer implementation is still needed.

## State and role coverage

Avoid mandatory portraits or ID images in routine financial lists. Preserve names as entered in either script. No-document state offers Add document. Existing online-only files show Download for offline use; when offline explain unavailable content rather than a broken blank preview.

New capture is retained until upload acknowledgment. Failed uploads retain a retryable local file. Permission denial leaves a clear choice/retry path. Only authorized users can reveal files/IDs.

Acceptance: A02, A15, A16, A20–A24 as applicable. File formats/limits, retention/deletion, local cleanup/protection and restore remain open. Tenant identity is not a signed-in helper account.


## Step 7 implemented subset

The current directory searches name, phone and address; phone digits can be searched in either script. Each row shows name, phone or missing-phone text, optional address and explicit Edit. Only name is required in the shared Add/Edit form. Phone/address are shown immediately; ID type/number, emergency contact and notes are behind a labeled expandable control. Existing extra values expand on Edit; collapsing never removes draft values. Empty, no-match, loading, retry, inline required-name and retained-input save-error states are implemented. No fake unit or current/past status is shown before tenancy records exist.

Tenant profile, rental association/search by unit, document capture/view, tenancy history and finance summaries above remain future scope. ID numbers are not shown/searched in directory rows. Optional identity values currently use ordinary local SQLite storage; protected storage/access is not claimed.

## Occupancy follow-up implemented subset

Directory rows now show all active building → floor → unit locations. Shared Add/Edit remains one identity form; Edit loads current identity and active rentals by ID. A Current tenancies section above editable fields shows readonly location, start month/year and completed years/months of residence. Tenants with no active rental have explicit feedback. Opening from a unit prioritizes and marks that rental; all other current rentals are included. Save/Back/retained-input errors remain consistent. A separate read-only profile was not added. Full financial history/documents remain future work.

## Current rental-label presentation

Active rental locations in tenant rows and the readonly form section now show building on its own line, then labeled Floor/Unit together with natural wrapping. Start month and elapsed residence remain below in the form section. Tenant-row Edit is a pencil icon with a contextual accessibility label; identity/save behavior is unchanged.
