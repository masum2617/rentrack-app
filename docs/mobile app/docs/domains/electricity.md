# Electricity domain

Owner path: src/features/electricity. Source rules: product requirements §5.6.

Own main/submeter configuration, household association, reading source records, configured per-kWh rate, recharge source records, and consumption assessments. Consumption is current minus previous; cost is consumption × applied rate. No additional fee/loss/tax/slab rule is agreed.

Contributions record household, meter, actual date and amount separately from consumption. Household credit carries to electricity only. Example assessments and alternative credits are in requirements §8 and acceptance A03–A06.

The posted bill and electricity views share Ledger results through the [architecture agreement](../architecture.md#one-financial-source). Maintain source-to-posting identity so contributions/assessments apply once. Electricity collections reuse the common payment/allocation flow against the same charge; calculated due/refund is not an actual settlement.

[Screens](../screens/electricity.md). Acceptance A03–A06, A14, A17–A18. Missing reading is incomplete, not zero. Month cutoffs, mid-period rate changes, reassignment, meter reset/replacement/rollover and final credit at departure require policy decisions.

