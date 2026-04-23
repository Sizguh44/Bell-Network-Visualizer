import type { ContentMeta } from './content';
import type { DemoConfig } from './graph';
import type { GlossaryEntryId } from './glossary';
import type { LessonId } from './learning';

export type ChallengeId =
  | 'most-misaligned'
  | 'strength-vs-family'
  | 'lens-not-state'
  | 'alignment-vs-regge'
  | 'edge-bias-lens'
  | 'frustration-vs-weakness'
  | 'global-vs-local'
  | 'bell-vs-strong'
  | 'topology-detects-bias'
  | 'family-topology-crosstalk';

export type ChallengeDifficulty = 'intro' | 'core' | 'advanced';

export type ChallengeType =
  | 'prediction'
  | 'comparison'
  | 'diagnosis'
  | 'conceptual';

export interface ChallengeOption {
  id: string;
  text: string;
  correct: boolean;
  feedback: string;
}

export interface Challenge extends ContentMeta {
  id: ChallengeId;
  order: number;
  title: string;
  shortGoal: string;
  difficulty: ChallengeDifficulty;
  type: ChallengeType;
  prompt: string;
  setupConfig: Partial<DemoConfig>;
  /**
   * `undefined` = leave the current selection alone,
   * `null` = clear, string = select that edge id.
   */
  setupSelection?: string | null;
  /** Optional reminder shown alongside the prompt after setup is applied. */
  expectedObservation?: string;
  answerOptions: readonly ChallengeOption[];
  explanation: string;
  relatedConceptIds: readonly GlossaryEntryId[];
  relatedLessonIds: readonly LessonId[];
  nextChallengeId?: ChallengeId;
  prevChallengeId?: ChallengeId;
}

export interface ChallengeState {
  selectedOptionId: string | null;
  revealed: boolean;
}

export type ChallengeStates = Record<ChallengeId, ChallengeState>;
