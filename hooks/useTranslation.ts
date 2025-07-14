import { useAppStore } from './useAppStore';
import { getTranslation } from '@/i18n/translations';

export const useTranslation = () => {
  const { language } = useAppStore();
  const t = getTranslation(language);
  
  return { t, language };
};