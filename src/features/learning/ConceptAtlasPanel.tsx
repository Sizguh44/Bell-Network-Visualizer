import { useEffect, useMemo, useState } from 'react';
import type { GlossaryEntry, GlossaryEntryId } from '../../types/glossary';
import {
  getGlossaryEntries,
  getGlossaryEntry,
} from '../../data/glossary';
import { getLesson } from '../../data/lessons';
import { getChallenge } from '../../data/challenges';
import { getBridgeLesson } from '../../data/bridgeLessons';
import { getContentMentioningConcept } from '../../data/contentIndex';
import type { ContentReference } from '../../types/content';
import { useGlossary } from './GlossaryContext';
import { useLocale, useUiText } from '../../i18n';
import type { Locale } from '../../i18n/types';
import type { UiStrings } from '../../i18n/ui';
import styles from './ConceptAtlasPanel.module.css';

type LessonRef = Extract<ContentReference, { kind: 'lesson' }>;
type ChallengeRef = Extract<ContentReference, { kind: 'challenge' }>;
type BridgeRef = Extract<ContentReference, { kind: 'bridge-lesson' }>;

interface ConceptAtlasPanelProps {
  open: boolean;
  activeEntryId: GlossaryEntryId | null;
  onClose: () => void;
  onSelectEntry: (id: GlossaryEntryId | null) => void;
}

export function ConceptAtlasPanel({
  open,
  activeEntryId,
  onClose,
  onSelectEntry,
}: ConceptAtlasPanelProps) {
  const { openLesson, openChallenge, openBridgeLesson } = useGlossary();
  const locale = useLocale();
  const t = useUiText();
  const at = t.atlas;
  const [query, setQuery] = useState('');

  // Escape key closes the panel.
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open, onClose]);

  // Reset search each time the panel opens for a clean slate.
  useEffect(() => {
    if (open) setQuery('');
  }, [open]);

  // Filter against the active-locale glossary so Turkish queries match
  // Turkish labels / definitions / tags.
  const filtered = useMemo(() => {
    const entries = getGlossaryEntries(locale);
    const q = query.trim().toLowerCase();
    if (!q) return entries;
    return entries.filter((e) => {
      if (e.label.toLowerCase().includes(q)) return true;
      if (e.shortDefinition.toLowerCase().includes(q)) return true;
      if (e.id.toLowerCase().includes(q)) return true;
      if (e.tags?.some((tag) => tag.toLowerCase().includes(q))) return true;
      return false;
    });
  }, [query, locale]);

  if (!open) return null;

  const activeEntry = activeEntryId
    ? getGlossaryEntry(activeEntryId, locale)
    : undefined;

  const handleBackdropClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) onClose();
  };

  return (
    <div
      className={styles.overlay}
      role="dialog"
      aria-modal="true"
      aria-label={at.aria}
      onClick={handleBackdropClick}
    >
      <aside className={styles.panel}>
        <header className={styles.header}>
          <div className={styles.titleRow}>
            <span className={styles.eyebrow}>{at.eyebrow}</span>
            <button
              type="button"
              onClick={onClose}
              className={styles.closeButton}
              aria-label={at.close}
            >
              ×
            </button>
          </div>
          {!activeEntry && (
            <>
              <h2 className={styles.heading}>{at.heading}</h2>
              <p className={styles.subheading}>{at.subheading}</p>
              <input
                type="search"
                className={styles.search}
                placeholder={at.searchPlaceholder}
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                aria-label={at.searchAria}
              />
            </>
          )}
          {activeEntry && (
            <button
              type="button"
              className={styles.backButton}
              onClick={() => onSelectEntry(null)}
            >
              {at.back}
            </button>
          )}
        </header>

        <div className={styles.body}>
          {activeEntry ? (
            <EntryDetail
              entry={activeEntry}
              locale={locale}
              strings={t}
              onSelectEntry={onSelectEntry}
              onOpenLesson={openLesson}
              onOpenChallenge={openChallenge}
              onOpenBridgeLesson={openBridgeLesson}
            />
          ) : (
            <EntryList
              entries={filtered}
              emptyText={at.emptyResults}
              onSelectEntry={onSelectEntry}
            />
          )}
        </div>
      </aside>
    </div>
  );
}

/* ------------------------------ subviews ------------------------------ */

interface EntryListProps {
  entries: readonly GlossaryEntry[];
  emptyText: string;
  onSelectEntry: (id: GlossaryEntryId) => void;
}

