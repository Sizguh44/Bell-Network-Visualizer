/**
 * Phase 9A → Phase 9C-1 — von Neumann entropy.
 *
 * **Phase 9A baseline (closed-form 2×2)**: `eigenvaluesHermitian2x2`
 * uses the analytic 2×2 Hermitian eigenvalue formula; `vonNeumannEntropy`
 * called it directly and was 2×2-only.
 *
 * **Phase 9C-1 generalisation (Jacobi)**: a real-symmetric Jacobi-
 * rotation eigensolver replaces the 2×2-only restriction. The
 * generalised `vonNeumannEntropy` now supports Hermitian ρ of any
 * finite size, provided the matrix is *effectively real Hermitian* —
 * i.e. the off-diagonal imaginary parts are below `eps`. Complex
 * Hermitian matrices (those with significant imaginary off-diagonals)
 * intentionally throw with an explicit "Phase 9C-1 supports
 * real-symmetric only" error; a complex Hermitian eigensolver is
 * deferred to a future phase.
 *
 * All Phase 9A/9B engine states (product, Bell, GHZ, plus any of their
 * reduced ρs from `partialTraceQubits`) produce real-Hermitian density
 * matrices — verified by self-test — so the real-symmetric branch
 * suffices for the current Engine Preview UI. The complex branch only
 * matters once Phase 9C+ introduces SU(2) intertwiner-space states.
 *
 * **Numerical clamps**:
 *   • eigenvalues within `±eps` of 0 are snapped to 0 (PSD noise);
 *   • eigenvalues less than `-eps` throw — they indicate a non-PSD
 *     matrix, not a numerical edge case;
 *   • the `-x · log(x)` term is defined to be 0 at x = 0 by continuity.
 */

import type { Complex } from './complex';
import { abs2 } from './complex';
import type { ComplexMatrix } from './linearAlgebra';

/** Default tolerance for "effectively real Hermitian" detection. */
const DEFAULT_HERMITICITY_EPS = 1e-9;

/* ------------------------------------------------------------------ */
/*  Phase 9A 2×2 closed-form path (kept for backward compat)           */
/* ------------------------------------------------------------------ */

/**
 * Eigenvalue pair of a 2×2 Hermitian matrix. `lambdaMinus ≤ lambdaPlus`
 * by construction.
 */
export interface HermitianEigenvalues {
  lambdaMinus: number;
  lambdaPlus: number;
}

/**
 * Closed-form eigenvalues of a 2×2 Hermitian matrix
 *
 *     M = [[a, b],
 *          [b̄, d]]
 *
 * with `a, d` real and `b` complex. The eigenvalues are
 *
 *     λ± = ( (a+d) ± √((a-d)² + 4|b|²) ) / 2.
 *
 * Defends against:
 *   • non-2×2 input — throws;
 *   • a tiny negative under the square root — clamped to 0;
 *   • a tiny negative eigenvalue (within `eps` of zero) — snapped to 0.
 */
export function eigenvaluesHermitian2x2(
  matrix: ComplexMatrix,
  eps = 1e-12,
): HermitianEigenvalues {
  if (matrix.length !== 2 || matrix[0].length !== 2 || matrix[1].length !== 2) {
    throw new Error('eigenvaluesHermitian2x2: matrix is not 2×2');
  }

  const a = matrix[0][0].re;
  const d = matrix[1][1].re;
  const b = matrix[0][1];

  const trVal = a + d;
  const discriminant = (a - d) * (a - d) + 4 * abs2(b);
  const root = Math.sqrt(Math.max(discriminant, 0));

  let lambdaPlus = (trVal + root) / 2;
  let lambdaMinus = (trVal - root) / 2;

  if (lambdaPlus < 0 && lambdaPlus > -eps) lambdaPlus = 0;
  if (lambdaMinus < 0 && lambdaMinus > -eps) lambdaMinus = 0;

  return { lambdaMinus, lambdaPlus };
}

