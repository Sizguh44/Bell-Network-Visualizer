/**
 * Mega Phase 9E-3 — Bell-network graph sandbox UI adapter.
 *
 * Pure TypeScript. No React, no DOM, no i18n. Surfaces the Phase 9E-2
 * Bell-network graph contract + per-node intertwiner summaries to
 * the Correlation Summary panel as a static sandbox over the three
 * canonical spin-1/2 graphs:
 *
 *   • two-node single-edge spin-1/2 graph — the ONLY graph for which
 *     Phase 9E-2 builds an explicit graph-level state.
 *   • dipole spin-1/2 graph — per-node summaries available; the
 *     graph-level state is **deferred** (requires edge-slot
 *     bookkeeping, Phase 9E-4).
 *   • cycle-4 spin-1/2 graph — same: per-node summaries available;
 *     state deferred.
 *
 * **Honesty discipline (Mega Phase 9E-3).**
 *
 *   • This adapter is **presentation-only over the engine's
 *     already-tested 9E-2 output**. It runs no new physics formula
 *     and constructs no new state. Engine selftest stays at 76/76.
 *
 *   • The dipole and cycle-4 cards expose **per-node intertwiner
 *     summaries** (Phase 9E-2's `summarizeBellNetworkGraph` output),
 *     NOT graph-level Bell-network states. The
 *     `BellNetworkSandboxPrototypeState` discriminated union makes
 *     this distinction load-bearing: only the two-node graph gets
 *     `status: 'available'`, the rest get `status: 'deferred'` with
 *     a typed reason that the UI can localise.
 *
 *   • The full ket vector of the two-node prototype state is NOT
 *     surfaced through this adapter. The UI only sees `dimension`,
 *     `normalised`, the `kind` literal, and the honesty marker — in
 *     line with the Phase 9E-1 sandbox's "no matrix display" policy.
 *
 *   • The adapter NEVER calls `buildMinimalSpinHalfBellNetworkState`
 *     for dipole or cycle-4 graphs (which would throw the engine's
 *     "Phase 9E-2 supports only the two-node single spin-1/2 edge
 *     prototype" error). Instead, the deferred status is returned
 *     deterministically from the example metadata so the UI can
 *     render the deferred branch without engine exceptions on the
 *     render path.
 */

import {
  buildMinimalSpinHalfBellNetworkState,
  buildSpinHalfProjectedBellNetworkState,
  createCycle4SpinHalfGraph,
  createDipoleSpinHalfGraph,
  createTwoNodeSingleEdgeSpinHalfGraph,
  summarizeBellNetworkGraph,
  type BellNetworkGraph,
} from '../quantum-engine';

/**
 * Closed enum of sandbox examples. Drives both the static example
 * list and the i18n key lookup
 * (`lab.correlations.bellNetworkSandbox.examples.<id>`).
 */
export type BellNetworkSandboxExampleId =
  | 'twoNodeSingleEdge'
  | 'dipoleSpinHalf'
  | 'cycle4SpinHalf';

/** Closed enum of graph kinds for the UI's "graph kind" chip. */
export type BellNetworkSandboxGraphKind =
  | 'two-node-single-edge-spin-half'
  | 'dipole-spin-half'
  | 'cycle4-spin-half';

/** Deferred-state reason — typed so the UI's i18n lookup is total.
 *  After Mega Phase 9E-4 the `'requires-edge-slot-bookkeeping'`
 *  variant is no longer emitted by the canonical examples (dipole /
 *  cycle-4 are now `'available'` through the projected builder), but
 *  the variant stays in the union so a future example that hits the
 *  same reason can continue to use it. `'phase-scope'` is the
 *  current catch-all for shapes outside the supported set. */
export type BellNetworkSandboxDeferredReason =
  | 'requires-edge-slot-bookkeeping'
  | 'phase-scope';

/**
 * Closed enum identifying which graph-level state register the
 * `'available'` branch is using. Mega Phase 9E-4 introduces the
 * second register; the first stays for the two-node single-edge
 * graph (which has no per-node invariant subspace and therefore
 * cannot use the projected register).
 */
export type BellNetworkSandboxStateRegister =
  | 'minimal-two-node-prototype'
  | 'spin-half-projected-bell-network-state';

