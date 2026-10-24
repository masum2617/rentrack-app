# Focused preview checks

Run `npm test` from the app root with the pinned Node version. Node’s built-in test runner strips TypeScript for the pure fixture and formatting functions; no test framework is required.

`home-preview.test.mjs` verifies the reviewed October totals, property scope/counts, month changes without redefining all-month outstanding, and explicit Bangla digits/grouping. `language-preference.test.mjs` uses a real local SQLite engine through an async-shaped adapter to test first migration/default Bangla, close/reopen persistence, one-row upsert behavior, rejected writes, schema constraints and safe failure against a newer database version. These checks do not prove real ledger calculations or native interaction. Native restart evidence is in `docs/evidence/step-3`. Node may print an experimental SQLite warning and a module-type inference warning for imported TypeScript; app module configuration is unchanged.

integration/ remains reserved for future cross-feature/offline tests.
