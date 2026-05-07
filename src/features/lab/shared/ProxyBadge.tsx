import type { ProxyKind } from '../../../types/lab';
import { useUiText } from '../../../i18n';
import styles from './ProxyBadge.module.css';

interface ProxyBadgeProps {
  /** The honesty class this diagnostic claims. Required — there is no
   *  unlabelled state by design (see CLAUDE.md *Proxy honesty* rule). */
  kind: ProxyKind;
}

/**
 * Visible honesty-class tag for every Geometry Lab diagnostic.
 *
 * The badge **always** appears on the panel surface — never tucked into a
 * tooltip or revealed on hover only. The longer description from
 * `lab.proxyKinds[kind].title` is exposed via the native `title` attribute
 * so a curious reader can confirm what the class means, but the short
 * label and colour-coded dot must remain readable at a glance.
 *
 * Adding a new `ProxyKind` requires:
 *   1. extending the `ProxyKind` union in `src/types/lab.ts`,
 *   2. adding the matching i18n entry under `lab.proxyKinds.<id>` in both
 *      `en.ts` and `tr.ts`,
 *   3. adding a colour rule under `ProxyBadge.module.css`.
 */
export function ProxyBadge({ kind }: ProxyBadgeProps) {
  const t = useUiText();
  const meta = t.lab.proxyKinds[kind];

  // Map the kind to a concrete CSS class so we never depend on string
  // interpolation into a CSS-modules selector.
  const kindClass =
    kind === 'pedagogical-proxy'
      ? styles.pedagogicalProxy
      : kind === 'conceptual-diagnostic'
        ? styles.conceptualDiagnostic
        : kind === 'curated-classification'
          ? styles.curatedClassification
          : styles.futureCalculableObservable;

  return (
    <span
      className={`${styles.root} ${kindClass}`}
      title={meta.title}
      aria-label={`${meta.short} — ${meta.title}`}
    >
      <span className={styles.dot} aria-hidden />
      {meta.short}
    </span>
  );
}
