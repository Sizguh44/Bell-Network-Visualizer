/**
 * Phase 9D-1 — tensor-product spin spaces and total angular momentum
 * operators for SU(2) representation theory.
 *
 * Pure TypeScript. No React, no DOM, no i18n. No new npm dependency.
 *
 * What this module provides:
 *
 *   • `tensorProductMatrices(matrices)` — variadic Kronecker product
 *     `M_0 ⊗ M_1 ⊗ … ⊗ M_{k−1}` built by left-folding the existing
 *     binary `tensorProductMatrix(A, B)` from `quantumState.ts`. The
 *     binary version is reused verbatim; this module does **not**
 *     reimplement it.
 *
 *   • `buildSpinTensorProductSpace(spins)` — validate every spin label,
 *     compute per-factor dimensions `2j_k + 1`, and the total Hilbert
 *     dimension `Π (2j_k + 1)`.
 *
 *   • `embeddedSpinOperator(spins, targetIndex, axis)` — embed a single
 *     factor's spin operator (Jx, Jy, or Jz at `spins[targetIndex]`) in
 *     the tensor product, with identity matrices on every other factor.
 *
 *   • `totalSpinOperator(spins, axis)` — Σ_k embeddedSpinOperator(_, k, axis).
 *
 *   • `totalSpinSquared(spins)` — `Jx_total² + Jy_total² + Jz_total²`,
 *     i.e. the Casimir of the total angular momentum on the tensor
 *     product. Its eigenspectrum is the natural tool for Phase 9D-2's
 *     intertwiner projector (the SU(2)-invariant subspace is the
 *     `J_total = 0` eigenspace), but **this phase does not yet build
 *     such a projector**.
 *
 *   • `singletStateTwoSpinHalf()` / `tripletStatesTwoSpinHalf()` —
 *     canonical 2-spin-1/2 building-block kets used by the selftest to
 *     confirm `J²` and `Jz_total` expectation values agree with
 *     textbook SU(2) representation theory. **These helpers are NOT
 *     LQG intertwiners and NOT Bell-network states.** They are the
 *     standard `(↑↓ ∓ ↓↑)/√2` / `↑↑` / `↓↓` constructions in
 *     elementary quantum mechanics; the names match.
 *
 * **Honesty discipline (Phase 9D-1).**
 *
 *   • This is **representation-theory infrastructure**, not LQG geometry.
 *   • The `J_total = 0` eigenspace of `totalSpinSquared` IS the SU(2)-
 *     invariant subspace at a node, which IS a node intertwiner space —
 *     but Phase 9D-1 does **not** yet extract it. The projector lives
 *     in Phase 9D-2.
 *   • There is no closure-constraint solver, no Bell-network state
 *     constructor, no area / volume / dihedral-angle expectation value,
 *     no spherical-tetrahedron / flatness / curvature score, and no
 *     LQG geometry claim anywhere in this module.
 *
 * ----------------------------------------------------------------------
 * Composite basis convention (fixed for the engine — read this before
 * extending any tensor-product code):
 *
 *   For spins `[j_0, j_1, …, j_{k−1}]`, the composite basis is the
 *   Kronecker product of each factor's descending-m basis (the basis
 *   pinned in Phase 9C-3's `spinRepresentation.ts` header):
 *
 *     |composite, idx⟩ = |j_0, m_0⟩ ⊗ |j_1, m_1⟩ ⊗ … ⊗ |j_{k−1}, m_{k−1}⟩
 *
 *   Composite index `idx` is the standard mixed-radix encoding:
 *
 *     idx = idx_0 · D_1·D_2·…·D_{k−1}  +  idx_1 · D_2·…·D_{k−1}  +  …  +  idx_{k−1}
 *
 *   where `idx_k = j_k − m_k` (the descending-m index of factor k) and
 *   `D_k = 2 j_k + 1` is that factor's dimension. Factor 0 is the
 *   "outermost" / most-significant; factor k−1 is the "innermost" /
 *   least-significant. This matches the convention of the existing
 *   `tensorProductMatrix(A, B)` exactly, which left-folds via
 *   `(A ⊗ B)_{(i,k),(j,l)} = A_{ij} B_{kl}` with row index
 *   `i · rowsB + k`.
 *
 *   For two spin-1/2 factors with descending basis `[+½, −½]`, the
 *   composite basis is therefore
 *
 *     idx 0 = |+½, +½⟩ = |↑↑⟩
 *     idx 1 = |+½, −½⟩ = |↑↓⟩
 *     idx 2 = |−½, +½⟩ = |↓↑⟩
 *     idx 3 = |−½, −½⟩ = |↓↓⟩
 *
 *   so the singlet `(|↑↓⟩ − |↓↑⟩) / √2` lives at `[0, 1/√2, −1/√2, 0]`.
 *
 * ----------------------------------------------------------------------
 */

