import type { DemoConfig } from '../../../types/graph';
import { getStateFamilies } from '../../../data/stateFamilies';
import { getTopology } from '../../../data/topologies';
import { useLocale, useUiText } from '../../../i18n';
import { LabSection } from '../shared/LabSection';
import { LabDiagnosticRow } from '../shared/LabDiagnosticRow';
import { LabLimitationsList } from '../shared/LabLimitationsList';
import { LabCallout } from '../shared/LabCallout';
import { LabFamilyReadingList } from '../shared/LabFamilyReadingList';
import { ProxyBadge } from '../shared/ProxyBadge';
import sharedStyles from '../shared/LabShared.module.css';
import styles from './SymmetryDiagnosticsPanel.module.css';

interface SymmetryDiagnosticsPanelProps {
  /** Active four-knob configuration, forwarded from `App.tsx` via `LabPanel`. */
  config: DemoConfig;
}

/**
 * Faz 4 panel — refactored in Faz 5.5 to consume shared Lab primitives
 * (`LabSection`, `LabDiagnosticRow`, `LabLimitationsList`, `LabCallout`)
 * via `LabShared.module.css`.
 *
 * **No content, no curated reading, no proxy-kind label was changed.**
 * The user-visible text — intro, automorphism context, the active
 * topology card with its canonical `topology.symmetryNote` line, the
 * five curated state-family classifications with the active family
 * highlight, the six diagnostic rows — and every ProxyBadge label is
 * identical to the pre-refactor panel. The structural metadata reads
 * (`getTopology`, `getStateFamilies`) are unchanged. **No automorphism
 * algorithm runs anywhere in this panel.**
 *
 * What changed: the panel root surface, header/title/intro typography,
 * section-label typography, diagnostic-row chrome, limitations bullet
 * list and "how to read" callout now come from the shared module
 * rather than being duplicated per-panel. Symmetry-specific surfaces
 * (the family classification list with active highlight, the secondary
 * `.readingNote` carrying the canonical `topology.symmetryNote`) stay
 * in this panel's CSS module because no other panel needs them.
 */
export function SymmetryDiagnosticsPanel({
  config,
}: SymmetryDiagnosticsPanelProps) {
  const locale = useLocale();
  const t = useUiText();
  const s = t.lab.symmetry;

  const topology = getTopology(config.graphTopology, locale);
  const families = getStateFamilies(locale);
  const activeTopologyReading = s.topologyReading.readings[config.graphTopology];

  return (
    <section
      className={sharedStyles.root}
      aria-label={t.lab.activePanelAria(t.lab.panels.symmetry.label)}
    >
      {/* --- 1. Header ----------------------------------------- */}
      <header className={sharedStyles.header}>
        <h3 className={sharedStyles.title}>{t.lab.panels.symmetry.label}</h3>
        <p className={sharedStyles.intro}>{s.intro}</p>
      </header>

      {/* --- 2. Graph automorphism context (card-style) -------- */}
      <LabSection label={s.context.label} className={sharedStyles.sectionCard}>
        <p className={sharedStyles.cardBody}>{s.context.body}</p>
      </LabSection>

      {/* --- 3. Active topology reading ------------------------ */}
      <LabSection
        label={s.topologyReading.label}
        ariaLabel={s.topologyReading.activeAria}
        headerRight={<ProxyBadge kind="conceptual-diagnostic" />}
      >
        <div className={sharedStyles.readingCard}>
          <h4 className={sharedStyles.readingHeadline}>
            {activeTopologyReading.headline}
          </h4>
          <p className={sharedStyles.readingBody}>
            {activeTopologyReading.body}
          </p>
          {/*
            The canonical group-theoretic statement (S₂ × S₄ for the
            dipole, D₄ for cycle-4) ships as `topology.symmetryNote` in
            `src/data/topologies.ts` — already locale-aware. We surface
            it here as a smaller secondary line; the font-size differs
            slightly from the Effective Geometry panel's `.readingNote`
            (smaller here because this is a label, larger there because
            it is a follow-up paragraph), so this rule stays
            panel-specific.
          */}
          <p className={styles.readingNote}>{topology.symmetryNote}</p>
        </div>
      </LabSection>

      {/* --- 4. State-family curated classifications ---------- */}
      <LabSection
        label={s.familyReading.label}
        ariaLabel={s.familyReading.activeAria}
        headerRight={<ProxyBadge kind="curated-classification" />}
      >
        <LabFamilyReadingList
          families={families}
          activeFamilyId={config.stateFamily}
          readings={s.familyReading.classifications}
          activeChipLabel={s.familyReading.activeChipLabel}
        />
      </LabSection>

      {/* --- 5. Diagnostic rows -------------------------------- */}
      <LabSection label={s.diagnostics.label}>
        <div
          className={sharedStyles.diagnosticList}
          role="list"
          aria-label={s.diagnostics.rowsAria}
        >
          <LabDiagnosticRow
            title={s.diagnostics.rows.topologySymmetry.title}
            body={s.diagnostics.rows.topologySymmetry.body}
            proxyNote={s.diagnostics.rows.topologySymmetry.proxyNote}
            kind="conceptual-diagnostic"
          />
          <LabDiagnosticRow
            title={s.diagnostics.rows.nodeEquivalence.title}
            body={s.diagnostics.rows.nodeEquivalence.body}
            proxyNote={s.diagnostics.rows.nodeEquivalence.proxyNote}
            kind="conceptual-diagnostic"
          />
          <LabDiagnosticRow
            title={s.diagnostics.rows.edgeOrbit.title}
            body={s.diagnostics.rows.edgeOrbit.body}
            proxyNote={s.diagnostics.rows.edgeOrbit.proxyNote}
            kind="conceptual-diagnostic"
          />
          <LabDiagnosticRow
            title={s.diagnostics.rows.familyClassification.title}
            body={s.diagnostics.rows.familyClassification.body}
            proxyNote={s.diagnostics.rows.familyClassification.proxyNote}
            kind="curated-classification"
          />
          <LabDiagnosticRow
            title={s.diagnostics.rows.fullAutomorphism.title}
            body={s.diagnostics.rows.fullAutomorphism.body}
            proxyNote={s.diagnostics.rows.fullAutomorphism.proxyNote}
            kind="future-calculable-observable"
            notComputedLabel={s.diagnostics.notComputedLabel}
          />
          <LabDiagnosticRow
            title={s.diagnostics.rows.oneNodeObservables.title}
            body={s.diagnostics.rows.oneNodeObservables.body}
            proxyNote={s.diagnostics.rows.oneNodeObservables.proxyNote}
            kind="future-calculable-observable"
            notComputedLabel={s.diagnostics.notComputedLabel}
          />
        </div>
      </LabSection>

      {/* --- 6. Limitations ----------------------------------- */}
      <LabLimitationsList
        label={s.limitations.label}
        ariaLabel={s.limitations.aria}
        items={s.limitations.items}
      />

      {/* --- 7. How to read ----------------------------------- */}
      <LabCallout label={s.howToRead.label} body={s.howToRead.body} />
    </section>
  );
}
