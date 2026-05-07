/**
 * Phase 9A — minimal complex-vector / complex-matrix primitives.
 *
 * Sized for the small Hilbert spaces the Phase 9A engine exercises
 * (≤ 8-dimensional state vectors, ≤ 8×8 density matrices). Algorithms
 * are straightforward triple loops; correctness over performance.
 *
 * Upgrade path: Phase 9C SU(2) work replaces qubit Hilbert factors
 * with representation spaces — the matrix shape grows but this layer
 * stays unchanged (it operates on plain `ComplexMatrix` regardless of
 * physical interpretation).
 */

import type { Complex } from './complex';
import { ZERO, ONE, abs2, add, conj, mul, scale, approxEqualComplex } from './complex';

export type ComplexVector = readonly Complex[];
export type ComplexMatrix = readonly (readonly Complex[])[];

/** Vector of given dimension filled with 0+0i. */
export function zeroVector(dim: number): Complex[] {
  if (dim < 0 || !Number.isInteger(dim)) {
    throw new Error(`zeroVector: dim must be a non-negative integer (got ${dim})`);
  }
  return Array.from({ length: dim }, () => ({ re: 0, im: 0 }));
}

/** Matrix of given shape filled with 0+0i. */
export function zeroMatrix(rows: number, cols: number): Complex[][] {
  if (rows < 0 || cols < 0 || !Number.isInteger(rows) || !Number.isInteger(cols)) {
    throw new Error(`zeroMatrix: rows and cols must be non-negative integers (got ${rows}×${cols})`);
  }
  return Array.from({ length: rows }, () => zeroVector(cols));
}

/** Identity matrix of given dimension. */
export function identityMatrix(dim: number): Complex[][] {
  const m = zeroMatrix(dim, dim);
  for (let i = 0; i < dim; i++) m[i][i] = ONE;
  return m;
}

/**
 * Outer product |ket⟩⟨ket|. Result is the rank-one density matrix
 * of a pure state — used by `densityMatrix.pureDensityMatrix` and
 * (transitively) by every entropy calculation in the engine.
 */
export function outerProductKetBra(ket: ComplexVector): Complex[][] {
  const n = ket.length;
  const m = zeroMatrix(n, n);
  for (let i = 0; i < n; i++) {
    for (let j = 0; j < n; j++) {
      // |ket⟩⟨ket|_{ij} = ket[i] · conj(ket[j])
      m[i][j] = mul(ket[i], conj(ket[j]));
    }
  }
  return m;
}

/** Trace of a square matrix. Throws on non-square input. */
export function trace(matrix: ComplexMatrix): Complex {
  const n = matrix.length;
  for (let i = 0; i < n; i++) {
    if (matrix[i].length !== n) {
      throw new Error(`trace: matrix is not square (row ${i} length ${matrix[i].length}, expected ${n})`);
    }
  }
  let s = ZERO;
  for (let i = 0; i < n; i++) s = add(s, matrix[i][i]);
  return s;
}

/** Hermitian conjugate (conjugate-transpose) M†. */
export function dagger(matrix: ComplexMatrix): Complex[][] {
  const rows = matrix.length;
  const cols = matrix[0]?.length ?? 0;
  const m = zeroMatrix(cols, rows);
  for (let i = 0; i < rows; i++) {
    for (let j = 0; j < cols; j++) {
      m[j][i] = conj(matrix[i][j]);
    }
  }
  return m;
}

/** Matrix multiplication A · B. Throws on dim mismatch. */
export function matMul(A: ComplexMatrix, B: ComplexMatrix): Complex[][] {
  const aRows = A.length;
  const aCols = A[0]?.length ?? 0;
  const bRows = B.length;
  const bCols = B[0]?.length ?? 0;
  if (aCols !== bRows) {
    throw new Error(`matMul: dim mismatch (${aRows}×${aCols} times ${bRows}×${bCols})`);
  }
  const m = zeroMatrix(aRows, bCols);
  for (let i = 0; i < aRows; i++) {
    for (let j = 0; j < bCols; j++) {
      let s = ZERO;
      for (let k = 0; k < aCols; k++) {
        s = add(s, mul(A[i][k], B[k][j]));
      }
      m[i][j] = s;
    }
  }
  return m;
}

