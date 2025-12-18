import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';
import en from './locales/en.json';
import es from './locales/es.json';
import fr from './locales/fr.json';
import ca from './locales/ca.json';
import nl from './locales/nl.json';
import it from './locales/it.json';
import de from './locales/de.json';
import pt from './locales/pt.json';

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources: {
      en: { translation: en },
      es: { translation: es },
      fr: { translation: fr },
      ca: { translation: ca },
      nl: { translation: nl },
      it: { translation: it },
      de: { translation: de },
      pt: { translation: pt },
    },
    fallbackLng: 'en',
    supportedLngs: ['en', 'es', 'fr', 'ca', 'nl', 'it', 'de', 'pt'],
    detection: {
      // Order: check browser language FIRST, then localStorage, then fallback to other methods
      order: ['navigator', 'localStorage', 'htmlTag', 'path', 'subdomain'],
      // Look for language in these navigator properties (mobile Safari compatible)
      lookupNavigator: ['language', 'languages'],
      // Cache the detected language in localStorage for future visits
      caches: ['localStorage'],
      // Check for exact match first, then partial match (e.g., es-ES -> es)
      checkWhitelist: true,
      // Convert language codes to lowercase for matching
      convertDetectedLanguage: (lng: string) => {
        // Handle cases like 'es-ES' -> 'es', 'en-US' -> 'en'
        return lng.split('-')[0].toLowerCase();
      },
    },
    interpolation: {
      escapeValue: false,
    },
  });

export default i18n;
