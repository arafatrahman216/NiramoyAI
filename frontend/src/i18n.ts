import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';
import enTranslations from './locales/en.json';
import bnTranslations from './locales/bn.json';

// Resources
const resources = {
  en: {
    translation: enTranslations,
  },
  bn: {
    translation: bnTranslations,
  },
};

// Initialize i18next
if (!i18n.isInitialized) {
  i18n
    .use(LanguageDetector) // Detect user language from browser
    .use(initReactI18next) // Pass i18n instance to react-i18next
    .init({
      resources,
      fallbackLng: 'en', // Fallback language if detection fails
      ns: ['translation'], // Namespace
      defaultNS: 'translation',
      interpolation: {
        escapeValue: false, // React already protects from XSS
      },
      detection: {
        order: ['localStorage', 'navigator'], // Check localStorage first, then browser language
        caches: ['localStorage'], // Cache selected language to localStorage
      },
      react: {
        useSuspense: false, // Disable suspense for better compatibility
      },
    });
}

export default i18n;
export {};