import type { Complex } from './complex';
import { complex } from './complex';
import type { ComplexMatrix, ComplexVector } from './linearAlgebra';
import {
  addMatrices,
  identityMatrix,
  matMul,
  zeroVector,
} from './linearAlgebra';
import { tensorProductMatrix } from './quantumState';
import {
  spinDimension,
  spinJX,
  spinJY,
  spinJZ,
  validateSpinJ,
} from './spinRepresentation';

/* ------------------------------------------------------------------ */
/*  Types                                                              */
/* ------------------------------------------------------------------ */

/**
 * The Cartesian axis selector for spin operators. Closed enum so the
 * compiler catches typos like `'X'` or `'Jx'` at the call site.
 */
export type SpinAxis = 'x' | 'y' | 'z';

/**
 * Description of the tensor-product Hilbert space for a list of spin
 * labels. Carries the validated `spins` array, the per-factor
 * `dimensions = [2j_k + 1]`, and the `totalDimension = Π dimensions`.
 *
 * Returned by `buildSpinTensorProductSpace`. Pure data — no operators
 * computed; the caller chooses which operators to build via the
 * `embeddedSpinOperator` / `totalSpinOperator` / `totalSpinSquared`
 * helpers.
 */
export interface SpinTensorProductSpace {
  spins: number[];
  dimensions: number[];
  totalDimension: number;
}

/* ------------------------------------------------------------------ */
/*  Tensor-product helpers                                             */
/* ------------------------------------------------------------------ */

/**
 * Variadic Kronecker product `M_0 ⊗ M_1 ⊗ … ⊗ M_{k−1}` for `k ≥ 1`
 * matrices, computed by left-folding the existing binary
 * `tensorProductMatrix(A, B)` (from `./quantumState`).
 *
 * Pure function. The single-input case returns `matrices[0]` directly
 * (idempotent). Throws on empty input.
 *
 * Convention matches the existing binary helper:
 * `(A ⊗ B)_{(i,k),(j,l)} = A_{ij} B_{kl}` with row index
 * `i · rowsB + k` and column index `j · colsB + l`.
 */
export function tensorProductMatrices(
  matrices: readonly ComplexMatrix[],
): ComplexMatrix {
  if (matrices.length === 0) {
    throw new Error(
      'tensorProductMatrices: at least one matrix required (got empty array)',
    );
  }
  let acc: ComplexMatrix = matrices[0]!;
  for (let k = 1; k < matrices.length; k++) {
    acc = tensorProductMatrix(acc, matrices[k]!);
  }
  return acc;
}

/* ------------------------------------------------------------------ */
/*  Tensor-product space builder                                       */
/* ------------------------------------------------------------------ */

/**
 * Build a `SpinTensorProductSpace` from a non-empty list of spin
 * labels. Every label is validated through `validateSpinJ` (so e.g.
 * `0.3` or `−1` is rejected here, not later inside an operator
 * builder). Returns a fresh object — callers may mutate `spins` /
 * `dimensions` without affecting the engine.
 */
export function buildSpinTensorProductSpace(
  spins: readonly number[],
): SpinTensorProductSpace {
  if (spins.length === 0) {
    throw new Error(
      'buildSpinTensorProductSpace: spins must be non-empty (got [])',
    );
  }
  const validated: number[] = [];
  const dimensions: number[] = [];
  for (let k = 0; k < spins.length; k++) {
    const j = spins[k]!;
    validateSpinJ(j); // throws on illegal label
    validated.push(j);
    dimensions.push(spinDimension(j));
  }
  let total = 1;
  for (const d of dimensions) total *= d;
  return {
    spins: validated,
    dimensions,
    totalDimension: total,
  };
}

