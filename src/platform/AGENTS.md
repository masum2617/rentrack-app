# Platform work

Read [architecture](../../docs/architecture.md), [sync screen behavior](../../docs/screens/sync-and-conflicts.md), and affected product rules.

Persistence/network/sync/file/secure-storage integrations serve domain interfaces. They do not decide rent allocation, automatic waiver/refund, or tenancy closure policy.

Assign one writer to migrations and to each shared sync/transport contract. Feature writes and queued operations persist consistently before success; retries keep stable operation identity. Financial conflicts/rejections and new-file retention remain explicit.

Keep authorization and private-record context throughout adapters and logs. Do not select a provider/version or claim secure storage, background delivery, backup, or restore works without implementation evidence.

Current SQLite schema v11 appends payments and allocations to the existing v10 charge/bill graph. Preserve prior data/migrations. App opening configures dedicated write connections with foreign keys before BEGIN IMMEDIATE; Expo's default exclusive child connection does not inherit main-connection PRAGMAs. Use the configured transaction entry point for atomic multi-statement writes. Ledger owns bill transitions/snapshots/dues; tenancy correction coordinates its finalized-bill guard. Read [rent bills](../../docs/work-items/local-rent-bills.md) for policy and pending native/test verification. Ledger payment creation/reversal and bill void checks share this transaction boundary. Backend/sync remain unimplemented. Read [local payments](../../docs/work-items/local-payments.md) before changing allocations or receipt persistence.
