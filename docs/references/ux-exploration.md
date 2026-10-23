> Historical exploration: the palette and navigation below predate the latest green/white reference. Current visual authority is [design system](../design-system.md) and [navigation](../navigation.md).

> Historical reference, retained on 23 October 2026. Working requirements and guidance are indexed in [the documentation index](../README.md). This record is not a competing specification.

# House Rent Tracker — UX and visual design proposal

Date: 23 October 2026  
Status: Direction A approved; Bangla-default bilingual scope and inclusive-age usability confirmed; detailed layouts remain to be validated; no application implementation  
Basis: `requirements-analysis.md`, `../GLOSSARY.md`, and the scope/provenance notes in `../prototype/README.md`.

The owner approved Direction A, Warm Ledger, on 23 October 2026 and confirmed complete Bangla/English support with Bangla selected by default. They emphasized straightforward use for younger adults and adults aged approximately 45–70. This revision incorporates those requirements; exact navigation labels, detailed layouts, translations, and provisional interaction choices remain subject to usability validation. Unresolved financial and access rules remain unresolved. Existing Figma frames have not been edited or inspected visually for this proposal; their documented inventory informs coverage only.

## 1. Product interpretation

Design a dependable mobile working ledger for rental operations. The owner needs to know what needs attention, identify the right tenancy, record what actually happened, and explain every balance later.

The primary user is an owner operating multiple properties. The secondary user is an individually identified helper working within assigned properties and permissions. Tenants are people whose records are managed; there is no tenant-facing app in this release.

The confirmed audience spans younger adults and adults aged approximately 45–70. Use one clear, accessible interface for everyone rather than a separate age-based mode. Design for variation in eyesight, dexterity, reading preferences, and smartphone confidence without assuming all older adults have the same needs. Simplicity comes from clear choices and progressive disclosure, not from hiding financial facts or removing agreed capabilities.

Likely use contexts, inferred from the requirements: brief collection conversations, walking through units to read meters, month-end desk work, and interruptions or unreliable connectivity. Validate these assumptions with the owner before detailed interaction design.

### Work frequency and priority

| Frequency | Job | Design response |
|---|---|---|
| Repeated during collections | Find household, inspect dues, record payment, allocate, share receipt | Search by name/unit/property; contextual payment entry; minimal re-entry; persistent receipt |
| Throughout a month | Record recharge contributions; consult older dues and documents | Direct property and tenancy entry points; dated activity rows |
| Monthly | Capture readings, review bills, finalize and track balances | A property-scoped work queue; missing-data indicators; save-and-next reading entry |
| Occasional | Start tenancy, enter opening values, change rent | Guided full-screen flows with review and resumable drafts |
| Occasional, financially sensitive | Apply advance, waive amounts, settle departure | Explicit outcomes, reasons, original values, and owner authority |
| Always | Keep work usable locally and understand pending synchronization | Quiet persistent status with actionable exceptions |

### Mental model

Property → rental unit → tenancy. A tenant identity links to current and previous tenancies, without merging their financial activity.

The interface must distinguish these amounts wherever relevant:

- **Amount due:** unpaid charge balances after valid allocations and adjustments.
- **Notice-period advance:** separately held money, with original/applied/remaining amounts.
- **Rent prepayment:** money received ahead for selected rent periods.
- **Electricity credit:** unused household electricity contributions.

Avoid one combined “wallet,” “deposit,” or “net balance.” A zero amount due does not mean no advance is held. A waiver or advance application does not mean cash was received.

## 2. Information architecture

Recommend five stable bottom destinations: **Home · Properties · Ledger · Tenants · More**.

Bangla is the default. Proposed visible labels are **শুরু · বাড়ি · হিসাব · ভাড়াটিয়া · আরও**. These short labels retain the same destinations in both languages; validate their comprehension with Bangla-speaking users before freezing copy. Use familiar “হিসাব” rather than a transliteration of “Ledger.” Keep navigation positions stable when language changes.

| Destination | Primary question | Contents and actions |
|---|---|---|
| Home | What needs my attention? | Explicit property/period scope; financial summary; attention list; Record payment; readings/billing shortcuts |
| Properties | What is happening in this building or unit? | Properties → property → unit → active/past tenancy; shared electricity workspace; vacancy and occupancy |
| Ledger | What is owed, billed, or received? | Dues / Bills / Payments views; property and period filters; payment entry; bill preparation; statements and receipts |
| Tenants | Who is this person and what is their rental history? | Search; current/past filters; identity; documents; separately identified tenancies |
| More | What do I need to manage or review? | Reports; Sync & offline storage; owner-only Helpers & access; account/local unlock; configuration links |