/* ------------------------------------------------------------------ */
/*  Phase 9C-1 generalised eigensolver (real-symmetric Jacobi)         */
/* ------------------------------------------------------------------ */

/**
 * Detect whether a Hermitian matrix's off-diagonal entries are
 * effectively real (within `eps`). Used to gate the real-symmetric
 * Jacobi eigensolver — a complex Hermitian eigensolver is deferred to
 * a future phase.
 *
 * Checks: each row has length n; each diagonal entry has |im| < eps;
 * each strict upper-triangular entry has |im| < eps and matches the
 * corresponding lower-triangular entry on the real part.
 */
export function isEffectivelyRealHermitian(
  matrix: ComplexMatrix,
  eps = DEFAULT_HERMITICITY_EPS,
): boolean {
  const n = matrix.length;
  if (n === 0) return false;
  for (let i = 0; i < n; i++) {
    if (matrix[i].length !== n) return false;
    if (Math.abs(matrix[i][i].im) > eps) return false;
    for (let j = i + 1; j < n; j++) {
      if (Math.abs(matrix[i][j].im) > eps) return false;
      if (Math.abs(matrix[j][i].im) > eps) return false;
      if (Math.abs(matrix[i][j].re - matrix[j][i].re) > eps) return false;
    }
  }
  return true;
}

/**
 * Project an effectively-real Hermitian matrix onto a real symmetric
 * matrix (real parts only). Throws if the input has significant
 * imaginary components.
 */
export function hermitianToRealSymmetric(
  matrix: ComplexMatrix,
  eps = DEFAULT_HERMITICITY_EPS,
): number[][] {
  if (!isEffectivelyRealHermitian(matrix, eps)) {
    throw new Error(
      'hermitianToRealSymmetric: matrix has significant complex components',
    );
  }
  const n = matrix.length;
  const out: number[][] = [];
  for (let i = 0; i < n; i++) {
    const row: number[] = [];
    for (let j = 0; j < n; j++) row.push(matrix[i][j].re);
    out.push(row);
  }
  return out;
}

/** Optional Jacobi-rotation knobs. Defaults are sized for the small
 *  Hilbert spaces the Phase 9A/9B/9C-1 engine exercises (n ≤ 16). */
export interface JacobiOptions {
  /** Maximum total rotation iterations. Default `100 * n²`. */
  maxIterations?: number;
  /** Off-diagonal absolute-value convergence threshold. Default `1e-12`. */
  tolerance?: number;
}

/* ------------------------------------------------------------------ */
/*  Phase 9D-2-a eigendecomposition types                              */
/* ------------------------------------------------------------------ */

/**
 * Real-symmetric eigendecomposition produced by
 * `eigendecompositionRealSymmetricJacobi`.
 *
 * **Convention (fixed for the engine):**
 *   • `eigenvalues` — descending order, length `n`.
 *   • `eigenvectors` — `n × n` matrix whose **columns** are the
 *     eigenvectors in the input basis. Column `k` corresponds to
 *     eigenvalue `eigenvalues[k]`. Concretely
 *     `eigenvectors[row][col] = ⟨e_row | v_col⟩` where `{|e_row⟩}` is
 *     the input basis. Eigenvalues and columns are sorted together so
 *     the column ordering matches the descending eigenvalue ordering.
 *
 * The matrix is typed as `ComplexMatrix` for uniformity with the rest
 * of the engine, but every entry has `im = 0` (real symmetric →
 * real-orthogonal eigenvector matrix).
 */
export interface RealSymmetricEigendecomposition {
  eigenvalues: number[];
  eigenvectors: ComplexMatrix;
}

/**
 * Hermitian eigendecomposition produced by `eigendecompositionHermitian`.
 *
 * Same column / descending-eigenvalue convention as
 * `RealSymmetricEigendecomposition`. Entries may in principle be
 * complex, but Phase 9D-2-a's dispatcher only handles
 * effectively-real-Hermitian input — the resulting matrix's entries
 * therefore carry `im = 0`. A complex Hermitian eigendecomposition
 * (Householder + complex QR, or complex Jacobi) is deferred to a
 * future phase.
 */
