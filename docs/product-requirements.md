# House Rent Tracker — Product requirements

Date: 23 October 2026  
Scope: agreed first release  
Status: consolidated discussion baseline; Warm Ledger direction approved; no application implementation

This document consolidates the owner's confirmed requirements and technology decisions. Direction A, Warm Ledger, is approved, with Bangla as the default language, full English support, and straightforward use for younger adults and people aged approximately 45–70. The screen catalogue describes the existing planning inventory, not approved production layouts or a requirement for 56 separate application routes. The working design guidance is in `docs/design-system.md`, `docs/navigation.md`, and `docs/localization-accessibility.md`. The old prototype remains historical; a separate [Home-only Figma draft](design/home-review.md) is ready for color/UI review. Proposed implementation safeguards and unresolved details are identified explicitly. No production app, backend, database integration, or synchronization implementation exists yet.

## 1. Product purpose and intended audience

The application helps a landlord manage rental accommodation across multiple properties and locations. It brings together tenant identity records, rental agreements, monthly charges, collections, outstanding amounts, advance balances, shared prepaid electricity, and departure settlements.

The initial customer is the owner managing their own portfolio. It should leave room for other landlords later, but subscriptions, public landlord onboarding, SaaS administration, and tenant accounts are outside the agreed initial release.

Android and iOS are primary targets. Desktop is optional and deferred. Financial records and calculations must remain usable without internet after initial online sign-in.

The audience includes younger adults and adults aged approximately 45–70. Easy navigation, readable Bangla/English text, clear actions, and low interaction complexity are first-release requirements. Age does not imply a uniform ability level; support users with different eyesight, dexterity, and confidence using smartphones.

### Users and other participants

| Participant | Application user in v1? | Responsibilities and access |
|---|---|---|
| Owner / landlord | Yes; primary user | Manage properties, units, tenants and tenancy terms; record and review financial activity; approve waivers; review settlements; manage helpers; view their portfolio. |
| Authorized helper | Yes; secondary user | Individual account, restricted to assigned properties and permitted operations. Can support records, readings and collections within granted access. Waivers require owner approval. Exact permission granularity is still to be specified. |
| Tenant / renting household | No tenant login in v1 | Supplies identity information and documents, occupies a unit, reports recharge contributions, pays charges, and can receive receipts or statements shared by the owner. |

The tenant is a subject of records, not automatically a signed-in app user. An application account and a tenant identity are separate concepts.

## 2. Confirmed decisions

| Area | Decision |
|---|---|
| Initial product | Owner-operated management of the owner's properties, with authorized helpers. |
| Visual direction | Direction A, Warm Ledger, approved; detailed screen layouts remain to be designed. |
| Languages | Bangla and English throughout app-controlled content; Bangla selected by default. |
| Inclusive usability | Simple navigation and readable, forgiving workflows for younger adults and adults aged approximately 45–70. |
| Rental structure | Separate property, rental unit, tenant and tenancy. |
| History | Ending a tenancy preserves tenant identity, documents and financial history. |
| Billing | Calendar-month bills, configurable due date per tenancy, reviewed partial-month adjustment. |
| Collections | Manually record cash, bank and mobile-wallet payments; gateway integration deferred. |
| Flexibility | Early, late, partial, irregular-date and future-month rent payments are supported. |
| Old dues | Can remain outstanding with permission, including until departure; can be explicitly waived. |
| Allocation | Suggest oldest dues first; owner can explicitly select other months and charges. |
| Initial advance | Fixed monetary credit held for the notice period; agreed amount varies by tenancy. |
| Notice | Duration is separate from the advance amount. |
| Rent increases | Effective-dated; original advance does not change automatically. |
| Departure | Owner reviews dues, advance application, shortages, refunds and adjustments. |
| Electricity | Submeter consumption multiplied by configured per-kWh rate; no extra electricity charges in the agreed workflow. |
| Recharges | Record each contribution by contributing household, amount and date, separately from consumption cost. |
| Electricity balances | Offset the contributing household's electricity charges; carry excess forward as electricity credit. |
| Electricity settlement | Owner-managed; a calculated balance is not evidence of an actual collection or refund. |
| Offline use | Calculations, dues, readings and payment records work offline; synchronize later. |
| Documents offline | Existing documents downloaded selectively; newly captured uploads retained locally until upload confirmation. |
| Reporting | Statements, receipts, property/portfolio summaries, PDF sharing and CSV export. |
| Existing rentals | Start from dated opening balances without reconstructing all historical months. |
| Prototype | Figma design selected first, then paused at the owner's request. |

## 3. Accepted technology stack and responsibilities

| Layer | Choice | Responsibility |
|---|---|---|
| Mobile interface | React Native | Android/iOS screens, forms and navigation. |
| Mobile tooling | Expo | React Native development workflow and integrations for mobile capabilities. |
| Local structured storage | SQLite | Offline records, locally available billing data and pending changes. |
| Local files | Device application storage; implementation library not yet selected | Retain captured documents and pending uploads. |
| Backend | Java with Spring Boot | Authorization, business validation, synchronization endpoints, server records and file access. |
| Server database | PostgreSQL | Shared durable rental and financial records, relationships, reporting and history. |
| Uploaded files | Private object/file storage; provider not selected | Uploaded identity images and other tenant attachments, with controlled access. |

