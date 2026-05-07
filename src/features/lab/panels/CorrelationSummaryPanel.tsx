import { Fragment, type CSSProperties } from 'react';
import type { DemoConfig } from '../../../types/graph';
import { getStateFamilies, getStateFamily } from '../../../data/stateFamilies';
import { getTopology } from '../../../data/topologies';
import { deriveCorrelationState } from '../../graph/deriveCorrelationState';
import { deriveEdgeDetails } from '../../graph/deriveEdgeDetails';
import {
  buildMinimalQubitGraphState,
  computePairwiseMutualInformationMatrix,
  computeSingleQubitEntropies,
  maybeComputePreviewMutualInformation,
  type Complex,
  type ComplexMatrix,
  type MinimalQubitGraphStateKind,
} from '../../quantum-engine';
import { selectMinimalQubitPreview } from '../quantumEnginePreview';
import {
  computeIntertwinerSandboxResult,
  formatSpinTuple,
  getIntertwinerSandboxExamples,
} from '../intertwinerSandboxPreview';
import {
  computeBellNetworkSandboxResult,
  getBellNetworkSandboxExamples,
  type BellNetworkSandboxDeferredReason,
  type BellNetworkSandboxStateRegister,
} from '../bellNetworkSandboxPreview';
import { useLocale, useUiText } from '../../../i18n';
import { formatNumber } from '../../../utils/format';
import { LabSection } from '../shared/LabSection';
import { LabDiagnosticRow } from '../shared/LabDiagnosticRow';
import { LabLimitationsList } from '../shared/LabLimitationsList';
import { LabCallout } from '../shared/LabCallout';
import { LabFamilyReadingList } from '../shared/LabFamilyReadingList';
import { ProxyBadge } from '../shared/ProxyBadge';
import sharedStyles from '../shared/LabShared.module.css';
import styles from './CorrelationSummaryPanel.module.css';

interface CorrelationSummaryPanelProps {
  /** Active four-knob configuration, forwarded from `App.tsx` via `LabPanel`. */
  config: DemoConfig;
}

/**
 * Faz 6 — fourth real Geometry Lab panel.
 *
 * **Honesty discipline.** This panel introduces no new physics formula
 * and **does not compute pair-pair correlation matrices, two-point
 * functions, reduced density matrices, or local entanglement
 * entropies**. Every numeric value rendered here is read verbatim
 * from the canonical pipeline (`deriveCorrelationState`,
 * `deriveEdgeDetails`) shared with the canvas, the Faz 3 Gluing panel
 * and the Faz 5 Effective Geometry panel — same numbers, framed
 * through a "correlations in quantum geometry" lens. The
 * `mutualInformationProxy` value surfaced in the global summary is a
 * deterministic toy formula `(strengthMean × alignMean)^1.5` and is
 * *not* the quantum mutual information of any density matrix; the
 * row's proxy note states this verbatim.
 *
 * Structure (top to bottom):
 *
 *   1. Header — title + short academic intro.
 *   2. Hierarchy framing — three honesty levels (pair-level toy
 *      values, graph-level proxies, exact intertwiner-space
 *      correlators) with explicit honesty-class assignment per level.
 *   3. Pair-level profile — four cards (one per face pair), each with
 *      three pedagogical-proxy toy values. Section badge: pedagogical-proxy.
 *   4. Global proxy summary — three stat cards (anti-parallel score,
 *      gluing score, mutual-information proxy). Section badge:
 *      pedagogical-proxy.
 *   5. State-family curated correlation readings — five entries (one
 *      per shippable family), active family highlighted. Section
 *      badge: curated-classification.
 *   6. Diagnostics — six labelled rows: two pedagogical-proxy
 *      (pair-level profile, global tendency); one curated-classification
 *      (family reading); one conceptual-diagnostic (symmetry vs
 *      correlation distinction); two future-calculable-observable
 *      (exact intertwiner correlators, reduced density matrix /
 *      entanglement entropy).
 *   7. Limitations — five-bullet list of explicit gaps.
 *   8. How to read — proxy-class guidance for the reader.
 */
