/**
 * Mega Phase 9E-4 — spin-1/2 projected Bell-network state.
 *
 * Pure TypeScript. No React, no DOM, no i18n. No new npm dependency.
 *
 * What this module provides:
 *
 *   • The first **multi-node, graph-level** Bell-network state in
 *     the engine. For a canonical spin-1/2 graph (dipole or cycle-4)
 *     it builds:
 *
 *         |Ψ_Γ⟩ = ( ⊗_nodes P_inv(node) ) · ( ⊗_edges |S⟩_edge ) / norm
 *
 *     where `|S⟩_edge` is the spin-1/2 singlet primitive on the
 *     edge's two endpoint slots, `P_inv(node)` is the Phase 9D-2-b
 *     SU(2)-invariant subspace projector at a node, and `norm` is
 *     the L2 norm of the projected ket (assumed positive — the
 *     builder throws if it isn't).
 *
 *   • Two equivalent representations of the result:
 *
 *       - `endpointKet` lives in the **full endpoint Hilbert space**
 *         `⊗_nodes ⊗_incidentSlots H_{1/2}`, with composite index
 *         pinned by the basis convention below.
 *
 *       - `invariantCoefficients` lives in the **graph invariant
 *         subspace** `⊗_nodes H_inv(node)`, with composite index
 *         pinned by the same node-major Kronecker convention. The
 *         relation is `invariantCoefficients = B† · endpointKet`
 *         where `B` is the tensor product of per-node basis matrices.
 *
 *     Both representations carry the same physical state up to the
 *     embedding `B`; the UI surfaces only their dimensions and norms,
 *     never the full vectors.
 *
 *   • Helpers for testing and downstream use:
 *
 *       - `buildEndpointLayout(graph, bookkeeping)` — derives the
 *         global slot list (one entry per node-incidence) plus the
 *         total endpoint dimension `2^|slots|`.
 *
 *       - `buildSpinHalfLinkSingletProductKet(graph, bookkeeping,
 *         layout)` — constructs the link product ket
 *         `⊗_edges |S⟩_edge` in the global endpoint basis.
 *
 *       - `buildGlobalNodeProjector(graph)` — runs
 *         `invariantSubspaceProjector` once per node, tensors the
 *         per-node projectors and per-node basis matrices into
 *         global versions, and reports per-node dimension data.
 *
 *       - `buildSpinHalfProjectedBellNetworkState(graph)` — the
 *         end-to-end builder.
 *
 * **Honesty discipline (Mega Phase 9E-4).**
 *
 *   • This is the **first** multi-node Bell-network state in the
 *     engine. It is *spin-1/2 only*, *projected* (not the bare
 *     link-singlet product), and limited to *dipole* and *cycle-4*
 *     graph shapes. A general-graph builder, arbitrary-spin gluing,
 *     edge-amplitude weights, or geometric-operator expectation
 *     values are NOT in this layer.
 *
 *   • The two-node single-edge graph is **not** handled here — both
 *     endpoint nodes have `invariantDimension = 0` (a single
 *     spin-1/2 has no SU(2)-invariant sub-state), so the projected
 *     construction would zero out. The Phase 9E-2 minimal prototype
 *     `buildMinimalSpinHalfBellNetworkState` continues to handle
 *     that case via the bare link singlet (no per-node projection).
 *
 *   • The honesty marker
 *     `'spin-half-projected-bell-network-state'` MUST be surfaced by
 *     any downstream UI consumer alongside the state. This is a
 *     deliberately specific, narrow literal — distinct from the
 *     Phase 9E-2 `'minimal-spin-half-bell-network-prototype'` — so
 *     code reading the honesty field can immediately tell which
 *     register it is in.
 *
 *   • Edge `source` / `target` are bookkeeping only. The link singlet
 *     `(|source ↑⟩|target ↓⟩ − |source ↓⟩|target ↑⟩)/√2` swaps to
 *     its negative under `source ↔ target`; the projected ket's
 *     overall sign is therefore graph-input-dependent, but every
 *     observable (norm, ⟨J²⟩, reduced ρ, etc.) is invariant.
 *
 * ----------------------------------------------------------------------
 * Composite endpoint basis convention (fixed for the engine):
 *
 *   The global endpoint Hilbert space is the Kronecker product of
 *   one spin-1/2 factor per node-incidence:
 *
 *     H_endpoint = ⊗_node ⊗_incidentSlot H_{1/2}
 *
 *   Slots are flattened in the order:
 *     1. Outer loop: `graph.nodes` order.
 *     2. Inner loop: `incidentEdgesForNode(graph, node.id)` order.
 *
 *   Each slot's spin-1/2 basis is `[|↑⟩, |↓⟩] = [m=+½, m=−½]` (the
 *   descending-m convention pinned in `spinRepresentation.ts`).
 *
 *   Composite index: with `N = number of slots = Σ_node valence`,
 *
 *     composite_index = Σ_k bit_k · 2^(N − 1 − k)
 *
 *   where `bit_k = 0` for ↑ at slot `k` and `1` for ↓. Slot 0 is
 *   the most-significant bit. This matches the existing
 *   `tensorProductMatrix` Kronecker convention exactly: the
 *   outermost factor (slot 0) sits at the most-significant index
 *   position.
 *
 *   The per-node tensor product (used by `invariantSubspaceProjector`
 *   internally and by `buildGlobalNodeProjector` here) follows the
 *   same convention restricted to one node's slots, so the global
 *   projector `P_global = ⊗_node P_inv(node)` acts on
 *   `H_endpoint` element-by-element with no index permutation
 *   needed.
 *
 * ----------------------------------------------------------------------
 */

