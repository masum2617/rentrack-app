# Payments, allocation and receipts

Owner: src/features/ledger. Shared entry point for rent, selected electricity charge and final collection. Read [domain guide](../domains/ledger.md).

## Purpose and flow

Record money already received, not initiate a gateway transfer. Start with an identified tenancy or search/select it. Display property/unit and pre-payment dues.

Enter amount, actual receipt date, cash/bank/mobile-wallet method, and optional reference/notes. Show oldest-dues-first allocation as an editable suggestion. Change allocation selects covered months/charges; show allocated sum and resulting current/older dues before save.

Keep the ordinary path short: receipt details → allocation/review → Save payment. Advanced allocation can expand separately. Do not force old dues to be paid before a selected current month or silently treat an entered amount as received before the user saves.

Rent prepayment reuses actual receipt details and selected future-period allocation, distinct from held notice advance. Unbilled future periods, unallocated excess and future rent changes require their open policies.

## Success and recovery

After durable local save, show persistent receipt: person/tenancy, money, date, method, allocation, resulting balance and sync status. Sharing is secondary and repeatable. Pending receipt preview identifies local/pending status without inventing a server-confirmed number.

Saving protects against duplicate taps; failed local save preserves input and does not show a completed receipt. Sync retry keeps one operation identity; separately entered similar payments are shown as possible duplicates rather than automatically merged.

Acceptance: A07–A08, A13, A18–A19, A21–A24. Verify 5,000 paid to November leaves 6,252 current plus 3,000 older = 9,252; held 20,000 remains separate. Owner/helper rights, refund/reversal, excess cash and rejected-receipt identity need applicable decisions.

