import type {
  EdgeDetail,
  GraphEdge,
  ObservableMode,
  StateFamilyPreset,
} from '../../types/graph';
import { PAIR_COLORS } from '../../data/dipoleGraph';
import {
  MAX_MISMATCH_DEG,
  computePairSnapshot,
  mean,
  type PairSnapshot,
} from './deriveCorrelationState';
import { clamp } from '../../utils/format';

/**
 * Compute the [0, 1] visual emphasis of a single pair under the current
 * observable lens. The DipoleGraphView multiplies opacity and stroke width by
 * this value, so the active lens literally tells the canvas what to highlight.
 */
function computeEmphasis(
  snap: PairSnapshot,
  mode: ObservableMode,
  meanAlignment: number,
): number {
  switch (mode) {
    case 'alignment':
      return clamp(snap.localAlignmentScore, 0, 1);
    case 'mismatch':
      return clamp(snap.localMismatchAngle / MAX_MISMATCH_DEG, 0, 1);
    case 'gluing':
      return clamp(snap.localGluingProxy, 0, 1);
    case 'correlation':
      return clamp(snap.localStrength, 0, 1);
    case 'uniformity': {
      // Deviation from the family mean alignment; symmetric families read as
      // low-emphasis everywhere (a small baseline keeps the graph visible).
      const abs = Math.abs(snap.localAlignmentScore - meanAlignment);
      return clamp(0.25 + 0.75 * (abs / 0.5), 0, 1);
    }
  }
}

/**
 * Build one Face Pair Detail per edge for the currently selected family,
 * global strength and observable lens. Shares `computePairSnapshot` with the
 * global derivation so per-pair numbers and aggregate metrics always agree.
 */
export function deriveEdgeDetails(
  edges: readonly GraphEdge[],
  strength: number,
  family: StateFamilyPreset,
  observableMode: ObservableMode,
): EdgeDetail[] {
  const snapshots = edges.map((_, i) => computePairSnapshot(family, i, strength));
  const meanAlignment = mean(snapshots.map((s) => s.localAlignmentScore));

  return edges.map((edge, i) => {
    const snap = snapshots[i] ?? {
      localStrength: 0,
      localMismatchAngle: 0,
      localAlignmentScore: 0,
      localGluingProxy: 0,
    };
    const narrative = family.edgeNarratives[i] ?? '';
    const deviationFromMean = snap.localAlignmentScore - meanAlignment;
    const emphasis = computeEmphasis(snap, observableMode, meanAlignment);

    return {
      edgeId: edge.id,
      pairIndex: i,
      label: `Pair ${i + 1}`,
      color: PAIR_COLORS[i % PAIR_COLORS.length] ?? '#ffffff',
      localStrength: snap.localStrength,
      localMismatchAngle: snap.localMismatchAngle,
      localAlignmentScore: snap.localAlignmentScore,
      localGluingProxy: snap.localGluingProxy,
      familyId: family.id,
      familyLabel: family.label,
      narrative,
      deviationFromMean,
      emphasis,
    };
  });
}
