---
status: accepted
---

# Prefer an offline mobile client while retaining the familiar server stack

The application requires Android and iOS operation with offline calculations, payments, readings, and queued image uploads; desktop is optional. We chose React Native with Expo and local SQLite, connected through a Spring Boot API to PostgreSQL and private object storage. The deciding trade-off is direct control over a local database and pending document files for offline financial entry, accepting mobile build and distribution work; a PWA could implement the same business features but adds browser storage policies to this critical workflow. Reusing the owner's React and Java experience supports the choice but is not its product justification.

The owner confirmed this stack on 2026-10-23. This is an architectural judgment, not a measured claim that the native app is already more reliable; offline behavior and recovery still require device testing.

## Considered options

- React PWA with IndexedDB and service-worker caching: closest to existing frontend experience, straightforward web distribution, and desktop access. Offline operation is feasible, but browser persistence policies and device behavior require deliberate handling and testing. This remains a valid alternative if web delivery and lower initial learning cost become the priority.
- React Native with Expo and SQLite: introduces mobile components, permissions, builds, signing, and native distribution. It offers direct mobile database/file integration for the primary offline workflow. SQLite is local storage, not a synchronization service.
- Changing the backend or adopting MongoDB: no current requirement justifies the additional learning. A single Spring Boot service and relational PostgreSQL model fit the linked tenancy, charge, payment-allocation, and reporting records. MongoDB supports transactions and is technically viable; the recommendation is about fit and familiarity, not an inability to handle payments.

## Consequences

Both clients need explicit synchronization, retry deduplication, conflict handling, and consistent calculation rules. Native background execution is scheduled by the operating system and cannot guarantee immediate synchronization while closed. Local storage needs recovery planning; it is not a substitute for backup. The client synchronizes application records through the API, rather than directly replicating SQLite files into PostgreSQL.

The choice should be revisited if a small offline workflow on the owner's actual Android and iOS devices shows that native installation or maintenance outweighs the local-storage benefits. No such device validation has happened yet.

## Sources

- [React Native components](https://reactnative.dev/docs/intro-react-native-components)
- [Expo introduction](https://docs.expo.dev/get-started/introduction/)
- [Expo SQLite](https://docs.expo.dev/versions/latest/sdk/sqlite/)
- [PWA offline data](https://web.dev/learn/pwa/offline-data)
- [WebKit persistence policy](https://webkit.org/blog/14403/updates-to-storage-policy/)
- [Expo background tasks](https://docs.expo.dev/versions/latest/sdk/background-task/)
- [PostgreSQL foreign keys](https://www.postgresql.org/docs/current/tutorial-fk.html)
- [MongoDB transactions](https://www.mongodb.com/docs/manual/core/transactions/)
