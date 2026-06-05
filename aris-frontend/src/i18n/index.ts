import i18n from 'i18next';
import { initReactI18next } from "react-i18next";
import LanguageDetector from "i18next-browser-languagedetector";

import en from './locales/en/translation.json';
import si from './locales/si/translation.json';

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    fallbackLng: 'en',
    
    resources: {
      en: {
        translation: en
      },
      si: {
        translation: si
      },
    },

    interpolation: {
      escapeValue: false
    },
  });

export default i18n;