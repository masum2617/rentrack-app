# Navigation and context

Status: the latest green/white reference (image 6) supersedes image 5's bottom-bar treatment. The Home draft applies the raised center style. Five destination names/count remain working proposals to validate in Bangla and large text.

## Primary destinations

| English / Bangla | Purpose | Main screen spec |
|---|---|---|
| Ledger / হিসাব | Dues, bills, actual receipts | [Ledger](screens/bills-and-ledger.md) |
| Properties / বাড়ি | Buildings, units, occupancy, property electricity | [Properties](screens/properties-and-units.md) |
| Home / হোম | Center destination: summary and next useful task | [Home](screens/home.md) |
| Tenants / ভাড়াটিয়া | Identity, documents, rental history | [Tenants](screens/tenants-and-documents.md) |
| More / আরও | Reports, language, device/account and owner management | [Access/settings](screens/access-and-settings.md) |

Image 5 contains four marketplace destinations. Adopt its icon-and-label treatment, not its Search/Listings/booking information architecture. Retain direct tenant lookup in the current five-tab proposal and validate space rather than silently hiding or shrinking labels.

## Bottom bar

White bar anchored above the system safe area, softly elevated, with equal horizontal destination slots and persistent icon labels. Use the latest reference's raised green center circle with a white halo. The raised center is Home / হোম with a house icon, as explicitly requested in the latest feedback. Ledger / হিসাব occupies the leftmost slot. The order is Ledger → Properties → Home → Tenants → More in both languages. Home is labeled হোম, not শুরু. Inactive text remains readable.

The current 390-wide draft uses 70-wide slots, a 70-diameter center halo including a 7-wide white ring, and a center item raised 26 above the normal item row. Its label aligns with the other labels. Raised geometry indicates stable placement, not selected state; actual selected destination must remain explicit. Keep scroll-end clearance below the raised item and adapt for text scaling/safe areas in native implementation.

Keep tab positions stable across language, occupancy, and permissions. An empty destination explains what is missing. Owner-only controls can be absent inside More for helpers without changing tab order.

## Routes and return behavior

A single navigation owner maintains the route registry and entry parameters. The app uses React Navigation bottom tabs, with a native stack for Properties list/details. Feature screens consume that navigation instead of adding a second routing system. Access guards and deep-link handling remain future work.

Each destination retains its navigation and list/filter state. Detail links preserve the source and return predictably. Full-screen focused financial flows can temporarily cover primary navigation, with visible Back/Cancel and safe draft handling. Native system/back-swipe behavior remains consistent.

Use sheets for short choices, not long payment/tenancy/settlement flows or stacked forms. Core actions are reachable through labeled controls; swipe/long-press are optional accelerators only.

## Scope

Home/Ledger/Reports display the financial property and period scope. A property detail does not silently change a global financial filter. A launched form inherits context visibly and confirms tenancy identity where ambiguous.

Receipt-date range, billing month, due date, and all-month outstanding are distinct concepts. Sync queue is device-wide unless explicitly filtered. Offline unavailable data is not zero.

Electricity lives under property → main meter, with Home and bill-review shortcuts. Reports live under More, with links from relevant summaries. The language selector is visible on Home, sign-in and near the top of More. Show বাংলা and English together as one mutually exclusive radio group, with exactly one selected language. Each option is a full labeled touch target; do not use two independent on/off switches. Bangla is the initial selection; later explicit selection persists locally.


## Step 2 implementation

One React Navigation bottom-tabs navigator starts at Home and renders a custom raised-center bar. Tapping the active Home returns its scroll view to the top. Other tabs show an explicit unavailable view with return-to-Home. More exposes sample/empty controls only under __DEV__. These are navigation scaffolding, not delivered Ledger/Property/Tenant/Settings workflows. Locale and Home filter state are preserved during ordinary tab switches. See localization-accessibility.md for the tab-label scaling compromise.

## Step 6A implementation

Properties now contains HouseList → HouseDetails in a two-screen native stack. Details receives a house ID and reads its current records. House/floor forms use full-screen Modals covering the tabs, with guarded Back and keyboard-aware entry. New-house Save opens details; house edits return to their originating list/details; floor Save returns to the same house's refreshed floor list. List search/scroll survives ordinary detail navigation. Home's setup shortcut enters the same house-create flow. Unit actions show an explicit next-step message. Ledger, Tenants and the broader More workflows remain scaffolding.

## Implemented Step 7 navigation

Tenants now opens a real SQLite directory. Add/Edit uses one full-screen Modal over the tabs; Save awaits storage, closes and refreshes the directory, preserving search. Back prompts for dirty fields, including hidden optional details. Tenant rows offer explicit Edit; no unfinished profile/tenancy action is presented. Properties already uses HouseList → HouseDetails → FloorDetails with inherited IDs; unit forms inherit their selected floor/house.

## Step 8 navigation

Properties stack is HouseList → HouseDetails → FloorDetails → UnitDetails. UnitDetails takes a unit ID and reads parent context/current rental. Setup/correction use one full-screen Modal: Choose existing tenant → Terms → Review (correction skips Choose). Stage Back preserves the draft; Close or leaving the first stage confirms unsaved changes. Save closes only after SQLite success and refreshes floor occupancy/unit details without resetting list search/scroll. No new bottom destination is added.

## Tenant context links from Properties

Floor-unit cards and Unit details open the shared TenantForm Modal with `tenantId` and originating `selectedUnitId`. The underlying Properties route/search/scroll stays mounted. The editor reads current records, highlights that rental first and closes to its origin after Save/Back. Tenant-list Edit uses the same ID loader without a selected unit. The identity form keeps a single native Modal while loader/error/body states change. No new tab or separate tenant-profile route is added.

## Step 9A bill navigation

Ledger uses Bills → BillDetails. Properties adds UnitBills(tenancyId) → BillDetails(billId) from Unit details. Shared screen implementations use ID reads and preserve their originating stacks/filter state. Draft/void forms are full-screen Modals; Save closes after SQL success, refreshes affected readers and opens the saved detail. A replacement switches to its new bill ID, with the original voided version still accessible through lists. No new bottom tab is added.

## Step 9B charge-settings entry

Unit details retains Properties selection and opens charge history/editor in one full-screen Modal, covering tabs. Settings editor Back returns to history with dirty confirmation; history Back returns to the same unit. Tenancy setup includes optional initial charges in Terms/Review. Bill navigation/filter ownership is unchanged; drafts use existing review/details routes with itemized lines.

## Step 10A payment routes

Properties and Ledger register PaymentHistory(tenancyId, optional billId) and PaymentReceipt(paymentId). Unit/Bill payment actions open a full-screen Entry/Review Modal and navigate to the shared receipt only after durable save. Bill histories filter related receipts, including reversed multi-bill payments. History/receipt Back follows the original stack; bill filters and scroll remain mounted. Reversal is a focused full-screen form covering tabs. No new tab or separate financial navigation system is added.

## Step 10B Home integration

Home shortcuts send an explicit property/month/status request to Ledger. A new request initializes a keyed list; ordinary tab return and Bill-detail Back retain local list filters/scroll. Outstanding and overdue are all-month scopes, drafts use selected month. Home payment chooser → existing payment Modal → existing receipt Modal stays owned by Home; closing receipt returns there. Shared revisions reload Home after changes, and the payment flow remains mounted outside summary loading/error branches. More no longer receives fixture-preview controls.
