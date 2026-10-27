# House details and named floors — Bangla review

27 October 2026. Design only; no application or database changes in this slice. The owner requested Bangla layouts only and will handle English design separately. English support remains part of the application requirements.

[Open the review board](https://www.figma.com/design/NbtxYyU5l1j2QSLTRBioUL?node-id=52-128)

Page: `03 · House details & floors · বাংলা`. Existing Home and Properties review pages were preserved.

| View | Node |
|---|---|
| House details with named floors | `54:387` |
| Shared Add/Edit floor form, shown in Add mode | `54:458` |
| Same house details with no floors | `54:494` |

The house screen reuses the saved house identity, location/address and labeled Edit action. Its main action is **তলা যোগ করুন**. Named floors have separate Edit controls and a visible **ইউনিট দেখুন** destination for the following slice. Unit/occupancy counts and financial figures are omitted. The existing five-tab bar keeps Properties selected and Home raised in the center.

The floor form has one required **তলার নাম** field. A read-only house context panel shows রহমান বাড়ি and মিরপুর, ঢাকা, so users do not select the parent again. The same form will support Edit through a changed title and existing value, shown in the supporting gallery. Tabs are hidden in the form. Save is intended to return to this house's updated floor list after local storage succeeds; unsaved Back requires Keep editing/Discard. Keyboard and persistence behavior are implementation requirements, not working features of this static board.

Supporting examples cover empty floors, filled Edit, blank-name validation, saving, failed save with retained text, success, loading, retry and unsaved-change confirmation.

## Visual verification and remaining correction

The board uses existing green/white variables, Noto Sans Bengali text styles, soft shadows, original controls and navigation instances. New floor-row variants and screen masters remain editable. Final read-back recorded 79 text nodes, 47 instances and no image-filled nodes; Noto Sans appears only through existing native-status content. Back controls measure 48 × 48; primary actions measure at least 56 high. Visual review repaired wrapped action labels, clipped text height, auto-layout overlap and undersized Back targets.

One supporting copy defect remains: in the loading example `58:413`, the description still says **সংরক্ষিত তথ্য মুছে ফেলা হয়নি। আবার চেষ্টা করুন।** Change it to **এই বাড়ির তলার তথ্য আনা হচ্ছে।** Figma's Starter-plan MCP tool limit rejected that final edit and screenshot call. The main screens and other repaired states were rendered and visually reviewed successfully before the limit. No further edit was claimed.

Review the house/floor hierarchy and form before implementation. Floor ordering, duplicate-name validation and unit details can be settled in the next form/data plan. This board adds no floor/unit schema or native code and does not implement the Unit destination.
