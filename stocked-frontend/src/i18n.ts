import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

import Backend from 'i18next-xhr-backend';
import LanguageDetector from 'i18next-browser-languagedetector';
import config from "./config";

const languages = ['en', 'uk'];

i18n
    .use(Backend)
    .use(LanguageDetector)
    .use(initReactI18next)
    .init({
        lng: 'en',
        fallbackLng: 'en',
        whitelist: languages,
        debug: config.main.debugMode,

        interpolation: {
            escapeValue: false,
        }
    });

export default i18n;