import { createContext, useContext, type ReactNode } from 'react';
import type { Locale } from './types';
import { UI_STRINGS, type UiStrings } from './ui';

export interface LanguageContextValue {
  locale: Locale;
  setLocale: (next: Locale) => void;
  toggleLocale: () => void;
  /** The active-locale string table. Prefer `t` for ergonomics. */
  t: UiStrings;
}

const LanguageContext = createContext<LanguageContextValue | null>(null);

interface LanguageProviderProps {
  locale: Locale;
  setLocale: (next: Locale) => void;
  toggleLocale: () => void;
  children: ReactNode;
}

export function LanguageProvider({
  locale,
  setLocale,
  toggleLocale,
  children,
}: LanguageProviderProps) {
  const t = UI_STRINGS[locale];
  const value: LanguageContextValue = { locale, setLocale, toggleLocale, t };
  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>;
}

/**
 * Returns the active locale along with the full UI string table and
 * setter helpers. Components that only need the active-locale UI strings
 * can still call this and destructure `t`.
 */
export function useLanguage(): LanguageContextValue {
  const ctx = useContext(LanguageContext);
  if (!ctx) {
    throw new Error('useLanguage must be used inside <LanguageProvider>.');
  }
  return ctx;
}

/** Narrow hook for components that only need the active locale. */
export function useLocale(): Locale {
  return useLanguage().locale;
}

/** Narrow hook for components that only read UI strings. */
export function useUiText(): UiStrings {
  return useLanguage().t;
}
