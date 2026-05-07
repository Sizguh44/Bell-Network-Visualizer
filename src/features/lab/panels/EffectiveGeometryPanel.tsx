import type { DemoConfig } from '../../../types/graph';
import type { ProxyKind } from '../../../types/lab';
import { getStateFamily } from '../../../data/stateFamilies';
import { useLocale, useUiText } from '../../../i18n';
import { deriveCorrelationState } from '../../graph/deriveCorrelationState';
import { formatNumber } from '../../../utils/format';
import { LabSection } from '../shared/LabSection';
import { LabDiagnosticRow } from '../shared/LabDiagnosticRow';
import { LabLimitationsList } from '../shared/LabLimitationsList';
import { LabCallout } from '../shared/LabCallout';
import { ProxyBadge } from '../shared/ProxyBadge';
import sharedStyles from '../shared/LabShared.module.css';
import styles from './EffectiveGeometryPanel.module.css';

interface EffectiveGeometryPanelProps {
  /** Active four-knob configuration, forwarded from `App.tsx` via `LabPanel`. */
  config: DemoConfig;
}

/**
 * Faz 5 panel — refactored in Faz 5.5 to consume shared Lab primitives
 * (`LabSection`, `LabDiagnosticRow`, `LabLimitationsList`, `LabCallout`)
 * via `LabShared.module.css`.
 *
 * **No content, no pipeline value, no proxy-kind label was changed.**
 * The user-visible text — intro, hierarchy framing, the three
 * comparison cards (vector / twisted / Regge), the topology-specific
 * note (dipole gets the flat-vs-spherical tetrahedron framing; cycle-4
 * gets the cyclic / dihedral framing with the explicit "no
 * spherical-tetrahedron reading here" disclaimer), the seven
 * diagnostic rows including the dipole-specific scope chip on the
 * Spherical Tetrahedron row when active topology is not the dipole —
 * is identical to the pre-refactor panel. The canonical pipeline
 * reads (`derived.antiParallelScore`, `derived.gluingScore`) are
 * unchanged. **No new toy formula** ("flatness score", "sphericity
 * score", "effective geometry score") was introduced.
 *
 * What changed: panel root, header, section labels, diagnostic-row
 * chrome, the topology-note reading card, the limitations bullet
 * list and the "how to read" callout now come from the shared module.
 * The vector / twisted / Regge comparison-grid stays panel-specific
 * (its layout is unique to this panel).
 */
