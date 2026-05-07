/**
 * Phase 9B — engine-preview adapter.
 *
 * Pure TypeScript. No React, no i18n. Maps the active app
 * configuration (graph topology + state family) to a deterministic
 * choice of minimal qubit state for the Correlation Summary panel's
 * Engine Preview section.
 *
 * **Honesty discipline.** This mapping is **not** an LQG mapping. It
 * is a deliberately simple, curated choice that lets the engine
 * surface a non-trivial entanglement signature without claiming any
 * correspondence to SU(2) intertwiner-space states. The Phase 9A
 * engine itself computes exact finite-dimensional quantum-information
 * observables on whatever state the adapter selects; this file only
 * picks which minimal qubit state gets fed in.
 *
 * Mapping (deliberately simple, curated):
 *
 *   dipole + uncorrelated  → product, 2 qubits   (mappingKind: dipoleProduct)
 *   dipole + anything else → bell-pair, 2 qubits (mappingKind: dipoleBell)
 *   cycle4 + uncorrelated  → product, 4 qubits   (mappingKind: cycle4Product)
 *   cycle4 + anything else → ghz, 4 qubits       (mappingKind: cycle4Ghz)
 *
 * Every selection carries the `honesty: 'minimal-qubit-model'` literal
 * that downstream UI MUST surface (per the CLAUDE.md
 * *Phase 9A engine honesty (minimal qubit model)* constraint).
 *
 * Upgrade path: when the SU(2) engine arrives in Phase 9C+, this
 * adapter will be replaced by an LQG-aware mapping that reads
 * topology + state-family arrays and produces an actual SU(2)
 * intertwiner-space state. The current `mappingKind` enum is closed
 * so adding a new kind is a deliberate API extension, not an
 * accidental one.
 */

import type { GraphTopologyId, StateFamily } from '../../types/graph';
import type { MinimalQubitGraphStateKind } from '../quantum-engine';

/**
 * Closed enum of mapping outcomes, one per (topology × correlated?) cell.
 * Drives both the displayed reason text (i18n key under
 * `lab.correlations.enginePreview.mappingReasons.<kind>`) and any
 * future analytics or test fixture lookups.
 */
export type MappingKind =
  | 'dipoleProduct'
  | 'dipoleBell'
  | 'cycle4Product'
  | 'cycle4Ghz';

/**
 * Resolved engine-preview selection for the active app config. Carries
 * the engine `stateKind` and `numQubits` that `buildMinimalQubitGraphState`
 * will be invoked with, plus the i18n-friendly `mappingKind` and the
 * mandatory `honesty` literal.
 */
export interface EnginePreviewSelection {
  stateKind: MinimalQubitGraphStateKind;
  numQubits: number;
  mappingKind: MappingKind;
  honesty: 'minimal-qubit-model';
}

/**
 * Pick a minimal qubit state for the Engine Preview panel based on
 * the active topology + family. Pure function, deterministic, no
 * side effects.
 */
export function selectMinimalQubitPreview(
  graphTopology: GraphTopologyId,
  stateFamily: StateFamily,
): EnginePreviewSelection {
  const isUncorrelated = stateFamily === 'uncorrelated';

  switch (graphTopology) {
    case 'dipole':
      return isUncorrelated
        ? {
            stateKind: 'product',
            numQubits: 2,
            mappingKind: 'dipoleProduct',
            honesty: 'minimal-qubit-model',
          }
        : {
            stateKind: 'bell-pair',
            numQubits: 2,
            mappingKind: 'dipoleBell',
            honesty: 'minimal-qubit-model',
          };

    case 'cycle4':
      return isUncorrelated
        ? {
            stateKind: 'product',
            numQubits: 4,
            mappingKind: 'cycle4Product',
            honesty: 'minimal-qubit-model',
          }
        : {
            stateKind: 'ghz',
            numQubits: 4,
            mappingKind: 'cycle4Ghz',
            honesty: 'minimal-qubit-model',
          };
  }
}
