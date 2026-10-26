# Source instructions

Read [app instructions](../AGENTS.md) and [architecture](../docs/architecture.md) before implementation.

This tree contains the Home demo, shared theme/UI, SQLite-backed locale and Step 5 house list/create/edit. Properties owns its validation, direct SQL and screens; platform owns schema upgrades. Other domain directories remain placeholders. Read the current delivery log before expanding scope.

Feature business behavior stays inside its owning feature. Application wires dependencies; navigation registers routes; theme/i18n/shared UI provide consistent presentation; platform supplies local/remote integrations.

Follow [agent workflow](../docs/agent-workflow.md) for shared paths and [verification](../docs/verification.md) for evidence. Implement only the requested slice, adding internal layers when they have concrete work to do.

