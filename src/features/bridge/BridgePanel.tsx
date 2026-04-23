import { useState } from 'react';
import type { BridgeLesson, BridgeLessonId } from '../../types/bridge';
import {
  getBridgeLesson,
  getBridgeLessons,
} from '../../data/bridgeLessons';
import { getChallenge } from '../../data/challenges';
import { getGlossaryEntry } from '../../data/glossary';
import { getLesson } from '../../data/lessons';
import { useGlossary } from '../learning/GlossaryContext';
import { renderGlossaryInline } from '../learning/renderGlossaryInline';
import { GraphSymmetryCard } from './GraphSymmetryCard';
import { LevelComparisonCard } from './LevelComparisonCard';
import { useLocale, useUiText } from '../../i18n';
import styles from './BridgePanel.module.css';

interface BridgePanelProps {
  activeBridgeLessonId: BridgeLessonId;
  onChangeBridgeLesson: (id: BridgeLessonId) => void;
  onApplySetup: (lesson: BridgeLesson) => void;
}

export function BridgePanel({
  activeBridgeLessonId,
  onChangeBridgeLesson,
  onApplySetup,
}: BridgePanelProps) {
  const { openEntry, openLesson, openChallenge } = useGlossary();
  const locale = useLocale();
  const t = useUiText();
  const bp = t.bridge;
  const lesson = getBridgeLesson(activeBridgeLessonId, locale);

  const [justApplied, setJustApplied] = useState(false);

  if (!lesson) {
    return (
      <article className={styles.root} aria-label={bp.introLabel}>
        <p className={styles.empty}>{bp.empty}</p>
      </article>
    );
  }

  const total = getBridgeLessons(locale).length;
  const prev = lesson.prevBridgeLessonId;
  const next = lesson.nextBridgeLessonId;

  const handleApply = () => {
    onApplySetup(lesson);
    setJustApplied(true);
    window.setTimeout(() => setJustApplied(false), 1400);
  };

  return (
    <article className={styles.root} aria-label={bp.aria(lesson.title)}>
      <div className={styles.introBar} aria-hidden>
        <span className={styles.introLabel}>{bp.introLabel}</span>
        <span className={styles.introFlow}>{bp.introFlow}</span>
      </div>

      <header className={styles.header}>
        <div className={styles.progressRow}>
          <span className={styles.progressLabel}>
            {bp.progress(lesson.order, total)}
          </span>
          <div
            className={styles.progressBar}
            role="progressbar"
            aria-valuemin={1}
            aria-valuemax={total}
            aria-valuenow={lesson.order}
          >
            <div
              className={styles.progressFill}
              style={{ width: `${(lesson.order / total) * 100}%` }}
            />
          </div>
        </div>
        <h2 className={styles.title}>{lesson.title}</h2>
        <p className={styles.goal}>{lesson.shortGoal}</p>
      </header>

      <div className={styles.body}>
        {lesson.narrative.map((p, i) => (
          <p key={i} className={styles.paragraph}>
            {renderGlossaryInline(p)}
          </p>
        ))}
      </div>

      <aside className={`${styles.callout} ${styles.keyIdea}`}>
        <span className={styles.calloutLabel}>{bp.keyIdea}</span>
        <p>{lesson.keyIdea}</p>
      </aside>

      <aside className={`${styles.callout} ${styles.confusion}`}>
        <span className={styles.calloutLabel}>{bp.commonConfusion}</span>
        <p>{lesson.commonConfusion}</p>
      </aside>

      {lesson.widget === 'graph-symmetry' && <GraphSymmetryCard />}
      {lesson.widget === 'level-comparison' && <LevelComparisonCard />}

      {lesson.actionPrompt && (
        <section className={styles.action} aria-label={bp.actionLabel}>
          <span className={styles.sectionLabel}>{bp.actionLabel}</span>
          <p>{renderGlossaryInline(lesson.actionPrompt)}</p>
          {lesson.optionalSetupConfig && (
            <button
              type="button"
              className={styles.applyButton}
              onClick={handleApply}
            >
              {justApplied ? bp.applied : bp.applySetup}
            </button>
          )}
        </section>
      )}

      <section className={styles.reflection} aria-label={bp.reflectionAria}>
        <span className={styles.sectionLabel}>{bp.reflectionLabel}</span>
        <ul className={styles.reflectionList}>
          {lesson.reflectionPrompts.map((p, i) => (
            <li key={i}>{p}</li>
          ))}
        </ul>
        <p className={styles.reflectionNote}>{bp.reflectionNote}</p>
      </section>

      {(lesson.relatedConceptIds.length > 0 ||
        lesson.relatedLessonIds.length > 0 ||
        (lesson.suggestedChallengeIds && lesson.suggestedChallengeIds.length > 0)) && (
        <section className={styles.links} aria-label={bp.relatedAria}>
          {lesson.relatedConceptIds.length > 0 && (
            <div className={styles.linkGroup}>
              <span className={styles.sectionLabel}>{bp.relatedConcepts}</span>
              <div className={styles.chips}>
                {lesson.relatedConceptIds.map((id) => {
                  const e = getGlossaryEntry(id, locale);
                  if (!e) return null;
                  return (
                    <button
                      key={id}
                      type="button"
                      className={styles.chip}
                      onClick={() => openEntry(id)}
                    >
                      {e.label}
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {lesson.relatedLessonIds.length > 0 && (
            <div className={styles.linkGroup}>
              <span className={styles.sectionLabel}>{bp.relatedLessons}</span>
              <ul className={styles.linkList}>
                {lesson.relatedLessonIds.map((id) => {
                  const l = getLesson(id, locale);
                  return (
                    <li key={id}>
                      <button
                        type="button"
                        className={styles.linkRow}
                        onClick={() => openLesson(id)}
                      >
                        <span className={styles.linkTag}>
                          {bp.lessonOrder(l.order)}
                        </span>
                        <span className={styles.linkTitle}>{l.title}</span>
                        <span className={styles.linkArrow} aria-hidden>
                          →
                        </span>
                      </button>
                    </li>
                  );
                })}
              </ul>
            </div>
          )}

          {lesson.suggestedChallengeIds &&
            lesson.suggestedChallengeIds.length > 0 && (
              <div className={styles.linkGroup}>
                <span className={styles.sectionLabel}>
                  {bp.relatedChallenges}
                </span>
                <ul className={styles.linkList}>
                  {lesson.suggestedChallengeIds.map((id) => {
                    const c = getChallenge(id, locale);
                    if (!c) return null;
                    return (
                      <li key={id}>
                        <button
                          type="button"
                          className={styles.linkRow}
                          onClick={() => openChallenge(id)}
                        >
                          <span className={styles.linkTag}>
                            {bp.challengeOrder(c.order)}
                          </span>
                          <span className={styles.linkTitle}>{c.title}</span>
                          <span className={styles.linkArrow} aria-hidden>
                            →
                          </span>
                        </button>
                      </li>
                    );
                  })}
                </ul>
              </div>
            )}
        </section>
      )}

      <nav className={styles.nav} aria-label={bp.navAria}>
        <button
          type="button"
          className={styles.navButton}
          onClick={() => prev && onChangeBridgeLesson(prev)}
          disabled={!prev}
        >
          {bp.prev}
        </button>
        <span className={styles.navCount}>
          {lesson.order} / {total}
        </span>
        <button
          type="button"
          className={styles.navButton}
          onClick={() => next && onChangeBridgeLesson(next)}
          disabled={!next}
        >
          {bp.next}
        </button>
      </nav>
    </article>
  );
}
