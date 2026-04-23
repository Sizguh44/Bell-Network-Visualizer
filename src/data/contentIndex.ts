import type { BridgeLesson, BridgeLessonId } from '../types/bridge';
import type { Challenge, ChallengeId } from '../types/challenge';
import type {
  ContentKind,
  ContentReference,
  ContentRelations,
  ContentStats,
} from '../types/content';
import type { GlossaryEntryId } from '../types/glossary';
import type { Lesson, LessonId } from '../types/learning';
import type { Locale } from '../i18n/types';

import {
  BRIDGE_LESSONS,
  getBridgeLesson,
  getBridgeLessons,
} from './bridgeLessons';
import {
  CHALLENGES,
  getChallenge,
  getChallenges,
} from './challenges';
import {
  GLOSSARY_ENTRIES,
  getConceptLabel,
  getGlossaryEntries,
  getGlossaryEntry,
} from './glossary';
import { LESSONS, getLesson, getLessons } from './lessons';

/* ------------------------------------------------------------------ */
/*  Re-exports — single import source for the rest of the codebase    */
/* ------------------------------------------------------------------ */

export {
  LESSONS,
  CHALLENGES,
  BRIDGE_LESSONS,
  GLOSSARY_ENTRIES,
  getLesson,
  getChallenge,
  getBridgeLesson,
  getGlossaryEntry,
  getConceptLabel,
  getLessons,
  getChallenges,
  getBridgeLessons,
  getGlossaryEntries,
};

/* ------------------------------------------------------------------ */
/*  Stats                                                              */
/* ------------------------------------------------------------------ */

/**
 * Counts are locale-independent by construction (all locales ship the same
 * id unions in the same order). The EN list is the canonical skeleton we
 * count against.
 */
export function getContentStats(): ContentStats {
  const hidden = (entry: { hidden?: boolean }) => entry.hidden === true;
  return {
    lessons: LESSONS.filter((l) => !hidden(l)).length,
    challenges: CHALLENGES.filter((c) => !hidden(c)).length,
    bridges: BRIDGE_LESSONS.filter((b) => !hidden(b)).length,
    glossaryEntries: GLOSSARY_ENTRIES.filter((g) => !hidden(g)).length,
  };
}

/* ------------------------------------------------------------------ */
/*  Reference builders                                                 */
/* ------------------------------------------------------------------ */

export function lessonRef(
  id: LessonId,
  locale: Locale,
): ContentReference | null {
  const l = getLesson(id, locale);
  return l ? { kind: 'lesson', id, title: l.title, order: l.order } : null;
}

export function challengeRef(
  id: ChallengeId,
  locale: Locale,
): ContentReference | null {
  const c = getChallenge(id, locale);
  return c ? { kind: 'challenge', id, title: c.title, order: c.order } : null;
}

export function bridgeLessonRef(
  id: BridgeLessonId,
  locale: Locale,
): ContentReference | null {
  const b = getBridgeLesson(id, locale);
  return b
    ? { kind: 'bridge-lesson', id, title: b.title, order: b.order }
    : null;
}

/** Locale-aware glossary reference builder. */
export function glossaryRef(
  id: GlossaryEntryId,
  locale: Locale,
): ContentReference | null {
  const g = getGlossaryEntry(id, locale);
  return g ? { kind: 'glossary', id, title: g.label } : null;
}

function dropNulls<T>(xs: readonly (T | null)[]): T[] {
  const out: T[] = [];
  for (const x of xs) if (x !== null) out.push(x);
  return out;
}

/* ------------------------------------------------------------------ */
/*  Outgoing relations — "this content points at those"               */
/* ------------------------------------------------------------------ */

/**
 * For a given content item, return every other piece of content it already
 * points at via its own data. Locale controls the `title` on every returned
 * reference; the concept ids themselves are locale-invariant.
 */
export function getRelationsForContent(
  kind: ContentKind,
  id: string,
  locale: Locale,
): ContentRelations {
  let concepts: readonly GlossaryEntryId[] = [];
  let lessons: readonly LessonId[] = [];
  let challenges: readonly ChallengeId[] = [];
  let bridges: readonly BridgeLessonId[] = [];

  switch (kind) {
    case 'lesson': {
      const l = getLesson(id as LessonId, locale);
      if (l) concepts = l.conceptTags;
      break;
    }
    case 'challenge': {
      const c = getChallenge(id as ChallengeId, locale);
      if (c) {
        concepts = c.relatedConceptIds;
        lessons = c.relatedLessonIds;
      }
      break;
    }
    case 'bridge-lesson': {
      const b = getBridgeLesson(id as BridgeLessonId, locale);
      if (b) {
        concepts = b.relatedConceptIds;
        lessons = b.relatedLessonIds;
        challenges = b.suggestedChallengeIds ?? [];
      }
      break;
    }
    case 'glossary': {
      const g = getGlossaryEntry(id as GlossaryEntryId, locale);
      if (g) {
        concepts = g.relatedConceptIds;
        lessons = g.suggestedLessonIds;
        challenges = g.suggestedChallengeIds ?? [];
        bridges = g.suggestedBridgeLessonIds ?? [];
      }
      break;
    }
  }

  return {
    concepts: dropNulls(concepts.map((cid) => glossaryRef(cid, locale))),
    lessons: dropNulls(lessons.map((lid) => lessonRef(lid, locale))),
    challenges: dropNulls(challenges.map((cid) => challengeRef(cid, locale))),
    bridges: dropNulls(bridges.map((bid) => bridgeLessonRef(bid, locale))),
  };
}

