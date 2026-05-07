import type { LabPanelId } from '../../../types/lab';
import { LAB_PANEL_PROXY_KIND } from '../../../types/lab';
import { useUiText } from '../../../i18n';
import { ProxyBadge } from './ProxyBadge';
import styles from './PlaceholderPanel.module.css';

interface PlaceholderPanelProps {
  panelId: LabPanelId;
}

/**
 * Generic skeleton panel used by every Faz 2 Lab placeholder. Reads its
 * label + short goal + placeholder body from i18n via `panelId`, and
 * renders a ProxyBadge of the panel's intended honesty class from the
 * static `LAB_PANEL_PROXY_KIND` registry — the badge already lives on the
 * panel surface so the proxy-honesty discipline is satisfied even before
 * any real diagnostic ships.
 *
 * Faz 3+ panels can either keep using this component (passing `panelId`
 * and adding their own diagnostic content as `children`) or replace it
 * entirely once they have non-placeholder UI.
 */
export function PlaceholderPanel({ panelId }: PlaceholderPanelProps) {
  const t = useUiText();
  const panel = t.lab.panels[panelId];
  const proxyKind = LAB_PANEL_PROXY_KIND[panelId];

  return (
    <section
      className={styles.root}
      aria-label={t.lab.activePanelAria(panel.label)}
    >
      <header className={styles.header}>
        <div className={styles.titleRow}>
          <h3 className={styles.title}>{panel.label}</h3>
          <ProxyBadge kind={proxyKind} />
        </div>
        <p className={styles.shortGoal}>{panel.shortGoal}</p>
      </header>

      <div className={styles.body}>
        <p className={styles.placeholder}>{panel.placeholder}</p>
        <p className={styles.proxyHint}>{t.lab.sampleProxyHint}</p>
      </div>

      <div className={styles.footerRow}>
        <span className={styles.footerLabel}>{t.lab.sampleProxyLabel}</span>
        <span className={styles.placeholderTag}>
          {t.lab.placeholderLabel} · {t.lab.laterPhaseLabel}
        </span>
      </div>
    </section>
  );
}
