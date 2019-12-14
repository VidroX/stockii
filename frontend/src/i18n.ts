import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

import Backend from 'i18next-xhr-backend';
import LanguageDetector from 'i18next-browser-languagedetector';
import config from "./config";
import Cookies from "js-cookie";
import moment from "moment";

const whitelistedLanguages = ['en', 'uk'];
let lang = whitelistedLanguages[0];

const language = Cookies.get('language');
if (language != null && whitelistedLanguages.includes(language)) {
    lang = language;
} else {
    Cookies.set(
        'language',
        lang,
        {
            expires: moment().add(1, 'year').toDate(),
            secure: document.location.protocol === 'https:',
            sameSite: 'lax'
        }
    );
}

document.documentElement.lang = lang;

i18n
    .use(Backend)
    .use(LanguageDetector)
    .use(initReactI18next)
    .init({
        lng: lang,
        fallbackLng: 'en',
        whitelist: whitelistedLanguages,
        debug: config.main.debugMode,

        interpolation: {
            escapeValue: false,
        }
    });

export default i18n;