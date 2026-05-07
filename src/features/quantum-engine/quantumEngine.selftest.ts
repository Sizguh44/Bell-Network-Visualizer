/**
 * Phase 9A — quantum-engine self-test.
 *
 * Pure TypeScript. No React, no DOM, no i18n. Imports the engine via
 * its public `./index` and runs a sequence of assertions whose
 * results have closed-form expected values. Run via the
 * `validate-quantum-engine.mjs` script (which compiles this file plus
 * the engine to a temp dir using the already-installed TypeScript
 * compiler API and then executes the compiled output).
 *
 * The eight required Phase 9A checks the spec lists:
 *   1. Bell state normalised.
 *   2. Bell single-qubit reduced ρ = I/2.
 *   3. Bell single-qubit von Neumann entropy = ln 2 (nats).
 *   4. Bell single-qubit entropy in bits = 1.
 *   5. Product |00⟩ single-qubit entropy = 0.
 *   6. GHZ(3) single-qubit entropy = ln 2.
 *   7. Partial trace preserves Tr(ρ) = 1.
 *   8. Reduced density matrix is Hermitian.
 *
 * Plus a few bonus invariants the engine must satisfy and that are
 * cheap to check while we're here.
 */

import {
  addMatrices,
  approxEqualMatrix,
  bellPhiPlus,
  buildEndpointLayout,
  buildGlobalNodeProjector,
  buildMinimalQubitGraphState,
  buildMinimalSpinHalfBellNetworkState,
  buildSpinHalfLinkSingletProductKet,
  buildSpinHalfProjectedBellNetworkState,
  buildSpinJRepresentation,
  buildSpinTensorProductSpace,
  canonicaliseEdgeSlots,
  commutator,
  complex,
  computePairwiseMutualInformationMatrix,
  computeSingleQubitEntropies,
  createCycle4SpinHalfGraph,
  createDipoleSpinHalfGraph,
  createTwoNodeSingleEdgeSpinHalfGraph,
  dagger,
  eigendecompositionHermitian,
  eigendecompositionRealSymmetricJacobi,
  eigenvaluesHermitian,
  eigenvaluesHermitian2x2,
  eigenvaluesRealSymmetricJacobi,
  embeddedSpinOperator,
  expectationValue,
  invariantSubspaceProjector,
  ghzState,
  identityMatrix,
  isEffectivelyRealHermitian,
  magneticNumbers,
  matMul,
  matrixVectorMultiply,
  maybeComputePreviewMutualInformation,
  mutualInformationForTwoQubitPureState,
  mutualInformationQubitSubsystems,
  partialTraceQubits,
  pureDensityMatrix,
  productZeroState,
  purity,
  scaleMatrix,
  singletStateTwoSpinHalf,
  spinCasimir,
  spinDimension,
  spinHalfSingletState,
  spinJMinus,
  spinJPlus,
  spinJX,
  spinJY,
  spinJZ,
  summarizeBellNetworkGraph,
  tensorProductMatrices,
  totalSpinOperator,
  totalSpinSquared,
  trace,
  tripletStatesTwoSpinHalf,
  validateBellNetworkGraph,
  validateDensityMatrix,
  validateNormalizedState,
  validateSpinJ,
  vectorNormSquared,
  vonNeumannEntropy,
  type BellNetworkGraph,
  type Complex,
  type ComplexMatrix,
  type ComplexVector,
} from './index';

// Phase 9A: this file is consumed by `scripts/validate-quantum-engine.mjs`
// which compiles it with `module: CommonJS` and `require()`s the result
// from a Node script. We need `process.exit()` to signal failure to the
// child-process exit code, but the project does not install
// `@types/node`. Declaring just the slice of the Node global API the
// selftest uses keeps the type-check clean without adding a dependency.
declare const process: { exit(code: number): never };

// ----------------------------------------------------------------------
// Tiny test harness — no dependency on Vitest / Jest.
// ----------------------------------------------------------------------

interface CheckResult {
  name: string;
  passed: boolean;
  details?: string;
}

const results: CheckResult[] = [];

function check(name: string, fn: () => void): void {
  try {
    fn();
    results.push({ name, passed: true });
  } catch (err) {
    results.push({
      name,
      passed: false,
      details: err instanceof Error ? err.message : String(err),
    });
  }
}

function approxEqualNumber(actual: number, expected: number, eps = 1e-9): void {
  if (!Number.isFinite(actual) || !Number.isFinite(expected)) {
    throw new Error(`non-finite value: actual=${actual}, expected=${expected}`);
  }
  const diff = Math.abs(actual - expected);
  if (diff > eps) {
    throw new Error(`expected ${expected}, got ${actual} (|diff|=${diff})`);
  }
}

function half(): Complex {
  return { re: 0.5, im: 0 };
}
function zero(): Complex {
  return { re: 0, im: 0 };
}

const I_OVER_2: ComplexMatrix = [
  [half(), zero()],
  [zero(), half()],
];

// ----------------------------------------------------------------------
// 1. Bell state normalised.
// ----------------------------------------------------------------------
check('Bell |Φ+⟩ is normalised', () => {
  validateNormalizedState(bellPhiPlus());
});

// ----------------------------------------------------------------------
// 2. Bell single-qubit reduced density matrix equals I/2.
//    Trace out qubit 1, keep qubit 0.
// ----------------------------------------------------------------------
check('Bell single-qubit reduced ρ equals I/2', () => {
  const rho = pureDensityMatrix(bellPhiPlus());
  const rho0 = partialTraceQubits(rho, 2, [0]);
  if (!approxEqualMatrix(rho0, I_OVER_2, 1e-12)) {
    throw new Error(`reduced ρ ≠ I/2 (got ${JSON.stringify(rho0)})`);
  }
});

// ----------------------------------------------------------------------
// 3. Bell single-qubit von Neumann entropy = ln 2 (in nats).
// ----------------------------------------------------------------------
check('Bell single-qubit S(ρ) = ln 2 nats', () => {
  const rho = pureDensityMatrix(bellPhiPlus());
  const rho0 = partialTraceQubits(rho, 2, [0]);
  const S = vonNeumannEntropy(rho0);
  approxEqualNumber(S, Math.log(2));
});

// ----------------------------------------------------------------------
// 4. Bell single-qubit entropy in bits = 1.
// ----------------------------------------------------------------------
check('Bell single-qubit S(ρ) = 1 bit', () => {
  const rho = pureDensityMatrix(bellPhiPlus());
  const rho0 = partialTraceQubits(rho, 2, [0]);
  const Sbits = vonNeumannEntropy(rho0, 2);
  approxEqualNumber(Sbits, 1);
});

// ----------------------------------------------------------------------
// 5. Product |00⟩ single-qubit entropy = 0.
// ----------------------------------------------------------------------
check('Product |00⟩ single-qubit S(ρ) = 0', () => {
  const rho = pureDensityMatrix(productZeroState(2));
  const rho0 = partialTraceQubits(rho, 2, [0]);
  const S = vonNeumannEntropy(rho0);
  approxEqualNumber(S, 0);
});

// ----------------------------------------------------------------------
// 6. GHZ(3) single-qubit entropy = ln 2 (nats).
//    Maximally entangled in this sense — every single-qubit reduced
//    density matrix is I/2.
// ----------------------------------------------------------------------
check('GHZ(3) single-qubit S(ρ) = ln 2 nats', () => {
  const rho = pureDensityMatrix(ghzState(3));
  const rho0 = partialTraceQubits(rho, 3, [0]);
  const S = vonNeumannEntropy(rho0);
  approxEqualNumber(S, Math.log(2));
});

// ----------------------------------------------------------------------
// 7. Partial trace preserves Tr(ρ) = 1 across a representative set.
// ----------------------------------------------------------------------
check('partial trace preserves Tr(ρ) = 1', () => {
  const cases = [
    { name: 'Bell', ket: bellPhiPlus(), n: 2, keep: [0] },
    { name: 'Bell-other', ket: bellPhiPlus(), n: 2, keep: [1] },
    { name: '|00⟩', ket: productZeroState(2), n: 2, keep: [0] },
    { name: 'GHZ(3) keep[0]', ket: ghzState(3), n: 3, keep: [0] },
    { name: 'GHZ(3) keep[1]', ket: ghzState(3), n: 3, keep: [1] },
    { name: 'GHZ(3) keep[2]', ket: ghzState(3), n: 3, keep: [2] },
  ];
  for (const c of cases) {
    const rho = pureDensityMatrix(c.ket);
    const reduced = partialTraceQubits(rho, c.n, c.keep);
    const t = trace(reduced);
    approxEqualNumber(t.re, 1, 1e-10);
    approxEqualNumber(t.im, 0, 1e-10);
  }
});

// ----------------------------------------------------------------------
// 8. Reduced density matrices are Hermitian (and unit-trace).
// ----------------------------------------------------------------------
check('reduced ρ passes validateDensityMatrix (Hermitian + Tr=1)', () => {
  const cases: { ket: Complex[]; n: number }[] = [
    { ket: bellPhiPlus(), n: 2 },
    { ket: productZeroState(2), n: 2 },
    { ket: ghzState(3), n: 3 },
  ];
  for (const c of cases) {
    const rho = pureDensityMatrix(c.ket);
    const reduced = partialTraceQubits(rho, c.n, [0]);
    validateDensityMatrix(reduced);
  }
});

// ----------------------------------------------------------------------
// Bonus invariant — pure-state purity Tr(ρ²) = 1.
// ----------------------------------------------------------------------
check('pure-state purity Tr(ρ²) = 1', () => {
  const cases = [bellPhiPlus(), productZeroState(2), ghzState(3)];
  for (const ket of cases) {
    const p = purity(pureDensityMatrix(ket));
    approxEqualNumber(p, 1, 1e-10);
  }
});

// ----------------------------------------------------------------------
// Bonus invariant — Bell reduced ρ has eigenvalues {1/2, 1/2}.
// ----------------------------------------------------------------------
check('Bell reduced ρ eigenvalues = {1/2, 1/2}', () => {
  const rho = pureDensityMatrix(bellPhiPlus());
  const rho0 = partialTraceQubits(rho, 2, [0]);
  const { lambdaMinus, lambdaPlus } = eigenvaluesHermitian2x2(rho0);
  approxEqualNumber(lambdaMinus, 0.5);
  approxEqualNumber(lambdaPlus, 0.5);
});

// ----------------------------------------------------------------------
// Bonus invariant — Product reduced ρ has eigenvalues {0, 1}.
// ----------------------------------------------------------------------
check('Product |00⟩ reduced ρ eigenvalues = {0, 1}', () => {
  const rho = pureDensityMatrix(productZeroState(2));
  const rho0 = partialTraceQubits(rho, 2, [0]);
  const { lambdaMinus, lambdaPlus } = eigenvaluesHermitian2x2(rho0);
  approxEqualNumber(lambdaMinus, 0);
  approxEqualNumber(lambdaPlus, 1);
});

// ----------------------------------------------------------------------
// Bonus — graph-state builders produce normalised states.
// ----------------------------------------------------------------------
check('buildMinimalQubitGraphState yields normalised states', () => {
  validateNormalizedState(buildMinimalQubitGraphState('product', 1).ket);
  validateNormalizedState(buildMinimalQubitGraphState('product', 4).ket);
  validateNormalizedState(buildMinimalQubitGraphState('bell-pair', 2).ket);
  validateNormalizedState(buildMinimalQubitGraphState('ghz', 2).ket);
  validateNormalizedState(buildMinimalQubitGraphState('ghz', 3).ket);
  validateNormalizedState(buildMinimalQubitGraphState('ghz', 4).ket);
});

