/**
 * Phase 9B.5 → Phase 9C-1 — quantum mutual information.
 *
 * Implements the textbook quantum-information identity
 *
 *     I(A:B) = S(ρ_A) + S(ρ_B) - S(ρ_AB)
 *
 * **Phase 9B.5 baseline**: 2-qubit pure states only, with the
 * hardcoded shortcut `S(ρ_AB) = 0` because the global state is pure
 * (and so the engine could avoid a 4×4 eigensolver).
 *
 * **Phase 9C-1 generalisation**: a new general
 * `mutualInformationQubitSubsystems` helper computes I(A:B) for any
 * disjoint subsystem split on any-numQubits state, by building three
 * reduced density matrices (`ρ_A`, `ρ_B`, `ρ_AB`) via partial trace
 * and feeding them through the new general `vonNeumannEntropy`
 * (Phase 9C-1 real-symmetric Jacobi eigensolver). The Phase 9B.5
 * shortcut is retired — the general solver naturally produces
 * eigenvalues `{1, 0, 0, 0}` for a pure-state ρ_AB, so `S(ρ_AB) = 0`
 * still emerges, but it's a *result* now rather than a hardcode.
 *
 * The dispatcher `maybeComputePreviewMutualInformation` previously
 * returned `'unsupported'` for `numQubits ≥ 3` (Phase 9B.5 honest
 * deferral). Phase 9C-1 makes those cases `'computed'` too —
 * Cycle-4 / GHZ pair MI now produces real numbers, no longer the
 * dashed "not computed" notice.
 *
 * **Honesty discipline (unchanged)**: every result remains *exact
 * within the minimal qubit model*. Engine MI is NOT an SU(2)
 * intertwiner-space mutual information, NOT an LQG I(A:B). The
 * existing `mutualInformationProxy` toy formula is unchanged; the UI
 * still pins the "qualitative comparison only" disclaimer because
 * the proxy is unitless and the engine MI is in bits/nats.
 */

import type { ComplexVector } from './linearAlgebra';
import { vectorNormSquared } from './linearAlgebra';
import { pureDensityMatrix } from './densityMatrix';
import { partialTraceQubits } from './partialTrace';
import { vonNeumannEntropy } from './entropy';
import type { MinimalQubitGraphState } from './graphState';

/** Natural log of 2 — used to convert nats ↔ bits. */
const LN2 = Math.log(2);

/**
 * Discriminated union for a mutual-information request.
 *
 * Phase 9C-1 widens the `unsupported.reason` field to include
 * `'requires-complex-hermitian-eigensolver'` for the case where a
 * reduced ρ has significant complex off-diagonal entries (an SU(2)
 * scenario, not reachable by current Phase 9A/9B engine states).
 *
 * The legacy reason `'requires-general-subsystem-entropy'` is kept
 * for backward compatibility but is no longer emitted in normal
 * flows — Phase 9C-1's general eigensolver eliminates it for every
 * ≥2-qubit state the engine produces today.
 */
export type MutualInformationResult =
  | {
      status: 'computed';
      subsystemA: readonly number[];
      subsystemB: readonly number[];
      entropyANat: number;
      entropyBNat: number;
      entropyABNat: number;
      mutualInformationNat: number;
      mutualInformationBits: number;
    }
  | {
      status: 'unsupported';
      reason:
        | 'requires-general-subsystem-entropy'
        | 'requires-complex-hermitian-eigensolver';
      subsystemA: readonly number[];
      subsystemB: readonly number[];
    };

/* ------------------------------------------------------------------ */
/*  Phase 9C-1 general subsystem MI                                    */
/* ------------------------------------------------------------------ */