/* ------------------------------------------------------------------ */
/*  Embedded single-factor spin operators                              */
/* ------------------------------------------------------------------ */

/** Pick the single-factor Cartesian generator for an `axis` selector. */
function singleFactorSpinAxis(j: number, axis: SpinAxis): ComplexMatrix {
  switch (axis) {
    case 'x':
      return spinJX(j);
    case 'y':
      return spinJY(j);
    case 'z':
      return spinJZ(j);
  }
}

/**
 * Embed a single-factor spin operator into the tensor product.
 *
 *   `embeddedSpinOperator(spins, targetIndex, axis)` =
 *     I_{D_0} ⊗ … ⊗ I_{D_{targetIndex−1}} ⊗ J_axis(spins[targetIndex])
 *                ⊗ I_{D_{targetIndex+1}} ⊗ … ⊗ I_{D_{k−1}}
 *
 * where each `I_{D_k}` is the identity on factor `k`'s Hilbert space.
 * Throws on out-of-range `targetIndex` or empty `spins`.
 *
 * This is the canonical "operator on factor `targetIndex`, identity
 * elsewhere" construction. Phase 9D-1's `totalSpinOperator` sums it
 * over all `targetIndex`; Phase 9D-2's intertwiner projector will
 * re-use it through the same Casimir spectrum.
 */
export function embeddedSpinOperator(
  spins: readonly number[],
  targetIndex: number,
  axis: SpinAxis,
): ComplexMatrix {
  if (spins.length === 0) {
    throw new Error(
      'embeddedSpinOperator: spins must be non-empty (got [])',
    );
  }
  if (
    !Number.isInteger(targetIndex) ||
    targetIndex < 0 ||
    targetIndex >= spins.length
  ) {
    throw new Error(
      `embeddedSpinOperator: targetIndex ${targetIndex} out of range ` +
        `[0, ${spins.length})`,
    );
  }
  // Validate every label so `spinDimension` / `singleFactorSpinAxis`
  // never receives a bad input. `validateSpinJ` is cheap (constant-
  // time scalar arithmetic).
  for (let k = 0; k < spins.length; k++) {
    validateSpinJ(spins[k]!);
  }

  const factors: ComplexMatrix[] = [];
  for (let k = 0; k < spins.length; k++) {
    if (k === targetIndex) {
      factors.push(singleFactorSpinAxis(spins[k]!, axis));
    } else {
      factors.push(identityMatrix(spinDimension(spins[k]!)));
    }
  }
  return tensorProductMatrices(factors);
}

/* ------------------------------------------------------------------ */
/*  Total angular momentum operators                                   */
/* ------------------------------------------------------------------ */

/**
 * Total angular momentum operator on one Cartesian axis, for the
 * tensor-product space defined by `spins`:
 *
 *   `J_axis_total = Σ_k embeddedSpinOperator(spins, k, axis)`.
 *
 * The sum runs over every factor; the result is a square matrix of
 * dimension `Π (2 j_k + 1)`. By construction `J_axis_total` is
 * Hermitian (each summand is Hermitian — Phase 9C-3 selftest confirms
 * `Jx`, `Jy`, `Jz` are Hermitian, and `dagger` distributes over
 * tensor product and addition).
 */
export function totalSpinOperator(
  spins: readonly number[],
  axis: SpinAxis,
): ComplexMatrix {
  if (spins.length === 0) {
    throw new Error(
      'totalSpinOperator: spins must be non-empty (got [])',
    );
  }
  let acc: ComplexMatrix = embeddedSpinOperator(spins, 0, axis);
  for (let k = 1; k < spins.length; k++) {
    acc = addMatrices(acc, embeddedSpinOperator(spins, k, axis));
  }
  return acc;
}

