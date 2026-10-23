> Historical reference, retained on 23 October 2026. Working requirements and guidance are indexed in [the documentation index](../README.md). This record is not a competing specification.

# Clickable mobile design prototype

Status: design work on hold at the owner's request, 23 October 2026. Use `docs/requirements-analysis.md` as the consolidated business baseline; the prototype is supporting material and does not finalize production layouts or route counts.

Figma: https://www.figma.com/design/kl5HodbFYkhAkPatuIbCTB

Start the clickable walkthrough: https://www.figma.com/proto/kl5HodbFYkhAkPatuIbCTB?node-id=5-2&starting-point-node-id=5%3A2

The file contains 56 editable phone screens/states, including three dashboard information hierarchies. Five-tab navigation and task actions are connected. Screen/link metadata is saved in `figma-screen-state.json`.

Verification: all 56 frames are populated at 390 × 844; the connector audit found 502 node-navigation reactions, no invalid destinations, the intended Manrope/Inter fonts, and no flattened UI images. Dashboard, electricity settlement, and payment entry were visually inspected after correcting surface and layout issues. A Figma browser playback session, native behavior, live uploads, exports, authentication, database persistence, and server synchronization were not tested.

This is an editable, clickable Figma Design prototype for reviewing the app's navigation, information hierarchy, and agreed financial workflows. It uses fictional sample records and prefilled forms. Camera, file upload, authentication, PDF/CSV sharing, calculations, and synchronization are represented by design states; this prototype does not implement those services or store real records.

The production direction remains React Native, Expo, SQLite, Spring Boot, PostgreSQL, and private file storage. No production application code is created by the Figma generation scripts.

## Review scenarios

1. Create a property, rental unit, tenant, and tenancy with rent and notice-period advance terms.
2. Review identity fields and camera/file document-upload states.
3. Set recurring and one-off charges and dated opening balances.
4. Prepare a monthly bill; record a late, partial payment and explicitly allocate it while leaving old dues outstanding.
5. Calculate 11,200 - 11,131 = 69 kWh, at BDT 8/kWh = BDT 552. Apply BDT 500 recharge contribution for BDT 52 due, or inspect a separate BDT 1,000 contribution example for BDT 448 credit.
6. Inspect held notice-period advance separately from ordinary future-month rent prepayments.
7. Review a departure scenario where final rent is BDT 22,000, original advance is BDT 20,000, and the owner waives the BDT 2,000 difference.
8. View statements, receipts, reporting, helper permissions, offline changes, conflict review, and successful-sync states.

## Sample financial records

The November sample bill has rent 10,000 + water 500 + service 700 + electricity 552 = BDT 11,752 gross charges. A BDT 500 main-meter recharge contribution is applied only to electricity, leaving BDT 11,252 payable for November. A BDT 5,000 payment allocated to November leaves BDT 6,252 current dues plus BDT 3,000 older dues = BDT 9,252 outstanding. Notice-period advance of BDT 20,000 stays separate.

Departure and excess-electricity-credit examples are separate scenario snapshots; they are not further transactions against the November sample bill. Dashboard totals describe a wider fictional portfolio.

## Design provenance

No existing source UI, Code Connect mappings, or product typography existed in the workspace. The new Figma file was inspected before composition. Existing Simple Design System buttons, fields, neutral colors, spacing, and radii were discovered for reuse. A small local family of ledger rows, financial metrics, and notices supplies app-specific repeated content. Manrope is the chosen app typography; imported controls retain Inter.

The local UI search returned marketing-page patterns twice, so those patterns and decorative typography were rejected. The composition uses general mobile usability guidance: legible amounts, labeled statuses, five primary destinations, generous touch targets, and scrollable forms.
