import type { DemoConfig } from '../../../types/graph';
import { getStateFamily } from '../../../data/stateFamilies';
import { getTopology } from '../../../data/topologies';
import { deriveCorrelationState } from '../../graph/deriveCorrelationState';
import { deriveEdgeDetails } from '../../graph/deriveEdgeDetails';
import { useLocale, useUiText } from '../../../i18n';
import { formatNumber } from '../../../utils/format';
import { LabSection } from '../shared/LabSection';
import { LabDiagnosticRow } from '../shared/LabDiagnosticRow';
import { LabLimitationsList } from '../shared/LabLimitationsList';
import { LabCallout } from '../shared/LabCallout';
import { ProxyBadge } from '../shared/ProxyBadge';
import sharedStyles from '../shared/LabShared.module.css';
import styles from './GluingDiagnosticsPanel.module.css';

interface GluingDiagnosticsPanelProps {
  /** Active four-knob configuration, forwarded from `App.tsx` via `LabPanel`. */
  config: DemoConfig;
}

/**
 * Faz 3 panel — refactored in Faz 5.5 to consume shared Lab primitives
 * (`LabSection`, `LabDiagnosticRow`, `LabLimitationsList`, `LabCallout`)
 * via `LabShared.module.css`.
 *
 * **No content, no pipeline value, no proxy-kind label was changed.**
 * The user-visible text, the canonical pipeline reads
 * (`derived.antiParallelScore`, `derived.gluingScore`, the per-pair
 * `edgeDetails` values), the ProxyBadge labels and the "not computed"
 * pills are all identical to the pre-refactor panel — only the
 * surrounding chrome was extracted to shared modules.
 *
 * The pair-table layout stays panel-specific because nothing else in
 * the Lab uses tabular display, and the table heading keeps its old
 * label + badge cluster (panels can mix the shared `sectionLabel`
 * class with panel-specific layout containers — `LabSection` is one
 * available option, not the only one).
 */
export function GluingDiagnosticsPanel({ config }: GluingDiagnosticsPanelProps) {
  const locale = useLocale();
  const t = useUiText();

  // Same canonical-pipeline reads as the pre-refactor panel — no
  // formula change.
  const topology = getTopology(config.graphTopology, locale);
  const family = getStateFamily(config.stateFamily, locale);
  const strength = config.demoMode ? config.entanglementStrength : 0;
  const derived = deriveCorrelationState(strength, family);
  const edgeDetails = deriveEdgeDetails(
    topology.edges,
    strength,
    family,
    config.observableMode,
  );

  const g = t.lab.gluing;
  const rows = g.diagnostics.rows;

  return (
    <section
      className={sharedStyles.root}
      aria-label={t.lab.activePanelAria(t.lab.panels.gluing.label)}
    >
      {/* --- 1. Header ----------------------------------------- */}
      <header className={sharedStyles.header}>
        <h3 className={sharedStyles.title}>{t.lab.panels.gluing.label}</h3>
        <p className={sharedStyles.intro}>{g.intro}</p>
      </header>

      {/* --- 2. Twisted → vector → Regge hierarchy ------------ */}
      <LabSection label={g.hierarchy.label}>
        <ol className={styles.hierarchyList}>
          {(['twisted', 'vector', 'regge'] as const).map((tier) => (
            <li key={tier} className={styles.hierarchyItem}>
              <h4 className={styles.tierName}>{g.hierarchy[tier].name}</h4>
              <p className={styles.tierDef}>{g.hierarchy[tier].definition}</p>
              <p className={styles.tierApp}>{g.hierarchy[tier].inThisApp}</p>
            </li>
          ))}
        </ol>
      </LabSection>

      {/* --- 3. Diagnostic rows -------------------------------- */}
      <LabSection label={g.diagnostics.label}>
        <div
          className={sharedStyles.diagnosticList}
          role="list"
          aria-label={g.diagnostics.rowsAria}
        >
          <LabDiagnosticRow
            title={rows.antiParallel.title}
            body={rows.antiParallel.body}
            proxyNote={rows.antiParallel.proxyNote}
            kind="pedagogical-proxy"
            value={formatNumber(derived.antiParallelScore)}
          />
          <LabDiagnosticRow
            title={rows.gluingCoherence.title}
            body={rows.gluingCoherence.body}
            proxyNote={rows.gluingCoherence.proxyNote}
            kind="pedagogical-proxy"
            value={formatNumber(derived.gluingScore)}
          />
          <LabDiagnosticRow
            title={rows.faceAreaMatching.title}
            body={rows.faceAreaMatching.body}
            proxyNote={rows.faceAreaMatching.proxyNote}
            kind="future-calculable-observable"
            notComputedLabel={g.diagnostics.notComputedLabel}
          />
          <LabDiagnosticRow
            title={rows.shapeMatching.title}
            body={rows.shapeMatching.body}
            proxyNote={rows.shapeMatching.proxyNote}
            kind="future-calculable-observable"
            notComputedLabel={g.diagnostics.notComputedLabel}
          />
          <LabDiagnosticRow
            title={rows.closure.title}
            body={rows.closure.body}
            proxyNote={rows.closure.proxyNote}
            kind="future-calculable-observable"
            notComputedLabel={g.diagnostics.notComputedLabel}
          />
        </div>
      </LabSection>

      {/* --- 4. Per-pair table -------------------------------- */}
      {/*
        Pair-table chrome stays panel-specific so the pre-refactor visual
        is preserved exactly — the label + ProxyBadge cluster left of the
        caption rather than being pushed apart with `space-between`. The
        shared `sectionLabel` class is reused so typography matches the
        rest of the panel.
      */}
      <div className={styles.pairTable}>
        <div className={styles.pairTableHeader}>
          <div className={styles.pairTableHeading}>
            <span className={sharedStyles.sectionLabel}>
              {g.pairTable.label}
            </span>
            <ProxyBadge kind="pedagogical-proxy" />
          </div>
        </div>
        <p className={styles.pairTableCaption}>{g.pairTable.caption}</p>
        <div className={styles.tableWrap}>
          <table className={styles.table}>
            <thead>
              <tr>
                <th>{g.pairTable.columns.pair}</th>
                <th>{g.pairTable.columns.localStrength}</th>
                <th>{g.pairTable.columns.mismatch}</th>
                <th>{g.pairTable.columns.alignment}</th>
                <th>{g.pairTable.columns.gluing}</th>
              </tr>
            </thead>
            <tbody>
              {edgeDetails.map((d) => (
                <tr key={d.edgeId}>
                  <td>
                    <span className={styles.pairCell}>
                      <span
                        className={styles.pairSwatch}
                        style={{ color: d.color, background: d.color }}
                        aria-hidden
                      />
                      <span className={styles.pairCellLabel}>{d.label}</span>
                    </span>
                  </td>
                  {/* Number formatting mirrors EdgeDetailCard exactly so a
                      reader who hops between the two surfaces sees the
                      same values rendered identically. */}
                  <td>{formatNumber(d.localStrength, 2)}</td>
                  <td>{`${d.localMismatchAngle.toFixed(1)}°`}</td>
                  <td>{formatNumber(d.localAlignmentScore)}</td>
                  <td>{formatNumber(d.localGluingProxy)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* --- 5. Limitations ----------------------------------- */}
      <LabLimitationsList
        label={g.limitations.label}
        ariaLabel={g.limitations.aria}
        items={g.limitations.items}
      />

      {/* --- 6. How to read ----------------------------------- */}
      <LabCallout label={g.howToRead.label} body={g.howToRead.body} />
    </section>
  );
}