“More” is a deliberately organized utility hub, not an automatically generated overflow tab. It contains three labeled groups: Reports, Device & account, and Owner management. Rename “Bills” to “Ledger” because charges, allocations, actual receipts, and adjustments exceed bill management. Rename “People” to “Tenants” to avoid confusing tenant identities with helper accounts.

Place **ভাষা / Language: বাংলা** near the top of More, and make the bilingual switch available on the first sign-in screen. No mandatory language-selection step is needed: the app already starts in Bangla. Group rarely used access/configuration controls below everyday destinations. Keep ordinary tasks one or two direct selections from a top-level destination where possible; do not force people to rediscover a tenant through several nested property screens.

### Navigation trade-offs

- A separate Tenants tab supports direct lookup during collection conversations and preserves historical identity independently of occupied units. A four-tab structure would save space but bury that frequent lookup.
- Electricity belongs inside its property because meters serve a specific location. Home exposes “Read meters” and the Ledger exposes the relevant bill link, avoiding repeated navigation. It does not need a sixth primary tab.
- Reports are less frequent than recording transactions, so they live in More, with direct links from financial summaries.
- Use a labeled Record payment button, rather than an unlabeled global plus menu. Show it prominently on Home and Ledger; contextual payment buttons on tenancy and bill details reuse the same flow.

### Context and return behavior

- Home, Ledger, and Reports can share an explicitly displayed financial property scope. All properties means all properties the signed-in person is authorized to access. It does not imply a complete server dataset when offline.
- Selecting a property detail does not silently change the global financial filter. Forms launched from it inherit that property and show it in their context summary.
- Property, unit, tenant, and active tenancy are visible before a financial save. If a tenant has more than one relevant tenancy, require an explicit choice.
- Billing month and actual receipt-date range are different filters with different labels. Outstanding across all months is not presented as outstanding for the selected month.
- Each tab preserves its navigation and scroll state. Contextual links return to their source; returning from payment entry restores the previous list and filters.
- Use sheets for short choices such as method, scope, and filter. Use full-screen flows for payments/allocation, tenancy setup, bill review, and settlement. Avoid stacked sheets and long forms inside shallow overlays.
- Keep the five primary destinations stable for a helper. Omit inaccessible owner administration actions; show a clear explanation if a previously accessible record becomes unavailable.

## 3. Screen families and purpose

Consolidate the 56-frame planning inventory into reusable screen families. Final route count follows interaction needs, not the number of prototype frames.

| Family | Primary purpose | Primary action or meaningful next step |
|---|---|---|
| Sign-in / local unlock | Enter an authorized workspace | Sign in / Unlock; authentication method remains open |
| Home | Select the next useful task | Record payment; task rows open specific outstanding work |
| Property list | Find or establish a building | Open property / Add property in empty state |
| Property detail | Work within one building | Open unit; explicit Electricity entry; Add unit as secondary |
| Unit detail | Understand occupancy and the relevant arrangement | Open tenancy if occupied; Start tenancy if vacant |
| Tenant directory and identity profile | Locate a person and preserved history | Open tenancy / Edit identity; documents form a separate section |
| Tenancy account | Understand one rental arrangement and its financial position | Record payment; Terms, Documents, and Activity are secondary destinations |
| Ledger | Find dues, bills, and money received | Record payment; Prepare bills in the Bills view |
| Bill detail | Explain a period's charges and remaining amount | Record payment; View statement |
| Bill review | Validate proposed charges before finalization | Finalize bill after review |
| Payment flow and receipt | Record actual money and its allocation | Save payment / Share receipt after save |
| Electricity workspace | Complete one meter's period calculations | Enter readings; Record contribution; review household balances |
| Notice and departure | Review and resolve a tenancy's ending position | Advance to the next review step; Confirm departure only under agreed rules |
| Statements and reports | Explain/export scoped financial records | Share PDF / Export CSV |
| Documents | Capture, retrieve, and identify file availability | Add document / Download for offline use |
| Sync and conflict review | Understand and resolve pending or rejected work | Retry / Review conflict; source record remains accessible |
| Helpers and settings | Manage permitted access and configuration | Save the explicit assignment or configuration change |