// ----------------------------------------------------------------------
// Bonus — `computeSingleQubitEntropies` returns one entry per qubit
//          and matches the per-qubit closed forms for Bell + GHZ(3).
// ----------------------------------------------------------------------
check('computeSingleQubitEntropies length + values', () => {
  const bellResults = computeSingleQubitEntropies(bellPhiPlus(), 2);
  if (bellResults.length !== 2) {
    throw new Error(`Bell: expected 2 entries, got ${bellResults.length}`);
  }
  for (const r of bellResults) {
    approxEqualNumber(r.entropyNat, Math.log(2));
    approxEqualNumber(r.entropyBits, 1);
  }

  const ghzResults = computeSingleQubitEntropies(ghzState(3), 3);
  if (ghzResults.length !== 3) {
    throw new Error(`GHZ(3): expected 3 entries, got ${ghzResults.length}`);
  }
  for (const r of ghzResults) {
    approxEqualNumber(r.entropyNat, Math.log(2));
    approxEqualNumber(r.entropyBits, 1);
  }

  const productResults = computeSingleQubitEntropies(productZeroState(2), 2);
  if (productResults.length !== 2) {
    throw new Error(`|00⟩: expected 2 entries, got ${productResults.length}`);
  }
  for (const r of productResults) {
    approxEqualNumber(r.entropyNat, 0);
    approxEqualNumber(r.entropyBits, 0);
  }
});

// ----------------------------------------------------------------------
// Phase 9B.5 — exact qubit mutual information.
// ----------------------------------------------------------------------

// Bell |Φ+⟩: I(Q0:Q1) = 2 bits = 2·ln 2 nats; breakdown S(A) = S(B) = ln 2,
// S(AB) = 0 (pure global state).
check('Bell |Φ+⟩ exact I(Q0:Q1) = 2 bits with breakdown', () => {
  const result = mutualInformationForTwoQubitPureState(bellPhiPlus());
  if (result.status !== 'computed') {
    throw new Error(`expected status='computed', got '${result.status}'`);
  }
  approxEqualNumber(result.entropyANat, Math.log(2));
  approxEqualNumber(result.entropyBNat, Math.log(2));
  approxEqualNumber(result.entropyABNat, 0);
  approxEqualNumber(result.mutualInformationNat, 2 * Math.log(2));
  approxEqualNumber(result.mutualInformationBits, 2);
});

// Product |00⟩: I(Q0:Q1) = 0 — separable state has no mutual information.
check('Product |00⟩ exact I(Q0:Q1) = 0', () => {
  const result = mutualInformationForTwoQubitPureState(productZeroState(2));
  if (result.status !== 'computed') {
    throw new Error(`expected status='computed', got '${result.status}'`);
  }
  approxEqualNumber(result.entropyANat, 0);
  approxEqualNumber(result.entropyBNat, 0);
  approxEqualNumber(result.entropyABNat, 0);
  approxEqualNumber(result.mutualInformationNat, 0);
  approxEqualNumber(result.mutualInformationBits, 0);
});

// `maybeComputePreviewMutualInformation` dispatches by numQubits: 2-qubit
// states get exact MI; ≥ 3-qubit states get the explicit `unsupported`
// honesty marker (general subsystem-entropy eigensolver is deferred).
check('maybeComputePreviewMutualInformation dispatch — 2-qubit Bell pair', () => {
  const state = buildMinimalQubitGraphState('bell-pair', 2);
  const result = maybeComputePreviewMutualInformation(state);
  if (result.status !== 'computed') {
    throw new Error(`expected status='computed', got '${result.status}'`);
  }
  approxEqualNumber(result.mutualInformationBits, 2);
});

// Phase 9C-1: this test was previously "GHZ(3)/(4) unsupported".
// The new general Hermitian eigensolver makes those cases computed,
// so the test now verifies the dispatcher returns `'computed'` for
// the same three ≥3-qubit states with the textbook-expected MI
// values. The replacement preserves the engine's coverage of the
// dispatcher's ≥3-qubit branch — only the expected status flips.
check('Phase 9C-1: dispatch returns computed for GHZ(3)/(4) and product(4)', () => {
  const ghz3 = buildMinimalQubitGraphState('ghz', 3);
  const ghz4 = buildMinimalQubitGraphState('ghz', 4);
  const product4 = buildMinimalQubitGraphState('product', 4);

  for (const state of [ghz3, ghz4, product4]) {
    const result = maybeComputePreviewMutualInformation(state);
    if (result.status !== 'computed') {
      throw new Error(
        `expected status='computed' for ${state.numQubits}-qubit ${state.kind}, got '${result.status}'`,
      );
    }
  }

  // Closed-form expected I(Q0:Q1) values (textbook):
  //   GHZ(n) for any n ≥ 2 keeping qubits [0],[1]:
  //     ρ_A = ρ_B = I/2;  ρ_AB = diag(1/2, 0, 0, 1/2);
  //     S(A) = S(B) = S(AB) = ln 2;  I = ln 2 = 1 bit
  //   product(n) keeping qubits [0],[1]:
  //     all entropies 0;  I = 0
  const ghz3Result = maybeComputePreviewMutualInformation(ghz3);
  const ghz4Result = maybeComputePreviewMutualInformation(ghz4);
  const product4Result = maybeComputePreviewMutualInformation(product4);
  if (
    ghz3Result.status !== 'computed' ||
    ghz4Result.status !== 'computed' ||
    product4Result.status !== 'computed'
  ) {
    throw new Error('expected all three to be computed');
  }
  approxEqualNumber(ghz3Result.mutualInformationBits, 1);
  approxEqualNumber(ghz4Result.mutualInformationBits, 1);
  approxEqualNumber(product4Result.mutualInformationBits, 0);
});

// ----------------------------------------------------------------------
// Phase 9C-1 — general Hermitian eigensolver + general subsystem entropy.
// ----------------------------------------------------------------------

// 1. eigenvaluesHermitian on 2×2 I/2 returns {0.5, 0.5}.
//    The 2×2 path inside `eigenvaluesHermitian` delegates to the
//    closed-form `eigenvaluesHermitian2x2`, so this also exercises
//    the dispatch.
check('eigenvaluesHermitian: 2×2 I/2 returns {0.5, 0.5}', () => {
  const I_OVER_2: ComplexMatrix = [
    [{ re: 0.5, im: 0 }, { re: 0, im: 0 }],
    [{ re: 0, im: 0 }, { re: 0.5, im: 0 }],
  ];
  const evs = eigenvaluesHermitian(I_OVER_2);
  if (evs.length !== 2) throw new Error(`expected 2 eigenvalues, got ${evs.length}`);
  approxEqualNumber(evs[0], 0.5);
  approxEqualNumber(evs[1], 0.5);
});

// 2. eigenvaluesHermitian on 4×4 diag(0.5, 0, 0, 0.5) returns
//    {0.5, 0.5, 0, 0}. The 4×4 path goes through the Jacobi
//    eigensolver (already converges in 0 iterations because the
//    matrix is diagonal — diagonal handled correctly is the
//    foundational invariant).
check('eigenvaluesHermitian: 4×4 diag(0.5, 0, 0, 0.5) returns {0.5, 0.5, 0, 0}', () => {
  const Z: Complex = { re: 0, im: 0 };
  const half: Complex = { re: 0.5, im: 0 };
  const H: ComplexMatrix = [
    [half, Z, Z, Z],
    [Z, Z, Z, Z],
    [Z, Z, Z, Z],
    [Z, Z, Z, half],
  ];
  const evs = eigenvaluesHermitian(H);
  if (evs.length !== 4) throw new Error(`expected 4 eigenvalues, got ${evs.length}`);
  approxEqualNumber(evs[0], 0.5);
  approxEqualNumber(evs[1], 0.5);
  approxEqualNumber(evs[2], 0);
  approxEqualNumber(evs[3], 0);
});

// 3. vonNeumannEntropy on 4×4 diag(0.5, 0, 0, 0.5) = ln 2.
//    This is exactly the ρ_AB shape the GHZ family produces on any
//    2-qubit reduction; it's the load-bearing entropy invariant for
//    the cycle-4 Engine Preview.
check('vonNeumannEntropy: 4×4 diag(0.5, 0, 0, 0.5) = ln 2 nats', () => {
  const Z: Complex = { re: 0, im: 0 };
  const half: Complex = { re: 0.5, im: 0 };
  const H: ComplexMatrix = [
    [half, Z, Z, Z],
    [Z, Z, Z, Z],
    [Z, Z, Z, Z],
    [Z, Z, Z, half],
  ];
  approxEqualNumber(vonNeumannEntropy(H), Math.log(2));
});

// 4. GHZ(4) I(Q0:Q1) via the new general subsystem helper.
//    Closed-form: ρ_Q0 = ρ_Q1 = I/2 (S = ln 2 each); ρ_Q0Q1 = diag
//    (1/2, 0, 0, 1/2) (S = ln 2). I = ln 2 + ln 2 - ln 2 = ln 2 nats
//    = 1 bit.
check('GHZ(4) I(Q0:Q1) = 1 bit (S(A) = S(B) = S(AB) = ln 2)', () => {
  const result = mutualInformationQubitSubsystems(ghzState(4), 4, [0], [1]);
  if (result.status !== 'computed') {
    throw new Error(`expected status='computed', got '${result.status}'`);
  }
  approxEqualNumber(result.entropyANat, Math.log(2));
  approxEqualNumber(result.entropyBNat, Math.log(2));
  approxEqualNumber(result.entropyABNat, Math.log(2));
  approxEqualNumber(result.mutualInformationNat, Math.log(2));
  approxEqualNumber(result.mutualInformationBits, 1);
});

// 5. Product(4) I(Q0:Q1) = 0 — separable on every cut.
check('Product(4) I(Q0:Q1) = 0 via mutualInformationQubitSubsystems', () => {
  const result = mutualInformationQubitSubsystems(productZeroState(4), 4, [0], [1]);
  if (result.status !== 'computed') {
    throw new Error(`expected status='computed', got '${result.status}'`);
  }
  approxEqualNumber(result.entropyANat, 0);
  approxEqualNumber(result.entropyBNat, 0);
  approxEqualNumber(result.entropyABNat, 0);
  approxEqualNumber(result.mutualInformationNat, 0);
  approxEqualNumber(result.mutualInformationBits, 0);
});

// 6. Bonus: `isEffectivelyRealHermitian` correctly identifies the
//    test states' density matrices — important because Phase 9C-1's
//    Jacobi branch only handles real-symmetric input.
check('isEffectivelyRealHermitian: GHZ(4) and Bell ρ-AB are real-Hermitian', () => {
  const rhoBell = pureDensityMatrix(bellPhiPlus());
  const rhoGhz4 = pureDensityMatrix(ghzState(4));
  if (!isEffectivelyRealHermitian(rhoBell)) {
    throw new Error('Bell ρ unexpectedly flagged as not effectively real Hermitian');
  }
  if (!isEffectivelyRealHermitian(rhoGhz4)) {
    throw new Error('GHZ(4) ρ unexpectedly flagged as not effectively real Hermitian');
  }
});