The mobile app communicates with Spring Boot APIs. It does not connect directly to PostgreSQL or upload a SQLite database file as its synchronization mechanism. SQLite and PostgreSQL are separate stores with different responsibilities.

Native was selected for more direct control over local financial records and pending files in an Android/iOS-first product. A PWA could support the business functions and offline use. The trade-off accepts native builds, signing and distribution work in exchange for local storage/device control. It is not based on a claim that PWAs cannot work offline or that native automatically guarantees reliability.

Spring Boot and PostgreSQL fit the linked tenancy/charge/payment records and the owner's experience. MongoDB and other backends were considered technically viable, but no current requirement justified adopting them. Framework versions, hosting, authentication provider, file-storage vendor and synchronization libraries have not been selected.

## 4. Domain model and record relationships

| Concept | Meaning | Main relationships / information |
|---|---|---|
| Property | Building or house at a location | Name, location, address/notes; contains rental units; has shared electricity arrangements. |
| Rental unit | Accommodation rented as one unit | Property, unit label, floor/notes, occupancy; has tenancy history. |
| Tenant | Renting person's identity | Required name; optional phone, ID type/number, address, emergency contact and notes; has documents and tenancies. |
| Tenancy | Rental arrangement for a period | Tenant, unit, start/end, agreed rent, due date, advance terms, notice duration, charges and financial history. |
| Charge definition | Rule for charging an amount | Recurring or one-off; name, amount, effective period; electricity has meter-based calculation. |
| Bill / statement | Period charges and their balance presentation | Tenancy, billing month, due date, charge lines, credits, payment allocations and remaining dues. |
| Payment | Money actually received | Amount, actual receipt date, method, reference/notes and recording person. |
| Payment allocation | Which charges received money covers | Connects a payment to one or more months/charge items. |
| Notice-period advance | Money held for final notice-period rent | Original amount, amount applied, remaining balance; linked to the tenancy. |
| Rent prepayment | Rent paid ahead during a tenancy | Amount received and rent periods covered; separate from held notice advance. |
| Waiver / correction | Explainable change to an amount owed | Original charge retained; amount, reason, person and date; owner approval for waivers. |
| Main meter | Shared prepaid electricity supply | Supplies multiple households through submeters; has contribution records and rate settings. |
| Submeter | Measures a household's consumption | Previous/current readings, period and household/unit association. |
| Recharge contribution | Money a household puts into the main meter | Amount, date, contributing household and meter. |
| Electricity credit | Contribution not yet consumed by electricity charges | Household-linked balance carried toward future electricity costs. |
| Document | Tenant identity or rental attachment | Label/type, tenant, file and upload/local-availability status. |
| Departure settlement | Review of the tenancy's final financial position | Charges, payments, advance use, waivers, refunds and remaining dues. |
| Helper authorization | Permission to work in assigned properties | Helper account, assigned property and permitted operations. |

A property can contain several units; a unit has tenancy history; the same tenant can have a later tenancy without losing earlier history. Financial activity belongs to the relevant arrangement, rather than being an unexplained running balance on a person's profile.

## 5. Business rules by functional area

### 5.1 Properties, units and occupancy

- The owner can manage multiple properties in different locations.
- Units are managed inside a property; the entire building and an individual flat are not interchangeable.
- A unit's current tenancy is visible from its detail screen.
- Ending occupancy preserves the prior tenancy; the unit becomes available for a new tenancy after confirmed departure.
- Vacancy and occupied-unit counts feed property and portfolio summaries.
- Validation of overlapping/future reservations and any maintenance/unavailable state remains to be specified; these were not finalized in the interview.

### 5.2 Tenant identity, documents and tenancy terms

- Name is required. Phone, identification type/number, address, emergency contact and notes are optional initially.
- Multiple labeled documents/images may be attached.
- Support both mobile camera capture and selection of existing files.
- Store rental start/end dates, rent, notice terms, due date and advance terms on the tenancy, not on the person's identity alone.
- Leaving ends the tenancy; it does not delete the tenant or prior financial records.
- Household members, co-tenants and multiple legally responsible renters were not modeled in detail; the initial workflow uses a primary tenant representing a household.

### 5.3 Recurring charges and monthly billing

- Bills follow calendar months.
- The due date is configurable per tenancy.
- Include monthly rent, water, service and configurable additional recurring charges; allow one-off charges.
- Non-electric recurring charges start with fixed amounts. Water-meter calculations were not agreed.
- Changes to rent and charges take effect from a selected month; finalized historical bills retain the original applied values.
- Partial-month rent uses a proposed prorated amount that the owner reviews before finalization. The exact divisor and inclusive/exclusive day convention are unresolved.
- Billing date, due date, covered month, actual payment date and sync date are different pieces of information.
- The application must not invent a late fee, interest, escalation or automatic penalty merely because the due date passed. Such policies were not agreed.
- Draft/review/finalize was the planned bill preparation workflow. Whether all helpers may finalize bills and how scheduled automatic generation would work remain open.

