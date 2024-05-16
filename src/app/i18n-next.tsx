import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import enUS from '../locales/en-US.json';
import en from '../locales/en.json';
import esAR from '../locales/es-AR.json';
import es from '../locales/es.json';

i18n.use(initReactI18next).init({
  debug: process.env.NODE_ENV !== 'production',
  lng: 'es-AR',
  fallbackLng: 'es-AR',
  interpolation: {
    escapeValue: false,
  },
  resources: {
    es,
    'es-AR': esAR,
    en,
    'en-US': enUS,
  },
});

export default i18n;
