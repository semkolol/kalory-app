// i18n/utils.ts
import * as Localization from 'expo-localization';
import { en } from './en';
import { de } from './de';
import { fr } from './fr';
import { it } from './it';
import { jp } from './jp';
import { zh } from './zh';

const translations = {
    en,
    de,
    fr,
    it,
    jp,
    zh,
} as const;

export type Language = keyof typeof translations;

export const getDeviceLanguage = (): Language => {
    const locales = Localization.getLocales();
    const deviceLanguage = locales[0]?.languageCode;

    if (deviceLanguage && deviceLanguage in translations) {
        return deviceLanguage as Language;
    }

    return 'en'; // Default to English
};