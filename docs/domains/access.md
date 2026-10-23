# Access domain

Owner path: src/features/access. Source rules: product requirements §1, §5.7, §5.10 and §7H.

Owner and individually authorized helpers operate the app. Helpers see assigned properties and permitted actions. Owner approval is required for waivers; hiding a button is not server authorization.

Initial sign-in needs connectivity; previously authorized local unlock uses PIN/biometrics. Backend validation can reject queued operations; the app must expose that outcome and preserve enough context for review. A cached permission is not a permanent promise of server acceptance.

[Screens](../screens/access-and-settings.md), [sync states](../screens/sync-and-conflicts.md). Acceptance A13, A16, A20–A22. Authentication/provisioning/recovery, offline expiry/revocation, fine-grained helper rights, bill finalization rights, offline approval and pending-work sign-out remain open. Do not add public SaaS onboarding or tenant login.

