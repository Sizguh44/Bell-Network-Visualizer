import type { BridgeLessonId } from './bridge';
import type { ChallengeId } from './challenge';
import type { GlossaryEntryId } from './glossary';
import type { LessonId } from './learning';

/**
 * A single umbrella type covering every piece of authored content in the app.
 * Any future content kind (quizzes, playgrounds, paper notes, ...) should land
 * here first and only then grow a dedicated type.
 */
export type ContentKind = 'lesson' | 'challenge' | 'bridge-lesson' | 'glossary';

export type ContentStatus = 'stable' | 'draft' | 'experimental';

/**
 * Optional authoring metadata shared across lesson / challenge / bridge /
 * glossary records. Every field is opt-in; adding metadata to an entry never
 * changes runtime behaviour — consumers surface these fields only when asked.
 */
export interface ContentMeta {
  /** Whether the entry is ready for public consumption. */
  status?: ContentStatus;
  /** When true, the Content Library hides this entry. */
  hidden?: boolean;
  /** Internal note for the author — never rendered in the app. */
  authorNote?: string;
  /** Display-only label for the last update, e.g. "2025-11". */
  lastUpdatedLabel?: string;
}

/**
 * Discriminated union of normalised pointers to any piece of content in the
 * app. Used by the Content Library list view and by the relation helpers.
 */
export type ContentReference =
  | { kind: 'lesson'; id: LessonId; title: string; order: number }
  | { kind: 'challenge'; id: ChallengeId; title: string; order: number }
  | { kind: 'bridge-lesson'; id: BridgeLessonId; title: string; order: number }
  | { kind: 'glossary'; id: GlossaryEntryId; title: string };

/** Fan-out of content references produced by a relation query. */
export interface ContentRelations {
  concepts: readonly ContentReference[];
  lessons: readonly ContentReference[];
  challenges: readonly ContentReference[];
  bridges: readonly ContentReference[];
}

/** Counts by content kind — used by the Library header banner. */
export interface ContentStats {
  lessons: number;
  challenges: number;
  bridges: number;
  glossaryEntries: number;
}

/** Active tab in the Content Library drawer. */
export type LibraryTab = 'lessons' | 'challenges' | 'bridge' | 'glossary';
