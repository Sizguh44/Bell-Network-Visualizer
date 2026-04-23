import { PAIR_COLORS } from '../../data/dipoleGraph';
import { useUiText } from '../../i18n';
import styles from './VisualizationLegend.module.css';

export function VisualizationLegend() {
  const t = useUiText();
  return (
    <div className={styles.root} role="note" aria-label={t.legend.aria}>
      <div className={styles.item}>
        <div className={styles.swatches} aria-hidden>
          {PAIR_COLORS.map((c, i) => (
            <span key={i} className={styles.swatch} style={{ background: c }} />
          ))}
        </div>
        <span className={styles.text}>
          {t.legend.colourLead}{' '}
          <strong>{t.legend.facePairEmphasis}</strong> {t.legend.colourTail}
        </span>
      </div>

      <div className={styles.item}>
        <div className={styles.strokeDemo} aria-hidden>
          <span className={`${styles.stroke} ${styles.strokeFaint}`} />
          <span className={`${styles.stroke} ${styles.strokeBold}`} />
        </div>
        <span className={styles.text}>
          {t.legend.emphasisLead}{' '}
          <strong>{t.legend.emphasisBold}</strong> {t.legend.emphasisTail}
        </span>
      </div>

      <div className={styles.item}>
        <div className={styles.highlightDemo} aria-hidden>
          <span className={styles.highlightDot} />
        </div>
        <span className={styles.text}>
          <strong>{t.legend.hoverBold}</strong> {t.legend.hoverTail}
        </span>
      </div>
    </div>
  );
}