Forms for property, unit, charge, effective rent/rate change, opening values, and helper assignment reuse shared field and review patterns. Camera and file selection use device capabilities; sharing uses the native share sheet. Success, vacancy, validation, and empty states usually belong to their source screen rather than separate destinations.

Identity profile and tenancy account must remain distinct. The former answers “Who is this person?”; the latter answers “What does this rental arrangement owe, hold, and record?”

## 4. Three visual directions

These are alternative visual systems, not color reskins. All preserve the same financial rules and baseline architecture. Names are working design labels, not product branding.

| | A — Warm Ledger | B — Precision Ledger | C — Field Companion |
|---|---|---|---|
| Character | Calm, established, quietly premium | Analytical, exact, compact | Approachable, practical, task-oriented |
| Palette | Warm off-white `#F7F7F2`, deep forest `#235B47`, ink `#172B26` | Cool white `#F5F7FA`, navy `#172B4D`, blue `#2457C5` | Soft white `#FAF8F3`, dark ink `#24313A`, ochre `#8B5A16` |
| Typography | Platform system sans; balanced labels and medium-weight figures | Platform system sans; stronger small section headings and aligned numeric columns | Platform system sans; larger headings, more explanatory sentence labels |
| Layout | Open ledger sections, restrained rules, one summary group | Denser month-grouped rows, clear date columns, tighter visual grouping within full touch targets | Larger task rows, staged workflows, more progressive disclosure |
| Home emphasis | Financial position followed by work requiring attention | Period results and dues distribution | Incomplete readings, bills to review, and next actions |
| Components | Thin dividers, modest corners, restrained tinted summaries | Squarer groups, compact filters, stronger table-like alignment | Larger selection controls and broader action zones, limited rounded groups |
| Advantage | Financial clarity with a distinctive, comfortable everyday identity | Best for scanning many entries and comparing periods | Easiest for occasional helpers and movement between units |
| Trade-off | Needs disciplined labels so related financial balances remain distinct | Can feel formal and dense on small phones | More scrolling; portfolio finance becomes less immediate |

**Approved direction: A — Warm Ledger.** It best balances repeated collections, complex credits, long history, and property work. Use task rows immediately below the financial summary, while retaining A's visual system throughout. Increase reading comfort and touch space as specified below; do not import the compact density of Direction B. Premium quality should come from clear information, careful type, reliable feedback, and restraint.

Do not use building photos as routine list backgrounds, gradients behind amounts, glass panels over financial records, animated counters, multicolored KPI tiles, or a card around every row. The local skill search returned marketing-oriented page structures twice; those structures and unrelated effects were rejected. The proposal is a product-specific synthesis of the requirements and mobile interaction guidance.

## 5. Proposed design system for Warm Ledger

### Color roles

| Semantic role | Proposed light value | Use |
|---|---|---|
| Canvas | `#F7F7F2` | Main page background |
| Surface | `#FFFFFF` | Forms, short grouped sections, overlays |
| Primary text | `#172B26` | Names, amounts, headings |
| Secondary text | `#52635C` | Dates, explanations, metadata |
| Primary action | `#235B47` | Main buttons and selected emphasis; white label |
| Selection surface | `#EAF2EC` | Selected rows and restrained summary treatment |
| Divider | `#D8DFD9` | Decorative grouping only |
| Control boundary | `#73847B` | Input outlines and other necessary control edges |
| Success | `#256347` on `#EAF2EC` | Confirmed success, always with a label |
| Attention | `#885400` on `#FFF3D6` | Missing data, review, or pending work |
| Error | `#B42332` on `#FFF0F0` | Validation failure, rejected action, overdue label where relevant |
| Information | `#2E5B83` on `#ECF3FA` | Neutral context such as locally saved work |

Calculated sRGB contrast for these exact flat-color pairs: primary button 7.90:1; primary text/canvas 13.86:1; secondary text/canvas 5.93:1; control boundary/white 3.95:1; status text/status fills 5.74:1–6.38:1. These calculations do not establish accessibility of an unbuilt interface. Decorative dividers must not be the only visible control boundary.

Do not use green/red to imply a transaction type. “Payment received,” “Advance applied,” “Waived,” and “Recharge contribution” need explicit labels and accessible semantics. An unpaid bill is a business state, not a system error.

