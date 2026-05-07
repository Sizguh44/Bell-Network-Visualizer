/**
 * Phase 9C-3 — minimal SU(2) spin-j representation building blocks.
 *
 * Pure TypeScript. No React, no DOM, no i18n. No new npm dependency.
 *
 * What this module provides:
 *
 *   • `validateSpinJ(j)` — guard for legal SU(2) representation labels
 *     (j ≥ 0, 2j integer, finite).
 *   • `spinDimension(j)` = 2j + 1.
 *   • `magneticNumbers(j)` — the canonical descending-m ordering
 *     `[j, j−1, …, −j]`. **This convention is fixed for the whole
 *     engine**: every spin matrix below is laid out in this basis, so
 *     row 0 / column 0 always corresponds to the highest-weight state
 *     `|j, +j⟩` and the last row / column to `|j, −j⟩`.
 *   • `spinJPlus(j)` / `spinJMinus(j)` — raising / lowering operators
 *     in the descending-m basis.
 *   • `spinJX(j)` / `spinJY(j)` / `spinJZ(j)` — Cartesian generators.
 *   • `spinCasimir(j)` — `J² = JxJx + JyJy + JzJz`. Numerically
 *     equal to `j(j+1) · I_{2j+1}` within floating-point tolerance.
 *   • `buildSpinJRepresentation(j)` — bundle helper that returns the
 *     full set in one struct, useful for downstream code that wants
 *     a single computed-once handle.
 *
 * **Honesty discipline.** This is an SU(2) **representation-theory
 * building block** — pure Lie-algebra arithmetic on a single irrep of
 * dimension `2j + 1`. It is **not yet** an LQG spin-network node, **not
 * yet** an intertwiner basis, **not yet** a Bell-network state, and the
 * outputs do **not** correspond to area / volume / dihedral-angle
 * expectation values. Phase 9D will introduce the first intertwiner-
 * groundwork module on top of this layer (3- and 4-valent node closure
 * intuition, SU(2)-invariant subspace construction); LQG-level claims
 * stay on the future-phase side until that lands.
 *
 * ----------------------------------------------------------------------
 * Conventions (fixed for the engine — read this before extending):
 *
 *   Basis order:
 *     |j, m⟩ with m descending. For j = ½, the basis is
 *     [|½, +½⟩, |½, −½⟩]; for j = 1, it is [|1, +1⟩, |1, 0⟩, |1, −1⟩].
 *     Index `idx` ↔ magnetic number `m = j − idx`.
 *
 *   Matrix convention:
 *     Columns = input basis state, rows = output basis state. So
 *     `M[r][c]` is the amplitude `⟨j, m_r | M | j, m_c⟩`.
 *
 *   Raising/lowering action:
 *     J+ |j, m⟩ = √((j − m)(j + m + 1)) · |j, m + 1⟩
 *     J− |j, m⟩ = √((j + m)(j − m + 1)) · |j, m − 1⟩
 *
 *   Cartesian generators:
 *     Jx = (J+ + J−) / 2
 *     Jy = (J+ − J−) / (2i)        (note: 1/(2i) = −i/2)
 *     Jz |j, m⟩ = m · |j, m⟩       (diagonal in the descending-m basis)
 *
 *   Casimir:
 *     J² = Jx² + Jy² + Jz² = j(j + 1) · I_{2j+1}
 *     (verified by selftest within floating-point tolerance).
 *
 *   Hermiticity:
 *     Jx, Jy, Jz are Hermitian; (J+)† = J−.
 *
 * ----------------------------------------------------------------------
 */

import type { Complex } from './complex';
import { ZERO, complex } from './complex';
import type { ComplexMatrix } from './linearAlgebra';
import {
  addMatrices,
  matMul,
  scaleMatrix,
  zeroMatrix,
} from './linearAlgebra';

/**
 * The SU(2) representation label. Legal values are non-negative real
 * numbers `j` such that `2j ∈ ℤ` (so `j ∈ {0, ½, 1, 3⁄2, 2, …}`).
 *
 * The type alias is `number` rather than a closed union because the
 * engine's small Hilbert spaces never reach a hard ceiling — the
 * runtime guard `validateSpinJ` is what enforces legality.
 */
export type SpinJ = number;

/**
 * Bundle of spin-j building blocks for one irreducible representation.
 *
 * Every matrix is `dimension × dimension` and laid out in the
 * descending-m basis pinned in the module header. Carrying the full
 * set in a single struct lets downstream code (Phase 9D intertwiner
 * groundwork) compute it once and reuse it.
 */
