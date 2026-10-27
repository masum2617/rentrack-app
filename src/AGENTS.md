# Source instructions

Read [app instructions](../AGENTS.md) and [architecture](../docs/architecture.md) before implementation.

This tree contains the Home demo, shared theme/UI, SQLite-backed locale and Step 6A house list/details plus house/floor create/edit. Properties owns validation, direct SQL and screens; platform owns schema upgrades. Properties navigation uses a two-screen native stack and full-screen Modal forms. Units and other domains remain placeholders. Read the delivery log before expanding scope.

Feature business behavior stays inside its owning feature. Application wires dependencies; navigation registers routes; theme/i18n/shared UI provide consistent presentation; platform supplies local/remote integrations.

Follow [agent workflow](../docs/agent-workflow.md) for shared paths and [verification](../docs/verification.md) for evidence. Implement only the requested slice, adding internal layers when they have concrete work to do.

