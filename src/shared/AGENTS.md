# Shared primitives

Read [design system](../../docs/design-system.md), [localization/accessibility](../../docs/localization-accessibility.md), and [architecture](../../docs/architecture.md).

Shared UI renders reusable controls/states with semantic roles, scalable text and adequate targets; it does not fetch tenant records, own feature navigation, or perform business mutations.

Shared money supplies the chosen exact representation and basic operations once specified. Domain policies such as advance use, allocation, proration and rounding decisions belong to the relevant owning specification/feature.

Coordinate new variants and interface changes with the named shared writer. Prefer a justified shared primitive over separate lookalike controls in each screen, without extracting every one-off layout.

