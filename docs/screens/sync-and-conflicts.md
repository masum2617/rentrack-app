# Offline status, pending work and conflicts

Owner: src/platform/sync for infrastructure/status; source feature owns business interpretation and resolution. Screen registration follows the navigation owner.

## Purpose and data

Show device-wide pending operations/files, explicit failures/rejections and reviewable conflicts. Explain local save separately from server acknowledgment and actual cash movement. A property-filtered financial view does not silently scope this device queue.

Routine state can say “এই ফোনে রাখা আছে। অনলাইনে পাঠানো বাকি।” Queue rows identify source record, property/tenant context, operation/file type and useful retry details. Source links open the corresponding feature.

Conflict review shows original/local/server facts, responsible people and meaningful timestamps. Offer deliberate review/defer under agreed authority. Do not silently choose the last financial edit or merge separately entered payments.

## Recovery

A retry preserves operation identity and locally saved data. Connectivity alone does not prove acknowledgment. Authorization rejection remains visible with the affected record and honest balance status. Success reflects actual acknowledgments and remaining pending counts; it is normally a state rather than a separate route.

File upload failures retain newly captured local files until acknowledgment. Restored/new-device missing data and unsynchronized-only data need truthful explanations. Background work is opportunistic; do not promise immediate sync while closed.

Acceptance: A13–A16, A21. Exact conflict resolution, rejected-operation accounting, retry policy, revocation handling and backup/recovery need the relevant decisions before implementation.

