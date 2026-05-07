import type { ReactNode } from 'react';
import styles from './LabShared.module.css';

interface LabSectionProps {
  /** Section eyebrow rendered above the content. */
  label: string;
  children: ReactNode;
  /**
   * Extra classes composed with the baseline `.section` layout. Panels
   * pass `sharedStyles.sectionCard` here to get card chrome (background
   * + border + padding) on the section surface itself — used for
   * callout-style framing blocks like Symmetry's "graph automorphism"
   * context or Effective Geometry's "what this panel reads" hierarchy.
   */
  className?: string;
  /** Forwarded to the section root for screen readers when set. */
  ariaLabel?: string;
  /**
   * Content rendered to the right of the section label, on the same row.
   * Used to host a right-aligned `<ProxyBadge>` that scopes the entire
   * section. When set, the section header switches from the bare
   * label-on-its-own-line layout to a `space-between` row with the
   * label on the left and `headerRight` on the right.
   */
  headerRight?: ReactNode;
}

/**
 * Faz 5.5 — generic Lab section wrapper.
 *
 * Composes the `.section` flex-column layout with an optional card
 * chrome and an optional right-aligned header element. No business
 * logic; the only point is to stop three real Lab panels from each
 * repeating the same `<div><span sectionLabel/>{children}</div>`
 * boilerplate with subtle gap and chrome variations.
 */
export function LabSection({
  label,
  children,
  className,
  ariaLabel,
  headerRight,
}: LabSectionProps) {
  const classes = className ? `${styles.section} ${className}` : styles.section;
  return (
    <div className={classes} aria-label={ariaLabel}>
      {headerRight ? (
        <div className={styles.sectionHeader}>
          <span className={styles.sectionLabel}>{label}</span>
          {headerRight}
        </div>
      ) : (
        <span className={styles.sectionLabel}>{label}</span>
      )}
      {children}
    </div>
  );
}
