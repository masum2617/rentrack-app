# Platform work

Read [architecture](../../docs/architecture.md), [sync screen behavior](../../docs/screens/sync-and-conflicts.md), and affected product rules.

Persistence/network/sync/file/secure-storage integrations serve domain interfaces. They do not decide rent allocation, automatic waiver/refund, or tenancy closure policy.

Assign one writer to migrations and to each shared sync/transport contract. Feature writes and queued operations persist consistently before success; retries keep stable operation identity. Financial conflicts/rejections and new-file retention remain explicit.

Keep authorization and private-record context throughout adapters and logs. Do not select a provider/version or claim secure storage, background delivery, backup, or restore works without implementation evidence.

Current SQLite schema version 2 contains `device_preferences` and `properties`. Migration preserves existing locale data. Properties owns parameterized house reads/writes; platform owns connection and migrations. Local save means saved on this installation. Financial tables, endpoints, sync, backup and secure storage remain future work.

