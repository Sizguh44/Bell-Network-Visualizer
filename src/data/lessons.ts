import type { Lesson, LessonId, LessonStates } from '../types/learning';
import type { Locale } from '../i18n/types';
import { LESSONS_EN } from './en/lessons';
import { LESSONS_TR } from './tr/lessons';

/**
 * Locale-aware lesson dispatcher.
 *
 * `LESSONS_EN` and `LESSONS_TR` carry the same lesson ids in the same order —
 * the id union, the prev/next chain, the `recommendedConfig` setups and the
 * checkpoint option ids are all locale-independent. Only user-facing strings
 * differ between the two arrays.
 *
 * Consumers that need the canonical English reference (e.g. the first-id
 * constant, the state-initialiser skeleton) read from `LESSONS_EN`; content
 * consumers (`LessonPanel`, recommendation helpers, the atlas "suggested
 * lessons" rows) must call `getLesson(id, locale)` with the active locale.
 */
const LESSONS_BY_LOCALE: Record<Locale, readonly Lesson[]> = {
  en: LESSONS_EN,
  tr: LESSONS_TR,
};

function buildLookup(lessons: readonly Lesson[]): Record<LessonId, Lesson> {
  return lessons.reduce<Record<LessonId, Lesson>>(
    (acc, l) => {
      acc[l.id] = l;
      return acc;
    },
    {} as Record<LessonId, Lesson>,
  );
}

const LOOKUP: Record<Locale, Record<LessonId, Lesson>> = {
  en: buildLookup(LESSONS_EN),
  tr: buildLookup(LESSONS_TR),
};

/** Canonical locale-aware lesson list, preserving declaration order. */
export function getLessons(locale: Locale): readonly Lesson[] {
  return LESSONS_BY_LOCALE[locale];
}

/** Locale-aware lesson lookup by id. */
export function getLesson(id: LessonId, locale: Locale): Lesson {
  return LOOKUP[locale][id];
}

/**
 * Fresh per-lesson state object keyed by every known LessonId. Ids are
 * locale-independent, so the English list is the canonical skeleton; the
 * shape is identical whatever the active locale is.
 */
export function initialLessonStates(): LessonStates {
  const out = {} as LessonStates;
  for (const l of LESSONS_EN) {
    out[l.id] = { selectedOptionId: null, revealed: false };
  }
  return out;
}

export const FIRST_LESSON_ID: LessonId = LESSONS_EN[0]?.id ?? 'intro-dipole';

/**
 * Back-compat alias. Historically the app imported a single `LESSONS`
 * constant. Old call sites still work but now pick up the English content by
 * default; new code should call `getLessons(locale)` instead.
 */
export const LESSONS: readonly Lesson[] = LESSONS_EN;
