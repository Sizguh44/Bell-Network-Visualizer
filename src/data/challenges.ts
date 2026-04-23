import type {
  Challenge,
  ChallengeId,
  ChallengeStates,
} from '../types/challenge';
import type { Locale } from '../i18n/types';
import { CHALLENGES_EN } from './en/challenges';
import { CHALLENGES_TR } from './tr/challenges';

/**
 * Locale-aware challenge dispatcher.
 *
 * `CHALLENGES_EN` and `CHALLENGES_TR` carry the same challenge ids in the
 * same order — the id union, the prev/next chain, the `setupConfig`
 * configs, the answerOption ids and every `correct` flag are all locale-
 * independent. Only user-facing strings differ between the two arrays.
 */
const CHALLENGES_BY_LOCALE: Record<Locale, readonly Challenge[]> = {
  en: CHALLENGES_EN,
  tr: CHALLENGES_TR,
};

function buildLookup(
  challenges: readonly Challenge[],
): Record<ChallengeId, Challenge> {
  return challenges.reduce<Record<ChallengeId, Challenge>>(
    (acc, c) => {
      acc[c.id] = c;
      return acc;
    },
    {} as Record<ChallengeId, Challenge>,
  );
}

const LOOKUP: Record<Locale, Record<ChallengeId, Challenge>> = {
  en: buildLookup(CHALLENGES_EN),
  tr: buildLookup(CHALLENGES_TR),
};

/** Canonical locale-aware challenge list, preserving declaration order. */
export function getChallenges(locale: Locale): readonly Challenge[] {
  return CHALLENGES_BY_LOCALE[locale];
}

/** Locale-aware challenge lookup by id. Returns `undefined` on unknown id. */
export function getChallenge(
  id: ChallengeId,
  locale: Locale,
): Challenge | undefined {
  return LOOKUP[locale][id];
}

/**
 * Fresh per-challenge state object keyed by every known ChallengeId. Ids
 * are locale-independent, so the English list is the canonical skeleton.
 */
export function initialChallengeStates(): ChallengeStates {
  const out = {} as ChallengeStates;
  for (const c of CHALLENGES_EN) {
    out[c.id] = { selectedOptionId: null, revealed: false };
  }
  return out;
}

export const FIRST_CHALLENGE_ID: ChallengeId =
  CHALLENGES_EN[0]?.id ?? 'most-misaligned';

/**
 * Back-compat alias. New code should call `getChallenges(locale)` instead;
 * existing `CHALLENGES` references fall back to the English list so they
 * keep working unchanged.
 */
export const CHALLENGES: readonly Challenge[] = CHALLENGES_EN;
