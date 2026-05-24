import type { Locale, Translations } from './types';
import { en, el } from './locales';

export type { Locale, Translations };

export const translations: Record<Locale, Translations> = {
    en,
    el,
};
