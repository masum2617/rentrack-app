# Work items

The current implementation includes the bilingual Home demo, local language preference, mobile run/APK workflow and Step 5 local house records. Dated evidence and limits live in the delivery log.

| Task | Status | Owner | Dependency |
|---|---|---|---|
| [First runnable Home and local preference](home-foundation.md) | Steps 1–3 implemented and verified | Main implementation thread | Home remains a labeled financial demo |
| [Local property list and form](local-properties.md) | Step 5 implemented; Android workflow verified | Main implementation thread | Extended by Step 6A below; units/backend remain deferred |
| [House details and local floors](local-floors.md) | Step 6A implemented; evidence in delivery log | Main implementation thread | Unit records and backend remain deferred |

The coordinator creates one short task file per substantive slice using [the template](../templates/feature-task.md). Use a descriptive stable name such as payment-allocation.md; assign an explicit owner and allowed paths.

Only the coordinator edits this index during parallel work. Contributors update their own task file. Add a linked row with status, owner, and dependencies when a real task is assigned; avoid maintaining a second copy of the specification here.


- [Step 7: local tenants](local-tenants.md) — independent identity, directory/search and shared Add/Edit form; verification status is recorded there.

- [Step 8: local tenancies](local-tenancies.md) — unit details, existing-tenant setup, exact terms, corrections and occupancy; native/test verification pending.

- [Occupancy summaries and tenant context](occupancy-context.md) — Step 8 follow-up: active locations, rented-unit counts, linked editor and residence duration; static checks only.

- [Step 9A: local rent bills](local-rent-bills.md) — persistent drafts, review/finalize, void/reissue and derived rent dues; static checks only.

- [Step 9B: additional charges](additional-charges.md) — effective-month settings, fixed/manual proposals, one-offs and derived all-line dues; static checks only.

- [Step 10A: local payments](local-payments.md) — recorded money, allocation, receipt/history, reversal and shared remaining balances; cases/native acceptance pending.

- [Step 10B: live Home](live-home.md) — SQLite summaries, real filters/attention and scoped Home payment entry; regression/native acceptance pending.
