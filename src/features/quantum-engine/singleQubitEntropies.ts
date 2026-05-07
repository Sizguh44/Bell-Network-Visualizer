/**
 * Phase 9A — convenience helper that runs the engine end-to-end for
 * the most common Phase 9A use case: build ρ from a pure state, take
 * the single-qubit reduced ρ for every qubit, and compute the von
 * Neumann entropy of each.
 *
 * No new physics here — this is purely a glue layer over
 * `pureDensityMatrix`, `partialTraceQubits`, `vonNeumannEntropy`. The
 * point is to give the future Phase 9B UI a single call that returns
 * everything it needs to render a per-qubit entropy heatmap.
 */

import type { ComplexMatrix, ComplexVector } from './linearAlgebra';
import { pureDensityMatrix } from './densityMatrix';
import { partialTraceQubits } from './partialTrace';
import { vonNeumannEntropy } from './entropy';

/**
 * Per-qubit entropy result. `entropyNat` is in nats (base e),
 * `entropyBits` is in bits (base 2). The reduced density matrix is
 * exposed too so a UI can render its components directly without
 * re-tracing.
 */
export interface SingleQubitEntropy {
  qubit: number;
  entropyNat: number;
  entropyBits: number;
  reducedDensityMatrix: ComplexMatrix;
}

/**
 * Compute the single-qubit reduced density matrix and von Neumann
 * entropy for every qubit of a pure state. Intended for use with
 * states from `buildMinimalQubitGraphState` (≤ 3 qubits in Phase 9A).
 *
 * Throws if the input ket dimension does not match `2^numQubits` —
 * a fast guard against the common "I built a 2-qubit state and asked
 * for 3 entropies" mistake.
 */
export function computeSingleQubitEntropies(
  ket: ComplexVector,
  numQubits: number,
): SingleQubitEntropy[] {
  if (!Number.isInteger(numQubits) || numQubits < 1) {
    throw new Error(
      `computeSingleQubitEntropies: numQubits must be a positive integer ` +
        `(got ${numQubits})`,
    );
  }
  const expectedDim = 2 ** numQubits;
  if (ket.length !== expectedDim) {
    throw new Error(
      `computeSingleQubitEntropies: ket length ${ket.length} does not match ` +
        `2^${numQubits} = ${expectedDim}`,
    );
  }

  const rho = pureDensityMatrix(ket);
  const out: SingleQubitEntropy[] = [];

  for (let q = 0; q < numQubits; q++) {
    const rhoQ = partialTraceQubits(rho, numQubits, [q]);
    const entropyNat = vonNeumannEntropy(rhoQ, Math.E);
    const entropyBits = vonNeumannEntropy(rhoQ, 2);
    out.push({
      qubit: q,
      entropyNat,
      entropyBits,
      reducedDensityMatrix: rhoQ,
    });
  }

  return out;
}
