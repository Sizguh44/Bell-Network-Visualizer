/**
 * Mega Phase 9E-2 — Bell-network graph contract.
 *
 * Pure TypeScript. No React, no DOM, no i18n. No new npm dependency.
 *
 * What this module provides:
 *
 *   • The `BellNetworkGraph` type — the engine's first explicit
 *     **graph contract** for an undirected, edge-labelled spin
 *     network. A graph carries an unordered list of nodes and an
 *     unordered list of edges; each edge carries its incident nodes
 *     and a half-integer SU(2) spin label.
 *
 *   • `validateBellNetworkGraph` — enforces the contract: non-empty
 *     node list, unique non-empty ids, valid endpoints, no self-loops
 *     (deferred to a future phase), valid spins via Phase 9C-3
 *     `validateSpinJ`, and the "every node has at least one incident
 *     edge" connectedness guard.
 *
 *   • Helpers `incidentEdgesForNode` / `incidentEdgeIdsForNode` /
 *     `spinsForNode` for the per-node spin tuple a node intertwiner
 *     space needs.
 *
 *   • `summarizeBellNetworkGraph(graph)` — runs the Phase 9D-2-b
 *     `invariantSubspaceProjector` once per node and reports
 *     `{nodeId, incidentEdgeIds, spins, totalDimension,
 *     invariantDimension, keptEigenvalueIndices}` for each node. The
 *     full projector and basis matrices are deliberately NOT
 *     surfaced in the summary — those layers belong on a per-node
 *     deep-dive UI surface, not a graph-level summary.
 *
 *   • Canonical constructors for the three graphs Phase 9E-2 / 9E-3
 *     will exercise: a two-node single-edge graph, the dipole graph
 *     with four parallel spin-1/2 edges, and the cycle-4 graph with
 *     four spin-1/2 edges.
 *
 * **Honesty discipline (Mega Phase 9E-2).**
 *
 *   • A `BellNetworkGraph` is a **contract** — a typed description of
 *     a spin network's combinatorial structure plus per-edge spin
 *     labels. It is NOT a state. The summary returned by
 *     `summarizeBellNetworkGraph` is per-node intertwiner-space
 *     metadata only; it is NOT a graph-level Bell-network state, NOT
 *     a tensor over node intertwiner spaces, and NOT contracted on
 *     edge slots.
 *
 *   • Per-node summaries inherit the Phase 9D-2-b honesty boundary:
 *     each node's `invariantDimension` is `mult(j_total = 0)` for
 *     that node's incident-spin tuple — a single-node SU(2)-invariant
 *     subspace dimension. Combining node intertwiner spaces into a
 *     graph-level state needs edge-slot bookkeeping and Wigner-3j
 *     contractions, which Phase 9E-2 does NOT yet implement (only
 *     the two-node single-edge prototype is built, in
 *     `minimalBellNetworkState.ts`).
 *
 *   • Edge `source` / `target` are **bookkeeping only**: they let us
 *     reference an edge's two endpoints by id. There is no physical
 *     orientation; the Bell-network gluing primitive (singlet on a
 *     spin-1/2 edge) is symmetric under swap of the two endpoints.
 *     "Source" / "target" labels do NOT carry physical content and
 *     MUST NOT be described as physical orientation.
 *
 *   • Parallel edges (multiple distinct edge ids with the same
 *     `{source, target}`) are explicitly **allowed** because the
 *     dipole graph requires them — two nodes joined by four parallel
 *     spin-1/2 edges.
 *
 *   • Self-loops (`source === target`) are explicitly **rejected** in
 *     this phase. A self-loop's contribution to a node's spin tuple
 *     would need to be counted twice (once per endpoint), and the
 *     gluing primitive on a self-edge is not yet specified.
 */

import { invariantSubspaceProjector } from './invariantSubspace';
import { validateSpinJ } from './spinRepresentation';

/* ------------------------------------------------------------------ */
/*  Types                                                              */
/* ------------------------------------------------------------------ */

/** Opaque-ish string id for a Bell-network node. Non-empty. */
export type BellNetworkNodeId = string;

/** Opaque-ish string id for a Bell-network edge. Non-empty, unique. */
export type BellNetworkEdgeId = string;