import type { Complex } from './complex';
import { ZERO, complex } from './complex';
import {
  dagger,
  matrixVectorMultiply,
  vectorNormSquared,
  type ComplexMatrix,
  type ComplexVector,
} from './linearAlgebra';
import { tensorProductMatrices } from './spinTensorProduct';
import {
  spinsForNode,
  validateBellNetworkGraph,
  type BellNetworkEdgeId,
  type BellNetworkGraph,
  type BellNetworkNodeId,
} from './bellNetworkGraph';
import { assertAllEdgesSpinHalf } from './spinHalfGluing';
import {
  canonicaliseEdgeSlots,
  type BellNetworkSlotBookkeeping,
} from './edgeSlotBookkeeping';
import { invariantSubspaceProjector } from './invariantSubspace';

/* ------------------------------------------------------------------ */
/*  Types                                                              */
/* ------------------------------------------------------------------ */

/**
 * Closed enum of supported graph shapes for the projected builder.
 * Adding a new variant is a deliberate API extension — and a future
 * phase ticket. The two-node single-edge graph is intentionally NOT
 * included; it stays on the Phase 9E-2 minimal-prototype path.
 */
export type SpinHalfProjectedBellNetworkStateKind =
  | 'dipole-spin-half-projected'
  | 'cycle4-spin-half-projected';

/**
 * Reference to one endpoint slot in the global endpoint layout. Used
 * by `buildEndpointLayout` and `buildSpinHalfLinkSingletProductKet`.
 */
export interface EndpointSlotRef {
  nodeId: BellNetworkNodeId;
  edgeId: BellNetworkEdgeId;
  /** Local slot index inside the node (0-based, matching
   *  `incidentEdgesForNode` order). */
  slotIndex: number;
  /** Position of this slot in the flattened global slot list. The
   *  most-significant bit of the composite endpoint index is
   *  `globalSlotIndex = 0`. */
  globalSlotIndex: number;
}

/** Bundled global endpoint layout. */
export interface EndpointLayout {
  slots: EndpointSlotRef[];
  /** `2^slots.length`. */
  endpointDimension: number;
}

/** Result of `buildSpinHalfProjectedBellNetworkState`. */
export interface SpinHalfProjectedBellNetworkState {
  kind: SpinHalfProjectedBellNetworkStateKind;
  graph: BellNetworkGraph;
  /** Projected ket in the full endpoint Hilbert space (length
   *  `endpointDimension`). Normalised. */
  endpointKet: ComplexVector;
  /** Coefficients in the graph invariant subspace (length
   *  `invariantDimension`). Normalised. */
  invariantCoefficients: ComplexVector;
  /** `2^(Σ_node valence)`. */
  endpointDimension: number;
  /** Product of per-node invariant dimensions
   *  `Π_node mult(j_total = 0)(spinsForNode)`. */
  invariantDimension: number;
  /** Per-node invariant dimensions in `graph.nodes` order. */
  perNodeInvariantDimensions: number[];
  /** L2 norm of `P_global · |Ψ_link⟩` *before* the final
   *  normalisation step — recorded for diagnostics. Always
   *  positive (the builder throws below `eps`). */
  normBeforeProjectionNormalisation: number;
  /** True if `‖endpointKet‖² ≈ 1` within `1e-9`. */
  normalised: boolean;
  honesty: 'spin-half-projected-bell-network-state';
}

