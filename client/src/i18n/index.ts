import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

// Import translation files
import huCommon from './locales/hu/common.json';
import huNav from './locales/hu/nav.json';
import huHome from './locales/hu/home.json';
import huServices from './locales/hu/services.json';
import huContact from './locales/hu/contact.json';
import huAppointment from './locales/hu/appointment.json';
import huFooter from './locales/hu/footer.json';

import enCommon from './locales/en/common.json';
import enNav from './locales/en/nav.json';
import enHome from './locales/en/home.json';
import enServices from './locales/en/services.json';
import enContact from './locales/en/contact.json';
import enAppointment from './locales/en/appointment.json';
import enFooter from './locales/en/footer.json';

const resources = {
  hu: {
    common: huCommon,
    nav: huNav,
    home: huHome,
    services: huServices,
    contact: huContact,
    appointment: huAppointment,
    footer: huFooter,
  },
  en: {
    common: enCommon,
    nav: enNav,
    home: enHome,
    services: enServices,
    contact: enContact,
    appointment: enAppointment,
    footer: enFooter,
  },
};

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources,
    lng: 'hu', // Default language is Hungarian
    fallbackLng: 'en', // Fallback to English
    defaultNS: 'common',
    ns: ['common', 'nav', 'home', 'services', 'contact', 'appointment', 'footer'],
    
    interpolation: {
      escapeValue: false, // React already does escaping
    },

    // Language detection configuration
    detection: {
      order: ['localStorage', 'navigator'],
      lookupLocalStorage: 'i18nextLng',
      caches: ['localStorage'],
    },
  });

// Set document language attribute
i18n.on('languageChanged', (lng) => {
  document.documentElement.lang = lng;
});

export default i18n;