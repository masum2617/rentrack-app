# Home-only Figma review

Status: draft ready for the owner's color/UI review; application implementation and backend connection have not started. Created 23 October 2026.

[Open the Home review board](https://www.figma.com/design/NbtxYyU5l1j2QSLTRBioUL?node-id=3-202)

This is a new Figma Design file in the connected team workspace. The older 56-frame prototype was not edited. The tool created a design file; no separate Figma project container was created.

## Review inventory

| View | Node ID | Purpose |
|---|---|---|
| Home / BN / Populated | 6:964 | Bangla-default Home hierarchy with fictional portfolio |
| Home / EN / Populated | 6:1075 | Equivalent English content and layout |
| Home / BN / Empty | 6:1184 | First property setup without fabricated zero balances |

The frames are 390 × 844. Language controls and financial actions are represented visually; this board is a static design review, not a connected navigation prototype or a working financial app.

[Exported board preview](home-review.png)

## Applied direction

References 1–3 inform the internal hierarchy: contextual selectors, a white financial summary, aligned amounts, and grouped attention rows. The latest green/white reference (image 6) supersedes reference 5's compact navigation treatment: a raised circular Home / হোম tab with a house icon sits in a white halo above the white bar. Ledger is leftmost and all five labels remain visible. Marketplace and QR-scanning features were not added.

The revised palette uses pale green #F3F8F1, white #FFFFFF, primary action green #4D7A50, sage #6B9870, ink #1B2D20 and muted #526452. Soft shared shadows elevate content groups, selectors, language controls, buttons and navigation. Noto Sans Bengali is used for Bangla and Noto Sans for English. Runtime fonts and native rendering remain to be verified when coding is authorized.

The sample portfolio shows two properties/twelve units, ten occupied/two vacant, October billed 120,000, October money received 90,000, and all-month outstanding 36,000. These are fictional illustration values; the figures describe different measures and are not evidence of an implemented ledger. The board and summary label demo data explicitly.

The language selector shows both বাংলা and English with radio indicators and exactly one selected option. Bangla is selected in the default/empty frames and English in the English frame. Each choice has a 90 × 48 target within a compact 180 × 48 selector beside the heading. The header uses a single horizontal row, with the portfolio subtitle under the title. At 390-wide review size, headings and language labels fit without clipping; narrow screens and enlarged text still require native validation. The controls remain a static visual specification.

## Editability and visual verification

Read-back after the Home/language revision counted 288 descendants: 82 text nodes, 99 frames, 60 component instances, 34 vectors, 3 ellipses and 10 rectangles. No image-filled nodes occur inside the design. Shared local metric/attention/navigation components and imported compatible button/icons support editing. Scoped tokens and Bengali/English text styles were created; compatible library spacing was reused.

The latest exported composition was visually inspected. All three center tabs show the house icon and হোম / Home label; Ledger remains available at the left. Both language options are visible with the correct selected indicator in each view. Primary action labels remain on one line. Read-back confirms 82 text nodes and 60 instances, with zero image-filled nodes. Flat color checks give 4.98:1 for white primary-button text and 3.31:1 for the white center icon. This is visual/structural verification, not a native screen-reader, device, persistence or integration test.

## Feedback before code

Review the green and neutral palette, summary emphasis, information density, Bangla wording, button label, and bottom bar. Exact labels and visual details can be revised in this file. No application bootstrap, SQLite work, Spring Boot connection, or additional screen design should follow without the user's next instruction.

The [delivery log](../delivery-log.md) records this outcome and [external lesson 01](../../../learning-notes/01-home-figma-review.md) explains the design-to-code distinction.

