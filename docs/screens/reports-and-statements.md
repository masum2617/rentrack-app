# Reports, statements and export

Owner: src/features/reports. Read [domain guide](../domains/reporting.md).

## Purpose and content

Explain where a balance comes from and share authorized records. Reports show explicit property/portfolio scope and date meaning for billed charges, actual cash received, outstanding dues and occupancy/vacancies.

Statement preview traces opening dues, charges, electricity contributions/credit applications, payments, waivers and closing dues, with held advance separate. Receipt preview identifies actual money and its allocation rather than restating a bill as payment.

Generate a PDF statement/receipt or CSV records export and use the native share sheet. Keep preview and selection after sharing/generation failure so the person can retry.

## States and access

Use only assigned-property records. Offline output must identify incomplete locally available data where completeness cannot be established, with pending/conflict/sync context as applicable. Do not report unavailable months as zero or call noncash applications cash receipts.

Bangla/English generated headings and explanations follow selected language; original names/references remain intact. Bengali PDF rendering and offline fonts need actual verification.

Acceptance: A01, A19, A21, A24. Exact cutoffs, export completeness, receipt identity while pending/rejected and local export implementation remain to be specified. Expenses, profit/loss, taxes and automatic reminder delivery are outside scope.

