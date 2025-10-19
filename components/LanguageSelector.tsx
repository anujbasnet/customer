import React from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity, 
  Modal,
  FlatList,
  Platform
} from 'react-native';
import { Check, Globe } from 'lucide-react-native';
import { languages, Language } from '@/constants/languages';
import { useAppStore } from '@/hooks/useAppStore';
import { useTranslation } from '@/hooks/useTranslation';
import { colors as baseColors } from '@/constants/colors';

interface LanguageSelectorProps {
  darkMode?: boolean;
}

export const LanguageSelector: React.FC<LanguageSelectorProps> = ({ darkMode }) => {
  const [modalVisible, setModalVisible] = React.useState(false);
  const { language, setLanguage, darkModeEnabled } = useAppStore();
  const { t } = useTranslation();

  const handleSelectLanguage = (lang: Language) => {
    setLanguage(lang);
    setModalVisible(false);
  };

  const getCurrentLanguageName = () => {
    const currentLang = languages.find(l => l.code === language);
    return currentLang?.nativeName || '';
  };

  const isDark = darkMode ?? darkModeEnabled;
  const bgColor = isDark ? '#1E1E1E' : '#FFFFFF';
  const textColor = isDark ? '#FFFFFF' : '#000000';
  const borderColor = isDark ? '#333333' : '#E5E7EB';

  return (
    <View>
      <TouchableOpacity 
        style={[styles.selector, { borderColor }]}
        onPress={() => setModalVisible(true)}
        activeOpacity={0.7}
        hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
      >
        <Globe size={20} color={textColor} />
        <Text style={[styles.selectorText, { color: textColor }]}>{getCurrentLanguageName()}</Text>
      </TouchableOpacity>

      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={[styles.modalContent, { backgroundColor: bgColor }]}>
            <Text style={[styles.modalTitle, { color: textColor }]}>{t.profile.language}</Text>

            <FlatList
              data={languages}
              keyExtractor={(item) => item.code}
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={styles.languageItem}
                  onPress={() => handleSelectLanguage(item.code as Language)}
                  activeOpacity={0.7}
                >
                  <Text style={[styles.languageName, { color: textColor }]}>{item.nativeName}</Text>
                  {language === item.code && <Check size={20} color={baseColors.primary} />}
                </TouchableOpacity>
              )}
              ItemSeparatorComponent={() => <View style={[styles.separator, { backgroundColor: borderColor }]} />}
              scrollEventThrottle={16}
            />

            <TouchableOpacity
              style={[styles.closeButton, { borderTopColor: borderColor }]}
              onPress={() => setModalVisible(false)}
              activeOpacity={0.7}
            >
              <Text style={[styles.closeButtonText, { color: baseColors.primary }]}>{t.common.cancel}</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  selector: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderWidth: 1,
    borderRadius: 12,
  },
  selectorText: {
    marginLeft: 8,
    fontSize: 16,
  },
  modalOverlay: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 20,
    maxHeight: '70%',
    ...Platform.select({
      android: { elevation: 5 },
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: -3 },
        shadowOpacity: 0.1,
        shadowRadius: 5,
      }
    })
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 16,
    textAlign: 'center',
  },
  languageItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 16,
  },
  languageName: {
    fontSize: 16,
  },
  separator: {
    height: 1,
  },
  closeButton: {
    marginTop: 16,
    paddingVertical: 12,
    alignItems: 'center',
    borderTopWidth: 1,
  },
  closeButtonText: {
    fontSize: 16,
    fontWeight: '500',
  },
});