// 7. Bonus: direct check that `eigenvaluesRealSymmetricJacobi`
//    converges on a non-trivial 4×4 with off-diagonal entries.
//    Use Bell-pair-on-qubits-{0,3}-of-4 ρ, which is a rank-1 real
//    symmetric matrix with one large off-diagonal pair.
check('eigenvaluesRealSymmetricJacobi: Bell-shaped 4×4 has eigenvalues {1, 0, 0, 0}', () => {
  // (1/2) [[1,0,0,1],[0,0,0,0],[0,0,0,0],[1,0,0,1]]
  const m: number[][] = [
    [0.5, 0, 0, 0.5],
    [0, 0, 0, 0],
    [0, 0, 0, 0],
    [0.5, 0, 0, 0.5],
  ];
  const evs = eigenvaluesRealSymmetricJacobi(m);
  if (evs.length !== 4) throw new Error(`expected 4 eigenvalues, got ${evs.length}`);
  approxEqualNumber(evs[0], 1);
  approxEqualNumber(evs[1], 0);
  approxEqualNumber(evs[2], 0);
  approxEqualNumber(evs[3], 0);
});

// ======================================================================
// Phase 9C-2 — pairwise mutual-information matrix.
// ======================================================================

// 8. Bell pair: 2×2 matrix with off-diagonal I(Q0:Q1) = 2 bits, both
//    diagonal cells flagged 'diagonal', maxComputedBits = 2. Mirrors
//    the existing `Bell |Φ+⟩ exact I(Q0:Q1) = 2 bits` selftest but goes
//    through the new matrix builder rather than the single-pair helper.
check('computePairwiseMutualInformationMatrix: Bell pair → 2×2, off-diag = 2 bits', () => {
  const ket = bellPhiPlus();
  const m = computePairwiseMutualInformationMatrix(ket, 2);
  if (m.numQubits !== 2) throw new Error(`expected numQubits=2, got ${m.numQubits}`);
  if (m.cells.length !== 2 || m.cells[0]!.length !== 2 || m.cells[1]!.length !== 2) {
    throw new Error('expected 2×2 cells matrix');
  }
  // Diagonals
  const c00 = m.cells[0]![0]!;
  const c11 = m.cells[1]![1]!;
  if (c00.status !== 'diagonal' || c11.status !== 'diagonal') {
    throw new Error('expected diagonal status on (0,0) and (1,1)');
  }
  // Off-diagonals — symmetric, both 2 bits
  const c01 = m.cells[0]![1]!;
  const c10 = m.cells[1]![0]!;
  if (c01.status !== 'computed' || c10.status !== 'computed') {
    throw new Error('expected computed status on (0,1) and (1,0)');
  }
  approxEqualNumber(c01.mutualInformationBits, 2);
  approxEqualNumber(c10.mutualInformationBits, 2);
  approxEqualNumber(m.maxComputedBits, 2);
});

// 9. Product(4) = |0000⟩: every off-diagonal MI = 0, maxComputedBits = 0.
//    Verifies the matrix builder respects the trivial factorised case
//    and does not accidentally inflate `maxComputedBits` from a clamped
//    negative-drift result.
check('computePairwiseMutualInformationMatrix: product(4) → all off-diag = 0', () => {
  const ket = productZeroState(4);
  const m = computePairwiseMutualInformationMatrix(ket, 4);
  if (m.numQubits !== 4) throw new Error(`expected numQubits=4, got ${m.numQubits}`);
  if (m.cells.length !== 4) throw new Error('expected 4 rows');
  for (let i = 0; i < 4; i++) {
    if (m.cells[i]!.length !== 4) throw new Error(`row ${i} not length 4`);
    for (let j = 0; j < 4; j++) {
      const cell = m.cells[i]![j]!;
      if (i === j) {
        if (cell.status !== 'diagonal') {
          throw new Error(`(${i},${j}) expected diagonal, got ${cell.status}`);
        }
      } else {
        if (cell.status !== 'computed') {
          throw new Error(`(${i},${j}) expected computed, got ${cell.status}`);
        }
        approxEqualNumber(cell.mutualInformationBits, 0);
      }
    }
  }
  approxEqualNumber(m.maxComputedBits, 0);
});

// 10. GHZ(4): every off-diagonal MI = 1 bit, maxComputedBits = 1.
//     Reduced ρ_{ij} = diag(1/2, 0, 0, 1/2), so S(i) = S(j) = S(ij) =
//     ln 2, giving I = ln 2 nats = 1 bit on every pair.
check('computePairwiseMutualInformationMatrix: GHZ(4) → all off-diag = 1 bit', () => {
  const ket = ghzState(4);
  const m = computePairwiseMutualInformationMatrix(ket, 4);
  if (m.numQubits !== 4) throw new Error(`expected numQubits=4, got ${m.numQubits}`);
  for (let i = 0; i < 4; i++) {
    for (let j = 0; j < 4; j++) {
      const cell = m.cells[i]![j]!;
      if (i === j) {
        if (cell.status !== 'diagonal') {
          throw new Error(`(${i},${j}) expected diagonal, got ${cell.status}`);
        }
      } else {
        if (cell.status !== 'computed') {
          throw new Error(`(${i},${j}) expected computed, got ${cell.status}`);
        }
        approxEqualNumber(cell.mutualInformationBits, 1);
      }
    }
  }
  approxEqualNumber(m.maxComputedBits, 1);
});

// ======================================================================
// Phase 9C-3 — SU(2) spin-j representation building blocks.
// ======================================================================

// Helper for the commutator tests: assert two complex matrices are
// element-wise equal within a small tolerance, and throw a useful
// diagnostic when they aren't. Uses the engine's existing
// `approxEqualMatrix` under the hood; the wrapper keeps test
// authoring concise.
function expectMatrix(actual: ComplexMatrix, expected: ComplexMatrix, label: string): void {
  if (!approxEqualMatrix(actual, expected, 1e-9)) {
    throw new Error(`matrix mismatch (${label})`);
  }
}

// 11. validateSpinJ accepts standard half-integer / integer spins.
check('validateSpinJ: accepts 0, 1/2, 1, 3/2', () => {
  validateSpinJ(0);
  validateSpinJ(0.5);
  validateSpinJ(1);
  validateSpinJ(1.5);
});

// 12. validateSpinJ rejects illegal spins: negative, non-half-integer,
//     non-finite. Each path must throw.
check('validateSpinJ: rejects -0.5, 0.3, NaN, Infinity', () => {
  const bad = [-0.5, 0.3, Number.NaN, Number.POSITIVE_INFINITY];
  for (const j of bad) {
    let threw = false;
    try {
      validateSpinJ(j);
    } catch {
      threw = true;
    }
    if (!threw) throw new Error(`validateSpinJ(${j}) unexpectedly accepted`);
  }
});

// 13. spinDimension: dim(j) = 2j + 1.
check('spinDimension: 0 → 1, 1/2 → 2, 1 → 3', () => {
  if (spinDimension(0) !== 1) throw new Error('dim(0) ≠ 1');
  if (spinDimension(0.5) !== 2) throw new Error('dim(1/2) ≠ 2');
  if (spinDimension(1) !== 3) throw new Error('dim(1) ≠ 3');
});

// 14. magneticNumbers: descending order, length 2j+1.
check('magneticNumbers: descending order [j, …, −j]', () => {
  const m05 = magneticNumbers(0.5);
  if (m05.length !== 2 || m05[0] !== 0.5 || m05[1] !== -0.5) {
    throw new Error(`m(1/2) = ${JSON.stringify(m05)}, expected [0.5, -0.5]`);
  }
  const m1 = magneticNumbers(1);
  if (m1.length !== 3 || m1[0] !== 1 || m1[1] !== 0 || m1[2] !== -1) {
    throw new Error(`m(1) = ${JSON.stringify(m1)}, expected [1, 0, -1]`);
  }
});

// 15. j = 1/2 matrices: J+, J−, Jz, Jx, Jy.
//     Reference values use the descending basis [|+½⟩, |−½⟩].
check('j = 1/2: J+, J−, Jz, Jx, Jy match closed-form expectations', () => {
  // J+ = [[0, 1], [0, 0]]
  expectMatrix(
    spinJPlus(0.5),
    [
      [complex(0, 0), complex(1, 0)],
      [complex(0, 0), complex(0, 0)],
    ],
    'spinJPlus(1/2)',
  );
  // J− = [[0, 0], [1, 0]]
  expectMatrix(
    spinJMinus(0.5),
    [
      [complex(0, 0), complex(0, 0)],
      [complex(1, 0), complex(0, 0)],
    ],
    'spinJMinus(1/2)',
  );
  // Jz = diag(1/2, −1/2)
  expectMatrix(
    spinJZ(0.5),
    [
      [complex(0.5, 0), complex(0, 0)],
      [complex(0, 0), complex(-0.5, 0)],
    ],
    'spinJZ(1/2)',
  );
  // Jx = (1/2) σx = [[0, 1/2], [1/2, 0]]
  expectMatrix(
    spinJX(0.5),
    [
      [complex(0, 0), complex(0.5, 0)],
      [complex(0.5, 0), complex(0, 0)],
    ],
    'spinJX(1/2)',
  );
  // Jy = (1/2) σy = [[0, −i/2], [i/2, 0]]
  expectMatrix(
    spinJY(0.5),
    [
      [complex(0, 0), complex(0, -0.5)],
      [complex(0, 0.5), complex(0, 0)],
    ],
    'spinJY(1/2)',
  );
});

// 16. j = 1 raising operator: non-zero amplitudes on the first
//     super-diagonal at sqrt(2).
check('j = 1: J+ super-diagonal entries equal sqrt(2)', () => {
  const sqrt2 = Math.sqrt(2);
  expectMatrix(
    spinJPlus(1),
    [
      [complex(0, 0), complex(sqrt2, 0), complex(0, 0)],
      [complex(0, 0), complex(0, 0), complex(sqrt2, 0)],
      [complex(0, 0), complex(0, 0), complex(0, 0)],
    ],
    'spinJPlus(1)',
  );
});

// 17. Casimir: J²(1/2) = (3/4) I.
check('Casimir: j = 1/2 → J² = (3/4) I_2', () => {
  const cas = spinCasimir(0.5);
  const expected = scaleMatrix(identityMatrix(2), complex(0.75, 0));
  expectMatrix(cas, expected, 'spinCasimir(1/2)');
});

// 18. Casimir: J²(1) = 2 I.
check('Casimir: j = 1 → J² = 2 I_3', () => {
  const cas = spinCasimir(1);
  const expected = scaleMatrix(identityMatrix(3), complex(2, 0));
  expectMatrix(cas, expected, 'spinCasimir(1)');
});

// 19. Commutators for j = 1/2: [Jx,Jy] = iJz, [Jy,Jz] = iJx, [Jz,Jx] = iJy.
check('Commutators (j = 1/2): [Jx,Jy] = iJz, cyclic', () => {
  const jx = spinJX(0.5);
  const jy = spinJY(0.5);
  const jz = spinJZ(0.5);
  const i_ = complex(0, 1);
  expectMatrix(commutator(jx, jy), scaleMatrix(jz, i_), '[Jx,Jy] = iJz');
  expectMatrix(commutator(jy, jz), scaleMatrix(jx, i_), '[Jy,Jz] = iJx');
  expectMatrix(commutator(jz, jx), scaleMatrix(jy, i_), '[Jz,Jx] = iJy');
});

// 20. Commutators for j = 1: same cyclic relations.
check('Commutators (j = 1): [Jx,Jy] = iJz, cyclic', () => {
  const jx = spinJX(1);
  const jy = spinJY(1);
  const jz = spinJZ(1);
  const i_ = complex(0, 1);
  expectMatrix(commutator(jx, jy), scaleMatrix(jz, i_), '[Jx,Jy] = iJz');
  expectMatrix(commutator(jy, jz), scaleMatrix(jx, i_), '[Jy,Jz] = iJx');
  expectMatrix(commutator(jz, jx), scaleMatrix(jy, i_), '[Jz,Jx] = iJy');
});