/* ------------------------------------------------------------------ */
/*  Endpoint layout                                                    */
/* ------------------------------------------------------------------ */

/**
 * Flatten the per-node slot lists into a single global slot list,
 * in node-major / incident-edge-minor order. Each slot's
 * `globalSlotIndex` is its position in the flattened list (0-based);
 * the global slot at index 0 is the most-significant bit of the
 * composite endpoint index.
 */
export function buildEndpointLayout(
  graph: BellNetworkGraph,
  bookkeeping: BellNetworkSlotBookkeeping,
): EndpointLayout {
  const slots: EndpointSlotRef[] = [];
  let g = 0;
  for (const node of graph.nodes) {
    const ns = bookkeeping.nodeSlots.find((n) => n.nodeId === node.id);
    if (!ns) {
      throw new Error(
        `buildEndpointLayout: bookkeeping missing nodeSlots for ${JSON.stringify(node.id)}`,
      );
    }
    for (let k = 0; k < ns.incidentEdgeIds.length; k++) {
      slots.push({
        nodeId: node.id,
        edgeId: ns.incidentEdgeIds[k]!,
        slotIndex: k,
        globalSlotIndex: g,
      });
      g++;
    }
  }
  return {
    slots,
    endpointDimension: 1 << slots.length,
  };
}

/**
 * Find the global slot index of an edge endpoint. Local helper used
 * by `buildSpinHalfLinkSingletProductKet`.
 */
function endpointGlobalSlotIndex(
  layout: EndpointLayout,
  nodeId: BellNetworkNodeId,
  slotIndex: number,
): number {
  const slot = layout.slots.find(
    (s) => s.nodeId === nodeId && s.slotIndex === slotIndex,
  );
  if (!slot) {
    throw new Error(
      `endpointGlobalSlotIndex: no slot for node=${JSON.stringify(nodeId)} ` +
        `slotIndex=${slotIndex}`,
    );
  }
  return slot.globalSlotIndex;
}

/* ------------------------------------------------------------------ */
/*  Link singlet product ket                                           */
/* ------------------------------------------------------------------ */

/**
 * Build `⊗_edges |S⟩_edge` in the global endpoint basis.
 *
 * Each spin-1/2 singlet on edge `e` (source endpoint at global slot
 * `s`, target endpoint at global slot `t`) is the textbook
 *
 *     |S⟩_e = (1/√2) (|↑⟩_s |↓⟩_t − |↓⟩_s |↑⟩_t)
 *
 * The full link product is the tensor product over edges. Since
 * every endpoint slot belongs to exactly one edge (each node-edge
 * incidence contributes one slot, and an edge has exactly two
 * endpoints), the slots used by different edges are disjoint and
 * the product is well-defined as a single ket on the full
 * endpoint space.
 *
 * Algorithm: enumerate `2^|edges|` term-choice combinations. For
 * each combination, choose either (`source=↑`, `target=↓`,
 * coeff = +1/√2) or (`source=↓`, `target=↑`, coeff = −1/√2) per
 * edge. Compute the resulting bit assignment for every endpoint
 * slot, derive the composite index, and accumulate the term's
 * coefficient (a product of `±1/√2` per edge) into that
 * component.
 *
 * Slots not assigned by any edge would leave their bit
 * undetermined; this should never happen for a valid graph (every
 * incidence is exactly one endpoint of exactly one edge), and the
 * function throws if it detects an unassigned slot.
 *
 * Output norm: 1 by construction (each singlet is normalised; slots
 * are disjoint so the product norm is the product of factor norms).
 */
