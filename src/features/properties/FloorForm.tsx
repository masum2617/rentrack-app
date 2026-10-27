import { useRef, useState } from "react";
import {
  Alert,
  KeyboardAvoidingView,
  Modal,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  View,
  type TextInputInstance,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useLocale } from "../../i18n/LocaleProvider";
import { getDatabase } from "../../platform/database/database";
import { AppText } from "../../shared/ui/AppText";
import { AssetIcon } from "../../shared/ui/AssetIcon";
import { PrimaryButton } from "../../shared/ui/PrimaryButton";
import { colors } from "../../theme/colors";
import { surfaces } from "../../theme/surfaces";
import { fontFamilies } from "../../theme/typography";
import { PropertyField } from "./PropertyField";
import type { Property } from "./propertyStore";
import {
  createFloor,
  updateFloor,
  FloorNameError,
  type Floor,
} from "./floorStore";

export function FloorForm({
  property,
  floor,
  onClose,
  onSaved,
}: {
  property: Property;
  floor?: Floor;
  onClose: () => void;
  onSaved: () => void;
}) {
  const { t } = useLocale();
  const [name, setName] = useState(floor?.name ?? "");
  const [floorCodeName, setFloorCodeName] = useState(
    floor?.floorCodeName ?? "",
  );
  const [fieldError, setFieldError] = useState<"required" | "duplicate">();
  const [status, setStatus] = useState<"idle" | "saving" | "error">("idle");
  const input = useRef<TextInputInstance>(null);
  const inFlight = useRef(false);
  const dirty =
    name !== (floor?.name ?? "") ||
    floorCodeName !== (floor?.floorCodeName ?? "");
  function requestClose() {
    if (inFlight.current) return;
    if (!dirty) {
      onClose();
      return;
    }
    Alert.alert(t("unsavedHouse"), t("unsavedHouseBody"), [
      { text: t("keepEditing"), style: "cancel" },
      { text: t("discardChanges"), style: "destructive", onPress: onClose },
    ]);
  }
  async function save() {
    if (inFlight.current) return;
    if (!name.trim()) {
      setFieldError("required");
      input.current?.focus();
      return;
    }
    inFlight.current = true;
    setStatus("saving");
    setFieldError(undefined);
    try {
      const db = await getDatabase();
      if (floor)
        await updateFloor(db, property.id, floor.id, name, floorCodeName);
      else await createFloor(db, property.id, name, floorCodeName);
    } catch (error) {
      inFlight.current = false;
      if (error instanceof FloorNameError) {
        setFieldError(error.reason);
        setStatus("idle");
        input.current?.focus();
      } else setStatus("error");
      return;
    }
    onSaved();
  }
  return (
    <Modal
      visible
      animationType="slide"
      presentationStyle="fullScreen"
      onRequestClose={requestClose}
    >
      <SafeAreaView style={styles.screen}>
        <KeyboardAvoidingView
          style={styles.screen}
          behavior={Platform.OS === "ios" ? "padding" : "height"}
        >
          <View style={styles.backBar}>
            <Pressable
              accessibilityRole="button"
              accessibilityLabel={t("back")}
              disabled={status === "saving"}
              accessibilityState={{ disabled: status === "saving" }}
              onPress={requestClose}
              style={[surfaces.control, styles.back]}
            >
              <AssetIcon name="back" />
            </Pressable>
          </View>
          <ScrollView
            contentContainerStyle={styles.scrollContent}
            keyboardShouldPersistTaps="handled"
            keyboardDismissMode="on-drag"
          >
            <View style={styles.header}>
              <AppText variant="title" accessibilityRole="header">
                {t(floor ? "editFloor" : "newFloor")}
              </AppText>
              <AppText variant="label" color={colors.muted}>
                {t("floorFormSubtitle")}
              </AppText>
            </View>
            <View style={styles.body}>
              <View style={styles.parent}>
                <AppText variant="label" color={colors.muted}>
                  {t("floorParent")}
                </AppText>
                <AppText
                  variant="heading"
                  style={
                    /[\u0980-\u09ff]/.test(property.name)
                      ? { fontFamily: fontFamilies.bn.semibold }
                      : undefined
                  }
                >
                  {property.name}
                </AppText>
                <AppText
                  variant="label"
                  color={colors.muted}
                  style={
                    /[\u0980-\u09ff]/.test(property.location)
                      ? { fontFamily: fontFamilies.bn.medium }
                      : undefined
                  }
                >
                  {property.location}
                </AppText>
              </View>

              <PropertyField
                label={`${t("floorCode")}`}
                value={floorCodeName}
                placeholder={t("floorCodeExample")}
                returnKeyType="next"
                editable={status !== "saving"}
                onChangeText={(value) => {
                  setFloorCodeName(value);
                  setStatus("idle");
                }}
                onSubmitEditing={() => {
                  input.current?.focus();
                }}
              />

              <PropertyField
                label={`${t("floorName")} *`}
                value={name}
                placeholder={t("floorNameExample")}
                inputRef={input}
                returnKeyType="done"
                editable={status !== "saving"}
                onChangeText={(value) => {
                  setName(value);
                  setFieldError(undefined);
                  setStatus("idle");
                }}
                error={
                  fieldError
                    ? t(
                        fieldError === "required"
                          ? "floorNameRequired"
                          : "floorNameDuplicate",
                      )
                    : undefined
                }
                onSubmitEditing={() => {
                  void save();
                }}
              />
              <AppText variant="label" color={colors.muted}>
                {t("floorNameHint")}
              </AppText>
            </View>
          </ScrollView>
          <View style={styles.footer}>
            {status === "error" && (
              <AppText
                variant="label"
                color={colors.error}
                accessibilityRole="alert"
              >
                {t("floorSaveError")}
              </AppText>
            )}
            <PrimaryButton
              label={t(status === "saving" ? "savingHouse" : "saveHouse")}
              busy={status === "saving"}
              onPress={save}
            />
          </View>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </Modal>
  );
}
const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.canvas },
  backBar: { paddingHorizontal: 20, paddingVertical: 8 },
  back: {
    width: 48,
    minHeight: 48,
    alignItems: "center",
    justifyContent: "center",
  },
  scrollContent: { flexGrow: 1 },
  header: { paddingHorizontal: 20, paddingBottom: 20, gap: 8 },
  body: {
    flexGrow: 1,
    backgroundColor: colors.surface,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: 20,
    gap: 24,
  },
  parent: {
    backgroundColor: colors.selected,
    borderRadius: 12,
    padding: 20,
    gap: 4,
  },
  footer: {
    backgroundColor: colors.surface,
    padding: 20,
    gap: 12,
    boxShadow: [
      { offsetX: 0, offsetY: -3, blurRadius: 18, color: colors.softShadow },
    ],
  },
});