export interface HermitianEigendecomposition {
  eigenvalues: number[];
  eigenvectors: ComplexMatrix;
}

/* ------------------------------------------------------------------ */
/*  Phase 9D-2-a eigendecomposition (Jacobi with V accumulation)       */
/* ------------------------------------------------------------------ */

/** Pack a real `n × n` matrix into a `ComplexMatrix` with `im = 0`.
 *  Local helper for the Jacobi eigendecomposition's return value. */
function realMatrixToComplex(m: readonly (readonly number[])[]): Complex[][] {
  return m.map((row) => row.map((re) => ({ re, im: 0 })));
}

/**
 * Eigendecomposition of a real symmetric `n × n` matrix via the same
 * cyclic-by-largest-pivot Jacobi rotation algorithm as
 * `eigenvaluesRealSymmetricJacobi`, with the rotation matrix `V`
 * accumulated alongside the diagonalisation:
 *
 *   • Initialise `V = I_n`.
 *   • At each rotation in plane `(p, q)` with angle `θ` such that
 *     `tan(2θ) = 2 a[p][q] / (a[p][p] - a[q][q])`, compute the same
 *     `(c, s)` pair the eigenvalue solver uses, then update both
 *
 *         A ← Gᵀ A G       (bilateral similarity, same as before)
 *         V ← V G          (right-multiply: column updates only)
 *
 *     where `G` is the Givens rotation acting in the `(p, q)` plane.
 *   • At convergence, `A → diag(λ_0, …, λ_{n−1})` and the columns of
 *     `V` are the corresponding eigenvectors. Then sort eigenvalues
 *     descending and reorder `V`'s columns to match.
 *
 * Returns `{eigenvalues, eigenvectors}` per the convention pinned in
 * the `RealSymmetricEigendecomposition` doc-comment. Pure TS, no new
 * dependency.
 *
 * The eigenvalue list this function returns is **byte-identical** to
 * the (delegating) `eigenvaluesRealSymmetricJacobi` — the algorithm,
 * pivot search, rotation formula, and iteration cap are all unchanged
 * from Phase 9C-1; only the additional `V` accumulation and the
 * eigenvector return are new.
 */