/* ------------------------------------------------------------------ */
/*  Incoming mentions — "who mentions this concept?"                  */
/* ------------------------------------------------------------------ */

/**
 * For a given concept id, return every piece of content that *mentions* it —
 * the inverse of outgoing relations. `locale` selects which title the
 * returned references carry.
 */
export function getContentMentioningConcept(
  id: GlossaryEntryId,
  locale: Locale,
): ContentRelations {
  const lessons = getLessons(locale)
    .filter((l) => l.conceptTags.includes(id))
    .map(
      (l): ContentReference => ({
        kind: 'lesson',
        id: l.id,
        title: l.title,
        order: l.order,
      }),
    );

  const challenges = getChallenges(locale)
    .filter((c) => c.relatedConceptIds.includes(id))
    .map(
      (c): ContentReference => ({
        kind: 'challenge',
        id: c.id,
        title: c.title,
        order: c.order,
      }),
    );

  const bridges = getBridgeLessons(locale)
    .filter((b) => b.relatedConceptIds.includes(id))
    .map(
      (b): ContentReference => ({
        kind: 'bridge-lesson',
        id: b.id,
        title: b.title,
        order: b.order,
      }),
    );

  const concepts = getGlossaryEntries(locale)
    .filter((g) => g.id !== id && g.relatedConceptIds.includes(id))
    .map(
      (g): ContentReference => ({
        kind: 'glossary',
        id: g.id,
        title: g.label,
      }),
    );

  return { concepts, lessons, challenges, bridges };
}

/* ------------------------------------------------------------------ */
/*  Single-entry reference resolution                                  */
/* ------------------------------------------------------------------ */

/** A convenience overload set that returns a typed reference per kind. */
export function getContentRef(
  kind: 'lesson',
  id: LessonId,
  locale: Locale,
): ContentReference | null;
export function getContentRef(
  kind: 'challenge',
  id: ChallengeId,
  locale: Locale,
): ContentReference | null;
export function getContentRef(
  kind: 'bridge-lesson',
  id: BridgeLessonId,
  locale: Locale,
): ContentReference | null;
export function getContentRef(
  kind: 'glossary',
  id: GlossaryEntryId,
  locale: Locale,
): ContentReference | null;
export function getContentRef(
  kind: ContentKind,
  id: string,
  locale: Locale,
): ContentReference | null {
  switch (kind) {
    case 'lesson':
      return lessonRef(id as LessonId, locale);
    case 'challenge':
      return challengeRef(id as ChallengeId, locale);
    case 'bridge-lesson':
      return bridgeLessonRef(id as BridgeLessonId, locale);
    case 'glossary':
      return glossaryRef(id as GlossaryEntryId, locale);
  }
}

/* ------------------------------------------------------------------ */
/*  Recommendations                                                    */
/*                                                                     */
/*  A tiny recommendation layer that sits on top of the relation       */
/*  helpers above. Keeping it co-located makes this file the single    */
/*  relation hub: reference builders, outgoing/incoming relations,     */
/*  stats and recommendations all live together.                       */
/* ------------------------------------------------------------------ */

/**
 * Cheap intersection count between two concept-id arrays. Returns the
 * number of ids that appear in both lists — ordering does not matter.
 */
function overlap(
  a: readonly GlossaryEntryId[],
  b: readonly GlossaryEntryId[],
): number {
  let n = 0;
  for (const x of a) if (b.includes(x)) n++;
  return n;
}

export interface LessonRecommendation {
  challenge: Challenge | null;
  bridge: BridgeLesson | null;
}

/**
 * Pick one related challenge and one related bridge lesson for a given
 * lesson, based on shared concepts. Returns `null` in each slot when no
 * non-trivial overlap exists. Ties are broken by `order` so the earliest
 * piece of content wins — which also makes the choice stable across runs.
 *
 * The matching is locale-agnostic (concept ids are invariant) but the
 * returned `Challenge` and `BridgeLesson` objects are resolved in the
 * active locale so their `title` fields display correctly.
 *
 * Currently only lessons consume this helper (via `LessonPanel`'s
 * "Next step" block). Challenge and Bridge panels surface their own
 * author-curated related links and therefore do not need a computed
 * recommendation — the scoring primitive is exported here anyway for
 * future callers.
 */
export function getLessonRecommendations(
  lesson: Lesson,
  locale: Locale,
): LessonRecommendation {
  const tags = lesson.conceptTags;
  const challenges = getChallenges(locale);
  const bridges = getBridgeLessons(locale);

  let bestChallenge: Challenge | null = null;
  let bestChallengeScore = 0;
  for (const c of challenges) {
    if (c.hidden) continue;
    const score = overlap(tags, c.relatedConceptIds);
    if (score === 0) continue;
    if (
      score > bestChallengeScore ||
      (score === bestChallengeScore &&
        bestChallenge !== null &&
        c.order < bestChallenge.order)
    ) {
      bestChallenge = c;
      bestChallengeScore = score;
    }
  }

  let bestBridge: BridgeLesson | null = null;
  let bestBridgeScore = 0;
  for (const b of bridges) {
    if (b.hidden) continue;
    const score = overlap(tags, b.relatedConceptIds);
    if (score === 0) continue;
    if (
      score > bestBridgeScore ||
      (score === bestBridgeScore &&
        bestBridge !== null &&
        b.order < bestBridge.order)
    ) {
      bestBridge = b;
      bestBridgeScore = score;
    }
  }

  return { challenge: bestChallenge, bridge: bestBridge };
}