/** A node in a Bell-network graph. Carries only its id at this phase;
 *  the per-node spin tuple is derived from the edge list, not declared
 *  on the node directly (the gluing constraint). */
export interface BellNetworkNode {
  id: BellNetworkNodeId;
}

/**
 * A spin-labelled edge between two distinct nodes.
 *
 * `source` and `target` are bookkeeping-only — they let us reference
 * an edge's two endpoints by id. There is no physical orientation;
 * Phase 9E-2's spin-1/2 singlet gluing is symmetric in the two
 * endpoints, and the rest of the engine treats edges as undirected.
 *
 * `spin` is a half-integer SU(2) representation label validated by
 * `validateSpinJ`.
 */
export interface BellNetworkEdge {
  id: BellNetworkEdgeId;
  source: BellNetworkNodeId;
  target: BellNetworkNodeId;
  spin: number;
}

/** A Bell-network graph: nodes + edges. Validation runs on demand
 *  via `validateBellNetworkGraph`. */
export interface BellNetworkGraph {
  nodes: BellNetworkNode[];
  edges: BellNetworkEdge[];
}

/**
 * Per-node summary surfaced by `summarizeBellNetworkGraph`. Carries
 * the structural metadata downstream code (UI, multi-node state
 * builders, etc.) needs from a node's intertwiner space — but
 * deliberately omits the full projector and basis matrices, which
 * belong on a per-node deep-dive UI rather than a graph-level
 * summary.
 */
export interface BellNetworkNodeIntertwinerSummary {
  nodeId: BellNetworkNodeId;
  /** Edge ids incident to the node, in `graph.edges` order. */
  incidentEdgeIds: BellNetworkEdgeId[];
  /** Spin labels in the same order as `incidentEdgeIds`. */
  spins: number[];
  /** Tensor-product Hilbert dimension `Π (2 j_k + 1)`. */
  totalDimension: number;
  /** SU(2)-invariant subspace dimension `mult(j_total = 0)`. */
  invariantDimension: number;
  /** Indices into the descending eigenvalues of `totalSpinSquared`
   *  whose magnitude was within the projector's tolerance. */
  keptEigenvalueIndices: number[];
}

/** Graph-level summary: the validated graph + one summary per node. */
export interface BellNetworkGraphSummary {
  graph: BellNetworkGraph;
  nodeSummaries: BellNetworkNodeIntertwinerSummary[];
}

/* ------------------------------------------------------------------ */
/*  Validation                                                         */
/* ------------------------------------------------------------------ */

/**
 * Validate a `BellNetworkGraph`. Throws on the first violation; the
 * error message names the specific rule that failed and the offending
 * id where applicable so callers can render a useful diagnostic.
 *
 * Rules (Phase 9E-2):
 *   1. `graph.nodes` is a non-empty array.
 *   2. Each node id is a non-empty string.
 *   3. Node ids are unique.
 *   4. `graph.edges` is an array (may be empty only if a single isolated
 *      node would otherwise pass — but rule 8 forbids that, so in
 *      practice edges is non-empty too).
 *   5. Each edge id is a non-empty string and unique.
 *   6. Each edge's `source` and `target` reference existing node ids.
 *   7. No self-loops: every edge has `source !== target`.
 *   8. Each edge `spin` is a valid SU(2) representation label
 *      (`validateSpinJ`).
 *   9. Every node has at least one incident edge.
 *
 * Parallel edges (multiple edges with identical `{source, target}`)
 * are deliberately allowed — the dipole graph relies on this.
 */