export function eigendecompositionRealSymmetricJacobi(
  matrix: number[][],
  options: JacobiOptions = {},
): RealSymmetricEigendecomposition {
  const n = matrix.length;
  if (n === 0) {
    return { eigenvalues: [], eigenvectors: [] };
  }
  for (let i = 0; i < n; i++) {
    if (matrix[i].length !== n) {
      throw new Error(
        `eigendecompositionRealSymmetricJacobi: matrix is not square ` +
          `(row ${i} has length ${matrix[i].length})`,
      );
    }
  }
  if (n === 1) {
    return {
      eigenvalues: [matrix[0][0]],
      eigenvectors: [[{ re: 1, im: 0 }]],
    };
  }

  const tolerance = options.tolerance ?? 1e-12;
  const maxIterations = options.maxIterations ?? 100 * n * n;

  // Mutable working copy of A. Jacobi mutates rows/columns; we never
  // touch the input.
  const a: number[][] = matrix.map((row) => row.slice());

  // Eigenvector matrix V, initialised to the identity. Updated by
  // right-multiplication V ← V G on each rotation, so V's columns
  // collect into the eigenvectors of the input matrix.
  const v: number[][] = [];
  for (let i = 0; i < n; i++) {
    const row = new Array<number>(n).fill(0);
    row[i] = 1;
    v.push(row);
  }

  for (let iter = 0; iter < maxIterations; iter++) {
    // Pivot: largest |a[i][j]| in the strict upper triangle.
    let maxVal = 0;
    let p = 0;
    let q = 1;
    for (let i = 0; i < n; i++) {
      for (let j = i + 1; j < n; j++) {
        const val = Math.abs(a[i][j]);
        if (val > maxVal) {
          maxVal = val;
          p = i;
          q = j;
        }
      }
    }

    if (maxVal < tolerance) {
      break; // Converged.
    }

    // Jacobi rotation angle. Same formula as Phase 9C-1.
    const apq = a[p][q];
    const diff = a[q][q] - a[p][p];
    let t: number;
    if (Math.abs(diff) < Number.EPSILON) {
      // a[p][p] === a[q][q]: τ = 0 ⇒ t = ±1; sign matches apq so the
      // rotation zeros a[p][q].
      t = apq >= 0 ? 1 : -1;
    } else {
      const tau = diff / (2 * apq);
      // Choose the smaller-magnitude root for numerical stability.
      if (tau >= 0) {
        t = 1 / (tau + Math.sqrt(1 + tau * tau));
      } else {
        t = 1 / (tau - Math.sqrt(1 + tau * tau));
      }
    }
    const c = 1 / Math.sqrt(1 + t * t);
    const s = t * c;

    // Apply rotation to A's (p, q) diagonal/off-diagonal block.
    a[p][p] = a[p][p] - t * apq;
    a[q][q] = a[q][q] + t * apq;
    a[p][q] = 0;
    a[q][p] = 0;

    // Apply rotation to A's rows / columns p, q for every other index.
    for (let i = 0; i < n; i++) {
      if (i === p || i === q) continue;
      const aip = a[i][p];
      const aiq = a[i][q];
      a[i][p] = c * aip - s * aiq;
      a[i][q] = s * aip + c * aiq;
      a[p][i] = a[i][p];
      a[q][i] = a[i][q];
    }

    // Accumulate the rotation into V. The Givens matrix G acts in
    // the (p, q) plane; right-multiplying V by G updates V's columns
    // p and q for every row:
    //   V[i][p]_new = c · V[i][p] − s · V[i][q]
    //   V[i][q]_new = s · V[i][p] + c · V[i][q]
    for (let i = 0; i < n; i++) {
      const vip = v[i][p];
      const viq = v[i][q];
      v[i][p] = c * vip - s * viq;
      v[i][q] = s * vip + c * viq;
    }
  }

  // Read eigenvalues from the (now-diagonal) A; reorder eigenvalues
  // and eigenvector columns together by descending eigenvalue.
  const rawEigenvalues: number[] = [];
  for (let i = 0; i < n; i++) rawEigenvalues.push(a[i][i]);
  const order = Array.from({ length: n }, (_, i) => i);
  order.sort((i, j) => rawEigenvalues[j]! - rawEigenvalues[i]!);

  const sortedEigenvalues: number[] = [];
  const sortedV: number[][] = [];
  for (let i = 0; i < n; i++) sortedV.push(new Array<number>(n).fill(0));
  for (let k = 0; k < n; k++) {
    sortedEigenvalues.push(rawEigenvalues[order[k]!]!);
    // Original column `order[k]` becomes new column `k`.
    for (let i = 0; i < n; i++) {
      sortedV[i]![k] = v[i]![order[k]!]!;
    }
  }

  return {
    eigenvalues: sortedEigenvalues,
    eigenvectors: realMatrixToComplex(sortedV),
  };
}

/**
 * Eigenvalues of a real symmetric `n × n` matrix in descending order.
 *
 * Phase 9D-2-a refactors this to delegate to
 * `eigendecompositionRealSymmetricJacobi` and return only the
 * `eigenvalues` field. The Phase 9C-1 algorithm is preserved verbatim
 * (same rotation formula, same pivot search, same iteration cap), so
 * existing eigenvalue results are byte-identical to what they were
 * before this phase.
 *
 * Public-API behaviour is unchanged — all existing callers
 * (`eigenvaluesHermitian` for n ≥ 3, the Phase 9C-1 selftest's direct
 * Bell-shaped 4×4 check, `vonNeumannEntropy`, etc.) keep their
 * outputs byte-for-byte.
 */
export function eigenvaluesRealSymmetricJacobi(
  matrix: number[][],
  options: JacobiOptions = {},
): number[] {
  return eigendecompositionRealSymmetricJacobi(matrix, options).eigenvalues;
}

