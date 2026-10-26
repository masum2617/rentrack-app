# Agent instructions — mobile application

## Start each task

1. Read the user's latest scope and [documentation ownership](docs/README.md). Inspect existing files, applicable nested AGENTS.md files, and Git status when Git exists.
2. Read [product requirements](docs/product-requirements.md) for the affected rules, [glossary](GLOSSARY.md), [architecture](docs/architecture.md), and the relevant domain/screen spec.
3. For visible UI, also read [design system](docs/design-system.md), [navigation](docs/navigation.md), and [localization/accessibility](docs/localization-accessibility.md).
4. Work through [agent workflow](docs/agent-workflow.md). For parallel work, claim disjoint paths and agree interfaces before implementation.

For incremental implementation, read [the roadmap](docs/implementation-roadmap.md) and current [delivery log](docs/delivery-log.md). The user is learning React Native/Expo/SQLite: explain one small runnable checkpoint at a time, write concepts/file flow/why in [learning notes outside this project](../learning-notes/README.md), and append verified outcomes/limitations to the delivery log. Those lessons explain the implementation; working business/design authority remains in this project's specifications.

Completion of preparation means the affected rule, screen purpose, dependencies, open decisions, and file owner are identified. Read relevant sections rather than loading every historical document.

## Product guardrails

- Use Property → rental unit → tenancy; preserve tenant identity and past rental history.
- Keep amount due, notice-period advance, rent prepayment, and electricity credit distinct.
- Record actual receipts separately from contributions, advance applications, waivers, and refunds. Use the same underlying charge balance across screens.
- Preserve finalized historical terms and explain financial changes.
- Persist offline work before saying saved; server acknowledgment is a separate state. Retries preserve operation identity.
- Provide Bangla by default and complete English support, including offline resources. Use the same accessible layout for all age groups.
- Apply Warm Ledger's clear financial hierarchy with images 1–3 as internal-screen inspiration. The latest green/white reference (image 6) controls palette, soft elevation, and raised-center bottom navigation. Read [reference interpretation](docs/references/ui-reference-analysis.md) before visible UI changes.
- Keep unresolved rules visible in product requirements §11. Ask only for a decision needed by the current branch; proceed with unaffected authorized work.

## Code organization when implementation is requested

Use small public feature interfaces and domain-owned behavior. Follow [architecture](docs/architecture.md) rather than adding generic base classes, a global collection of business helpers, or a separate financial engine per screen.

Shared UI, theme, navigation, platform persistence/sync, locale infrastructure, package/configuration files, and cross-feature interfaces have one named writer per task. Feature agents reuse them or request a coordinated change.

Use the installed Postman tooling and applicable API-engineering skill when a task designs, implements, or tests APIs. Reuse existing contracts before creating new ones. The current skeleton does not define API endpoints.

## Finish

Run the checks relevant to the actual change using [verification](docs/verification.md). Update the owning spec if behavior changes and return the [handoff](docs/templates/feature-task.md) evidence: changed files, verified outcomes, limitations, dependencies, and open decisions.

Existing user authorization carries forward. Do not add per-screen approval gates or repeat approved direction/language questions. New work remains limited to what the user requested; commits, publication, deployment, and messages to others require their applicable authorization.

Current baseline: Step 5 local house list/create/edit plus the bilingual Home demo and persisted locale. Read the README and delivery log for commands and evidence. Step 6 introduces house details, named floors and units; backend, financial workflows and sync remain later slices.

