# Bangla, English, and inclusive usability

Confirmed: Bangla is first-launch default, full English is available, and the same app must be straightforward for younger adults and adults aged approximately 45–70. Exact typography/copy/number preferences require validation; age alone does not define a user's ability.

## Locale behavior

Bundle both language resources and required fonts for offline use. Default to Bangla even on an English device. An explicit selection persists locally across restart/offline access. Switching preserves the current screen, draft, record context, values, and filters.

Show both বাংলা and English as one compact radio group beside the Home heading on the same row at ordinary phone sizes. Preserve complete labels and allow an adaptive arrangement when enlarged text or a narrow screen requires it. Exactly one option is selected; the entire label/indicator row is tappable. A filled circle and selected surface identify the current choice. Implement radio/selected accessibility semantics when coding is authorized. These are mutually exclusive choices, not independent switches. Use Home / হোম for the central navigation label.

Translate app-controlled navigation, fields, actions, instructions, dynamic messages, errors, statuses, dialogs, accessibility text, and generated receipt/statement/report headings. Use complete messages with named values, appropriate plural handling, and localized formatting rather than concatenated translated fragments.

Keep financial IDs and amounts language-independent. Preserve names, notes, references, and original documents as entered. Language changes never duplicate records or translate identity text automatically.

Native permission/biometric/keyboard/share/camera/file-picker text can follow device language; localize app-owned explanations and configure supported native locale behavior honestly.

## Copy and display proposals

| English | Bangla |
|---|---|
| Record payment | পাওয়া টাকা লিখুন |
| Amount due | বকেয়া টাকা |
| View bill | বিল দেখুন |
| Enter meter reading | মিটারের রিডিং লিখুন |
| Save | সংরক্ষণ করুন |
| Back / Next | পেছনে / পরবর্তী |
| Saved on this phone · Pending sync | এই ফোনে রাখা আছে। অনলাইনে পাঠানো বাকি। |

Review translations with Bangla-speaking intended users. Explain held notice advance and future rent separately; do not translate every credit as the same ambiguous অগ্রিম. Use “record received money” wording rather than implying a gateway transfer.

Proposed Bangla display: ৳ ৯,২৫২ and ৫ নভেম্বর ২০২৬. Proposed English: BDT 9,252 and 5 Nov 2026. Gregorian billing months remain unchanged by language. Accept Bengali and Latin numeric input, preserving numeric precision and decimal meaning. Validate digit preference/lakh grouping, including meter readings printed in Latin digits, before freezing formatting. IDs/references are not formatted as money.

Bengali text and PDF exports need correct shaping, font coverage, mixed-script handling, and offline font availability. Selecting a font by its Latin appearance is insufficient.

## Reading and interaction

Use [design-system measurements](design-system.md), scalable system text, no clipped marks, no artificial Bengali letter spacing, and dynamic row/control height. Primary financial facts remain readable without abbreviating values.

Support narrow widths around 320/360 and ordinary 390/430 layouts, small screen heights, landscape, large accessibility text, keyboard open, safe areas, and long mixed-script names. Tab labels must remain visible; validate an adaptive solution if native bars cannot fit enlarged text.

Normal text targets at least 4.5:1; meaningful control graphics and large text at least 3:1. Give every state a text cue and relevant accessibility semantics. VoiceOver/TalkBack order follows the visible hierarchy and focus returns to the source after dialogs.

Show one main task per step, necessary fields first, optional detail through named controls, and tenant/unit/amount beside the relevant action. Keep Back/Next/Save consistent and preserve input on errors.

Important tasks require no swipe, long press, icon interpretation, time-limited completion, or recall of earlier totals. Keep persistent review/success feedback; reduced motion and haptics have visible equivalents.

Test lookup, payment/allocation, balance explanation, and sequential readings with representative Bangla-speaking adults across the stated age range and younger users. Record mistakes and completion obstacles, not just aesthetic preference. Verification is not claimed by this specification.


## Step 2 implementation status

Typed dictionaries cover the current Home/navigation/preview UI. Both Noto font families and translations are local. Bengali digits are mapped explicitly after grouping because the tested native formatter returned Latin digits for bn-BD. Entered property names retain their script. Language and filter choices survive ordinary tab navigation but reset on a full process restart; the persistence requirement above belongs to Step 3.

Header/filter groups stack below 380 logical pixels or at enlarged font scale. Financial columns stack below 370 or at enlarged scale. Body text scales with the system. Bottom-tab text scales to 1.3× (1.15× below 380) to preserve five visible destinations; long narrow labels may wrap. This is a measured layout compromise, not proof of older-user or screen-reader usability. See native screenshots and verification limits in evidence/step-2.