export function buildSpinHalfLinkSingletProductKet(
  graph: BellNetworkGraph,
  bookkeeping: BellNetworkSlotBookkeeping,
  layout: EndpointLayout,
): Complex[] {
  // Sanity check: every slot must be assigned by exactly one edge
  // endpoint. This catches malformed bookkeeping early.
  assertAllEdgesSpinHalf(graph);
  const totalSlots = layout.slots.length;
  const slotAssignment = new Array<number>(totalSlots).fill(0); // edge endpoint count per slot
  for (const es of bookkeeping.edgeSlots) {
    const sg = endpointGlobalSlotIndex(layout, es.source.nodeId, es.source.slotIndex);
    const tg = endpointGlobalSlotIndex(layout, es.target.nodeId, es.target.slotIndex);
    slotAssignment[sg]! += 1;
    slotAssignment[tg]! += 1;
  }
  for (let g = 0; g < totalSlots; g++) {
    if (slotAssignment[g] !== 1) {
      throw new Error(
        `buildSpinHalfLinkSingletProductKet: global slot ${g} has ` +
          `${slotAssignment[g]} edge endpoints (expected exactly 1)`,
      );
    }
  }

  const numEdges = bookkeeping.edgeSlots.length;
  const dim = layout.endpointDimension;
  const ket: Complex[] = [];
  for (let i = 0; i < dim; i++) ket.push({ re: 0, im: 0 });

  const inv = 1 / Math.sqrt(2);

  // Resolve global slot pairs once.
  const edgePairs = bookkeeping.edgeSlots.map((es) => ({
    sg: endpointGlobalSlotIndex(layout, es.source.nodeId, es.source.slotIndex),
    tg: endpointGlobalSlotIndex(layout, es.target.nodeId, es.target.slotIndex),
  }));

  // Bit weight for the composite index: slot k contributes
  //   bit_k * 2^(N − 1 − k).
  // Slot k=0 is most significant.
  const weight = (k: number): number => 1 << (totalSlots - 1 - k);

  // Enumerate 2^numEdges term combinations. Each bit of `mask` picks
  // edge term: 0 → (s=0, t=1, +1/√2); 1 → (s=1, t=0, −1/√2).
  const totalMasks = 1 << numEdges;
  for (let mask = 0; mask < totalMasks; mask++) {
    // Build the bit assignment for the global slot vector.
    const bits = new Array<number>(totalSlots).fill(0);
    let signNegCount = 0;
    for (let e = 0; e < numEdges; e++) {
      const choice = (mask >> e) & 1;
      const { sg, tg } = edgePairs[e]!;
      if (choice === 0) {
        bits[sg] = 0;
        bits[tg] = 1;
      } else {
        bits[sg] = 1;
        bits[tg] = 0;
        signNegCount += 1;
      }
    }
    // Composite index from bits.
    let idx = 0;
    for (let k = 0; k < totalSlots; k++) {
      if (bits[k] === 1) idx += weight(k);
    }
    // Coefficient = (±1/√2)^numEdges = (1/√2)^numEdges · (−1)^signNegCount.
    const sign = signNegCount % 2 === 0 ? 1 : -1;
    const coeff = sign * Math.pow(inv, numEdges);
    ket[idx] = { re: ket[idx]!.re + coeff, im: ket[idx]!.im };
  }

  return ket;
}

/* ------------------------------------------------------------------ */
/*  Global node projector                                              */
/* ------------------------------------------------------------------ */

/** Result of `buildGlobalNodeProjector`. */
export interface GlobalNodeProjector {
  /** `⊗_node P_inv(node)` — square `endpointDim × endpointDim`. */
  projector: ComplexMatrix;
  /** `⊗_node V(node)` — rectangular `endpointDim × invariantDim`,
   *  columns spanning the graph invariant subspace. */
  basis: ComplexMatrix;
  /** Per-node invariant dimensions, in `graph.nodes` order. */
  perNodeInvariantDimensions: number[];
  /** Per-node total Hilbert dimensions, in `graph.nodes` order. */
  perNodeTotalDimensions: number[];
}

/**
 * Run `invariantSubspaceProjector(spinsForNode(graph, node.id))` for
 * every node and tensor the results into global projector + basis.
 *
 * Throws if any node has `invariantDimension === 0` — the projected
 * Bell-network state needs every node to admit at least one
 * SU(2)-invariant sub-state. The two-node single-edge graph fails
 * this guard (each node has spins `[½]` ⇒ invariantDim 0); that is
 * by design — the Phase 9E-2 minimal prototype handles that case
 * separately.
 */
