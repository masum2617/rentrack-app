# Shared electricity

Owner: src/features/electricity. Read [domain guide](../domains/electricity.md) and [single financial source](../architecture.md#one-financial-source).

## Workspace and entry

Property → main meter → explicit billing period. Show linked household rows with Reading needed / Ready to review / Finalized context. Meter/submeter setup and reassignment need forms in this family, but their unresolved policies remain visible.

Reading entry shows household, previous/current readings, difference, applied per-kWh rate and charge together. Save & next persists the current entry before advancing. Skip retains incompleteness; missing is never zero.

Contribution form records household, meter, amount, actual date and optional reference. It is distinct from a landlord cash receipt. Rate settings identify effective period and preserve finalized historical rates.

Review shows consumption charge, brought-forward credit, contributions/applications and resulting electricity due or credit. Post/link results once to the monthly bill. Record collection reuses [payment entry](payments-and-receipts.md) scoped to the existing charge.

## States and checks

Reading below previous value gives an inline error and retains input; do not silently assume a reset. A rate change, conflicting readings and device-level pending work have explicit states. A calculated due/refund is not proof of actual settlement.

Acceptance: A03–A06, A14, A17–A18, A21–A23. Example: 11,200 − 11,131 = 69; ×8 = 552; 500 contributed →52 due. Separately, 1,000 contributed →448 credit. Never combine those alternative samples.

Cutoffs, mid-period rates, reset/rollover/replacement, reassignment and departure credit remain open; granted helper rights control entry/review actions.

