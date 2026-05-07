/**
 * Phase 9C-2 — pairwise qubit mutual-information matrix.
 *
 * Pure TypeScript. No React, no DOM, no i18n. Builds an `n × n` matrix
 * of `I(Qᵢ : Qⱼ)` values for a normalised pure state on `n` qubits, by
 * delegating each off-diagonal cell to the Phase 9C-1 general subsystem
 * helper `mutualInformationQubitSubsystems(ket, n, [i], [j])`. The
 * diagonal carries the literal `'diagonal'` status (a qubit's MI with
 * itself is undefined / trivially equal to its own entropy and is
 * rendered as an em-dash in the UI).
 *
 * The returned matrix is **symmetric**: only the strict upper triangle
 * is computed, then mirrored into the strict lower triangle so each
 * I(A:B) is computed exactly once. This keeps the cost at `O(n²/2)`
 * subsystem-MI calls instead of `O(n²)`, and guarantees `cells[i][j]`
 * and `cells[j][i]` agree byte-for-byte.
 *
 * `maxComputedBits` is the maximum of `mutualInformationBits` across
 * all `'computed'` cells (or `0` if no cell is computed). The UI uses
 * this to scale heatmap intensity into `[0, 1]`. The normalisation is a
 * **visual display choice**, not a new physics score; engine outputs
 * (the bits values themselves) are untouched.
 *
 * **Honesty discipline.** Every cell value is *exact within the minimal
 * qubit model* — the same register as Phase 9C-1's
 * `mutualInformationQubitSubsystems`. It is **not** an SU(2)
 * intertwiner-space mutual information, **not** an LQG correlator, and
 * **not** a geometric-operator expectation value. UI surfaces that
 * render this matrix MUST keep the "minimal qubit model" caveat
 * visible.
 *
 * Upgrade path: when Phase 9C-2's complex Hermitian eigensolver lands
 * (or when Phase 9D introduces SU(2) state-space states), this helper
 * needs no signature change — it dispatches through
 * `mutualInformationQubitSubsystems`, which already returns
 * `'unsupported'` with a typed reason if a reduced ρ has significant
 * complex Hermitian off-diagonals. Such cells stay legible in the
 * matrix as `'unsupported'` instead of corrupting the whole heatmap.
 */

import type { ComplexVector } from './linearAlgebra';
import {
  mutualInformationQubitSubsystems,
  type MutualInformationResult,
} from './mutualInformation';

/**
 * Single cell of the pairwise mutual-information matrix.
 *
 * - `status: 'diagonal'` — the diagonal entry `(i, i)`. No values.
 * - `status: 'computed'` — successfully computed via the general
 *   subsystem helper. Carries `mutualInformationNat` and
 *   `mutualInformationBits`.
 * - `status: 'unsupported'` — the underlying helper refused (for
 *   example because a reduced ρ had significant complex Hermitian
 *   off-diagonals). Carries an opaque `reason` string mirroring the
 *   helper's discriminated union; the UI renders this as an "n/a"
 *   pill rather than a numeric value.
 */
export type PairwiseMutualInformationCell =
  | { row: number; col: number; status: 'diagonal' }
  | {
      row: number;
      col: number;
      status: 'computed';
      mutualInformationNat: number;
      mutualInformationBits: number;
    }
  | {
      row: number;
      col: number;
      status: 'unsupported';
      reason: string;
    };

/**
 * Square matrix of pairwise mutual-information cells plus the maximum
 * computed-bits value across the whole matrix (used by the UI heatmap
 * to scale intensity into `[0, 1]`).
 */
export interface PairwiseMutualInformationMatrix {
  /** Number of qubits. Equal to `cells.length` and to every row's length. */
  numQubits: number;
  /** Row-major `n × n` cells, indexed as `cells[row][col]`. Symmetric. */
  cells: PairwiseMutualInformationCell[][];
  /** `max(c.mutualInformationBits)` over all computed cells, or `0`. */
  maxComputedBits: number;
}

/**
 * Compute the full pairwise qubit mutual-information matrix for a
 * normalised pure state on `numQubits` qubits.
 *
 * Throws on validation errors (bad ket length, unnormalised input) via
 * the underlying `mutualInformationQubitSubsystems` calls. Each
 * unsupported cell is captured as a typed cell rather than thrown so
 * the matrix stays renderable even if (in some future SU(2) state) a
 * subset of pairs hits the complex-Hermitian path.
 */
export function computePairwiseMutualInformationMatrix(
  ket: ComplexVector,
  numQubits: number,
): PairwiseMutualInformationMatrix {
  if (!Number.isInteger(numQubits) || numQubits < 1) {
    throw new Error(
      `computePairwiseMutualInformationMatrix: numQubits must be a positive ` +
        `integer (got ${numQubits})`,
    );
  }
  const expectedDim = 2 ** numQubits;
  if (ket.length !== expectedDim) {
    throw new Error(
      `computePairwiseMutualInformationMatrix: ket length ${ket.length} does ` +
        `not match 2^${numQubits} = ${expectedDim}`,
    );
  }

  // Allocate the n×n grid with diagonal cells in place. Off-diagonals
  // are filled in a second pass so the iteration order is explicit.
  const cells: PairwiseMutualInformationCell[][] = [];
  for (let i = 0; i < numQubits; i++) {
    const row: PairwiseMutualInformationCell[] = [];
    for (let j = 0; j < numQubits; j++) {
      if (i === j) {
        row.push({ row: i, col: j, status: 'diagonal' });
      } else {
        // Placeholder — overwritten below. Cast through `unknown` to
        // avoid declaring a fourth `'pending'` variant just for the
        // micro-window between allocation and fill.
        row.push({ row: i, col: j, status: 'diagonal' } as PairwiseMutualInformationCell);
      }
    }
    cells.push(row);
  }

  let maxComputedBits = 0;

  // Strict upper triangle only — mirror into the lower triangle.
  for (let i = 0; i < numQubits; i++) {
    for (let j = i + 1; j < numQubits; j++) {
      const result: MutualInformationResult = mutualInformationQubitSubsystems(
        ket,
        numQubits,
        [i],
        [j],
      );

      let upper: PairwiseMutualInformationCell;
      let lower: PairwiseMutualInformationCell;
      if (result.status === 'computed') {
        upper = {
          row: i,
          col: j,
          status: 'computed',
          mutualInformationNat: result.mutualInformationNat,
          mutualInformationBits: result.mutualInformationBits,
        };
        lower = {
          row: j,
          col: i,
          status: 'computed',
          mutualInformationNat: result.mutualInformationNat,
          mutualInformationBits: result.mutualInformationBits,
        };
        if (result.mutualInformationBits > maxComputedBits) {
          maxComputedBits = result.mutualInformationBits;
        }
      } else {
        upper = {
          row: i,
          col: j,
          status: 'unsupported',
          reason: result.reason,
        };
        lower = {
          row: j,
          col: i,
          status: 'unsupported',
          reason: result.reason,
        };
      }

      cells[i]![j] = upper;
      cells[j]![i] = lower;
    }
  }

  return { numQubits, cells, maxComputedBits };
}