### 5.4 Payments, allocation and dues

- A payment means money actually received; entering a bill, credit or waiver is not a cash receipt.
- Record amount, actual receipt date, cash/bank/mobile-wallet method, and optional reference/notes.
- Allow full, partial, early, late, irregular-date and ahead-of-month payments.
- A payment can cover selected months or charge items. The default suggestion is oldest dues first; the owner may override it.
- Old dues may remain outstanding while a new payment is allocated to a later month.
- Permission to pay later does not erase the debt. A waiver explicitly reduces what must be paid.
- Remaining dues follow the charge/allocation/adjustment records, rather than an independently editable total.
- Repeated transmission of one payment during sync must not create multiple receipts; separately recorded payments remain separate unless reviewed as a duplicate.
- Unallocated excess cash, payment reversal/refund mechanics and helper allocation permissions beyond approved access still need detailed rules.

### 5.5 Three separate forms of credit

| Balance | How it arises | What it is for |
|---|---|---|
| Notice-period advance | Collected before occupancy under agreed terms | Rent during departure notice, applied through settlement/review. |
| Ordinary rent prepayment | Tenant pays current/future months early during tenancy | Selected rent periods. |
| Electricity credit | Main-meter contributions exceed that household's electricity cost | Future electricity charges. |

These balances must remain distinguishable. Do not silently use electricity credit for rent, or held notice advance for ordinary mid-tenancy arrears.

Example: at BDT 10,000 rent, the usual initial advance is BDT 20,000. The owner can accept BDT 10,000 instead. Notice duration remains its independently agreed value; accepting less advance does not automatically shorten notice.

If rent becomes BDT 11,000, the original BDT 20,000 advance stays unchanged. Two final months cost BDT 22,000. The BDT 2,000 difference can be collected, left due with permission, or explicitly waived. The app must represent the selected outcome without disguising a waiver as payment.

### 5.6 Shared prepaid electricity

The agreed first-release workflow is a main prepaid meter shared by households, with a submeter for each household. The owner records the submeter readings and contribution reports and calculates costs at month-end.

For each household and billing period:

```
consumption_kWh = current_reading - previous_reading
electricity_charge = consumption_kWh × applicable_rate_per_kWh
```

Confirmed example:

```
11,200 - 11,131 = 69 kWh
69 × BDT 8 = BDT 552
```

BDT 8 is an example input, not a verified or permanently hardcoded government tariff. The owner configures the rate for each shared main meter, with finalized calculations preserving the rate used. No additional electricity fee, tax, loss allocation or tiered/slab calculation was agreed.

Each main-meter recharge records who contributed, how much, and when; multiple contributions may occur in a month. Household electricity cost is based on measured consumption, not the size or timing of an individual recharge.

Conceptually, in a period with no other settlements:

```
available_electricity_credit = brought_forward_credit + household_recharge_contributions
net_electricity_balance = electricity_charge - available_electricity_credit
```

- Positive result: amount still owed for electricity.
- Zero: cost covered.
- Negative result: its magnitude is electricity credit to carry forward.
- Actual collections/refunds must be recorded separately and incorporated into the ledger; the simplified formula above does not describe cash movements after calculation.

For BDT 552 usage and BDT 500 contribution, BDT 52 is due. For BDT 552 usage and BDT 1,000 contribution, BDT 448 carries forward as electricity credit. These are two alternative examples, not two simultaneous transactions.

Settlement is owner-managed. A calculated amount does not prove the owner received cash or refunded anyone. Recharge contributions must be applied only once, and any separate electricity collection must also reduce the corresponding bill balance; monthly billing and electricity settlement cannot maintain independent competing debts for the same charge.

How month cutoffs, mid-month rate changes, meter replacements/rollovers and a household's final electricity credit at departure are handled remains unresolved. No automatic live connection to the prepaid meter or provider is in scope.

### 5.7 Waivers, corrections and financial history

- Preserve the original charge when recording a waiver/correction.
- Record amount, actual date, responsible person and reason.
- Waivers require owner approval; a helper cannot silently forgive money.
- A waived amount is not collected revenue and must be distinguishable in statements/reports.
- Exact mechanisms for reversing a wrong payment, changing a finalized reading and obtaining offline helper approval must be designed before implementation.

### 5.8 Notice, departure and tenancy closure

1. Record notice date, agreed notice duration and planned departure date.
2. Review charges through the agreed end date, outstanding older dues and all relevant payments.
3. Review remaining notice-period advance and apply the approved amount.
4. Show shortages and possible refunds separately.
5. Record actual final collections/refunds or owner-approved waivers and adjustments.
6. Confirm departure and end the tenancy; preserve its history and make the unit available.

