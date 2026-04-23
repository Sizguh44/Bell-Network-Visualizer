import { useUiText } from '../../i18n';
import styles from './LevelComparisonCard.module.css';

/**
 * Three-column comparison card — pair-level / graph-level / cosmology-level
 * — to help users not conflate what the demo actually shows with what a full
 * cosmological argument would need. All copy comes from
 * `UI_STRINGS.levelComparison`.
 */
export function LevelComparisonCard() {
  const t = useUiText().levelComparison;
  const columns = [
    {
      level: t.pairLevel,
      scope: t.pairScope,
      bullets: t.pairBullets,
    },
    {
      level: t.graphLevel,
      scope: t.graphScope,
      bullets: t.graphBullets,
    },
    {
      level: t.cosmologyLevel,
      scope: t.cosmologyScope,
      bullets: t.cosmologyBullets,
    },
  ];

  return (
    <figure className={styles.root} aria-label={t.aria}>
      <figcaption className={styles.heading}>{t.heading}</figcaption>
      <div className={styles.grid}>
        {columns.map((c) => (
          <div key={c.level} className={styles.column}>
            <div className={styles.columnHeader}>
              <span className={styles.level}>{c.level}</span>
              <span className={styles.scope}>{c.scope}</span>
            </div>
            <ul className={styles.list}>
              {c.bullets.map((b) => (
                <li key={b}>{b}</li>
              ))}
            </ul>
          </div>
        ))}
      </div>
      <p className={styles.caption}>{t.caption}</p>
    </figure>
  );
}