// 21. Hermiticity: Jx, Jy, Jz are Hermitian, and (J+)† = J−.
//     Verified at j = 1/2 and j = 1 to cover both the smallest non-
//     trivial irrep and the smallest with a non-empty Jz null space.
check('Hermiticity: Jx, Jy, Jz Hermitian; (J+)† = J− (j = 1/2 and 1)', () => {
  for (const j of [0.5, 1]) {
    const jx = spinJX(j);
    const jy = spinJY(j);
    const jz = spinJZ(j);
    const jp = spinJPlus(j);
    const jm = spinJMinus(j);
    expectMatrix(dagger(jx), jx, `Jx†=Jx (j=${j})`);
    expectMatrix(dagger(jy), jy, `Jy†=Jy (j=${j})`);
    expectMatrix(dagger(jz), jz, `Jz†=Jz (j=${j})`);
    expectMatrix(dagger(jp), jm, `(J+)†=J− (j=${j})`);
  }
});

// 22. buildSpinJRepresentation bundles every operator at the right
//     dimension and reports the right magnetic numbers.
check('buildSpinJRepresentation(1): bundle dimension and magnetic numbers', () => {
  const r = buildSpinJRepresentation(1);
  if (r.j !== 1) throw new Error(`j = ${r.j}, expected 1`);
  if (r.dimension !== 3) throw new Error(`dim = ${r.dimension}, expected 3`);
  if (
    r.magneticNumbers.length !== 3 ||
    r.magneticNumbers[0] !== 1 ||
    r.magneticNumbers[1] !== 0 ||
    r.magneticNumbers[2] !== -1
  ) {
    throw new Error(`m = ${JSON.stringify(r.magneticNumbers)}, expected [1, 0, -1]`);
  }
  // Casimir bundled inside the struct must equal `j(j+1) I = 2 I` too.
  expectMatrix(
    r.casimir,
    scaleMatrix(identityMatrix(3), complex(2, 0)),
    'bundle.casimir',
  );
});

// ======================================================================
// Phase 9D-1 — tensor-product spin spaces and total-J operators.
// ======================================================================

// Helpers for the 9D-1 block. Sorted-descending eigenvalue array
// comparison is used twice; assert that an expectation value is real
// (within tolerance) and equals a target is used many times.
function sortedDescending(xs: readonly number[]): number[] {
  return [...xs].sort((a, b) => b - a);
}

function expectExpectationReal(
  ket: ComplexVector,
  op: ComplexMatrix,
  expected: number,
  label: string,
): void {
  const ev = expectationValue(ket, op);
  if (Math.abs(ev.im) > 1e-9) {
    throw new Error(
      `${label}: imaginary part ${ev.im} (expected 0 within 1e-9)`,
    );
  }
  approxEqualNumber(ev.re, expected);
}

// 23. buildSpinTensorProductSpace([1/2, 1/2]) — dimensions and totals.
check('buildSpinTensorProductSpace([1/2, 1/2]): dim 2,2 total 4', () => {
  const space = buildSpinTensorProductSpace([0.5, 0.5]);
  if (space.spins.length !== 2 || space.spins[0] !== 0.5 || space.spins[1] !== 0.5) {
    throw new Error(`unexpected spins ${JSON.stringify(space.spins)}`);
  }
  if (space.dimensions[0] !== 2 || space.dimensions[1] !== 2) {
    throw new Error(`unexpected dimensions ${JSON.stringify(space.dimensions)}`);
  }
  if (space.totalDimension !== 4) {
    throw new Error(`unexpected totalDimension ${space.totalDimension}`);
  }
});

// 24. buildSpinTensorProductSpace([1, 1/2]) — mixed-spin dimensions.
check('buildSpinTensorProductSpace([1, 1/2]): dim 3,2 total 6', () => {
  const space = buildSpinTensorProductSpace([1, 0.5]);
  if (space.dimensions[0] !== 3 || space.dimensions[1] !== 2) {
    throw new Error(`unexpected dimensions ${JSON.stringify(space.dimensions)}`);
  }
  if (space.totalDimension !== 6) {
    throw new Error(`unexpected totalDimension ${space.totalDimension}`);
  }
});

// 25. embeddedSpinOperator on first factor: equals Jz ⊗ I_2 explicitly.
check('embeddedSpinOperator([1/2,1/2], 0, z) = Jz ⊗ I_2', () => {
  const got = embeddedSpinOperator([0.5, 0.5], 0, 'z');
  const expected = tensorProductMatrices([spinJZ(0.5), identityMatrix(2)]);
  expectMatrix(got, expected, 'Jz⊗I_2');
});

// 26. embeddedSpinOperator on second factor: equals I_2 ⊗ Jz.
check('embeddedSpinOperator([1/2,1/2], 1, z) = I_2 ⊗ Jz', () => {
  const got = embeddedSpinOperator([0.5, 0.5], 1, 'z');
  const expected = tensorProductMatrices([identityMatrix(2), spinJZ(0.5)]);
  expectMatrix(got, expected, 'I_2⊗Jz');
});

// 27. totalSpinOperator(_, z) = Jz⊗I + I⊗Jz. Two independent checks:
//     (a) explicit composite diag(1, 0, 0, −1) (m_total in the
//         descending-m basis), and
//     (b) bottom-up reconstruction via addMatrices on the two
//         tensorProductMatrices embeddings.
check('totalSpinOperator([1/2,1/2], z) = Jz⊗I + I⊗Jz', () => {
  const got = totalSpinOperator([0.5, 0.5], 'z');
  const expectedDiag: ComplexMatrix = [
    [complex(1, 0), complex(0, 0), complex(0, 0), complex(0, 0)],
    [complex(0, 0), complex(0, 0), complex(0, 0), complex(0, 0)],
    [complex(0, 0), complex(0, 0), complex(0, 0), complex(0, 0)],
    [complex(0, 0), complex(0, 0), complex(0, 0), complex(-1, 0)],
  ];
  expectMatrix(got, expectedDiag, 'totalSpinOperator(_, z) = diag(1,0,0,−1)');

  const A = tensorProductMatrices([spinJZ(0.5), identityMatrix(2)]);
  const B = tensorProductMatrices([identityMatrix(2), spinJZ(0.5)]);
  expectMatrix(got, addMatrices(A, B), 'totalSpinOperator(_, z) = Jz⊗I + I⊗Jz');
});

// 28. totalSpinSquared([1/2, 1/2]) eigenvalues = {2, 2, 2, 0} (singlet
//     + triplet decomposition). Uses the Phase 9C-1 general
//     real-symmetric Jacobi eigensolver via `eigenvaluesHermitian`.
check('totalSpinSquared([1/2,1/2]) eigenvalues = {2, 2, 2, 0}', () => {
  const j2 = totalSpinSquared([0.5, 0.5]);
  const evs = eigenvaluesHermitian(j2);
  const sorted = sortedDescending(evs);
  if (sorted.length !== 4) {
    throw new Error(`expected 4 eigenvalues, got ${sorted.length}`);
  }
  approxEqualNumber(sorted[0], 2);
  approxEqualNumber(sorted[1], 2);
  approxEqualNumber(sorted[2], 2);
  approxEqualNumber(sorted[3], 0);
});

// 29. Singlet: normalised + ⟨S|J²|S⟩ = 0 + ⟨S|Jx_total|S⟩ = ⟨Jy⟩ = ⟨Jz⟩ = 0.
check('Singlet (2 × spin-1/2): normalised, ⟨J²⟩=0, ⟨Jx⟩=⟨Jy⟩=⟨Jz⟩=0', () => {
  const psi = singletStateTwoSpinHalf();
  approxEqualNumber(vectorNormSquared(psi), 1);
  const j2 = totalSpinSquared([0.5, 0.5]);
  const jx = totalSpinOperator([0.5, 0.5], 'x');
  const jy = totalSpinOperator([0.5, 0.5], 'y');
  const jz = totalSpinOperator([0.5, 0.5], 'z');
  expectExpectationReal(psi, j2, 0, '⟨S|J²|S⟩');
  expectExpectationReal(psi, jx, 0, '⟨S|Jx_total|S⟩');
  expectExpectationReal(psi, jy, 0, '⟨S|Jy_total|S⟩');
  expectExpectationReal(psi, jz, 0, '⟨S|Jz_total|S⟩');
});

// 30. Triplet: each normalised + ⟨T|J²|T⟩ = 2 + Jz expectations ±1, 0.
check('Triplet (2 × spin-1/2): ⟨J²⟩=2 each, ⟨Jz⟩=+1, 0, −1', () => {
  const t = tripletStatesTwoSpinHalf();
  const j2 = totalSpinSquared([0.5, 0.5]);
  const jz = totalSpinOperator([0.5, 0.5], 'z');
  for (const [label, ket, expectedJz] of [
    ['T+', t.plus, +1],
    ['T0', t.zero, 0],
    ['T-', t.minus, -1],
  ] as const) {
    approxEqualNumber(vectorNormSquared(ket), 1);
    expectExpectationReal(ket, j2, 2, `⟨${label}|J²|${label}⟩`);
    expectExpectationReal(ket, jz, expectedJz, `⟨${label}|Jz|${label}⟩`);
  }
});

// 31. Total commutators on [1/2, 1/2]: [Jx_total, Jy_total] = i Jz_total
//     and the two cyclic permutations. Hermitian generators on a
//     tensor product still satisfy the SU(2) Lie algebra.
check('Total commutators ([1/2,1/2]): [Jx,Jy]=iJz, cyclic', () => {
  const jx = totalSpinOperator([0.5, 0.5], 'x');
  const jy = totalSpinOperator([0.5, 0.5], 'y');
  const jz = totalSpinOperator([0.5, 0.5], 'z');
  const i_ = complex(0, 1);
  expectMatrix(commutator(jx, jy), scaleMatrix(jz, i_), '[Jx_t,Jy_t]=iJz_t');
  expectMatrix(commutator(jy, jz), scaleMatrix(jx, i_), '[Jy_t,Jz_t]=iJx_t');
  expectMatrix(commutator(jz, jx), scaleMatrix(jy, i_), '[Jz_t,Jx_t]=iJy_t');
});

// ======================================================================
// Phase 9D-2-a — real-symmetric Jacobi eigendecomposition with
// eigenvectors, plus the narrower Hermitian dispatcher.
// ======================================================================

/**
 * Reconstruct `A = V · diag(λ) · Vᵀ` from a real-symmetric
 * eigendecomposition. Used by the 9D-2-a tests to verify both that
 * eigenvalues are correct and that eigenvectors are orthonormal in
 * the original basis. Local helper — not exported from the engine.
 */
function reconstructFromRealEigendecomposition(
  eigenvalues: readonly number[],
  eigenvectors: ComplexMatrix,
): number[][] {
  const n = eigenvalues.length;
  const out: number[][] = Array.from({ length: n }, () =>
    new Array<number>(n).fill(0),
  );
  for (let i = 0; i < n; i++) {
    for (let j = 0; j < n; j++) {
      let s = 0;
      for (let k = 0; k < n; k++) {
        // V[i][k] · λ_k · V[j][k]  (Vᵀ has V[j][k] at row k, col j)
        s += eigenvectors[i]![k]!.re * eigenvalues[k]! * eigenvectors[j]![k]!.re;
      }
      out[i]![j] = s;
    }
  }
  return out;
}

/** Approximate equality for two `n × n` real matrices. */
function approxEqualRealMatrix(
  A: readonly (readonly number[])[],
  B: readonly (readonly number[])[],
  eps = 1e-9,
): boolean {
  if (A.length !== B.length) return false;
  for (let i = 0; i < A.length; i++) {
    if (A[i]!.length !== B[i]!.length) return false;
    for (let j = 0; j < A[i]!.length; j++) {
      if (Math.abs(A[i]![j]! - B[i]![j]!) > eps) return false;
    }
  }
  return true;
}

