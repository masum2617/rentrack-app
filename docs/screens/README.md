# Screen specifications and coverage

Screen families group related screens/forms/states; they do not lock production route count or reproduce Figma frames. Each family has one task owner at a time. Shared foundations are owned through [agent workflow](../agent-workflow.md).

## Common contract for every screen

Read its family spec, owning domain and affected requirements, plus [design](../design-system.md), [navigation](../navigation.md) and [localization/accessibility](../localization-accessibility.md). Business rules are not redefined by a screenshot.

Specify purpose, entry context, displayed facts, primary action, mutation owner, allowed roles, return path and applicable states. Every screen distinguishes no records, no matches, loading, unavailable offline, local save, sync failure/rejection/conflict, validation and success where relevant; do not invent irrelevant network dependencies for a local-only read.

Forms retain input on error. Long workflows preserve explicitly labeled drafts. Financial facts remain separate from device status. A hidden control is not authorization. Use truthful local data and typed fixtures only during explicitly requested UI-only work; fixtures are not persisted production records or an API contract.

## Coverage of original planning inventory

| Screen family | Original frames | Main feature owner |
|---|---|---|
| [Home](home.md) | S04, S51; S55/S56 are historical alternatives | home |
| [Properties and units](properties-and-units.md) | S05–S09, S41 | properties |
| [Tenants and documents](tenants-and-documents.md) | S10–S16 | tenants |
| [Tenancy setup and terms](tenancy-setup-and-terms.md) | S17–S21, S34, S54 | tenancies, with Ledger for monetary facts |
| [Bills and ledger](bills-and-ledger.md) | S22–S24, financial adjustment S38 | ledger |
| [Payments and receipts](payments-and-receipts.md) | S25–S27, S35, shared flows S32/S39 | ledger |
| [Electricity](electricity.md) | S28–S33, S52–S53 | electricity |
| [Notice and departure](notice-and-departure.md) | S36–S40 | tenancies coordinating Ledger/Electricity |
| [Reports and statements](reports-and-statements.md) | S42–S44 | reports |
| [Access and settings](access-and-settings.md) | S02–S03, S45–S47 | access/settings |
| [Sync and conflicts](sync-and-conflicts.md) | S48–S50 | platform/sync, with source-feature review |

S01 is a prototype-only guide, not an application requirement. S51 empty portfolio belongs to the relevant Home/Properties state. S52 is validation, not a route. Shared payment and adjustment flows are intentionally referenced by several families, not implemented several times.

Coverage gaps from requirements §6 remain explicit: real document viewer; meter/submeter setup/reassignment; refunds/reversals; correction history; recovery/restore; offline expiry. Their family files identify placement, but open business policies are not settled by adding a row to this index.

Use [the screen template](../templates/screen-spec.md) for a genuinely new family; extend an existing family for a related state.

