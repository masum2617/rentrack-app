# Step 9A — Local monthly rent bills and dues

Date: 28 October 2026. Source implementation; regression and native acceptance remain unexecuted by instruction.

## Implemented flow

Unit details → Bills → Create/Edit draft → Save draft → Bill detail/review → Confirm finalization. Ledger now browses the same bills across properties/months, defaulting to all properties/all months and hiding voided versions. Include voided is explicit. Shared screens preserve list filters/scroll; full-screen draft/void forms cover tabs. Unit details reads finalized rent outstanding and disables setup corrections while any finalized bill exists. No payment/receipt action or Paid toggle is invented.

## Confirmed calculation and review policy

- Select any month from tenancy start through current local month; no future billing or automatic historical generation.
- Full months use the stored monthly rent without rounding its existing paisa. First partial month includes start date through calendar month-end, divided by actual days. Round only that calculated proposal to nearest whole taka, half upward, using integer arithmetic.
- Reviewed amount is nonnegative, supports two decimals and requires a reason when different from the preserved proposal. Zero finalized charge means no dues, not cash paid.
- Due day stays in the billed month, clamped only to month-end when absent. Oct 16 start/day 10 produces an Oct 16–31 bill due Oct 10; November is a separate bill due Nov 10. No late fee.
- Historical proposals reference current stored rent, not reconstructed historical rates. The form explains this and permits reviewed historical overrides with reason.

## Persistence and state

Schema v9 adds bill headers and bill lines. This slice creates one rent line. A partial unique index permits one current draft/finalized bill per tenancy/month; voided versions remain preserved. Headers snapshot coverage, due/source values, calculation rule and lifecycle timestamps. Lines snapshot reference/proposed/reviewed integer paisa and override reason. Drafts persist but are excluded from dues; they may be edited/discarded. Save is transactional so header/line writes cannot leave a partial saved draft.

Finalization rechecks the complete source-term signature and proposal, refuses stale drafts and records immutable financial snapshots. Repeated finalization is idempotent. Void requires reason/confirmation, preserves original amounts/finalization and excludes the version from dues; reissue starts a new unfinalized draft with a new ID. Finalized bills cannot be directly edited/discarded. Draft and failed-write values remain in the form. Duplicate month, missing/read/error/retry and unsafe-money states are explicit.

Ledger readers own outstanding projections and ignore draft/void charges. Portfolio filters scope the shown total; Unit details reads only its tenancy. No separate editable balance is stored. Safe BigInt-backed aggregation rejects unsupported totals instead of displaying rounded money. Step 9B must extend totals across additional lines; Step 10 must integrate payment allocations into this same projection and guard voids with allocations.

## Transaction connection correction

Installed Expo's exclusive helper opens another connection; a main-connection foreign-key PRAGMA does not initialize that child. App database opening now configures the exclusive-transaction entry point to open a dedicated connection to the same path, enable foreign keys/busy timeout before BEGIN IMMEDIATE, then commit/rollback/close. Domain stores keep their small SQL interface. Main-connection foreign keys are enabled by migration as before. This applies to migration and financial transactions without changing native dependencies. Native isolation/concurrency behavior remains unverified.

Tenancy correction uses the same serialized transaction plus Ledger's finalized-bill guard. Any non-void finalized bill, including zero charges, blocks setup correction in UI/storage. Voiding all such bills unlocks correction; previous bill snapshots stay unchanged.

## Interfaces and checks

Ledger owns proposal calculation, reviewed validation, draft save/read/discard, finalize, void, lists and exact outstanding totals under `src/features/ledger/`. Billing choices use year/month lists without a native picker dependency. Bill card announcements include tenant, house/floor/unit, status, amount and due date. Existing Edit icon, labeled location and readable green/white controls are reused. Both app languages are complete.

TypeScript, authored regression syntax and diff whitespace checks passed. Independent static review found and then cleared the card-announcement issue; the discovered per-connection foreign-key gap was corrected and follow-up review found no further blockers. No test case, native interaction, v9 device migration/restart, screen-reader, build or APK verification was executed. Existing clients need a full close/reopen for startup schema/configuration; a native rebuild is not required.

Authored cases cover inclusive/leap proration, whole-taka ties/zero, full-rent precision, due-day fallback/October example, month eligibility, reason/range validation, v8 preservation, persistent drafts, uniqueness, repeated finalization, immutable values, void/reissue, tenancy locks, stale drafts, scope totals and injected rollback/FK setup. They are pending execution, not passing evidence.

## Boundaries and next

No additional charges, opening balances, payment/advance applications, receipts, automatic generation, tenancy ending, backend/sync or Figma. Home financial figures remain demo fixtures. Next is Step 9B additional charges/openings, then Step 10 allocations/receipts. Agree remaining opening/charge policies before their code.

[Separate learning lesson](../../../learning-notes/13-monthly-rent-bills.md).
