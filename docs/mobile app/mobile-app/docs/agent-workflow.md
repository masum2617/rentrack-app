# Feature delivery and parallel agent workflow

## Ordered delivery

1. **Frame:** identify the requested outcome, affected acceptance IDs, domain, screen family, required state coverage, and the applicable open policies. Done when scope and exclusions can be stated concretely.
2. **Inspect:** read the nearest working implementation, public interfaces, and actual commands/configuration. In this skeleton, record that there is no implementation to imitate.
3. **Agree the seam:** for cross-feature work, document inputs/outputs, scope/IDs, errors, local-save/sync outcomes, and ownership in a work item. Done when callers can build without guessing about another agent's private files.
4. **Assign:** coordinator names one writer per owned path and shared contract. Done when every concurrent task has non-overlapping allowed paths and a clear integration dependency.
5. **Implement the authorized slice:** complete the relevant user flow using common UI/tokens/locale resources and domain-owned behavior. If policy is missing, isolate that dependent branch and ask while continuing independent work.
6. **Verify and integrate:** contributors check their slice; coordinator verifies connected behavior and shared consistency. Completion follows [verification](verification.md), not screenshots alone.
7. **Handoff:** update the affected spec and provide evidence, limits, and remaining decisions. Do not mark a draft or disconnected screen as a completed feature.

Use [the task template](templates/feature-task.md) for a multi-file or delegated task. A trivial localized adjustment does not need a large task document.

## Parallel work rules

Use multiple agents only when the task and runtime authorize it and the work is meaningfully independent. A domain-driven folder layout does not require spawning agents for every change.

The coordinator owns scope, task assignment, the work-item index, shared interfaces, integration order, and final verification. Each contributor owns one task file and only its assigned implementation paths.

Shared-writer paths include navigation, theme, i18n infrastructure, shared UI/money, platform persistence/sync, dependencies/configuration, migrations, and canonical requirements. Assign a named writer for the specific files; no agent independently edits them because its screen needs a change.

Feature-local translation resources can be separate per feature in both languages. A single i18n owner registers them; feature agents do not concurrently edit a central locale file. The resource layout is finalized at bootstrap.

If two agents need the same feature file, split by disjoint subpaths or run those changes sequentially. A second screen is not automatically independent just because its filename differs.

## Example split

| Workstream | Owned work | Integration condition |
|---|---|---|
| Foundation owner | UI primitives, tokens, locale/nav registration and agreed feature interfaces | Establish these before dependent screen integration |
| Tenant contributor | Identity/profile/documents slice inside tenants | Consume tenancy account summary; request rather than edit shared components |
| Electricity contributor | Reading/contribution slice inside electricity | Use agreed assessment/posting interface; do not create another bill balance |
| Ledger contributor | Billing/payment/allocation slice inside ledger | Own the common receipt/payment behavior used by electricity and departure |

This is an example, not an active assignment. Final authority over assignments is the current coordinator, not a standing agent name.

## Shared contract changes

A consumer describes the needed change in its task file with call sites and rationale. The contract owner updates the interface/spec and communicates the revision. Dependents adapt before integration. Avoid merging incompatible caller assumptions and repairing them afterward.

Use separate branches/worktrees when the actual Git environment supports them and the requested work warrants it. Otherwise disjoint file ownership still applies in the shared workspace. Never claim a worktree exists or use Git cleanup commands without inspecting the checkout.

## Handoff evidence

Report changed paths; user-visible result; affected domain/acceptance IDs; interface changes; checks actually run and results; checks not run; pending risks/decisions; and the next integration action. Preserve unrelated work and never report another agent's unverified assertion as a completed integration test.

No feature, contract, or screen is an active assignment in this documentation setup.

