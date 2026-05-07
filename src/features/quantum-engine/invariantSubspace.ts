/**
 * Phase 9D-2-b — SU(2)-invariant subspace projector for a single
 * multi-spin node.
 *
 * Pure TypeScript. No React, no DOM, no i18n. No new npm dependency.
 *
 * What this module provides:
 *
 *   • `invariantSubspaceProjector(spins, tolerance?)` — given a list
 *     of SU(2) representation labels `[j_0, j_1, …, j_{n−1}]`, build
 *     the tensor-product Hilbert space, diagonalise the total Casimir
 *     `J_total² = Jx² + Jy² + Jz²` via the Phase 9D-2-a eigensolver,
 *     and collect the eigenvectors with eigenvalue ≈ 0 into a
 *     rectangular basis matrix `V` of shape `dim_total × dim_invariant`.
 *     Return the basis `V`, the projector `P = V · V†`, and provenance
 *     metadata (full descending-order eigenvalues, kept eigenvalue
 *     indices, total / invariant dimensions, the tolerance actually
 *     used).
 *
 * Why this matters:
 *
 *   The `J_total = 0` eigenspace of `J_total²` IS the **SU(2)-invariant
 *   subspace** at a node — by definition, the subspace of states
 *   annihilated by the total angular-momentum operators. A basis for
 *   this subspace IS a **minimal intertwiner-space basis** at one
 *   node. This is the first piece of code in the engine that anyone
 *   could honestly call an "intertwiner basis".
 *
 * Honesty discipline (Phase 9D-2-b):
 *
 *   • This module is for **a single node**. It is not a Bell-network
 *     state. A Bell-network state needs (a) intertwiner basis at every
 *     node — what this module provides — plus (b) edge-spin tensor
 *     structure between nodes, plus (c) edge-pairing constraints
 *     (gluing). Steps (b) and (c) are Phase 9E.
 *
 *   • The output basis vectors live in the composite spin Hilbert
 *     space (the "Kronecker product of each factor's descending-m
 *     basis" pinned by Phase 9D-1). Do **not** describe them as
 *     "Bell-network states", "graph-level LQG states", or
 *     "geometric-operator eigenstates" — none of those layers exist
 *     yet.
 *
 *   • The tolerance defaults to `1e-8` and only affects which
 *     eigenvectors are *kept*. The eigendecomposition itself uses the
 *     Phase 9C-1 / 9D-2-a Jacobi default (`1e-12`), so the projector's
 *     numerical accuracy is independent of the kept-eigenvalue
 *     tolerance.
 *
 *   • The projector is **sign-invariant** by construction: `V · V†`
 *     does not depend on the global sign of any eigenvector column.
 *     This is what makes the projector a more reliable summary of the
 *     invariant subspace than its basis vectors individually.
 */

import type { Complex } from './complex';
import type { ComplexMatrix } from './linearAlgebra';
import { dagger, matMul, zeroMatrix } from './linearAlgebra';
import { eigendecompositionHermitian } from './entropy';
import {
  buildSpinTensorProductSpace,
  totalSpinSquared,
} from './spinTensorProduct';

/**
 * Result of `invariantSubspaceProjector`. Carries both the projector
 * (the canonical, sign-invariant summary) and the basis `V` whose
 * columns span the invariant subspace, plus provenance metadata so
 * the caller can trace why `invariantDimension` came out to what it
 * is.
 *
 * **Basis convention (matches Phase 9D-2-a):**
 *   • `basis` has shape `totalDimension × invariantDimension`.
 *   • `basis[row][col]` = component of invariant basis vector `col`
 *     in the composite spin basis row pinned by Phase 9D-1
 *     (Kronecker product of each factor's descending-m basis,
 *     `idx = Σ_k (j_k − m_k) · D_{k+1}·…·D_{n−1}`).
 *   • Columns are eigenvectors of `totalSpinSquared(spins)` whose
 *     eigenvalue satisfies `|λ| < tolerance`.
 *
 * **Empty-subspace case:** if `invariantDimension === 0`, `basis` is
 * a length-`totalDimension` array of empty rows (`Complex[][]` with
 * `basis.length === totalDimension` and `basis[i].length === 0`),
 * and `projector === zeroMatrix(totalDimension, totalDimension)`.
 */
export interface InvariantSubspaceProjector {
  /** Spins as supplied to the constructor (deep-copied to insulate
   *  the caller from any later mutation of the result). */
  spins: number[];
  /** Tolerance actually used to decide whether `|λ| < tolerance`. */
  tolerance: number;
  /** Total tensor-product Hilbert dimension `Π (2 j_k + 1)`. */
  totalDimension: number;
  /** Number of eigenvalues of `totalSpinSquared` within `tolerance` of 0. */
  invariantDimension: number;
  /** Full descending-order eigenvalues of `totalSpinSquared` (length
   *  `totalDimension`). */
  eigenvalues: number[];
  /** Indices into `eigenvalues` that were kept (i.e. satisfied
   *  `|eigenvalues[k]| < tolerance`). Useful for diagnostics. */
  keptEigenvalueIndices: number[];
  /** Basis matrix `V` of shape `totalDimension × invariantDimension`
   *  whose columns span the invariant subspace. */
  basis: ComplexMatrix;
  /** Projector `P = V · V†` of shape `totalDimension × totalDimension`. */
  projector: ComplexMatrix;
}

/* ------------------------------------------------------------------ */
/*  Local helpers                                                      */
/* ------------------------------------------------------------------ */

/**
 * Extract the specified columns from a `ComplexMatrix`, returning a
 * fresh rectangular matrix of shape `M.length × indices.length`.
 *
 * Local helper — not exported. The Phase 9D-2-b module is the only
 * caller today; if a future module needs this, lift it into the
 * linear-algebra layer.
 */
