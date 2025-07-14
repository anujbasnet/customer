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
import { colors } from '@/constants/colors';
import { useAppStore } from '@/hooks/useAppStore';
import { useTranslation } from '@/hooks/useTranslation';

export const LanguageSelector: React.FC = () => {
  const [modalVisible, setModalVisible] = React.useState(false);
  const { language, setLanguage } = useAppStore();
  const { t } = useTranslation();
  
  const handleSelectLanguage = (lang: Language) => {
    setLanguage(lang);
    setModalVisible(false);
  };
  
  const getCurrentLanguageName = () => {
    const currentLang = languages.find(l => l.code === language);
    return currentLang?.nativeName || '';
  };
  
  return (
    <View>
      <TouchableOpacity 
        style={styles.selector}
        onPress={() => setModalVisible(true)}
        activeOpacity={0.7}
        hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
      >
        <Globe size={20} color={colors.text} />
        <Text style={styles.selectorText}>{getCurrentLanguageName()}</Text>
      </TouchableOpacity>
      
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>{t.profile.language}</Text>
            
            <FlatList
              data={languages}
              keyExtractor={(item) => item.code}
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={styles.languageItem}
                  onPress={() => handleSelectLanguage(item.code as Language)}
                  activeOpacity={0.7}
                >
                  <Text style={styles.languageName}>{item.nativeName}</Text>
                  {language === item.code && (
                    <Check size={20} color={colors.primary} />
                  )}
                </TouchableOpacity>
              )}
              ItemSeparatorComponent={() => <View style={styles.separator} />}
              scrollEventThrottle={16}
            />
            
            <TouchableOpacity
              style={styles.closeButton}
              onPress={() => setModalVisible(false)}
              activeOpacity={0.7}
            >
              <Text style={styles.closeButtonText}>{t.common.cancel}</Text>
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
  },
  selectorText: {
    marginLeft: 8,
    fontSize: 16,
    color: colors.text,
  },
  modalOverlay: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 20,
    maxHeight: '70%',
    ...Platform.select({
      android: {
        elevation: 5,
      },
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
    color: colors.text,
  },
  separator: {
    height: 1,
    backgroundColor: colors.border,
  },
  closeButton: {
    marginTop: 16,
    paddingVertical: 12,
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  closeButtonText: {
    fontSize: 16,
    color: colors.primary,
    fontWeight: '500',
  },
});