/**
 * Exact qubit subsystem mutual information `I(A : B)` for a
 * normalised pure state on `numQubits` qubits, with disjoint
 * non-empty `subsystemA` / `subsystemB`.
 *
 * Builds three reduced density matrices via `partialTraceQubits`:
 *   • ρ_A    = Tr_{not-A}(|ψ⟩⟨ψ|)
 *   • ρ_B    = Tr_{not-B}(|ψ⟩⟨ψ|)
 *   • ρ_AB   = Tr_{not-(A∪B)}(|ψ⟩⟨ψ|)
 *
 * (The keep lists are deduplicated and sorted ascending so the
 * reduced bases are deterministic.)
 *
 * Then `S(ρ_·) = vonNeumannEntropy(ρ_·)` via the new general
 * eigensolver, and `I(A:B) = S(A) + S(B) - S(AB)`. A small negative
 * MI from floating-point drift is clamped to 0 (I is non-negative
 * for any valid quantum state).
 *
 * Returns `'unsupported'` with reason
 * `'requires-complex-hermitian-eigensolver'` if any reduced ρ has
 * significant complex off-diagonal entries (Phase 9C-1 supports the
 * real-symmetric branch only).
 *
 * Throws on validation errors (bad ket length, unnormalised input,
 * empty / overlapping subsystems, out-of-range qubit indices).
 */
export function mutualInformationQubitSubsystems(
  ket: ComplexVector,
  numQubits: number,
  subsystemA: readonly number[],
  subsystemB: readonly number[],
): MutualInformationResult {
  if (!Number.isInteger(numQubits) || numQubits < 2) {
    throw new Error(
      `mutualInformationQubitSubsystems: numQubits must be an integer >= 2 ` +
        `(got ${numQubits})`,
    );
  }
  const expectedDim = 2 ** numQubits;
  if (ket.length !== expectedDim) {
    throw new Error(
      `mutualInformationQubitSubsystems: ket length ${ket.length} does not ` +
        `match 2^${numQubits} = ${expectedDim}`,
    );
  }
  const n2 = vectorNormSquared(ket);
  if (!Number.isFinite(n2)) {
    throw new Error(
      'mutualInformationQubitSubsystems: ket has non-finite components',
    );
  }
  if (Math.abs(n2 - 1) > 1e-9) {
    throw new Error(
      `mutualInformationQubitSubsystems: ket is not normalised ` +
        `(‖ψ‖² = ${n2}, expected 1 within 1e-9)`,
    );
  }

  if (subsystemA.length === 0 || subsystemB.length === 0) {
    throw new Error(
      'mutualInformationQubitSubsystems: subsystems must be non-empty',
    );
  }
  // Validate A and check no duplicates within A.
  const seenA = new Set<number>();
  for (const q of subsystemA) {
    if (!Number.isInteger(q) || q < 0 || q >= numQubits) {
      throw new Error(
        `mutualInformationQubitSubsystems: subsystemA qubit ${q} out of ` +
          `range [0, ${numQubits})`,
      );
    }
    if (seenA.has(q)) {
      throw new Error(
        `mutualInformationQubitSubsystems: duplicate qubit ${q} in subsystemA`,
      );
    }
    seenA.add(q);
  }
  // Validate B; check no overlap with A.
  const seenB = new Set<number>();
  for (const q of subsystemB) {
    if (!Number.isInteger(q) || q < 0 || q >= numQubits) {
      throw new Error(
        `mutualInformationQubitSubsystems: subsystemB qubit ${q} out of ` +
          `range [0, ${numQubits})`,
      );
    }
    if (seenA.has(q)) {
      throw new Error(
        `mutualInformationQubitSubsystems: subsystems overlap on qubit ${q}`,
      );
    }
    if (seenB.has(q)) {
      throw new Error(
        `mutualInformationQubitSubsystems: duplicate qubit ${q} in subsystemB`,
      );
    }
    seenB.add(q);
  }

  // Deterministic reduced bases via ascending-sorted keep lists.
  const sortedA = [...subsystemA].sort((x, y) => x - y);
  const sortedB = [...subsystemB].sort((x, y) => x - y);
  const sortedAB = [...sortedA, ...sortedB].sort((x, y) => x - y);

  const rho = pureDensityMatrix(ket);
  const rhoA = partialTraceQubits(rho, numQubits, sortedA);
  const rhoB = partialTraceQubits(rho, numQubits, sortedB);
  const rhoAB = partialTraceQubits(rho, numQubits, sortedAB);

  let entropyANat: number;
  let entropyBNat: number;
  let entropyABNat: number;
  try {
    entropyANat = vonNeumannEntropy(rhoA, Math.E);
    entropyBNat = vonNeumannEntropy(rhoB, Math.E);
    entropyABNat = vonNeumannEntropy(rhoAB, Math.E);
  } catch {
    // Most likely path: a reduced ρ has significant complex
    // off-diagonals and the general eigensolver refuses. Surface
    // this honestly as `unsupported` so the UI's existing
    // unsupported branch can render — silently failing here would
    // erode the engine's honesty register.
    return {
      status: 'unsupported',
      reason: 'requires-complex-hermitian-eigensolver',
      subsystemA: sortedA,
      subsystemB: sortedB,
    };
  }

  // I(A:B) = S(A) + S(B) - S(AB). Clamp tiny negative drift —
  // mathematically I is non-negative for any valid quantum state.
  let mutualInformationNat = entropyANat + entropyBNat - entropyABNat;
  if (mutualInformationNat < 0 && mutualInformationNat > -1e-10) {
    mutualInformationNat = 0;
  }
  const mutualInformationBits = mutualInformationNat / LN2;

  return {
    status: 'computed',
    subsystemA: sortedA,
    subsystemB: sortedB,
    entropyANat,
    entropyBNat,
    entropyABNat,
    mutualInformationNat,
    mutualInformationBits,
  };
}

