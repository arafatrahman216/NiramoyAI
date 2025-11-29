import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';
import enTranslations from './locales/en.json';
import bnTranslations from './locales/bn.json';

// Define available languages
export const LANGUAGES = {
  EN: 'en',
  BN: 'bn',
};

export const languageNames = {
  [LANGUAGES.EN]: 'English',
  [LANGUAGES.BN]: 'বাংলা',
};

// Translation resources
const resources = {
  en: {
    translation: enTranslations,
  },
  bn: {
    translation: bnTranslations,
  },
};

// Initialize i18next
i18n
  .use(LanguageDetector) // Detects user language preference
  .use(initReactI18next) // Passes i18n down to react-i18next
  .init({
    resources,
    fallbackLng: LANGUAGES.EN, // Fallback language if detection fails
    interpolation: {
      escapeValue: false, // React already prevents XSS attacks
    },
    detection: {
      order: ['localStorage', 'navigator'], // Check localStorage first, then browser language
      caches: ['localStorage'], // Cache selected language in localStorage
    },
  });

export default i18n;
