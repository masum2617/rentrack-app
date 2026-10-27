import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  Pressable,
  StyleSheet,
  TextInput,
  View,
  useWindowDimensions,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useLocale } from "../../i18n/LocaleProvider";
import type { MessageKey } from "../../i18n/messages";
import { getDatabase } from "../../platform/database/database";
import { AppText } from "../../shared/ui/AppText";
import { AssetIcon } from "../../shared/ui/AssetIcon";
import { PrimaryButton } from "../../shared/ui/PrimaryButton";
import { colors } from "../../theme/colors";
import { fontFamilies } from "../../theme/typography";
import { PropertyRow } from "./PropertyRow";
import {
  filterProperties,
  listPropertySummaries,
  type Property,
  type PropertySummary,
} from "./propertyStore";

type ListState =
  | { status: "loading" }
  | { status: "error" }
  | { status: "ready"; properties: PropertySummary[] };

export function PropertiesScreen({
  revision,
  onAdd,
  onEdit,
  onOpen,
  notice,
}: {
  revision: number;
  onAdd: () => void;
  onEdit: (property: Property) => void;
  onOpen: (propertyId: number) => void;
  notice?: MessageKey;
}) {
  const { locale, t } = useLocale();
  const { width, fontScale } = useWindowDimensions();
  const [state, setState] = useState<ListState>({ status: "loading" });
  const [attempt, setAttempt] = useState(0);
  const [search, setSearch] = useState("");
  const stacked = width < 360 || fontScale > 1.3;
  useEffect(() => {
    let active = true;
    async function load() {
      try {
        const properties = await listPropertySummaries(await getDatabase());
        if (active) setState({ status: "ready", properties });
      } catch {
        if (active) setState({ status: "error" });
      }
    }
    void load();
    return () => {
      active = false;
    };
  }, [revision, attempt]);

  function retry() {
    setState({ status: "loading" });
    setAttempt((value) => value + 1);
  }

  const visible =
    state.status === "ready" ? filterProperties(state.properties, search) : [];
  return (
    <SafeAreaView edges={["top", "left", "right"]} style={styles.screen}>
      <View style={[styles.header, stacked && styles.stacked]}>
        <View style={styles.identity}>
          <AppText accessibilityRole="header" variant="title">
            {t("properties")}
          </AppText>
          <AppText variant="label" color={colors.muted}>
            {t("houseListSubtitle")}
          </AppText>
        </View>
        <View style={!stacked && styles.add}>
          <PrimaryButton label={t("newHouse")} onPress={onAdd} />
        </View>
      </View>
      <View style={styles.body}>
        <View style={styles.search}>
          <AssetIcon name="search" />
          <TextInput
            accessibilityLabel={t("searchHouses")}
            placeholder={t("searchHouses")}
            placeholderTextColor={colors.muted}
            value={search}
            onChangeText={setSearch}
            autoCorrect={false}
            returnKeyType="search"
            style={[
              styles.searchInput,
              { fontFamily: fontFamilies[locale].regular },
            ]}
          />
        </View>
        {search.length > 0 && (
          <Pressable
            accessibilityRole="button"
            onPress={() => setSearch("")}
            style={styles.clear}
          >
            <AppText variant="label" color={colors.brand}>
              {t("clearSearch")}
            </AppText>
          </Pressable>
        )}
        {notice && (
          <AppText
            variant="label"
            color={colors.brand}
            accessibilityLiveRegion="polite"
          >
            {t(notice)}
          </AppText>
        )}
        <FlatList
          data={visible}
          keyExtractor={(property) => String(property.id)}
          keyboardShouldPersistTaps="handled"
          keyboardDismissMode="on-drag"
          contentContainerStyle={styles.list}
          renderItem={({ item }) => (
            <PropertyRow
              property={item}
              onEdit={onEdit}
              onOpen={() => onOpen(item.id)}
              floorCount={item.floorCount}
              unitCount={item.unitCount}
            />
          )}
          ListEmptyComponent={
            <View style={styles.state}>
              {state.status === "loading" ? (
                <>
                  <ActivityIndicator
                    color={colors.brand}
                    accessibilityLabel={t("housesLoading")}
                  />
                  <AppText>{t("housesLoading")}</AppText>
                </>
              ) : state.status === "error" ? (
                <>
                  <AppText variant="heading" accessibilityRole="alert">
                    {t("housesLoadError")}
                  </AppText>
                  <AppText color={colors.muted}>
                    {t("housesLoadErrorBody")}
                  </AppText>
                  <PrimaryButton label={t("retry")} onPress={retry} />
                </>
              ) : state.properties.length === 0 ? (
                <>
                  <AppText variant="heading">{t("noHouses")}</AppText>
                  <AppText color={colors.muted}>{t("noHousesBody")}</AppText>
                  <PrimaryButton label={t("newHouse")} onPress={onAdd} />
                </>
              ) : (
                <>
                  <AppText variant="heading">{t("noHouseMatches")}</AppText>
                  <AppText color={colors.muted}>
                    {t("noHouseMatchesBody")}
                  </AppText>
                </>
              )}
            </View>
          }
        />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.canvas },
  header: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    padding: 20,
    paddingTop: 12,
  },
  identity: { flex: 1 },
  stacked: { flexDirection: "column", alignItems: "stretch" },
  add: { width: 138 },
  body: {
    flex: 1,
    backgroundColor: colors.surface,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: 20,
    paddingBottom: 0,
    gap: 16,
  },
  search: {
    minHeight: 60,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: colors.inputBoundary,
    paddingHorizontal: 16,
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  searchInput: {
    flex: 1,
    minHeight: 58,
    fontSize: 16,
    color: colors.ink,
    paddingVertical: 12,
  },
  clear: { minHeight: 48, justifyContent: "center", alignSelf: "flex-start" },
  list: { gap: 16, padding: 4, paddingBottom: 44 },
  state: { gap: 16, paddingVertical: 24 },
});
