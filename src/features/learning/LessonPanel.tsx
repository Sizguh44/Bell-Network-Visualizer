import { useMemo, useState } from 'react';
import type {
  Lesson,
  LessonId,
  LessonState,
  LessonStates,
} from '../../types/learning';
import { getLesson, getLessons } from '../../data/lessons';
import { getConceptLabel } from '../../data/glossary';
import { getLessonRecommendations } from '../../data/contentIndex';
import { LessonCallout } from './LessonCallout';
import { renderGlossaryInline } from './renderGlossaryInline';
import { useGlossary } from './GlossaryContext';
import { useLocale, useUiText } from '../../i18n';
import styles from './LessonPanel.module.css';

interface LessonPanelProps {
  activeLessonId: LessonId;
  onChangeLesson: (id: LessonId) => void;
  lessonStates: LessonStates;
  onLessonStateChange: (id: LessonId, next: LessonState) => void;
  onApplySetup: (lesson: Lesson) => void;
}

export function LessonPanel({
  activeLessonId,
  onChangeLesson,
  lessonStates,
  onLessonStateChange,
  onApplySetup,
}: LessonPanelProps) {
  const { openEntry, openChallenge, openBridgeLesson } = useGlossary();
  const locale = useLocale();
  const t = useUiText();
  const lp = t.lesson;
  const lesson = getLesson(activeLessonId, locale);
  const state = lessonStates[activeLessonId] ?? {
    selectedOptionId: null,
    revealed: false,
  };
  const total = getLessons(locale).length;
  const prev = lesson.prevLessonId;
  const next = lesson.nextLessonId;

  // Concept-overlap based "next step" pointers, surfaced only after the
  // learner reveals the checkpoint answer so they flow into a natural pause.
  // The helper is locale-aware: it returns `Challenge` / `BridgeLesson` in
  // the active locale.
  const recs = useMemo(
    () => getLessonRecommendations(lesson, locale),
    [lesson, locale],
  );

  const [justApplied, setJustApplied] = useState(false);

  const selectOption = (optionId: string) => {
    if (state.revealed) return;
    onLessonStateChange(activeLessonId, { ...state, selectedOptionId: optionId });
  };
  const reveal = () => {
    onLessonStateChange(activeLessonId, { ...state, revealed: true });
  };
  const handleApply = () => {
    onApplySetup(lesson);
    setJustApplied(true);
    window.setTimeout(() => setJustApplied(false), 1400);
  };

  return (
    <article className={styles.root} aria-label={lp.aria(lesson.title)}>
      <header className={styles.header}>
        <div className={styles.progressRow}>
          <span className={styles.progressLabel}>
            {lp.progress(lesson.order, total)}
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

        <ul className={styles.tags} aria-label={lp.conceptsAria}>
          {lesson.conceptTags.map((tag) => (
            <li key={tag}>
              <button
                type="button"
                className={styles.tag}
                onClick={() => openEntry(tag)}
                title={lp.openInAtlas(getConceptLabel(tag, locale))}
              >
                {getConceptLabel(tag, locale)}
              </button>
            </li>
          ))}
        </ul>
      </header>

      <div className={styles.body}>
        {lesson.narrative.map((p, i) => (
          <p key={i} className={styles.paragraph}>
            {renderGlossaryInline(p)}
          </p>
        ))}
      </div>

      {lesson.callouts && lesson.callouts.length > 0 && (
        <div className={styles.callouts}>
          {lesson.callouts.map((c, i) => (
            <LessonCallout key={i} kind={c.kind} body={c.body} />
          ))}
        </div>
      )}

      <section className={styles.action} aria-label={lp.actionLabel}>
        <div className={styles.sectionLabel}>{lp.actionLabel}</div>
        <p className={styles.actionPrompt}>{lesson.actionPrompt}</p>
        <button
          type="button"
          className={styles.applyButton}
          onClick={handleApply}
        >
          {justApplied ? lp.applied : lp.applySetup}
        </button>
      </section>

      <section
        className={styles.checkpoint}
        aria-label={lp.checkpointAria}
        aria-live="polite"
      >
        <div className={styles.sectionLabel}>{lp.checkpointLabel}</div>
        <p className={styles.question}>{lesson.checkpointQuestion}</p>
        <ul
          className={styles.options}
          role="radiogroup"
          aria-label={lp.optionsAria}
        >
          {lesson.checkpointOptions.map((opt) => {
            const selected = state.selectedOptionId === opt.id;
            const showResult = state.revealed;
            const isCorrect = opt.correct;
            const classes = [
              styles.option,
              selected ? styles.optionSelected : '',
              showResult && isCorrect ? styles.optionCorrect : '',
              showResult && selected && !isCorrect ? styles.optionIncorrect : '',
              showResult ? styles.optionRevealed : '',
            ]
              .filter(Boolean)
              .join(' ');
            return (
              <li key={opt.id} className={styles.optionItem}>
                <label className={classes}>
                  <input
                    type="radio"
                    name={`checkpoint-${lesson.id}`}
                    value={opt.id}
                    checked={selected}
                    onChange={() => selectOption(opt.id)}
                    className={styles.radio}
                    disabled={state.revealed}
                  />
                  <span className={styles.optionText}>{opt.text}</span>
                  {showResult && (
                    <span
                      className={styles.optionIcon}
                      aria-label={
                        isCorrect
                          ? lp.iconCorrect
                          : selected
                            ? lp.iconIncorrect
                            : ''
                      }
                    >
                      {isCorrect ? '✓' : selected ? '✕' : ''}
                    </span>
                  )}
                </label>
                {showResult && (selected || isCorrect) && (
                  <p className={styles.optionFeedback}>{opt.feedback}</p>
                )}
              </li>
            );
          })}
        </ul>

        {!state.revealed ? (
          <button
            type="button"
            className={styles.revealButton}
            onClick={reveal}
            disabled={state.selectedOptionId === null}
          >
            {lp.reveal}
          </button>
        ) : (
          <div className={styles.explanation}>
            <span className={styles.explanationLabel}>{lp.whyLabel}</span>
            <p>{lesson.checkpointExplanation}</p>
          </div>
        )}
      </section>

      {state.revealed && (recs.challenge || recs.bridge) && (
        <section className={styles.nextSteps} aria-label={lp.nextStepAria}>
          <span className={styles.sectionLabel}>{lp.nextStepLabel}</span>
          <ul className={styles.nextList}>
            {recs.challenge && (
              <li>
                <button
                  type="button"
                  className={styles.nextRow}
                  onClick={() => openChallenge(recs.challenge!.id)}
                >
                  <span className={styles.nextTag}>{lp.tryItTag}</span>
                  <span className={styles.nextBody}>
                    <span className={styles.nextKind}>
                      {t.atlas.challengeOrder(recs.challenge.order)}
                    </span>
                    <span className={styles.nextTitle}>
                      {recs.challenge.title}
                    </span>
                  </span>
                  <span className={styles.nextArrow} aria-hidden>
                    →
                  </span>
                </button>
              </li>
            )}
            {recs.bridge && (
              <li>
                <button
                  type="button"
                  className={styles.nextRow}
                  onClick={() => openBridgeLesson(recs.bridge!.id)}
                >
                  <span className={styles.nextTag}>{lp.goDeeperTag}</span>
                  <span className={styles.nextBody}>
                    <span className={styles.nextKind}>
                      {t.atlas.bridgeOrder(recs.bridge.order)}
                    </span>
                    <span className={styles.nextTitle}>
                      {recs.bridge.title}
                    </span>
                  </span>
                  <span className={styles.nextArrow} aria-hidden>
                    →
                  </span>
                </button>
              </li>
            )}
          </ul>
        </section>
      )}

      <nav className={styles.nav} aria-label={lp.navAria}>
        <button
          type="button"
          className={styles.navButton}
          onClick={() => prev && onChangeLesson(prev)}
          disabled={!prev}
        >
          {lp.prev}
        </button>
        <span className={styles.navCount}>
          {lesson.order} / {total}
        </span>
        <button
          type="button"
          className={styles.navButton}
          onClick={() => next && onChangeLesson(next)}
          disabled={!next}
        >
          {lp.next}
        </button>
      </nav>
    </article>
  );
}
