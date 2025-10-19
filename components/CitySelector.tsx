import React from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Modal,
  FlatList,
  Platform,
} from "react-native";
import { Check, MapPin } from "lucide-react-native";
import { cities } from "@/mocks/cities";
import { useAppStore } from "@/hooks/useAppStore";
import { useTranslation } from "@/hooks/useTranslation";

export const CitySelector: React.FC = () => {
  const [modalVisible, setModalVisible] = React.useState(false);
  const { selectedCity, setSelectedCity, darkModeEnabled } = useAppStore();
  const { t, language } = useTranslation();

  const colors = {
    background: darkModeEnabled ? "#121212" : "#FFFFFF",
    card: darkModeEnabled ? "#1E1E1E" : "#FFFFFF",
    text: darkModeEnabled ? "#FFFFFF" : "#000000",
    textSecondary: darkModeEnabled ? "#AAAAAA" : "#6B7280",
    border: darkModeEnabled ? "#333333" : "#E5E7EB",
    primary: "#3B82F6", // adjust if you use a different primary color
  };

  const handleSelectCity = (cityId: string) => {
    setSelectedCity(cityId);
    setModalVisible(false);
  };

  const getCurrentCityName = () => {
    const currentCity = cities.find((c) => c.id === selectedCity);
    if (!currentCity) return "";

    switch (language) {
      case "ru":
        return currentCity.nameRu;
      case "uz":
        return currentCity.nameUz;
      default:
        return currentCity.name;
    }
  };

  return (
    <View>
      <TouchableOpacity
        style={[
          styles.selector,
          {
            backgroundColor: colors.card,
            borderColor: colors.border,
            borderWidth: 1,
          },
        ]}
        onPress={() => setModalVisible(true)}
        activeOpacity={0.7}
        hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
      >
        <MapPin size={16} color={colors.textSecondary} />
        <Text style={[styles.selectorText, { color: colors.text }]}>
          {getCurrentCityName()}
        </Text>
      </TouchableOpacity>

      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={[styles.modalContent, { backgroundColor: colors.card }]}>
            <Text style={[styles.modalTitle, { color: colors.text }]}>
              {t.home.selectCity}
            </Text>

            <FlatList
              data={cities}
              keyExtractor={(item) => item.id}
              renderItem={({ item }) => {
                const cityName =
                  language === "ru"
                    ? item.nameRu
                    : language === "uz"
                    ? item.nameUz
                    : item.name;

                return (
                  <TouchableOpacity
                    style={{
                      flexDirection: "row",
                      justifyContent: "space-between",
                      alignItems: "center",
                      paddingVertical: 16,
                      paddingHorizontal: 12,
                      borderRadius: 12,
                      backgroundColor:
                        selectedCity === item.id
                          ? colors.primary + "33"
                          : colors.card,
                    }}
                    onPress={() => handleSelectCity(item.id)}
                    activeOpacity={0.7}
                  >
                    <Text
                      style={{
                        fontSize: 16,
                        color:
                          selectedCity === item.id
                            ? colors.primary
                            : colors.text,
                      }}
                    >
                      {cityName}
                    </Text>
                    {selectedCity === item.id && (
                      <Check size={20} color={colors.primary} />
                    )}
                  </TouchableOpacity>
                );
              }}
              ItemSeparatorComponent={() => (
                <View style={{ height: 1, backgroundColor: colors.border }} />
              )}
              scrollEventThrottle={16}
            />

            <TouchableOpacity
              style={[styles.closeButton, { borderTopColor: colors.border }]}
              onPress={() => setModalVisible(false)}
              activeOpacity={0.7}
            >
              <Text style={[styles.closeButtonText, { color: colors.primary }]}>
                {t.common.cancel}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  selector: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 16,
  },
  selectorText: {
    marginLeft: 4,
    fontSize: 14,
  },
  modalOverlay: {
    flex: 1,
    justifyContent: "flex-end",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalContent: {
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 20,
    maxHeight: "70%",
    ...Platform.select({
      android: { elevation: 5 },
      ios: {
        shadowColor: "#000",
        shadowOffset: { width: 0, height: -3 },
        shadowOpacity: 0.1,
        shadowRadius: 5,
      },
    }),
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 16,
    textAlign: "center",
  },
  closeButton: {
    marginTop: 16,
    paddingVertical: 12,
    alignItems: "center",
    borderTopWidth: 1,
  },
  closeButtonText: {
    fontSize: 16,
    fontWeight: "500",
  },
});
