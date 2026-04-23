import { useUiText } from '../../i18n';
import styles from './StartHereCard.module.css';

interface StartHereCardProps {
  /** Switch to Learn mode on lesson 1 and dismiss. */
  onStartLearn: () => void;
  /** Stay in Explore mode and dismiss. */
  onExplore: () => void;
  /** Open the Concept Atlas and dismiss. */
  onOpenAtlas: () => void;
  /** Dismiss without navigating. */
  onDismiss: () => void;
}

/**
 * First-run guidance card. Rendered as the lead tile of the Explore-mode
 * footer grid until the user dismisses it. All visible copy lives in
 * `UI_STRINGS.startHere` so the card swaps language with the toggle.
 */
export function StartHereCard({
  onStartLearn,
  onExplore,
  onOpenAtlas,
  onDismiss,
}: StartHereCardProps) {
  const t = useUiText();
  const s = t.startHere;
  return (
    <section className={styles.root} aria-label={s.aria}>
      <header className={styles.header}>
        <span className={styles.eyebrow}>{s.eyebrow}</span>
        <button
          type="button"
          className={styles.dismiss}
          onClick={onDismiss}
          aria-label={s.dismissAria}
          title={s.dismissTitle}
        >
          ×
        </button>
      </header>

      <h2 className={styles.title}>{s.title}</h2>
      <p className={styles.lede}>{s.lede}</p>

      <ol className={styles.options}>
        <li className={styles.option}>
          <div className={styles.optionHead}>
            <span className={styles.optionTag}>{s.guidedTag}</span>
            <span className={styles.optionName}>{s.guidedName}</span>
          </div>
          <p className={styles.optionBody}>{s.guidedBody}</p>
          <button
            type="button"
            className={styles.primaryAction}
            onClick={onStartLearn}
          >
            {s.guidedAction}
          </button>
        </li>

        <li className={styles.option}>
          <div className={styles.optionHead}>
            <span className={styles.optionTag}>{s.freeTag}</span>
            <span className={styles.optionName}>{s.freeName}</span>
          </div>
          <p className={styles.optionBody}>{s.freeBody}</p>
          <button
            type="button"
            className={styles.secondaryAction}
            onClick={onExplore}
          >
            {s.freeAction}
          </button>
        </li>

        <li className={styles.option}>
          <div className={styles.optionHead}>
            <span className={styles.optionTag}>{s.referenceTag}</span>
            <span className={styles.optionName}>{s.referenceName}</span>
          </div>
          <p className={styles.optionBody}>{s.referenceBody}</p>
          <button
            type="button"
            className={styles.secondaryAction}
            onClick={onOpenAtlas}
          >
            {s.referenceAction}
          </button>
        </li>
      </ol>

      <p className={styles.footnote}>{s.footnote}</p>
    </section>
  );
}
