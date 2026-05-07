import styles from './LabShared.module.css';

interface LabCalloutProps {
  /** Section eyebrow inside the callout (e.g. "How to read this panel"). */
  label: string;
  /** Body paragraph. */
  body: string;
}

/**
 * Faz 5.5 — shared accent-tinted callout primitive.
 *
 * Used by all three real Lab panels for the "How to read this panel"
 * footer block. Rendered as an `<aside>` so screen readers can identify
 * the supplementary nature of the content. Visual identity (left
 * accent border, accent-soft background) matches the pre-refactor
 * `.howToRead` pattern from each panel exactly.
 */
export function LabCallout({ label, body }: LabCalloutProps) {
  return (
    <aside className={styles.callout}>
      <span className={styles.sectionLabel}>{label}</span>
      <p className={styles.calloutBody}>{body}</p>
    </aside>
  );
}
