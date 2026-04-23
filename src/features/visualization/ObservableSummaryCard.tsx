import type { ObservableSummary } from '../../types/graph';
import { formatNumber } from '../../utils/format';
import { useUiText } from '../../i18n';
import styles from './ObservableSummaryCard.module.css';

interface ObservableSummaryCardProps {
  summary: ObservableSummary;
}

type Tone = 'ok' | 'neutral' | 'warn';

/**
 * Presentation-only classifier — maps the headline status text to a tone the
 * badge can render in. No domain logic changes; just consistent visual feedback.
 */
function statusTone(status: string): Tone {
  switch (status) {
    case 'strong':
    case 'low':
    case 'uniform':
      return 'ok';
    case 'weak':
    case 'high':
    case 'fragile':
    case 'sparse':
      return 'warn';
    default:
      return 'neutral';
  }
}

export function ObservableSummaryCard({ summary }: ObservableSummaryCardProps) {
  const t = useUiText();
  const tone = statusTone(summary.status);
  // "peak pair" is a special-case secondary formatted as degrees. The label
  // itself is localised; we match on the observable id instead of the string.
  const secondaryDisplay =
    summary.id === 'mismatch'
      ? `${summary.secondaryValue.toFixed(1)}°`
      : formatNumber(summary.secondaryValue, 3);

  return (
    <section className={styles.root} aria-live="polite">
      <header className={styles.header}>
        <div className={styles.lens}>
          <span className={styles.lensLabel}>{t.summary.lensEyebrow}</span>
          <span className={styles.lensName}>
            {summary.label} {t.summary.viewSuffix}
          </span>
        </div>
        <span
          className={`${styles.statusBadge} ${styles[`tone-${tone}`]}`}
          aria-label={t.summary.statusAria(summary.status)}
        >
          {summary.status}
        </span>
      </header>

      <div className={styles.headline}>
        <span className={styles.headlineValue}>{summary.headlineDisplay}</span>
        <div className={styles.secondary}>
          <span className={styles.secondaryLabel}>{summary.secondaryLabel}</span>
          <span className={styles.secondaryValue}>{secondaryDisplay}</span>
        </div>
      </div>

      <p className={styles.interpretation}>{summary.interpretation}</p>

      {summary.caution && (
        <p className={styles.caution} role="note">
          {summary.caution}
        </p>
      )}
    </section>
  );
}