export function validateBellNetworkGraph(graph: BellNetworkGraph): void {
  if (!graph || !Array.isArray(graph.nodes) || !Array.isArray(graph.edges)) {
    throw new Error(
      'validateBellNetworkGraph: graph must be { nodes: [], edges: [] }',
    );
  }
  if (graph.nodes.length === 0) {
    throw new Error('validateBellNetworkGraph: nodes must be non-empty');
  }

  // 2 + 3: node id checks.
  const seenNodeIds = new Set<BellNetworkNodeId>();
  for (const node of graph.nodes) {
    if (typeof node.id !== 'string' || node.id.length === 0) {
      throw new Error(
        `validateBellNetworkGraph: node id must be a non-empty string ` +
          `(got ${JSON.stringify(node.id)})`,
      );
    }
    if (seenNodeIds.has(node.id)) {
      throw new Error(
        `validateBellNetworkGraph: duplicate node id ${JSON.stringify(node.id)}`,
      );
    }
    seenNodeIds.add(node.id);
  }

  // 5 + 6 + 7 + 8: edge checks.
  const seenEdgeIds = new Set<BellNetworkEdgeId>();
  for (const edge of graph.edges) {
    if (typeof edge.id !== 'string' || edge.id.length === 0) {
      throw new Error(
        `validateBellNetworkGraph: edge id must be a non-empty string ` +
          `(got ${JSON.stringify(edge.id)})`,
      );
    }
    if (seenEdgeIds.has(edge.id)) {
      throw new Error(
        `validateBellNetworkGraph: duplicate edge id ${JSON.stringify(edge.id)}`,
      );
    }
    seenEdgeIds.add(edge.id);

    if (!seenNodeIds.has(edge.source)) {
      throw new Error(
        `validateBellNetworkGraph: edge ${JSON.stringify(edge.id)} source ` +
          `${JSON.stringify(edge.source)} is not a known node`,
      );
    }
    if (!seenNodeIds.has(edge.target)) {
      throw new Error(
        `validateBellNetworkGraph: edge ${JSON.stringify(edge.id)} target ` +
          `${JSON.stringify(edge.target)} is not a known node`,
      );
    }
    if (edge.source === edge.target) {
      throw new Error(
        `validateBellNetworkGraph: self-loop on edge ${JSON.stringify(edge.id)} ` +
          `(node ${JSON.stringify(edge.source)}); self-loops are not supported in ` +
          `Phase 9E-2`,
      );
    }
    // validateSpinJ throws with its own descriptive message on a bad
    // spin label.
    validateSpinJ(edge.spin);
  }

  // 9: every node has at least one incident edge.
  const incidentCount = new Map<BellNetworkNodeId, number>();
  for (const node of graph.nodes) incidentCount.set(node.id, 0);
  for (const edge of graph.edges) {
    incidentCount.set(edge.source, (incidentCount.get(edge.source) ?? 0) + 1);
    incidentCount.set(edge.target, (incidentCount.get(edge.target) ?? 0) + 1);
  }
  for (const node of graph.nodes) {
    if ((incidentCount.get(node.id) ?? 0) === 0) {
      throw new Error(
        `validateBellNetworkGraph: node ${JSON.stringify(node.id)} has no ` +
          `incident edges`,
      );
    }
  }
}

/* ------------------------------------------------------------------ */
/*  Helpers                                                            */
/* ------------------------------------------------------------------ */

/**
 * Edges incident to `nodeId`, in `graph.edges` order. Throws if
 * `nodeId` is not a node of the graph (the caller is expected to have
 * validated the graph upstream).
 */
export function incidentEdgesForNode(
  graph: BellNetworkGraph,
  nodeId: BellNetworkNodeId,
): BellNetworkEdge[] {
  const knownNode = graph.nodes.some((n) => n.id === nodeId);
  if (!knownNode) {
    throw new Error(
      `incidentEdgesForNode: node ${JSON.stringify(nodeId)} not in graph`,
    );
  }
  return graph.edges.filter(
    (e) => e.source === nodeId || e.target === nodeId,
  );
}

/** Edge ids of `incidentEdgesForNode(graph, nodeId)`. */
export function incidentEdgeIdsForNode(
  graph: BellNetworkGraph,
  nodeId: BellNetworkNodeId,
): BellNetworkEdgeId[] {
  return incidentEdgesForNode(graph, nodeId).map((e) => e.id);
}

/** Spin tuple for the node `nodeId`: the spins of its incident edges,
 *  in `graph.edges` order. */
export function spinsForNode(
  graph: BellNetworkGraph,
  nodeId: BellNetworkNodeId,
): number[] {
  return incidentEdgesForNode(graph, nodeId).map((e) => e.spin);
}

/* ------------------------------------------------------------------ */
/*  Per-node intertwiner summary                                       */
/* ------------------------------------------------------------------ */

