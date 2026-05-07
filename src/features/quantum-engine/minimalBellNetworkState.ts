/**
 * Mega Phase 9E-2 — minimal graph-level Bell-network state prototype.
 *
 * Pure TypeScript. No React, no DOM, no i18n. No new npm dependency.
 *
 * What this module provides:
 *
 *   • `MinimalBellNetworkStateKind` — closed enum of supported graph
 *     shapes. Today: only `'two-node-single-edge-spin-half'`. The
 *     enum is closed so adding a new kind is a deliberate API
 *     extension, not an accidental one.
 *
 *   • `MinimalBellNetworkState` — interface carrying the chosen graph,
 *     the resulting state ket, its dimension, a normalisation flag,
 *     and the mandatory `honesty: 'minimal-spin-half-bell-network-prototype'`
 *     literal that downstream UI MUST surface.
 *
 *   • `buildMinimalSpinHalfBellNetworkState(graph)` — builds the
 *     graph-level state ket for the supported graph shape and throws
 *     a clear "Phase 9E-2 supports only the two-node single spin-1/2
 *     edge prototype" error for any other shape.
 *
 * **Honesty discipline (Mega Phase 9E-2).**
 *
 *   • This is the engine's first **graph-level Bell-network state**,
 *     but only at the smallest possible scale: two nodes joined by
 *     one spin-1/2 edge. The state is exactly the SU(2) singlet on
 *     that edge — the spin-1/2 gluing primitive from
 *     `spinHalfGluing.ts` — interpreted as the joint state on the two
 *     node slots that the edge connects.
 *
 *   • The dipole graph (two nodes, four parallel spin-1/2 edges) and
 *     the cycle-4 graph (four nodes, four spin-1/2 edges in a ring)
 *     are explicitly **rejected** here. Building those states needs
 *     edge-slot bookkeeping (which incident-edge slot of which node
 *     each gluing primitive contracts on) and the corresponding
 *     index permutation, which Phase 9E-2 does not yet implement.
 *     That is Phase 9E-4 territory.
 *
 *   • The state is NOT a cosmological state, NOT a curvature
 *     observable, and NOT a real geometric-operator expectation
 *     value. It is the SU(2) Hilbert-space state on a fixed
 *     combinatorial graph (the smallest possible one).
 *
 *   • The `honesty: 'minimal-spin-half-bell-network-prototype'`
 *     literal must be surfaced by any downstream UI consumer alongside
 *     the state, in line with the engine's existing honesty discipline
 *     (compare `MinimalQubitGraphState.honesty` from Phase 9A).
 *
 * **Scope of "graph-level" in this prototype.** For the two-node
 * single-edge graph the per-node intertwiner spaces both have
 * `invariantDimension = 0` (a single spin-1/2 has no SU(2)-invariant
 * sub-state — verified by Phase 9D-2-b selftest #42). The Bell-network
 * state on this graph is therefore NOT a tensor over per-node
 * intertwiner spaces; it is the singlet on the single edge slot, and
 * the two endpoint nodes contribute their full spin-1/2 Hilbert factors
 * directly. This is the simplest possible "graph-level" state and the
 * starting point on which Phase 9E-4 will add per-node intertwiner
 * gluing for graphs whose nodes have non-zero intertwiner dimension.
 */

import type { ComplexVector } from './linearAlgebra';
import { vectorNormSquared } from './linearAlgebra';
import {
  validateBellNetworkGraph,
  type BellNetworkGraph,
} from './bellNetworkGraph';
import {
  assertAllEdgesSpinHalf,
  spinHalfSingletState,
} from './spinHalfGluing';

/**
 * Closed enum of supported graph shapes. Adding a new variant is a
 * deliberate API extension — and a Phase 9E-3 / 9E-4 phase ticket.
 */
export type MinimalBellNetworkStateKind = 'two-node-single-edge-spin-half';

/**
 * Result of `buildMinimalSpinHalfBellNetworkState`. Carries the input
 * graph (so the caller doesn't have to re-thread it through), the
 * state ket, its dimension, a `normalised` flag, and the mandatory
 * honesty marker.
 */
export interface MinimalBellNetworkState {
  kind: MinimalBellNetworkStateKind;
  graph: BellNetworkGraph;
  ket: ComplexVector;
  dimension: number;
  normalised: boolean;
  honesty: 'minimal-spin-half-bell-network-prototype';
}

/** Normalisation tolerance for the `normalised` flag — matches the
 *  engine's `validateNormalizedState` default. */
const NORMALISATION_EPS = 1e-10;

/**
 * Build the graph-level Bell-network state ket for the supported
 * graph shape. Throws a clear scope error for any other shape.
 *
 * Algorithm:
 *   1. `validateBellNetworkGraph(graph)` — structural contract check.
 *   2. `assertAllEdgesSpinHalf(graph)` — every edge must carry
 *      `spin === 0.5` (Phase 9E-2 only supports the spin-1/2 gluing
 *      primitive).
 *   3. Scope check: the graph must have exactly 2 nodes and exactly
 *      1 edge. Other shapes (dipole, cycle-4, …) throw with an
 *      explicit "Phase 9E-2 supports only the two-node single spin-1/2
 *      edge prototype" message.
 *   4. `ket = spinHalfSingletState()` — the singlet on the edge slot,
 *      interpreted as the joint state on the two endpoint Hilbert
 *      factors.
 *   5. `dimension = 4` (the composite Hilbert dim of two spin-1/2
 *      factors).
 *   6. `normalised = vectorNormSquared(ket) ≈ 1` within
 *      `NORMALISATION_EPS`.
 *
 * **Why dipole / cycle-4 are deferred.** The dipole graph has four
 * parallel spin-1/2 edges between two nodes; each node has incident
 * spin tuple `[½, ½, ½, ½]` and an invariant-subspace dimension of 2.
 * Combining four singlet primitives across four edge slots into one
 * graph-level state requires edge-slot bookkeeping (which incident
 * slot of which node each primitive's two endpoints contract on) and
 * the corresponding index permutation. The cycle-4 graph has the same
 * issue at lower valence. Phase 9E-2 deliberately stops short of that
 * step; it is Phase 9E-4 territory.
 */
export function buildMinimalSpinHalfBellNetworkState(
  graph: BellNetworkGraph,
): MinimalBellNetworkState {
  validateBellNetworkGraph(graph);
  assertAllEdgesSpinHalf(graph);

  const nodeCount = graph.nodes.length;
  const edgeCount = graph.edges.length;
  if (nodeCount !== 2 || edgeCount !== 1) {
    throw new Error(
      `buildMinimalSpinHalfBellNetworkState: Phase 9E-2 supports only ` +
        `the two-node single spin-1/2 edge prototype (got ${nodeCount} ` +
        `nodes, ${edgeCount} edges). Dipole / cycle-4 / arbitrary graph ` +
        `state construction is deferred to a future phase.`,
    );
  }

  const ket = spinHalfSingletState();
  const n2 = vectorNormSquared(ket);
  const normalised =
    Number.isFinite(n2) && Math.abs(n2 - 1) < NORMALISATION_EPS;

  return {
    kind: 'two-node-single-edge-spin-half',
    graph,
    ket,
    dimension: 4,
    normalised,
    honesty: 'minimal-spin-half-bell-network-prototype',
  };
}
