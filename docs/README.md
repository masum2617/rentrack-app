# Documentation ownership and reading map

## Source of truth

| Subject | Working authority |
|---|---|
| Business scope, rules, examples, acceptance A01–A24, open policies | [Product requirements](product-requirements.md) |
| Business vocabulary | [Glossary](../GLOSSARY.md) |
| Accepted offline-client trade-off | [ADR 0001](adr/0001-offline-mobile-client.md) |
| Module ownership and dependencies | [Architecture](architecture.md), then the relevant file in [domains](domains/README.md) |
| Visual tokens and components | [Design system](design-system.md) |
| Destinations, navigation behavior, route ownership | [Navigation](navigation.md) |
| Bangla/English and inclusive usability | [Localization/accessibility](localization-accessibility.md) |
| Screen behavior and coverage | [Screen index](screens/README.md) and the relevant screen family |
| Task splitting, ownership, coordination and handoff | [Agent workflow](agent-workflow.md) |
| Incremental build order and Home-first milestone | [Implementation roadmap](implementation-roadmap.md) |
| Current Home Figma draft and review evidence | [Home review](design/home-review.md) |
| Actual delivery progress and presentation evidence | [Delivery log](delivery-log.md) |
| Verification appropriate to each change | [Verification](verification.md) |
| Interpretation of the supplied images | [UI reference analysis](references/ui-reference-analysis.md) |

Requirements own what the business means. Domain files identify where the behavior belongs. Screen files specify how a user reaches that behavior. They link to requirements rather than redefine the arithmetic or unresolved policies.

The user's latest instruction outranks these files. If documents disagree, identify the exact disagreement, apply the current user decision, and update the owning document plus affected references together. Do not silently pick a screenshot over a business rule.

## Status vocabulary

- **Confirmed:** directly agreed product requirement or visual direction.
- **Working convention:** repository organization and agent process established for this app.
- **Proposed:** labels, measurements, or interaction details needing validation; not a new business rule.
- **Open:** unanswered policy in product requirements §11.
- **Historical:** discovery, older UX exploration, and prototype narrative under references. Consult for rationale only.

Warm Ledger, Bangla default/full English support, and easy use across the stated age range are confirmed. The last image's bottom-bar style is the chosen reference; the proposed five destinations and exact labels remain to be validated. Folder organization is a working convention. No screen is implemented simply because it has a specification.

## Small reading sets

- Screen task: AGENTS → affected requirements/glossary → architecture/domain → screen family → design/navigation/localization.
- Calculation or persistence task: AGENTS → affected requirements/domain → architecture/platform guidance → relevant verification.
- Documentation-only task: owning specification plus inbound links and affected cross-references.
- Historical rationale: references only when current working documents do not answer the question.
- First-screen implementation: start with the [planned Home task](work-items/home-foundation.md) and the roadmap; explain actual work in [external learning notes](../../learning-notes/README.md) and record verified delivery in the log.

