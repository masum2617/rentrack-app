# Sign-in, local unlock, helpers and settings

Owners: src/features/access and src/features/settings; split paths explicitly if parallel. Read [Access](../domains/access.md).

## Entry and local access

Start app-owned UI in Bangla even on an English phone. Offer a visible বাংলা / English switch on initial sign-in. Authentication method/provider remains open; do not hardcode the prototype's illustrative email/password as a confirmed decision.

Initial authorization requires online access. Subsequently authorized local unlock uses PIN/biometrics under the yet-to-be-defined expiry/revocation policy. Explain offline first-use unavailability and retain appropriate input on failure.

## More and management

More groups Reports, Device/account and owner management, with Language near the top. Locale choice persists offline; switching preserves drafts/context. Sync queue has a direct entry.

Owner helper management shows separate helper identities, assigned properties and granted operations. Tenant identity is not helper provisioning. Protect assignments and owner-only financial actions through the eventual authorization implementation, not only visible controls.

## States and open policy

Account recovery, backup/restore, local-storage cleanup and sign-out with pending records/files need explicit workflows before those actions are implemented. Avoid presenting unsynced work as remotely backed up.

Acceptance: A13, A16, A20–A22. Fine-grained helper/bill-finalization rights, owner approval offline, auth/provisioning/recovery and offline validity remain open.

