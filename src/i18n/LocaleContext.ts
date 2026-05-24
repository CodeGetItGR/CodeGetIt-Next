'use client'

import { createContext } from 'react';
import type { Locale, Translations } from './types.ts';

interface LocaleContextType {
    locale: Locale;
    setLocale: (locale: Locale) => void;
    t: Translations;
}

export const LocaleContext = createContext<LocaleContextType | undefined>(undefined);
