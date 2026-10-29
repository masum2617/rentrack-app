# Properties and units

Owner: src/features/properties. Read [domain guide](../domains/properties.md). Purpose: find the right building/unit and understand its occupancy.

## Screens and actions

Implemented through Step 6A: whole-house list with search and real floor totals, tappable identity and separate Edit; house details with named-floor list; shared house form and shared one-name floor form. New-house Save opens details; edits return to their origin. Floor Save commits locally before returning to updated house details. Parent house context is inherited and read-only. Empty, loading, missing records and retry remain distinct; errors preserve input, and dirty Back asks to discard. Tabs remain visible for list/details and are hidden by forms. Units have an explicit next-step message rather than a false count or working destination. The broader screen inventory below describes later scope.

- Property list: name/location, occupied/vacant counts and clear selection; Add property for setup.
- Property detail: identity, unit list and direct Electricity entry. Unit labels distinguish floors/locations.
- Unit detail: current tenancy/tenant and useful financial summary; Open tenancy / Record payment if occupied, Start tenancy if vacant. Preserve past tenancy history.
- Property form: name/location and optional address, with no notes field. Later, named floors belong to a house and units belong to a selected floor. Unit details hold structured room/bathroom/balcony counts, size and optional notes. Reuse each form for edits.

Use operational text before optional photography. A property is not assigned one apartment's monthly rent. Start tenancy invokes [setup](tenancy-setup-and-terms.md); it does not independently overwrite occupancy.

## State and role coverage

Empty portfolio → Add property; empty building → Add unit; vacant unit → Start tenancy; past occupancy remains available. Search distinguishes no matches from no properties. Helpers only use assigned property records and permitted mutations. Local changes show pending status and remain after restart when implemented.

Acceptance: A01, A02, A13, A16. New-device offline unavailability needs an explanation. Future reservations, overlaps, maintenance/unavailable states, and destructive property/unit lifecycle need explicit rules before those actions are added.


## Step 8 current unit workflow

The earlier units-unavailable baseline is historical. Units now have working layout forms and an ID-based details route. Floor rows show derived vacant/occupied status/current tenant; unit identity opens details while Edit remains separate. Unit details shows inherited house/floor/location, layout, optional notes and current terms or Start tenancy. It invokes the Tenancies interface and does not edit an independent occupancy flag. Financial summaries and ending/history UI remain future scope.

## Occupancy summary follow-up

House list summaries are one wrapping row of floor/unit/rented-unit counts. Floor cards distinguish empty-unit setup, no rented units, partial rental and full rental, with all active unit/tenant pairs displayed as information. Unit rows place the current tenant name beside occupancy status as a separate accessible link. Unit details exposes the same link. Both open the ID-based tenant editor above the existing origin, without changing rental assignments. See [work item](../work-items/occupancy-context.md) for checks and calendar-duration rules.

## Current occupancy controls

Floor rental pairs use separate “Unit: …” and “Rented by: …” lines. Unit tenant links are compact rounded green controls reading “ভাড়া আছেন: {name}”, without underlines. House, floor, unit and tenant Edit actions use shared contextual pencil buttons; Unit details places the rental-terms pencil beside the terms heading. Existing actions and ID-based links remain unchanged.

## Step 10A Unit details

Current tenancy balances use the common Ledger outstanding projection after payment allocations. Record payment is available for positive finalized dues; Payment history remains reachable at zero balance. Success/reversal increments the shared revision and refreshes mounted unit and bill views. History/receipt routes retain the originating Properties stack and IDs. [Work item](../work-items/local-payments.md).
