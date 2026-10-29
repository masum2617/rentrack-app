export const paymentEnglish = {
  paymentStatusOverdue: '{status} · Overdue',
  paymentTenancyBalanceAfter:
    'Total tenancy outstanding after this payment: {amount}',
  paymentReceiptBalance:
    'Tenancy outstanding when this payment was recorded: {amount}',
  paymentRecord: 'Record payment',
  paymentHistory: 'Payment history',
  paymentReceipt: 'Payment receipt',
  paymentReference: 'Local receipt #{id}',
  paymentSaved: 'Payment saved on this phone.',
  paymentActualHint:
    'Record money already received. This does not transfer money.',
  paymentAmount: 'Received amount (BDT)',
  paymentDate: 'Actual receipt date',
  paymentMethod: 'Payment method',
  paymentChooseMethod: 'Choose a method',
  paymentCash: 'Cash',
  paymentBank: 'Bank',
  paymentWallet: 'Mobile wallet',
  paymentTransaction: 'Transaction/reference number (optional)',
  paymentNotes: 'Notes (optional)',
  paymentOptionalPlaceholder: 'Optional',
  paymentAllocate: 'Allocate received money',
  paymentAllocation: 'Apply to this charge (BDT)',
  paymentDue: 'Remaining before payment: {amount}',
  paymentAllocated: 'Allocated: {amount}',
  paymentUnallocated: 'Remaining to allocate: {amount}',
  paymentOverallocated: 'Allocated more than received: {amount}',
  paymentBalanceAfter: 'Remaining after payment: {amount}',
  paymentSuggest: 'Suggest allocation again',
  paymentOldestHint:
    'Suggested oldest month first, then rent before other charges. You may change the amounts.',
  paymentBillHint:
    'This bill is suggested first. You may allocate to other months or charges instead.',
  paymentReview: 'Review payment',
  paymentNext: 'Review allocation',
  paymentSave: 'Save payment',
  paymentNoDues:
    'No finalized outstanding charges to receive a payment against. Prepare and finalize a bill first.',
  paymentNoHistory: 'No payments recorded here yet.',
  paymentRecorded: 'Recorded',
  paymentReversed: 'Reversed',
  paymentReceived: 'Received',
  paymentSettled: 'Settled',
  paymentPartial: 'Partly paid',
  paymentApplied: 'Applied payments: {amount}',
  paymentReverse: 'Reverse payment',
  paymentReverseTitle: 'Reverse this recorded payment?',
  paymentReverseBody:
    'All allocations from this payment will be reversed and the dues restored. This corrects the record; it does not record a cash refund.',
  paymentReverseReason: 'Reason for reversal',
  paymentReversePlaceholder: 'For example, the amount was entered incorrectly',
  paymentReversalTime: 'Reversed at: {time}',
  paymentRecordedTime: 'Recorded at: {time}',
  paymentLocalHint:
    'Stored on this phone. PDF, sharing and synchronization are not included yet.',
  paymentAmountError:
    'Enter a received amount greater than zero, with up to two decimal places.',
  paymentDateError: 'Choose a valid actual receipt date, today or earlier.',
  paymentMethodError: 'Choose cash, bank or mobile wallet.',
  paymentAllocationError:
    'Allocate the entire received amount to the selected charges. Each amount must be valid.',
  paymentExcessError:
    'The received amount exceeds finalized outstanding dues. Prepayments are not supported here yet.',
  paymentStaleError:
    'A selected charge or its remaining balance changed. Refresh available dues, review the allocation and retry.',
  paymentMissing: 'This payment, tenancy or bill is no longer available.',
  paymentOperationError:
    'This submission was already recorded with different details. Open its receipt before recording another payment.',
  paymentReasonError: 'Enter a reason for reversing the payment.',
  paymentSaveError:
    'Could not save. Your entries remain available; retry when ready.',
  paymentReadError: 'Could not load payment information. Retry to continue.',
  paymentRefresh: 'Refresh available dues',
  paymentRefreshBody:
    'Refresh outstanding charges and clear the entered allocation? Your receipt details will remain.',
  paymentOpenReceipt: 'Open recorded receipt',
  paymentBillLocked:
    'This bill has active payment allocations. Reverse the affected payments before voiding it.',
};
export const paymentBangla: Record<keyof typeof paymentEnglish, string> = {
  paymentStatusOverdue: '{status} · মেয়াদ পেরিয়েছে',
  paymentTenancyBalanceAfter:
    'এই টাকা দেওয়ার পরে এই ভাড়ার মোট বকেয়া: {amount}',
  paymentReceiptBalance: 'এই টাকা লেখার সময় এই ভাড়ার বকেয়া ছিল: {amount}',
  paymentRecord: 'পাওয়া টাকা লিখুন',
  paymentHistory: 'টাকা পাওয়ার ইতিহাস',
  paymentReceipt: 'টাকা পাওয়ার রসিদ',
  paymentReference: 'স্থানীয় রসিদ #{id}',
  paymentSaved: 'পাওয়া টাকার তথ্য এই ফোনে রাখা হয়েছে।',
  paymentActualHint: 'ইতিমধ্যে পাওয়া টাকা লিখুন। এতে কোনো টাকা পাঠানো হয় না।',
  paymentAmount: 'পাওয়া টাকা',
  paymentDate: 'টাকা পাওয়ার প্রকৃত তারিখ',
  paymentMethod: 'টাকা পাওয়ার মাধ্যম',
  paymentChooseMethod: 'মাধ্যম বেছে নিন',
  paymentCash: 'নগদ',
  paymentBank: 'ব্যাংক',
  paymentWallet: 'মোবাইল ওয়ালেট',
  paymentTransaction: 'লেনদেন বা রেফারেন্স নম্বর (ঐচ্ছিক)',
  paymentNotes: 'মন্তব্য (ঐচ্ছিক)',
  paymentOptionalPlaceholder: 'ঐচ্ছিক',
  paymentAllocate: 'পাওয়া টাকা বিলে ভাগ করুন',
  paymentAllocation: 'এই চার্জে দেওয়া টাকা',
  paymentDue: 'টাকা দেওয়ার আগে বকেয়া: {amount}',
  paymentAllocated: 'ভাগ করা হয়েছে: {amount}',
  paymentUnallocated: 'ভাগ করা বাকি: {amount}',
  paymentOverallocated: 'পাওয়া টাকার চেয়ে বেশি ভাগ হয়েছে: {amount}',
  paymentBalanceAfter: 'টাকা দেওয়ার পরে বকেয়া: {amount}',
  paymentSuggest: 'আবার প্রস্তাবিত ভাগ আনুন',
  paymentOldestHint:
    'আগের মাসের বকেয়া আগে, একই মাসে বাড়িভাড়া আগে প্রস্তাব করা হয়। চাইলে অঙ্ক বদলাতে পারেন।',
  paymentBillHint:
    'এই বিল আগে প্রস্তাব করা হয়েছে। চাইলে অন্য মাস বা চার্জে টাকা দিতে পারেন।',
  paymentReview: 'পাওয়া টাকার তথ্য যাচাই',
  paymentNext: 'বিলে ভাগ যাচাই করুন',
  paymentSave: 'পাওয়া টাকা সংরক্ষণ করুন',
  paymentNoDues:
    'টাকা দেওয়ার মতো চূড়ান্ত বিলের বকেয়া নেই। আগে বিল তৈরি করে চূড়ান্ত করুন।',
  paymentNoHistory: 'এখানে এখনো টাকা পাওয়ার তথ্য নেই।',
  paymentRecorded: 'সংরক্ষিত',
  paymentReversed: 'এন্ট্রি ফিরিয়ে নেওয়া হয়েছে',
  paymentReceived: 'পাওয়া টাকা',
  paymentSettled: 'বকেয়া নেই',
  paymentPartial: 'আংশিক টাকা পাওয়া গেছে',
  paymentApplied: 'বিলে দেওয়া টাকা: {amount}',
  paymentReverse: 'পাওয়া টাকার এন্ট্রি ফিরিয়ে নিন',
  paymentReverseTitle: 'এই টাকার এন্ট্রি ফিরিয়ে নেবেন?',
  paymentReverseBody:
    'এই টাকার সব বিলের ভাগ ফিরিয়ে বকেয়া আগের মতো হবে। এটি হিসাবের এন্ট্রি সংশোধন, নগদ টাকা ফেরত দেওয়ার হিসাব নয়।',
  paymentReverseReason: 'এন্ট্রি ফিরিয়ে নেওয়ার কারণ',
  paymentReversePlaceholder: 'যেমন, টাকার পরিমাণ ভুল লেখা হয়েছে',
  paymentReversalTime: 'ফিরিয়ে নেওয়ার সময়: {time}',
  paymentRecordedTime: 'সংরক্ষণের সময়: {time}',
  paymentLocalHint:
    'এই ফোনে সংরক্ষিত। পিডিএফ, শেয়ার ও অনলাইনে পাঠানোর সুবিধা এখনো নেই।',
  paymentAmountError:
    'শূন্যের বেশি পাওয়া টাকা লিখুন। দশমিকের পরে সর্বোচ্চ দুই অঙ্ক দিন।',
  paymentDateError: 'আজ বা আগের কোনো সঠিক টাকা পাওয়ার তারিখ বেছে নিন।',
  paymentMethodError: 'নগদ, ব্যাংক বা মোবাইল ওয়ালেট বেছে নিন।',
  paymentAllocationError:
    'পাওয়া পুরো টাকা নির্বাচিত চার্জে ভাগ করুন। প্রতিটি অঙ্ক সঠিক হতে হবে।',
  paymentExcessError:
    'পাওয়া টাকা চূড়ান্ত বিলের বকেয়ার চেয়ে বেশি। এখানে এখনো আগাম টাকা রাখা যাবে না।',
  paymentStaleError:
    'নির্বাচিত চার্জ বা বকেয়া বদলেছে। নতুন বকেয়া এনে ভাগ যাচাই করে আবার চেষ্টা করুন।',
  paymentMissing: 'এই টাকার এন্ট্রি, ভাড়া বা বিল আর পাওয়া যাচ্ছে না।',
  paymentOperationError:
    'এই জমার তথ্য অন্য অঙ্কে আগেই রাখা হয়েছে। নতুন এন্ট্রির আগে রসিদটি খুলুন।',
  paymentReasonError: 'টাকার এন্ট্রি ফিরিয়ে নেওয়ার কারণ লিখুন।',
  paymentSaveError:
    'সংরক্ষণ হয়নি। আপনার লেখা তথ্য আছে। প্রস্তুত হলে আবার চেষ্টা করুন।',
  paymentReadError: 'টাকা পাওয়ার তথ্য পড়া যায়নি। আবার চেষ্টা করুন।',
  paymentRefresh: 'নতুন বকেয়া আনুন',
  paymentRefreshBody:
    'বকেয়া নতুন করে এনে লেখা বিলের ভাগ মুছবেন? টাকা পাওয়ার মূল তথ্য থাকবে।',
  paymentOpenReceipt: 'সংরক্ষিত রসিদ খুলুন',
  paymentBillLocked:
    'এই বিলে পাওয়া টাকা ভাগ করা আছে। বিল বাতিলের আগে সংশ্লিষ্ট টাকার এন্ট্রি ফিরিয়ে নিন।',
};