export function buildGlobalNodeProjector(
  graph: BellNetworkGraph,
): GlobalNodeProjector {
  const projectors: ComplexMatrix[] = [];
  const bases: ComplexMatrix[] = [];
  const perNodeInvariantDimensions: number[] = [];
  const perNodeTotalDimensions: number[] = [];

  for (const node of graph.nodes) {
    const spins = spinsForNode(graph, node.id);
    const inv = invariantSubspaceProjector(spins);
    if (inv.invariantDimension === 0) {
      throw new Error(
        `buildGlobalNodeProjector: node ${JSON.stringify(node.id)} has ` +
          `invariantDimension 0 (spins ${JSON.stringify(spins)}). The projected ` +
          `spin-half Bell-network state requires non-zero invariant dimension ` +
          `at every node — use the Phase 9E-2 minimal prototype builder for ` +
          `graphs with valence-1 nodes.`,
      );
    }
    projectors.push(inv.projector);
    bases.push(inv.basis);
    perNodeInvariantDimensions.push(inv.invariantDimension);
    perNodeTotalDimensions.push(inv.totalDimension);
  }

  // Tensor products. `tensorProductMatrices` left-folds the existing
  // binary `tensorProductMatrix`, which handles rectangular inputs
  // correctly (verified by Phase 9D-1 selftests).
  const projector = tensorProductMatrices(projectors);
  const basis = tensorProductMatrices(bases);

  return {
    projector,
    basis,
    perNodeInvariantDimensions,
    perNodeTotalDimensions,
  };
}

/* ------------------------------------------------------------------ */
/*  Projected state construction                                       */
/* ------------------------------------------------------------------ */

/** Tolerance for "norm is positive enough to normalise". */
const PROJECTION_NORM_EPS = 1e-12;

/** Tolerance for the final `‖endpointKet‖² ≈ 1` check. */
const FINAL_NORM_EPS = 1e-9;

/** Recognise the input graph against the closed list of supported
 *  shapes. Returns the shape kind or null. */
function recogniseSupportedShape(
  graph: BellNetworkGraph,
): SpinHalfProjectedBellNetworkStateKind | null {
  // Dipole: 2 nodes, 4 edges, all between same pair (parallel).
  if (graph.nodes.length === 2 && graph.edges.length === 4) {
    const a = graph.nodes[0]!.id;
    const b = graph.nodes[1]!.id;
    const allParallel = graph.edges.every(
      (e) =>
        (e.source === a && e.target === b) ||
        (e.source === b && e.target === a),
    );
    if (allParallel) return 'dipole-spin-half-projected';
  }
  // Cycle-4: 4 nodes, 4 edges, every node has valence 2.
  if (graph.nodes.length === 4 && graph.edges.length === 4) {
    const valence = new Map<BellNetworkNodeId, number>();
    for (const node of graph.nodes) valence.set(node.id, 0);
    for (const edge of graph.edges) {
      valence.set(edge.source, (valence.get(edge.source) ?? 0) + 1);
      valence.set(edge.target, (valence.get(edge.target) ?? 0) + 1);
    }
    const allValenceTwo = graph.nodes.every((n) => valence.get(n.id) === 2);
    if (allValenceTwo) return 'cycle4-spin-half-projected';
  }
  return null;
}

/**
 * End-to-end projected Bell-network state builder for spin-1/2
 * graphs. See module header for the full mathematical scope and
 * conventions.
 *
 * Pipeline:
 *   1. `validateBellNetworkGraph(graph)` — structural contract check
 *      (Phase 9E-2).
 *   2. `assertAllEdgesSpinHalf(graph)` — every edge must carry
 *      `spin === 0.5`.
 *   3. Shape recognition: only `'dipole-spin-half-projected'` and
 *      `'cycle4-spin-half-projected'` are supported. Other shapes
 *      throw with a "Phase 9E-4 supports only dipole and cycle-4
 *      spin-1/2 projected states" message.
 *   4. `bookkeeping = canonicaliseEdgeSlots(graph)` — Phase 9E-4
 *      slot resolution.
 *   5. `layout = buildEndpointLayout(graph, bookkeeping)` — global
 *      slot ordering + endpoint dimension.
 *   6. `linkKet = buildSpinHalfLinkSingletProductKet(...)` —
 *      `⊗_edges |S⟩_edge` in the global endpoint basis (norm 1).
 *   7. `globalNodeProjector = buildGlobalNodeProjector(graph)` —
 *      tensor product of per-node `invariantSubspaceProjector`
 *      results. Throws if any node has invariantDim 0.
 *   8. `projected = P_global · linkKet`.
 *   9. `normBefore = √(‖projected‖²)`. If `normBefore <
 *      PROJECTION_NORM_EPS`, throw — the bare link product had no
 *      overlap with the graph invariant subspace, which would
 *      indicate either a malformed graph (caught above) or a
 *      surprising vanishing case worth investigating manually.
 *  10. `endpointKet = projected / normBefore` — final normalised
 *      ket in the full endpoint Hilbert space.
 *  11. `invariantCoefficients = B† · endpointKet` — same state's
 *      coefficients in the graph invariant subspace basis.
 *  12. `normalised = ‖endpointKet‖² ≈ 1` within `FINAL_NORM_EPS`.
 *
 * Returns a `SpinHalfProjectedBellNetworkState` carrying both
 * representations of the state, the per-node + graph-level
 * dimensions, the pre-normalisation norm (for diagnostics), and the
 * mandatory `'spin-half-projected-bell-network-state'` honesty
 * marker.
 */
