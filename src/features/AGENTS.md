# Feature work

For the feature being changed, read its [domain guide](../../docs/domains/README.md) and [screen family](../../docs/screens/README.md). Home composes read interfaces; Settings composes locale/device/access controls.

Own the assigned feature paths only. Consume another feature's public interface; ask its writer for a needed interface change. Agree stable IDs/scope/outcomes before parallel callers are built. Financial behavior belongs to Ledger/Tenancies/Electricity according to [architecture](../../docs/architecture.md).

Use shared theme/UI/locale/navigation rather than screen-specific substitutes. Feature-local translation files in both languages can have disjoint ownership; their registration stays with the i18n owner.

Colocate meaningful domain/use-case tests with implemented behavior; cross-feature offline flows belong in integration verification. Consult root rules for task scope and completion.