Departures without full notice and unused advance require owner review; no universal automatic forfeiture/refund rule was agreed. The initial requirements also allow older dues to remain outstanding until departure; whether a tenancy may be closed with remaining collectible debt is an open implementation rule. The design's zero-balance closure example does not settle that question.

### 5.9 Opening balances

- Existing tenancies can enter the app from an effective date.
- Enter older dues, held notice advance and carried electricity credit separately.
- Do not require reconstruction of every previous month.
- Opening values must reconcile with the first new bill and subsequent collections.
- Mapping previously received future rent and the detail needed to split older dues into charge types remain to be specified.

### 5.10 Offline operation and synchronization

- Initial sign-in requires internet. Previously authorized users can unlock locally using an app PIN or biometrics.
- Available rental/financial records, calculations, dues, readings, payment entry, allocation and approved owner actions must work locally without network calls.
- A phone can use only records it has already received or created; a new device cannot discover server-only records while offline.
- Persist the business change and pending sync work locally. A successful local save is distinct from server confirmation.
- Synchronize automatically while open when connectivity returns and on launch/resume; background work is opportunistic and OS-controlled.
- Display pending, confirmed, failed/retry or conflict information as appropriate. Exact retry UI is an implementation detail.
- Repeated sync attempts must not duplicate financial operations.
- Review conflicting edits; do not silently accept whichever financial edit arrives last.
- Preserve distinct payment records, flagging suspected duplicates for review.
- Do not hardcode a confirmed bill's historical rate to the latest rate on the server.
- Exact offline access expiry, revocation behavior, backup/recovery and finalized-record conflict resolution remain open.

### 5.11 Document lifecycle and confidentiality

- Identity files belong to the tenant's records and are accessed by authorized users.
- Upload to private file storage; store file references/metadata alongside business records.
- Keep selected existing documents offline only when explicitly downloaded.
- Keep newly captured documents locally while pending upload and until successful upload confirmation.
- Show local/online/pending availability accurately.
- File types, size limits, compression, encryption implementation, local-copy cleanup, deletion/retention and restore policy remain to be designed.

### 5.12 Reports, statements and sharing

- Tenant statements explain opening dues, period charges, contributions/credits applied, payments, waivers and remaining dues; show held notice advance separately.
- Receipts show money received, actual date, method and allocation.
- Summaries cover billed amounts, collections, outstanding dues, occupied units and vacancies at property and portfolio levels.
- PDF statements/receipts can be shared through the device; CSV export supports records/reporting.
- Reports must respect assigned-property access.
- Cash received in a month, payments allocated to that month's charges and noncash advance applications are different measures. Exact report cutoffs and labels must be specified; a recharge paid directly into a meter is not automatically cash received by the landlord.
- Expenses, profit/loss accounting, bank reconciliation and tax accounting were not agreed features.

### 5.13 Language and inclusive usability

- Provide complete Bangla and English interfaces. Bangla is selected on first launch, including on a phone whose system language is English.
- App-controlled labels, navigation, buttons, instructions, validation, empty/loading/error/success messages, financial explanations, accessibility labels, and generated receipt/statement headings must follow the selected language.
- Make switching between বাংলা and English easy to discover; preserve the choice locally across restarts and offline use. Both languages must be available offline.
- Switching language changes presentation, not tenant identity, recorded amounts, allocations, or financial history. User-entered names, notes, references, and original document contents remain as entered; translation of uploaded documents is not in scope.
- OS-controlled permission prompts, keyboards, biometrics, and share/camera/file-picker interfaces may follow device language. Translate app-owned explanations and configure native locale where supported; do not promise to override every system surface.
- Use familiar words, visible text labels, readable scalable type, generous touch targets, and consistent Back/Next/Save behavior. Important actions must not depend on hidden gestures or remembering an earlier screen.
- Keep routine collection, lookup, and meter-reading workflows short. Progressively disclose optional details while keeping amounts, dates, allocations, and other essential financial facts visible.
- Detailed translations, Bangla font rendering, date/digit formatting, and usability with adults aged approximately 45–70 need validation during design; the two-language scope and Bangla default are confirmed.

## 6. Screen inventory and responsibilities

There are **56 current prototype frames**: **53 functional screens/states**, **1 prototype-only guide**, and **2 alternative dashboard layouts**. This is the available planning inventory, not 56 mandatory production routes. Several entries can become a sheet, tab, state or shared form. Warm Ledger is the approved visual direction; detailed production layouts and screen consolidation remain to be designed and validated, and the existing Figma file has not been updated.

The five-tab navigation in the prototype is **Home, Properties, People, Bills, More**. Treat it as a navigation proposal, not an additional locked business requirement.

For this catalogue, owner access is the baseline. Helper visibility/actions are restricted to assigned properties and granted permissions; owner-only waivers and access administration remain protected.

### 6.1 Entry, access and overview — 4 frames

