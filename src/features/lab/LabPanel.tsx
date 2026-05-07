import type { DemoConfig } from '../../types/graph';
import type { LabPanelId } from '../../types/lab';
import { LAB_PANEL_IDS } from '../../types/lab';
import { useUiText } from '../../i18n';
import { GluingDiagnosticsPanel } from './panels/GluingDiagnosticsPanel';
import { SymmetryDiagnosticsPanel } from './panels/SymmetryDiagnosticsPanel';
import { EffectiveGeometryPanel } from './panels/EffectiveGeometryPanel';
import { CorrelationSummaryPanel } from './panels/CorrelationSummaryPanel';
import { ResearchNotesPanel } from './panels/ResearchNotesPanel';
import { OpenProblemsPanel } from './panels/OpenProblemsPanel';
import styles from './LabPanel.module.css';

interface LabPanelProps {
  /**
   * Active four-knob configuration. Forwarded only to panels that read
   * the canonical pipeline (Faz 3: Gluing Diagnostics). Placeholder panels
   * intentionally do not take it — they have no values to read.
   */
  config: DemoConfig;
  activePanelId: LabPanelId;
  onChangePanel: (next: LabPanelId) => void;
}

/**
 * Root container for the Geometry Lab mode (Faz 2 skeleton).
 *
 * Lays out the Lab chrome — header eyebrow / title / subtitle, a visible
 * scope note describing what the mode currently does *not* do, a panel
 * switcher (segmented tab strip over `LAB_PANEL_IDS`), and the active
 * panel body. Active-panel selection is owned by `App.tsx` so the choice
 * round-trips through `localStorage` and the URL hash like every other
 * piece of mode state.
 *
 * The Lab does not render any of the four-knob `DemoConfig` here — the
 * shared `ControlPanel` and `VisualizationPanel` continue to mount in
 * the layout sidebar / main slots while the Lab footer hangs below them.
 * Faz 3+ panels can read the active config from React context if they
 * need it; nothing in this skeleton consumes it yet.
 */
export function LabPanel({
  config,
  activePanelId,
  onChangePanel,
}: LabPanelProps) {
  const t = useUiText();

  /**
   * Render the active panel. Kept as a closure so panels that consume
   * `config` can read it without prop-drilling through every placeholder.
   * Real Lab panels (Faz 3 Gluing, Faz 4 Symmetry, Faz 5 Effective
   * Geometry, Faz 6 Correlation Summary) take the config; placeholders
   * stay nullary.
   */
  function renderPanel(id: LabPanelId) {
    switch (id) {
      case 'gluing':
        return <GluingDiagnosticsPanel config={config} />;
      case 'symmetry':
        return <SymmetryDiagnosticsPanel config={config} />;
      case 'effectiveGeometry':
        return <EffectiveGeometryPanel config={config} />;
      case 'correlations':
        return <CorrelationSummaryPanel config={config} />;
      case 'researchNotes':
        return <ResearchNotesPanel />;
      case 'openProblems':
        return <OpenProblemsPanel />;
    }
  }

  return (
    <section className={styles.root} aria-label={t.lab.aria}>
      <header className={styles.header}>
        <span className={styles.eyebrow}>{t.lab.eyebrow}</span>
        <h2 className={styles.title}>{t.lab.heading}</h2>
        <p className={styles.subtitle}>{t.lab.subheading}</p>
      </header>

      <aside className={styles.scopeNote}>
        <span className={styles.scopeNoteLabel}>{t.lab.scopeNoteLabel}</span>
        <p className={styles.scopeNoteBody}>{t.lab.scopeNoteBody}</p>
      </aside>

      {/*
        Demo-off context notice (Faz 6.5). Real Lab panels (Gluing,
        Effective Geometry, Correlation) feed `strength = 0` to the
        canonical pipeline when `config.demoMode === false`, mirroring
        `VisualizationPanel`'s pre-existing behaviour. Their
        pedagogical-proxy values therefore all read zero in that mode,
        which is correct but can be confusing. This banner makes the
        cause visible. It is informational only — no ProxyBadge, no
        diagnostic claim.
      */}
      {!config.demoMode && (
        <aside className={styles.demoOffNotice}>
          <span className={styles.demoOffNoticeLabel}>
            {t.lab.demoOff.label}
          </span>
          <p className={styles.demoOffNoticeBody}>{t.lab.demoOff.body}</p>
        </aside>
      )}

      <div
        className={styles.tabs}
        role="tablist"
        aria-label={t.lab.panelSwitcherAria}
      >
        {LAB_PANEL_IDS.map((id) => {
          const active = id === activePanelId;
          return (
            <button
              key={id}
              type="button"
              role="tab"
              aria-selected={active}
              aria-controls={`lab-panel-${id}`}
              className={`${styles.tab} ${active ? styles.tabActive : ''}`}
              onClick={() => onChangePanel(id)}
            >
              {t.lab.panels[id].label}
            </button>
          );
        })}
      </div>

      <div
        className={styles.body}
        id={`lab-panel-${activePanelId}`}
        role="tabpanel"
      >
        {renderPanel(activePanelId)}
      </div>
    </section>
  );
}
