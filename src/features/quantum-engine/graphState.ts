/**
 * Phase 9A — minimal qubit graph-state constructors.
 *
 * **Honesty discipline.** This file provides a *minimal qubit* graph-
 * to-state mapping. It is not an LQG Bell-network state, not an SU(2)
 * intertwiner-space construction, and not a Penrose-style "graph
 * state" of the cluster-state literature. It builds three canonical
 * n-qubit states (product, two-qubit Bell pair, n-qubit GHZ) that the
 * engine and its self-test use as exact-result baselines for partial-
 * trace and entropy calculations.
 *
 * Function names are chosen to be deliberately honest: this is
 * `buildMinimalQubitGraphState`, not `buildLQGBellNetworkState`. The
 * `honesty` field on each returned object is a closed string literal
 * that downstream consumers (Phase 9B UI) must echo when displaying
 * any output derived from these states.
 *
 * Upgrade path: Phase 9C+ replaces this layer with state constructors
 * over SU(2) representation factors and intertwiner spaces; the public
 * API of the engine (density matrices, partial traces, entropies) is
 * designed to stay the same regardless of how the underlying state is
 * built.
 */

import type { ComplexVector } from './linearAlgebra';
import { bellPhiPlus, ghzState, productZeroState } from './quantumState';

/**
 * Closed set of state shapes the minimal-qubit graph-state builder
 * supports in Phase 9A. Adding a kind here means adding both a
 * builder branch in `buildMinimalQubitGraphState` and corresponding
 * test coverage in `quantumEngine.selftest.ts`.
 */
export type MinimalQubitGraphStateKind = 'product' | 'bell-pair' | 'ghz';

/**
 * Resolved minimal-qubit graph state. The `honesty` field is a closed
 * string literal that any UI consuming `ket` MUST surface — it is the
 * machine-readable equivalent of the Phase 9A scope disclaimer.
 */
export interface MinimalQubitGraphState {
  kind: MinimalQubitGraphStateKind;
  numQubits: number;
  ket: ComplexVector;
  description: string;
  /** Marks this state as a quantum-information toy model, not an
   *  LQG / SU(2) construction. Must be carried through any UI display. */
  honesty: 'minimal-qubit-model';
}

/**
 * Build one of the three canonical Phase 9A minimal qubit graph
 * states. Throws on invalid kind/numQubits combinations.
 *
 *   product   — any `numQubits >= 1`. State is |0…0⟩, separable.
 *   bell-pair — requires `numQubits === 2`. State is |Φ+⟩.
 *   ghz       — requires `numQubits >= 2`. State is (|0…0⟩+|1…1⟩)/√2.
 */
export function buildMinimalQubitGraphState(
  kind: MinimalQubitGraphStateKind,
  numQubits: number,
): MinimalQubitGraphState {
  if (!Number.isInteger(numQubits) || numQubits < 1) {
    throw new Error(
      `buildMinimalQubitGraphState: numQubits must be a positive integer ` +
        `(got ${numQubits})`,
    );
  }

  let ket: ComplexVector;
  let description: string;

  switch (kind) {
    case 'product':
      ket = productZeroState(numQubits);
      description = `Product state |${'0'.repeat(numQubits)}⟩ on ${numQubits} qubit${numQubits > 1 ? 's' : ''}.`;
      break;

    case 'bell-pair':
      if (numQubits !== 2) {
        throw new Error(
          `buildMinimalQubitGraphState: 'bell-pair' requires numQubits === 2 (got ${numQubits})`,
        );
      }
      ket = bellPhiPlus();
      description = 'Two-qubit Bell state |Φ+⟩ = (|00⟩ + |11⟩) / √2.';
      break;

    case 'ghz':
      if (numQubits < 2) {
        throw new Error(
          `buildMinimalQubitGraphState: 'ghz' requires numQubits >= 2 (got ${numQubits})`,
        );
      }
      ket = ghzState(numQubits);
      description = `${numQubits}-qubit GHZ state (|0…0⟩ + |1…1⟩) / √2.`;
      break;
  }

  return {
    kind,
    numQubits,
    ket,
    description,
    honesty: 'minimal-qubit-model',
  };
}
