/**
 * Phase 9E-1 — Single-node SU(2) Intertwiner Sandbox adapter.
 *
 * Pure TypeScript. No React, no DOM, no i18n. Surfaces the Phase 9D-2-b
 * `invariantSubspaceProjector` engine helper to the Correlation Summary
 * panel as a static sandbox over a fixed list of small spin tuples.
 *
 * **Honesty discipline (Phase 9E-1).**
 *
 *   • This adapter computes a **single-node** SU(2)-invariant subspace
 *     for each example. It is NOT a Bell-network state, NOT a multi-node
 *     graph state, NOT an edge-gluing construction, and NOT a
 *     geometric-operator (area / volume / dihedral-angle) expectation
 *     value. The example labels and the surrounding UI strings repeat
 *     this distinction; UI copy must NOT call any example a
 *     "Bell-network state" or describe its dimension as "geometry" /
 *     "volume" / "curvature".
 *
 *   • The adapter is presentation-only over the engine's already-tested
 *     output. It runs no new physics formula. The four example tuples
 *     are deliberately fixed so the user cannot accidentally request a
 *     huge tensor product (the current engine eigensolver targets
 *     n ≤ 16; the largest example here is `[½, ½, ½, ½]` at
 *     totalDim = 16).
 *
 *   • Sanity flags (`hermitianProjector`, `idempotentProjector`,
 *     `traceMatchesDimension`) are *checked* here so the UI can render
 *     a green / red chip per check. The engine's selftest (60/60 in
 *     Phase 9D-2-b) already guarantees these flags pass for the four
 *     example tuples; the UI checks add a runtime tripwire and let the
 *     reader visually confirm the property without trusting the
 *     selftest.
 *
 * Upgrade path: when Phase 9E-2 introduces a multi-node Bell-network
 * graph type, this adapter stays as the "single-node" surface; a
 * separate multi-node adapter will sit alongside it in `lab/`.
 */

import {
  approxEqualMatrix,
  dagger,
  invariantSubspaceProjector,
  matMul,
  trace,
  type InvariantSubspaceProjector,
} from '../quantum-engine';

/**
 * Closed enum of intertwiner-sandbox examples. Drives both the
 * adapter's `getIntertwinerSandboxExamples()` list and the i18n key
 * lookup (`lab.correlations.intertwinerSandbox.examples.<id>`).
 */
export type IntertwinerSandboxExampleId =
  | 'twoSpinHalf'
  | 'fourSpinHalf'
  | 'twoSpinOne'
  | 'spinOneTwoSpinHalf';

/** Static metadata for one sandbox example. */
export interface IntertwinerSandboxExample {
  id: IntertwinerSandboxExampleId;
  /** Spin labels passed to `invariantSubspaceProjector`. */
  spins: number[];
  /**
   * Textbook `mult(j_total = 0)` from the Wigner decomposition. Used
   * for the UI's "expected dimension" column and as a regression check
   * (`traceMatchesDimension` cross-checks against the engine output).
   */
  expectedInvariantDimension: number;
}

/** Result of computing a sandbox example. Numeric / boolean only —
 *  no React, no i18n strings. */
export interface IntertwinerSandboxResult {
  example: IntertwinerSandboxExample;
  totalDimension: number;
  invariantDimension: number;
  keptEigenvalueIndices: number[];
  /** Eigenvalues of `totalSpinSquared` at the kept indices. */
  keptEigenvalues: number[];
  /** First N eigenvalues for a compact spectrum preview. */
  spectrumPreview: number[];
  /** True if the spectrum had more entries than `spectrumPreview` shows. */
  spectrumPreviewTruncated: boolean;
  /** Sanity: `P† ≈ P`. */
  hermitianProjector: boolean;
  /** Sanity: `P · P ≈ P`. */
  idempotentProjector: boolean;
  /** Sanity: `Tr(P).re ≈ invariantDimension` and `Tr(P).im ≈ 0`. */
  traceMatchesDimension: boolean;
}

/** How many leading eigenvalues to surface in the UI. */
const SPECTRUM_PREVIEW_LIMIT = 6;

/** Sanity-check tolerance for projector Hermiticity / idempotence
 *  (matches Phase 9D-2-b selftest tolerance). */
const SANITY_EPS = 1e-9;

