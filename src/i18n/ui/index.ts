import type { Locale } from '../types';
import { EN, type UiStrings } from './en';
import { TR } from './tr';

export type { UiStrings } from './en';

/**
 * Locale → UI string table lookup. The table is exhaustive by Locale; add
 * new locales by (a) extending the `Locale` union and (b) adding the
 * matching entry here. TypeScript will then require a full translation.
 */
export const UI_STRINGS: Record<Locale, UiStrings> = {
  en: EN,
  tr: TR,
};
