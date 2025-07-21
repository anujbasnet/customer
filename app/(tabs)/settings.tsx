import React from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity, 
  ScrollView,
  Switch
} from 'react-native';
import { 
  Globe, 
  Bell, 
  Moon, 
  ChevronRight
} from 'lucide-react-native';
import { useTranslation } from '@/hooks/useTranslation';
import { colors } from '@/constants/colors';
import { LanguageSelector } from '@/components/LanguageSelector';
import { ContactInfoModal } from '@/components/ContactInfoModal';
import { ProfileInfoCard } from '@/components/ProfileInfoCard';
import { useAppStore } from '@/hooks/useAppStore';

export default function SettingsScreen() {
  const { t } = useTranslation();
  const { user } = useAppStore();
  const [notificationsEnabled, setNotificationsEnabled] = React.useState(true);
  const [darkModeEnabled, setDarkModeEnabled] = React.useState(false);
  const [contactModalVisible, setContactModalVisible] = React.useState(false);
  
  const settingsSections = [
    {
      title: t.profile.settings,
      items: [
        {
          icon: <Globe size={24} color={colors.primary} />,
          title: t.profile.language,
          type: 'language',
        },
        {
          icon: <Bell size={24} color={colors.primary} />,
          title: t.profile.notifications,
          type: 'switch',
          value: notificationsEnabled,
          onValueChange: setNotificationsEnabled,
        },
        {
          icon: <Moon size={24} color={colors.primary} />,
          title: 'Dark Mode',
          type: 'switch',
          value: darkModeEnabled,
          onValueChange: setDarkModeEnabled,
        },
      ],
    },
  ];
  
  const renderSettingItem = (item: any, index: number) => {
    switch (item.type) {
      case 'language':
        return (
          <View key={index} style={styles.settingItem}>
            <View style={styles.settingItemLeft}>
              {item.icon}
              <Text style={styles.settingItemTitle}>{item.title}</Text>
            </View>
            <LanguageSelector />
          </View>
        );
      case 'switch':
        return (
          <View key={index} style={styles.settingItem}>
            <View style={styles.settingItemLeft}>
              {item.icon}
              <Text style={styles.settingItemTitle}>{item.title}</Text>
            </View>
            <Switch
              value={item.value}
              onValueChange={item.onValueChange}
              trackColor={{ false: colors.border, true: colors.primary }}
              thumbColor="#FFFFFF"
            />
          </View>
        );

      default:
        return (
          <TouchableOpacity
            key={index}
            style={styles.settingItem}
            onPress={item.onPress}
          >
            <View style={styles.settingItemLeft}>
              {item.icon}
              <Text style={styles.settingItemTitle}>{item.title}</Text>
            </View>
            <ChevronRight size={20} color={colors.textSecondary} />
          </TouchableOpacity>
        );
    }
  };
  
  return (
    <ScrollView style={styles.container}>
      <ProfileInfoCard onEditPress={() => setContactModalVisible(true)} />
      
      {settingsSections.map((section, sectionIndex) => (
        <View key={sectionIndex} style={styles.section}>
          <Text style={styles.sectionTitle}>{section.title}</Text>
          <View style={styles.sectionContent}>
            {section.items.map((item, itemIndex) => 
              renderSettingItem(item, itemIndex)
            )}
          </View>
        </View>
      ))}
      
      <ContactInfoModal
        visible={contactModalVisible}
        onClose={() => setContactModalVisible(false)}
      />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  section: {
    marginTop: 24,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.textSecondary,
    marginBottom: 8,
    paddingHorizontal: 24,
  },
  sectionContent: {
    backgroundColor: colors.card,
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: colors.border,
  },
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 16,
    paddingHorizontal: 24,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  settingItemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  settingItemTitle: {
    fontSize: 16,
    color: colors.text,
    marginLeft: 16,
  },
});