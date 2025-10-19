import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Image,
  Alert,
  Platform,
  Modal,
  FlatList,
  TextInput,
} from "react-native";
import { Stack, useRouter } from "expo-router";
import {
  User,
  Camera,
  Check,
} from "lucide-react-native";
import * as ImagePicker from "expo-image-picker";
import DateTimePicker from "@react-native-community/datetimepicker";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useAppStore } from "@/hooks/useAppStore";
import { colors as baseColors } from "@/constants/colors";
import { Button } from "@/components/Button";
import { Input } from "@/components/Input";
import { cities } from "@/mocks/cities";
import { categories } from "@/mocks/categories";
import { useTranslation } from "@/hooks/useTranslation";

export default function EditProfileScreen() {
  const { user, setUser,darkModeEnabled } = useAppStore();
  const { language } = useTranslation();
  const router = useRouter();

  const [formData, setFormData] = useState({
    firstName: user?.name?.split(" ")[0] || "",
    lastName: user?.name?.split(" ").slice(1).join(" ") || "",
    phone: user?.phone || "",
    email: user?.email || "",
    cityId: user?.cityId || "1",
    gender: user?.gender || "",
    birthday: user?.birthday ? new Date(user.birthday) : null,
    address: user?.address || "",
    favoriteServices: user?.favoriteServices || [],
    avatar: user?.avatar || "",
  });

  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showCityModal, setShowCityModal] = useState(false);
  const [showGenderModal, setShowGenderModal] = useState(false);
  const [showServicesModal, setShowServicesModal] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const BASE_URL = process.env.EXPO_PUBLIC_SERVER_IP;

  const genderOptions = [
    { value: "male", label: "Male" },
    { value: "female", label: "Female" },
    { value: "other", label: "Other" },
  ];

  const colors = {
    background: darkModeEnabled ? "#121212" : "#FFFFFF",
    card: darkModeEnabled ? "#1E1E1E" : "#FFFFFF",
    text: darkModeEnabled ? "#FFFFFF" : "#000000",
    textSecondary: darkModeEnabled ? "#AAAAAA" : "#6B7280",
    primary: baseColors.primary,
    border: darkModeEnabled ? "#333333" : "#E5E7EB",
  };

  const getCityName = (cityId) => {
    const city = cities.find((c) => c.id === cityId);
    if (!city) return "";
    switch (language) {
      case "ru": return city.nameRu;
      case "uz": return city.nameUz;
      default: return city.name;
    }
  };

  const pickImage = async () => {
    if (Platform.OS === "web") {
      const input = document.createElement("input");
      input.type = "file";
      input.accept = "image/*";
      input.onchange = (event) => {
        const file = event.target.files[0];
        if (file) {
          const reader = new FileReader();
          reader.onload = (e) => {
            if (e.target?.result) {
              setFormData((prev) => ({ ...prev, avatar: e.target.result }));
            }
          };
          reader.readAsDataURL(file);
        }
      };
      input.click();
      return;
    }

    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== "granted") {
      Alert.alert("Permission needed", "Please grant camera roll permissions.");
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.8,
    });

    if (!result.canceled && result.assets[0]) {
      setFormData((prev) => ({ ...prev, avatar: result.assets[0].uri }));
    }
  };

  const takePhoto = async () => {
    if (Platform.OS === "web") {
      Alert.alert("Camera not available on web");
      return;
    }

    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    if (status !== "granted") {
      Alert.alert("Permission needed", "Please grant camera permissions.");
      return;
    }

    const result = await ImagePicker.launchCameraAsync({
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.8,
    });

    if (!result.canceled && result.assets[0]) {
      setFormData((prev) => ({ ...prev, avatar: result.assets[0].uri }));
    }
  };

  const showImagePicker = () => {
    if (Platform.OS === "web") {
      pickImage();
      return;
    }
    Alert.alert("Change Profile Photo", "Choose an option", [
      { text: "Camera", onPress: takePhoto },
      { text: "Photo Library", onPress: pickImage },
      { text: "Cancel", style: "cancel" },
    ]);
  };

  const handleDateChange = (event, selectedDate) => {
    setShowDatePicker(Platform.OS === "ios");
    if (selectedDate) {
      setFormData((prev) => ({ ...prev, birthday: selectedDate }));
    }
  };

  const toggleFavoriteService = (serviceId) => {
    setFormData((prev) => ({
      ...prev,
      favoriteServices: prev.favoriteServices.includes(serviceId)
        ? prev.favoriteServices.filter((id) => id !== serviceId)
        : [...prev.favoriteServices, serviceId],
    }));
  };

  const handleSave = async () => {
    if (!formData.firstName.trim() || !formData.lastName.trim()) {
      Alert.alert("Error", "First name and last name are required");
      return;
    }
    if (!formData.phone.trim() && !formData.email.trim()) {
      Alert.alert(
        "Error",
        "Please provide at least one contact method (phone number or email)"
      );
      return;
    }

    setIsLoading(true);
    try {
      const token = await AsyncStorage.getItem("token");
      if (!token) {
        Alert.alert("Error", "You are not logged in");
        setIsLoading(false);
        return;
      }

      const updatedUser = {
        name: `${formData.firstName.trim()} ${formData.lastName.trim()}`,
        phone: formData.phone.trim(),
        avatar: formData.avatar,
        selectedCity: getCityName(formData.cityId),
      };

      const response = await fetch(`https://${BASE_URL}/api/auth/me`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(updatedUser),
      });

      const data = await response.json();

      if (!response.ok) {
        Alert.alert("Error", data.msg || "Failed to update profile");
        setIsLoading(false);
        return;
      }

      setFormData((prev) => ({ ...prev, ...updatedUser }));
      await AsyncStorage.setItem("user", JSON.stringify(data.user));
      Alert.alert("Success", "Profile updated successfully");
    } catch (error) {
      console.error("Error updating profile:", error);
      Alert.alert("Error", "Failed to update profile");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <Stack.Screen
        options={{
          title: "Edit Profile",
          headerStyle: { backgroundColor: colors.background },
          headerTintColor: colors.text,
          headerTitleStyle: { fontWeight: "600" },
        }}
      />
      <View style={[styles.container, { backgroundColor: colors.background }]}>
        <ScrollView
          style={styles.scrollContainer}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          {/* Profile Photo */}
          <View style={[styles.photoSection, { borderBottomColor: colors.border }]}>
            <TouchableOpacity onPress={showImagePicker}>
              {formData.avatar ? (
                <Image source={{ uri: formData.avatar }} style={styles.avatar} />
              ) : (
                <View style={[styles.avatarPlaceholder, { backgroundColor: colors.primary }]}>
                  <User size={40} color="#FFFFFF" />
                </View>
              )}
              <View style={[styles.cameraIcon, { backgroundColor: colors.primary }]}>
                <Camera size={16} color="#FFFFFF" />
              </View>
            </TouchableOpacity>
            <Text style={{ marginTop: 12, color: colors.textSecondary }}>
              Tap to change photo
            </Text>
          </View>

          {/* Form Fields */}
          <View style={styles.formSection}>
            <View style={styles.fieldGroup}>
              <Text style={[styles.label, { color: colors.text }]}>First Name *</Text>
              <Input
                value={formData.firstName}
                onChangeText={(text) => setFormData((prev) => ({ ...prev, firstName: text }))}
                placeholderTextColor={colors.textSecondary}
                style={{ color: colors.text }}
              />
            </View>

            <View style={styles.fieldGroup}>
              <Text style={[styles.label, { color: colors.text }]}>Last Name *</Text>
              <Input
                value={formData.lastName}
                onChangeText={(text) => setFormData((prev) => ({ ...prev, lastName: text }))}
                placeholderTextColor={colors.textSecondary}
                style={{ color: colors.text }}
              />
            </View>

            <View style={styles.fieldGroup}>
              <Text style={[styles.label, { color: colors.text }]}>Phone</Text>
              <Input
                value={formData.phone}
                onChangeText={(text) => setFormData((prev) => ({ ...prev, phone: text }))}
                keyboardType="phone-pad"
                placeholderTextColor={colors.textSecondary}
                style={{ color: colors.text }}
              />
            </View>

            <Text style={{ fontSize: 12, fontStyle: "italic", color: colors.textSecondary }}>
              * At least one contact method is required
            </Text>

            <View style={styles.fieldGroup}>
              <Text style={[styles.label, { color: colors.text }]}>City</Text>
              <TouchableOpacity
                style={[styles.selectButton, { backgroundColor: colors.card, borderColor: colors.border }]}
                onPress={() => setShowCityModal(true)}
              >
                <Text style={{ color: colors.text }}>{getCityName(formData.cityId) || "Select city"}</Text>
              </TouchableOpacity>
            </View>

            <View style={styles.fieldGroup}>
              <Text style={[styles.label, { color: colors.text }]}>Gender</Text>
              <TouchableOpacity
                style={[styles.selectButton, { backgroundColor: colors.card, borderColor: colors.border }]}
                onPress={() => setShowGenderModal(true)}
              >
                <Text style={{ color: colors.text }}>
                  {formData.gender ? genderOptions.find((g) => g.value === formData.gender)?.label : "Select gender"}
                </Text>
              </TouchableOpacity>
            </View>

            <View style={styles.fieldGroup}>
              <Text style={[styles.label, { color: colors.text }]}>Address</Text>
              <View style={{
                borderWidth: 1,
                borderColor: colors.border,
                borderRadius: 12,
                backgroundColor: colors.card,
                paddingHorizontal: 16,
                paddingVertical: 12,
                minHeight: 50,
                justifyContent: "flex-start",
              }}>
                <TextInput
                  value={formData.address}
                  onChangeText={(text) => setFormData((prev) => ({ ...prev, address: text }))}
                  multiline
                  placeholder="Enter your address"
                  placeholderTextColor={colors.textSecondary}
                  style={{ fontSize: 13, color: colors.text, textAlignVertical: "top" }}
                />
              </View>
            </View>
          </View>

          <View style={styles.buttonSection}>
            <Button title="Save Changes" onPress={handleSave} loading={isLoading} />
          </View>
        </ScrollView>

        {showDatePicker && Platform.OS !== "web" && (
          <DateTimePicker
            value={formData.birthday || new Date()}
            mode="date"
            display="default"
            onChange={handleDateChange}
            maximumDate={new Date()}
          />
        )}

        {/* Modals */}
        {["City", "Gender", "Services"].map((modalType) => {
          const visible = modalType === "City" ? showCityModal : modalType === "Gender" ? showGenderModal : showServicesModal;
          const setVisible = modalType === "City" ? setShowCityModal : modalType === "Gender" ? setShowGenderModal : setShowServicesModal;
          const data = modalType === "City" ? cities : modalType === "Gender" ? genderOptions : categories;
          return (
            <Modal key={modalType} visible={visible} animationType="slide" transparent={modalType !== "Services"}>
              <View style={styles.modalOverlay}>
                <View style={[styles.modalContainer, { backgroundColor: colors.card }]}>
                  <Text style={[styles.modalTitle, { color: colors.text }]}>
                    {modalType === "Services" ? "Favorite Services" : `Select ${modalType}`}
                  </Text>
                  <FlatList
                    data={data}
                    keyExtractor={(item) => item.id || item.value}
                    renderItem={({ item }) => {
                      const isSelected = modalType === "City"
                        ? formData.cityId === item.id
                        : modalType === "Gender"
                        ? formData.gender === item.value
                        : formData.favoriteServices.includes(item.id);
                      return (
                        <TouchableOpacity
                          onPress={() => {
                            if (modalType === "City") setFormData((prev) => ({ ...prev, cityId: item.id }));
                            else if (modalType === "Gender") setFormData((prev) => ({ ...prev, gender: item.value }));
                            else toggleFavoriteService(item.id);
                            if (modalType !== "Services") setVisible(false);
                          }}
                          activeOpacity={0.7}
                          style={{
                            flexDirection: "row",
                            alignItems: "center",
                            justifyContent: "space-between",
                            paddingVertical: 14,
                            paddingHorizontal: 20,
                            marginHorizontal: 16,
                            marginVertical: 4,
                            borderRadius: 12,
                            backgroundColor: isSelected ? colors.primary + "33" : colors.card,
                          }}
                        >
                          <Text style={{ fontSize: 16, color: isSelected ? colors.primary : colors.text }}>
                            {modalType === "Gender" ? item.label : item.name || getCityName(item.id)}
                          </Text>
                          {isSelected && <Check size={20} color={colors.primary} />}
                        </TouchableOpacity>
                      );
                    }}
                  />
                  {modalType !== "Services" && (
                    <TouchableOpacity
                      onPress={() => setVisible(false)}
                      style={{
                        marginTop: 16,
                        alignSelf: "center",
                        paddingHorizontal: 24,
                        paddingVertical: 12,
                        borderRadius: 12,
                        backgroundColor: colors.background,
                        borderWidth: 1,
                        borderColor: colors.border,
                      }}
                    >
                      <Text style={{ color: colors.text, fontWeight: "600" }}>Cancel</Text>
                    </TouchableOpacity>
                  )}
                </View>
              </View>
            </Modal>
          );
        })}
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  scrollContainer: { flex: 1 },
  photoSection: {
    alignItems: "center",
    paddingVertical: 32,
    borderBottomWidth: 1,
  },
  avatar: { width: 120, height: 120, borderRadius: 60 },
  avatarPlaceholder: {
    width: 120,
    height: 120,
    borderRadius: 60,
    justifyContent: "center",
    alignItems: "center",
  },
  cameraIcon: {
    position: "absolute",
    bottom: 0,
    right: 0,
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 3,
    borderColor: "#fff",
  },
  formSection: { padding: 24 },
  fieldGroup: { marginBottom: 24 },
  label: { marginBottom: 8, fontWeight: "600" },
  selectButton: {
    flexDirection: "row",
    justifyContent: "space-between",
    padding: 16,
    borderWidth: 1,
    borderRadius: 12,
  },
  buttonSection: { padding: 24, paddingBottom: 40 },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
  },
  modalContainer: {
    marginHorizontal: 20,
    borderRadius: 16,
    maxHeight: "60%",
    paddingVertical: 16,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "600",
    textAlign: "center",
    marginBottom: 12,
  },
});