/**
 * Real-valued inner product of two real eigenvectors stored as
 * `ComplexMatrix` columns. The 9D-2-a eigendecomposition produces
 * `im = 0` everywhere, so we ignore the imaginary parts.
 */
function realDotColumn(
  V: ComplexMatrix,
  col: number,
  ket: ComplexVector,
): number {
  const n = ket.length;
  let s = 0;
  for (let i = 0; i < n; i++) {
    s += V[i]![col]!.re * ket[i]!.re;
  }
  return s;
}

// 32. Diagonal A = diag(3, 2, 1) — eigenvalues already sorted, V is
//     identity (Jacobi exits at iter 0 because every off-diagonal is
//     0). Reconstruction round-trips back to A exactly.
check('eigendecompositionRealSymmetricJacobi: diag(3, 2, 1)', () => {
  const A = [
    [3, 0, 0],
    [0, 2, 0],
    [0, 0, 1],
  ];
  const { eigenvalues, eigenvectors } = eigendecompositionRealSymmetricJacobi(A);
  if (eigenvalues.length !== 3) {
    throw new Error(`expected 3 eigenvalues, got ${eigenvalues.length}`);
  }
  approxEqualNumber(eigenvalues[0], 3);
  approxEqualNumber(eigenvalues[1], 2);
  approxEqualNumber(eigenvalues[2], 1);
  // V should be the identity (the diagonal already trivialises the
  // pivot search; Jacobi exits without rotating).
  const I3 = [
    [1, 0, 0],
    [0, 1, 0],
    [0, 0, 1],
  ];
  if (
    !approxEqualRealMatrix(
      eigenvectors.map((row) => row.map((c) => c.re)),
      I3,
    )
  ) {
    throw new Error('eigenvectors ≠ I_3 for diagonal input');
  }
  // Reconstruction.
  if (
    !approxEqualRealMatrix(
      reconstructFromRealEigendecomposition(eigenvalues, eigenvectors),
      A,
    )
  ) {
    throw new Error('A ≠ V · diag(λ) · Vᵀ');
  }
});

// 33. 2×2 symmetric A = [[2, 1], [1, 2]] — eigenvalues {3, 1};
//     eigenvectors (1,1)/√2 (for 3) and (1,-1)/√2 (for 1) up to sign.
check('eigendecompositionRealSymmetricJacobi: 2×2 symmetric [[2,1],[1,2]]', () => {
  const A = [
    [2, 1],
    [1, 2],
  ];
  const { eigenvalues, eigenvectors } = eigendecompositionRealSymmetricJacobi(A);
  approxEqualNumber(eigenvalues[0], 3);
  approxEqualNumber(eigenvalues[1], 1);
  const inv = 1 / Math.sqrt(2);
  // Column 0 (eigenvalue 3) is (±1, ±1) / √2 with equal signs.
  const v0_a = eigenvectors[0]![0]!.re;
  const v0_b = eigenvectors[1]![0]!.re;
  if (
    !(
      (Math.abs(v0_a - inv) < 1e-9 && Math.abs(v0_b - inv) < 1e-9) ||
      (Math.abs(v0_a + inv) < 1e-9 && Math.abs(v0_b + inv) < 1e-9)
    )
  ) {
    throw new Error(
      `eigenvector for λ=3 is (${v0_a}, ${v0_b}); expected ±(1,1)/√2`,
    );
  }
  // Column 1 (eigenvalue 1) is (±1, ∓1) / √2 with opposite signs.
  const v1_a = eigenvectors[0]![1]!.re;
  const v1_b = eigenvectors[1]![1]!.re;
  if (
    !(
      (Math.abs(v1_a - inv) < 1e-9 && Math.abs(v1_b + inv) < 1e-9) ||
      (Math.abs(v1_a + inv) < 1e-9 && Math.abs(v1_b - inv) < 1e-9)
    )
  ) {
    throw new Error(
      `eigenvector for λ=1 is (${v1_a}, ${v1_b}); expected ±(1,−1)/√2`,
    );
  }
  // Reconstruction.
  if (
    !approxEqualRealMatrix(
      reconstructFromRealEigendecomposition(eigenvalues, eigenvectors),
      A,
    )
  ) {
    throw new Error('A ≠ V · diag(λ) · Vᵀ');
  }
});

// 34. 3×3 symmetric A = [[2,1,0],[1,2,1],[0,1,2]] — closed-form
//     spectrum {2 + √2, 2, 2 − √2}. Verifies orthonormality
//     (Vᵀ V = I_3) and reconstruction A ≈ V · diag(λ) · Vᵀ.
check('eigendecompositionRealSymmetricJacobi: 3×3 tri-diagonal symmetric', () => {
  const A = [
    [2, 1, 0],
    [1, 2, 1],
    [0, 1, 2],
  ];
  const { eigenvalues, eigenvectors } = eigendecompositionRealSymmetricJacobi(A);
  if (eigenvalues.length !== 3) {
    throw new Error(`expected 3 eigenvalues, got ${eigenvalues.length}`);
  }
  approxEqualNumber(eigenvalues[0], 2 + Math.sqrt(2));
  approxEqualNumber(eigenvalues[1], 2);
  approxEqualNumber(eigenvalues[2], 2 - Math.sqrt(2));

  // Orthonormality: Vᵀ V = I.
  for (let p = 0; p < 3; p++) {
    for (let q = 0; q < 3; q++) {
      let s = 0;
      for (let i = 0; i < 3; i++) {
        s += eigenvectors[i]![p]!.re * eigenvectors[i]![q]!.re;
      }
      const expected = p === q ? 1 : 0;
      if (Math.abs(s - expected) > 1e-9) {
        throw new Error(
          `Vᵀ V[${p}][${q}] = ${s}, expected ${expected} (orthonormality failed)`,
        );
      }
    }
  }

  if (
    !approxEqualRealMatrix(
      reconstructFromRealEigendecomposition(eigenvalues, eigenvectors),
      A,
    )
  ) {
    throw new Error('A ≠ V · diag(λ) · Vᵀ');
  }
});

// 35. eigenvaluesRealSymmetricJacobi byte-equivalent to
//     eigendecompositionRealSymmetricJacobi(.).eigenvalues. The Phase
//     9D-2-a refactor must NOT change Phase 9C-1 eigenvalue outputs.
check('Phase 9D-2-a: eigenvaluesRealSymmetricJacobi delegates correctly', () => {
  const A = [
    [4, -1, 0, 1],
    [-1, 3, 0, 0],
    [0, 0, 2, -1],
    [1, 0, -1, 2],
  ];
  const evsOnly = eigenvaluesRealSymmetricJacobi(A);
  const decomp = eigendecompositionRealSymmetricJacobi(A);
  if (evsOnly.length !== decomp.eigenvalues.length) {
    throw new Error('eigenvalue lengths differ between solvers');
  }
  for (let i = 0; i < evsOnly.length; i++) {
    if (Math.abs(evsOnly[i]! - decomp.eigenvalues[i]!) > 1e-12) {
      throw new Error(
        `eigenvalues[${i}]: standalone=${evsOnly[i]} decomp=${decomp.eigenvalues[i]}`,
      );
    }
  }
});

// 36. totalSpinSquared([1/2,1/2]) singlet eigenvector detection:
//     spectrum {2, 2, 2, 0}; the eigenvector for the 0 eigenvalue
//     equals ± singletStateTwoSpinHalf within tolerance. Also confirms
//     the full reconstruction J² ≈ V · diag(λ) · Vᵀ (real-valued).
check('totalSpinSquared([1/2,1/2]): singlet eigenvector detected', () => {
  const j2 = totalSpinSquared([0.5, 0.5]);
  const { eigenvalues, eigenvectors } = eigendecompositionHermitian(j2);
  if (eigenvalues.length !== 4) {
    throw new Error(`expected 4 eigenvalues, got ${eigenvalues.length}`);
  }
  approxEqualNumber(eigenvalues[0], 2);
  approxEqualNumber(eigenvalues[1], 2);
  approxEqualNumber(eigenvalues[2], 2);
  approxEqualNumber(eigenvalues[3], 0);
  // Eigenvalue 0 sits at column 3 (descending order).
  const singlet = singletStateTwoSpinHalf();
  const inner = realDotColumn(eigenvectors, 3, singlet);
  if (Math.abs(Math.abs(inner) - 1) > 1e-9) {
    throw new Error(
      `|⟨v_singlet, S⟩| = ${Math.abs(inner)}, expected 1 (eigenvector not parallel to |S⟩)`,
    );
  }
  // Reconstruction: J² ≈ V · diag(λ) · Vᵀ. J² is real-symmetric here
  // (verified by Phase 9D-1 selftest #28 spectrum), so we can drop
  // imaginary parts.
  const j2real = j2.map((row) => row.map((c) => c.re));
  if (
    !approxEqualRealMatrix(
      reconstructFromRealEigendecomposition(eigenvalues, eigenvectors),
      j2real,
    )
  ) {
    throw new Error('J² ≠ V · diag(λ) · Vᵀ');
  }
});

// 37. Complex Hermitian eigendecomposition is unsupported in 9D-2-a —
//     `eigendecompositionHermitian` throws on a 2×2 with significant
//     imaginary off-diagonals (here `[[1, i], [-i, 1]]`). The matching
//     `eigenvaluesHermitian` still works because it has the analytic
//     2×2 path for complex Hermitian eigenvalues.
check('eigendecompositionHermitian: complex Hermitian throws (eigenvalues still works)', () => {
  const M: ComplexMatrix = [
    [complex(1, 0), complex(0, 1)],
    [complex(0, -1), complex(1, 0)],
  ];
  // Eigenvalues of [[1, i], [-i, 1]]: tr=2, det=1−|i|²=0 → λ ∈ {0, 2}.
  const evs = eigenvaluesHermitian(M);
  const sorted = [...evs].sort((a, b) => b - a);
  approxEqualNumber(sorted[0], 2);
  approxEqualNumber(sorted[1], 0);
  // Eigendecomposition refuses.
  let threw = false;
  try {
    eigendecompositionHermitian(M);
  } catch (err) {
    threw = true;
    if (err instanceof Error && !/complex/.test(err.message)) {
      throw new Error(
        `eigendecompositionHermitian threw, but message did not mention complex: ${err.message}`,
      );
    }
  }
  if (!threw) {
    throw new Error(
      'eigendecompositionHermitian unexpectedly accepted complex Hermitian input',
    );
  }
});

// ======================================================================
// Phase 9D-2-b — SU(2)-invariant subspace projector for a single node.
// ======================================================================

/**
 * Sanity-check helper for a Phase 9D-2-b projector P:
 *   • `P† ≈ P` (Hermitian),
 *   • `P · P ≈ P` (idempotent),
 *   • `Tr(P) ≈ expectedDim` (rank equals invariant dimension).
 * Throws on first failure with a label-prefixed message. Local helper.
 */
function expectProjectorSanity(
  P: ComplexMatrix,
  expectedDim: number,
  label: string,
): void {
  // Hermitian: P† = P element-wise.
  if (!approxEqualMatrix(dagger(P), P, 1e-9)) {
    throw new Error(`${label}: P† ≠ P (Hermitian failed)`);
  }
  // Idempotent: P² = P.
  if (!approxEqualMatrix(matMul(P, P), P, 1e-9)) {
    throw new Error(`${label}: P² ≠ P (idempotent failed)`);
  }
  // Rank: Tr(P) = expectedDim.
  const tr = trace(P);
  if (Math.abs(tr.im) > 1e-9) {
    throw new Error(`${label}: Tr(P).im = ${tr.im} (expected real)`);
  }
  if (Math.abs(tr.re - expectedDim) > 1e-9) {
    throw new Error(
      `${label}: Tr(P) = ${tr.re}, expected ${expectedDim} (rank failed)`,
    );
  }
}

