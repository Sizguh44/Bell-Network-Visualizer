/**
 * Phase 9A — quantum-engine public API.
 *
 * The engine is **pure TypeScript**. It does not import React, i18n,
 * or any DOM-aware code. UI integration (Phase 9B) will happen in a
 * separate feature folder; this index only exposes the engine itself.
 *
 * **Honesty discipline.** Every public output of this engine is
 * exact finite-dimensional quantum-information arithmetic on a
 * minimal qubit model. None of it is an SU(2) intertwiner-space
 * computation, an LQG Bell-network observable, or any other
 * geometric-operator expectation value. UIs that surface engine
 * results MUST display them as "minimal qubit model" outputs and
 * MUST NOT label them as exact LQG results.
 *
 * Upgrade path: Phase 9C+ replaces the qubit Hilbert factors in
 * `quantumState` and `graphState` with SU(2) representation factors
 * and intertwiner-space states. The `complex`, `linearAlgebra`,
 * `densityMatrix`, `partialTrace`, and `entropy` layers stay
 * unchanged because they operate on plain `ComplexMatrix` / `ComplexVector`
 * regardless of the physical interpretation of the basis.
 */

// --- Complex-number layer -------------------------------------------
export type { Complex } from './complex';
export {
  ZERO,
  ONE,
  complex,
  add,
  sub,
  mul,
  conj,
  abs2,
  scale,
  approxEqualComplex,
} from './complex';

// --- Linear-algebra layer -------------------------------------------
export type { ComplexVector, ComplexMatrix } from './linearAlgebra';
export {
  zeroVector,
  zeroMatrix,
  identityMatrix,
  outerProductKetBra,
  trace,
  dagger,
  matMul,
  vectorNormSquared,
  normalizeStateVector,
  approxEqualMatrix,
  // Phase 9C-3 small generic helpers (sum, scale, commutator):
  addMatrices,
  scaleMatrix,
  commutator,
  // Phase 9D-1 expectation-value helper:
  expectationValue,
  // Mega Phase 9E-4 matrix-vector helper:
  matrixVectorMultiply,
} from './linearAlgebra';

// --- State constructors ---------------------------------------------
export {
  basisState,
  tensorProductVector,
  tensorProductMatrix,
  bellPhiPlus,
  productZeroState,
  ghzState,
  validateNormalizedState,
} from './quantumState';

// --- Density matrices -----------------------------------------------
export {
  pureDensityMatrix,
  validateDensityMatrix,
  purity,
} from './densityMatrix';

// --- Partial trace --------------------------------------------------
export {
  partialTraceQubits,
  intToBits,
  bitsToInt,
  projectBits,
} from './partialTrace';

// --- Entropy --------------------------------------------------------
export type {
  HermitianEigenvalues,
  JacobiOptions,
  // Phase 9D-2-a eigendecomposition return types:
  RealSymmetricEigendecomposition,
  HermitianEigendecomposition,
} from './entropy';
export {
  eigenvaluesHermitian2x2,
  // Phase 9C-1 generalised entropy / eigensolver:
  isEffectivelyRealHermitian,
  hermitianToRealSymmetric,
  eigenvaluesRealSymmetricJacobi,
  eigenvaluesHermitian,
  vonNeumannEntropy,
  binaryEntropy,
  // Phase 9D-2-a eigendecomposition with eigenvectors:
  eigendecompositionRealSymmetricJacobi,
  eigendecompositionHermitian,
} from './entropy';

// --- Minimal-qubit graph states -------------------------------------
export type {
  MinimalQubitGraphStateKind,
  MinimalQubitGraphState,
} from './graphState';
export { buildMinimalQubitGraphState } from './graphState';

// --- High-level convenience -----------------------------------------
export type { SingleQubitEntropy } from './singleQubitEntropies';
export { computeSingleQubitEntropies } from './singleQubitEntropies';

