// i18n/index.ts
import { useConfigStore } from '../utils/state';
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

type TranslationKeys<T> = T extends object
    ? { [K in keyof T]: K extends string ? T[K] extends string ? K : `${K}.${TranslationKeys<T[K]>}` : never }[keyof T]
    : never;

export type TranslationKey = TranslationKeys<typeof en>;
export type Language = keyof typeof translations;

function getTranslation(key: TranslationKey, language: Language): string {
    const keys = key.split('.');
    let value: any = translations[language] || translations.en;

    for (const k of keys) {
        value = value?.[k];
        if (value === undefined) {
            // Fallback to English
            value = translations.en;
            for (const fallbackKey of keys) {
                value = value?.[fallbackKey];
                if (value === undefined) break;
            }
            break;
        }
    }

    return value || key;
}

// type-safe translation hook
export function useTranslation() {
    const language = useConfigStore((state) => state.language);
    const t = (key: TranslationKey): string => getTranslation(key, language as Language);
    return { t, language };
}

export function t(key: TranslationKey): string {
    const language = useConfigStore.getState().language as Language;
    return getTranslation(key, language);
}

export { en, de, fr, it, jp, zh };