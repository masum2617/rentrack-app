# Platform work

Read [architecture](../../docs/architecture.md), [sync screen behavior](../../docs/screens/sync-and-conflicts.md), and affected product rules.

Persistence/network/sync/file/secure-storage integrations serve domain interfaces. They do not decide rent allocation, automatic waiver/refund, or tenancy closure policy.

Assign one writer to migrations and to each shared sync/transport contract. Feature writes and queued operations persist consistently before success; retries keep stable operation identity. Financial conflicts/rejections and new-file retention remain explicit.

Keep authorization and private-record context throughout adapters and logs. Do not select a provider/version or claim secure storage, background delivery, backup, or restore works without implementation evidence.

Current implemented storage is intentionally limited: Expo SQLite owns a versioned `device_preferences` schema and the Bangla/English locale preference. No financial/domain schema, endpoint, sync provider, backup, secure-storage or background-delivery capability is defined or implied.

