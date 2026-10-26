import { Pressable, StyleSheet, View } from "react-native";
import { useLocale } from "../../i18n/LocaleProvider";
import { AppText } from "../../shared/ui/AppText";
import { colors } from "../../theme/colors";
import { surfaces } from "../../theme/surfaces";
import { fontFamilies } from "../../theme/typography";
import type { Property } from "./propertyStore";

export function PropertyRow({
  property,
  onEdit,
}: {
  property: Property;
  onEdit: (property: Property) => void;
}) {
  const { t } = useLocale();
  // Names are user content: retain readable Bengali glyphs in English mode too.
  const nameFont = /[\u0980-\u09ff]/.test(property.name)
    ? { fontFamily: fontFamilies.bn.semibold }
    : undefined;
  const locationFont = /[\u0980-\u09ff]/.test(property.location)
    ? { fontFamily: fontFamilies.bn.regular }
    : undefined;
  const addressFont = /[\u0980-\u09ff]/.test(property.address)
    ? { fontFamily: fontFamilies.bn.regular }
    : undefined;
  return (
    <View style={[surfaces.card, styles.card]}>
      <View style={styles.top}>
        <AppText variant="heading" style={[styles.name, nameFont]}>
          {property.name}
        </AppText>
        <Pressable
          accessibilityRole="button"
          accessibilityLabel={t("editNamedHouse", { name: property.name })}
          onPress={() => onEdit(property)}
          style={({ pressed }) => [styles.edit, pressed && styles.pressed]}
        >
          <AppText variant="label" color={colors.brand}>
            {t("edit")}
          </AppText>
        </Pressable>
      </View>
      <AppText color={colors.muted} style={locationFont}>
        {property.location}
      </AppText>
      {property.address ? (
        <AppText variant="label" color={colors.muted} style={addressFont}>
          {property.address}
        </AppText>
      ) : undefined}
    </View>
  );
}

const styles = StyleSheet.create({
  card: { padding: 20, gap: 12 },
  top: { flexDirection: "row", gap: 12, alignItems: "center" },
  name: { flex: 1 },
  edit: {
    minHeight: 52,
    minWidth: 76,
    padding: 12,
    borderRadius: 12,
    backgroundColor: colors.selected,
    alignItems: "center",
    justifyContent: "center",
  },
  pressed: { opacity: 0.75 },
});
