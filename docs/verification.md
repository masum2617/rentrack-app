# Verification by risk and change

The app now has type checking, nine focused Node tests (Home/formatting plus SQLite preference behavior), Expo compatibility checks and native development builds. Run the package scripts appropriate to the change. The table below describes requirements for future business workflows; it does not claim those workflows exist. Checkpoint evidence lives in the delivery log.

| Change | Evidence needed |
|---|---|
| Documentation/folders | Working links, existing paths, consistent ownership/status, screen/acceptance coverage |
| Financial behavior | Meaningful domain tests for affected requirement examples and edge cases; local/server calculation agreement when both exist |
| Payment persistence | Restart after offline save; retry same operation without duplicate receipt; separately entered payment remains distinct |
| Electricity | Missing reading not zero; 69 kWh × 8 = 552; alternative 500/1,000 contributions; same debt reduced once by collection |
| Tenancy/departure | Preserve prior history and original advance; effective rent change; approved settlement outcomes remain distinct |
| Permissions | Test owner and relevant helper permissions, assigned/unassigned property access, server rejection where integrated |
| Localized UI | Bangla first launch on English device; switch/restart offline; no untranslated app messages; values/drafts preserved |
| Screen work | Relevant empty/loading/local-save/sync-error/conflict/success states; visible actions; real navigation return behavior |
| Export/documents | Offline availability truthful; Bengali PDF glyphs; private-file access; failed upload retention and retry when implemented |

For visible changes, verify Android and iOS behavior where available; narrow widths around 320/360 plus ordinary 390/430 layouts; large system text; keyboard/safe-area clearance; long Bangla/Latin names and realistic amounts; VoiceOver/TalkBack; reduced motion and measured contrast. Clearly state unavailable device/platform checks.

Use representative usability sessions across approximately 45–70 and younger adults to assess completion and mistakes in collection, balance explanation, lookup, and reading entry. Do not claim older-user usability from font size alone.

Match tests to changed behavior. Avoid tests that merely repeat implementation details or creating a test framework for a documentation-only task. Build/type/lint success is not proof of offline persistence, financial correctness, permission enforcement, or successful export.

Baseline acceptance IDs A01–A24 are in [product requirements §12](product-requirements.md#12-acceptance-scenarios-for-implementation). For the affected slice, link the IDs to evidence in the task handoff. Explicitly distinguish planned tests from tests executed.