Use semantic theme roles rather than screen-specific colors. Light is the initial approval reference. Before a dark theme ships, define and verify its text, surface, control, selection, and status pairs separately; do not invert the light palette automatically.

### Typography

Use a coherent sans-serif system with full Bangla shaping support and system text scaling. English can use SF on iOS and Roboto on Android. Bangla must use a verified Bengali-capable face available offline; evaluate Noto Sans Bengali or a well-matched native Bengali face on actual devices before selecting it. Verify conjuncts, vowel marks, mixed-script names, and baseline alignment. The existing Manrope/Inter prototype choice does not establish adequate Bangla coverage.

| Role | Nominal size / line height | Weight and behavior |
|---|---|---|
| Key balance | 30 / 40 | Semibold; at most one dominant balance per account view |
| Screen heading | 28 / 38 | Semibold; platform navigation titles can use native metrics |
| Section heading | 22 / 32 | Semibold |
| Row title / body | 18 / 28 | Medium for title; regular for explanation |
| Field label / important supporting text | 16 / 24 | Medium / regular; financial review facts stay at body size |
| Secondary timestamp | 14 / 22 | Regular; never essential financial information |
| Navigation label | Target 14 / 20 where supported | Always visible and scalable; validate native bar layout in both scripts |

Sizes are logical platform units, not fixed physical pixels, and are initial layout targets rather than universal guarantees of readability. Bangla needs generous line boxes for marks above/below glyphs; increase them if device rendering requires it. Do not add tracking between Bengali characters. Use tabular figures where supported for money and readings, right-aligned amounts in ledger rows, and no all-caps paragraphs. Financial review values remain at least body size. Allow long values to wrap into a dedicated amount line rather than shrinking, clipping, or abbreviating them. At large system text sizes, grow navigation/control height or use an accessible adaptive layout; do not compress five labels into unreadable text.

### Spacing and geometry

- Base scale: 4, 8, 12, 16, 24, 32, 48 logical units.
- Phone horizontal gutters: 16 at small widths; 20 on wider phones. Section gaps: 24; field groups: 16; related label/value gaps: 4–8.
- Typical two-line ledger row: 80 minimum at default text size, growing with content. A simple settings row can start at 60.
- Main buttons: 56 minimum height; fields: 56 minimum, growing for larger text. Secondary custom controls target at least 52 × 52. Native controls meet at least 44 pt on iOS and 48 dp on Android, with enlarged surrounding targets where practical. Provide 8–12 units between adjacent independent controls where possible.
- Corners: 8 for buttons, 10 for fields, 12 for genuinely grouped surfaces. Pills only for short filters/statuses; use native sheet geometry.
- Use whitespace and dividers for lists. Shadows are reserved for overlays or functional separation, not repeated transaction tiles.
- Fixed actions respect safe areas and keyboard insets. Scroll content includes enough clearance to reveal its final row fully.

### Component language

| Component | Specification |
|---|---|
| Primary button | Solid forest, white label, explicit verb; one main action per form step; visible progress and duplicate-tap protection while saving |
| Secondary action | Outline or text, with clear hierarchy; never several equally dominant actions |
| Ledger row | Tenant or charge title; property/unit/period context; aligned amount; plain-language state; full-row target |
| Balance section | Amount due first; older/current breakdown; held advance and other credits labeled separately below |
| Field | Persistent label; suitable keyboard; optional marker where useful; inline hint and error; retain entered value |
| Filter | Visible selection and clear scope; compact sheet for additional filters; reset action |
| Status | Icon plus text; separate business state from sync state; no color-only encoding |
| Review summary | Recipient, property/unit, amount, actual date/method, and allocation in readable rows |
| Destructive or corrective action | Explicitly named; consequences and reason visible; financial history preserved according to the eventual correction policy |
| Icons | One consistent vector family for custom content; native system symbols in native controls where appropriate; labels on core actions |

### Interaction and motion

Provide immediate pressed feedback; brief custom feedback around 100–150 ms and contextual transitions around 180–250 ms where appropriate. Native navigation retains native motion. No chart entrances, balance count-ups, or springing financial totals. Respect reduced motion and avoid layout shifts while totals update. Optional haptics reinforce a meaningful result but never carry its only confirmation.

