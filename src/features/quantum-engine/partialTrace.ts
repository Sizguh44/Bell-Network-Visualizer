/**
 * Phase 9A — partial trace over a subset of qubits.
 *
 * Given a density matrix ρ on `n` qubits (dim 2^n × 2^n) and a list
 * of qubit indices to keep, returns the reduced density matrix on
 * the kept qubits. The traced-out qubits' degrees of freedom are
 * summed over.
 *
 * **Bit-ordering convention** (matches `quantumState.ts`):
 *   qubit 0 is the least-significant bit of the integer index. So
 *   on n qubits, basis state with qubit-bits `[b_0, b_1, …, b_{n-1}]`
 *   maps to integer index `Σ_k b_k · 2^k`.
 *
 * **Algorithm.** For reduced indices `iKeep, jKeep` and traced
 * index `kTrace`, build the full row and column bit arrays:
 *   row_bits[keep[m]]    = bits(iKeep)[m]
 *   row_bits[traceOut[m]]= bits(kTrace)[m]
 *   col_bits[keep[m]]    = bits(jKeep)[m]
 *   col_bits[traceOut[m]]= bits(kTrace)[m]    ← same k on both sides
 * Then `(ρ_keep)_{iKeep,jKeep} = Σ_kTrace ρ[bitsToInt(row_bits)][bitsToInt(col_bits)]`.
 *
 * Output dimension: 2^|keep| × 2^|keep|. Trace is preserved
 * (Tr(ρ_keep) = Tr(ρ) = 1 for normalised input).
 */

import type { Complex } from './complex';
import { ZERO, add } from './complex';
import type { ComplexMatrix } from './linearAlgebra';
import { zeroMatrix } from './linearAlgebra';

/**
 * Decompose a non-negative integer into `numQubits` bits, with bit 0
 * as the least-significant bit. Pure helper, exported for self-tests.
 *
 * Example: `intToBits(5, 3)` → `[1, 0, 1]` (5 = 1·2⁰ + 0·2¹ + 1·2²).
 */
export function intToBits(index: number, numQubits: number): number[] {
  if (!Number.isInteger(index) || index < 0) {
    throw new Error(`intToBits: index must be a non-negative integer (got ${index})`);
  }
  if (!Number.isInteger(numQubits) || numQubits < 0) {
    throw new Error(`intToBits: numQubits must be a non-negative integer (got ${numQubits})`);
  }
  const bits = new Array<number>(numQubits);
  for (let i = 0; i < numQubits; i++) {
    bits[i] = (index >> i) & 1;
  }
  return bits;
}

/**
 * Inverse of `intToBits`. Bit 0 is the least-significant bit of the
 * resulting integer.
 *
 * Example: `bitsToInt([1, 0, 1])` → `5`.
 */
export function bitsToInt(bits: readonly number[]): number {
  let n = 0;
  for (let i = 0; i < bits.length; i++) {
    if (bits[i] !== 0 && bits[i] !== 1) {
      throw new Error(`bitsToInt: bit at index ${i} is not 0 or 1 (got ${bits[i]})`);
    }
    n |= bits[i] << i;
  }
  return n;
}

/**
 * Pick the bits at positions `keepQubits` from a full bit array.
 * Order in the output follows the order in `keepQubits`.
 *
 * Example: `projectBits([1, 0, 1, 0], [0, 2])` → `[1, 1]`.
 */
export function projectBits(
  bits: readonly number[],
  keepQubits: readonly number[],
): number[] {
  return keepQubits.map((q) => {
    if (q < 0 || q >= bits.length) {
      throw new Error(`projectBits: qubit ${q} out of range [0, ${bits.length})`);
    }
    return bits[q];
  });
}

/**
 * Partial trace over the qubits NOT in `keepQubits`.
 *
 * `keepQubits` is deduplicated and sorted ascending so the output is
 * deterministic regardless of the order the caller passes — keep[0]
 * becomes the lowest-significance qubit of the reduced subsystem.
 *
 * Throws if:
 *   • `rho` is not 2^numQubits × 2^numQubits;
 *   • any element of `keepQubits` is out of range;
 *   • `keepQubits` is empty (no qubits to keep — useless reduction).
 *
 * Returns a freshly allocated matrix; the input `rho` is not mutated.
 */
export function partialTraceQubits(
  rho: ComplexMatrix,
  numQubits: number,
  keepQubits: readonly number[],
): Complex[][] {
  if (!Number.isInteger(numQubits) || numQubits < 1) {
    throw new Error(`partialTraceQubits: numQubits must be a positive integer (got ${numQubits})`);
  }

  const fullDim = 2 ** numQubits;
  if (rho.length !== fullDim) {
    throw new Error(
      `partialTraceQubits: ρ has ${rho.length} rows, expected 2^${numQubits} = ${fullDim}`,
    );
  }
  for (let i = 0; i < fullDim; i++) {
    if (rho[i].length !== fullDim) {
      throw new Error(
        `partialTraceQubits: ρ row ${i} has ${rho[i].length} columns, expected ${fullDim}`,
      );
    }
  }

  // Deduplicate + sort ascending so the output basis ordering is
  // deterministic regardless of caller order.
  const keep = Array.from(new Set(keepQubits)).sort((a, b) => a - b);
  if (keep.length === 0) {
    throw new Error('partialTraceQubits: keepQubits cannot be empty');
  }
  for (const q of keep) {
    if (!Number.isInteger(q) || q < 0 || q >= numQubits) {
      throw new Error(`partialTraceQubits: keep qubit ${q} out of range [0, ${numQubits})`);
    }
  }

  const traceOut: number[] = [];
  for (let q = 0; q < numQubits; q++) {
    if (!keep.includes(q)) traceOut.push(q);
  }

  const keepDim = 2 ** keep.length;
  const traceDim = 2 ** traceOut.length;
  const result = zeroMatrix(keepDim, keepDim);

  // Iterate every (iKeep, jKeep) pair in the reduced basis.
  for (let iKeep = 0; iKeep < keepDim; iKeep++) {
    const iKeepBits = intToBits(iKeep, keep.length);

    for (let jKeep = 0; jKeep < keepDim; jKeep++) {
      const jKeepBits = intToBits(jKeep, keep.length);
      let sum: Complex = ZERO;

      // Sum over the traced-out subsystem with the same index k on
      // both row and column.
      for (let kTrace = 0; kTrace < traceDim; kTrace++) {
        const kTraceBits = intToBits(kTrace, traceOut.length);

        // Build full row/col bit arrays.
        const rowBits = new Array<number>(numQubits);
        const colBits = new Array<number>(numQubits);

        for (let m = 0; m < keep.length; m++) {
          rowBits[keep[m]] = iKeepBits[m];
          colBits[keep[m]] = jKeepBits[m];
        }
        for (let m = 0; m < traceOut.length; m++) {
          rowBits[traceOut[m]] = kTraceBits[m];
          colBits[traceOut[m]] = kTraceBits[m];
        }

        const rowIdx = bitsToInt(rowBits);
        const colIdx = bitsToInt(colBits);
        sum = add(sum, rho[rowIdx][colIdx]);
      }

      result[iKeep][jKeep] = sum;
    }
  }

  return result;
}