/**
 * Eigenvalues of a Hermitian matrix of any size, returned in
 * descending order.
 *
 *   • n = 0 — returns `[]`.
 *   • n = 1 — returns `[matrix[0][0].re]` (with a Hermiticity guard).
 *   • n = 2 — closed-form via `eigenvaluesHermitian2x2`.
 *   • n ≥ 3 — real-symmetric Jacobi via
 *     `eigenvaluesRealSymmetricJacobi`. Throws if the matrix has
 *     significant complex off-diagonal entries (Phase 9C-1 deferral).
 *
 * The 2×2 path keeps the closed-form analytic eigenvalues exact
 * (slightly faster, slightly more precise) and preserves backward
 * compatibility with Phase 9A code paths that still call
 * `eigenvaluesHermitian2x2` directly.
 */
export function eigenvaluesHermitian(
  matrix: ComplexMatrix,
  eps = DEFAULT_HERMITICITY_EPS,
): number[] {
  const n = matrix.length;
  if (n === 0) return [];
  if (n === 1) {
    if (Math.abs(matrix[0][0].im) > eps) {
      throw new Error(
        'eigenvaluesHermitian: 1×1 matrix has significant non-real diagonal',
      );
    }
    return [matrix[0][0].re];
  }
  if (n === 2) {
    const { lambdaMinus, lambdaPlus } = eigenvaluesHermitian2x2(matrix, eps);
    return [lambdaPlus, lambdaMinus]; // descending
  }
  if (!isEffectivelyRealHermitian(matrix, eps)) {
    throw new Error(
      `eigenvaluesHermitian: ${n}×${n} matrix has significant complex ` +
        `off-diagonal entries; Phase 9C-1 supports real-symmetric ` +
        `Hermitian only via Jacobi. A complex Hermitian eigensolver is ` +
        `deferred to a future phase.`,
    );
  }
  const real = hermitianToRealSymmetric(matrix, eps);
  return eigenvaluesRealSymmetricJacobi(real);
}

/**
 * Eigendecomposition of a Hermitian matrix, returning eigenvalues
 * (descending) **and** eigenvectors (as columns) in the input basis.
 *
 * Dispatcher behaviour (Phase 9D-2-a):
 *   • `n = 0` — returns `{eigenvalues: [], eigenvectors: []}`.
 *   • `n = 1` — returns the lone real diagonal entry and the trivial
 *     `[[1+0i]]` eigenvector matrix (with a Hermiticity guard).
 *   • `n ≥ 2` — requires the matrix to be **effectively real
 *     Hermitian** (off-diagonal imaginary parts within `eps`); the
 *     Jacobi-with-V eigendecomposition is then run on the real part
 *     via `hermitianToRealSymmetric` + `eigendecompositionRealSymmetricJacobi`.
 *     Throws on significant complex off-diagonals.
 *
 * **This dispatcher is narrower than `eigenvaluesHermitian`.** The
 * eigenvalue dispatcher has an analytic 2×2 path that handles complex
 * Hermitian off-diagonals (Phase 9A's `eigenvaluesHermitian2x2`), but
 * it does not produce eigenvectors. Phase 9D-2-a's eigendecomposition
 * deliberately routes every `n ≥ 2` case through the real-symmetric
 * Jacobi solver — the analytic 2×2 eigenvector formulas are not
 * implemented (and would not extend to n ≥ 3 anyway). Extending the
 * eigendecomposition to true complex Hermitian (Householder + complex
 * QR, or complex Jacobi) belongs to a future phase and must stay
 * dependency-free pure TS to preserve the engine's no-new-deps rule.
 */
