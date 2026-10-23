# Focused preview checks

Run `npm test` from the app root with the pinned Node version. Node’s built-in test runner strips TypeScript for the pure fixture and formatting functions; no test framework is required.

`home-preview.test.mjs` verifies the reviewed October totals, property scope/counts, month changes without redefining all-month outstanding, and explicit Bangla digits/grouping. These checks do not prove real ledger calculations, SQLite persistence or native interaction. Native evidence is in docs/evidence/step-2. Node may print a harmless module-type inference warning for imported TypeScript; app module configuration is unchanged.

integration/ remains reserved for future cross-feature/offline tests.
