import type { ContentMeta } from './content';
import type { DemoConfig } from './graph';
import type { GlossaryEntryId } from './glossary';

export type AppMode = 'explore' | 'learn' | 'challenge' | 'bridge';

export type LessonId =
  | 'intro-dipole'
  | 'strength-response'
  | 'local-pair-inspection'
  | 'state-families'
  | 'observable-lenses'
  | 'alignment-vs-shape'
  | 'why-it-matters'
  | 'topology-upgrade';

/**
 * Lesson tags are drawn from the shared Concept Atlas vocabulary, so clicking
 * a tag can open the matching glossary entry.
 */
export type ConceptTag = GlossaryEntryId;

export type CalloutKind = 'key' | 'confusion' | 'in-demo' | 'in-theory';

export interface LessonCallout {
  kind: CalloutKind;
  body: string;
}

export interface CheckpointOption {
  id: string;
  text: string;
  correct: boolean;
  feedback: string;
}

export interface Lesson extends ContentMeta {
  id: LessonId;
  order: number;
  title: string;
  shortGoal: string;
  conceptTags: readonly ConceptTag[];
  narrative: readonly string[];
  callouts?: readonly LessonCallout[];
  actionPrompt: string;
  /** Subset of DemoConfig applied when the user clicks "Apply lesson setup". */
  recommendedConfig: Partial<DemoConfig>;
  /**
   * `undefined` = leave selection alone, `null` = clear any selection,
   * string = select the edge with that id.
   */
  recommendedSelection?: string | null;
  checkpointQuestion: string;
  checkpointOptions: readonly CheckpointOption[];
  checkpointExplanation: string;
  nextLessonId?: LessonId;
  prevLessonId?: LessonId;
}

export interface LessonState {
  selectedOptionId: string | null;
  revealed: boolean;
}

export type LessonStates = Record<LessonId, LessonState>;
