/**
 * Phase 9A — minimal quantum-state constructors.
 *
 * Provides a tiny set of canonical states the engine and its self-test
 * exercise: computational-basis states, n-qubit |0…0⟩ product states,
 * the two-qubit |Φ+⟩ Bell state, and the n-qubit GHZ state. Plus
 * tensor products at the vector and matrix level.
 *
 * **Honesty note.** The "Bell state" here is the standard two-qubit
 * quantum-information toy model |Φ+⟩ = (|00⟩ + |11⟩) / √2 — *not* an
 * SU(2) intertwiner Bell-network state. It is used as a quantitative
 * sanity baseline (its single-qubit reduced density matrix is exactly
 * I/2, its single-qubit von Neumann entropy is exactly ln 2). Future
 * SU(2) work (Phase 9C+) replaces this whole layer with intertwiner-
 * space state constructors.
 *
 * **Bit-ordering convention.** The standard physics ordering
 * |q_{n-1} … q_1 q_0⟩ is used: qubit 0 is the least-significant bit
 * of the integer index. So on n=2 qubits:
 *
 *   index 0 = |q_1 q_0⟩ = |00⟩
 *   index 1 = |q_1 q_0⟩ = |01⟩  (qubit 0 = 1)
 *   index 2 = |q_1 q_0⟩ = |10⟩  (qubit 1 = 1)
 *   index 3 = |q_1 q_0⟩ = |11⟩
 *
 * The same convention is used in `partialTrace.ts`.
 */

import type { Complex } from './complex';
import { ONE, mul } from './complex';
import type { ComplexMatrix, ComplexVector } from './linearAlgebra';
import { vectorNormSquared, zeroMatrix, zeroVector } from './linearAlgebra';

/**
 * Computational-basis state |index⟩ in a `dimension`-dim Hilbert space.
 * Throws on out-of-range index.
 */
export function basisState(index: number, dimension: number): Complex[] {
  if (!Number.isInteger(index) || !Number.isInteger(dimension)) {
    throw new Error(`basisState: index and dimension must be integers (got ${index}, ${dimension})`);
  }
  if (index < 0 || index >= dimension) {
    throw new Error(`basisState: index out of range (${index} not in [0, ${dimension}))`);
  }
  const v = zeroVector(dimension);
  v[index] = ONE;
  return v;
}

/**
 * Tensor product |a⟩ ⊗ |b⟩. Output dimension = dim(a) · dim(b).
 *
 * Index convention: the resulting basis is
 * |a_i⟩ ⊗ |b_j⟩ → index `i · dim(b) + j`. This matches the
 * "qubit 0 = LSB" convention used elsewhere when `a` is the
 * higher-qubit factor and `b` is the lower-qubit factor — but in
 * practice the engine builds states directly via amplitude assignment
 * (see `bellPhiPlus`, `ghzState`) rather than nested tensor products,
 * so the only pinned convention is in those two functions.
 */
export function tensorProductVector(a: ComplexVector, b: ComplexVector): Complex[] {
  const out: Complex[] = [];
  for (let i = 0; i < a.length; i++) {
    for (let j = 0; j < b.length; j++) {
      out.push(mul(a[i], b[j]));
    }
  }
  return out;
}

/** Tensor product A ⊗ B for matrices. Used by tests; not in the
 *  engine's hot path. */
export function tensorProductMatrix(A: ComplexMatrix, B: ComplexMatrix): Complex[][] {
  const aRows = A.length;
  const aCols = A[0]?.length ?? 0;
  const bRows = B.length;
  const bCols = B[0]?.length ?? 0;
  const m = zeroMatrix(aRows * bRows, aCols * bCols);
  for (let i = 0; i < aRows; i++) {
    for (let j = 0; j < aCols; j++) {
      for (let k = 0; k < bRows; k++) {
        for (let l = 0; l < bCols; l++) {
          m[i * bRows + k][j * bCols + l] = mul(A[i][j], B[k][l]);
        }
      }
    }
  }
  return m;
}

/**
 * Two-qubit Bell state |Φ+⟩ = (|00⟩ + |11⟩) / √2.
 *
 * Quantum-information toy model — not an SU(2) intertwiner Bell-
 * network state. Used as the engine's primary sanity baseline because
 * it has exact closed-form reduced density matrix (I/2) and entropy
 * (ln 2 nats / 1 bit).
 */
export function bellPhiPlus(): Complex[] {
  const inv = 1 / Math.sqrt(2);
  const ket = zeroVector(4);
  // |00⟩ at index 0
  ket[0] = { re: inv, im: 0 };
  // |11⟩ at index 3
  ket[3] = { re: inv, im: 0 };
  return ket;
}

/** Product state |0…0⟩ on `numQubits` qubits. Pure, unentangled,
 *  zero entropy on every subsystem. */
export function productZeroState(numQubits: number): Complex[] {
  if (!Number.isInteger(numQubits) || numQubits < 1) {
    throw new Error(`productZeroState: numQubits must be a positive integer (got ${numQubits})`);
  }
  const dim = 2 ** numQubits;
  return basisState(0, dim);
}

/**
 * GHZ state (|0…0⟩ + |1…1⟩) / √2 on `numQubits ≥ 2` qubits. Maximally
 * entangled in the sense that every single-qubit reduced density
 * matrix is I/2 with entropy ln 2.
 */
export function ghzState(numQubits: number): Complex[] {
  if (!Number.isInteger(numQubits) || numQubits < 2) {
    throw new Error(`ghzState: numQubits must be an integer >= 2 (got ${numQubits})`);
  }
  const dim = 2 ** numQubits;
  const ket = zeroVector(dim);
  const inv = 1 / Math.sqrt(2);
  ket[0] = { re: inv, im: 0 };          // |0…0⟩
  ket[dim - 1] = { re: inv, im: 0 };    // |1…1⟩
  return ket;
}

/**
 * Throw if `‖|ket⟩‖² ≠ 1 ± eps`. Used in self-tests and as a guard
 * for callers that build kets manually.
 */
export function validateNormalizedState(ket: ComplexVector, eps = 1e-10): void {
  const n2 = vectorNormSquared(ket);
  if (!Number.isFinite(n2)) {
    throw new Error('validateNormalizedState: vector has non-finite components');
  }
  if (Math.abs(n2 - 1) > eps) {
    throw new Error(`validateNormalizedState: ‖|ψ⟩‖² = ${n2}, expected 1 (within ${eps})`);
  }
}