// 38. [1/2, 1/2]: the simplest non-trivial intertwiner. Decomposition
//     is ½ ⊗ ½ = 0 ⊕ 1, so the j_total = 0 sector has dimension 1
//     and the projector equals |singlet⟩⟨singlet|. Verifies dimension,
//     basis-vector overlap with the textbook singlet, and projector
//     sanity (Hermitian, idempotent, rank).
check('invariantSubspaceProjector([1/2,1/2]): dim=1, P = |S⟩⟨S|', () => {
  const r = invariantSubspaceProjector([0.5, 0.5]);
  if (r.totalDimension !== 4) throw new Error(`totalDim ${r.totalDimension} ≠ 4`);
  if (r.invariantDimension !== 1) {
    throw new Error(`invariantDim ${r.invariantDimension} ≠ 1`);
  }
  if (r.keptEigenvalueIndices.length !== 1) {
    throw new Error(
      `keptIndices length ${r.keptEigenvalueIndices.length} ≠ 1`,
    );
  }
  // Basis column 0 should be ±|S⟩.
  const singlet = singletStateTwoSpinHalf();
  let inner = 0;
  for (let i = 0; i < 4; i++) {
    inner += r.basis[i]![0]!.re * singlet[i]!.re;
  }
  if (Math.abs(Math.abs(inner) - 1) > 1e-9) {
    throw new Error(
      `|⟨v_0, S⟩| = ${Math.abs(inner)}, expected 1 (basis ≠ ±|S⟩)`,
    );
  }
  expectProjectorSanity(r.projector, 1, '[1/2,1/2]');
  // Explicit comparison: P[i][j] = singlet[i] · conj(singlet[j]).
  // Since singlet has zero imaginary parts, this is just singlet[i]·singlet[j].
  for (let i = 0; i < 4; i++) {
    for (let j = 0; j < 4; j++) {
      const expected = singlet[i]!.re * singlet[j]!.re;
      const got = r.projector[i]![j]!.re;
      if (Math.abs(got - expected) > 1e-9) {
        throw new Error(
          `P[${i}][${j}] = ${got}, expected ${expected} (= S_i S_j)`,
        );
      }
    }
  }
});

// 39. [1/2, 1/2, 1/2, 1/2]: textbook 4-valent spin-½ intertwiner space
//     has dimension 2. Every basis column should be a J²-zero state.
check('invariantSubspaceProjector([1/2,1/2,1/2,1/2]): dim=2 + ⟨J²⟩=0 per column', () => {
  const spins = [0.5, 0.5, 0.5, 0.5];
  const r = invariantSubspaceProjector(spins);
  if (r.totalDimension !== 16) throw new Error(`totalDim ${r.totalDimension} ≠ 16`);
  if (r.invariantDimension !== 2) {
    throw new Error(`invariantDim ${r.invariantDimension} ≠ 2`);
  }
  expectProjectorSanity(r.projector, 2, '[1/2,1/2,1/2,1/2]');

  // For each kept basis column v, ⟨v|J²|v⟩ ≈ 0. Reconstruct the
  // column ket from `basis`, then take the expectation through the
  // existing 9D-1 helper.
  const j2 = totalSpinSquared(spins);
  for (let col = 0; col < r.invariantDimension; col++) {
    const ket: Complex[] = [];
    for (let i = 0; i < r.totalDimension; i++) {
      const cell = r.basis[i]![col]!;
      ket.push({ re: cell.re, im: cell.im });
    }
    const ev = expectationValue(ket, j2);
    if (Math.abs(ev.im) > 1e-9) {
      throw new Error(`column ${col}: ⟨v|J²|v⟩.im = ${ev.im}`);
    }
    if (Math.abs(ev.re) > 1e-8) {
      throw new Error(
        `column ${col}: ⟨v|J²|v⟩ = ${ev.re}, expected ≈ 0`,
      );
    }
  }
});

// 40. [1, 1]: 1 ⊗ 1 = 0 ⊕ 1 ⊕ 2 → invariant dimension 1.
check('invariantSubspaceProjector([1, 1]): dim=1', () => {
  const r = invariantSubspaceProjector([1, 1]);
  if (r.totalDimension !== 9) throw new Error(`totalDim ${r.totalDimension} ≠ 9`);
  if (r.invariantDimension !== 1) {
    throw new Error(`invariantDim ${r.invariantDimension} ≠ 1`);
  }
  expectProjectorSanity(r.projector, 1, '[1, 1]');
});

// 41. [1, 1/2, 1/2]: 1 ⊗ ½ ⊗ ½ = (½ ⊕ 3⁄2) ⊗ ½ = 0 ⊕ 1 ⊕ 1 ⊕ 2 →
//     invariant dimension 1. Total dimension = 3 · 2 · 2 = 12.
check('invariantSubspaceProjector([1, 1/2, 1/2]): dim=1, totalDim=12', () => {
  const r = invariantSubspaceProjector([1, 0.5, 0.5]);
  if (r.totalDimension !== 12) throw new Error(`totalDim ${r.totalDimension} ≠ 12`);
  if (r.invariantDimension !== 1) {
    throw new Error(`invariantDim ${r.invariantDimension} ≠ 1`);
  }
  expectProjectorSanity(r.projector, 1, '[1, 1/2, 1/2]');
});

// 42. [1/2]: a single spin-½ has no SU(2)-invariant sub-state (j_total =
//     ½ ≠ 0). invariantDimension = 0; basis is 2 × 0 (each row empty);
//     projector is the 2 × 2 zero matrix; Tr(P) = 0.
check('invariantSubspaceProjector([1/2]): dim=0, projector = 0', () => {
  const r = invariantSubspaceProjector([0.5]);
  if (r.totalDimension !== 2) throw new Error(`totalDim ${r.totalDimension} ≠ 2`);
  if (r.invariantDimension !== 0) {
    throw new Error(`invariantDim ${r.invariantDimension} ≠ 0`);
  }
  if (r.basis.length !== 2) throw new Error('basis row count ≠ totalDimension');
  for (let i = 0; i < 2; i++) {
    if (r.basis[i]!.length !== 0) {
      throw new Error(`basis row ${i} length ${r.basis[i]!.length} ≠ 0`);
    }
  }
  // Projector is 2 × 2 zero matrix.
  if (r.projector.length !== 2) throw new Error('projector row count ≠ 2');
  for (let i = 0; i < 2; i++) {
    if (r.projector[i]!.length !== 2) {
      throw new Error(`projector row ${i} length ≠ 2`);
    }
    for (let j = 0; j < 2; j++) {
      const c = r.projector[i]![j]!;
      if (Math.abs(c.re) > 1e-12 || Math.abs(c.im) > 1e-12) {
        throw new Error(`P[${i}][${j}] = (${c.re}, ${c.im}), expected 0`);
      }
    }
  }
  // Tr(P) = 0.
  const tr = trace(r.projector);
  if (Math.abs(tr.re) > 1e-12 || Math.abs(tr.im) > 1e-12) {
    throw new Error(`Tr(P) = (${tr.re}, ${tr.im}), expected 0`);
  }
});

// 43. Tolerance behaviour: tightening the tolerance to 1e-10 still
//     keeps the [1/2, 1/2] singlet (the j_total = 0 eigenvalue is
//     numerically zero within Jacobi's 1e-12 default, so any
//     tolerance ≫ 1e-12 captures it). The kept-indices length stays
//     1, the invariant dimension stays 1, and the tolerance recorded
//     in the result struct equals the input.
check('invariantSubspaceProjector([1/2,1/2], 1e-10): dim still 1', () => {
  const r = invariantSubspaceProjector([0.5, 0.5], 1e-10);
  if (r.tolerance !== 1e-10) {
    throw new Error(`tolerance recorded as ${r.tolerance}, expected 1e-10`);
  }
  if (r.invariantDimension !== 1) {
    throw new Error(`invariantDim ${r.invariantDimension} ≠ 1`);
  }
  expectProjectorSanity(r.projector, 1, '[1/2,1/2] tol 1e-10');
});

// ======================================================================
// Mega Phase 9E-2 — Bell-network graph contract + spin-1/2 gluing +
// minimal two-node prototype state.
// ======================================================================

/**
 * Helper: assert that `validateBellNetworkGraph(graph)` throws and
 * that the thrown error message contains `expectedSubstring`. Local
 * helper for the 9E-2 validation tests; not exported.
 */
function expectValidationError(
  graph: BellNetworkGraph,
  expectedSubstring: string,
  label: string,
): void {
  let thrown: unknown = undefined;
  try {
    validateBellNetworkGraph(graph);
  } catch (err) {
    thrown = err;
  }
  if (thrown === undefined) {
    throw new Error(`${label}: validation unexpectedly accepted invalid graph`);
  }
  const msg = thrown instanceof Error ? thrown.message : String(thrown);
  if (!msg.includes(expectedSubstring)) {
    throw new Error(
      `${label}: error message did not contain ${JSON.stringify(expectedSubstring)} ` +
        `(got: ${msg})`,
    );
  }
}

// 44. Duplicate node ids are rejected.
check('validateBellNetworkGraph: duplicate node ids rejected', () => {
  const bad: BellNetworkGraph = {
    nodes: [{ id: 'n0' }, { id: 'n0' }],
    edges: [{ id: 'e0', source: 'n0', target: 'n0', spin: 0.5 }],
  };
  expectValidationError(bad, 'duplicate node id', 'duplicate node ids');
});

// 45. Duplicate edge ids are rejected.
check('validateBellNetworkGraph: duplicate edge ids rejected', () => {
  const bad: BellNetworkGraph = {
    nodes: [{ id: 'n0' }, { id: 'n1' }],
    edges: [
      { id: 'e0', source: 'n0', target: 'n1', spin: 0.5 },
      { id: 'e0', source: 'n0', target: 'n1', spin: 0.5 },
    ],
  };
  expectValidationError(bad, 'duplicate edge id', 'duplicate edge ids');
});

// 46. Missing endpoint (source or target not in nodes) is rejected.
check('validateBellNetworkGraph: missing endpoint rejected', () => {
  const bad: BellNetworkGraph = {
    nodes: [{ id: 'n0' }, { id: 'n1' }],
    edges: [{ id: 'e0', source: 'n0', target: 'n_missing', spin: 0.5 }],
  };
  expectValidationError(bad, 'is not a known node', 'missing endpoint');
});

// 47. Self-loop (source === target) is rejected in this phase.
check('validateBellNetworkGraph: self-loop rejected', () => {
  const bad: BellNetworkGraph = {
    nodes: [{ id: 'n0' }, { id: 'n1' }],
    edges: [
      { id: 'e0', source: 'n0', target: 'n1', spin: 0.5 },
      { id: 'eLoop', source: 'n1', target: 'n1', spin: 0.5 },
    ],
  };
  expectValidationError(bad, 'self-loop', 'self-loop');
});

// 48. Non-half-integer spin (e.g. 0.3) is rejected via validateSpinJ.
check('validateBellNetworkGraph: invalid spin 0.3 rejected', () => {
  const bad: BellNetworkGraph = {
    nodes: [{ id: 'n0' }, { id: 'n1' }],
    edges: [{ id: 'e0', source: 'n0', target: 'n1', spin: 0.3 }],
  };
  expectValidationError(bad, '2j', 'invalid spin 0.3');
});