/* ------------------------------------------------------------------ */
/*  Phase 9B.5 helpers, refactored in Phase 9C-1 to delegate           */
/* ------------------------------------------------------------------ */

/**
 * Exact mutual information `I(Q0 : Q1)` for a normalised pure two-
 * qubit state. Phase 9C-1 refactors this to delegate to
 * `mutualInformationQubitSubsystems(ket, 2, [0], [1])`.
 *
 * The Phase 9B.5 hardcoded `S(ρ_AB) = 0` shortcut is retired — the
 * Phase 9C-1 general eigensolver naturally produces eigenvalues
 * `{1, 0, 0, 0}` for the pure two-qubit ρ, giving `S(ρ_AB) = 0` as a
 * *computed* result rather than a hardcode. Bell / product test
 * values are unchanged byte-for-byte (verified by selftest).
 */
export function mutualInformationForTwoQubitPureState(
  ket: ComplexVector,
): MutualInformationResult {
  if (ket.length !== 4) {
    throw new Error(
      `mutualInformationForTwoQubitPureState: expected ket length 4 ` +
        `(got ${ket.length})`,
    );
  }
  return mutualInformationQubitSubsystems(ket, 2, [0], [1]);
}

/**
 * Engine-preview dispatcher. Phase 9C-1 makes this much smaller:
 * for any state with `numQubits ≥ 2` it delegates to the general
 * subsystem helper with the canonical `[0]` / `[1]` split; otherwise
 * (defensive — current engine states all have `numQubits ≥ 1`, but
 * if a 1-qubit state ever arrives) it returns the legacy
 * `'unsupported'` reason for backward compatibility.
 *
 * Cycle-4 GHZ / product, GHZ(3), GHZ(4), product(4) — all return
 * `'computed'` now. The Engine Preview UI's unsupported branch is
 * effectively unreachable through normal app flows; it stays in the
 * codebase as a defence against future complex-Hermitian states.
 */
export function maybeComputePreviewMutualInformation(
  state: MinimalQubitGraphState,
): MutualInformationResult {
  if (state.numQubits < 2) {
    return {
      status: 'unsupported',
      reason: 'requires-general-subsystem-entropy',
      subsystemA: [0],
      subsystemB: [1],
    };
  }
  return mutualInformationQubitSubsystems(state.ket, state.numQubits, [0], [1]);
}
