/**
 * Supported user interface languages. Kept deliberately small — any growth
 * must extend this union and every string table below alongside it.
 *
 * `'en'` is the canonical source. Translations target `'tr'` while keeping
 * a curated set of technical LQG terms in English (see `TECHNICAL_TERMS`
 * in the localised content files).
 */
export type Locale = 'en' | 'tr';

export const LOCALES: readonly Locale[] = ['en', 'tr'];

export const DEFAULT_LOCALE: Locale = 'en';

/**
 * A pair of strings — one per supported locale. Content objects that only
 * need a single localised label use this everywhere instead of plain
 * `string` fields.
 */
export interface LocalizedText {
  en: string;
  tr: string;
}

export interface LocalizedStringList {
  en: readonly string[];
  tr: readonly string[];
}

/**
 * Pick the active-locale string out of a `LocalizedText` with a safe
 * fallback to the English copy if a translation is missing.
 */
export function pickText(text: LocalizedText, locale: Locale): string {
  return text[locale] ?? text.en;
}

export function pickList(list: LocalizedStringList, locale: Locale): readonly string[] {
  return list[locale] ?? list.en;
}
