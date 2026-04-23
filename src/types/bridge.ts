import type { ChallengeId } from './challenge';
import type { ContentMeta } from './content';
import type { DemoConfig } from './graph';
import type { GlossaryEntryId } from './glossary';
import type { LessonId } from './learning';

export type BridgeLessonId =
  | 'local-vs-global'
  | 'graph-symmetry'
  | 'automorphisms-equivalent-nodes'
  | 'homogeneity-structural'
  | 'cosmology-bridge-value'
  | 'dipole-truncation-limits'
  | 'larger-graph-symmetry';

/**
 * Mini in-panel explainer widgets that a bridge lesson can request.
 * `graph-symmetry`  → two small dipoles side by side illustrating A↔B swap.
 * `level-comparison` → 3-column table (pair / graph / cosmology).
 */
export type BridgeWidget = 'graph-symmetry' | 'level-comparison';

export interface BridgeLesson extends ContentMeta {
  id: BridgeLessonId;
  order: number;
  title: string;
  shortGoal: string;
  narrative: readonly string[];
  keyIdea: string;
  commonConfusion: string;
  actionPrompt?: string;
  /** Open-ended reflection questions; no answer mechanism. */
  reflectionPrompts: readonly string[];
  relatedConceptIds: readonly GlossaryEntryId[];
  relatedLessonIds: readonly LessonId[];
  suggestedChallengeIds?: readonly ChallengeId[];
  /** Pushed into the canvas when the user clicks "Apply suggested setup". */
  optionalSetupConfig?: Partial<DemoConfig>;
  widget?: BridgeWidget;
  nextBridgeLessonId?: BridgeLessonId;
  prevBridgeLessonId?: BridgeLessonId;
}
