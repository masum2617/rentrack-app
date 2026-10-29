# Warm Ledger design system

Status: approved visual direction; Home draft rendered and visually checked, pending owner feedback. Broader screen layouts and native behavior remain unimplemented. [Reference interpretation](references/ui-reference-analysis.md) records the user's chosen inspiration.

The [Home Figma draft](design/home-review.md) is now rendered and visually checked, but awaits color/UI approval. It uses Noto Sans Bengali and Noto Sans for this review. Runtime font integration and native accessibility checks remain unimplemented.

## Visual language

Use the clear identity/amount hierarchy, search placement, and meaningful white groups from reference images 1–3. The latest reference, image 6, supersedes image 5's navigation treatment and the original forest/warm-neutral palette: pale green header/canvas, white content, sage accents, a raised center Home / হোম destination, and soft shadows. Image 4 supplies secondary section-hierarchy inspiration only.

Keep one purpose and one dominant action per screen step. Group related facts, not every individual value. Use rows/dividers for transactions and white rounded groups for a tenant summary, review block, or cohesive form section. Photography and tenant portraits are not required for ordinary financial work.

## Semantic color tokens

| Role | Light reference |
|---|---|
| Canvas / surface | #F3F8F1 / #FFFFFF |
| Primary / secondary text | #1B2D20 / #526452 |
| Primary action / on-primary | #4D7A50 / #FFFFFF |
| Sage accent / icon on sage | #6B9870 / #FFFFFF |
| Selection surface | #E7F1E5 |
| Decorative divider / required control boundary | #DFE8DD / #73847B |
| Success text / background | #256347 / #EAF2EC |
| Attention text / background | #885400 / #FFF3D6 |
| Error text / background | #B42332 / #FFF0F0 |
| Information text / background | #2E5B83 / #ECF3FA |

Amounts are normally ink, not all green. Paid, due, held advance, applied credit, waived, and pending sync have explicit labels. Color alone does not communicate a financial event.

Current flat-pair calculations: primary button 4.98:1; secondary text/canvas 5.91:1; white icon/sage 3.31:1. Sage is for large graphical accents, not small white text. Input boundary/white retains the earlier 3.95:1 calculation and is not exercised by this Home review. Recheck actual composed states. A pale divider or shadow is not an adequate required input boundary. Define and verify a separate semantic palette before shipping dark appearance.

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

Corners: Home buttons and meaningful grouped surfaces use 20; selectors/language pills and the raised center destination use fully rounded corners. Inputs remain a later screen decision. Use native sheet geometry. The rounded device mockup corners in references are not an instruction to round the entire app viewport.

Apply shared soft elevation to visible content boxes, controls and navigation. In the Home draft, white content sits below a pale green header with rounded upper corners. Related rows share one elevated group; nested text and amount wrappers remain part of that group rather than collecting overlapping shadows.

| Elevation role | Offset x/y | Blur | Shadow color / opacity |
|---|---|---|---|
| Content surface | 0 / 3 | 14 | #34513A / 7% |
| Control or button | 0 / 2 | 7 | #34513A / 6% |
| Bottom navigation | 0 / -3 | 18 | #34513A / 9% |
| Raised center destination | 0 / 0 | 14 | #34513A / 13% |

These are Figma effect definitions. Native iOS/Android shadow rendering must be matched and checked during implementation rather than assumed identical.

## Shared component behavior

Language uses a visible বাংলা / English radio selector, with exactly one filled indicator and selected surface. The Home draft places a compact 180 × 48 selector beside the heading on one header row; each option has a 90 × 48 target, a 16-wide indicator and a readable 16-size label. These dimensions describe the 390-wide draft; allow wrapping/adaptation for narrower screens and enlarged text without shrinking labels. Keep both language names in their own scripts and stable positions.

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


## Occupancy label and Edit-action refinement — 28 October 2026

Show a rental's building name on its own line, with labeled Floor/Unit on a wrapping row beneath it. Use labels rather than arrow paths. Floor rental summaries show Unit followed by a separate Rented by line. Keep app-owned labels bilingual and user-entered names unchanged.

Edit actions use the shared 52 × 52 rounded pencil button, a 24px icon and a contextual translated accessibility label. Descriptive form headings remain text. Tenant-name links use a compact selected-green background, 12px corner radius, horizontal padding and a minimum 48px height; the complete label is “ভাড়া আছেন: {name}” / “Rented by: {name}”. No underline is used. Long content may wrap without shrinking type or the touch target.

## Step 10B live Home

The existing green/white layout, scalable typography, soft groups and compact language selector are retained. Removed Home's demo badge/note and inactive meter reminder; period-specific labels, actual overdue/draft attention and real financial values take their place. Database errors use explicit error/Retry instead of zero. Native wrapping/screen-reader acceptance for the live content remains pending.
