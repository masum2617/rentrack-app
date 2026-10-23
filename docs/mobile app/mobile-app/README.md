# House Rent Tracker mobile app

Working project for the landlord-operated Android/iOS application. Bangla is the default, English is fully supported, and everyday workflows must remain straightforward for younger adults and adults aged approximately 45–70.

**Current state:** documentation and directory skeleton only. No Expo bootstrap, dependency installation, runnable screens, backend, or passing application tests are claimed.

Start with [AGENTS.md](AGENTS.md), then the [documentation index](docs/README.md).

## Layout

~~~
mobile-app/
  AGENTS.md
  GLOSSARY.md
  docs/
    product-requirements.md
    architecture.md
    design-system.md
    navigation.md
    localization-accessibility.md
    agent-workflow.md
    verification.md
    domains/
    screens/
    templates/
    work-items/
    references/
    adr/
  assets/
    fonts/
    icons/
  src/
    application/
    navigation/
    theme/
    i18n/
    shared/
      ui/
      money/
    platform/
      database/
      sync/
      network/
      files/
      secure-storage/
    features/
      home/
      properties/
      tenants/
      tenancies/
      ledger/
      electricity/
      reports/
      access/
      settings/
  tests/integration/
~~~

The accepted stack is React Native, Expo, SQLite, Spring Boot, PostgreSQL, and private file storage. This folder is the mobile client. Backend work belongs to a separately defined server project when requested. Dependency versions, navigation/state libraries, authentication provider, and file-storage vendor remain unselected.

Business modules follow rental domains, not one module per prototype frame. Empty directories reserve intended locations; create implementation layers only as a concrete feature needs them.

Existing requirements, glossary, and ADR paths in the parent workspace forward here. Original interview/UX/prototype narratives are retained under docs/references as history. Reference images are design-review material, not runtime assets.

There are no run/build/test commands yet. After an authorized bootstrap, document actual scripts here and verify them rather than inventing commands in advance.