/** Static example list. Pure data — no engine call. */
const EXAMPLES: readonly IntertwinerSandboxExample[] = [
  // ½ ⊗ ½ = 0 ⊕ 1 ⇒ mult(j=0) = 1.
  { id: 'twoSpinHalf', spins: [0.5, 0.5], expectedInvariantDimension: 1 },
  // Textbook 4-valent spin-½ intertwiner space, dim = 2.
  {
    id: 'fourSpinHalf',
    spins: [0.5, 0.5, 0.5, 0.5],
    expectedInvariantDimension: 2,
  },
  // 1 ⊗ 1 = 0 ⊕ 1 ⊕ 2 ⇒ mult(j=0) = 1.
  { id: 'twoSpinOne', spins: [1, 1], expectedInvariantDimension: 1 },
  // 1 ⊗ ½ ⊗ ½ = 0 ⊕ 1 ⊕ 1 ⊕ 2 ⇒ mult(j=0) = 1.
  {
    id: 'spinOneTwoSpinHalf',
    spins: [1, 0.5, 0.5],
    expectedInvariantDimension: 1,
  },
];

/** Public list of sandbox examples, in the canonical UI display order. */
export function getIntertwinerSandboxExamples(): readonly IntertwinerSandboxExample[] {
  return EXAMPLES;
}

/* ------------------------------------------------------------------ */
/*  Result computation                                                 */
/* ------------------------------------------------------------------ */

/**
 * Run the engine for one example and bundle the renderable result.
 *
 * Calls `invariantSubspaceProjector(example.spins)` (Phase 9D-2-b),
 * extracts the kept eigenvalues, computes the spectrum preview, and
 * runs the three projector sanity checks. No new physics formula —
 * every numeric value comes verbatim from the engine.
 */
export function computeIntertwinerSandboxResult(
  example: IntertwinerSandboxExample,
): IntertwinerSandboxResult {
  const projector: InvariantSubspaceProjector = invariantSubspaceProjector(
    example.spins,
  );

  const keptEigenvalues = projector.keptEigenvalueIndices.map(
    (idx) => projector.eigenvalues[idx]!,
  );

  const spectrumPreview = projector.eigenvalues.slice(0, SPECTRUM_PREVIEW_LIMIT);
  const spectrumPreviewTruncated =
    projector.eigenvalues.length > SPECTRUM_PREVIEW_LIMIT;

  // Hermitian: P† = P element-wise.
  const hermitianProjector = approxEqualMatrix(
    dagger(projector.projector),
    projector.projector,
    SANITY_EPS,
  );

  // Idempotent: P² = P.
  const idempotentProjector = approxEqualMatrix(
    matMul(projector.projector, projector.projector),
    projector.projector,
    SANITY_EPS,
  );

  // Trace: Tr(P).re ≈ invariantDimension, Tr(P).im ≈ 0.
  const tr = trace(projector.projector);
  const traceMatchesDimension =
    Math.abs(tr.im) < SANITY_EPS &&
    Math.abs(tr.re - projector.invariantDimension) < SANITY_EPS;

  return {
    example,
    totalDimension: projector.totalDimension,
    invariantDimension: projector.invariantDimension,
    keptEigenvalueIndices: projector.keptEigenvalueIndices,
    keptEigenvalues,
    spectrumPreview,
    spectrumPreviewTruncated,
    hermitianProjector,
    idempotentProjector,
    traceMatchesDimension,
  };
}

/* ------------------------------------------------------------------ */
/*  Display formatting helpers                                         */
/* ------------------------------------------------------------------ */

/**
 * Format a non-negative half-integer spin label as the string `j` or
 * `2k/2`. Returns `0`, `1/2`, `1`, `3/2`, `2`, …
 *
 * Negative / non-half-integer / non-finite inputs return their
 * stringified default — this helper is presentational only and the
 * adapter trusts that engine input has already been validated by
 * `validateSpinJ` upstream.
 */
export function formatSpinLabel(j: number): string {
  if (!Number.isFinite(j) || j < 0) return String(j);
  // 2j is integer (validated by validateSpinJ at build time).
  const twoJ = Math.round(2 * j);
  if (twoJ % 2 === 0) return String(twoJ / 2);
  return `${twoJ}/2`;
}

/** Format `[0.5, 0.5, 1]` as `[1/2, 1/2, 1]`. */
export function formatSpinTuple(spins: readonly number[]): string {
  return `[${spins.map(formatSpinLabel).join(', ')}]`;
}
