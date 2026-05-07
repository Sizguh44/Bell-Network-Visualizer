import type { ProxyKind } from '../../../types/lab';
import { ProxyBadge } from './ProxyBadge';
import styles from './LabShared.module.css';

interface LabDiagnosticRowProps {
  title: string;
  body: string;
  proxyNote: string;
  kind: ProxyKind;
  /**
   * Pre-formatted numeric value for `pedagogical-proxy` rows that read
   * a canonical pipeline output. Rendered as a monospace value pill on
   * the right of the body. If both `value` and `notComputedLabel` are
   * passed, `value` wins.
   */
  value?: string;
  /**
   * Label rendered as a "[not computed]" pill on the right of the body
   * for `future-calculable-observable` rows. Set this when the row
   * intentionally has no number to surface, so the gap stays visible
   * rather than hidden.
   */
  notComputedLabel?: string;
  /**
   * Small chip rendered next to the row title. Used to flag
   * topology-restricted applicability (e.g. "dipole-specific" on the
   * Effective Geometry panel's spherical-tetrahedron row when the
   * active topology is not the dipole).
   */
  scopeChip?: string;
}

/**
 * Faz 5.5 — shared diagnostic row primitive.
 *
 * Carries the `<ProxyBadge>` on the row surface (never tooltip-only,
 * per the *Proxy honesty* constraint), the title, an optional scope
 * chip, the body description, and an optional value-or-not-computed
 * pill. All three real Lab panels (Gluing, Symmetry, Effective
 * Geometry) consume this component instead of repeating the same JSX.
 *
 * Optional fields are sized for the union of the three panels' needs:
 *   • Gluing rows pass `value` (numeric) or `notComputedLabel`.
 *   • Symmetry rows pass nothing (text-only) or `notComputedLabel`.
 *   • Effective Geometry rows pass `value`, `notComputedLabel`, or
 *     `scopeChip` (the spherical-tetrahedron row's dipole-specific
 *     chip).
 */
export function LabDiagnosticRow({
  title,
  body,
  proxyNote,
  kind,
  value,
  notComputedLabel,
  scopeChip,
}: LabDiagnosticRowProps) {
  return (
    <div className={styles.diagnosticRow} role="listitem">
      <div className={styles.diagnosticRowHeader}>
        <div className={styles.diagnosticRowTitleGroup}>
          <h4 className={styles.diagnosticRowTitle}>{title}</h4>
          {scopeChip && (
            <span className={styles.diagnosticRowScopeChip}>{scopeChip}</span>
          )}
        </div>
        <ProxyBadge kind={kind} />
      </div>
      <div className={styles.diagnosticRowBody}>
        <p className={styles.diagnosticRowDescription}>{body}</p>
        {value !== undefined ? (
          <span className={styles.diagnosticRowValue}>{value}</span>
        ) : notComputedLabel ? (
          <span className={styles.diagnosticRowNotComputed}>
            {notComputedLabel}
          </span>
        ) : null}
      </div>
      <p className={styles.diagnosticRowProxyNote}>{proxyNote}</p>
    </div>
  );
}
