import type { GlossaryEntry, GlossaryEntryId } from '../types/glossary';
import type { Locale } from '../i18n/types';
import { GLOSSARY_ENTRIES_EN } from './en/glossary';
import { GLOSSARY_ENTRIES_TR } from './tr/glossary';

/**
 * Locale-aware Concept Atlas dispatcher.
 *
 * `GLOSSARY_ENTRIES_EN` and `GLOSSARY_ENTRIES_TR` carry the same id union in
 * the same order; `relatedConceptIds`, `suggestedLessonIds`,
 * `suggestedChallengeIds` and `suggestedBridgeLessonIds` are locale-
 * invariant. Only user-facing fields (`label`, `shortDefinition`,
 * `whyItMatters`, `inThisApp`, `inFullTheory`, `commonConfusion`, `tags`)
 * differ between the two arrays.
 */
const ENTRIES_BY_LOCALE: Record<Locale, readonly GlossaryEntry[]> = {
  en: GLOSSARY_ENTRIES_EN,
  tr: GLOSSARY_ENTRIES_TR,
};

function buildLookup(
  entries: readonly GlossaryEntry[],
): Record<GlossaryEntryId, GlossaryEntry> {
  return entries.reduce<Record<GlossaryEntryId, GlossaryEntry>>(
    (acc, e) => {
      acc[e.id] = e;
      return acc;
    },
    {} as Record<GlossaryEntryId, GlossaryEntry>,
  );
}

const LOOKUP: Record<Locale, Record<GlossaryEntryId, GlossaryEntry>> = {
  en: buildLookup(GLOSSARY_ENTRIES_EN),
  tr: buildLookup(GLOSSARY_ENTRIES_TR),
};

/** Canonical locale-aware glossary list, preserving declaration order. */
export function getGlossaryEntries(locale: Locale): readonly GlossaryEntry[] {
  return ENTRIES_BY_LOCALE[locale];
}

/** Locale-aware entry lookup by id. */
export function getGlossaryEntry(
  id: GlossaryEntryId,
  locale: Locale,
): GlossaryEntry | undefined {
  return LOOKUP[locale][id];
}

/**
 * Locale-aware concept-label lookup. Falls back to the raw id string if the
 * id is unknown — consistent with the pre-locale behaviour.
 */
export function getConceptLabel(
  id: GlossaryEntryId,
  locale: Locale,
): string {
  return LOOKUP[locale][id]?.label ?? id;
}

/**
 * Back-compat alias. Old code referencing `GLOSSARY_ENTRIES` still resolves
 * to the English list; new code should call `getGlossaryEntries(locale)`.
 */
export const GLOSSARY_ENTRIES: readonly GlossaryEntry[] = GLOSSARY_ENTRIES_EN;
