import type {
  ObservableMode,
  ObservableSummary,
  StateFamilyPreset,
} from '../../types/graph';
import type { Locale } from '../../i18n/types';
import { UI_STRINGS } from '../../i18n/ui';
import {
  computeAllSnapshots,
  mean,
  stddev,
} from './deriveCorrelationState';
import { getObservable } from './observableDefinitions';
import { clamp } from '../../utils/format';

/**
 * Family-aware, observable-aware headline for the `ObservableSummaryCard`.
 *
 * The headline value and the status text are deliberately decoupled from the
 * global `CorrelationState`: the same state reads differently through each
 * lens, which is the whole point of a toy observable explorer.
 *
 * Locale selects the status + interpretation strings from the UI table; the
 * numeric computation is locale-independent.
 */
export function deriveObservableSummary(
  family: StateFamilyPreset,
  strength: number,
  mode: ObservableMode,
  locale: Locale,
): ObservableSummary {
  const def = getObservable(mode, locale);
  const snapshots = computeAllSnapshots(family, strength);
  const t = UI_STRINGS[locale];
  const s = t.summaryStatus;
  const i = t.summaryInterpretations;
  const sec = t.summarySecondary;

  const alignments = snapshots.map((x) => x.localAlignmentScore);
  const mismatches = snapshots.map((x) => x.localMismatchAngle);
  const gluings = snapshots.map((x) => x.localGluingProxy);
  const strengths = snapshots.map((x) => x.localStrength);

  const meanAlignment = mean(alignments);
  const stdAlignment = stddev(alignments, meanAlignment);
  const cohesion = clamp(1 - stdAlignment * 2, 0, 1);

  let headlineValue = 0;
  let secondaryValue = 0;
  let secondaryLabel = '';
  let status = '';
  let interpretation = '';
  let caution: string | undefined;

  switch (mode) {
    case 'alignment': {
      headlineValue = meanAlignment;
      secondaryValue = cohesion;
      secondaryLabel = sec.cohesion;
      if (meanAlignment > 0.85 && cohesion > 0.8) {
        status = s.strong;
        interpretation = i.alignmentStrong;
      } else if (meanAlignment > 0.6) {
        status = s.mixed;
        interpretation = i.alignmentMixed;
      } else {
        status = s.weak;
        interpretation = i.alignmentWeak;
      }
      break;
    }
    case 'mismatch': {
      headlineValue = mean(mismatches);
      const peak = mismatches.length > 0 ? Math.max(...mismatches) : 0;
      secondaryValue = peak;
      secondaryLabel = sec.peakPair;
      if (headlineValue < 6) {
        status = s.low;
        interpretation = i.mismatchLow;
      } else if (headlineValue < 20) {
        status = s.moderate;
        interpretation = i.mismatchModerate;
      } else {
        status = s.high;
        interpretation = i.mismatchHigh;
      }
      if (peak - headlineValue > 10) {
        caution = i.mismatchCaution;
      }
      break;
    }
    case 'gluing': {
      headlineValue = mean(gluings);
      secondaryValue = cohesion;
      secondaryLabel = sec.cohesion;
      if (headlineValue > 0.7) {
        status = s.strong;
        interpretation = i.gluingStrong;
      } else if (headlineValue > 0.4) {
        status = s.mixed;
        interpretation = i.gluingMixed;
      } else {
        status = s.fragile;
        interpretation = i.gluingFragile;
      }
      break;
    }
    case 'correlation': {
      headlineValue = mean(strengths);
      const range =
        strengths.length > 0 ? Math.max(...strengths) - Math.min(...strengths) : 0;
      secondaryValue = range;
      secondaryLabel = sec.pairRange;
      if (range < 0.06) {
        status = s.uniform;
        interpretation = i.correlationUniform;
      } else if (range < 0.25) {
        status = s.spread;
        interpretation = i.correlationSpread;
      } else {
        status = s.localized;
        interpretation = i.correlationLocalized;
      }
      break;
    }
    case 'uniformity': {
      headlineValue = cohesion;
      secondaryValue = stdAlignment;
      secondaryLabel = sec.alignmentSigma;
      if (cohesion > 0.88) {
        status = s.uniform;
        interpretation = i.uniformityUniform;
      } else if (cohesion > 0.55) {
        status = s.mixed;
        interpretation = i.uniformityMixed;
      } else {
        status = s.sparse;
        interpretation = i.uniformitySparse;
      }
      break;
    }
  }

  const headlineDisplay = `${headlineValue.toFixed(def.headlineDigits)}${def.unit}`;

  return {
    id: mode,
    label: def.label,
    headlineValue,
    headlineDisplay,
    secondaryValue,
    secondaryLabel,
    status,
    interpretation,
    caution,
  };
}