export function CorrelationSummaryPanel({
  config,
}: CorrelationSummaryPanelProps) {
  const locale = useLocale();
  const t = useUiText();
  const c = t.lab.correlations;

  // Read the canonical pipeline. No new formula — these are the same
  // calls VisualizationPanel + the Gluing / Effective Geometry panels
  // make. Numbers in this panel cannot drift from the canvas.
  const topology = getTopology(config.graphTopology, locale);
  const family = getStateFamily(config.stateFamily, locale);
  const families = getStateFamilies(locale);
  const strength = config.demoMode ? config.entanglementStrength : 0;
  const derived = deriveCorrelationState(strength, family);
  const edgeDetails = deriveEdgeDetails(
    topology.edges,
    strength,
    family,
    config.observableMode,
  );

  // Faz 9B — minimal qubit engine preview computation.
  //
  // Pure functions, no side effects. Pick a minimal qubit state via
  // the deterministic adapter, build it through the engine, and
  // compute per-qubit reduced density matrices + von Neumann
  // entropies. Every value rendered in the engine-preview section
  // below comes from this triplet of calls.
  //
  // **Honesty discipline**. The engine produces *exact* finite-
  // dimensional quantum-information observables — but only inside
  // the minimal qubit model. The mapping from app config to qubit
  // state is curated, not LQG-derived. The rendered section makes
  // this distinction visible (header chip, intro paragraph,
  // exact-vs-proxy callout).
  const enginePreview = c.enginePreview;
  const selection = selectMinimalQubitPreview(
    config.graphTopology,
    config.stateFamily,
  );
  const engineState = buildMinimalQubitGraphState(
    selection.stateKind,
    selection.numQubits,
  );
  const engineEntropies = computeSingleQubitEntropies(
    engineState.ket,
    engineState.numQubits,
  );
  const stateKindLabel = stateKindI18nLabel(
    selection.stateKind,
    enginePreview.stateKinds,
  );
  const mappingReason = enginePreview.mappingReasons[selection.mappingKind];
  // Reduced ρ for qubit 0 — the engine guarantees this is 2×2 for
  // every Phase 9A state (single-qubit subsystem of a multi-qubit
  // state).
  const firstQubitRho: ComplexMatrix =
    engineEntropies[0]?.reducedDensityMatrix ?? [];

  // Faz 9B.5 — exact qubit mutual information.
  //
  // Exact only within the minimal qubit model. Computed for two-qubit
  // states (dipole preview); explicitly returns `unsupported` for the
  // 4-qubit cycle-4 preview because pair MI on a 4-qubit state needs
  // a general 4×4 subsystem-entropy eigensolver — deferred to a
  // future phase. The proxy value (`derived.mutualInformationProxy`)
  // is read verbatim from the existing canvas pipeline, unchanged.
  const miResult = maybeComputePreviewMutualInformation(engineState);
  const mi = enginePreview.mutualInformation;

  // Faz 9C-2 — node entropy heatmap + exact pairwise MI heatmap.
  //
  // Entropy heatmap: each per-qubit entropy card gets a horizontal
  // fill bar. Width = entropyBits / 1 (max single-qubit entropy is
  // exactly 1 bit). The bar is a *visual* normalisation — not a new
  // physics score.
  //
  // MI heatmap: an n × n matrix of I(Qᵢ : Qⱼ) values built via the
  // Phase 9C-2 engine helper. Diagonal cells render as an em-dash
  // (a qubit's MI with itself is undefined). Off-diagonal cells carry
  // an `--intensity` CSS custom property in [0, 1] computed from
  // `bits / maxComputedBits` for the heatmap tint. Unsupported cells
  // (future SU(2)-only) render as "n/a".
  //
  // **Honesty**. Both heatmaps surface values *exact within the
  // minimal qubit model* — they are NOT LQG mutual information, NOT
  // intertwiner-space correlators. The body strings under
  // `enginePreview.heatmaps` repeat the boundary verbatim.
  const heatmaps = enginePreview.heatmaps;
  const pairwiseMatrix = computePairwiseMutualInformationMatrix(
    engineState.ket,
    engineState.numQubits,
  );

  // Faz 9E-1 — single-node SU(2) intertwiner sandbox.
  //
  // Static list of small spin tuples; for each one, run the
  // Phase 9D-2-b `invariantSubspaceProjector` engine helper through
  // the `lab/intertwinerSandboxPreview.ts` adapter, which adds the
  // three projector sanity checks (P† = P, P² = P, Tr(P) = dim). The
  // engine selftest at 60/60 already guarantees these pass; the
  // runtime checks act as a tripwire and let the reader visually
  // confirm the property without trusting the selftest.
  //
  // **Honesty**. This is a single-node SU(2)-invariant subspace, NOT
  // a Bell-network state, NOT an edge-gluing construction, and NOT a
  // geometric-operator (area / volume / dihedral) eigenspace. The
  // header chip "single-node SU(2) model" plus the intro paragraph
  // pin the boundary; UI copy elsewhere must not call any example a
  // "Bell-network state".
  const intertwinerSandbox = c.intertwinerSandbox;
  const intertwinerResults = getIntertwinerSandboxExamples().map(
    computeIntertwinerSandboxResult,
  );

  // Mega Faz 9E-3 — Bell-network graph sandbox.
  //
  // Surfaces the Phase 9E-2 graph contract + per-node intertwiner
  // summaries for the three canonical spin-1/2 graphs (two-node
  // single-edge, dipole, cycle-4). Only the two-node single-edge
  // graph carries an explicit graph-level prototype state; dipole
  // and cycle-4 cards expose per-node summaries with a "deferred"
  // status pill.
  //
  // **Honesty**. Per-node summaries are NOT graph-level Bell-network
  // states. The dipole and cycle-4 cards must NOT be described as
  // "completed Bell-network states" — they are graph contracts with
  // per-node intertwiner-space metadata. Edge `source` / `target`
  // are bookkeeping only; the UI surfaces this via the "parallel
  // edges yes/no" fact (computed on unordered endpoint pairs in the
  // adapter).
  const bellNetworkSandbox = c.bellNetworkSandbox;
  const bellNetworkResults = getBellNetworkSandboxExamples().map(
    computeBellNetworkSandboxResult,
  );

  return (
    <section
      className={sharedStyles.root}
      aria-label={t.lab.activePanelAria(t.lab.panels.correlations.label)}
    >
      {/* --- 1. Header ----------------------------------------- */}
      <header className={sharedStyles.header}>
        <h3 className={sharedStyles.title}>
          {t.lab.panels.correlations.label}
        </h3>
        <p className={sharedStyles.intro}>{c.intro}</p>
      </header>

      {/* --- 2. Hierarchy framing (card-style) ---------------- */}
      <LabSection label={c.hierarchy.label} className={sharedStyles.sectionCard}>
        <p className={sharedStyles.cardBody}>{c.hierarchy.body}</p>
      </LabSection>

      {/* --- 3. Pair-level profile (4 cards) ------------------ */}
      <LabSection
        label={c.pairProfile.label}
        ariaLabel={c.pairProfile.aria}
        headerRight={<ProxyBadge kind="pedagogical-proxy" />}
      >
        <p className={styles.profileCaption}>{c.pairProfile.caption}</p>
        <div className={styles.pairGrid}>
          {edgeDetails.map((d) => (
            <div key={d.edgeId} className={styles.pairCard}>
              <div className={styles.pairCardHeader}>
                <span
                  className={styles.pairCardSwatch}
                  style={{ color: d.color, background: d.color }}
                  aria-hidden
                />
                <span className={styles.pairCardLabel}>{d.label}</span>
              </div>
              {/* `<dl>` for term/value pairs — same convention as
                  Effective Geometry's ComparisonCard. Three metrics per
                  pair, mismatch deliberately omitted (alignment already
                  encodes it via cos²) so this surface stays focused on
                  the per-pair correlation read. */}
              <dl className={styles.pairCardMetrics}>
                <dt className={styles.pairCardMetricLabel}>
                  {c.pairProfile.metrics.localStrength}
                </dt>
                <dd className={styles.pairCardMetricValue}>
                  {formatNumber(d.localStrength, 2)}
                </dd>
                <dt className={styles.pairCardMetricLabel}>
                  {c.pairProfile.metrics.alignment}
                </dt>
                <dd className={styles.pairCardMetricValue}>
                  {formatNumber(d.localAlignmentScore)}
                </dd>
                <dt className={styles.pairCardMetricLabel}>
                  {c.pairProfile.metrics.gluing}
                </dt>
                <dd className={styles.pairCardMetricValue}>
                  {formatNumber(d.localGluingProxy)}
                </dd>
              </dl>
            </div>
          ))}
        </div>
      </LabSection>

      {/* --- 4. Global proxy summary (3 stat cards) ----------- */}
      <LabSection
        label={c.globalSummary.label}
        ariaLabel={c.globalSummary.aria}
        headerRight={<ProxyBadge kind="pedagogical-proxy" />}
      >
        <p className={styles.profileCaption}>{c.globalSummary.caption}</p>
        <div className={styles.globalGrid}>
          <div className={styles.globalCard}>
            <span className={styles.globalCardLabel}>
              {c.globalSummary.metrics.antiParallel}
            </span>
            <span className={styles.globalCardValue}>
              {formatNumber(derived.antiParallelScore)}
            </span>
          </div>
          <div className={styles.globalCard}>
            <span className={styles.globalCardLabel}>
              {c.globalSummary.metrics.gluing}
            </span>
            <span className={styles.globalCardValue}>
              {formatNumber(derived.gluingScore)}
            </span>
          </div>
          <div className={styles.globalCard}>
            <span className={styles.globalCardLabel}>
              {c.globalSummary.metrics.mutualInformation}
            </span>
            <span className={styles.globalCardValue}>
              {formatNumber(derived.mutualInformationProxy)}
            </span>
          </div>
        </div>
      </LabSection>

      {/* --- 4.5. Faz 9B Minimal Qubit Engine Preview --------- */}
      {/*
        First UI surface for the Phase 9A engine. Sits between the
        Global Summary and the State-Family Reading because that is
        where the proxy → exact bridge naturally lands: above this
        block the panel showed pedagogical proxies, below it returns
        to curated readings, and inside this block we display *exact*
        finite-dimensional quantum-information calculations on a
        minimal qubit model selected from the active config.

        No `<ProxyBadge>` is used here. The engine outputs are exact
        within their model, not proxies of an LQG observable; none of
        the four ProxyKinds applies. The header chip
        ("minimal qubit model") plus the intro paragraph plus the
        exact-vs-proxy callout at the bottom of the section pin the
        model boundary instead.
      */}
      <LabSection
        label={enginePreview.label}
        ariaLabel={enginePreview.label}
        headerRight={
          <span className={styles.modelChip}>{enginePreview.modelLabel}</span>
        }
      >
        <p className={styles.engineIntro}>{enginePreview.intro}</p>

        {/* Mapping card — topology / family / selected state / qubits / reason */}
        <div className={styles.engineMappingCard}>
          <dl className={styles.engineMappingGrid}>
            <dt className={styles.engineMappingLabel}>
              {enginePreview.topologyLabel}
            </dt>
            <dd className={styles.engineMappingValue}>{topology.label}</dd>

            <dt className={styles.engineMappingLabel}>
              {enginePreview.familyLabel}
            </dt>
            <dd className={styles.engineMappingValue}>{family.label}</dd>

            <dt className={styles.engineMappingLabel}>
              {enginePreview.selectedStateLabel}
            </dt>
            <dd className={styles.engineMappingValue}>{stateKindLabel}</dd>

            <dt className={styles.engineMappingLabel}>
              {enginePreview.qubitsLabel}
            </dt>
            <dd className={styles.engineMappingValue}>
              {selection.numQubits}
            </dd>
          </dl>
          <p className={styles.engineMappingReason}>
            <span className={styles.engineMappingReasonLabel}>
              {enginePreview.mappingReasonLabel}
            </span>
            {mappingReason}
          </p>
        </div>

        {/*
          Per-qubit entropy grid — Faz 9C-2 expanded into a node entropy
          heatmap. Each card keeps its existing label / value / secondary
          (so the numeric reading is unchanged) and gains a horizontal
          fill bar at the bottom. Bar width = `entropyBits / 1` because
          one bit is the maximum single-qubit entropy. The bar is a
          visual normalisation only — not a new physics score.
        */}
        <div className={styles.entropySectionHead}>
          <span className={styles.entropySectionLabel}>
            {heatmaps.entropyHeatmapLabel}
          </span>
        </div>
        <p className={styles.entropyHeatmapBody}>
          {heatmaps.entropyHeatmapBody}
        </p>
        <div className={styles.entropyGrid}>
          {engineEntropies.map((e) => {
            const intensity = clamp01(e.entropyBits);
            return (
              <div key={e.qubit} className={styles.entropyCard}>
                <span className={styles.entropyCardLabel}>
                  {enginePreview.qubitLabel(e.qubit)}
                </span>
                <span className={styles.entropyCardPrimary}>
                  <span className={styles.entropyCardValue}>
                    {formatNumber(e.entropyBits, 3)}
                  </span>
                  <span className={styles.entropyCardUnit}>
                    {enginePreview.entropyBitsLabel}
                  </span>
                </span>
                <span className={styles.entropyCardSecondary}>
                  {formatNumber(e.entropyNat, 3)}{' '}
                  {enginePreview.entropyNatsLabel}
                </span>
                <div
                  className={styles.entropyBarRow}
                  role="img"
                  aria-label={heatmaps.entropyFillLabel}
                >
                  <div className={styles.entropyBarTrack}>
                    <div
                      className={styles.entropyBarFill}
                      style={
                        {
                          ['--intensity' as string]: String(intensity),
                        } as CSSProperties
                      }
                    />
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/*
          Faz 9C-2 — exact pairwise qubit mutual-information heatmap.
          n × n grid (n = engineState.numQubits, currently ≤ 4) with
          axis labels Q0..Q(n-1). Diagonal cells render an em-dash;
          off-diagonal cells render `bits` with an accent-tinted
          background whose intensity is `bits / maxComputedBits`.
          Unsupported cells (future SU(2)-only) render as "n/a".
        */}
        <div className={styles.miHeatmap}>
          <div className={styles.entropySectionHead}>
            <span className={styles.entropySectionLabel}>
              {heatmaps.pairwiseMiLabel}
            </span>
          </div>
          <p className={styles.miHeatmapBody}>{heatmaps.pairwiseMiBody}</p>
          <div className={styles.miHeatmapScroll}>
            <div
              className={styles.miHeatmapGrid}
              role="table"
              aria-label={heatmaps.exactQubitMiLabel}
              style={
                {
                  gridTemplateColumns: `auto repeat(${engineState.numQubits}, minmax(3.6rem, 1fr))`,
                } as CSSProperties
              }
            >
              {/* Header row: corner + Q0..Q(n-1) column labels */}
              <div className={styles.miHeatmapCorner} aria-hidden />
              {Array.from({ length: engineState.numQubits }, (_, j) => (
                <div
                  key={`col-${j}`}
                  role="columnheader"
                  className={styles.miHeatmapHeader}
                >
                  {enginePreview.qubitLabel(j)}
                </div>
              ))}

              {/* Body rows: row label + n cells */}
              {pairwiseMatrix.cells.map((row, i) => (
                <Fragment key={`row-${i}`}>
                  <div role="rowheader" className={styles.miHeatmapRowLabel}>
                    {enginePreview.qubitLabel(i)}
                  </div>
                  {row.map((cell, j) => {
                    const cellKey = `cell-${i}-${j}`;
                    if (cell.status === 'diagonal') {
                      return (
                        <div
                          key={cellKey}
                          role="cell"
                          className={styles.miHeatmapDiagonal}
                          aria-label={heatmaps.diagonalLabel}
                        >
                          {heatmaps.diagonalLabel}
                        </div>
                      );
                    }
                    if (cell.status === 'unsupported') {
                      return (
                        <div
                          key={cellKey}
                          role="cell"
                          className={styles.miHeatmapUnsupported}
                          aria-label={heatmaps.unsupportedCellLabel}
                        >
                          {heatmaps.unsupportedCellLabel}
                        </div>
                      );
                    }
                    // computed
                    const intensity =
                      pairwiseMatrix.maxComputedBits > 0
                        ? clamp01(
                            cell.mutualInformationBits /
                              pairwiseMatrix.maxComputedBits,
                          )
                        : 0;
                    return (
                      <div
                        key={cellKey}
                        role="cell"
                        className={styles.miHeatmapCell}
                        style={
                          {
                            ['--intensity' as string]: String(intensity),
                          } as CSSProperties
                        }
                      >
                        <span className={styles.miHeatmapValue}>
                          {formatNumber(cell.mutualInformationBits, 3)}
                        </span>
                      </div>
                    );
                  })}
                </Fragment>
              ))}
            </div>
          </div>
        </div>

        {/* Reduced density matrix for qubit 0 (2×2). */}
        <div className={styles.matrixSection}>
          <span className={styles.matrixHead}>
            {enginePreview.reducedDensityMatrixLabel} ·{' '}
            {enginePreview.firstQubitLabel}
          </span>
          <div className={styles.matrixGrid}>
            {firstQubitRho.flatMap((row, i) =>
              row.map((cell, j) => (
                <span
                  key={`${i}-${j}`}
                  className={styles.matrixCell}
                >
                  {formatComplex(cell)}
                </span>
              )),
            )}
          </div>
        </div>

        {/*
          Faz 9B.5 — exact qubit mutual information comparison.

          Sits between the reduced-density-matrix grid and the closing
          exact-vs-proxy callout. Two render branches:

            • computed (numQubits === 2, dipole preview):
                — formula explanation paragraph
                — 2-card grid: exact MI in bits/nats with S(AB)
                  breakdown ; existing proxy MI value (unitless)
                — qualitative-comparison disclaimer

            • unsupported (numQubits ≥ 3, cycle-4 preview):
                — dashed unsupported notice explaining the deferral
                — proxy MI value still surfaced inline for reference
                — qualitative-comparison disclaimer

          The proxy value is read verbatim from `derived.mutualInformationProxy`
          — the existing pedagogical formula `(strengthMean × alignMean)^1.5`
          is NOT modified by Faz 9B.5. The two registers (exact within
          minimal qubit model · proxy of the LQG register) sit side by
          side here so the user sees both — but the qualitative-comparison
          disclaimer pins that they have different units and are not a
          numeric error bar against each other.
        */}
        <div className={styles.mutualInfoComparison}>
          <div className={styles.entropySectionHead}>
            <span className={styles.entropySectionLabel}>{mi.label}</span>
          </div>

          {miResult.status === 'computed' ? (
            <>
              <p className={styles.mutualInfoComputedBody}>{mi.computedBody}</p>
              <div className={styles.mutualInfoGrid}>
                {/* Exact MI card */}
                <div className={styles.mutualInfoCard}>
                  <span className={styles.entropyCardLabel}>{mi.exactLabel}</span>
                  <span className={styles.entropyCardPrimary}>
                    <span className={styles.entropyCardValue}>
                      {formatNumber(miResult.mutualInformationBits, 3)}
                    </span>
                    <span className={styles.entropyCardUnit}>{mi.bitsLabel}</span>
                  </span>
                  <span className={styles.entropyCardSecondary}>
                    {formatNumber(miResult.mutualInformationNat, 3)} {mi.natsLabel}
                  </span>
                  <span className={styles.mutualInfoBreakdown}>
                    {mi.entropyABLabel} ={' '}
                    {formatNumber(miResult.entropyABNat, 3)} {mi.natsLabel}
                  </span>
                </div>
                {/* Existing proxy card — value verbatim, unchanged formula */}
                <div className={styles.mutualInfoCard}>
                  <span className={styles.entropyCardLabel}>{mi.proxyLabel}</span>
                  <span className={styles.entropyCardPrimary}>
                    <span className={styles.entropyCardValue}>
                      {formatNumber(derived.mutualInformationProxy)}
                    </span>
                    <span className={styles.entropyCardUnit}>
                      ({mi.unitlessLabel})
                    </span>
                  </span>
                </div>
              </div>
            </>
          ) : (
            <div className={styles.unsupportedNotice}>
              <span className={styles.unsupportedLabel}>
                {mi.unsupportedLabel}
              </span>
              <p className={styles.unsupportedBody}>{mi.unsupportedBody}</p>
              <p className={styles.unsupportedProxyLine}>
                <span className={styles.unsupportedProxyLabel}>
                  {mi.proxyLabel}
                </span>
                {formatNumber(derived.mutualInformationProxy)} (
                {mi.unitlessLabel})
              </p>
            </div>
          )}

          <p className={styles.qualitativeComparison}>
            <span className={styles.qualitativeComparisonLabel}>
              {mi.qualitativeComparisonLabel}
            </span>
            {mi.qualitativeComparisonBody}
          </p>
        </div>

        {/* Exact-vs-proxy callout */}
        <aside className={styles.exactVsProxyCallout}>
          <span className={styles.exactVsProxyLabel}>
            {enginePreview.exactVsProxyLabel}
          </span>
          <p className={styles.exactVsProxyBody}>
            {enginePreview.exactVsProxyBody}
          </p>
        </aside>
      </LabSection>

      {/* --- 4.6. Faz 9E-1 Single-Node SU(2) Intertwiner Sandbox --- */}
      {/*
        Sits as a sibling section after the Engine Preview. Surfaces
        the Phase 9D-2-b `invariantSubspaceProjector` engine output
        for a fixed list of small spin tuples plus three projector
        sanity chips per card. No `<ProxyBadge>` — engine outputs are
        exact within their model rather than proxies; the four
        ProxyKinds don't fit. The header chip "single-node SU(2) model"
        plus the intro paragraph keep the model boundary visible.

        **Honesty**. This is a single-node SU(2)-invariant subspace.
        It is NOT a Bell-network state, NOT a multi-node graph state,
        NOT an edge-gluing construction, and NOT a geometric-operator
        eigenspace. UI copy here must NOT call any example a
        "Bell-network state".
      */}
      <LabSection
        label={intertwinerSandbox.label}
        ariaLabel={intertwinerSandbox.label}
        headerRight={
          <span className={styles.su2ModelChip}>
            {intertwinerSandbox.modelChip}
          </span>
        }
      >
        <div className={styles.intertwinerSandbox}>
          <p className={styles.intertwinerIntro}>{intertwinerSandbox.intro}</p>
          <div className={styles.intertwinerGrid}>
            {intertwinerResults.map((r) => {
              const ex = r.example;
              const exCopy = intertwinerSandbox.examples[ex.id];
              const spectrumValues = r.spectrumPreview
                .map((v) => formatNumber(v, 3))
                .join(', ');
              const spectrumDisplay = r.spectrumPreviewTruncated
                ? `[${spectrumValues}, ${intertwinerSandbox.spectrumPreviewEllipsis}]`
                : `[${spectrumValues}]`;
              const keptIndicesDisplay =
                r.keptEigenvalueIndices.length === 0
                  ? intertwinerSandbox.keptIndicesEmpty
                  : r.keptEigenvalueIndices.join(', ');
              return (
                <article key={ex.id} className={styles.intertwinerCard}>
                  <header className={styles.intertwinerCardHeader}>
                    <span className={styles.intertwinerCardTitle}>
                      {exCopy.title}
                    </span>
                    <span className={styles.spinTuple}>
                      {intertwinerSandbox.spinTupleLabel}: {formatSpinTuple(ex.spins)}
                    </span>
                  </header>

                  <dl className={styles.invariantStats}>
                    <dt className={styles.invariantStatLabel}>
                      {intertwinerSandbox.totalDimensionLabel}
                    </dt>
                    <dd className={styles.invariantStatValue}>
                      {r.totalDimension}
                    </dd>

                    <dt className={styles.invariantStatLabel}>
                      {intertwinerSandbox.invariantDimensionLabel}
                    </dt>
                    <dd className={styles.invariantStatValue}>
                      {r.invariantDimension}
                    </dd>

                    <dt className={styles.invariantStatLabel}>
                      {intertwinerSandbox.expectedDimensionLabel}
                    </dt>
                    <dd className={styles.invariantStatValue}>
                      {ex.expectedInvariantDimension}
                    </dd>
                  </dl>

                  <div className={styles.spectrumPreviewBlock}>
                    <span className={styles.spectrumPreviewLabel}>
                      {intertwinerSandbox.keptIndicesLabel}
                    </span>
                    <span className={styles.keptIndicesValue}>
                      {keptIndicesDisplay}
                    </span>
                  </div>

                  <div className={styles.spectrumPreviewBlock}>
                    <span className={styles.spectrumPreviewLabel}>
                      {intertwinerSandbox.spectrumPreviewLabel}
                    </span>
                    <span className={styles.spectrumPreviewValue}>
                      {spectrumDisplay}
                    </span>
                  </div>

                  <div className={styles.sanityBlock}>
                    <span className={styles.sanityLabel}>
                      {intertwinerSandbox.sanityLabel}
                    </span>
                    <div className={styles.sanityChips}>
                      <SanityChip
                        label={intertwinerSandbox.hermitianProjectorLabel}
                        passLabel={intertwinerSandbox.passLabel}
                        failLabel={intertwinerSandbox.failLabel}
                        passed={r.hermitianProjector}
                      />
                      <SanityChip
                        label={intertwinerSandbox.idempotentProjectorLabel}
                        passLabel={intertwinerSandbox.passLabel}
                        failLabel={intertwinerSandbox.failLabel}
                        passed={r.idempotentProjector}
                      />
                      <SanityChip
                        label={intertwinerSandbox.traceMatchesLabel}
                        passLabel={intertwinerSandbox.passLabel}
                        failLabel={intertwinerSandbox.failLabel}
                        passed={r.traceMatchesDimension}
                      />
                    </div>
                  </div>

                  <p className={styles.intertwinerInterpretation}>
                    {exCopy.interpretation}
                  </p>
                </article>
              );
            })}
          </div>
        </div>
      </LabSection>

      {/* --- 4.7. Mega Faz 9E-3 Bell-Network Graph Sandbox -------- */}
      {/*
        Sits between the Phase 9E-1 single-node intertwiner sandbox
        and the State-family curated reading. Surfaces the Phase 9E-2
        graph contract + per-node intertwiner summaries for the three
        canonical spin-1/2 graphs. Only the two-node single-edge
        graph card shows an explicit prototype state ("available");
        dipole and cycle-4 cards expose per-node summaries with a
        "deferred" status pill.

        **Honesty**. Header chip "graph contract · not full state",
        intro paragraph, and the deferred-state pill collectively pin
        the boundary: per-node summaries are NOT graph-level
        Bell-network states. No `<ProxyBadge>` — engine outputs are
        exact within their model rather than proxies; the four
        ProxyKinds don't fit (same convention as the Phase 9E-1
        intertwiner sandbox above).
      */}
      <LabSection
        label={bellNetworkSandbox.label}
        ariaLabel={bellNetworkSandbox.label}
        headerRight={
          <span className={styles.bellGraphChip}>
            {bellNetworkSandbox.modelChip}
          </span>
        }
      >
        <div className={styles.bellNetworkSandbox}>
          <p className={styles.bellNetworkIntro}>{bellNetworkSandbox.intro}</p>
          <div className={styles.bellGraphGrid}>
            {bellNetworkResults.map((r) => {
              const exCopy = bellNetworkSandbox.examples[r.id];
              const edgeSpinsDisplay = formatSpinTuple(r.edgeSpins);
              const parallelEdgesText = r.hasParallelEdges
                ? bellNetworkSandbox.yesLabel
                : bellNetworkSandbox.noLabel;
              return (
                <article key={r.id} className={styles.bellGraphCard}>
                  <header className={styles.bellGraphHeader}>
                    <span className={styles.bellGraphTitle}>{exCopy.title}</span>
                  </header>
                  <p className={styles.bellGraphInterpretation}>
                    {exCopy.interpretation}
                  </p>

                  {/* Graph facts: nodes / edges / edge spins / parallel */}
                  <div className={styles.graphFactsBlock}>
                    <span className={styles.graphFactsLabel}>
                      {bellNetworkSandbox.graphFactsLabel}
                    </span>
                    <dl className={styles.graphFacts}>
                      <dt className={styles.graphFactLabel}>
                        {bellNetworkSandbox.nodesLabel}
                      </dt>
                      <dd className={styles.graphFactValue}>{r.nodeCount}</dd>

                      <dt className={styles.graphFactLabel}>
                        {bellNetworkSandbox.edgesLabel}
                      </dt>
                      <dd className={styles.graphFactValue}>{r.edgeCount}</dd>

                      <dt className={styles.graphFactLabel}>
                        {bellNetworkSandbox.edgeSpinsLabel}
                      </dt>
                      <dd className={styles.graphFactValue}>
                        {edgeSpinsDisplay}
                      </dd>

                      <dt className={styles.graphFactLabel}>
                        {bellNetworkSandbox.parallelEdgesLabel}
                      </dt>
                      <dd className={styles.graphFactValue}>
                        {parallelEdgesText}
                      </dd>
                    </dl>
                  </div>

                  {/* Prototype state: available (with details) or deferred. */}
                  <div className={styles.prototypeBox}>
                    <div className={styles.prototypeBoxHead}>
                      <span className={styles.prototypeLabel}>
                        {bellNetworkSandbox.prototypeStateLabel}
                      </span>
                      {r.prototypeState.status === 'available' ? (
                        <span
                          className={`${styles.prototypePill} ${styles.prototypePillAvailable}`}
                        >
                          {bellNetworkSandbox.prototypeAvailableLabel}
                        </span>
                      ) : (
                        <span
                          className={`${styles.prototypePill} ${styles.prototypePillDeferred}`}
                        >
                          {bellNetworkSandbox.prototypeDeferredLabel}
                        </span>
                      )}
                    </div>
                    {r.prototypeState.status === 'available' ? (
                      <dl className={styles.prototypeDetails}>
                        <dt className={styles.prototypeDetailLabel}>
                          {bellNetworkSandbox.stateRegisterLabel}
                        </dt>
                        <dd className={styles.prototypeDetailValue}>
                          {stateRegisterText(
                            r.prototypeState.stateRegister,
                            bellNetworkSandbox.stateRegisters,
                          )}
                        </dd>

                        <dt className={styles.prototypeDetailLabel}>
                          {bellNetworkSandbox.prototypeKindLabel}
                        </dt>
                        <dd className={styles.prototypeDetailValue}>
                          {r.prototypeState.kind}
                        </dd>

                        <dt className={styles.prototypeDetailLabel}>
                          {bellNetworkSandbox.prototypeDimensionLabel}
                        </dt>
                        <dd className={styles.prototypeDetailValue}>
                          {r.prototypeState.dimension}
                        </dd>

                        {r.prototypeState.endpointDimension !== undefined ? (
                          <>
                            <dt className={styles.prototypeDetailLabel}>
                              {bellNetworkSandbox.endpointDimensionLabel}
                            </dt>
                            <dd className={styles.prototypeDetailValue}>
                              {r.prototypeState.endpointDimension}
                            </dd>
                          </>
                        ) : null}

                        {r.prototypeState.invariantDimension !== undefined ? (
                          <>
                            <dt className={styles.prototypeDetailLabel}>
                              {bellNetworkSandbox.graphInvariantDimensionLabel}
                            </dt>
                            <dd className={styles.prototypeDetailValue}>
                              {r.prototypeState.invariantDimension}
                            </dd>
                          </>
                        ) : null}

                        {r.prototypeState.perNodeInvariantDimensions !==
                        undefined ? (
                          <>
                            <dt className={styles.prototypeDetailLabel}>
                              {
                                bellNetworkSandbox.perNodeInvariantDimensionsLabel
                              }
                            </dt>
                            <dd className={styles.prototypeDetailValue}>
                              [
                              {r.prototypeState.perNodeInvariantDimensions.join(
                                ', ',
                              )}
                              ]
                            </dd>
                          </>
                        ) : null}

                        <dt className={styles.prototypeDetailLabel}>
                          {bellNetworkSandbox.prototypeNormalisedLabel}
                        </dt>
                        <dd className={styles.prototypeDetailValue}>
                          {r.prototypeState.normalised
                            ? bellNetworkSandbox.yesLabel
                            : bellNetworkSandbox.noLabel}
                        </dd>

                        {r.prototypeState
                          .normBeforeProjectionNormalisation !== undefined ? (
                          <>
                            <dt className={styles.prototypeDetailLabel}>
                              {bellNetworkSandbox.normBeforeProjectionLabel}
                            </dt>
                            <dd className={styles.prototypeDetailValue}>
                              {formatNumber(
                                r.prototypeState
                                  .normBeforeProjectionNormalisation,
                                3,
                              )}
                            </dd>
                          </>
                        ) : null}

                        <dt className={styles.prototypeDetailLabel}>
                          {bellNetworkSandbox.prototypeHonestyLabel}
                        </dt>
                        <dd className={styles.prototypeDetailValue}>
                          {r.prototypeState.honesty}
                        </dd>
                      </dl>
                    ) : (
                      <p className={styles.prototypeDeferredReason}>
                        {deferredReasonText(
                          r.prototypeState.reason,
                          bellNetworkSandbox.deferredReasons,
                        )}
                      </p>
                    )}
                  </div>

                  {/* Per-node intertwiner summaries (no projector / basis). */}
                  <div className={styles.nodeSummaryBlock}>
                    <span className={styles.nodeSummaryLabel}>
                      {bellNetworkSandbox.nodeSummariesLabel}
                    </span>
                    <ul className={styles.nodeSummaryList}>
                      {r.nodeSummaries.map((ns) => (
                        <li key={ns.nodeId} className={styles.nodeSummaryCard}>
                          <header className={styles.nodeSummaryHeader}>
                            <span className={styles.nodeSummaryNodeId}>
                              {bellNetworkSandbox.nodeLabel} {ns.nodeId}
                            </span>
                            <span className={styles.nodeSummaryIncidentEdges}>
                              {bellNetworkSandbox.incidentEdgesLabel}: [
                              {ns.incidentEdgeIds.join(', ')}]
                            </span>
                          </header>
                          <dl className={styles.nodeSummaryStats}>
                            <dt className={styles.nodeSummaryStatLabel}>
                              {bellNetworkSandbox.spinTupleLabel}
                            </dt>
                            <dd className={styles.nodeSummaryStatValue}>
                              {formatSpinTuple(ns.spins)}
                            </dd>

                            <dt className={styles.nodeSummaryStatLabel}>
                              {bellNetworkSandbox.totalDimensionLabel}
                            </dt>
                            <dd className={styles.nodeSummaryStatValue}>
                              {ns.totalDimension}
                            </dd>

                            <dt className={styles.nodeSummaryStatLabel}>
                              {bellNetworkSandbox.invariantDimensionLabel}
                            </dt>
                            <dd className={styles.nodeSummaryStatValue}>
                              {ns.invariantDimension}
                            </dd>
                          </dl>
                        </li>
                      ))}
                    </ul>
                  </div>
                </article>
              );
            })}
          </div>
        </div>
      </LabSection>

      {/* --- 5. State-family curated correlation readings ----- */}
      <LabSection
        label={c.familyReading.label}
        ariaLabel={c.familyReading.activeAria}
        headerRight={<ProxyBadge kind="curated-classification" />}
      >
        <LabFamilyReadingList
          families={families}
          activeFamilyId={config.stateFamily}
          readings={c.familyReading.classifications}
          activeChipLabel={c.familyReading.activeChipLabel}
        />
      </LabSection>

      {/* --- 6. Diagnostic rows ------------------------------- */}
      <LabSection label={c.diagnostics.label}>
        <div
          className={sharedStyles.diagnosticList}
          role="list"
          aria-label={c.diagnostics.rowsAria}
        >
          <LabDiagnosticRow
            title={c.diagnostics.rows.pairProfile.title}
            body={c.diagnostics.rows.pairProfile.body}
            proxyNote={c.diagnostics.rows.pairProfile.proxyNote}
            kind="pedagogical-proxy"
          />
          <LabDiagnosticRow
            title={c.diagnostics.rows.globalTendency.title}
            body={c.diagnostics.rows.globalTendency.body}
            proxyNote={c.diagnostics.rows.globalTendency.proxyNote}
            kind="pedagogical-proxy"
          />
          <LabDiagnosticRow
            title={c.diagnostics.rows.familyReading.title}
            body={c.diagnostics.rows.familyReading.body}
            proxyNote={c.diagnostics.rows.familyReading.proxyNote}
            kind="curated-classification"
          />
          <LabDiagnosticRow
            title={c.diagnostics.rows.symmetryVsCorrelation.title}
            body={c.diagnostics.rows.symmetryVsCorrelation.body}
            proxyNote={c.diagnostics.rows.symmetryVsCorrelation.proxyNote}
            kind="conceptual-diagnostic"
          />
          <LabDiagnosticRow
            title={c.diagnostics.rows.exactCorrelators.title}
            body={c.diagnostics.rows.exactCorrelators.body}
            proxyNote={c.diagnostics.rows.exactCorrelators.proxyNote}
            kind="future-calculable-observable"
            notComputedLabel={c.diagnostics.notComputedLabel}
          />
          <LabDiagnosticRow
            title={c.diagnostics.rows.reducedDensityMatrix.title}
            body={c.diagnostics.rows.reducedDensityMatrix.body}
            proxyNote={c.diagnostics.rows.reducedDensityMatrix.proxyNote}
            kind="future-calculable-observable"
            notComputedLabel={c.diagnostics.notComputedLabel}
          />
        </div>
      </LabSection>

      {/* --- 7. Limitations ----------------------------------- */}
      <LabLimitationsList
        label={c.limitations.label}
        ariaLabel={c.limitations.aria}
        items={c.limitations.items}
      />

      {/* --- 8. How to read ----------------------------------- */}
      <LabCallout label={c.howToRead.label} body={c.howToRead.body} />
    </section>
  );
}

/* ------------------------------------------------------------------ */
/*  Faz 9B — local UI helpers for the Engine Preview section          */
/* ------------------------------------------------------------------ */

/**
 * Map the engine's `MinimalQubitGraphStateKind` (which uses kebab-case
 * for `'bell-pair'`) onto the i18n `stateKinds` object's camelCase
 * keys (`bellPair`). Pure formatting glue; no physics.
 */
function stateKindI18nLabel(
  kind: MinimalQubitGraphStateKind,
  labels: { product: string; bellPair: string; ghz: string },
): string {
  switch (kind) {
    case 'product':
      return labels.product;
    case 'bell-pair':
      return labels.bellPair;
    case 'ghz':
      return labels.ghz;
  }
}

/**
 * Format a complex number for the reduced-density-matrix grid. When
 * the imaginary part is below the engine's standard floating-point
 * tolerance, render only the real part (which is the case for every
 * Phase 9A test state — Bell, GHZ, product all have real-valued
 * single-qubit reduced ρ). Otherwise render `a + bi` with three
 * decimals on each component.
 *
 * Tolerance matches the engine's internal `eps` used in
 * `approxEqualComplex` (1e-10).
 */
function formatComplex(c: Complex): string {
  const eps = 1e-10;
  if (Math.abs(c.im) < eps) return formatNumber(c.re, 3);
  const sign = c.im >= 0 ? '+' : '−';
  const reStr = formatNumber(c.re, 3);
  const imStr = formatNumber(Math.abs(c.im), 3);
  return `${reStr} ${sign} ${imStr}i`;
}

/**
 * Phase 9C-2 — clamp a number to `[0, 1]`. Used by the heatmap cells
 * to bound the `--intensity` CSS custom property even if upstream
 * floating-point drift produces a tiny `< 0` or `> 1` value. Pure
 * formatting glue; no physics.
 */
function clamp01(x: number): number {
  if (!Number.isFinite(x)) return 0;
  if (x < 0) return 0;
  if (x > 1) return 1;
  return x;
}

/**
 * Mega Phase 9E-3 — pick the deferred-reason string for the
 * Bell-network sandbox's deferred prototype-state card. The mapping
 * is total over the closed `BellNetworkSandboxDeferredReason` union
 * so a missing case is a TypeScript error.
 */
function deferredReasonText(
  reason: BellNetworkSandboxDeferredReason,
  copy: {
    requiresEdgeSlotBookkeeping: string;
    phaseScope: string;
  },
): string {
  switch (reason) {
    case 'requires-edge-slot-bookkeeping':
      return copy.requiresEdgeSlotBookkeeping;
    case 'phase-scope':
      return copy.phaseScope;
  }
}

/**
 * Mega Phase 9E-4 — pick the state-register string for the
 * Bell-network sandbox's available prototype-state card. Total over
 * the closed `BellNetworkSandboxStateRegister` union.
 */
function stateRegisterText(
  register: BellNetworkSandboxStateRegister,
  copy: {
    minimalTwoNodePrototype: string;
    spinHalfProjectedBellNetworkState: string;
  },
): string {
  switch (register) {
    case 'minimal-two-node-prototype':
      return copy.minimalTwoNodePrototype;
    case 'spin-half-projected-bell-network-state':
      return copy.spinHalfProjectedBellNetworkState;
  }
}

/**
 * Phase 9E-1 — sanity chip for the Intertwiner Sandbox cards. Renders
 * a small inline pill carrying the property label (e.g. `P† = P`) and
 * a pass/fail tag tinted with the engine's `--ok` / `--warn` colour
 * variables. Pure presentation; no engine call.
 */
function SanityChip({
  label,
  passLabel,
  failLabel,
  passed,
}: {
  label: string;
  passLabel: string;
  failLabel: string;
  passed: boolean;
}) {
  return (
    <span
      className={
        passed
          ? `${styles.sanityChip} ${styles.sanityChipPass}`
          : `${styles.sanityChip} ${styles.sanityChipFail}`
      }
    >
      <span>{label}</span>
      <span className={styles.sanityChipState}>
        {passed ? passLabel : failLabel}
      </span>
    </span>
  );
}