| ID | Screen | What it contains and does | Interacts with |
|---|---|---|---|
| S01 | Prototype guide | Explains fictional data and simulated services; launches sample tasks. Prototype-only. | Dashboard, sign-in, payment, electricity and departure examples. |
| S02 | Sign-in | Initial online authentication; sample email/password in the current design. Final authentication method is not yet selected. | Local unlock, then authorized workspace. |
| S03 | Local unlock | PIN or biometric unlock after prior online authorization. | Dashboard and offline local records. |
| S04 | Dashboard | Current period/property context; billed/collected/outstanding overview; occupied/vacant counts and task shortcuts. | Properties, bills, payments, electricity, reports and sync. |

### 6.2 Properties and units — 5 frames

| ID | Screen | What it contains and does | Interacts with |
|---|---|---|---|
| S05 | Property list | Lists buildings/locations with unit and occupancy summaries; add/open property. | Property details and property form. |
| S06 | Property details | Property information, its units, occupants/vacancies and shared-meter access. | Units, tenancy setup, electricity and property reporting. |
| S07 | Property form | Name, location, address/notes; create property. Reuse for editing is a production-layout proposal. | Property list/details. |
| S08 | Unit details | Unit label, occupancy, tenant, active tenancy, dues and held advance. | Tenant, tenancy, bill, payment and notice. |
| S09 | Unit form | Unit name, property and floor/notes; create an available unit. | Property details and tenancy setup. |

### 6.3 People, documents and tenancy setup — 12 frames

| ID | Screen | What it contains and does | Interacts with |
|---|---|---|---|
| S10 | Tenant list / People | Current tenants and preserved prior-tenant history; add/open tenant. | Tenant profile, identity form and past tenancy. |
| S11 | Tenant profile | Identity summary, tenancy association, outstanding balance, held advance, documents and receipt history. | Documents, tenancy terms, prepayment and departure. |
| S12 | Tenant identity form | Required name; optional phone, ID type/number, address, emergency contact and notes. | Profile and documents. |
| S13 | Document list | Labeled tenant attachments and local/online availability; select downloads or add documents. | Add-document and upload-status views. |
| S14 | Add document | Document label and choice of camera or existing file. | Capture/picker and queued upload. |
| S15 | Camera capture | Device document photography and capture confirmation; Figma shows a simulated state. | Document queue/list. |
| S16 | Document queued | Local-save and pending-upload feedback; file retained until server acknowledgment. | Sync queue and document list. |
| S17 | Tenancy details | Start/end context, rent, due date, notice duration, original advance and charge rules. | Charge configuration, rent change, opening balances and notice. |
| S18 | Start tenancy | Select tenant and unit; enter start date, rent, due date, advance and notice duration. | Tenancy, occupied-unit state and initial balances. |
| S19 | Charge configuration | Recurring water/service/other charges, one-off charges and electricity link. | Charge form and monthly bill preparation. |
| S20 | Charge form | Name, recurring/one-off frequency, fixed amount, effective period and notes. | Charge configuration and future bills. |
| S21 | Opening balances | Effective date; earlier dues, held notice advance and electricity credit. | Tenancy ledger, first statement and future bills. |

### 6.4 Bills and payment collection — 6 frames

| ID | Screen | What it contains and does | Interacts with |
|---|---|---|---|
| S22 | Bills and collections | Period/property context, bills, dues and collection shortcuts. | Bill detail, bill preparation, electricity and payment entry. |
| S23 | Bill detail / tenant ledger | Charge breakdown, applied electricity contributions, payment allocations, older/current dues and separate advance context. | Payments, statement preview and authorized adjustment. |
| S24 | Prepare bill | Review rent, recurring/one-off charges, electricity, due date and any partial-month adjustment before finalization. | Charge settings, readings and finalized bill. |
| S25 | Record payment | Amount received, actual date, method and reference/notes; show pre-payment outstanding. | Allocation, receipt and sync. |
| S26 | Payment allocation | Select which month/charges the received amount covers; show remaining current and old dues. | Payment entry, receipt and updated bill balances. |
| S27 | Payment receipt | Received money, person, date, method, allocation and resulting balance; share receipt. | Bill, receipt export and sync confirmation. |

### 6.5 Electricity — 6 frames, plus rate settings later in catalogue

| ID | Screen | What it contains and does | Interacts with |
|---|---|---|---|
| S28 | Shared electricity workspace | Main meter, linked households, configured unit rate, readings and settlement shortcuts. | Reading form, recharge form, settlement and rate settings. |
| S29 | Submeter reading | Period, previous/current readings, calculated kWh and cost preview. | Electricity charge, validation and monthly bill. |
| S30 | Recharge contribution form | Contributing household, main meter, amount, actual date and reference. | Contribution ledger and electricity settlement. |
| S31 | Electricity settlement | Household consumption cost, contributions, credit and remaining dues; owner review. | Monthly bill, actual collection and credit view. |
| S32 | Electricity collection | Record money actually received against electricity dues. Can reuse the generic payment form in production. | Allocations, bill balance and receipt/sync. |
| S33 | Electricity credit detail | Explain excess contributions and carried-forward credit. Current frame uses a separate alternative example. | Next electricity period and tenant statement. |

