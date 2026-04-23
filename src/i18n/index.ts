export {
  LanguageProvider,
  useLanguage,
  useLocale,
  useUiText,
  type LanguageContextValue,
} from './LanguageContext';
export {
  DEFAULT_LOCALE,
  LOCALES,
  pickList,
  pickText,
  type Locale,
  type LocalizedStringList,
  type LocalizedText,
} from './types';
export { UI_STRINGS, type UiStrings } from './ui';

import type { Locale } from './types';

/**
 * Narrow a raw `navigator.language` value to a supported Locale. Returns
 * `undefined` on no match so the caller can fall through to its own
 * default.
 */
export function detectBrowserLocale(): Locale | undefined {
  if (typeof navigator === 'undefined') return undefined;
  const candidates: string[] = [];
  if (navigator.language) candidates.push(navigator.language);
  if (Array.isArray(navigator.languages)) {
    for (const l of navigator.languages) candidates.push(l);
  }
  for (const raw of candidates) {
    const tag = raw.toLowerCase();
    if (tag.startsWith('tr')) return 'tr';
    if (tag.startsWith('en')) return 'en';
  }
  return undefined;
}