/**
 * Total Casimir `J_total² = Jx_total² + Jy_total² + Jz_total²` on the
 * tensor-product space defined by `spins`.
 *
 * Hermitian by construction (each `J_axis_total` is Hermitian and the
 * square of a Hermitian operator is Hermitian; `addMatrices`
 * preserves the property element-wise).
 *
 * The eigenspectrum of this operator is the SU(2) decomposition of
 * the tensor product into total-spin sectors:
 *   • For `[½, ½]`: spectrum `{0, 2, 2, 2}` (singlet + triplet).
 *   • For `[1]`:    spectrum `{2, 2, 2}`     (single irrep, j = 1).
 *   • For `[1, ½]`: spectrum `{¾, ¾, 15⁄4, 15⁄4, 15⁄4, 15⁄4}`
 *                   (½ ⊕ 3⁄2 decomposition).
 * Phase 9D-1's selftest verifies the [½, ½] case directly; Phase 9D-2
 * will use this operator's `j_total = 0` eigenspace to project onto
 * the SU(2)-invariant subspace (i.e. the node intertwiner space).
 */
export function totalSpinSquared(spins: readonly number[]): ComplexMatrix {
  if (spins.length === 0) {
    throw new Error(
      'totalSpinSquared: spins must be non-empty (got [])',
    );
  }
  const jx = totalSpinOperator(spins, 'x');
  const jy = totalSpinOperator(spins, 'y');
  const jz = totalSpinOperator(spins, 'z');
  return addMatrices(addMatrices(matMul(jx, jx), matMul(jy, jy)), matMul(jz, jz));
}

/* ------------------------------------------------------------------ */
/*  Canonical 2-spin-1/2 building-block states                         */
/* ------------------------------------------------------------------ */

/**
 * Singlet state `(|↑↓⟩ − |↓↑⟩) / √2` for two spin-1/2 particles, in
 * the composite basis `[|↑↑⟩, |↑↓⟩, |↓↑⟩, |↓↓⟩]` pinned in the module
 * header.
 *
 * Concrete amplitudes: `[0, 1/√2, −1/√2, 0]`.
 *
 * **Not an LQG intertwiner. Not a Bell-network state.** It is the
 * standard textbook two-spin-1/2 singlet; the selftest uses it to
 * confirm that `⟨S | J_total² | S⟩ = 0` (i.e. it sits in the j_total = 0
 * sector) and `⟨S | J_axis_total | S⟩ = 0` for every Cartesian axis.
 */
export function singletStateTwoSpinHalf(): Complex[] {
  const inv = 1 / Math.sqrt(2);
  const ket = zeroVector(4);
  ket[1] = complex(inv, 0); // |↑↓⟩
  ket[2] = complex(-inv, 0); // |↓↑⟩
  return ket;
}

/** Triplet of two-spin-1/2 states `{plus, zero, minus}`. See header for
 *  composite-basis convention. */
export interface TripletStatesTwoSpinHalf {
  /** `T_+ = |↑↑⟩`, m_total = +1. */
  plus: ComplexVector;
  /** `T_0 = (|↑↓⟩ + |↓↑⟩) / √2`, m_total = 0. */
  zero: ComplexVector;
  /** `T_− = |↓↓⟩`, m_total = −1. */
  minus: ComplexVector;
}

/**
 * Canonical two-spin-1/2 triplet basis. Composite basis as above:
 *
 *   T_+ = `[1, 0, 0, 0]`  (|↑↑⟩)
 *   T_0 = `[0, 1/√2, 1/√2, 0]`  ((|↑↓⟩ + |↓↑⟩) / √2)
 *   T_− = `[0, 0, 0, 1]`  (|↓↓⟩)
 *
 * **Not LQG intertwiners. Not Bell-network states.** Same selftest
 * register as `singletStateTwoSpinHalf` — confirms `⟨T | J_total² | T⟩ = 2`
 * for each (i.e. they all sit in the j_total = 1 sector) and that
 * `⟨T_± | Jz_total | T_±⟩ = ±1`, `⟨T_0 | Jz_total | T_0⟩ = 0`.
 */
export function tripletStatesTwoSpinHalf(): TripletStatesTwoSpinHalf {
  const inv = 1 / Math.sqrt(2);
  const plus = zeroVector(4);
  plus[0] = complex(1, 0);
  const zero = zeroVector(4);
  zero[1] = complex(inv, 0);
  zero[2] = complex(inv, 0);
  const minus = zeroVector(4);
  minus[3] = complex(1, 0);
  return { plus, zero, minus };
}