function extractColumns(
  matrix: ComplexMatrix,
  indices: readonly number[],
): Complex[][] {
  const rows = matrix.length;
  const out: Complex[][] = [];
  for (let i = 0; i < rows; i++) {
    const row: Complex[] = [];
    for (const c of indices) {
      const cell = matrix[i]![c]!;
      // Defensive copy — the eigendecomposition returns a fresh matrix
      // already, but we don't want any aliasing surprises if the
      // caller mutates the basis later.
      row.push({ re: cell.re, im: cell.im });
    }
    out.push(row);
  }
  return out;
}

/* ------------------------------------------------------------------ */
/*  Public API                                                         */
/* ------------------------------------------------------------------ */

/**
 * Build the SU(2)-invariant subspace projector for the tensor product
 * of spins `[j_0, j_1, …, j_{n−1}]`.
 *
 * Algorithm:
 *   1. `space = buildSpinTensorProductSpace(spins)` — validate every
 *      spin label and compute `totalDimension`.
 *   2. `j2 = totalSpinSquared(spins)` — the total Casimir on the
 *      tensor product (Phase 9D-1).
 *   3. `dec = eigendecompositionHermitian(j2)` — eigenvalues +
 *      eigenvectors in descending eigenvalue order (Phase 9D-2-a).
 *   4. `keptEigenvalueIndices = { k : |dec.eigenvalues[k]| < tolerance }`
 *      — the eigenvalues that round to zero are the j_total = 0
 *      eigenvalues, i.e. the SU(2)-invariant sector.
 *   5. `basis = extractColumns(dec.eigenvectors, keptEigenvalueIndices)`
 *      — the invariant-subspace basis as columns.
 *   6. `projector = matMul(basis, dagger(basis))` — `P = V · V†`. The
 *      empty-subspace case is special-cased to return
 *      `zeroMatrix(totalDimension, totalDimension)` directly (so the
 *      shape is always `n × n` regardless of `invariantDimension`).
 *
 * Defaults:
 *   • `tolerance = 1e-8` — generous enough to absorb the few orders
 *     of magnitude of floating-point drift the Jacobi solver
 *     accumulates on small (n ≤ 16) matrices, while staying tight
 *     enough that no non-zero textbook eigenvalue (smallest is `2`
 *     for j_total = 1) is ever accidentally swept into the kernel.
 *   • The Jacobi solver itself runs at its default `1e-12` rotation
 *     tolerance (`eigendecompositionHermitian` → Phase 9C-1 /
 *     9D-2-a defaults).
 *
 * Throws on empty `spins`, on illegal spin labels (via
 * `buildSpinTensorProductSpace` → `validateSpinJ`), and on
 * non-positive / non-finite `tolerance`.
 *
 * **Honesty boundary (read this before extending):** the result is a
 * **single-node** SU(2)-invariant subspace projector. It is NOT a
 * Bell-network state, NOT a graph-level LQG state, NOT a
 * geometric-operator (area / volume / dihedral) eigenspace, and the
 * basis vectors are NOT to be labelled as Bell-network states
 * anywhere. Multi-node gluing belongs to Phase 9E and onward.
 */
export function invariantSubspaceProjector(
  spins: readonly number[],
  tolerance = 1e-8,
): InvariantSubspaceProjector {
  if (spins.length === 0) {
    throw new Error(
      'invariantSubspaceProjector: spins must be non-empty (got [])',
    );
  }
  if (!Number.isFinite(tolerance) || tolerance <= 0) {
    throw new Error(
      `invariantSubspaceProjector: tolerance must be a positive finite ` +
        `number (got ${tolerance})`,
    );
  }

  // 1. Validate spins + compute totalDimension. (`buildSpinTensorProductSpace`
  // throws on any illegal label, so we don't need to re-validate.)
  const space = buildSpinTensorProductSpace(spins);
  const totalDimension = space.totalDimension;

  // 2. Total Casimir on the tensor product.
  const j2 = totalSpinSquared(spins);

  // 3. Eigendecomposition (descending eigenvalue order, columns are
  // eigenvectors).
  const dec = eigendecompositionHermitian(j2);

  // 4. Kept indices: eigenvalues within `tolerance` of 0.
  const keptEigenvalueIndices: number[] = [];
  for (let k = 0; k < dec.eigenvalues.length; k++) {
    if (Math.abs(dec.eigenvalues[k]!) < tolerance) {
      keptEigenvalueIndices.push(k);
    }
  }
  const invariantDimension = keptEigenvalueIndices.length;

  // 5. Basis matrix V: rectangular `totalDimension × invariantDimension`.
  // For the empty-subspace case this returns a length-totalDimension
  // array of empty rows (`basis.length === totalDimension`,
  // `basis[i].length === 0`), which matches the documented convention.
  const basis: ComplexMatrix = extractColumns(
    dec.eigenvectors,
    keptEigenvalueIndices,
  );

  // 6. Projector P = V · V†. Special-case the empty-subspace path
  // because `dagger` of an `n × 0` matrix returns a `0 × n` matrix
  // and `matMul` would then produce an `n × 0` zero matrix rather
  // than the desired `n × n` zero operator on the full space.
  let projector: ComplexMatrix;
  if (invariantDimension === 0) {
    projector = zeroMatrix(totalDimension, totalDimension);
  } else {
    projector = matMul(basis, dagger(basis));
  }

  return {
    // Defensive copy — keeps the result struct independent of any
    // later mutation of the input array.
    spins: [...spins],
    tolerance,
    totalDimension,
    invariantDimension,
    eigenvalues: [...dec.eigenvalues],
    keptEigenvalueIndices,
    basis,
    projector,
  };
}
