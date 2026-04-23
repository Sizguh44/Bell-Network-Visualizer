import type { CorrelationState, StateFamilyPreset } from '../../types/graph';
import { clamp } from '../../utils/format';

/** Maximum per-edge mismatch (degrees) applied at fully unentangled strength. */
export const MAX_MISMATCH_DEG = 82;

/**
 * Number of face pairs every shippable topology must expose. State-family
 * arrays (`strengthOffsets`, `mismatchCoeff`, `edgeNarratives`) are all
 * length-`PAIR_COUNT`, which is why both Dipole and Cycle-4 ship with
 * exactly four edges.
 */
export const PAIR_COUNT = 4;

export interface PairSnapshot {
  localStrength: number;
  localMismatchAngle: number;
  localAlignmentScore: number;
  localGluingProxy: number;
}

/**
 * Toy per-pair snapshot. Both global and per-pair derivations use this so the
 * card numbers and the visualization never drift apart.
 */
export function computePairSnapshot(
  family: StateFamilyPreset,
  index: number,
  strength: number,
): PairSnapshot {
  const s = clamp(strength, 0, 1);
  const offset = family.strengthOffsets[index] ?? 0;
  const noise = family.mismatchCoeff[index] ?? 0;

  const localStrength = clamp(s + offset, 0, 1);
  const localMismatchAngle = Math.abs(noise) * MAX_MISMATCH_DEG * (1 - localStrength);

  // cos²(mismatch) falls off more steeply than (1+cos)/2, so a 30° deviation
  // already reads as visibly misaligned in the score.
  const rad = (Math.min(localMismatchAngle, 90) * Math.PI) / 180;
  const c = Math.cos(rad);
  const localAlignmentScore = clamp(c * c, 0, 1);

  const localGluingProxy = clamp(
    localAlignmentScore * (0.3 + 0.7 * localStrength),
    0,
    1,
  );

  return {
    localStrength,
    localMismatchAngle,
    localAlignmentScore,
    localGluingProxy,
  };
}

export function computeAllSnapshots(
  family: StateFamilyPreset,
  strength: number,
  count: number = PAIR_COUNT,
): PairSnapshot[] {
  const out: PairSnapshot[] = [];
  for (let i = 0; i < count; i++) {
    out.push(computePairSnapshot(family, i, strength));
  }
  return out;
}

export function mean(xs: number[]): number {
  if (xs.length === 0) return 0;
  return xs.reduce((a, b) => a + b, 0) / xs.length;
}

export function stddev(xs: number[], m: number): number {
  if (xs.length === 0) return 0;
  const v = xs.reduce((acc, x) => acc + (x - m) ** 2, 0) / xs.length;
  return Math.sqrt(v);
}

/**
 * Toy global correlation state. Each family-aware value is an aggregate of the
 * four per-pair snapshots. "Cohesion" (1 − 2·stddev of alignment scores)
 * captures uniformity across pairs: a frustrated or edge-biased family has
 * lower cohesion than a symmetric one at the same strength, which reduces
 * gluingScore even when antiParallelScore is comparable.
 */
export function deriveCorrelationState(
  strength: number,
  family: StateFamilyPreset,
): CorrelationState {
  const snapshots = computeAllSnapshots(family, strength);

  const alignments = snapshots.map((s) => s.localAlignmentScore);
  const strengths = snapshots.map((s) => s.localStrength);

  const alignMean = mean(alignments);
  const alignStd = stddev(alignments, alignMean);
  const strengthMean = mean(strengths);

  // Alignment stddev on [0, 1] is bounded by 0.5 (bimodal) — scale to [0, 1].
  const cohesion = clamp(1 - alignStd * 2, 0, 1);

  const antiParallelScore = clamp(alignMean, 0, 1);
  const mutualInformationProxy = clamp(
    Math.pow(strengthMean * alignMean, 1.5),
    0,
    1,
  );
  const gluingScore = clamp(
    alignMean * cohesion * (0.3 + 0.7 * strengthMean),
    0,
    1,
  );

  return {
    antiParallelScore,
    mutualInformationProxy,
    gluingScore,
  };
}