### 6.6 Advance, notice and departure — 8 frames

| ID | Screen | What it contains and does | Interacts with |
|---|---|---|---|
| S34 | Notice-period advance | Original amount, applied/remaining credit and notice terms; show separation from ordinary prepayment. | Tenancy and departure settlement. |
| S35 | Rent prepayment | Received amount/date/method and selected current/future rent periods. | Payment allocation and future bills. |
| S36 | Departure notice | Notice received date, agreed duration and planned departure; flag exceptions for review. | Active tenancy and settlement. |
| S37 | Departure settlement | Final rent/charges, prior dues, remaining advance application, shortages/refunds and approved adjustments. | Waiver, collection/refund records and tenancy closure. |
| S38 | Owner waiver / adjustment | Original charge, adjustment amount, reason, person/date and owner approval. | Original financial record, settlement and audit history. |
| S39 | Final collection | Record actual money received for the remaining settlement difference. Can reuse payment entry. | Settlement balance and receipt/history. |
| S40 | Closed tenancy / history | Preserved arrangement and financial history after departure; settlement outcome. | Prior tenant profile and unit history. |
| S41 | Vacant-unit state | Unit availability after confirmed departure while retaining prior history. | New tenancy and prior tenancy records. |

### 6.7 Reports, navigation and access administration — 6 frames

| ID | Screen | What it contains and does | Interacts with |
|---|---|---|---|
| S42 | Reports | Period/property/portfolio billed amounts, collections, dues, occupancy and vacancy summaries. | Properties, statements and CSV export. |
| S43 | Statement preview | Opening dues, charges, credit applications, payments, waivers and closing dues; advance separately. | Bill details, PDF generation and sharing. |
| S44 | Share / export | Select statement/receipt PDF or records CSV and initiate device sharing. The native share sheet is not a custom app screen requirement. | Reports, statement and receipt. |
| S45 | More / workspace | Navigation to reports, helpers, sync and local lock; prototype also links its guide. | Administrative and utility views. |
| S46 | Helpers and access | Owner view of individual helpers and property assignments. | Helper form and authorization rules. |
| S47 | Helper form | Helper identity/account reference, assigned properties and permitted activities; owner-only actions distinguished. | Access list, backend authorization and offline access cache. |

### 6.8 Offline states, settings and alternatives — 9 frames

| ID | Screen | What it contains and does | Interacts with |
|---|---|---|---|
| S48 | Offline and sync queue | Pending records/uploads, local-save state, retry/reconnection context and conflicts. | Local records, upload queue and conflict review. |
| S49 | Conflict review | Competing versions, responsible people and explicit choice/defer action. | Source record, owner review and synchronization. |
| S50 | Sync success | Confirm acknowledged changes and remaining pending count. A state, not necessarily a route. | Queue and dashboard. |
| S51 | Empty portfolio | Explain first property → unit → tenancy setup. A state of the property area. | Property creation. |
| S52 | Validation example | Clear field error with entered values retained; current prototype uses a reading lower than the prior reading. | Correction in source form. |
| S53 | Electricity rate settings | Main-meter per-kWh rate and effective billing period; preserve finalized historical calculations. | Electricity workspace and future bills. |
| S54 | Rent change | Current/new rent and effective period; original held advance remains unchanged. | Tenancy, future bills and settlement. |
| S55 | Dashboard alternative B | Ledger-first arrangement of the same dashboard information. Prototype-only alternative. | Same destinations as main dashboard. |
| S56 | Dashboard alternative C | Task-first arrangement of the same dashboard information. Prototype-only alternative. | Same destinations as main dashboard. |

### Screen coverage limits

The count comes from the current prototype inventory. It does not add forgotten business requirements by implication. In particular, meter/submeter setup and reassignment, a real document viewer, refund entry, detailed correction history, account recovery, data restore and authorization-expiry settings need placement during implementation design. They may use existing forms/sheets or add screens; their exact UI and some policies are not finalized.

## 7. How the workflows connect

### A. Add a new rental arrangement

Property list → create/open property → create/open unit → select/create tenant → start tenancy → configure rent/advance/notice/charges → attach documents → review tenancy.

Result: an identifiable tenant occupies a unit under a dated arrangement; billing uses the terms on that arrangement.

### B. Bring an existing tenancy into the app

Create property/unit/tenant/tenancy → enter dated opening dues and separate credit balances → prepare the first new month → review the statement.

Result: current records reconcile from the chosen starting date without pretending to hold a full historical ledger.

### C. Monthly billing and collection

Record readings and recharge contributions → prepare bill using applicable terms/rates → review/finalize → collect money → enter actual date/method → allocate to selected charge periods → issue receipt → update statement/dashboard/reporting.

The statement reads the same underlying bill and payment records as the collection screens. Screens do not maintain independent balances.

### D. Shared electricity

Property → main-meter workspace → household submeter reading → calculated cost → recharge contributions → household net electricity due/credit → apply to monthly bill → record any actual settlement separately.

