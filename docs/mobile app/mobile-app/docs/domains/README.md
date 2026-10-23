# Domain reading map

These are module ownership guides, not independent financial engines or a microservice design. Business authority remains [product requirements](../product-requirements.md); terminology remains [glossary](../../GLOSSARY.md).

| Work | Read |
|---|---|
| Buildings, units, occupancy | [Properties](properties.md) |
| Identity and documents | [Tenants](tenants.md) |
| Rental terms, opening setup, notice/departure | [Tenancies](tenancies.md) |
| Bills, receipts, allocations, balances and adjustments | [Ledger](ledger.md) |
| Main/submeters, readings, recharges, consumption | [Electricity](electricity.md) |
| Owner/helper authorization and offline access | [Access](access.md) |
| Statements, reports, export | [Reporting](reporting.md) |

Home composes these read models; Settings composes locale/account/device controls. Cross-feature financial coordination follows [architecture](../architecture.md), not private table writes or copied formulas.