/** Static metadata for one sandbox example. */
export interface BellNetworkSandboxExample {
  id: BellNetworkSandboxExampleId;
  graphKind: BellNetworkSandboxGraphKind;
}

/** Per-node summary surfaced by the sandbox UI. Shape mirrors
 *  Phase 9E-2's `BellNetworkNodeIntertwinerSummary` minus the
 *  `keptEigenvalueIndices` field (the UI doesn't render it; the
 *  invariantDimension is the relevant signal). */
export interface BellNetworkSandboxNodeSummary {
  nodeId: string;
  incidentEdgeIds: string[];
  spins: number[];
  totalDimension: number;
  invariantDimension: number;
}

/**
 * Discriminated union for the per-graph prototype state.
 *
 * Mega Phase 9E-4 broadens the `'available'` branch to optionally
 * carry the projected-state register fields (`endpointDimension`,
 * `invariantDimension`, `perNodeInvariantDimensions`,
 * `normBeforeProjectionNormalisation`). The minimal two-node
 * prototype omits these (they would all be redundant or undefined
 * for that path); dipole and cycle-4 carry them all.
 */
export type BellNetworkSandboxPrototypeState =
  | {
      status: 'available';
      stateRegister: BellNetworkSandboxStateRegister;
      kind: string;
      /**
       * For the minimal-two-node prototype: the composite ket
       * dimension `4`. For the projected register: same as
       * `endpointDimension`. The UI surfaces this as the
       * "Dimension" detail row.
       */
      dimension: number;
      normalised: boolean;
      honesty: string;
      /** Projected register only — `2^(Σ_node valence)`. */
      endpointDimension?: number;
      /** Projected register only — `Π_node mult(j_total = 0)`. */
      invariantDimension?: number;
      /** Projected register only — per-node invariant dims, in
       *  `graph.nodes` order. */
      perNodeInvariantDimensions?: number[];
      /** Projected register only — L2 norm of the unprojected
       *  link-singlet product before final normalisation. Stored
       *  for diagnostics (the UI surfaces it as a small footnote
       *  number). */
      normBeforeProjectionNormalisation?: number;
    }
  | {
      status: 'deferred';
      reason: BellNetworkSandboxDeferredReason;
    };

/** Bundled result of computing one sandbox example. Numeric / boolean
 *  / string only — no React, no i18n strings. */
export interface BellNetworkSandboxResult {
  id: BellNetworkSandboxExampleId;
  graphKind: BellNetworkSandboxGraphKind;
  nodeCount: number;
  edgeCount: number;
  edgeSpins: number[];
  hasParallelEdges: boolean;
  nodeSummaries: BellNetworkSandboxNodeSummary[];
  prototypeState: BellNetworkSandboxPrototypeState;
}

/** Static example list, in canonical UI display order. Pure data —
 *  no engine call. */
const EXAMPLES: readonly BellNetworkSandboxExample[] = [
  { id: 'twoNodeSingleEdge', graphKind: 'two-node-single-edge-spin-half' },
  { id: 'dipoleSpinHalf', graphKind: 'dipole-spin-half' },
  { id: 'cycle4SpinHalf', graphKind: 'cycle4-spin-half' },
];

/** Public list of sandbox examples in canonical UI display order. */
export function getBellNetworkSandboxExamples(): readonly BellNetworkSandboxExample[] {
  return EXAMPLES;
}

/* ------------------------------------------------------------------ */
/*  Internal helpers                                                   */
/* ------------------------------------------------------------------ */

/** Construct the canonical graph for one example id. The mapping is
 *  closed by the `BellNetworkSandboxExampleId` enum so a missing
 *  case is a TypeScript error. */
function graphForExample(id: BellNetworkSandboxExampleId): BellNetworkGraph {
  switch (id) {
    case 'twoNodeSingleEdge':
      return createTwoNodeSingleEdgeSpinHalfGraph();
    case 'dipoleSpinHalf':
      return createDipoleSpinHalfGraph();
    case 'cycle4SpinHalf':
      return createCycle4SpinHalfGraph();
  }
}

/**
 * Detect whether a graph has at least two edges sharing the same
 * **unordered** endpoint pair. Edge `source` / `target` are
 * bookkeeping-only (per the Phase 9E-2 honesty constraint), so the
 * key is built from the sorted endpoint pair. Returns `true` for
 * the dipole graph (4 edges all between `n0` and `n1`) and `false`
 * for the two-node single-edge and cycle-4 graphs.
 */
