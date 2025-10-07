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
  Calendar,
  MapPin,
  Check,
  X,
  ChevronDown,
} from "lucide-react-native";
import * as ImagePicker from "expo-image-picker";
import DateTimePicker from "@react-native-community/datetimepicker";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useAppStore } from "@/hooks/useAppStore";
import { colors } from "@/constants/colors";
import { Button } from "@/components/Button";
import { Input } from "@/components/Input";
import { cities } from "@/mocks/cities";
import { categories } from "@/mocks/categories";
import { useTranslation } from "@/hooks/useTranslation";

export default function EditProfileScreen() {
  const { user, setUser } = useAppStore();
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

  const genderOptions = [
    { value: "male", label: "Male" },
    { value: "female", label: "Female" },
    { value: "other", label: "Other" },
  ];

  const getCityName = (cityId) => {
    const city = cities.find((c) => c.id === cityId);
    if (!city) return "";
    switch (language) {
      case "ru":
        return city.nameRu;
      case "uz":
        return city.nameUz;
      default:
        return city.name;
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

  const formatDate = (date) =>
    date ? date.toLocaleDateString() : "Select birthday";

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
      const token = await AsyncStorage.getItem("token"); // get saved JWT token

      if (!token) {
        Alert.alert("Error", "You are not logged in");
        setIsLoading(false);
        return;
      }

      const updatedUser = {
        name: `${formData.firstName.trim()} ${formData.lastName.trim()}`,
        phone: formData.phone.trim(),
        avatar: formData.avatar,
        selectedCity: formData.cityId,
      };

      const response = await fetch("http://192.168.1.5:5000/api/auth/me", {
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

      // Update local store
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
          headerStyle: { backgroundColor: "#FFFFFF" },
          headerTintColor: colors.text,
          headerTitleStyle: { fontWeight: "600" },
        }}
      />
      <View style={styles.container}>
        <ScrollView
          style={styles.scrollContainer}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          {/* Profile Photo */}
          <View style={styles.photoSection}>
            <TouchableOpacity onPress={showImagePicker}>
              {formData.avatar ? (
                <Image
                  source={{ uri: formData.avatar }}
                  style={styles.avatar}
                />
              ) : (
                <View style={styles.avatarPlaceholder}>
                  <User size={40} color="#FFFFFF" />
                </View>
              )}
              <View style={styles.cameraIcon}>
                <Camera size={16} color="#FFFFFF" />
              </View>
            </TouchableOpacity>
            <Text style={styles.photoText}>Tap to change photo</Text>
          </View>

          {/* Form Fields */}
          <View style={styles.formSection}>
            <View style={styles.fieldGroup}>
              <Text style={styles.label}>First Name *</Text>
              <Input
                value={formData.firstName}
                onChangeText={(text) =>
                  setFormData((prev) => ({ ...prev, firstName: text }))
                }
              />
            </View>

            <View style={styles.fieldGroup}>
              <Text style={styles.label}>Last Name *</Text>
              <Input
                value={formData.lastName}
                onChangeText={(text) =>
                  setFormData((prev) => ({ ...prev, lastName: text }))
                }
              />
            </View>

            <View style={styles.fieldGroup}>
              <Text style={styles.label}>Phone</Text>
              <Input
                value={formData.phone}
                onChangeText={(text) =>
                  setFormData((prev) => ({ ...prev, phone: text }))
                }
                keyboardType="phone-pad"
              />
            </View>

            <Text style={styles.contactNote}>
              * At least one contact method is required
            </Text>

            <View style={styles.fieldGroup}>
              <Text style={styles.label}>City</Text>
              <TouchableOpacity
                style={styles.selectButton}
                onPress={() => setShowCityModal(true)}
              >
                <Text>{getCityName(formData.cityId) || "Select city"}</Text>
              </TouchableOpacity>
            </View>

            <View style={styles.fieldGroup}>
              <Text style={styles.label}>Gender</Text>
              <TouchableOpacity
                style={styles.selectButton}
                onPress={() => setShowGenderModal(true)}
              >
                <Text>
                  {formData.gender
                    ? genderOptions.find((g) => g.value === formData.gender)
                        ?.label
                    : "Select gender"}
                </Text>
              </TouchableOpacity>
            </View>

            <View style={styles.fieldGroup}>
              <Text style={styles.label}>Address</Text>
              <View
                style={{
                  borderWidth: 1,
                  borderColor: colors.border,
                  borderRadius: 12,
                  backgroundColor: "#FFFFFF",
                  paddingHorizontal: 16,
                  paddingVertical: 12,
                  minHeight: 50,
                  justifyContent: "flex-start",
                }}
              >
                <TextInput
                  value={formData.address}
                  onChangeText={(text) =>
                    setFormData((prev) => ({ ...prev, address: text }))
                  }
                  multiline
                  placeholder="Enter your address"
                  placeholderTextColor={"black"}
                  style={{
                    fontSize: 13,
                    color: "black",
                    textAlignVertical: "top",
                  }}
                />
              </View>
            </View> 
          </View>

          <View style={styles.buttonSection}>
            <Button
              title="Save Changes"
              onPress={handleSave}
              loading={isLoading}
            />
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

        {/* City Modal */}
        <Modal visible={showCityModal} animationType="slide" transparent>
          <View style={styles.modalOverlay}>
            <View style={styles.modalContainer}>
              <Text style={styles.modalTitle}>Select City</Text>
              <FlatList
                data={cities}
                keyExtractor={(item) => item.id}
                contentContainerStyle={{ paddingVertical: 16 }}
                renderItem={({ item }) => {
                  const isSelected = formData.cityId === item.id;
                  return (
                    <TouchableOpacity
                      onPress={() => {
                        setFormData((prev) => ({ ...prev, cityId: item.id }));
                        setShowCityModal(false);
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
                        backgroundColor: isSelected
                          ? colors.primary + "33"
                          : "#F8F8F8",
                      }}
                    >
                      <Text
                        style={{
                          fontSize: 16,
                          color: isSelected ? colors.primary : colors.text,
                        }}
                      >
                        {getCityName(item.id)}
                      </Text>
                      {isSelected && <Check size={20} color={colors.primary} />}
                    </TouchableOpacity>
                  );
                }}
              />
              <TouchableOpacity
                onPress={() => setShowCityModal(false)}
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
                <Text style={{ color: colors.text, fontWeight: "600" }}>
                  Cancel
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>

        {/* Gender Modal */}
        <Modal visible={showGenderModal} animationType="slide" transparent>
          <View style={styles.modalOverlay}>
            <View style={styles.modalContainer}>
              <Text style={styles.modalTitle}>Select Gender</Text>
              <FlatList
                data={genderOptions}
                keyExtractor={(item) => item.value}
                contentContainerStyle={{ paddingVertical: 16 }}
                renderItem={({ item }) => {
                  const isSelected = formData.gender === item.value;
                  return (
                    <TouchableOpacity
                      onPress={() => {
                        setFormData((prev) => ({
                          ...prev,
                          gender: item.value,
                        }));
                        setShowGenderModal(false);
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
                        backgroundColor: isSelected
                          ? colors.primary + "33"
                          : "#F8F8F8",
                      }}
                    >
                      <Text
                        style={{
                          fontSize: 16,
                          color: isSelected ? colors.primary : colors.text,
                        }}
                      >
                        {item.label}
                      </Text>
                      {isSelected && <Check size={20} color={colors.primary} />}
                    </TouchableOpacity>
                  );
                }}
              />
              <TouchableOpacity
                onPress={() => setShowGenderModal(false)}
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
                <Text style={{ color: colors.text, fontWeight: "600" }}>
                  Cancel
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>

        {/* Favorite Services Modal */}
        <Modal visible={showServicesModal} animationType="slide">
          <View style={styles.modalContainer}>
            <Text style={styles.modalTitle}>Favorite Services</Text>
            <FlatList
              data={categories}
              keyExtractor={(item) => item.id}
              renderItem={({ item }) => (
                <TouchableOpacity
                  onPress={() => toggleFavoriteService(item.id)}
                >
                  <Text>{item.name}</Text>
                  {formData.favoriteServices.includes(item.id) && (
                    <Check color={colors.primary} />
                  )}
                </TouchableOpacity>
              )}
            />
          </View>
        </Modal>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff" },
  scrollContainer: { flex: 1 },
  photoSection: {
    alignItems: "center",
    paddingVertical: 32,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  avatar: { width: 120, height: 120, borderRadius: 60 },
  avatarPlaceholder: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: colors.primary,
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
    backgroundColor: colors.primary,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 3,
    borderColor: "#fff",
  },
  photoText: { marginTop: 12, color: colors.textSecondary },
  formSection: { padding: 24 },
  fieldGroup: { marginBottom: 24 },
  label: { marginBottom: 8, fontWeight: "600", color: colors.text },
  selectButton: {
    flexDirection: "row",
    justifyContent: "space-between",
    padding: 16,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 12,
    backgroundColor: "#fff",
  },
  buttonSection: { padding: 24, paddingBottom: 40 },
  contactNote: {
    fontSize: 12,
    fontStyle: "italic",
    color: colors.textSecondary,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
  },
  modalContainer: {
    backgroundColor: "#FFFFFF",
    marginHorizontal: 20,
    borderRadius: 16,
    maxHeight: "60%",
    paddingVertical: 16,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: colors.text,
    textAlign: "center",
    marginBottom: 12,
  },
});