export function eigendecompositionHermitian(
  matrix: ComplexMatrix,
  eps = DEFAULT_HERMITICITY_EPS,
): HermitianEigendecomposition {
  const n = matrix.length;
  if (n === 0) {
    return { eigenvalues: [], eigenvectors: [] };
  }
  if (n === 1) {
    if (Math.abs(matrix[0][0].im) > eps) {
      throw new Error(
        'eigendecompositionHermitian: 1×1 matrix has significant non-real diagonal',
      );
    }
    return {
      eigenvalues: [matrix[0][0].re],
      eigenvectors: [[{ re: 1, im: 0 }]],
    };
  }
  if (!isEffectivelyRealHermitian(matrix, eps)) {
    throw new Error(
      `eigendecompositionHermitian: ${n}×${n} matrix has significant complex ` +
        `off-diagonal entries; Phase 9D-2-a supports effectively-real ` +
        `Hermitian only via Jacobi. A complex Hermitian eigendecomposition ` +
        `(Householder + complex QR, or complex Jacobi) is deferred to a ` +
        `future phase.`,
    );
  }
  const real = hermitianToRealSymmetric(matrix, eps);
  return eigendecompositionRealSymmetricJacobi(real);
}

/* ------------------------------------------------------------------ */
/*  Generalised von Neumann entropy                                    */
/* ------------------------------------------------------------------ */

/**
 * Von Neumann entropy S(ρ) = -Tr(ρ log ρ) = -Σᵢ λᵢ log λᵢ for a
 * Hermitian density matrix ρ of any finite size. Phase 9C-1
 * generalises the Phase 9A 2×2-only implementation via the new
 * `eigenvaluesHermitian` dispatcher.
 *
 * `base` defaults to e (entropy in nats); pass `2` for bits.
 *
 * Numerical convention:
 *   • eigenvalues within `±eps` of 0 contribute 0 (continuity);
 *   • eigenvalues below `-eps` throw — the input is not PSD;
 *   • the `0·log 0 = 0` rule is implemented explicitly.
 */
export function vonNeumannEntropy(
  rho: ComplexMatrix,
  base: number = Math.E,
  eps = 1e-12,
): number {
  if (base <= 0 || base === 1 || !Number.isFinite(base)) {
    throw new Error(
      `vonNeumannEntropy: base must be a positive finite number ≠ 1 (got ${base})`,
    );
  }
  const n = rho.length;
  if (n === 0) return 0;

  // Use a slightly looser tolerance for Hermiticity than for the
  // entropy clamp itself — `partialTraceQubits` outputs occasionally
  // carry float noise at ~1e-16 in off-diagonals.
  const hermiticityEps = Math.max(eps, DEFAULT_HERMITICITY_EPS);
  const eigenvalues = eigenvaluesHermitian(rho, hermiticityEps);

  const logFn =
    base === Math.E ? Math.log : (x: number) => Math.log(x) / Math.log(base);

  let entropy = 0;
  for (const lambdaRaw of eigenvalues) {
    let lambda = lambdaRaw;
    if (lambda < 0) {
      if (lambda > -eps) {
        lambda = 0;
      } else {
        throw new Error(
          `vonNeumannEntropy: significantly negative eigenvalue ${lambda}; ` +
            `matrix is not positive semi-definite`,
        );
      }
    }
    if (lambda > eps) {
      entropy += -lambda * logFn(lambda);
    }
    // 0 · log 0 = 0 by continuity.
  }
  return entropy;
}

/* ------------------------------------------------------------------ */
/*  Binary entropy (unchanged from Phase 9A)                           */
/* ------------------------------------------------------------------ */

/**
 * Binary entropy H(p) = -p log p - (1-p) log (1-p). Defined for
 * p ∈ [0, 1]; boundary points return 0 (continuous extension). Used
 * as an independent cross-check (Bell-state S = H(1/2) = log 2).
 */
export function binaryEntropy(p: number, base: number = Math.E): number {
  if (p < 0 || p > 1) {
    throw new Error(`binaryEntropy: p must be in [0, 1] (got ${p})`);
  }
  if (p === 0 || p === 1) return 0;
  const logFn =
    base === Math.E ? Math.log : (x: number) => Math.log(x) / Math.log(base);
  return -p * logFn(p) - (1 - p) * logFn(1 - p);
}
