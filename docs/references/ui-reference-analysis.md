# Interpretation of supplied UI references

Source: six user-supplied screenshots, retained here for design review. Exact fonts, sizes, motion, touch targets, contrast, and behavior cannot be established from these scaled still images. These images are not runtime assets or a grant to copy third-party imagery into the product.

| Reference | Role |
|---|---|
| [1 — billing and leases](ui/01-billing-and-leases.png) | Internal-screen hierarchy, aligned amounts, search and grouped financial content |
| [2 — tenants and forms](ui/02-tenants-and-forms.png) | Identity hierarchy, repeatable tenant groups, labeled forms |
| [3 — properties and overview](ui/03-properties-and-overview.png) | Section rhythm and property/tenant context |
| [4 — property details](ui/04-property-details.png) | Secondary inspiration for clear section hierarchy; not the requested primary internal-screen reference |
| [5 — navigation](ui/05-navigation.png) | Earlier navigation reference; its selected-icon treatment is superseded by image 6 |
| [6 — green and raised navigation](ui/06-green-raised-navigation.png) | Latest user-selected palette, bottom navigation and soft-shadow reference |

## Adopt

From images 1–3: consistent content edges, names/amounts above metadata, right-aligned financial values, search before lists, and white groups for related information. Adapt the density for readable Bangla and older users.

From image 6: pale green header/canvas, white body and content boxes, sage accents, soft shadows, and a white bottom bar with a raised green center destination. Retain evenly spaced icons and visible labels. Latest owner feedback assigns the raised center to Home / হোম with a house icon, and moves Ledger to the leftmost slot. Both বাংলা and English are shown as mutually exclusive radio-style language choices.

This latest instruction revises Warm Ledger's palette and elevation while retaining its financial hierarchy. Meaningful groups have white rounded surfaces and subtle shared shadows; related transaction rows use spacing/dividers within their group. Use darker green for white button text and readable labels. Premium quality comes from alignment, legibility, consistency, and truthful feedback.

## Adapt or reject

- The source has four marketplace tabs; app navigation remains the separate five-destination working proposal, validated for Bangla/large text.
- Replace small supporting text, pale critical labels, ambiguous icons, and several equally dominant actions with comfortable reading and one main action.
- Paid is a status. A dash-bordered panel is appropriate for adding a document, not a repeated giant thumbnail for every file.
- Keep property identity and operational facts ahead of photography. A building is not a flat with one monthly price.
- Use occupied/vacant/tenancy context rather than marketplace Live/Non-Live labels.
- Keep destruction/correction out of small photo overlays. Financial changes require the relevant domain workflow.
- A charge creates explained dues; an Add Due button cannot directly edit a free-standing total.
- Reminders, tours, booking, marketplace income filters, and expense/profit dashboards are outside the agreed scope.
- Native gestures, errors, offline behavior, and accessibility require independent design/verification; still images do not prove them.

The user authorized the Home-only Figma draft and this visual revision. Application code remains deferred. [Design system](../design-system.md) and [navigation](../navigation.md) contain the current interpretation for future feature tasks.

