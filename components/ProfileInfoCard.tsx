import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import { User, Mail, Phone, MapPin, Calendar, Users } from 'lucide-react-native';
import { colors } from '@/constants/colors';
import { useTranslation } from '@/hooks/useTranslation';
import { useAppStore } from '@/hooks/useAppStore';

interface ProfileInfoCardProps {
  onEditPress: () => void;
}

export function ProfileInfoCard({ onEditPress }: ProfileInfoCardProps) {
  const { t } = useTranslation();
  const { user } = useAppStore();

  if (!user) return null;

  const getGenderDisplayText = () => {
    switch (user.gender) {
      case 'male': return t.profile.male;
      case 'female': return t.profile.female;
      case 'other': return t.profile.other;
      default: return 'Not specified';
    }
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return 'Not specified';
    const date = new Date(dateString);
    return date.toLocaleDateString();
  };

  const infoItems = [
    {
      icon: <Mail size={20} color={colors.primary} />,
      label: t.auth.email,
      value: user.email || 'Not specified',
    },
    {
      icon: <Phone size={20} color={colors.primary} />,
      label: t.auth.phone,
      value: user.phone || 'Not specified',
    },
    {
      icon: <Users size={20} color={colors.primary} />,
      label: t.profile.gender,
      value: getGenderDisplayText(),
    },
    {
      icon: <Calendar size={20} color={colors.primary} />,
      label: t.profile.birthday,
      value: formatDate(user.birthday),
    },
    {
      icon: <MapPin size={20} color={colors.primary} />,
      label: t.profile.address,
      value: user.address || 'Not specified',
    },
  ];

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.userInfo}>
          <View style={styles.avatar}>
            <User size={32} color={colors.primary} />
          </View>
          <View style={styles.userDetails}>
            <Text style={styles.userName}>{user.name}</Text>
            <Text style={styles.userEmail}>{user.email}</Text>
          </View>
        </View>
        <TouchableOpacity style={styles.editButton} onPress={onEditPress}>
          <Text style={styles.editButtonText}>{t.common.edit}</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.infoList}>
        {infoItems.map((item, index) => (
          <View key={index} style={styles.infoItem}>
            <View style={styles.infoItemLeft}>
              {item.icon}
              <Text style={styles.infoLabel}>{item.label}</Text>
            </View>
            <Text style={styles.infoValue}>{item.value}</Text>
          </View>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.card,
    borderRadius: 12,
    padding: 20,
    marginHorizontal: 24,
    marginTop: 16,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  userInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  avatar: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: colors.highlight,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },
  userDetails: {
    flex: 1,
  },
  userName: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 4,
  },
  userEmail: {
    fontSize: 14,
    color: colors.textSecondary,
  },
  editButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    backgroundColor: colors.primary,
    borderRadius: 8,
  },
  editButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '500',
  },
  infoList: {
    gap: 16,
  },
  infoItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  infoItemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  infoLabel: {
    fontSize: 14,
    color: colors.text,
    marginLeft: 12,
    fontWeight: '500',
  },
  infoValue: {
    fontSize: 14,
    color: colors.textSecondary,
    textAlign: 'right',
    flex: 1,
  },
});