import type { EdgeDetail, ObservableMode } from '../../types/graph';
import { getObservable } from '../graph/observableDefinitions';
import { formatNumber } from '../../utils/format';
import { useLocale, useUiText } from '../../i18n';
import styles from './EdgeDetailCard.module.css';

interface EdgeDetailCardProps {
  detail: EdgeDetail | null;
  pinned: boolean;
  observableMode: ObservableMode;
  onClear: () => void;
}

interface MetricRowProps {
  label: string;
  value: string;
  focused?: boolean;
}

function MetricRow({ label, value, focused }: MetricRowProps) {
  return (
    <div className={`${styles.metricRow} ${focused ? styles.metricRowFocused : ''}`}>
      <span className={styles.metricLabel}>{label}</span>
      <span className={styles.metricValue}>{value}</span>
    </div>
  );
}

/**
 * Pairs each metric row with the observable lens that focuses on it. Uniformity
 * has no dedicated row; we emphasise `localAlignmentScore` and add a deviation
 * note below the grid.
 */
const FOCUS_KEY: Record<ObservableMode, 'strength' | 'mismatch' | 'alignment' | 'gluing'> = {
  alignment: 'alignment',
  mismatch: 'mismatch',
  gluing: 'gluing',
  correlation: 'strength',
  uniformity: 'alignment',
};

export function EdgeDetailCard({
  detail,
  pinned,
  observableMode,
  onClear,
}: EdgeDetailCardProps) {
  const locale = useLocale();
  const t = useUiText();
  const lens = getObservable(observableMode, locale);
  const ed = t.edgeDetail;
  const title = `${ed.titlePrefix}${lens.label}${ed.titleSuffix}`;

  if (!detail) {
    return (
      <div className={`${styles.root} ${styles.rootEmpty}`}>
        <div className={styles.header}>
          <h3 className={styles.title}>{title}</h3>
        </div>
        <div className={styles.emptyBody}>
          <div className={styles.emptyGlyph} aria-hidden>
            <span />
            <span />
            <span />
            <span />
          </div>
          <div className={styles.emptyText}>
            <p className={styles.emptyHeadline}>{ed.emptyHeadline}</p>
            <p className={styles.emptyHint}>{ed.emptyHint}</p>
          </div>
        </div>
      </div>
    );
  }

  const focus = FOCUS_KEY[observableMode];

  return (
    <div className={styles.root} aria-live="polite">
      <div className={styles.header}>
        <h3 className={styles.title}>{title}</h3>
        <div className={styles.idGroup}>
          <span
            className={styles.badge}
            style={{ color: detail.color, borderColor: detail.color }}
          >
            {detail.label}
          </span>
          <code className={styles.code}>{detail.edgeId}</code>
          {pinned && (
            <button type="button" onClick={onClear} className={styles.clear}>
              {ed.clear}
            </button>
          )}
        </div>
      </div>

      <div className={styles.familyRow}>
        <span className={styles.familyLabel}>{ed.family}</span>
        <span className={styles.familyValue}>{detail.familyLabel}</span>
        <span className={`${styles.mode} ${pinned ? styles.modePinned : styles.modeHover}`}>
          {pinned ? ed.pinned : ed.hoverMode}
        </span>
      </div>

      <blockquote
        className={styles.narrative}
        style={{ borderLeftColor: detail.color }}
      >
        {detail.narrative}
      </blockquote>

      <div className={styles.metrics}>
        <MetricRow
          label={ed.localStrength}
          value={formatNumber(detail.localStrength, 2)}
          focused={focus === 'strength'}
        />
        <MetricRow
          label={ed.mismatchAngle}
          value={`${detail.localMismatchAngle.toFixed(1)}°`}
          focused={focus === 'mismatch'}
        />
        <MetricRow
          label={ed.alignmentScore}
          value={formatNumber(detail.localAlignmentScore)}
          focused={focus === 'alignment'}
        />
        <MetricRow
          label={ed.gluingProxy}
          value={formatNumber(detail.localGluingProxy)}
          focused={focus === 'gluing'}
        />
      </div>

      {observableMode === 'uniformity' && (
        <p className={styles.deviationNote}>
          <span>{ed.deviationLabel}</span>
          <span className={styles.deviationValue}>
            {detail.deviationFromMean >= 0 ? '+' : ''}
            {formatNumber(detail.deviationFromMean, 3)}
          </span>
        </p>
      )}

      <p className={styles.note}>{ed.footnote}</p>
    </div>
  );
}