An electricity collection and a rent-collection allocation must reference the same charge balance where they cover the same bill.

### E. Rent increase and departure

Tenancy → effective-dated rent change → future bills at new rent, old advance unchanged → notice → settlement review → collect/waive/refund as approved → confirm departure → preserved tenancy history + available unit.

### F. Offline recording and later sync

Previously authorized local unlock → create business record in SQLite → display locally updated balance and pending sync state → reconnect/launch/resume → send pending operation → server validates/acknowledges → confirm locally, or surface retry/conflict for review.

The UI must distinguish a local save, a server-confirmed record and an actual money receipt.

### G. Document capture and sharing

Tenant → document list → camera/file selection → local file + metadata → queued upload → confirmed private server file → optional selected local availability. A new phone needs connectivity to obtain server files it does not already have.

### H. Owner and helper work

Owner configures helper/property access → helper performs permitted tasks → locally saved work identifies its recording person → server enforces authorization during sync → owner reviews actions requiring approval.

How an offline helper requests and receives owner approval is an unresolved workflow detail; the basic owner-approval requirement is confirmed.

## 8. Worked financial examples

### Monthly bill and partial collection

| Entry | BDT |
|---|---:|
| Rent | 10,000 |
| Water | 500 |
| Service | 700 |
| Electricity charge | 552 |
| Gross November charges | 11,752 |
| Household recharge contribution applied to electricity | -500 |
| November payable | 11,252 |
| Older dues | 3,000 |
| Total before payment | 14,252 |
| Payment allocated to November | -5,000 |
| Total remaining dues | 9,252 |

Remaining November dues are BDT 6,252 and older dues stay BDT 3,000. BDT 20,000 notice-period advance remains separately held; it is not deducted from this ordinary balance.

### Departure after rent increase

| Entry | BDT |
|---|---:|
| Two final months at BDT 11,000 | 22,000 |
| Original advance applied | -20,000 |
| Remaining difference | 2,000 |

The owner may collect BDT 2,000, leave it outstanding as agreed, or record a BDT 2,000 waiver. These produce different histories even if collection and waiver both bring the amount owed to zero.

These examples illustrate agreed rules. They are not real tenant transactions or evidence that an implemented financial engine has been tested.

## 9. Derived implementation safeguards

These are engineering requirements inferred from the agreed money/offline/history behavior, not additional commercial features or selected libraries:

- Use exact money arithmetic and a specified rounding rule; local and server calculations must agree. The precise rounding policy remains open.
- Give each offline business operation a stable identity, so network retries cannot duplicate payments or charges.
- Save the local change and its pending sync work consistently; do not report an operation as saved if it can vanish on a normal restart.
- The server validates authorization and financial rules rather than trusting totals submitted by a client.
- Retain the applied rent/rate/charge values needed to explain historical finalized bills.
- Keep payment receipts, credit applications, waivers and refunds distinguishable in records and reports.
- Handle a real-world duplicate entry separately from retransmission of the same operation.
- Protect private tenant files and cached access appropriately; the concrete security design is still to be specified.
- Use maintained migrations for local and server schemas; no migration tooling has been selected.
- Define backup/recovery before using the system as the sole record of collections.

## 10. First-release scope boundaries

### Included

Property/unit management; tenant identity and documents; tenancy history and terms; configurable charges; monthly billing; partial/late/early/future payments; explicit allocation; notice advance; electricity calculation/contributions/credit; waivers and departure review; opening balances; owner/helper access; offline records and sync/conflict handling; statements, receipts, reports, PDF sharing and CSV export.

### Deferred or not agreed

- Tenant portal/login, tenant self-service and tenant-submitted disputes.
- Public SaaS registration, subscriptions and billing other landlords.
- Payment-gateway processing, automatic bank/mobile-wallet reconciliation.
- Automatic electricity-provider integration or government tariff lookup.
- Tiered tariffs, shared-loss allocation, taxes/fees and water-meter billing.
- Automatic late fees, interest and penalties.
- Full expense accounting, profit/loss, tax reports and bank reconciliation.
- Maintenance-ticket workflows, listing/booking marketplace and rent advertisements.
- Automated SMS/email/WhatsApp reminders or notification delivery.
- OCR, identity verification, electronic signatures and legal agreement generation.
- Desktop application and final production screen/route count.

Some of these may be sensible later, but they must not silently enter the first build as accepted requirements.

## 11. Details that remain unresolved

The principal features and stack are agreed. The following narrower rules still need decisions before their related implementation:

