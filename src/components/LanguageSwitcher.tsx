import type { Locale } from '../i18n/types';
import { LOCALES } from '../i18n/types';
import { useLanguage } from '../i18n/LanguageContext';
import styles from './LanguageSwitcher.module.css';

/**
 * Compact segmented control in the header for switching the active UI
 * locale. Two buttons, one per supported locale, the active one visually
 * marked with `aria-pressed`. Clicking the inactive one flips the locale
 * immediately; the `App.tsx` persistence + URL-sync effect then writes the
 * choice to `localStorage` and the `lang=` field of the URL hash.
 */
export function LanguageSwitcher() {
  const { locale, setLocale, t } = useLanguage();

  const label = (target: Locale): string =>
    target === 'en' ? t.language.en : t.language.tr;

  return (
    <div
      className={styles.root}
      role="group"
      aria-label={t.language.label}
    >
      {LOCALES.map((candidate) => {
        const active = candidate === locale;
        // The active button is a no-op; describe it as the current
        // language instead of prompting to "switch" to a language that
        // is already active. Screen readers read this literally.
        const accessibleLabel = active
          ? t.language.current(label(candidate))
          : t.language.switchTo(label(candidate));
        return (
          <button
            key={candidate}
            type="button"
            className={`${styles.button} ${active ? styles.active : ''}`}
            aria-pressed={active}
            aria-label={accessibleLabel}
            title={label(candidate)}
            onClick={() => {
              if (!active) setLocale(candidate);
            }}
          >
            {candidate.toUpperCase()}
          </button>
        );
      })}
    </div>
  );
}