/** ‖|ket⟩‖² = ⟨ket|ket⟩. Real, non-negative. */
export function vectorNormSquared(ket: ComplexVector): number {
  let s = 0;
  for (const c of ket) s += abs2(c);
  return s;
}

/**
 * Normalise a non-zero state vector. Throws if the vector has zero
 * norm or contains NaN — both indicate a programmer error upstream.
 */
export function normalizeStateVector(ket: ComplexVector): Complex[] {
  const n2 = vectorNormSquared(ket);
  if (!Number.isFinite(n2)) {
    throw new Error('normalizeStateVector: vector contains non-finite components');
  }
  if (n2 === 0) {
    throw new Error('normalizeStateVector: cannot normalise zero vector');
  }
  const inv = 1 / Math.sqrt(n2);
  return ket.map((c) => scale(c, inv));
}

/** Element-wise approximate matrix equality. */
export function approxEqualMatrix(A: ComplexMatrix, B: ComplexMatrix, eps = 1e-10): boolean {
  if (A.length !== B.length) return false;
  for (let i = 0; i < A.length; i++) {
    if (A[i].length !== B[i].length) return false;
    for (let j = 0; j < A[i].length; j++) {
      if (!approxEqualComplex(A[i][j], B[i][j], eps)) return false;
    }
  }
  return true;
}

/* ------------------------------------------------------------------ */
/*  Phase 9C-3 — small general helpers used by SU(2) spin-j module    */
/* ------------------------------------------------------------------ */

/**
 * Element-wise sum `A + B`. Throws on shape mismatch. The Phase 9C-3
 * SU(2) module needs this to assemble the Casimir
 * `J² = JxJx + JyJy + JzJz` and (transitively) any future
 * representation-theory operator built from sums of products. Kept in
 * the linear-algebra layer because it is a generic primitive — not
 * SU(2)-specific.
 */
export function addMatrices(A: ComplexMatrix, B: ComplexMatrix): Complex[][] {
  const aRows = A.length;
  const aCols = A[0]?.length ?? 0;
  const bRows = B.length;
  const bCols = B[0]?.length ?? 0;
  if (aRows !== bRows || aCols !== bCols) {
    throw new Error(
      `addMatrices: shape mismatch (${aRows}×${aCols} vs ${bRows}×${bCols})`,
    );
  }
  const m = zeroMatrix(aRows, aCols);
  for (let i = 0; i < aRows; i++) {
    for (let j = 0; j < aCols; j++) {
      m[i][j] = add(A[i][j], B[i][j]);
    }
  }
  return m;
}

/**
 * Multiply every entry of a matrix by a complex scalar. The Phase 9C-3
 * SU(2) module needs this for `Jy = (J+ − J−)/(2i)` (a complex scalar
 * factor `−i/2` over the difference of two matrices) and for any
 * future operator built with imaginary coefficients.
 *
 * Pure function, returns a fresh matrix.
 */
export function scaleMatrix(A: ComplexMatrix, s: Complex): Complex[][] {
  const rows = A.length;
  const cols = A[0]?.length ?? 0;
  const m = zeroMatrix(rows, cols);
  for (let i = 0; i < rows; i++) {
    if (A[i].length !== cols) {
      throw new Error(
        `scaleMatrix: matrix is jagged (row ${i} length ${A[i].length}, ` +
          `expected ${cols})`,
      );
    }
    for (let j = 0; j < cols; j++) {
      m[i][j] = mul(A[i][j], s);
    }
  }
  return m;
}

/**
 * Commutator `[A, B] = AB − BA` for square matrices of equal size.
 * Throws via `matMul` on shape mismatch.
 *
 * Used by the Phase 9C-3 selftest to verify the canonical SU(2)
 * relations `[Jx, Jy] = iJz`, `[Jy, Jz] = iJx`, `[Jz, Jx] = iJy`. Lives
 * in the linear-algebra layer because it is a generic primitive — any
 * future representation-theory work (Lie algebra checks, ladder-operator
 * verification, intertwiner closure) can reuse it without adding a
 * domain-specific dependency.
 */
