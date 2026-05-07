/**
 * Phase 9A — density-matrix construction and structural validation.
 *
 * The engine works exclusively with finite-dimensional density
 * matrices. Pure-state density matrices come from `pureDensityMatrix`
 * (= |ψ⟩⟨ψ|). Mixed-state density matrices come from `partialTrace`'s
 * output. `validateDensityMatrix` does fast structural checks
 * (square, Hermitian, unit trace); positive semi-definiteness is
 * verified at the eigenvalue layer (`entropy.ts`) for the 2×2 cases
 * Phase 9A actually consumes.
 */

import type { Complex } from './complex';
import { approxEqualComplex, conj } from './complex';
import type { ComplexMatrix, ComplexVector } from './linearAlgebra';
import { matMul, outerProductKetBra, trace } from './linearAlgebra';

/**
 * Build the pure-state density matrix ρ = |ψ⟩⟨ψ| from a (normalised)
 * state vector. The caller is responsible for ensuring |ψ⟩ is
 * normalised; pass it through `validateNormalizedState` if unsure.
 */
export function pureDensityMatrix(ket: ComplexVector): Complex[][] {
  return outerProductKetBra(ket);
}

/**
 * Sanity-check a density matrix:
 *   • square
 *   • Hermitian (within `eps`)
 *   • Tr(ρ) ≈ 1 (within `eps`)
 *
 * Positive semi-definiteness is *not* checked here. For the 2×2
 * reduced density matrices Phase 9A produces, PSD is verified at the
 * `entropy.eigenvaluesHermitian2x2` layer (eigenvalues > -eps after
 * numerical clamp). A general PSD check would require a full Hermitian
 * eigensolver and is deferred to a future phase along with the SU(2)
 * upgrade.
 *
 * Throws with a specific message naming which check failed.
 */
export function validateDensityMatrix(rho: ComplexMatrix, eps = 1e-9): void {
  const n = rho.length;
  if (n === 0) {
    throw new Error('validateDensityMatrix: empty matrix');
  }

  // Square check — every row has length n.
  for (let i = 0; i < n; i++) {
    if (rho[i].length !== n) {
      throw new Error(
        `validateDensityMatrix: not square (row ${i} length ${rho[i].length}, expected ${n})`,
      );
    }
  }

  // Hermitian check: ρ_{ij} = conj(ρ_{ji}).
  for (let i = 0; i < n; i++) {
    for (let j = 0; j < n; j++) {
      if (!approxEqualComplex(rho[i][j], conj(rho[j][i]), eps)) {
        throw new Error(
          `validateDensityMatrix: not Hermitian at (${i},${j}) — ` +
            `ρ_{${i}${j}}=${rho[i][j].re}+${rho[i][j].im}i ` +
            `vs conj(ρ_{${j}${i}})=${conj(rho[j][i]).re}+${conj(rho[j][i]).im}i`,
        );
      }
    }
  }

  // Trace check: Tr(ρ) ≈ 1 + 0i.
  const t = trace(rho);
  if (Math.abs(t.re - 1) > eps || Math.abs(t.im) > eps) {
    throw new Error(
      `validateDensityMatrix: Tr(ρ) ≠ 1 (got ${t.re}${t.im >= 0 ? '+' : ''}${t.im}i)`,
    );
  }
}

/**
 * Tr(ρ²) — the purity of a density matrix, in [1/d, 1]. Pure states
 * give exactly 1; the maximally mixed state I/d gives 1/d. Useful for
 * a quick sanity check that an alleged pure state actually is one.
 */
export function purity(rho: ComplexMatrix): number {
  const sq = matMul(rho, rho);
  return trace(sq).re;
}