export interface SpinJRepresentation {
  /** The representation label (non-negative half-integer). */
  j: SpinJ;
  /** Hilbert-space dimension `2j + 1`. */
  dimension: number;
  /** Magnetic numbers in descending order, length `dimension`. */
  magneticNumbers: number[];
  /** Raising operator J+. */
  jPlus: ComplexMatrix;
  /** Lowering operator J−. */
  jMinus: ComplexMatrix;
  /** Cartesian generator Jx = (J+ + J−)/2. */
  jX: ComplexMatrix;
  /** Cartesian generator Jy = (J+ − J−)/(2i). */
  jY: ComplexMatrix;
  /** Cartesian generator Jz, diagonal in the descending-m basis. */
  jZ: ComplexMatrix;
  /** Casimir J² = Jx² + Jy² + Jz², equal to j(j+1)·I within tolerance. */
  casimir: ComplexMatrix;
}

/**
 * Validate a candidate spin label `j`. Throws on:
 *   • non-finite values (NaN, ±∞);
 *   • negative values;
 *   • values where `2j` is not an integer (e.g. 0.3).
 *
 * The `2j ∈ ℤ` check uses `Number.isInteger(2 * j)` rather than a
 * float-tolerance comparison — half-integers like 0.5, 1.5, 2.5 hit
 * the IEEE-754 representable set exactly when doubled, so an exact
 * test is correct. Larger half-integers (e.g. j = 100.5) also hit
 * exact representation.
 */
export function validateSpinJ(j: number): void {
  if (!Number.isFinite(j)) {
    throw new Error(`validateSpinJ: j must be finite (got ${j})`);
  }
  if (j < 0) {
    throw new Error(`validateSpinJ: j must be non-negative (got ${j})`);
  }
  if (!Number.isInteger(2 * j)) {
    throw new Error(
      `validateSpinJ: 2j must be an integer (got 2j = ${2 * j}, j = ${j})`,
    );
  }
}

/**
 * Hilbert-space dimension of the spin-j representation: `2j + 1`. The
 * round-trip through `Math.round` defends against the harmless drift
 * that can arise for very large half-integers (`2 * 1.5 + 1` is
 * exactly 4 in IEEE-754, but it is good practice to round when the
 * caller will use the result as an array length).
 */
export function spinDimension(j: SpinJ): number {
  validateSpinJ(j);
  return Math.round(2 * j + 1);
}

/**
 * Magnetic quantum numbers for spin-j in the canonical descending-m
 * order `[j, j−1, …, −j]`. Length is `2j + 1`. Returned as a fresh
 * array so callers can mutate without surprising the engine.
 */
export function magneticNumbers(j: SpinJ): number[] {
  const dim = spinDimension(j);
  const out: number[] = [];
  for (let idx = 0; idx < dim; idx++) {
    // m = j − idx, descending.
    out.push(j - idx);
  }
  return out;
}

/**
 * Raising operator J+ in the descending-m basis.
 *
 * `J+ |j, m⟩ = √((j − m)(j + m + 1)) · |j, m+1⟩`
 *
 * In the descending basis (idx 0 = m = +j; idx dim−1 = m = −j), the
 * input column index is `c = j − m` and the output row index is
 * `r = j − (m + 1) = c − 1`. So the only non-zero entries of J+ sit on
 * the **first super-diagonal** (`r = c − 1`); the bottom row (m = +j
 * cannot be raised) and the top row's first column (m = −j only fills
 * row 1, not row 0) are zero.
 */
export function spinJPlus(j: SpinJ): Complex[][] {
  const dim = spinDimension(j);
  const m = magneticNumbers(j);
  const out = zeroMatrix(dim, dim);
  // Iterate over input columns. For each input m_c, write the raised
  // amplitude into row r = c − 1 if it exists.
  for (let c = 0; c < dim; c++) {
    const mc = m[c]!;
    const r = c - 1;
    if (r < 0) continue; // m_c = +j cannot be raised
    const coeff = Math.sqrt((j - mc) * (j + mc + 1));
    out[r]![c] = complex(coeff, 0);
  }
  return out;
}

/**
 * Lowering operator J− in the descending-m basis.
 *
 * `J− |j, m⟩ = √((j + m)(j − m + 1)) · |j, m−1⟩`
 *
 * In the descending basis, output row index is `r = c + 1`. So the
 * only non-zero entries of J− sit on the **first sub-diagonal**
 * (`r = c + 1`); the top row (m = −j cannot be lowered) is zero.
 */
export function spinJMinus(j: SpinJ): Complex[][] {
  const dim = spinDimension(j);
  const m = magneticNumbers(j);
  const out = zeroMatrix(dim, dim);
  for (let c = 0; c < dim; c++) {
    const mc = m[c]!;
    const r = c + 1;
    if (r >= dim) continue; // m_c = −j cannot be lowered
    const coeff = Math.sqrt((j + mc) * (j - mc + 1));
    out[r]![c] = complex(coeff, 0);
  }
  return out;
}

