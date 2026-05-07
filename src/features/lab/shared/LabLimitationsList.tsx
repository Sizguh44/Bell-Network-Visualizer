import styles from './LabShared.module.css';

interface LabLimitationsListProps {
  /** Section eyebrow above the bullet list (e.g. "Limitations"). */
  label: string;
  /** Forwarded to the `<ul>` for screen readers. */
  ariaLabel: string;
  /**
   * Bullet items. Each renders as a single line with a warn-coloured
   * "·" pseudo-element marker. The component does not enforce a count;
   * each real Lab panel currently passes exactly five items, but Faz 6+
   * panels are free to pass any length.
   */
  items: readonly string[];
}

/**
 * Faz 5.5 — shared limitations list primitive.
 *
 * Renders the eyebrow + a vertical bullet list with the warn-coloured
 * marker. All three real Lab panels (Gluing, Symmetry, Effective
 * Geometry) consume this; the list copy and the array length are
 * unchanged from the pre-refactor panels.
 */
export function LabLimitationsList({
  label,
  ariaLabel,
  items,
}: LabLimitationsListProps) {
  return (
    <div className={styles.limitations}>
      <span className={styles.sectionLabel}>{label}</span>
      <ul className={styles.limitationsList} aria-label={ariaLabel}>
        {items.map((item, i) => (
          <li key={i} className={styles.limitationsItem}>
            {item}
          </li>
        ))}
      </ul>
    </div>
  );
}