export function buildSpinHalfProjectedBellNetworkState(
  graph: BellNetworkGraph,
): SpinHalfProjectedBellNetworkState {
  validateBellNetworkGraph(graph);
  assertAllEdgesSpinHalf(graph);

  const kind = recogniseSupportedShape(graph);
  if (kind === null) {
    throw new Error(
      `buildSpinHalfProjectedBellNetworkState: Phase 9E-4 supports only ` +
        `dipole and cycle-4 spin-1/2 projected states (got ${graph.nodes.length} ` +
        `nodes, ${graph.edges.length} edges with non-canonical structure). ` +
        `For the two-node single-edge graph use buildMinimalSpinHalfBellNetworkState; ` +
        `arbitrary-graph and arbitrary-spin construction is deferred to a future phase.`,
    );
  }

  const bookkeeping = canonicaliseEdgeSlots(graph);
  const layout = buildEndpointLayout(graph, bookkeeping);
  const linkKet = buildSpinHalfLinkSingletProductKet(
    graph,
    bookkeeping,
    layout,
  );

  const globalNodeProjector = buildGlobalNodeProjector(graph);
  const projected = matrixVectorMultiply(globalNodeProjector.projector, linkKet);

  const n2Before = vectorNormSquared(projected);
  const normBefore = Math.sqrt(n2Before);
  if (!(normBefore > PROJECTION_NORM_EPS)) {
    throw new Error(
      `buildSpinHalfProjectedBellNetworkState: projected norm ${normBefore} ` +
        `is below tolerance — link singlet product has no overlap with the ` +
        `graph invariant subspace. This indicates either a malformed graph ` +
        `(should have been caught upstream) or an unexpected vanishing case.`,
    );
  }

  // Normalise the endpoint-basis ket.
  const endpointKet: Complex[] = projected.map((c) => ({
    re: c.re / normBefore,
    im: c.im / normBefore,
  }));

  // Project to invariant-subspace coefficients via B†.
  const invariantCoefficients = matrixVectorMultiply(
    dagger(globalNodeProjector.basis),
    endpointKet,
  );

  // Final normalisation flag.
  const finalNorm2 = vectorNormSquared(endpointKet);
  const normalised = Math.abs(finalNorm2 - 1) < FINAL_NORM_EPS;

  // Compute graph invariant dimension as a redundant sanity check
  // (should equal the product of per-node invariant dims, and the
  // length of `invariantCoefficients`).
  let invariantDimension = 1;
  for (const d of globalNodeProjector.perNodeInvariantDimensions) {
    invariantDimension *= d;
  }
  if (invariantCoefficients.length !== invariantDimension) {
    throw new Error(
      `buildSpinHalfProjectedBellNetworkState: invariantCoefficients length ` +
        `${invariantCoefficients.length} ≠ Π perNodeInvariantDims = ${invariantDimension}`,
    );
  }

  // Defensive: clean up tiny floating-point noise in the
  // imaginary parts of invariantCoefficients if they're effectively
  // zero (the spin-1/2 singlet has zero imaginary parts in the
  // fixed basis, and the projected ket / basis matrices stay real).
  // We don't actually clamp here — keeping the raw output preserves
  // the engine's "expose the number, document the convention"
  // discipline. The `void`-flagged constant satisfies linters.
  void ZERO;
  void complex;

  return {
    kind,
    graph,
    endpointKet,
    invariantCoefficients,
    endpointDimension: layout.endpointDimension,
    invariantDimension,
    perNodeInvariantDimensions: globalNodeProjector.perNodeInvariantDimensions,
    normBeforeProjectionNormalisation: normBefore,
    normalised,
    honesty: 'spin-half-projected-bell-network-state',
  };
}