// 49. Negative spin is rejected.
check('validateBellNetworkGraph: negative spin rejected', () => {
  const bad: BellNetworkGraph = {
    nodes: [{ id: 'n0' }, { id: 'n1' }],
    edges: [{ id: 'e0', source: 'n0', target: 'n1', spin: -0.5 }],
  };
  expectValidationError(bad, 'non-negative', 'negative spin');
});

// 50. Parallel edges (multiple distinct edge ids with the same
//     source/target) are explicitly allowed because the dipole graph
//     requires them. The canonical dipole constructor must validate
//     without throwing.
check('validateBellNetworkGraph: parallel edges allowed (dipole)', () => {
  const dipole = createDipoleSpinHalfGraph();
  validateBellNetworkGraph(dipole);
});

// 51. Two-node single-edge graph summary: each node has spin tuple
//     [1/2], totalDimension 2, invariantDimension 0 (single spin-1/2
//     has no SU(2)-invariant sub-state).
check('summarizeBellNetworkGraph: two-node single-edge spin-1/2', () => {
  const graph = createTwoNodeSingleEdgeSpinHalfGraph();
  const summary = summarizeBellNetworkGraph(graph);
  if (summary.nodeSummaries.length !== 2) {
    throw new Error(
      `expected 2 node summaries, got ${summary.nodeSummaries.length}`,
    );
  }
  for (const ns of summary.nodeSummaries) {
    if (ns.spins.length !== 1 || ns.spins[0] !== 0.5) {
      throw new Error(
        `node ${ns.nodeId}: unexpected spins ${JSON.stringify(ns.spins)}`,
      );
    }
    if (ns.totalDimension !== 2) {
      throw new Error(
        `node ${ns.nodeId}: totalDim ${ns.totalDimension} ≠ 2`,
      );
    }
    if (ns.invariantDimension !== 0) {
      throw new Error(
        `node ${ns.nodeId}: invariantDim ${ns.invariantDimension} ≠ 0`,
      );
    }
  }
});

// 52. Dipole summary: two nodes, each with 4 incident edges, spin
//     tuple [1/2, 1/2, 1/2, 1/2], totalDim 16, invariantDim 2 (the
//     textbook 4-valent spin-1/2 intertwiner space).
check('summarizeBellNetworkGraph: dipole spin-1/2', () => {
  const graph = createDipoleSpinHalfGraph();
  const summary = summarizeBellNetworkGraph(graph);
  if (summary.nodeSummaries.length !== 2) {
    throw new Error(
      `expected 2 node summaries, got ${summary.nodeSummaries.length}`,
    );
  }
  const expectedEdgeIds = ['e0', 'e1', 'e2', 'e3'];
  for (const ns of summary.nodeSummaries) {
    if (ns.incidentEdgeIds.length !== 4) {
      throw new Error(
        `node ${ns.nodeId}: incidentEdgeIds.length ${ns.incidentEdgeIds.length} ≠ 4`,
      );
    }
    for (let i = 0; i < 4; i++) {
      if (ns.incidentEdgeIds[i] !== expectedEdgeIds[i]) {
        throw new Error(
          `node ${ns.nodeId}: incidentEdgeIds[${i}] = ${ns.incidentEdgeIds[i]}, ` +
            `expected ${expectedEdgeIds[i]}`,
        );
      }
    }
    if (ns.spins.length !== 4 || ns.spins.some((s) => s !== 0.5)) {
      throw new Error(
        `node ${ns.nodeId}: unexpected spins ${JSON.stringify(ns.spins)}`,
      );
    }
    if (ns.totalDimension !== 16) {
      throw new Error(
        `node ${ns.nodeId}: totalDim ${ns.totalDimension} ≠ 16`,
      );
    }
    if (ns.invariantDimension !== 2) {
      throw new Error(
        `node ${ns.nodeId}: invariantDim ${ns.invariantDimension} ≠ 2`,
      );
    }
  }
});

// 53. Cycle-4 summary: four nodes, each valence 2, spin tuple
//     [1/2, 1/2], totalDim 4, invariantDim 1 (singlet of two spin-1/2).
check('summarizeBellNetworkGraph: cycle-4 spin-1/2', () => {
  const graph = createCycle4SpinHalfGraph();
  const summary = summarizeBellNetworkGraph(graph);
  if (summary.nodeSummaries.length !== 4) {
    throw new Error(
      `expected 4 node summaries, got ${summary.nodeSummaries.length}`,
    );
  }
  for (const ns of summary.nodeSummaries) {
    if (ns.incidentEdgeIds.length !== 2) {
      throw new Error(
        `node ${ns.nodeId}: incidentEdgeIds.length ${ns.incidentEdgeIds.length} ≠ 2`,
      );
    }
    if (ns.spins.length !== 2 || ns.spins.some((s) => s !== 0.5)) {
      throw new Error(
        `node ${ns.nodeId}: unexpected spins ${JSON.stringify(ns.spins)}`,
      );
    }
    if (ns.totalDimension !== 4) {
      throw new Error(
        `node ${ns.nodeId}: totalDim ${ns.totalDimension} ≠ 4`,
      );
    }
    if (ns.invariantDimension !== 1) {
      throw new Error(
        `node ${ns.nodeId}: invariantDim ${ns.invariantDimension} ≠ 1`,
      );
    }
  }
});

// 54. spinHalfSingletState is normalised to ‖|ψ⟩‖² = 1.
check('spinHalfSingletState: ‖ket‖² = 1', () => {
  const ket = spinHalfSingletState();
  approxEqualNumber(vectorNormSquared(ket), 1);
});

// 55. spinHalfSingletState equals singletStateTwoSpinHalf byte-for-byte.
//     Both should produce [0, 1/√2, −1/√2, 0] in the same composite
//     basis pinned by Phase 9D-1.
check('spinHalfSingletState ≡ singletStateTwoSpinHalf', () => {
  const a = spinHalfSingletState();
  const b = singletStateTwoSpinHalf();
  if (a.length !== b.length) {
    throw new Error(`length mismatch: ${a.length} vs ${b.length}`);
  }
  for (let i = 0; i < a.length; i++) {
    if (Math.abs(a[i]!.re - b[i]!.re) > 1e-12) {
      throw new Error(`re[${i}]: ${a[i]!.re} vs ${b[i]!.re}`);
    }
    if (Math.abs(a[i]!.im - b[i]!.im) > 1e-12) {
      throw new Error(`im[${i}]: ${a[i]!.im} vs ${b[i]!.im}`);
    }
  }
});

// 56. spinHalfSingletState has ⟨J²_total⟩ = 0 on [1/2, 1/2].
//     Confirms the gluing primitive lives in the j_total = 0 sector
//     — i.e. it actually is the SU(2) singlet, not a triplet state.
check('spinHalfSingletState: ⟨J²⟩ = 0 on [1/2, 1/2]', () => {
  const ket = spinHalfSingletState();
  const j2 = totalSpinSquared([0.5, 0.5]);
  const ev = expectationValue(ket, j2);
  if (Math.abs(ev.im) > 1e-9) {
    throw new Error(`⟨J²⟩.im = ${ev.im} (expected 0)`);
  }
  approxEqualNumber(ev.re, 0);
});

// 57. buildMinimalSpinHalfBellNetworkState succeeds on the canonical
//     two-node single-edge graph: kind / dimension / normalised /
//     honesty marker all set, ket equals the spin-1/2 singlet.
check('buildMinimalSpinHalfBellNetworkState: two-node single-edge succeeds', () => {
  const graph = createTwoNodeSingleEdgeSpinHalfGraph();
  const state = buildMinimalSpinHalfBellNetworkState(graph);
  if (state.kind !== 'two-node-single-edge-spin-half') {
    throw new Error(`unexpected kind ${state.kind}`);
  }
  if (state.dimension !== 4) {
    throw new Error(`dimension ${state.dimension} ≠ 4`);
  }
  if (state.normalised !== true) {
    throw new Error(`normalised ${state.normalised} ≠ true`);
  }
  if (state.honesty !== 'minimal-spin-half-bell-network-prototype') {
    throw new Error(`unexpected honesty marker ${state.honesty}`);
  }
  approxEqualNumber(vectorNormSquared(state.ket), 1);
  // ket equals the spin-1/2 singlet primitive (byte-equal).
  const ref = spinHalfSingletState();
  for (let i = 0; i < 4; i++) {
    if (Math.abs(state.ket[i]!.re - ref[i]!.re) > 1e-12) {
      throw new Error(`ket.re[${i}]: ${state.ket[i]!.re} vs ${ref[i]!.re}`);
    }
    if (Math.abs(state.ket[i]!.im - ref[i]!.im) > 1e-12) {
      throw new Error(`ket.im[${i}]: ${state.ket[i]!.im} vs ${ref[i]!.im}`);
    }
  }
});

// 58. Dipole rejected with the explicit Phase 9E-2 scope error.
check('buildMinimalSpinHalfBellNetworkState(dipole): rejects with scope error', () => {
  const graph = createDipoleSpinHalfGraph();
  let thrown: unknown = undefined;
  try {
    buildMinimalSpinHalfBellNetworkState(graph);
  } catch (err) {
    thrown = err;
  }
  if (thrown === undefined) {
    throw new Error('dipole unexpectedly accepted by Phase 9E-2 prototype');
  }
  const msg = thrown instanceof Error ? thrown.message : String(thrown);
  if (!msg.includes('Phase 9E-2')) {
    throw new Error(
      `dipole rejection did not mention Phase 9E-2 (got: ${msg})`,
    );
  }
});

// 59. Cycle-4 rejected with the same explicit scope error.
check('buildMinimalSpinHalfBellNetworkState(cycle-4): rejects with scope error', () => {
  const graph = createCycle4SpinHalfGraph();
  let thrown: unknown = undefined;
  try {
    buildMinimalSpinHalfBellNetworkState(graph);
  } catch (err) {
    thrown = err;
  }
  if (thrown === undefined) {
    throw new Error('cycle-4 unexpectedly accepted by Phase 9E-2 prototype');
  }
  const msg = thrown instanceof Error ? thrown.message : String(thrown);
  if (!msg.includes('Phase 9E-2')) {
    throw new Error(
      `cycle-4 rejection did not mention Phase 9E-2 (got: ${msg})`,
    );
  }
});

// ======================================================================
// Mega Phase 9E-4 — edge-slot bookkeeping + spin-1/2 projected
// Bell-network state for dipole and cycle-4.
// ======================================================================

// 60. Dipole edge-slot bookkeeping: each node carries [e0,e1,e2,e3];
//     edge e2 maps source slot 2 / target slot 2 (parallel ordering).
check('canonicaliseEdgeSlots: dipole slot assignments', () => {
  const graph = createDipoleSpinHalfGraph();
  const bk = canonicaliseEdgeSlots(graph);
  if (bk.nodeSlots.length !== 2) {
    throw new Error(`expected 2 nodeSlots, got ${bk.nodeSlots.length}`);
  }
  for (const ns of bk.nodeSlots) {
    if (
      ns.incidentEdgeIds.length !== 4 ||
      ns.incidentEdgeIds[0] !== 'e0' ||
      ns.incidentEdgeIds[1] !== 'e1' ||
      ns.incidentEdgeIds[2] !== 'e2' ||
      ns.incidentEdgeIds[3] !== 'e3'
    ) {
      throw new Error(
        `node ${ns.nodeId}: incidentEdgeIds = ${JSON.stringify(ns.incidentEdgeIds)}`,
      );
    }
  }
  // Edge e2 should resolve to (n0:slot2, n1:slot2).
  const e2 = bk.edgeSlots.find((es) => es.edgeId === 'e2');
  if (!e2) throw new Error('edgeSlots missing e2');
  if (
    e2.source.nodeId !== 'n0' ||
    e2.source.slotIndex !== 2 ||
    e2.target.nodeId !== 'n1' ||
    e2.target.slotIndex !== 2
  ) {
    throw new Error(
      `e2 resolved unexpectedly: ${JSON.stringify(e2)}`,
    );
  }
});