export function commutator(A: ComplexMatrix, B: ComplexMatrix): Complex[][] {
  const AB = matMul(A, B);
  const BA = matMul(B, A);
  // [A, B] = AB − BA. Reuse `addMatrices` + `scaleMatrix(_, −1)` so the
  // arithmetic flows through the layer's shape checks; the alternative
  // (manual element-wise sub) would silently accept jagged inputs.
  const negBA = scaleMatrix(BA, { re: -1, im: 0 });
  return addMatrices(AB, negBA);
}

/**
 * Matrix-vector multiplication `M · v` for a (possibly rectangular)
 * matrix `M` of shape `m × n` and a column vector `v` of length `n`.
 * Returns a fresh column vector of length `m`. Throws on shape
 * mismatch.
 *
 * Used by the Mega Phase 9E-4 projected Bell-network state construction
 * (`P_global · |Ψ_link⟩` and `B† · endpointKet`). Lives in the
 * linear-algebra layer because it is a generic primitive — any future
 * code that applies an operator to a ket without going through the
 * triple-loop manually can reuse it.
 */
export function matrixVectorMultiply(
  matrix: ComplexMatrix,
  vector: ComplexVector,
): Complex[] {
  const rows = matrix.length;
  const cols = matrix[0]?.length ?? 0;
  if (vector.length !== cols) {
    throw new Error(
      `matrixVectorMultiply: dim mismatch (matrix ${rows}×${cols} vs vector ${vector.length})`,
    );
  }
  const out: Complex[] = [];
  for (let i = 0; i < rows; i++) {
    if (matrix[i].length !== cols) {
      throw new Error(
        `matrixVectorMultiply: matrix row ${i} has length ${matrix[i].length} ` +
          `(expected ${cols})`,
      );
    }
    let s = ZERO;
    for (let j = 0; j < cols; j++) {
      s = add(s, mul(matrix[i][j], vector[j]));
    }
    out.push(s);
  }
  return out;
}

/**
 * Quantum-mechanical expectation value `⟨ψ|O|ψ⟩` for a normalised (or
 * unnormalised) ket `ψ` and a square operator `O` of matching
 * dimension. Returns a `Complex`; for a Hermitian `O` the imaginary
 * part is zero within floating-point tolerance.
 *
 * Used by the Phase 9D-1 selftest for singlet/triplet checks
 * (`⟨S|J²|S⟩ = 0`, `⟨T|J²|T⟩ = 2`, etc.). Lives in the linear-algebra
 * layer because it is a generic primitive — any future operator
 * matrix-element / observable code can reuse it.
 *
 * Throws on dim mismatch (`ket.length !== O.length` or jagged `O`).
 */
export function expectationValue(
  ket: ComplexVector,
  operator: ComplexMatrix,
): Complex {
  const n = ket.length;
  if (operator.length !== n) {
    throw new Error(
      `expectationValue: operator rows ${operator.length} ≠ ket length ${n}`,
    );
  }
  // First compute O|ψ⟩ as a length-n vector, then take ⟨ψ| · (O|ψ⟩).
  // Two passes are clearer than the single triple loop and keep the
  // shape-check on the inner row length close to where it bites.
  let result = ZERO;
  for (let i = 0; i < n; i++) {
    if (operator[i].length !== n) {
      throw new Error(
        `expectationValue: operator row ${i} has length ${operator[i].length} ` +
          `(expected ${n})`,
      );
    }
    let opPsi_i = ZERO;
    for (let j = 0; j < n; j++) {
      opPsi_i = add(opPsi_i, mul(operator[i][j], ket[j]));
    }
    // ⟨ψ|_i = conj(ket[i]); accumulate conj(ket[i]) * opPsi_i.
    result = add(result, mul(conj(ket[i]), opPsi_i));
  }
  return result;
}