Persist resumable drafts for long setup and review workflows. Autosaved drafts must say “Draft,” and cannot look like finalized bills or saved payment receipts. On leaving a dirty short form, offer Keep editing / Discard; native back gestures remain supported. Use the same visible Back/Next/Save pattern across forms. For a long process, show a short step title and progress without asking people to remember previous amounts. Final money review includes tenant, unit, amount, actual date, and allocation in place. Keep validation and success feedback available in the source screen; a brief disappearing toast is never the only explanation.

## 6. Key workflow designs

### A. Record a payment

1. Start from Home/Ledger search or a specific tenant, tenancy, or bill. Confirm the relevant rental arrangement.
2. Enter amount received, actual receipt date, and cash/bank/mobile-wallet method. Reference and notes are optional. Clearly label an initial date suggestion as the receipt date; allow backdating. Do not silently preselect an amount as though it was received.
3. Show oldest-dues-first allocation as an editable suggestion. “Change allocation” opens month/charge selection. Keep allocated total, remaining payment amount, and resulting dues visible.
4. Show a compact review in the flow before Save payment. For the normal path, suggested allocation and review can share the second step, avoiding a separate unnecessary confirmation screen.
5. After durable local save, show the receipt with its sync state and resulting balance. Sharing is secondary to successful recording and cannot be the only way to preserve the receipt.

Do not force old dues to be paid before a new month. A separately entered payment with similar details may be flagged as a possible duplicate, but must not be silently merged. A network retry should not invite the user to enter the payment again.

**Baseline example, fictional:** November charges BDT 11,752, less BDT 500 electricity contribution = BDT 11,252 payable. Older dues BDT 3,000. Receive BDT 5,000 and allocate it to November: November remaining BDT 6,252; older dues BDT 3,000; total due BDT 9,252. Notice-period advance remains separately held at BDT 20,000.

If receipt sharing is permitted while pending sync, the proposed preview visibly says “Recorded on this device · Pending sync.” Do not invent a server-confirmed receipt number. Final identity/numbering and rejected-sync receipt treatment need specification before implementation.

### B. Month-end electricity and billing

Property → Electricity → main meter and billing period. Show households with **Reading needed / Ready to review / Finalized**, without treating an absent reading as zero usage.

For each household, show previous reading, current reading input, consumption, applicable rate, and calculated cost together. **Save & next** durably saves that household's entry before moving to the next. Allow a household to be skipped with its incomplete state preserved. Review the period before finalization; bulk finalization is not assumed.

Example: 11,200 − 11,131 = 69 kWh; 69 × BDT 8 = BDT 552. Contribution BDT 500 leaves BDT 52 electricity due. A separate alternative example with contribution BDT 1,000 leaves BDT 448 electricity credit. Never show both as successive transactions against the same sample bill.

Contribution entry remains an explicitly labeled form: household, meter, amount, actual date, reference. It is not the Record payment flow for cash received by the owner. Electricity collection may reuse payment entry pre-scoped to the same underlying electricity charge.

Bill review shows draft charges, missing inputs, due date, applicable terms, and any proposed partial-month adjustment. Do not silently finalize missing readings or invent proration. Draft/finalized bill state is independent from unpaid/part-paid/paid and independent from sync status.

### C. Start or import a tenancy

Choose property/unit → create or select tenant → set dates/rent/due date → set notice duration and notice-period advance separately → configure charges → enter dated opening balances if already occupied → review.

Make identity name the initial required field, with optional details progressively disclosed. Documents can be added during or after setup. Existing tenancy onboarding prominently offers “Start from opening balances” rather than requiring historical month reconstruction.

Do not label an opening held balance as a new cash collection. Show previous dues, held advance, and electricity credit in separate fields. Treatment of prior future-month payments needs its agreed rule before that portion is implemented.

### D. Notice and departure

Use a full-screen review sequence: notice and dates → final charges and older dues → proposed advance application → record actual outcomes → review closure.

Example: final rent BDT 22,000 − original advance applied BDT 20,000 = BDT 2,000 remaining. “Record collection” and “Record waiver” are distinct actions with distinct histories. Agreeing to leave an amount outstanding is not a waiver.

Show refund payable separately from refund actually recorded. Final electricity credit remains separate and needs an explicit approved treatment. Do not enable an automatic close-with-debt, forfeiture, or refund policy through visual defaults. Final closure eligibility depends on the unresolved business rules.