/**
 * Diagonal Jz operator in the descending-m basis: `Jz[i][i] = m_i`.
 * Off-diagonal entries are zero.
 */
export function spinJZ(j: SpinJ): Complex[][] {
  const dim = spinDimension(j);
  const m = magneticNumbers(j);
  const out = zeroMatrix(dim, dim);
  for (let i = 0; i < dim; i++) {
    out[i]![i] = complex(m[i]!, 0);
  }
  return out;
}

/**
 * Cartesian Jx = (J+ + J−) / 2. Real-symmetric in the descending-m
 * basis (the spec test for j = 1/2 verifies Jx = (1/2) σx).
 */
export function spinJX(j: SpinJ): Complex[][] {
  const jp = spinJPlus(j);
  const jm = spinJMinus(j);
  // (J+ + J−) / 2 = scaleMatrix(addMatrices(J+, J−), 1/2)
  const sum = addMatrices(jp, jm);
  return scaleMatrix(sum, complex(0.5, 0));
}

/**
 * Cartesian Jy = (J+ − J−) / (2i).
 *
 * `1 / (2i) = −i / 2`, so we compute J+ − J− = J+ + (−1)·J− and
 * multiply by the complex scalar `(0, −1/2)` (= −i/2). For j = 1/2
 * this returns (1/2)·σy = `[[0, −i/2], [i/2, 0]]`.
 */
export function spinJY(j: SpinJ): Complex[][] {
  const jp = spinJPlus(j);
  const jm = spinJMinus(j);
  // J+ − J− via scaleMatrix(_, −1) + addMatrices.
  const negJm = scaleMatrix(jm, complex(-1, 0));
  const diff = addMatrices(jp, negJm);
  // Multiply by 1/(2i) = (0, −1/2).
  return scaleMatrix(diff, complex(0, -0.5));
}

/**
 * Casimir operator J² = JxJx + JyJy + JzJz.
 *
 * For the spin-j irrep, the textbook result is
 * `J² = j(j+1) · I_{2j+1}`. The selftest verifies this within
 * floating-point tolerance for j = 1/2 (J² = (3/4) I) and j = 1
 * (J² = 2 I). The selftest does **not** hardcode the result —
 * `j(j+1)·I` is derived inside the test from the `j` input, so this
 * function's output is genuinely the matrix sum, not a shortcut.
 */
export function spinCasimir(j: SpinJ): Complex[][] {
  const jx = spinJX(j);
  const jy = spinJY(j);
  const jz = spinJZ(j);
  // Build JxJx, JyJy, JzJz, then sum.
  const jxjx = matMul(jx, jx);
  const jyjy = matMul(jy, jy);
  const jzjz = matMul(jz, jz);
  return addMatrices(addMatrices(jxjx, jyjy), jzjz);
}

/**
 * Build the full spin-j representation in one call. The caller gets
 * `j`, `dimension`, `magneticNumbers`, all five generators (J+, J−,
 * Jx, Jy, Jz), and the Casimir bundled in a single struct. Useful for
 * downstream code (Phase 9D intertwiner groundwork) that wants a
 * computed-once handle rather than re-deriving each operator.
 *
 * Returns frozen-shape but mutable `ComplexMatrix` references through
 * the readonly type — that is the same convention every other
 * `linearAlgebra` builder follows in this engine. Callers that need a
 * deep copy should clone explicitly.
 */
export function buildSpinJRepresentation(j: SpinJ): SpinJRepresentation {
  validateSpinJ(j);
  const dim = spinDimension(j);
  const m = magneticNumbers(j);
  const jp = spinJPlus(j);
  const jm = spinJMinus(j);
  const jx = spinJX(j);
  const jy = spinJY(j);
  const jz = spinJZ(j);
  const cas = spinCasimir(j);
  // Quick post-condition guard against a programmer error in the
  // builders — every generator must come back square `dim × dim`.
  // ZERO import is purely so this file pulls something from `complex`
  // that the type system can keep an eye on at build time.
  void ZERO;
  for (const [name, mat] of [
    ['jPlus', jp],
    ['jMinus', jm],
    ['jX', jx],
    ['jY', jy],
    ['jZ', jz],
    ['casimir', cas],
  ] as const) {
    if (mat.length !== dim) {
      throw new Error(
        `buildSpinJRepresentation: ${name} has ${mat.length} rows, expected ${dim}`,
      );
    }
    for (let i = 0; i < dim; i++) {
      if (mat[i]!.length !== dim) {
        throw new Error(
          `buildSpinJRepresentation: ${name} row ${i} has length ${mat[i]!.length}, expected ${dim}`,
        );
      }
    }
  }
  return {
    j,
    dimension: dim,
    magneticNumbers: m,
    jPlus: jp,
    jMinus: jm,
    jX: jx,
    jY: jy,
    jZ: jz,
    casimir: cas,
  };
}
