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