export function EffectiveGeometryPanel({
  config,
}: EffectiveGeometryPanelProps) {
  const locale = useLocale();
  const t = useUiText();
  const e = t.lab.effectiveGeometry;

  // Same canonical-pipeline reads as the pre-refactor panel — no
  // formula change.
  const family = getStateFamily(config.stateFamily, locale);
  const strength = config.demoMode ? config.entanglementStrength : 0;
  const derived = deriveCorrelationState(strength, family);

  const activeTopologyNote = e.topologyNote.notes[config.graphTopology];
  const isDipole = config.graphTopology === 'dipole';

  return (
    <section
      className={sharedStyles.root}
      aria-label={t.lab.activePanelAria(t.lab.panels.effectiveGeometry.label)}
    >
      {/* --- 1. Header ----------------------------------------- */}
      <header className={sharedStyles.header}>
        <h3 className={sharedStyles.title}>
          {t.lab.panels.effectiveGeometry.label}
        </h3>
        <p className={sharedStyles.intro}>{e.intro}</p>
      </header>

      {/* --- 2. Hierarchy framing (card-style) ----------------- */}
      <LabSection label={e.hierarchy.label} className={sharedStyles.sectionCard}>
        <p className={sharedStyles.cardBody}>{e.hierarchy.body}</p>
      </LabSection>

      {/* --- 3. Vector / twisted / Regge comparison ----------- */}
      <LabSection label={e.comparison.label} ariaLabel={e.comparison.aria}>
        <div className={styles.comparisonGrid}>
          <ComparisonCard
            name={e.comparison.cards.vector.name}
            asksFor={e.comparison.cards.vector.asksFor}
            thisApp={e.comparison.cards.vector.thisApp}
            kind="pedagogical-proxy"
            asksForLabel={e.comparison.columns.asksFor}
            thisAppLabel={e.comparison.columns.thisApp}
          />
          <ComparisonCard
            name={e.comparison.cards.twisted.name}
            asksFor={e.comparison.cards.twisted.asksFor}
            thisApp={e.comparison.cards.twisted.thisApp}
            kind="future-calculable-observable"
            asksForLabel={e.comparison.columns.asksFor}
            thisAppLabel={e.comparison.columns.thisApp}
          />
          <ComparisonCard
            name={e.comparison.cards.regge.name}
            asksFor={e.comparison.cards.regge.asksFor}
            thisApp={e.comparison.cards.regge.thisApp}
            kind="future-calculable-observable"
            asksForLabel={e.comparison.columns.asksFor}
            thisAppLabel={e.comparison.columns.thisApp}
          />
        </div>
      </LabSection>

      {/* --- 4. Topology-specific note ----------------------- */}
      <LabSection
        label={e.topologyNote.label}
        ariaLabel={e.topologyNote.activeAria}
        headerRight={<ProxyBadge kind="conceptual-diagnostic" />}
      >
        <div className={sharedStyles.readingCard}>
          <h4 className={sharedStyles.readingHeadline}>
            {activeTopologyNote.headline}
          </h4>
          <p className={sharedStyles.readingBody}>{activeTopologyNote.body}</p>
          {/*
            Topology-note follow-up uses a slightly larger font-size
            than Symmetry's `.readingNote` because it carries a
            conceptual paragraph (vs Symmetry's group-theoretic label).
            That delta is preserved verbatim from the pre-Faz-5.5 panel,
            so this rule stays panel-specific.
          */}
          <p className={styles.readingNote}>{activeTopologyNote.followUp}</p>
        </div>
      </LabSection>

      {/* --- 5. Diagnostic rows ------------------------------- */}
      <LabSection label={e.diagnostics.label}>
        <div
          className={sharedStyles.diagnosticList}
          role="list"
          aria-label={e.diagnostics.rowsAria}
        >
          <LabDiagnosticRow
            title={e.diagnostics.rows.vectorGeometryProxy.title}
            body={e.diagnostics.rows.vectorGeometryProxy.body}
            proxyNote={e.diagnostics.rows.vectorGeometryProxy.proxyNote}
            kind="pedagogical-proxy"
            value={formatNumber(derived.antiParallelScore)}
          />
          <LabDiagnosticRow
            title={e.diagnostics.rows.effectiveGluingTendency.title}
            body={e.diagnostics.rows.effectiveGluingTendency.body}
            proxyNote={e.diagnostics.rows.effectiveGluingTendency.proxyNote}
            kind="pedagogical-proxy"
            value={formatNumber(derived.gluingScore)}
          />
          <LabDiagnosticRow
            title={e.diagnostics.rows.flatTetrahedron.title}
            body={e.diagnostics.rows.flatTetrahedron.body}
            proxyNote={e.diagnostics.rows.flatTetrahedron.proxyNote}
            kind="conceptual-diagnostic"
          />
          <LabDiagnosticRow
            title={e.diagnostics.rows.sphericalTetrahedron.title}
            body={e.diagnostics.rows.sphericalTetrahedron.body}
            proxyNote={e.diagnostics.rows.sphericalTetrahedron.proxyNote}
            kind="conceptual-diagnostic"
            // Same dipole-specific chip behaviour as the pre-refactor
            // panel: the row stays visible on every topology so the
            // reading is not silently dropped, but a chip flags when
            // the active topology is not the dipole.
            scopeChip={isDipole ? undefined : e.diagnostics.dipoleSpecificLabel}
          />
          <LabDiagnosticRow
            title={e.diagnostics.rows.twistedPhaseSpace.title}
            body={e.diagnostics.rows.twistedPhaseSpace.body}
            proxyNote={e.diagnostics.rows.twistedPhaseSpace.proxyNote}
            kind="future-calculable-observable"
            notComputedLabel={e.diagnostics.notComputedLabel}
          />
          <LabDiagnosticRow
            title={e.diagnostics.rows.reggeShapeMatching.title}
            body={e.diagnostics.rows.reggeShapeMatching.body}
            proxyNote={e.diagnostics.rows.reggeShapeMatching.proxyNote}
            kind="future-calculable-observable"
            notComputedLabel={e.diagnostics.notComputedLabel}
          />
          <LabDiagnosticRow
            title={e.diagnostics.rows.exactExpectations.title}
            body={e.diagnostics.rows.exactExpectations.body}
            proxyNote={e.diagnostics.rows.exactExpectations.proxyNote}
            kind="future-calculable-observable"
            notComputedLabel={e.diagnostics.notComputedLabel}
          />
        </div>
      </LabSection>

      {/* --- 6. Limitations ----------------------------------- */}
      <LabLimitationsList
        label={e.limitations.label}
        ariaLabel={e.limitations.aria}
        items={e.limitations.items}
      />

      {/* --- 7. How to read ----------------------------------- */}
      <LabCallout label={e.howToRead.label} body={e.howToRead.body} />
    </section>
  );
}

/* ------------------------------------------------------------------ */
/*  Internal — vector / twisted / Regge comparison card                */
/*                                                                     */
/*  The comparison grid is a panel-specific layout (no other Lab       */
/*  panel uses the same "asks-for / app-shows" two-line dl pattern),   */
/*  so this component stays inside the panel file rather than being    */
/*  promoted to the shared module.                                     */
/* ------------------------------------------------------------------ */

interface ComparisonCardProps {
  name: string;
  asksFor: string;
  thisApp: string;
  kind: ProxyKind;
  asksForLabel: string;
  thisAppLabel: string;
}

function ComparisonCard({
  name,
  asksFor,
  thisApp,
  kind,
  asksForLabel,
  thisAppLabel,
}: ComparisonCardProps) {
  return (
    <div className={styles.comparisonCard}>
      <div className={styles.comparisonCardHeader}>
        <h4 className={styles.comparisonCardName}>{name}</h4>
        <ProxyBadge kind={kind} />
      </div>
      <dl className={styles.comparisonCardBody}>
        <dt className={styles.comparisonCardLabel}>{asksForLabel}</dt>
        <dd className={styles.comparisonCardText}>{asksFor}</dd>
        <dt className={styles.comparisonCardLabel}>{thisAppLabel}</dt>
        <dd className={styles.comparisonCardText}>{thisApp}</dd>
      </dl>
    </div>
  );
}
