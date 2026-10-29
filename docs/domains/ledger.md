# Ledger domain

Owner path: src/features/ledger. Source rules: product requirements §5.3–§5.5, §5.7, §5.9, §5.12 and §8.

Own posted charges/bills, money received, allocations, monetary held advance/prepayment records, approved adjustments, receipt data, and resulting charge balances. A screen reads these balances; it cannot edit an independent total.

Bills use calendar months, applicable historical terms, configurable due dates and reviewed partial-month proposals. Finalized applied values survive later term/rate changes.

Suggest oldest unpaid charges for allocation; permit an explicit later month/charge selection leaving older dues. Payment actual date and method remain visible. A waiver preserves the original charge and reason/person/date/approval; it is not cash collected.

Notice advance, ordinary prepayment and electricity credit remain distinct. Consume Electricity assessments/source contributions once through agreed posting identities; a separate electricity collection reduces the same posted charge.

Use exact money representation with an explicit rounding policy before implementing the affected calculations. Repeated sync of one stable operation is not another payment; separately entered payments are reviewed as distinct suspected duplicates.

[Screens: bills](../screens/bills-and-ledger.md), [payments](../screens/payments-and-receipts.md). Acceptance A04–A13, A17–A19. Refunds/reversals, finalized corrections, excess/unallocated money, future periods not billed, rounding and authority details remain open.


## Step 9A rent-only implementation

Ledger owns bills/draft review/finalization/void and rent outstanding in schema v9. Owner-approved proration uses actual calendar days inclusive of start, rounded to whole taka half-up; full-month rent keeps its stored precision. Due day remains in the billed month even if before tenancy start, with short-month fallback. Current-month and historical bills are manually selected; historical rates are not reconstructed. Reviewed overrides retain proposal/reason. Drafts and voids do not create dues; final financial snapshots are immutable. See [rent bills work item](../work-items/local-rent-bills.md). Additional charges/openings/payments remain later scope; Step 10 must guard allocated bills before void and extend the common outstanding projection.

## Step 9B itemized bills

Bill readers now return rentAmountPaisa, all-line amountPaisa, lines and an applicable-settings signature. Fixed/manual/one-off snapshots retain source and reviewed values; only rent autoproration remains. Save/finalize recheck settings and tenancy terms atomically. Finalized non-void outstanding sums all lines; Step 10 will reduce that same projection through allocations. See [work item](../work-items/additional-charges.md).

## Step 10A payments and remaining balances

Ledger owns payments, allocations, operation identity, immutable receipt snapshots and reversal lifecycle. Finalized line balances subtract allocations only from recorded payments. Bill APIs expose gross amountPaisa, paidPaisa and outstandingPaisa; use the latter for Unit/Ledger dues and overdue eligibility. Payments are scoped to one tenancy and fully allocated; excess is blocked. Reversal preserves history and restores all affected charges. Bill void storage checks active allocations inside its transaction. [Work item](../work-items/local-payments.md).

## Step 10B Home consumers

Home consumes Ledger bill/remaining projections and the narrow paymentActivity read model. Collections follow actual receipt date and exclude reversed payments, independently of allocation month. Ledger owns BillScope/matchesBillScope for Home's all-month outstanding/overdue and selected-month draft links; Home never stores or writes another balance. [Work item](../work-items/live-home.md).