// 61. Cycle-4 edge-slot bookkeeping: with constructor edges
//     e0:n0-n1, e1:n1-n2, e2:n2-n3, e3:n3-n0, node n0's incident
//     list (in graph.edges order) is [e0, e3]. Edge e3 maps
//     source slot 1 (at n3) / target slot 1 (at n0).
check('canonicaliseEdgeSlots: cycle-4 slot assignments', () => {
  const graph = createCycle4SpinHalfGraph();
  const bk = canonicaliseEdgeSlots(graph);
  if (bk.nodeSlots.length !== 4) {
    throw new Error(`expected 4 nodeSlots, got ${bk.nodeSlots.length}`);
  }
  // n0 incident: [e0 (source=n0), e3 (target=n0)].
  const n0 = bk.nodeSlots.find((ns) => ns.nodeId === 'n0');
  if (
    !n0 ||
    n0.incidentEdgeIds.length !== 2 ||
    n0.incidentEdgeIds[0] !== 'e0' ||
    n0.incidentEdgeIds[1] !== 'e3'
  ) {
    throw new Error(
      `n0 incidentEdgeIds = ${JSON.stringify(n0?.incidentEdgeIds)} ≠ [e0, e3]`,
    );
  }
  // Edge e3: source n3 slot 1, target n0 slot 1.
  const e3 = bk.edgeSlots.find((es) => es.edgeId === 'e3');
  if (
    !e3 ||
    e3.source.nodeId !== 'n3' ||
    e3.source.slotIndex !== 1 ||
    e3.target.nodeId !== 'n0' ||
    e3.target.slotIndex !== 1
  ) {
    throw new Error(`e3 resolved unexpectedly: ${JSON.stringify(e3)}`);
  }
});

// 62. Dipole link-singlet product ket: norm 1 (slots disjoint, each
//     edge contributes a normalised singlet on its own slot pair).
check('buildSpinHalfLinkSingletProductKet: dipole has unit norm', () => {
  const graph = createDipoleSpinHalfGraph();
  const bk = canonicaliseEdgeSlots(graph);
  const layout = buildEndpointLayout(graph, bk);
  if (layout.endpointDimension !== 256) {
    throw new Error(`dipole endpointDim ${layout.endpointDimension} ≠ 256`);
  }
  const linkKet = buildSpinHalfLinkSingletProductKet(graph, bk, layout);
  approxEqualNumber(vectorNormSquared(linkKet), 1);
});

// 63. Cycle-4 link-singlet product ket: norm 1.
check('buildSpinHalfLinkSingletProductKet: cycle-4 has unit norm', () => {
  const graph = createCycle4SpinHalfGraph();
  const bk = canonicaliseEdgeSlots(graph);
  const layout = buildEndpointLayout(graph, bk);
  if (layout.endpointDimension !== 256) {
    throw new Error(`cycle-4 endpointDim ${layout.endpointDimension} ≠ 256`);
  }
  const linkKet = buildSpinHalfLinkSingletProductKet(graph, bk, layout);
  approxEqualNumber(vectorNormSquared(linkKet), 1);
});

// 64. Dipole projected state: kind, dimensions, normalisation,
//     idempotence (P · ket ≈ ket), invariantCoefficients length and
//     norm, honesty marker.
check('buildSpinHalfProjectedBellNetworkState: dipole succeeds', () => {
  const graph = createDipoleSpinHalfGraph();
  const state = buildSpinHalfProjectedBellNetworkState(graph);
  if (state.kind !== 'dipole-spin-half-projected') {
    throw new Error(`kind ${state.kind} ≠ dipole-spin-half-projected`);
  }
  if (state.endpointDimension !== 256) {
    throw new Error(`endpointDim ${state.endpointDimension} ≠ 256`);
  }
  if (
    state.perNodeInvariantDimensions.length !== 2 ||
    state.perNodeInvariantDimensions[0] !== 2 ||
    state.perNodeInvariantDimensions[1] !== 2
  ) {
    throw new Error(
      `perNodeInvariantDimensions = ${JSON.stringify(state.perNodeInvariantDimensions)} ≠ [2, 2]`,
    );
  }
  if (state.invariantDimension !== 4) {
    throw new Error(`invariantDim ${state.invariantDimension} ≠ 4`);
  }
  if (state.invariantCoefficients.length !== 4) {
    throw new Error(
      `invariantCoefficients length ${state.invariantCoefficients.length} ≠ 4`,
    );
  }
  if (!state.normalised) throw new Error('endpointKet not normalised');
  approxEqualNumber(vectorNormSquared(state.endpointKet), 1);
  approxEqualNumber(vectorNormSquared(state.invariantCoefficients), 1);
  if (state.honesty !== 'spin-half-projected-bell-network-state') {
    throw new Error(`unexpected honesty marker ${state.honesty}`);
  }
  if (!(state.normBeforeProjectionNormalisation > 1e-12)) {
    throw new Error(
      `normBefore ${state.normBeforeProjectionNormalisation} ≤ 1e-12`,
    );
  }
  // P · endpointKet ≈ endpointKet (idempotence sanity).
  const gnp = buildGlobalNodeProjector(graph);
  const reapplied = matrixVectorMultiply(gnp.projector, state.endpointKet);
  for (let i = 0; i < state.endpointKet.length; i++) {
    if (
      Math.abs(reapplied[i]!.re - state.endpointKet[i]!.re) > 1e-9 ||
      Math.abs(reapplied[i]!.im - state.endpointKet[i]!.im) > 1e-9
    ) {
      throw new Error(`P · endpointKet[${i}] ≠ endpointKet[${i}]`);
    }
  }
});

// 65. Cycle-4 projected state: same checks. Each node has invariant
//     dim 1, so the global invariant subspace is 1-dimensional and
//     `invariantCoefficients` is a single complex number with
//     |coefficient| = 1 after normalisation.
check('buildSpinHalfProjectedBellNetworkState: cycle-4 succeeds', () => {
  const graph = createCycle4SpinHalfGraph();
  const state = buildSpinHalfProjectedBellNetworkState(graph);
  if (state.kind !== 'cycle4-spin-half-projected') {
    throw new Error(`kind ${state.kind} ≠ cycle4-spin-half-projected`);
  }
  if (state.endpointDimension !== 256) {
    throw new Error(`endpointDim ${state.endpointDimension} ≠ 256`);
  }
  if (
    state.perNodeInvariantDimensions.length !== 4 ||
    state.perNodeInvariantDimensions.some((d) => d !== 1)
  ) {
    throw new Error(
      `perNodeInvariantDimensions = ${JSON.stringify(state.perNodeInvariantDimensions)} ≠ [1,1,1,1]`,
    );
  }
  if (state.invariantDimension !== 1) {
    throw new Error(`invariantDim ${state.invariantDimension} ≠ 1`);
  }
  if (state.invariantCoefficients.length !== 1) {
    throw new Error(
      `invariantCoefficients length ${state.invariantCoefficients.length} ≠ 1`,
    );
  }
  if (!state.normalised) throw new Error('endpointKet not normalised');
  approxEqualNumber(vectorNormSquared(state.endpointKet), 1);
  approxEqualNumber(vectorNormSquared(state.invariantCoefficients), 1);
  if (state.honesty !== 'spin-half-projected-bell-network-state') {
    throw new Error(`unexpected honesty marker ${state.honesty}`);
  }
  if (!(state.normBeforeProjectionNormalisation > 1e-12)) {
    throw new Error(
      `normBefore ${state.normBeforeProjectionNormalisation} ≤ 1e-12`,
    );
  }
  // P · endpointKet ≈ endpointKet.
  const gnp = buildGlobalNodeProjector(graph);
  const reapplied = matrixVectorMultiply(gnp.projector, state.endpointKet);
  for (let i = 0; i < state.endpointKet.length; i++) {
    if (
      Math.abs(reapplied[i]!.re - state.endpointKet[i]!.re) > 1e-9 ||
      Math.abs(reapplied[i]!.im - state.endpointKet[i]!.im) > 1e-9
    ) {
      throw new Error(`P · endpointKet[${i}] ≠ endpointKet[${i}]`);
    }
  }
});

// 66. Two-node single-edge graph rejected by the projected builder
//     (each node has spins [1/2] ⇒ invariant dim 0). The minimal
//     prototype builder still succeeds — selftest #57 already covers
//     that — and the projected builder routes this through the
//     "Phase 9E-4 supports only…" scope error.
check('buildSpinHalfProjectedBellNetworkState: two-node single-edge rejects', () => {
  const graph = createTwoNodeSingleEdgeSpinHalfGraph();
  let thrown: unknown = undefined;
  try {
    buildSpinHalfProjectedBellNetworkState(graph);
  } catch (err) {
    thrown = err;
  }
  if (thrown === undefined) {
    throw new Error('two-node single-edge unexpectedly accepted by 9E-4 builder');
  }
  const msg = thrown instanceof Error ? thrown.message : String(thrown);
  if (!msg.includes('Phase 9E-4')) {
    throw new Error(
      `two-node single-edge rejection did not mention Phase 9E-4 (got: ${msg})`,
    );
  }
});

// 67. An arbitrary-shape spin-1/2 graph (e.g. 3-node line of 2 edges)
//     passes graph validation but is rejected by the projected
//     builder via the shape-recognition guard.
check('buildSpinHalfProjectedBellNetworkState: arbitrary 3-node line rejects', () => {
  const arbitrary: BellNetworkGraph = {
    nodes: [{ id: 'n0' }, { id: 'n1' }, { id: 'n2' }],
    edges: [
      { id: 'e0', source: 'n0', target: 'n1', spin: 0.5 },
      { id: 'e1', source: 'n1', target: 'n2', spin: 0.5 },
    ],
  };
  // Validation passes by itself.
  validateBellNetworkGraph(arbitrary);
  // Projected builder rejects by shape.
  let thrown: unknown = undefined;
  try {
    buildSpinHalfProjectedBellNetworkState(arbitrary);
  } catch (err) {
    thrown = err;
  }
  if (thrown === undefined) {
    throw new Error('3-node line unexpectedly accepted by 9E-4 builder');
  }
  const msg = thrown instanceof Error ? thrown.message : String(thrown);
  if (!msg.includes('Phase 9E-4')) {
    throw new Error(
      `3-node line rejection did not mention Phase 9E-4 (got: ${msg})`,
    );
  }
});

// ----------------------------------------------------------------------
// Report. Process exits non-zero on any failure so the validator
// script can detect failure via the child-process exit status.
// ----------------------------------------------------------------------

let failed = 0;
for (const r of results) {
  if (r.passed) {
    console.log(`  ✔ ${r.name}`);
  } else {
    failed += 1;
    console.error(`  ✗ ${r.name}`);
    if (r.details) console.error(`      ${r.details}`);
  }
}

if (failed > 0) {
  console.error(`\nquantum-engine: ${failed}/${results.length} self-checks FAILED`);
  process.exit(1);
}

console.log(
  `\nquantum-engine: ${results.length}/${results.length} self-checks pass`,
);
