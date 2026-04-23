import type { BridgeLesson, BridgeLessonId } from '../types/bridge';
import type { Locale } from '../i18n/types';
import { BRIDGE_LESSONS_EN } from './en/bridgeLessons';
import { BRIDGE_LESSONS_TR } from './tr/bridgeLessons';

/**
 * Locale-aware bridge-lesson dispatcher. Same id union + order + prev/next
 * chain + `optionalSetupConfig` + related id arrays in both locales; only
 * user-facing strings differ.
 */
const BY_LOCALE: Record<Locale, readonly BridgeLesson[]> = {
  en: BRIDGE_LESSONS_EN,
  tr: BRIDGE_LESSONS_TR,
};

function buildLookup(
  list: readonly BridgeLesson[],
): Record<BridgeLessonId, BridgeLesson> {
  return list.reduce<Record<BridgeLessonId, BridgeLesson>>(
    (acc, l) => {
      acc[l.id] = l;
      return acc;
    },
    {} as Record<BridgeLessonId, BridgeLesson>,
  );
}

const LOOKUP: Record<Locale, Record<BridgeLessonId, BridgeLesson>> = {
  en: buildLookup(BRIDGE_LESSONS_EN),
  tr: buildLookup(BRIDGE_LESSONS_TR),
};

export function getBridgeLessons(locale: Locale): readonly BridgeLesson[] {
  return BY_LOCALE[locale];
}

export function getBridgeLesson(
  id: BridgeLessonId,
  locale: Locale,
): BridgeLesson | undefined {
  return LOOKUP[locale][id];
}

export const FIRST_BRIDGE_LESSON_ID: BridgeLessonId =
  BRIDGE_LESSONS_EN[0]?.id ?? 'local-vs-global';

/**
 * Back-compat alias. New code should prefer `getBridgeLessons(locale)`;
 * existing references fall back to the English list.
 */
export const BRIDGE_LESSONS: readonly BridgeLesson[] = BRIDGE_LESSONS_EN;
