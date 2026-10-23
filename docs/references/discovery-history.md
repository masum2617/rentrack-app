> Historical reference, retained on 23 October 2026. Working requirements and guidance are indexed in [the documentation index](../README.md). This record is not a competing specification.

# House rent tracker discovery

The consolidated requirements baseline is `docs/requirements-analysis.md`. On 23 October 2026, the owner put Figma work on hold and requested the full requirements analysis before further design or implementation.

Later on 23 October 2026, the owner approved Direction A, Warm Ledger. They confirmed a complete Bangla/English app with Bangla selected by default, and emphasized easy navigation for younger users and adults aged approximately 45–70. The updated UX specification is `docs/ux-design-proposal.md`; no application implementation or Figma edits have been performed for this refinement.

## Confirmed requirements

- Start with the owner's own properties; allow for future use by other landlords without committing to a subscription product now.
- Use the approved Warm Ledger visual direction. Provide all app-controlled interface content in Bangla and English, with Bangla selected by default and a persistent, offline language switch.
- Design for younger adults and adults aged approximately 45–70: readable scalable text, clear labeled actions, large touch targets, predictable navigation, and short routine workflows. Preserve all agreed business capabilities without exposing every option at once.
- The owner and explicitly authorized helpers operate the initial release. Tenant accounts are deferred; statements and receipts can be provided without tenant login.
- Distinguish properties, rental units, tenants, and tenancies. Ending a tenancy preserves identity records, documents, charges, payments, and outstanding balances.
- Store identity details and documents, supporting camera capture and existing-file uploads.
- Track monthly rent, electricity, water, service charges, additional charges, dues, and rent paid early.
- Record submeter consumption separately from main prepaid meter recharges and who funded them. Monthly household electricity cost is (current submeter reading minus previous reading) multiplied by the per-kWh rate, with no extra electricity charges in the described workflow.
- A family reports each main-meter recharge with its amount and date; example amounts are BDT 500 and BDT 1,000. The owner calculates household consumption costs at month-end.
- Initial advance is held for notice-period rent. The usual example is two months of rent paid before occupancy, used during a two-month departure notice. The owner can accept a smaller initial advance, such as one month.
- A family can also pay the current and future month's rent together during the tenancy. This ordinary rent prepayment is separate from the initial notice-period advance.
- Rent increases do not change the original advance already held. Any difference at departure can be collected or waived by the owner.
- Unpaid amounts may remain outstanding until departure with the owner's permission; the owner can also waive an amount.
- Payment allocation suggests oldest dues first, but the owner can explicitly choose the covered month and charges, leaving earlier amounts outstanding.
- Waivers and corrections preserve the original charge and record the amount, date, responsible person, and reason. Helpers require owner approval to waive money.
- Notice duration and initial advance are independent tenancy terms. Accepting a smaller advance does not automatically shorten notice.
- Departure triggers an owner-reviewed settlement showing unpaid charges, remaining advance, any shortage or refund, and approved adjustments, including departures without full notice.
- Electricity recharge contributions offset the contributing household's electricity charge. Excess contributions carry forward as electricity credit, separate from rent advance.
- Electricity settlement is owner-managed. Calculating a balance alone does not record a collection or refund; actual settlements are recorded separately.
- The owner enters the per-kWh rate for each shared main meter. Finalized monthly electricity calculations retain the rate used when later rates change.
- Bills follow calendar months with a configurable due date per tenancy. Partial-month rent uses a proposed prorated amount reviewed by the owner before finalizing. Payments may be early, late, or on irregular dates; their actual dates are distinct from bill due dates.
- All rent calculations, dues, and payment records must work offline, with synchronization when connectivity permits.
- Conflicting offline edits require review. Separately recorded payments are preserved, with possible duplicates flagged for review.
- Existing identity-document images are kept offline only when explicitly selected. Newly captured uploads remain queued locally until successfully uploaded, with upload status visible.
- Android and iOS are primary targets. Desktop is optional.
- Non-electric recurring charges use configurable fixed amounts per tenancy, with one-off charges supported. Changes take effect from a selected month without rewriting old bills.
- First-release outputs include monthly statements, payment receipts, summaries of billed amounts/collections/dues/vacancies by property and overall, PDF sharing, and CSV export.
- Payments are recorded manually with cash, bank, or mobile-wallet method; payment-gateway integration is deferred.
- Tenant details include required name and optional phone, identification type/number, address, emergency contact, notes, and multiple labeled documents/photos. Rental terms belong to the tenancy.
- Existing rentals can start from dated opening balances for dues, notice-period advance, and electricity credit, without reconstructing all prior months.
- Initial sign-in requires internet. Subsequent offline access uses an app PIN or biometrics; helpers have individual accounts scoped to assigned properties. The offline authorization duration remains undecided.

## Next decisions

- Define recovery of synchronized data on another device and handling of unsynchronized data in backups.
- Choose how long previously authorized offline access remains valid.

## Validated electricity example

- Previous submeter reading: 11,131 kWh.
- Current submeter reading: 11,200 kWh.
- Consumption: 69 kWh.
- Example rate supplied by the owner: BDT 8 per kWh.
- Electricity charge: BDT 552, without extra charges.
- BDT 8 is an illustrative input, not a verified government tariff.
- No recharge total for this specific household and month has been supplied, so a net settlement amount cannot yet be calculated.
- Accepted settlement examples for a BDT 552 electricity charge: BDT 500 contributed leaves BDT 52 due; BDT 1,000 contributed leaves BDT 448 electricity credit carried forward. These are illustrative scenarios, not supplied transaction history.

## Accepted technology direction

The owner selected a clickable Figma design as the first prototype, before runnable Expo implementation. The design file and walkthrough are documented in `prototype/README.md`. Its 56 screens use fictional, prefilled snapshots and simulated device/server states; it does not validate native offline persistence or synchronization.

On 2026-10-23, the owner confirmed React Native with Expo and local SQLite, backed by Spring Boot and PostgreSQL. Private file storage remains part of the accepted direction. See accepted ADR 0001 for the PWA trade-off: more direct control over local offline records and files in exchange for mobile build and distribution work. A PWA remains technically capable of the business workflows; this decision is not based on a claim that offline operation requires native.

Local storage does not provide automatic synchronization. The proposed behavior is to save locally, synchronize while open and on launch/resume, attempt background work when the operating system permits, and display pending or conflicting changes. No guarantee of immediate synchronization while the app is closed has been agreed.
