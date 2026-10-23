# Home asset provenance

Source: approved Figma Home board, file NbtxYyU5l1j2QSLTRBioUL, board 3:202; Bangla 6:964, English 6:1075, empty 6:1184. Native components follow these frames; web Code Connect snippets were not suitable for React Native.

Original vector-leaf SVG exports are bundled in assets/icons/home. SVG source and original export dimensions are preserved; AssetIcon.tsx supplies a layout slot and optional runtime tint. Runtime assets use local require paths, not temporary Figma download URLs.

| File | Figma vector node |
|---|---|
| meter.svg | I6:1017;6:940;7758:12647 |
| home.svg | I6:1053;13:138;7758:11735 |
| down.svg | I6:982;7758:11219 |
| properties.svg | I6:1047;6:954;7758:11693 |
| tenants.svg | I6:1059;6:954;7758:12539 |
| radio.svg | Selected radio indicator from the approved language choice |
| ledger.svg | I6:1041;6:954;7758:11147 |
| right.svg | I6:1017;6:945;7758:11231 |
| bill.svg | I6:1028;6:940;7758:11585 |
| more.svg | I6:1065;6:954;7758:11951 |
| emptyHome.svg | I6:1201;7758:11735 |

Noto Sans and Noto Sans Bengali regular/medium/semibold TTFs were copied from the installed @expo-google-fonts packages into assets/fonts. Their SIL Open Font Licenses are retained there. App.tsx loads those local files before rendering the designed UI. The loading/font-error fallback uses the system font and initial Bangla language.