function EntryList({ entries, emptyText, onSelectEntry }: EntryListProps) {
  if (entries.length === 0) {
    return <p className={styles.emptyResults}>{emptyText}</p>;
  }
  return (
    <ul className={styles.list}>
      {entries.map((e) => (
        <li key={e.id}>
          <button
            type="button"
            className={styles.tile}
            onClick={() => onSelectEntry(e.id)}
          >
            <span className={styles.tileLabel}>{e.label}</span>
            <span className={styles.tileDefinition}>{e.shortDefinition}</span>
          </button>
        </li>
      ))}
    </ul>
  );
}

interface EntryDetailProps {
  entry: GlossaryEntry;
  locale: Locale;
  strings: UiStrings;
  onSelectEntry: (id: GlossaryEntryId) => void;
  onOpenLesson: (id: GlossaryEntry['suggestedLessonIds'][number]) => void;
  onOpenChallenge: (
    id: NonNullable<GlossaryEntry['suggestedChallengeIds']>[number],
  ) => void;
  onOpenBridgeLesson: (
    id: NonNullable<GlossaryEntry['suggestedBridgeLessonIds']>[number],
  ) => void;
}

function EntryDetail({
  entry,
  locale,
  strings,
  onSelectEntry,
  onOpenLesson,
  onOpenChallenge,
  onOpenBridgeLesson,
}: EntryDetailProps) {
  const at = strings.atlas;

  // Inverse index — every lesson / challenge / bridge lesson that mentions
  // this concept in the active locale, minus the author's explicitly
  // suggested items. Titles come back already localised.
  const alsoAppearsIn = useMemo(() => {
    const incoming = getContentMentioningConcept(entry.id, locale);
    const suggestedLesson = new Set(entry.suggestedLessonIds);
    const suggestedChallenge = new Set(entry.suggestedChallengeIds ?? []);
    const suggestedBridge = new Set(entry.suggestedBridgeLessonIds ?? []);
    const lessons: LessonRef[] = [];
    for (const r of incoming.lessons) {
      if (r.kind === 'lesson' && !suggestedLesson.has(r.id)) lessons.push(r);
    }
    const challenges: ChallengeRef[] = [];
    for (const r of incoming.challenges) {
      if (r.kind === 'challenge' && !suggestedChallenge.has(r.id)) {
        challenges.push(r);
      }
    }
    const bridges: BridgeRef[] = [];
    for (const r of incoming.bridges) {
      if (r.kind === 'bridge-lesson' && !suggestedBridge.has(r.id)) {
        bridges.push(r);
      }
    }
    return { lessons, challenges, bridges };
  }, [entry, locale]);

  const hasExtras =
    alsoAppearsIn.lessons.length +
      alsoAppearsIn.challenges.length +
      alsoAppearsIn.bridges.length >
    0;

  return (
    <article className={styles.detail}>
      <h3 className={styles.detailTitle}>{entry.label}</h3>
      <p className={styles.detailLede}>{entry.shortDefinition}</p>

      <DetailSection label={at.whyItMatters}>
        {entry.whyItMatters}
      </DetailSection>

      <DetailSection label={at.inThisApp}>{entry.inThisApp}</DetailSection>

      <DetailSection label={at.inFullTheory}>
        {entry.inFullTheory}
      </DetailSection>

      {entry.commonConfusion && (
        <aside className={styles.confusion}>
          <span className={styles.confusionLabel}>{at.commonConfusion}</span>
          <p>{entry.commonConfusion}</p>
        </aside>
      )}

      {entry.relatedConceptIds.length > 0 && (
        <section className={styles.related}>
          <span className={styles.sectionLabel}>{at.relatedConcepts}</span>
          <div className={styles.chips}>
            {entry.relatedConceptIds.map((id) => {
              const related = getGlossaryEntry(id, locale);
              if (!related) return null;
              return (
                <button
                  key={id}
                  type="button"
                  className={styles.chip}
                  onClick={() => onSelectEntry(id)}
                >
                  {related.label}
                </button>
              );
            })}
          </div>
        </section>
      )}

      {entry.suggestedLessonIds.length > 0 && (
        <section className={styles.lessons}>
          <span className={styles.sectionLabel}>{at.appearsInLessons}</span>
          <ul className={styles.lessonList}>
            {entry.suggestedLessonIds.map((id) => {
              const lesson = getLesson(id, locale);
              return (
                <li key={id}>
                  <button
                    type="button"
                    className={styles.lessonRow}
                    onClick={() => onOpenLesson(id)}
                  >
                    <span className={styles.lessonOrder}>
                      {at.lessonOrder(lesson.order)}
                    </span>
                    <span className={styles.lessonTitle}>{lesson.title}</span>
                    <span className={styles.lessonArrow} aria-hidden>
                      →
                    </span>
                  </button>
                </li>
              );
            })}
          </ul>
          <p className={styles.lessonNote}>{at.lessonNote}</p>
        </section>
      )}

      {entry.suggestedChallengeIds && entry.suggestedChallengeIds.length > 0 && (
        <section className={styles.lessons}>
          <span className={styles.sectionLabel}>{at.drillWithChallenges}</span>
          <ul className={styles.lessonList}>
            {entry.suggestedChallengeIds.map((id) => {
              const challenge = getChallenge(id, locale);
              if (!challenge) return null;
              return (
                <li key={id}>
                  <button
                    type="button"
                    className={styles.lessonRow}
                    onClick={() => onOpenChallenge(id)}
                  >
                    <span className={styles.lessonOrder}>
                      {at.challengeOrder(challenge.order)}
                    </span>
                    <span className={styles.lessonTitle}>
                      {challenge.title}
                    </span>
                    <span className={styles.lessonArrow} aria-hidden>
                      →
                    </span>
                  </button>
                </li>
              );
            })}
          </ul>
          <p className={styles.lessonNote}>{at.challengeNote}</p>
        </section>
      )}

      {entry.suggestedBridgeLessonIds &&
        entry.suggestedBridgeLessonIds.length > 0 && (
          <section className={styles.lessons}>
            <span className={styles.sectionLabel}>{at.cosmologyBridge}</span>
            <ul className={styles.lessonList}>
              {entry.suggestedBridgeLessonIds.map((id) => {
                const bridge = getBridgeLesson(id, locale);
                if (!bridge) return null;
                return (
                  <li key={id}>
                    <button
                      type="button"
                      className={styles.lessonRow}
                      onClick={() => onOpenBridgeLesson(id)}
                    >
                      <span className={styles.lessonOrder}>
                        {at.bridgeOrder(bridge.order)}
                      </span>
                      <span className={styles.lessonTitle}>{bridge.title}</span>
                      <span className={styles.lessonArrow} aria-hidden>
                        →
                      </span>
                    </button>
                  </li>
                );
              })}
            </ul>
            <p className={styles.lessonNote}>{at.bridgeNote}</p>
          </section>
        )}

      {hasExtras && (
        <section className={`${styles.lessons} ${styles.alsoAppearsIn}`}>
          <span className={styles.sectionLabel}>{at.alsoAppearsIn}</span>
          <p className={styles.alsoAppearsInNote}>{at.alsoAppearsInNote}</p>
          <ul className={styles.lessonList}>
            {alsoAppearsIn.lessons.map((ref) => (
              <AlsoAppearsRow
                key={`l-${ref.id}`}
                kindLabel={at.lessonOrder(ref.order)}
                title={ref.title}
                onClick={() => onOpenLesson(ref.id)}
              />
            ))}
            {alsoAppearsIn.challenges.map((ref) => (
              <AlsoAppearsRow
                key={`c-${ref.id}`}
                kindLabel={at.challengeOrder(ref.order)}
                title={ref.title}
                onClick={() => onOpenChallenge(ref.id)}
              />
            ))}
            {alsoAppearsIn.bridges.map((ref) => (
              <AlsoAppearsRow
                key={`b-${ref.id}`}
                kindLabel={at.bridgeOrder(ref.order)}
                title={ref.title}
                onClick={() => onOpenBridgeLesson(ref.id)}
              />
            ))}
          </ul>
        </section>
      )}
    </article>
  );
}

interface AlsoAppearsRowProps {
  kindLabel: string;
  title: string;
  onClick: () => void;
}

function AlsoAppearsRow({ kindLabel, title, onClick }: AlsoAppearsRowProps) {
  return (
    <li>
      <button type="button" className={styles.lessonRow} onClick={onClick}>
        <span className={styles.lessonOrder}>{kindLabel}</span>
        <span className={styles.lessonTitle}>{title}</span>
        <span className={styles.lessonArrow} aria-hidden>
          →
        </span>
      </button>
    </li>
  );
}

interface DetailSectionProps {
  label: string;
  children: React.ReactNode;
}

function DetailSection({ label, children }: DetailSectionProps) {
  return (
    <section className={styles.section}>
      <span className={styles.sectionLabel}>{label}</span>
      <p>{children}</p>
    </section>
  );
}
