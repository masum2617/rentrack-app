export const ledgerEnglish = {
  billEditDraft: 'Edit draft',
  billCardAnnouncement:
    '{month}. {tenant}. {property}. Floor: {floor}. Unit: {unit}. {status}. Total: {amount}. Outstanding: {outstanding}. Due: {due}.',
  bills: 'Bills',
  billCreate: 'Create rent bill',
  billSaveDraft: 'Save draft',
  billDraft: 'Draft',
  billFinalized: 'Finalized',
  billVoided: 'Voided',
  billUnpaid: 'Outstanding',
  billOverdue: 'Overdue',
  billNoDues: 'No outstanding amount',
  billMonth: 'Billing month',
  billYear: 'Year',
  billMonthName: 'Month',
  billAllMonths: 'All months',
  billAllProperties: 'All properties',
  billProperty: 'Property',
  billIncludeVoids: 'Include voided bills',
  billLoading: 'Loading bills…',
  billLoadError: 'Could not load billing records. Retry to continue.',
  billMissing: 'This bill or tenancy could not be found.',
  billEmpty: 'No bills yet',
  billEmptyBody:
    'Open a rented unit under Properties to create its first monthly bill.',
  billNoMatches: 'No bills match these filters.',
  billOpenProperties: 'Open Properties',
  billReference: 'Bill #{id}',
  billDue: 'Due date',
  billCoverage: 'Covered dates',
  billReferenceRent: 'Stored monthly rent reference',
  billProposal: 'Proposed rent charge',
  billReviewedAmount: 'Reviewed rent charge (BDT)',
  billAmountExample: 'For example: 10000',
  billReason: 'Reason for changed amount',
  billReasonExample: 'Explain the reviewed or historical amount',
  billHistoricalHint:
    'This proposal uses the currently stored rent, not verified historical rates. Check older months before finalizing.',
  billFullCalculation:
    'Full calendar month: stored monthly rent, without additional rounding.',
  billPartialCalculation:
    '{days} of {total} calendar days, including the start date. Proposal rounded to the nearest whole taka; halves round upward.',
  billOutstanding: 'Outstanding finalized bills',
  billScopeHint:
    'Finalized charges minus active payment allocations. Drafts and voided bills do not create dues.',
  billDraftHint:
    'A saved draft is not yet an amount due. Review it, then finalize separately.',
  billFinalHint:
    'Finalized financial values are preserved. Correct a mistake by voiding and reissuing.',
  billFinalize: 'Finalize bill',
  billFinalizeConfirm: 'Finalize this bill?',
  billFinalizeBody:
    'The reviewed amount will become outstanding. Its financial values can no longer be edited.',
  billVoid: 'Void bill',
  billVoidReason: 'Reason for voiding',
  billVoidConfirm: 'Void this finalized bill?',
  billVoidBody:
    'Its original values remain in history and stop contributing to dues. No refund or receipt is created.',
  billReissue: 'Create replacement draft',
  billDiscard: 'Discard draft',
  billDiscardConfirm: 'Discard this saved draft?',
  billDiscardBody: 'Only this unfinalized draft will be removed.',
  billChangedMonth: 'Recalculate for another month?',
  billChangedMonthBody:
    'The reviewed amount and reason will be reset to the new month’s proposal.',
  billRecalculate: 'Recalculate',
  billMonthError:
    'Choose a month from the tenancy start month through the current month.',
  billAmountError:
    'Enter zero or a positive supported amount with up to two decimal places.',
  billReasonError: 'Enter a reason for the changed amount or void.',
  billDuplicateError:
    'A draft or finalized bill already exists for this tenancy and month. Close this form and open that bill.',
  billReadonlyError:
    'This bill can no longer be edited or discarded as a draft. Reload its details.',
  billTermsChanged:
    'Rental terms or applicable charge settings changed. Refresh and save the draft, review it, then finalize again.',
  billClosedError:
    'New billing actions are unavailable for this closed tenancy.',
  billRangeError:
    'This amount or total exceeds the supported exact-money range.',
  billSaveError:
    'Could not save. Your entries are still here. Retry when ready.',
  billSaved: 'Billing change saved on this phone.',
  billTermsLocked:
    'Setup corrections are locked while finalized bills exist. Void mistaken bills before correcting setup terms.',
  billCancel: 'Cancel',
  billSelect: 'Choose {label}',
};
export const ledgerBangla: Record<keyof typeof ledgerEnglish, string> = {
  billEditDraft: 'খসড়া সম্পাদনা',
  billCardAnnouncement:
    '{month}। {tenant}। বাড়ি: {property}। তলা: {floor}। ইউনিট: {unit}। {status}। মোট: {amount}। বকেয়া: {outstanding}। দেওয়ার তারিখ: {due}।',
  bills: 'বিল',
  billCreate: 'ভাড়ার বিল তৈরি করুন',
  billSaveDraft: 'খসড়া সংরক্ষণ করুন',
  billDraft: 'খসড়া',
  billFinalized: 'চূড়ান্ত',
  billVoided: 'বাতিল',
  billUnpaid: 'বকেয়া',
  billOverdue: 'সময় পেরিয়েছে',
  billNoDues: 'বকেয়া নেই',
  billMonth: 'বিলের মাস',
  billYear: 'বছর',
  billMonthName: 'মাস',
  billAllMonths: 'সব মাস',
  billAllProperties: 'সব বাড়ি',
  billProperty: 'বাড়ি',
  billIncludeVoids: 'বাতিল বিলসহ দেখুন',
  billLoading: 'বিলের তথ্য আনা হচ্ছে…',
  billLoadError: 'বিলের তথ্য খোলা যায়নি। আবার চেষ্টা করুন।',
  billMissing: 'বিল বা ভাড়ার রেকর্ড পাওয়া যায়নি।',
  billEmpty: 'এখনো বিল নেই',
  billEmptyBody: 'বাড়ি থেকে ভাড়া থাকা ইউনিট খুলে প্রথম মাসিক বিল তৈরি করুন।',
  billNoMatches: 'এই বাছাই অনুযায়ী বিল নেই।',
  billOpenProperties: 'বাড়ি দেখুন',
  billReference: 'বিল #{id}',
  billDue: 'ভাড়া দেওয়ার তারিখ',
  billCoverage: 'হিসাবের সময়সীমা',
  billReferenceRent: 'সংরক্ষিত মাসিক ভাড়ার তথ্য',
  billProposal: 'প্রস্তাবিত ভাড়া',
  billReviewedAmount: 'যাচাই করা ভাড়া (টাকা)',
  billAmountExample: 'যেমন: ১০০০০',
  billReason: 'অঙ্ক পরিবর্তনের কারণ',
  billReasonExample: 'যাচাই করা বা পুরোনো মাসের অঙ্কের কারণ লিখুন',
  billHistoricalHint:
    'প্রস্তাবটি এখন সংরক্ষিত ভাড়া থেকে করা হয়েছে, যাচাই করা পুরোনো হার থেকে নয়। পুরোনো মাসের বিল চূড়ান্ত করার আগে অঙ্ক যাচাই করুন।',
  billFullCalculation:
    'পুরো মাস: সংরক্ষিত মাসিক ভাড়া, অতিরিক্ত রাউন্ডিং ছাড়া।',
  billPartialCalculation:
    'শুরুর দিনসহ {total} দিনের মধ্যে {days} দিন। প্রস্তাব নিকটতম পূর্ণ টাকায়; অর্ধেক টাকা হলে উপরের টাকায়।',
  billOutstanding: 'চূড়ান্ত বিলের বকেয়া',
  billScopeHint:
    'শুধু চূড়ান্ত বিলের চার্জ হিসাব করা হয়েছে। খসড়া ও বাতিল বিল বকেয়ায় যোগ হয় না।',
  billDraftHint:
    'সংরক্ষিত খসড়া এখনো বকেয়া নয়। যাচাই করে আলাদাভাবে চূড়ান্ত করুন।',
  billFinalHint:
    'চূড়ান্ত বিলের আর্থিক অঙ্ক সংরক্ষিত থাকে। ভুল হলে বাতিল করে নতুন বিল তৈরি করুন।',
  billFinalize: 'বিল চূড়ান্ত করুন',
  billFinalizeConfirm: 'বিল চূড়ান্ত করবেন?',
  billFinalizeBody:
    'যাচাই করা অঙ্ক বকেয়ায় যোগ হবে। এরপর আর্থিক অঙ্ক সম্পাদনা করা যাবে না।',
  billVoid: 'বিল বাতিল করুন',
  billVoidReason: 'বাতিলের কারণ',
  billVoidConfirm: 'চূড়ান্ত বিল বাতিল করবেন?',
  billVoidBody:
    'আসল অঙ্ক ইতিহাসে থাকবে, বকেয়ায় যোগ হবে না। টাকা ফেরত বা রসিদ তৈরি হবে না।',
  billReissue: 'নতুন খসড়া তৈরি করুন',
  billDiscard: 'খসড়া বাদ দিন',
  billDiscardConfirm: 'সংরক্ষিত খসড়া বাদ দেবেন?',
  billDiscardBody: 'শুধু এই অচূড়ান্ত খসড়া মুছে যাবে।',
  billChangedMonth: 'অন্য মাসের হিসাব করবেন?',
  billChangedMonthBody:
    'যাচাই করা অঙ্ক ও কারণ নতুন মাসের প্রস্তাব অনুযায়ী বদলাবে।',
  billRecalculate: 'নতুন হিসাব করুন',
  billMonthError: 'ভাড়া শুরুর মাস থেকে চলতি মাসের মধ্যে বেছে নিন।',
  billAmountError:
    'শূন্য বা তার চেয়ে বড় সমর্থিত অঙ্ক লিখুন, সর্বোচ্চ দুই ঘর দশমিকসহ।',
  billReasonError: 'অঙ্ক পরিবর্তন বা বাতিলের কারণ লিখুন।',
  billDuplicateError:
    'এই ভাড়া ও মাসের একটি খসড়া বা চূড়ান্ত বিল আছে। ফর্ম বন্ধ করে সেই বিল খুলুন।',
  billReadonlyError:
    'এই বিল এখন খসড়া হিসেবে সম্পাদনা বা মুছতে পারবেন না। তথ্য আবার খুলুন।',
  billTermsChanged:
    'ভাড়ার শর্ত বা প্রযোজ্য চার্জের সেটিংস বদলেছে। খসড়ায় নতুন তথ্য এনে সংরক্ষণ ও যাচাইয়ের পর চূড়ান্ত করুন।',
  billClosedError: 'বন্ধ হয়ে যাওয়া ভাড়ায় নতুন বিলের কাজ করা যাবে না।',
  billRangeError: 'এই অঙ্ক বা মোট সমর্থিত নির্ভুল সীমার বেশি।',
  billSaveError:
    'সংরক্ষণ হয়নি। আপনার লেখা রয়ে গেছে। প্রস্তুত হলে আবার চেষ্টা করুন।',
  billSaved: 'এই ফোনে বিলের পরিবর্তন সংরক্ষিত হয়েছে।',
  billTermsLocked:
    'চূড়ান্ত বিল থাকায় শুরুর শর্ত সংশোধন বন্ধ আছে। ভুল বিল বাতিল করে তারপর শর্ত সংশোধন করুন।',
  billCancel: 'ফিরে যান',
  billSelect: '{label} বেছে নিন',
};
