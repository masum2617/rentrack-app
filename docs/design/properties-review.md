# Step 5 — Properties design review

Status: editable Figma draft created 27 October 2026; owner subsequently authorized Step 5 implementation. Native list/form and local persistence are implemented; see the delivery log for actual verification. The board remains the visual reference.

[Open the full review board](https://www.figma.com/design/NbtxYyU5l1j2QSLTRBioUL?node-id=38-128)

The new `02 · Properties review` page is in the same file as the approved Home. Home was preserved. There are two layout families, not separate Add and Edit designs:

| View | Node |
|---|---|
| Property list, Bangla | `40:365` |
| Shared house form, Bangla | `40:432` |
| Same list, English fit | `40:481` |
| Same form, English fit | `40:546` |

## Content and behavior

Property means the whole house. The list uses fictional রহমান বাড়ি and শান্তি নিবাস records, search by name/location/address, the exact `নতুন বাড়ি` action and labeled `এডিট` controls. It retains the five destinations with Properties selected and raised Home in the center. No unit, floor or occupancy counts appear.

The focused form has only required house name, required location and optional multiline address. Labels remain visible; empty Add values have example placeholders. Edit uses the same composition with a changed heading and filled values, demonstrated in the supporting gallery. The form has Back and Save, no tabs, and a centered gesture indicator.

Shared component variants demonstrate empty list, no matches, loading, retry, input focus/error, filled Edit inputs, saving, failed save with retained input, and leaving unsaved changes. Keyboard behavior is annotated: scroll the form and keep Save reachable above the native keyboard. Actual keyboard handling, persistence, screen-reader behavior and device layout remain implementation checks; this static board does not simulate typing or saving.

## Design and verification

Reused approved green/white color variables, Noto Sans Bengali/Noto Sans styles, soft-elevation styles, button instances and the Home navigation components. Added scoped input-boundary/error tokens and local house-row/field/list-state/screen components. Main layouts are 390 × 844, with the same components used for English fit checks.

Read-back of the board found 281 descendants: 114 text nodes, 76 frames, 65 instances, 22 vectors and four rectangles. No image-filled nodes occur in the board. The font-family check returned only Noto Sans Bengali and Noto Sans. The composition screenshot was inspected; a compact-state button overflow and the form gesture alignment were repaired and the corrected screenshot passed visual review.

## Review before implementation

Review the hierarchy, Bangla wording, house-row/Edit targets, input spacing and Save placement. Floor and unit screens are deferred: the agreed next structure is House → Named floor → Rental unit. Unit room/bathroom/balcony/size details belong there, not in this house form.