/**
 * Validate `graph` and run the Phase 9D-2-b
 * `invariantSubspaceProjector` once per node, returning a summary
 * with the per-node tensor-product / invariant dimensions and the
 * kept-eigenvalue indices.
 *
 * **Not a state.** This is per-node metadata only — the projector
 * and basis matrices are deliberately not surfaced. A graph-level
 * Bell-network state needs edge-slot bookkeeping + per-edge gluing
 * primitives, which Phase 9E-2 implements only for the two-node
 * single-edge prototype (see `minimalBellNetworkState.ts`).
 */
export function summarizeBellNetworkGraph(
  graph: BellNetworkGraph,
): BellNetworkGraphSummary {
  validateBellNetworkGraph(graph);
  const nodeSummaries: BellNetworkNodeIntertwinerSummary[] = [];
  for (const node of graph.nodes) {
    const incidentEdgeIds = incidentEdgeIdsForNode(graph, node.id);
    const spins = spinsForNode(graph, node.id);
    const projector = invariantSubspaceProjector(spins);
    nodeSummaries.push({
      nodeId: node.id,
      incidentEdgeIds,
      spins,
      totalDimension: projector.totalDimension,
      invariantDimension: projector.invariantDimension,
      keptEigenvalueIndices: projector.keptEigenvalueIndices,
    });
  }
  return { graph, nodeSummaries };
}

/* ------------------------------------------------------------------ */
/*  Canonical Phase 9E-2 graphs                                        */
/* ------------------------------------------------------------------ */

/**
 * The minimal non-trivial Bell-network graph: two nodes connected by
 * a single spin-1/2 edge. Each node has incident-spin tuple `[½]`,
 * total dim 2, invariant dim 0 (single spin-½ has no SU(2)-invariant
 * sub-state). The only graph for which Phase 9E-2 builds an explicit
 * graph-level state — see `minimalBellNetworkState.ts`.
 */
export function createTwoNodeSingleEdgeSpinHalfGraph(): BellNetworkGraph {
  return {
    nodes: [{ id: 'n0' }, { id: 'n1' }],
    edges: [{ id: 'e0', source: 'n0', target: 'n1', spin: 0.5 }],
  };
}

/**
 * Dipole graph with four parallel spin-1/2 edges connecting two
 * nodes. Each node's incident-spin tuple is `[½, ½, ½, ½]`, total
 * dim 16, invariant dim 2 (the textbook 4-valent spin-½ intertwiner
 * space). Phase 9E-2 surfaces this only at summary level —
 * `buildMinimalSpinHalfBellNetworkState` rejects it because the
 * graph-level state needs edge-slot bookkeeping (Phase 9E-4).
 */
export function createDipoleSpinHalfGraph(): BellNetworkGraph {
  return {
    nodes: [{ id: 'n0' }, { id: 'n1' }],
    edges: [
      { id: 'e0', source: 'n0', target: 'n1', spin: 0.5 },
      { id: 'e1', source: 'n0', target: 'n1', spin: 0.5 },
      { id: 'e2', source: 'n0', target: 'n1', spin: 0.5 },
      { id: 'e3', source: 'n0', target: 'n1', spin: 0.5 },
    ],
  };
}

/**
 * Cycle-4 graph with four nodes joined by four spin-1/2 edges in a
 * ring. Each node has incident-spin tuple `[½, ½]`, total dim 4,
 * invariant dim 1 (singlet sector of two spin-½). Phase 9E-2
 * surfaces this only at summary level — graph-level state
 * construction is deferred along with the dipole.
 */
export function createCycle4SpinHalfGraph(): BellNetworkGraph {
  return {
    nodes: [{ id: 'n0' }, { id: 'n1' }, { id: 'n2' }, { id: 'n3' }],
    edges: [
      { id: 'e0', source: 'n0', target: 'n1', spin: 0.5 },
      { id: 'e1', source: 'n1', target: 'n2', spin: 0.5 },
      { id: 'e2', source: 'n2', target: 'n3', spin: 0.5 },
      { id: 'e3', source: 'n3', target: 'n0', spin: 0.5 },
    ],
  };
}