1. Offline authorization validity, sign-out/revocation handling and which operations may be performed after a long offline period.
2. Authentication method/provider, owner/helper provisioning and account recovery. Email/password in Figma is illustrative.
3. Exact helper permissions, bill finalization rights and offline owner-approval workflow.
4. Backup, recovery to a new phone, and protection/recovery of changes or captured files not yet synchronized.
5. Proration divisor, date inclusivity, due dates such as the 31st in a short month, and rounding.
6. Main-meter/submeter setup, changes in household associations, reading cutoffs, replacement/reset/rollover and a rate change within a consumption period.
7. Treatment of unused electricity credit at departure; whether/how it is refunded or separately settled.
8. Refund entries, payment reversals, finalized-bill corrections and what may be edited directly versus adjusted.
9. Handling of unallocated overpayments, prepaid amounts for periods not yet billed and future prepaid rent when rent changes.
10. Rules for short notice, unused notice advance, disputed amounts and closure with unresolved collectible debt.
11. Reporting cutoffs and definitions for cash collections, period allocations, advance applications and recharge contributions.
12. Upload formats/limits, image compression, retention/deletion, local file protection and lifecycle.
13. Future-tenancy reservations, occupancy overlap checks and whether more than one responsible tenant can share a tenancy.
14. Detailed Bangla/English copy, font rendering and date/digit formatting; accessibility implementation, final navigation and screen consolidation. Both languages, Bangla default, and simple use across younger adults and ages approximately 45–70 are confirmed.
15. Hosting region/provider, file-storage provider, versions, deployment and operational monitoring.

These are not reasons to resume Figma immediately. They can be resolved alongside the relevant workflow specification before coding it. No unanswered rule should be silently inferred from a fictional prototype snapshot.

## 12. Acceptance scenarios for implementation

| ID | Scenario | Required outcome |
|---|---|---|
| A01 | Owner has properties in two locations | Each property has its own units and records; authorized portfolio summary combines them. |
| A02 | Tenant leaves and later returns | Earlier identity/history persists; a new tenancy represents the later rental. |
| A03 | Readings are 11,131 and 11,200, rate is 8 | Consumption 69 kWh and electricity charge BDT 552. |
| A04 | Household contributed 500 against cost 552 | BDT 52 electricity due; contribution is not counted twice. |
| A05 | Household contributed 1,000 against cost 552 | BDT 448 electricity credit; it does not silently pay rent. |
| A06 | Several recharge reports arrive in a month | Each keeps household/date/amount and contributes once to the correct balance. |
| A07 | Tenant owes an older month but pays current month | Owner-selected allocation pays the current charges and leaves older dues visible. |
| A08 | A partial payment arrives after due date | Preserve the bill due date and actual receipt date; calculate remaining dues correctly. |
| A09 | Owner waives a rent-increase difference | Preserve the original amount and dated owner-approved waiver; do not record fictional cash. |
| A10 | Advance was 20,000; final rent is 22,000 | Show 2,000 remaining before collection/waiver; original advance is unchanged. |
| A11 | Owner accepted only one month's initial advance | Held amount is smaller; agreed notice duration does not change automatically. |
| A12 | App starts with dated older dues and credits | First new statement reconciles from the opening values without duplicate history. |
| A13 | Payment recorded offline; app restarts | Saved local record and balance remain available; later retry does not duplicate it. |
| A14 | Two users edit a reading offline | Surface the conflict for review; do not silently overwrite financial data. |
| A15 | Photo captured without internet | File stays locally queued and is marked uploaded only after confirmation. |
| A16 | Helper opens an unassigned property or waives money | Access is restricted; waiver needs owner approval. |
| A17 | A configured rate or charge changes | Future applicable bills use it; finalized historical bills retain the prior calculation. |
| A18 | A separate electricity collection is recorded | The same underlying electricity debt and monthly statement reflect it once. |
| A19 | Statement and receipt are exported | Statement explains the balance; receipt identifies actual money received and allocation. |
| A20 | App is first opened on a phone set to English | The app-owned interface starts in Bangla; বাংলা / English switching is discoverable. |
| A21 | User switches language and later restarts offline | The selected language persists; all app-owned UI and accessibility text is available in that language; financial records are unchanged. |
| A22 | User enlarges system text and uses a narrow phone | Bangla and English labels, identities, amounts, and main actions remain readable and usable without clipped critical text or gesture-only actions. |
| A23 | Older and younger participants perform routine tasks | They can find a tenancy, record received money, inspect remaining dues, and enter a reading using visible actions; verify through representative usability sessions. |
| A24 | Receipt/statement is generated in either language | App-generated headings and explanations use the selected language with readable glyphs; original names/references and financial values are preserved. |

These are future acceptance criteria, not completed tests.

## 13. Related project records

- [Glossary](../GLOSSARY.md): canonical business vocabulary.
- [Documentation index](README.md): ownership of the working specifications.
- [Discovery history](references/discovery-history.md): original interview record.
- [ADR 0001](adr/0001-offline-mobile-client.md): accepted technology trade-off.
- [Prototype history](references/prototype-history.md): existing Figma prototype and its limits; it does not implement application behavior.
- [Reference interpretation](references/ui-reference-analysis.md): internal-screen inspiration and bottom-navigation direction.
- [Agent workflow](agent-workflow.md): task ownership and integration.

When a decision changes, update this baseline and its affected working glossary, domain/screen/design specification, and ADR where applicable. Historical discovery and prototype records remain references, not parallel working specifications. The prototype must not override the agreed business rules.
