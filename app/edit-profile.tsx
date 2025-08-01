import React, { useState } from 'react';
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
  FlatList
} from 'react-native';
import { Stack, useRouter } from 'expo-router';
import {
  User,
  Camera,
  Calendar,
  MapPin,
  Phone,
  Mail,
  ChevronDown,
  Check,
  X
} from 'lucide-react-native';
import * as ImagePicker from 'expo-image-picker';
import DateTimePicker from '@react-native-community/datetimepicker';
import { useAppStore } from '@/hooks/useAppStore';
import { colors } from '@/constants/colors';
import { Button } from '@/components/Button';
import { Input } from '@/components/Input';
import { cities } from '@/mocks/cities';
import { categories } from '@/mocks/categories';
import { useTranslation } from '@/hooks/useTranslation';

interface FormData {
  name: string;
  phone: string;
  email: string;
  cityId: string;
  gender: 'male' | 'female' | 'other' | '';
  birthday: Date | null;
  address: string;
  favoriteServices: string[];
  avatar?: string;
}

export default function EditProfileScreen() {
  const { user, updateUserProfile } = useAppStore();
  const { language } = useTranslation();
  const router = useRouter();
  
  const [formData, setFormData] = useState<FormData>({
    name: user?.name || '',
    phone: user?.phone || '',
    email: user?.email || '',
    cityId: user?.cityId || '1',
    gender: user?.gender || '',
    birthday: user?.birthday ? new Date(user.birthday) : null,
    address: user?.address || '',
    favoriteServices: [],
    avatar: user?.avatar
  });
  
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showCityModal, setShowCityModal] = useState(false);
  const [showGenderModal, setShowGenderModal] = useState(false);
  const [showServicesModal, setShowServicesModal] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  
  const genderOptions = [
    { value: 'male', label: 'Male' },
    { value: 'female', label: 'Female' },
    { value: 'other', label: 'Other' }
  ];
  
  const getCityName = (cityId: string) => {
    const city = cities.find(c => c.id === cityId);
    if (!city) return '';
    
    switch (language) {
      case 'ru':
        return city.nameRu;
      case 'uz':
        return city.nameUz;
      default:
        return city.name;
    }
  };
  
  const pickImage = async () => {
    try {
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      
      if (status !== 'granted') {
        Alert.alert('Permission needed', 'Please grant camera roll permissions to change your profile photo.');
        return;
      }
      
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.8,
      });
      
      if (!result.canceled && result.assets[0]) {
        setFormData(prev => ({ ...prev, avatar: result.assets[0].uri }));
      }
    } catch (error) {
      console.error('Error picking image:', error);
      Alert.alert('Error', 'Failed to pick image. Please try again.');
    }
  };
  
  const takePhoto = async () => {
    try {
      const { status } = await ImagePicker.requestCameraPermissionsAsync();
      
      if (status !== 'granted') {
        Alert.alert('Permission needed', 'Please grant camera permissions to take a photo.');
        return;
      }
      
      const result = await ImagePicker.launchCameraAsync({
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.8,
      });
      
      if (!result.canceled && result.assets[0]) {
        setFormData(prev => ({ ...prev, avatar: result.assets[0].uri }));
      }
    } catch (error) {
      console.error('Error taking photo:', error);
      Alert.alert('Error', 'Failed to take photo. Please try again.');
    }
  };
  
  const showImagePicker = () => {
    Alert.alert(
      'Change Profile Photo',
      'Choose an option',
      [
        { text: 'Camera', onPress: takePhoto },
        { text: 'Photo Library', onPress: pickImage },
        { text: 'Cancel', style: 'cancel' }
      ]
    );
  };
  
  const handleDateChange = (event: any, selectedDate?: Date) => {
    console.log('Date picker event:', event, 'Selected date:', selectedDate);
    setShowDatePicker(Platform.OS === 'ios');
    if (selectedDate) {
      setFormData(prev => ({ ...prev, birthday: selectedDate }));
    }
  };
  
  const openDatePicker = () => {
    console.log('Opening date picker, current platform:', Platform.OS);
    setShowDatePicker(true);
  };
  
  const formatDate = (date: Date | null) => {
    if (!date) return 'Select birthday';
    return date.toLocaleDateString();
  };
  
  const toggleFavoriteService = (serviceId: string) => {
    setFormData(prev => ({
      ...prev,
      favoriteServices: prev.favoriteServices.includes(serviceId)
        ? prev.favoriteServices.filter(id => id !== serviceId)
        : [...prev.favoriteServices, serviceId]
    }));
  };
  
  const handleSave = async () => {
    if (!formData.name.trim()) {
      Alert.alert('Error', 'Name is required');
      return;
    }
    
    if (!formData.phone.trim() && !formData.email.trim()) {
      Alert.alert('Error', 'Please provide at least one contact method (phone number or email)');
      return;
    }
    
    setIsLoading(true);
    
    try {
      const updates = {
        name: formData.name.trim(),
        phone: formData.phone.trim(),
        email: formData.email.trim(),
        cityId: formData.cityId,
        gender: formData.gender || undefined,
        birthday: formData.birthday?.toISOString(),
        address: formData.address.trim(),
        avatar: formData.avatar
      };
      
      await updateUserProfile(updates);
      Alert.alert('Success', 'Profile updated successfully', [
        { text: 'OK', onPress: () => router.back() }
      ]);
    } catch (error) {
      console.error('Error updating profile:', error);
      Alert.alert('Error', 'Failed to update profile. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };
  
  return (
    <>
      <Stack.Screen 
        options={{
          title: 'Edit Profile',
          headerStyle: { backgroundColor: '#FFFFFF' },
          headerTintColor: colors.text,
          headerTitleStyle: { fontWeight: '600' }
        }} 
      />
      
      <View style={styles.container}>
        <ScrollView 
          style={styles.scrollContainer}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          {/* Profile Photo Section */}
          <View style={styles.photoSection}>
            <TouchableOpacity onPress={showImagePicker} activeOpacity={0.7}>
              {formData.avatar ? (
                <Image source={{ uri: formData.avatar }} style={styles.avatar} />
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
              <Text style={styles.label}>Name *</Text>
              <Input
                value={formData.name}
                onChangeText={(text) => setFormData(prev => ({ ...prev, name: text }))}
                placeholder="Enter your full name"
                style={styles.input}
              />
            </View>
            
            <View style={styles.fieldGroup}>
              <Text style={styles.label}>Phone Number</Text>
              <Input
                value={formData.phone}
                onChangeText={(text) => setFormData(prev => ({ ...prev, phone: text }))}
                placeholder="+1 234 567 8900"
                keyboardType="phone-pad"
                style={styles.input}
              />
            </View>
            
            <View style={styles.fieldGroup}>
              <Text style={styles.label}>Email</Text>
              <Input
                value={formData.email}
                onChangeText={(text) => setFormData(prev => ({ ...prev, email: text }))}
                placeholder="your@email.com"
                keyboardType="email-address"
                autoCapitalize="none"
                style={styles.input}
              />
            </View>
            
            <Text style={styles.contactNote}>* At least one contact method (phone or email) is required</Text>
            
            <View style={styles.fieldGroup}>
              <Text style={styles.label}>City</Text>
              <TouchableOpacity 
                style={styles.selectButton}
                onPress={() => setShowCityModal(true)}
                activeOpacity={0.7}
              >
                <View style={styles.selectContent}>
                  <MapPin size={20} color={colors.textSecondary} />
                  <Text style={styles.selectText}>
                    {getCityName(formData.cityId) || 'Select city'}
                  </Text>
                </View>
                <ChevronDown size={20} color={colors.textSecondary} />
              </TouchableOpacity>
            </View>
            
            <View style={styles.fieldGroup}>
              <Text style={styles.label}>Gender</Text>
              <TouchableOpacity 
                style={styles.selectButton}
                onPress={() => setShowGenderModal(true)}
                activeOpacity={0.7}
              >
                <View style={styles.selectContent}>
                  <User size={20} color={colors.textSecondary} />
                  <Text style={styles.selectText}>
                    {formData.gender ? genderOptions.find(g => g.value === formData.gender)?.label : 'Select gender'}
                  </Text>
                </View>
                <ChevronDown size={20} color={colors.textSecondary} />
              </TouchableOpacity>
            </View>
            
            <View style={styles.fieldGroup}>
              <Text style={styles.label}>Birthday</Text>
              <TouchableOpacity 
                style={styles.selectButton}
                onPress={openDatePicker}
                activeOpacity={0.7}
              >
                <View style={styles.selectContent}>
                  <Calendar size={20} color={colors.textSecondary} />
                  <Text style={styles.selectText}>
                    {formatDate(formData.birthday)}
                  </Text>
                </View>
                <ChevronDown size={20} color={colors.textSecondary} />
              </TouchableOpacity>
            </View>
            
            <View style={styles.fieldGroup}>
              <Text style={styles.label}>Address</Text>
              <Input
                value={formData.address}
                onChangeText={(text) => setFormData(prev => ({ ...prev, address: text }))}
                placeholder="Enter your address"
                multiline
                numberOfLines={3}
                style={[styles.input, styles.textArea]}
              />
            </View>
            
            <View style={styles.fieldGroup}>
              <Text style={styles.label}>Favorite Service Types (Optional)</Text>
              <TouchableOpacity 
                style={styles.selectButton}
                onPress={() => setShowServicesModal(true)}
                activeOpacity={0.7}
              >
                <View style={styles.selectContent}>
                  <Text style={styles.selectText}>
                    {formData.favoriteServices.length > 0 
                      ? `${formData.favoriteServices.length} services selected`
                      : 'Select favorite services'
                    }
                  </Text>
                </View>
                <ChevronDown size={20} color={colors.textSecondary} />
              </TouchableOpacity>
            </View>
          </View>
          
          {/* Save Button */}
          <View style={styles.buttonSection}>
            <Button
              title="Save Changes"
              onPress={handleSave}
              loading={isLoading}
              style={styles.saveButton}
            />
          </View>
        </ScrollView>
        
        {/* Date Picker */}
        {showDatePicker && Platform.OS !== 'web' && (
          <DateTimePicker
            value={formData.birthday || new Date()}
            mode="date"
            display={Platform.OS === 'ios' ? 'spinner' : 'default'}
            onChange={handleDateChange}
            maximumDate={new Date()}
          />
        )}
        
        {/* Web Date Picker Modal */}
        {showDatePicker && Platform.OS === 'web' && (
          <Modal
            visible={showDatePicker}
            animationType="slide"
            presentationStyle="pageSheet"
            transparent={true}
          >
            <View style={styles.webDatePickerOverlay}>
              <View style={styles.webDatePickerContainer}>
                <View style={styles.modalHeader}>
                  <Text style={styles.modalTitle}>Select Birthday</Text>
                  <TouchableOpacity onPress={() => setShowDatePicker(false)}>
                    <X size={24} color={colors.text} />
                  </TouchableOpacity>
                </View>
                <View style={styles.webDatePickerContent}>
                  <input
                    type="date"
                    value={formData.birthday ? formData.birthday.toISOString().split('T')[0] : ''}
                    max={new Date().toISOString().split('T')[0]}
                    onChange={(e) => {
                      if (e.target.value) {
                        const selectedDate = new Date(e.target.value);
                        setFormData(prev => ({ ...prev, birthday: selectedDate }));
                      }
                    }}
                    style={{
                      width: '100%',
                      padding: 16,
                      fontSize: 16,
                      border: `1px solid ${colors.border}`,
                      borderRadius: 12,
                      backgroundColor: '#FFFFFF'
                    }}
                  />
                  <View style={styles.webDatePickerButtons}>
                    <TouchableOpacity
                      style={[styles.webDatePickerButton, styles.webDatePickerButtonCancel]}
                      onPress={() => setShowDatePicker(false)}
                    >
                      <Text style={styles.webDatePickerButtonTextCancel}>Cancel</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      style={[styles.webDatePickerButton, styles.webDatePickerButtonConfirm]}
                      onPress={() => setShowDatePicker(false)}
                    >
                      <Text style={styles.webDatePickerButtonTextConfirm}>Done</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              </View>
            </View>
          </Modal>
        )}
        
        {/* City Modal */}
        <Modal
          visible={showCityModal}
          animationType="slide"
          presentationStyle="pageSheet"
        >
          <View style={styles.modalContainer}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Select City</Text>
              <TouchableOpacity onPress={() => setShowCityModal(false)}>
                <X size={24} color={colors.text} />
              </TouchableOpacity>
            </View>
            <FlatList
              data={cities}
              keyExtractor={(item) => item.id}
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={styles.modalItem}
                  onPress={() => {
                    setFormData(prev => ({ ...prev, cityId: item.id }));
                    setShowCityModal(false);
                  }}
                  activeOpacity={0.7}
                >
                  <Text style={styles.modalItemText}>{getCityName(item.id)}</Text>
                  {formData.cityId === item.id && (
                    <Check size={20} color={colors.primary} />
                  )}
                </TouchableOpacity>
              )}
            />
          </View>
        </Modal>
        
        {/* Gender Modal */}
        <Modal
          visible={showGenderModal}
          animationType="slide"
          presentationStyle="pageSheet"
        >
          <View style={styles.modalContainer}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Select Gender</Text>
              <TouchableOpacity onPress={() => setShowGenderModal(false)}>
                <X size={24} color={colors.text} />
              </TouchableOpacity>
            </View>
            <FlatList
              data={genderOptions}
              keyExtractor={(item) => item.value}
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={styles.modalItem}
                  onPress={() => {
                    setFormData(prev => ({ ...prev, gender: item.value as any }));
                    setShowGenderModal(false);
                  }}
                  activeOpacity={0.7}
                >
                  <Text style={styles.modalItemText}>{item.label}</Text>
                  {formData.gender === item.value && (
                    <Check size={20} color={colors.primary} />
                  )}
                </TouchableOpacity>
              )}
            />
          </View>
        </Modal>
        
        {/* Services Modal */}
        <Modal
          visible={showServicesModal}
          animationType="slide"
          presentationStyle="pageSheet"
        >
          <View style={styles.modalContainer}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Favorite Services</Text>
              <TouchableOpacity onPress={() => setShowServicesModal(false)}>
                <X size={24} color={colors.text} />
              </TouchableOpacity>
            </View>
            <FlatList
              data={categories}
              keyExtractor={(item) => item.id}
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={styles.modalItem}
                  onPress={() => toggleFavoriteService(item.id)}
                  activeOpacity={0.7}
                >
                  <Text style={styles.modalItemText}>{item.name}</Text>
                  {formData.favoriteServices.includes(item.id) && (
                    <Check size={20} color={colors.primary} />
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
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  scrollContainer: {
    flex: 1,
  },
  photoSection: {
    alignItems: 'center',
    paddingVertical: 32,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  avatar: {
    width: 120,
    height: 120,
    borderRadius: 60,
  },
  avatarPlaceholder: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cameraIcon: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 3,
    borderColor: '#FFFFFF',
  },
  photoText: {
    fontSize: 14,
    color: colors.textSecondary,
    marginTop: 12,
  },
  formSection: {
    padding: 24,
  },
  fieldGroup: {
    marginBottom: 24,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 8,
  },
  input: {
    marginBottom: 0,
  },
  textArea: {
    minHeight: 80,
    textAlignVertical: 'top',
  },
  selectButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 16,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 12,
    backgroundColor: '#FFFFFF',
  },
  selectContent: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  selectText: {
    fontSize: 16,
    color: colors.text,
    marginLeft: 12,
  },
  buttonSection: {
    padding: 24,
    paddingBottom: 40,
  },
  saveButton: {
    marginTop: 8,
  },
  modalContainer: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  modalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 24,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.text,
  },
  modalItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 24,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  modalItemText: {
    fontSize: 16,
    color: colors.text,
  },
  contactNote: {
    fontSize: 14,
    color: colors.textSecondary,
    fontStyle: 'italic',
    marginTop: -8,
    marginBottom: 16,
  },
  webDatePickerOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  webDatePickerContainer: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    width: '100%',
    maxWidth: 400,
    maxHeight: '80%',
  },
  webDatePickerContent: {
    padding: 24,
  },
  webDatePickerButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 24,
    gap: 12,
  },
  webDatePickerButton: {
    flex: 1,
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 12,
    alignItems: 'center',
  },
  webDatePickerButtonCancel: {
    backgroundColor: colors.background,
    borderWidth: 1,
    borderColor: colors.border,
  },
  webDatePickerButtonConfirm: {
    backgroundColor: colors.primary,
  },
  webDatePickerButtonTextCancel: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
  },
  webDatePickerButtonTextConfirm: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
  },
});