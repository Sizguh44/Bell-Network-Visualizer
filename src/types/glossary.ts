import type { BridgeLessonId } from './bridge';
import type { ChallengeId } from './challenge';
import type { ContentMeta } from './content';
import type { LessonId } from './learning';

export type GlossaryEntryId =
  | 'dipole-graph'
  | 'face-pair'
  | 'spin-network'
  | 'intertwiner'
  | 'entanglement'
  | 'bell-network'
  | 'alignment'
  | 'gluing'
  | 'state-family'
  | 'observable-lens'
  | 'vector-geometry'
  | 'regge-geometry'
  | 'cohesion'
  | 'automorphism'
  | 'homogeneity'
  | 'graph-topology'
  | 'edge-pattern';

/**
 * One concept in the Concept Atlas. Each entry carries enough structure to
 * act as a mini encyclopaedia row — split between "what this app does" and
 * "what full theory does" so the toy-vs-real boundary stays visible.
 */
export interface GlossaryEntry extends ContentMeta {
  id: GlossaryEntryId;
  label: string;
  shortDefinition: string;
  whyItMatters: string;
  inThisApp: string;
  inFullTheory: string;
  commonConfusion?: string;
  relatedConceptIds: readonly GlossaryEntryId[];
  suggestedLessonIds: readonly LessonId[];
  /** Optional challenges that drill into this concept. */
  suggestedChallengeIds?: readonly ChallengeId[];
  /** Optional bridge lessons that place this concept in the cosmology context. */
  suggestedBridgeLessonIds?: readonly BridgeLessonId[];
  /** Free-form keywords to boost search matching. */
  tags?: readonly string[];
}