function detectParallelEdges(graph: BellNetworkGraph): boolean {
  const seen = new Map<string, number>();
  for (const edge of graph.edges) {
    const a = edge.source;
    const b = edge.target;
    const key = a < b ? `${a}::${b}` : `${b}::${a}`;
    const count = (seen.get(key) ?? 0) + 1;
    seen.set(key, count);
    if (count >= 2) return true;
  }
  return false;
}

/* ------------------------------------------------------------------ */
/*  Result computation                                                 */
/* ------------------------------------------------------------------ */

/**
 * Run the engine for one example and bundle the renderable result.
 *
 * - Constructs the canonical graph (Phase 9E-2 constructors).
 * - Calls `summarizeBellNetworkGraph` (Phase 9E-2) to derive the
 *   per-node spin tuples and intertwiner dimensions.
 * - For the two-node single-edge graph only: calls
 *   `buildMinimalSpinHalfBellNetworkState` to populate
 *   `prototypeState: 'available'` with `dimension`, `normalised`,
 *   `kind`, `honesty`. The full ket vector is intentionally NOT
 *   surfaced through this adapter (matrix-display restraint, same
 *   policy as the Phase 9E-1 intertwiner sandbox).
 * - For dipole and cycle-4: returns `prototypeState: 'deferred'`
 *   with reason `'requires-edge-slot-bookkeeping'` directly from
 *   the example metadata. **The engine state builder is NOT called
 *   on these cases** — calling it would throw the Phase 9E-2 scope
 *   error, and we don't want exceptions on the UI render path.
 */
export function computeBellNetworkSandboxResult(
  example: BellNetworkSandboxExample,
): BellNetworkSandboxResult {
  const graph = graphForExample(example.id);
  const summary = summarizeBellNetworkGraph(graph);

  const nodeSummaries: BellNetworkSandboxNodeSummary[] = summary.nodeSummaries.map(
    (ns) => ({
      nodeId: ns.nodeId,
      incidentEdgeIds: [...ns.incidentEdgeIds],
      spins: [...ns.spins],
      totalDimension: ns.totalDimension,
      invariantDimension: ns.invariantDimension,
    }),
  );

  // Mega Phase 9E-4: dipole and cycle-4 now use the projected builder
  // (`buildSpinHalfProjectedBellNetworkState`); two-node single-edge
  // continues on the Phase 9E-2 minimal-prototype path because both
  // its endpoint nodes have invariantDimension 0 (the projected
  // builder rejects this shape by design).
  let prototypeState: BellNetworkSandboxPrototypeState;
  if (example.id === 'twoNodeSingleEdge') {
    const state = buildMinimalSpinHalfBellNetworkState(graph);
    prototypeState = {
      status: 'available',
      stateRegister: 'minimal-two-node-prototype',
      kind: state.kind,
      dimension: state.dimension,
      normalised: state.normalised,
      honesty: state.honesty,
    };
  } else {
    // dipoleSpinHalf or cycle4SpinHalf — the projected register.
    const state = buildSpinHalfProjectedBellNetworkState(graph);
    prototypeState = {
      status: 'available',
      stateRegister: 'spin-half-projected-bell-network-state',
      kind: state.kind,
      // For the projected register, the UI's "Dimension" row mirrors
      // the endpoint dimension (the size of the full Hilbert space
      // the projected ket lives in). The graph invariant dimension
      // is reported separately in the projected-only fields below.
      dimension: state.endpointDimension,
      normalised: state.normalised,
      honesty: state.honesty,
      endpointDimension: state.endpointDimension,
      invariantDimension: state.invariantDimension,
      perNodeInvariantDimensions: [...state.perNodeInvariantDimensions],
      normBeforeProjectionNormalisation:
        state.normBeforeProjectionNormalisation,
    };
  }

  return {
    id: example.id,
    graphKind: example.graphKind,
    nodeCount: graph.nodes.length,
    edgeCount: graph.edges.length,
    edgeSpins: graph.edges.map((e) => e.spin),
    hasParallelEdges: detectParallelEdges(graph),
    nodeSummaries,
    prototypeState,
  };
}