## 7. Home hierarchy and realistic data

Home should be a short working overview rather than an analytics wall:

1. Title and scope: selected property/all authorized properties; selected financial period.
2. One grouped financial summary, with precise labels: Charges for November; Received during November; Outstanding across all months. These measures are not expected to reconcile as one equation.
3. Prominent Record payment action.
4. Attention rows with factual counts: Readings missing; Draft bills to review; Departures approaching; Sync issues requiring review. Show only real applicable tasks and avoid invented urgency thresholds.
5. Compact occupancy/vacancy summary and links to the relevant units.

Charts are secondary reporting tools. Use a chart only when comparing periods helps a specific decision; provide values and accessible alternatives. Do not add profit, expense, revenue-growth, or bank-balance tiles to this scope.

Financial drilldowns must explain scope and provenance. Report “Money received during November” separately from “Payments allocated to November charges” and “Advance applied.” Contributions paid directly to a meter are not automatically landlord collections. Precise report cutoff rules still need agreement.

## 8. States, offline confidence, and privacy

| State | Proposed presentation and behavior |
|---|---|
| New portfolio | “Add your first property,” followed by unit and tenancy setup; no invented totals or sample transactions in the live product |
| No matches | Preserve query/filters; offer Clear filters; distinguish this from an empty portfolio |
| First fetch | Stable skeleton rows and a loading label; no flash of fictional zero balances |
| Refresh with local records | Keep available data visible; show refresh progress and last confirmation context |
| Offline with saved records | Quiet “Offline · 3 changes pending” status; permitted local actions remain usable |
| Offline without needed records | “Not available on this device”; explain connectivity is needed; do not report zero or no history |
| Local save succeeded | “Saved on this phone · Pending sync”; update the local account and persistent activity |
| Server acknowledged | “Synced”; retain meaningful recorded/received dates separately from sync metadata |
| Sync failure | “Saved on this phone · Couldn't sync”; Retry and View details, without losing work |
| Authorization rejection | Clearly mark the rejected operation and explain that review is needed; do not leave its balance looking server-confirmed |
| Conflicting financial edit | Dedicated review comparing original/local/server values and recording people/times; defer or explicitly resolve under the agreed authority rules |
| Possible real duplicate | Show both separately recorded payments and their context; require deliberate review |
| Field validation | Specific error next to the field; preserve entries; focus the first error after submission |
| Document pending upload | “On this device · Upload pending”; local file retained until acknowledgment |
| Document available remotely only | “Online only”; Download for offline use; explain availability before trying to open while offline |
| Export failure | Preserve the report/receipt and selection; offer Generate again / Share again as appropriate |

Sync status is device-wide unless explicitly filtered; property summaries must not disguise device-wide pending counts. Show pending counts quietly; reserve prominent banners for actionable failure, rejection, or conflict. A suspected duplicate or conflict must not be presented as ordinary completed synchronization.

Offline reports and statements need an “Includes records available on this device” qualifier when completeness cannot be established, plus the last successful synchronization context. Filtered-out, unavailable, and truly zero are distinct states.

Propose local PDF/CSV generation from available authorized records so sharing can work offline; exact export behavior and completeness rules need confirmation during workflow specification. Use the native share sheet, and show document content/status before sharing. Reports and local exports should clearly identify pending or unresolved data where relevant.

Identity thumbnails are not dashboard decoration. Mask ID numbers in summaries; reveal deliberately where authorized. Avoid exposing document images during routine financial work. Account recovery, local access expiry, sign-out with pending work, local storage cleanup, and backup need explicit workflows after their policies are decided.

## 9. Accessibility, small devices, and native conventions

