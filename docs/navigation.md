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

A single navigation owner maintains the eventual route registry, entry parameters, access guards, and deep-link handling. No concrete router library or route IDs are implemented yet. Feature agents provide screens and requested entries; they do not each create another application navigator.

Each destination retains its navigation and list/filter state. Detail links preserve the source and return predictably. Full-screen focused financial flows can temporarily cover primary navigation, with visible Back/Cancel and safe draft handling. Native system/back-swipe behavior remains consistent.

Use sheets for short choices, not long payment/tenancy/settlement flows or stacked forms. Core actions are reachable through labeled controls; swipe/long-press are optional accelerators only.

## Scope

Home/Ledger/Reports display the financial property and period scope. A property detail does not silently change a global financial filter. A launched form inherits context visibly and confirms tenancy identity where ambiguous.

Receipt-date range, billing month, due date, and all-month outstanding are distinct concepts. Sync queue is device-wide unless explicitly filtered. Offline unavailable data is not zero.

Electricity lives under property → main meter, with Home and bill-review shortcuts. Reports live under More, with links from relevant summaries. The language selector is visible on Home, sign-in and near the top of More. Show বাংলা and English together as one mutually exclusive radio group, with exactly one selected language. Each option is a full labeled touch target; do not use two independent on/off switches. Bangla is the initial selection; later explicit selection persists locally.

