# Occupancy summaries and tenant tenancy context

Date: 28 October 2026. Approved follow-up to Step 8. Source implemented; native acceptance and test-case execution remain pending.

## User-visible result

- Tenant list rows show every active building on its own line, followed by labeled floor/unit values on one wrapping row beneath contact details; people with no open rental show an explicit no-active-tenancy message.
- Edit tenant and clickable tenant names on floor-unit cards/Unit details open the same editable identity form by tenant ID. A read-only Current tenancies section above the fields shows each location, start month/year and completed residence duration. From a unit, that rental is listed first and marked selected. Other active rentals remain visible.
- House list counts share a wrapping row: floors · units · rented units. Rented count means units with open tenancies, not distinct people.
- Floor cards show total/rented units and distinguish no units, vacant, partly rented and fully rented. Each active unit/tenant pair is informational; Open floor and Edit remain separate.
- Unit occupancy status and tenant-name link share a wrapping row. Open unit, Edit unit and Open tenant are sibling actions with accessible names and comfortable targets. Tenant identity edits never reassign a unit or change rental terms.

## Read models and refresh

`listActiveRentals` joins tenancies → tenant/unit → floor → house, with optional tenant/house scopes and `ended_on IS NULL`. `listFloorOccupancy` includes unit name and tenant ID. Property/floor summary queries derive actual unit counts; existing record readers remain compatible. `tenantReadModel` batches identity/rental queries and groups active rentals by person; no query runs per rendered card. `getTenant` resolves ID-based editing without trusting a list snapshot or looking up a person by name.

TenantForm owns one native Modal through loading/error/editing. Its loaded body owns draft state, validation, retry and dirty Back; an imperative ref delegates Android Back without swapping nested Modals. Failed initial reads show Retry, and missing IDs show explicit feedback. Failed saves preserve entered identity values. No rentals are changed by the identity store.

Mounted tenant-directory reads depend on both tenant and property revisions. Existing saves refresh property views too, so tenancy creation/correction and name/location edits are reread on affected screens. Opening the editor always reloads SQLite. No database columns, counters, dependencies, migration or native rebuild were added; schema remains v8.

## Duration convention

Calculate each open tenancy separately from its exact local-calendar start date. Completed months use clamped month-end anniversaries: Jan 31 → Feb 28 is one month in a non-leap year. Under one month gets an explicit message; otherwise show months, or years plus remaining months, omitting zero parts. Recalculate when the editor mounts or app resumes. Invalid/future date input produces unavailable-duration feedback; do not invent continuous building history across rentals. Start month/year uses the stored calendar date. Language resources cover Bangla and English, including singular duration words.

## Evidence and remaining checks

TypeScript, regression-file syntax and diff-whitespace checks pass. Independent read-only review found no actionable findings. `tests/occupancy-context.test.mjs` has cases for zero/vacant/partial/full counts, multi-unit/multi-house tenants, closed rentals, ID-based editor selection, renames, untouched tenancy terms and calendar boundaries. The expanded occupancy shape is reflected in the earlier tenancy test. No test case, native layout/touch/navigation/screen-reader check, build or APK generation was executed for this follow-up.

When authorized, check both languages, long names, narrow/enlarged-text wrapping, each tenant-name link, selected rental first, readonly context, failed reads/retry, dirty Android/visible Back and failed-save retention. Confirm mounted lists refresh after all relevant edits. Financial postings, tenancy ending/history UI, reassignment, backend, sync and Figma remain outside this task. Home finances remain labeled demo data.

[External learning lesson](../../../learning-notes/12-occupancy-read-models.md). Next planned feature remains Step 9 bills and dues.

## UI refinement — 28 October 2026

Replaced visible arrow paths in tenant list/form with the labeled location component. Floor rows now show Unit and Rented by on separate lines. Tenant links read “ভাড়া আছেন: {name}” in compact rounded green controls without underlines. Shared EditButton replaces text Edit actions with a 52px contextual pencil; form titles remain descriptive. No queries, IDs, duration calculation, saved input, navigation or schema changed. TypeScript/static review passed; no test cases, native acceptance or builds were executed for this refinement.