- Design phone layouts at 320, 360, 390, and 430 logical-unit widths, with small-height and landscape checks. Keep forms single-column; large text can move the amount below the title. Never horizontally scroll a basic ledger to reveal its balance.
- Preserve full tenant names, property/unit context, and money values in review/detail screens. List rows wrap rather than use an ambiguous ellipsis for critical identity. Test long Bengali and Latin names, long unit labels, zero values, BDT 1,250,000.50, and multiple open months.
- Use decimal-capable input for money and suitable keyboards for readings and phone numbers. Support paste. Format on review without silently changing the entered amount. Allow real fractional readings if the meter policy permits; precision/rounding rules are still open.
- Keep native targets at least 44 pt on iOS and 48 dp on Android, with adequate separation. Use the larger custom targets above: 56-unit main form actions and at least 52-unit secondary controls where practical. Screen-reader names include the action's tenant/unit context.
- Design for system font enlargement, including accessibility sizes. Reflow layouts rather than cap text scaling. Ensure VoiceOver/TalkBack order follows visual order, inline changes are announced, and modal focus returns to its opener.
- Target at least 4.5:1 for normal text, 3:1 for large text and meaningful control graphics. Labels, icons, and text distinguish paid, overdue, credit, pending, failed, and conflicting states.
- Support reduced motion, increased contrast/bold text, and light/dark appearance when a corresponding verified theme is provided. Haptic and color signals always have visible text equivalents.
- Use iOS back-swipe and Android system/predictive-back behavior; avoid edge gestures that compete with navigation. Keep safe-area and keyboard clearance throughout. Do not use swipe or long-press as the only path to an important action.
- Use native date pickers, permission prompts, camera/file selection, biometric prompts, and sharing where appropriate. Explain camera/file permission only when invoked. A denied permission leaves a useful alternative or retry path.
- Keep brand colors and content hierarchy consistent while allowing native controls, sheets, typography, and navigation chrome to follow the current OS. Avoid a custom imitation of the other platform.

### Bangla-default bilingual behavior

Complete Bangla and English support is confirmed. Start in Bangla on first launch even if the device language is English. Persist the user's explicit language choice locally; switching, restarting, and reading the interface must work offline. Bundle both language resources and any required fonts; no live translation service is needed to render the app.

Localize all app-owned navigation, labels, actions, help, validation, statuses, dialogs, accessibility labels/announcements, and generated report/receipt text. Translate dynamic phrases as complete messages with appropriate number handling, not fragments pasted together. Keep all business distinctions in both languages. Missing translations are a release defect, not permission to mix English technical strings into the Bangla interface.

Changing language must retain the current record, entered form values, selected billing period, and unsaved draft. Update presentation without duplicating records or changing amounts. User-entered names, notes, identifiers, references, and uploaded document contents remain as entered. Both scripts can occur in one record; do not automatically translate identities.

Native permission prompts, biometric UI, keyboards, and device share/camera/file pickers can follow the phone's language. Configure native locale where supported and translate the app's preceding explanations; do not promise full control of OS-owned text.

Proposed copy for comprehension review:

| English | Bangla |
|---|---|
| Home | শুরু |
| Properties | বাড়ি |
| Ledger | হিসাব |
| Tenants | ভাড়াটিয়া |
| More | আরও |
| Record payment | পাওয়া টাকা লিখুন |
| Amount due | বকেয়া টাকা |
| View bill | বিল দেখুন |
| Enter meter reading | মিটারের রিডিং লিখুন |
| Save | সংরক্ষণ করুন |
| Back / Next | পেছনে / পরবর্তী |
| Saved on this phone · Pending sync | এই ফোনে রাখা আছে। অনলাইনে পাঠানো বাকি। |
| Language | ভাষা |

“পাওয়া টাকা লিখুন” emphasizes recording money already received; it does not suggest an online transfer. Use plain explanations for uncommon financial terms. For notice-period advance, distinguish money held for notice rent from ordinary future-month rent. Do not shorten every credit to the same ambiguous Bangla “অগ্রিম.” Final copy needs Bangla-speaking user review rather than literal word-for-word translation.

Proposed formatting: Bangla UI uses Bengali digits and taka, such as **৳ ৯,২৫২**, and an unambiguous Gregorian date such as **৫ নভেম্বর ২০২৬**. English uses **BDT 9,252** and **5 Nov 2026**. Language selection does not switch billing to the Bengali calendar. Accept both Bengali and Latin digits for money/readings and normalize to the same numeric value; preserve decimals and avoid repeated digit substitution while the person is typing. Do not reformat identity/reference strings as financial numbers. Validate numeral preference and lakh grouping with intended users, including when copying readings from Latin-digit meters; an optional number-style preference can be considered if testing justifies it.

PDFs need correct Bengali shaping and readable embedded/offline font support, not just translated headings. Generated text follows the selected language; original record data remains intact. Treat language and financial locale as presentation choices over the same records. Do not add a second language selector to every routine form.

### Everyday simplicity across age groups

