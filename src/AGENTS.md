# Source instructions

Read [app instructions](../AGENTS.md) and [architecture](../docs/architecture.md) before implementation.

This tree contains the Step 3 Home demo/empty presentation, shared theme/UI, bilingual locale state backed by one SQLite device preference, and one navigation shell. Other domain directories remain placeholders. Do not treat directory presence as working functionality.

Feature business behavior stays inside its owning feature. Application wires dependencies; navigation registers routes; theme/i18n/shared UI provide consistent presentation; platform supplies local/remote integrations.

Follow [agent workflow](../docs/agent-workflow.md) for shared paths and [verification](../docs/verification.md) for evidence. Implement only the requested slice, adding internal layers when they have concrete work to do.

