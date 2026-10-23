# Properties and units

Owner: src/features/properties. Read [domain guide](../domains/properties.md). Purpose: find the right building/unit and understand its occupancy.

## Screens and actions

- Property list: name/location, occupied/vacant counts and clear selection; Add property for setup.
- Property detail: identity, unit list and direct Electricity entry. Unit labels distinguish floors/locations.
- Unit detail: current tenancy/tenant and useful financial summary; Open tenancy / Record payment if occupied, Start tenancy if vacant. Preserve past tenancy history.
- Property form: name/location and optional address/notes. Unit form: label, parent property and optional floor/notes. Reuse the form appropriately for edits.

Use operational text before optional photography. A property is not assigned one apartment's monthly rent. Start tenancy invokes [setup](tenancy-setup-and-terms.md); it does not independently overwrite occupancy.

## State and role coverage

Empty portfolio → Add property; empty building → Add unit; vacant unit → Start tenancy; past occupancy remains available. Search distinguishes no matches from no properties. Helpers only use assigned property records and permitted mutations. Local changes show pending status and remain after restart when implemented.

Acceptance: A01, A02, A13, A16. New-device offline unavailability needs an explanation. Future reservations, overlaps, maintenance/unavailable states, and destructive property/unit lifecycle need explicit rules before those actions are added.