- Keep Home focused on the balance summary, one dominant Record payment action, and a short prioritized attention list. Surface meter entry and bills through named shortcuts, not a grid of many equally weighted tiles.
- Keep the five familiar destinations fixed and labeled. Avoid hidden drawers for daily work, icon-only primary actions, and changing navigation positions with language or permissions.
- Show only necessary fields initially; reveal reference, optional notes, advanced allocation, or history through named controls. Keep the default allocation and its effect visible before save, even when advanced choices are collapsed.
- Prefer recognition over recall: show the tenant/unit and amount at each relevant step; keep current/older dues and held money explicitly labeled. Search by name or unit so people do not need to remember a record number.
- Use clear, persistent outcomes: “saved here” versus “sent online,” actual money received versus waived money, and a refund due versus a refund recorded. Do not depend on technical sync terminology or a brief toast.
- Avoid time-limited form completion, swipe-only actions, unexpected auto-advancement, and unnecessary confirmations on ordinary navigation. Use deliberate review for financial saves and corrections. Save & next moves only after an explicit tap and successful local save.
- Validate on narrow phones with maximum system text, Bengali conjuncts, mixed-script names, long amounts, keyboard open, and offline states. Conduct task-based sessions with participants across approximately 45–70, including people less confident with smartphones, and younger users. Do not assume completion of an accessibility checklist proves ease of use.

## 10. Decisions needed and next design stage

Direction A, Warm Ledger, is approved. Complete Bangla/English support, Bangla default, and straightforward use across younger adults and ages approximately 45–70 are confirmed. Proposed navigation remains **শুরু · বাড়ি · হিসাব · ভাড়াটিয়া · আরও**, with equivalent English labels. Exact labels and detailed layouts need comprehension/usability validation; unresolved business rules remain open.

Before detailed workflow implementation, resolve these in context:

| Design area | Required decision |
|---|---|
| Access and helpers | Authentication/provisioning; exact rights; offline validity/revocation; owner approval while disconnected |
| Billing | Proration, rounding, short-month due dates, finalization rights, future prepayment and unallocated excess |
| Electricity | Meter setup/reassignment; rate cutoffs; resets/replacements; final electricity-credit treatment |
| Corrections and departure | Payment reversal/refund records; finalized corrections; short notice; closure with debt |
| Reporting | Cash-receipt vs allocation cutoffs; opening figures; incomplete/pending exports and receipt identity |
| Device and documents | Backup/recovery; pending-work sign-out; retention/local cleanup; upload limits and protection |
| Language and reading comfort | Final plain-language Bangla/English copy; Bengali font/shaping verification; proposed digit/date/grouping choices; real-device and representative age-range usability |

Next, define low-fidelity flows and then coherent high-fidelity screens for: Home, tenancy account, payment/allocation/receipt, electricity reading/review, departure settlement, and offline/conflict states. Start with Bangla layouts and test the same screens in English, rather than fitting Bangla into an English-only design later. Validate with realistic data before extending the same system across the remaining families. No Figma changes or application code are included in this documentation refinement.

Usability goals for that review: reach contextual payment entry directly from a bill/tenancy; record a routine payment without entering the household twice; complete successive meter readings without returning to the unit list; explain all four balance categories; restart offline without losing a saved record; identify a sync failure without mistaking it for failed cash collection. These are future validation goals, not completed test results.

## 11. Platform references and verification limits

- [Apple: UI Design Dos and Don'ts](https://developer.apple.com/design/tips/) — touch controls, contrast, readable layout.
- [Apple: Tab bars](https://developer.apple.com/design/human-interface-guidelines/tab-bars) — labeled top-level destinations, navigation state, and navigation versus actions.
- [Android: Touch target size](https://support.google.com/accessibility/android/answer/7101858?hl=en) — 48 dp targets and spacing.
- [Android: Predictive back design](https://developer.android.com/design/ui/mobile/guides/patterns/predictive-back) — system back gesture behavior.
- [W3C: Older Users and Accessibility](https://www.w3.org/WAI/older-users/) — vision, dexterity, and other needs that can affect older users; age is not a substitute for representative usability validation.

Reviewed against the documented requirements and glossary. Exact light-theme color pairs were calculated locally. No application, device, screen-reader, user-session, financial-engine, export, or synchronization test was performed. The existing Figma file was not changed. No technology version or component library is selected by this proposal.
