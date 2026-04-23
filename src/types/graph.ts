export type StateFamily =
  | 'uncorrelated'
  | 'weakAligned'
  | 'bellSymmetric'
  | 'frustrated'
  | 'edgeBiased';

export type ObservableMode =
  | 'alignment'
  | 'mismatch'
  | 'gluing'
  | 'correlation'
  | 'uniformity';

export interface GraphNode {
  id: string;
  label?: string;
  position: { x: number; y: number; z?: number };
  intertwiner?: number;
}

export interface GraphEdge {
  id: string;
  source: string;
  target: string;
  spin: number;
}

export type GraphTopologyId = 'dipole' | 'cycle4';

export interface DemoConfig {
  demoMode: boolean;
  stateFamily: StateFamily;
  entanglementStrength: number;
  observableMode: ObservableMode;
  graphTopology: GraphTopologyId;
}

/**
 * A toy graph topology bundle. Each topology ships its own nodes and edges
 * plus a few authoring-level notes. Both current topologies expose exactly
 * four face pairs, so state families (which define four-element offset and
 * mismatch arrays) work on either without modification.
 */
export interface GraphTopology {
  id: GraphTopologyId;
  label: string;
  shortDescription: string;
  symmetryNote: string;
  nodes: readonly GraphNode[];
  edges: readonly GraphEdge[];
  /** Number of face pairs (edges). Must match family array lengths. */
  pairCount: number;
}

export interface CorrelationState {
  antiParallelScore: number;
  mutualInformationProxy: number;
  gluingScore: number;
}

export interface EdgeDetail {
  edgeId: string;
  pairIndex: number;
  label: string;
  color: string;
  localStrength: number;
  localMismatchAngle: number;
  localAlignmentScore: number;
  localGluingProxy: number;
  familyId: StateFamily;
  familyLabel: string;
  narrative: string;
  /** Deviation of this pair's alignment from the family-level mean. */
  deviationFromMean: number;
  /** [0, 1] visual emphasis under the current observable lens. */
  emphasis: number;
}

export interface StateFamilyPreset {
  id: StateFamily;
  label: string;
  shortDescription: string;
  defaultStrength: number;
  strengthOffsets: readonly number[];
  mismatchCoeff: readonly number[];
  edgeNarratives: readonly string[];
}

/**
 * A choice of "how to read" a state — which toy observable the user wants the
 * global summary, the per-pair detail and the visualization emphasis to track.
 */
export interface ObservableDefinition {
  id: ObservableMode;
  label: string;
  shortDescription: string;
  interpretation: string;
  /** `true` = higher-is-better, `false` = lower-is-better, `null` = neutral. */
  largerIsBetter: boolean | null;
  /** Display suffix for the headline number (e.g. `'°'`). */
  unit: string;
  /** Decimal precision for the headline display. */
  headlineDigits: number;
}

/**
 * Output of `deriveObservableSummary`. Packaged for the `ObservableSummaryCard`.
 */
export interface ObservableSummary {
  id: ObservableMode;
  label: string;
  headlineValue: number;
  headlineDisplay: string;
  secondaryValue: number;
  secondaryLabel: string;
  status: string;
  interpretation: string;
  caution?: string;
}
