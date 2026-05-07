/**
 * Mega Phase 9E-2 — spin-1/2 edge gluing primitive.
 *
 * Pure TypeScript. No React, no DOM, no i18n. No new npm dependency.
 *
 * What this module provides:
 *
 *   • `spinHalfSingletState()` — the SU(2)-invariant singlet of two
 *     spin-1/2 factors, in the **composite basis pinned by Phase 9D-1**:
 *     `[|↑↑⟩, |↑↓⟩, |↓↑⟩, |↓↓⟩]` (Kronecker product of each factor's
 *     descending-m basis). Concrete amplitudes
 *     `[0, 1/√2, −1/√2, 0]`. **This is the engine's first "edge gluing"
 *     primitive** — for a spin-1/2 edge, the SU(2)-invariant
 *     contribution to the Bell-network state on the two endpoint slots
 *     IS this singlet (up to global phase). Used by
 *     `minimalBellNetworkState.buildMinimalSpinHalfBellNetworkState`.
 *
 *   • `validateSpinHalfEdge(edge)` — a guard that throws unless the
 *     edge carries `spin === 0.5`. Lets multi-node Bell-network
 *     builders insist that every edge of a graph is spin-1/2 before
 *     applying the singlet primitive (the only gluing the engine
 *     supports today).
 *
 *   • `assertAllEdgesSpinHalf(graph)` — convenience guard that runs
 *     `validateSpinHalfEdge` on every edge of a `BellNetworkGraph`.
 *
 * **Honesty discipline (Mega Phase 9E-2).**
 *
 *   • The singlet returned here is **the textbook SU(2) two-spin-1/2
 *     singlet**. It is NOT yet a Bell-network state per se — a
 *     Bell-network state lives on a graph and contracts singlets on
 *     edge slots between nodes. This module supplies the per-edge
 *     gluing primitive; the graph-level construction (only the
 *     two-node single-edge prototype today) lives in
 *     `minimalBellNetworkState.ts`.
 *
 *   • The engine already exposes the same singlet ket from
 *     `spinTensorProduct.singletStateTwoSpinHalf()`. This module
 *     deliberately re-exports the value through `spinHalfSingletState`
 *     because the **role** is different: `singletStateTwoSpinHalf` is
 *     a textbook two-spin-1/2 state (used in Phase 9D-1 selftests for
 *     `⟨J²⟩ = 0` checks), while `spinHalfSingletState` is the
 *     **edge gluing primitive** consumed by graph-level builders. The
 *     two functions return byte-identical kets but serve different
 *     architectural roles, and the selftest checks that they agree
 *     exactly.
 *
 *   • Higher-spin edge gluing (a spin-1 edge needs the SU(2)-invariant
 *     of `1 ⊗ 1`, a spin-3/2 edge needs the invariant of
 *     `3/2 ⊗ 3/2`, etc., generically through a Wigner-3j
 *     contraction) is NOT implemented. `validateSpinHalfEdge` throws
 *     on any edge with `spin !== 0.5` so a multi-node builder that
 *     gates on `assertAllEdgesSpinHalf` cannot accidentally produce a
 *     state that pretends to glue arbitrary spins.
 */

import type { Complex } from './complex';
import { complex } from './complex';
import { zeroVector } from './linearAlgebra';
import type { BellNetworkEdge, BellNetworkGraph } from './bellNetworkGraph';

/**
 * SU(2)-invariant singlet ket of two spin-1/2 factors, in the
 * composite basis `[|↑↑⟩, |↑↓⟩, |↓↑⟩, |↓↓⟩]` pinned by Phase 9D-1.
 *
 * Concrete amplitudes: `[0, 1/√2, −1/√2, 0]`.
 *
 * This is the **edge gluing primitive** for a spin-1/2 edge in a
 * Bell-network: when two nodes share a spin-1/2 edge, the
 * SU(2)-invariant contribution to the joint state on the two endpoint
 * slots IS this singlet (up to global phase). The `(↑↓ − ↓↑)/√2`
 * convention matches `singletStateTwoSpinHalf` from `spinTensorProduct.ts`
 * exactly — Phase 9E-2's selftest verifies equality byte-for-byte.
 *
 * Pure function — returns a fresh `Complex[]` so the caller may
 * mutate without surprising the engine. The return type is
 * `Complex[]` (the writable form of `ComplexVector`) for the same
 * reason every other state constructor in the engine returns
 * `Complex[]`: `tensorProductVector`, `bellPhiPlus`,
 * `singletStateTwoSpinHalf`, etc.
 */
export function spinHalfSingletState(): Complex[] {
  const inv = 1 / Math.sqrt(2);
  const ket = zeroVector(4);
  ket[1] = complex(inv, 0); // |↑↓⟩
  ket[2] = complex(-inv, 0); // |↓↑⟩
  return ket;
}

/**
 * Throw unless `edge.spin === 0.5`. Used by graph-level builders that
 * gate on "every edge is spin-1/2" before applying the singlet
 * primitive. The error message names the offending edge id and the
 * unsupported spin so callers can surface a useful diagnostic.
 *
 * The check uses strict equality against `0.5` (not a tolerance-based
 * compare) — `validateSpinJ` upstream guarantees `2 * spin` is an
 * integer, so any "approximately 1/2" input has already been rejected
 * as illegal.
 */
export function validateSpinHalfEdge(edge: BellNetworkEdge): void {
  if (edge.spin !== 0.5) {
    throw new Error(
      `validateSpinHalfEdge: edge ${JSON.stringify(edge.id)} has spin ` +
        `${edge.spin}, expected 0.5 (Phase 9E-2 only supports spin-1/2 ` +
        `edge gluing)`,
    );
  }
}

/**
 * Run `validateSpinHalfEdge` on every edge of `graph`. Convenience
 * for graph-level Bell-network state builders that need every edge to
 * carry the spin-1/2 singlet primitive.
 *
 * Does NOT validate the rest of the graph contract — call
 * `validateBellNetworkGraph` upstream if the graph might be
 * structurally malformed.
 */
export function assertAllEdgesSpinHalf(graph: BellNetworkGraph): void {
  for (const edge of graph.edges) {
    validateSpinHalfEdge(edge);
  }
}
