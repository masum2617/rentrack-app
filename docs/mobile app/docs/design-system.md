# Warm Ledger design system

Status: approved visual direction; working component/layout specifications, not rendered or tested screens. [Reference interpretation](references/ui-reference-analysis.md) records the user's chosen inspiration.

## Visual language

Use the clear identity/amount hierarchy, search placement, and meaningful white groups from reference images 1–3. Use image 5's white bottom bar and compact green selected-icon treatment. Preserve the app's restrained warm palette. Image 4 supplies secondary section-hierarchy inspiration only.

Keep one purpose and one dominant action per screen step. Group related facts, not every individual value. Use rows/dividers for transactions and white rounded groups for a tenant summary, review block, or cohesive form section. Photography and tenant portraits are not required for ordinary financial work.

## Semantic color tokens

| Role | Light reference |
|---|---|
| Canvas / surface | #F7F7F2 / #FFFFFF |
| Primary / secondary text | #172B26 / #52635C |
| Primary action / on-primary | #235B47 / #FFFFFF |
| Selection surface | #EAF2EC |
| Decorative divider / required control boundary | #D8DFD9 / #73847B |
| Success text / background | #256347 / #EAF2EC |
| Attention text / background | #885400 / #FFF3D6 |
| Error text / background | #B42332 / #FFF0F0 |
| Information text / background | #2E5B83 / #ECF3FA |

Amounts are normally ink, not all green. Paid, due, held advance, applied credit, waived, and pending sync have explicit labels. Color alone does not communicate a financial event.

Prior flat-pair calculations: primary button 7.90:1; secondary text/canvas 5.93:1; input boundary/white 3.95:1. Recheck actual composed states. A pale divider is not an adequate required input boundary. Define and verify a separate semantic palette before shipping dark appearance.

## Type and geometry

Use an offline-available Bengali-capable sans-serif with verified conjuncts and vowel marks. Final face remains unselected; English can use platform system type. Follow [localization/accessibility](localization-accessibility.md).

| Role | Initial logical size / line height |
|---|---|
| Principal balance | 30 / 40, semibold |
| Screen heading | 28 / 38, semibold |
| Section heading | 22 / 32, semibold |
| Body / primary row | 18 / 28, regular / medium |
| Field label / supporting explanation | 16 / 24 |
| Nonessential metadata | 14 / 22 |
| Navigation label | Target 14 / 20 where native layout supports it |

These are validation targets, not fixed heights or guarantees. Essential review facts stay at body size. Use tabular figures where supported, aligned amount columns, and enough room for full values. Avoid forced Bengali tracking and shrinking type to fit.

Spacing scale: 4, 8, 12, 16, 24, 32, 48. Phone gutters: 16, increasing to 20 on wider phones. Section gap: 24. Related controls: 8–12. Main buttons/fields: 56 minimum, growing with text. Custom secondary targets: at least 52 where practical; native minimums: 44 pt iOS / 48 dp Android. Typical two-line rows start at 80 and grow.

Corners: 8 buttons, 10 inputs, 12 meaningful grouped surfaces. Use native sheet geometry. Reserve shadows for functional elevation. The rounded device mockup corners in references are not an instruction to round the entire app viewport.

## Shared component behavior

- Buttons use explicit verbs, pressed feedback, readable disabled/progress states, and duplicate-submit protection. Saving finishes only after the relevant local write succeeds.
- Fields have persistent labels, suitable keyboards, retained input, inline errors, and focused error handling after submission. Selectors visibly indicate selection behavior.
- Ledger rows show title/context, amount, period/date meaning, and labeled business state; sync state remains separate.
- Review blocks show tenant/unit, exact amount, actual receipt date/method, allocation, and resulting dues.
- A Paid state is a status, not a primary button. Corrective or destructive actions are clearly named and deliberately reviewed.
- Icons use a consistent vector family for custom content; native symbols can remain in native controls. Icon-only secondary controls have accessible names and adequate targets.
- Search describes its scope, such as name or unit. Filters show active choices, Apply, and Clear. Optional fields are progressively disclosed.
- Fixed actions respect safe areas, keyboard clearance, and the last scroll row.

Keep custom motion brief and functional; respect reduced motion. No animated balances, decorative gradients, or essential gesture-only controls. Native navigation retains platform behavior.

The theme and shared-UI owners implement these once when requested. Screen agents consume shared primitives; any necessary variation is a documented component variant, not an unrelated per-screen style.