// --- Phase 9B.5 / 9C-1 mutual information --------------------------
export type { MutualInformationResult } from './mutualInformation';
export {
  mutualInformationForTwoQubitPureState,
  // Phase 9C-1 general subsystem MI:
  mutualInformationQubitSubsystems,
  maybeComputePreviewMutualInformation,
} from './mutualInformation';

// --- Phase 9C-2 pairwise mutual-information matrix -----------------
export type {
  PairwiseMutualInformationCell,
  PairwiseMutualInformationMatrix,
} from './pairwiseMutualInformation';
export { computePairwiseMutualInformationMatrix } from './pairwiseMutualInformation';

// --- Phase 9C-3 SU(2) spin-j representation building blocks --------
export type { SpinJ, SpinJRepresentation } from './spinRepresentation';
export {
  validateSpinJ,
  spinDimension,
  magneticNumbers,
  spinJPlus,
  spinJMinus,
  spinJX,
  spinJY,
  spinJZ,
  spinCasimir,
  buildSpinJRepresentation,
} from './spinRepresentation';

// --- Phase 9D-1 tensor-product spin spaces + total-J operators -----
export type {
  SpinAxis,
  SpinTensorProductSpace,
  TripletStatesTwoSpinHalf,
} from './spinTensorProduct';
export {
  tensorProductMatrices,
  buildSpinTensorProductSpace,
  embeddedSpinOperator,
  totalSpinOperator,
  totalSpinSquared,
  singletStateTwoSpinHalf,
  tripletStatesTwoSpinHalf,
} from './spinTensorProduct';

// --- Phase 9D-2-b SU(2)-invariant subspace projector ---------------
export type { InvariantSubspaceProjector } from './invariantSubspace';
export { invariantSubspaceProjector } from './invariantSubspace';

// --- Mega Phase 9E-2 Bell-network graph contract -------------------
export type {
  BellNetworkNodeId,
  BellNetworkEdgeId,
  BellNetworkNode,
  BellNetworkEdge,
  BellNetworkGraph,
  BellNetworkNodeIntertwinerSummary,
  BellNetworkGraphSummary,
} from './bellNetworkGraph';
export {
  validateBellNetworkGraph,
  incidentEdgesForNode,
  incidentEdgeIdsForNode,
  spinsForNode,
  summarizeBellNetworkGraph,
  createTwoNodeSingleEdgeSpinHalfGraph,
  createDipoleSpinHalfGraph,
  createCycle4SpinHalfGraph,
} from './bellNetworkGraph';

// --- Mega Phase 9E-2 spin-1/2 edge gluing primitive ----------------
export {
  spinHalfSingletState,
  validateSpinHalfEdge,
  assertAllEdgesSpinHalf,
} from './spinHalfGluing';

// --- Mega Phase 9E-2 minimal Bell-network state prototype ----------
export type {
  MinimalBellNetworkStateKind,
  MinimalBellNetworkState,
} from './minimalBellNetworkState';
export { buildMinimalSpinHalfBellNetworkState } from './minimalBellNetworkState';

// --- Mega Phase 9E-4 edge-slot bookkeeping --------------------------
export type {
  NodeSlotAssignment,
  EdgeEndpointSlot,
  EdgeSlotAssignment,
  BellNetworkSlotBookkeeping,
} from './edgeSlotBookkeeping';
export { canonicaliseEdgeSlots } from './edgeSlotBookkeeping';

// --- Mega Phase 9E-4 spin-1/2 projected Bell-network state ----------
export type {
  SpinHalfProjectedBellNetworkStateKind,
  SpinHalfProjectedBellNetworkState,
  EndpointSlotRef,
  EndpointLayout,
  GlobalNodeProjector,
} from './spinHalfBellNetworkState';
export {
  buildEndpointLayout,
  buildSpinHalfLinkSingletProductKet,
  buildGlobalNodeProjector,
  buildSpinHalfProjectedBellNetworkState,
} from './spinHalfBellNetworkState';
