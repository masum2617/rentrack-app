# Step 10B — Live SQLite Home

Date: 29 October 2026. Source implemented; regression execution and native acceptance remain pending.

## Delivered behavior

Home no longer reads presentation fixtures or responds to the old More demo/empty switch. Property options come from stored houses; months cover the earliest stored bill/receipt month through the current local month, including zero-activity gaps. Defaults are all properties and current month. Bangla remains default and English is complete; existing green/white layout, soft cards, adaptive header and compact language selector are retained.

Financial definitions are explicit:

- Outstanding: all-month finalized non-void charges minus recorded payment allocations for the selected property scope, using Ledger's existing projection.
- Billed: gross finalized non-void charges whose billing month is selected. Payment does not reduce this measure.
- Received: recorded, non-reversed payment amounts whose actual receipt date falls in the selected calendar month, scoped to their property's stable parent relationship. Allocation month does not determine collection month.
- Occupied/vacant: current open-tenancy occupancy and actual units from property summaries; independent of financial month.

Reversal removes the payment from its original receipt-month collections and restores affected charge balances. The measures are not a billed-minus-received equation: one month can collect earlier bills. No advance, credit, electricity, opening balance, expense or server state is inferred.

## Actions and state

Record payment opens a searchable tenancy chooser scoped to the selected property, across all months. People renting multiple units remain separate tenancy choices, with house/floor/unit and remaining dues visible. The chosen stable tenancy ID opens the existing PaymentForm, then existing receipt presentation. Receipt Back closes to Home. Cancelling a payment uses its existing dirty guard and returns to the chooser. Home reads can refresh/fail while the payment/receipt stays mounted outside the summary's ready branch.

Outstanding/overdue shortcuts open Ledger with selected property and all-month status filters; Draft opens the selected property/month's drafts. A new Home shortcut intentionally initializes a new filter request. Ordinary Ledger tab return and Bill-detail Back preserve that request's local filters and scroll. Ledger adds an explicit status choice and retains requested zero-result months in its month picker.

No houses shows real onboarding. Houses but no finalized bills for a month show next-step guidance and Open properties. Zero activity uses actual zero figures. Read/aggregate errors hide the financial figures and show Retry; they never become synthetic zeros. Missing property scope has an explicit all-properties recovery action. Counts and money refresh after shared revisions, navigation focus and app resume; filters remain selected. Payment entry is disabled with an explanation when scoped finalized dues are zero.

## Ownership and consistency

Home composes Property summaries and Ledger bill/payment-activity readers. It does not mutate financial rows or duplicate current balances. `readHomeData` uses the existing configured dedicated transaction as a short consistent read snapshot, so all related reads see one committed state. It writes no records; its BEGIN IMMEDIATE briefly serializes competing writers. `homeSummary` derives exact safe paisa totals and `homeMonths` derives period choices. Portfolio reads are batched rather than requested per card/tenancy.

Ledger owns `matchesBillScope` and the narrow payment-activity projection. AppNavigator owns shared revisions and fresh Home→Ledger requests; LedgerNavigator mounts a list key only when a new explicit request arrives. HomePaymentFlow retains its opening candidate list; the existing payment loader/writer rechecks actual current dues before money can be recorded.

Schema stays v11. No migration, new dependency, native rebuild, backend/sync or Figma action is required. Reload the development app to see source changes; existing data is preserved.

## Verification evidence and limits

TypeScript and independent static review are the permitted source checks. Review found no concrete correctness/data-loss issue in date scopes, balances, filtering or open-form preservation; follow-up reviewed authored fixture arithmetic and interfaces. Final command evidence is in the delivery log.

Nine authored Home cases cover empty records, real property/occupancy scopes, billing-versus-receipt month, reversal/draft/void exclusion, tenancy grouping/search/renames, Ledger shortcut filters, cross-year month gaps, read failure and unsafe/future values. Obsolete fixture assertions were removed; the independent digit-formatting case remains. No regression cases were executed.

Native acceptance remains pending: initial/read-error states, both languages, keyboard and dirty form navigation, property/month choices, narrow/enlarged text, screen readers, Home→Ledger filter/scroll behavior, payment→receipt→Home, reversal refresh and app-resume/restart persistence. No build/device/APK success is claimed. Next checkpoint is owner review and an authorized end-to-end device/APK acceptance slice.

[External learning lesson](../../../learning-notes/16-live-home-dashboard.md).
