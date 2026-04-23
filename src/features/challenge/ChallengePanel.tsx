import { useState } from 'react';
import type {
  Challenge,
  ChallengeId,
  ChallengeState,
  ChallengeStates,
} from '../../types/challenge';
import { getChallenge, getChallenges } from '../../data/challenges';
import { getGlossaryEntry } from '../../data/glossary';
import { getLesson } from '../../data/lessons';
import { useGlossary } from '../learning/GlossaryContext';
import { useLocale, useUiText } from '../../i18n';
import styles from './ChallengePanel.module.css';

interface ChallengePanelProps {
  activeChallengeId: ChallengeId;
  onChangeChallenge: (id: ChallengeId) => void;
  challengeStates: ChallengeStates;
  onChallengeStateChange: (id: ChallengeId, next: ChallengeState) => void;
  onApplySetup: (challenge: Challenge) => void;
}

export function ChallengePanel({
  activeChallengeId,
  onChangeChallenge,
  challengeStates,
  onChallengeStateChange,
  onApplySetup,
}: ChallengePanelProps) {
  const { openEntry, openLesson } = useGlossary();
  const locale = useLocale();
  const t = useUiText();
  const cp = t.challenge;

  const challenge = getChallenge(activeChallengeId, locale);

  if (!challenge) {
    return (
      <article className={styles.root} aria-label={cp.introLabel}>
        <p className={styles.empty}>{cp.empty}</p>
      </article>
    );
  }

  const state = challengeStates[activeChallengeId] ?? {
    selectedOptionId: null,
    revealed: false,
  };
  const total = getChallenges(locale).length;
  const completedCount = Object.values(challengeStates).filter(
    (s) => s.revealed,
  ).length;

  const prev = challenge.prevChallengeId;
  const next = challenge.nextChallengeId;

  const [justApplied, setJustApplied] = useState(false);

  const selectOption = (optionId: string) => {
    if (state.revealed) return;
    onChallengeStateChange(activeChallengeId, {
      ...state,
      selectedOptionId: optionId,
    });
  };

  const reveal = () => {
    onChallengeStateChange(activeChallengeId, { ...state, revealed: true });
  };

  const handleApply = () => {
    onApplySetup(challenge);
    setJustApplied(true);
    window.setTimeout(() => setJustApplied(false), 1400);
  };

  return (
    <article className={styles.root} aria-label={cp.aria(challenge.title)}>
      <div className={styles.introBar} aria-hidden>
        <span className={styles.introLabel}>{cp.introLabel}</span>
        <span className={styles.introFlow}>{cp.introFlow}</span>
      </div>

      <header className={styles.header}>
        <div className={styles.progressRow}>
          <span className={styles.progressLabel}>
            {cp.progress(challenge.order, total)}
          </span>
          <span className={styles.completedTag}>
            {cp.completedCount(completedCount)}
          </span>
        </div>

        <div className={styles.badgeRow}>
          <span
            className={`${styles.difficulty} ${styles[`diff-${challenge.difficulty}`]}`}
          >
            {cp.difficulty[challenge.difficulty]}
          </span>
          <span
            className={`${styles.type} ${styles[`type-${challenge.type}`]}`}
          >
            {cp.type[challenge.type]}
          </span>
        </div>

        <h2 className={styles.title}>{challenge.title}</h2>
        <p className={styles.goal}>{challenge.shortGoal}</p>
      </header>

      <section className={styles.prompt} aria-label={cp.promptLabel}>
        <div className={styles.sectionLabel}>{cp.promptLabel}</div>
        <p>{challenge.prompt}</p>
        <button
          type="button"
          className={styles.applyButton}
          onClick={handleApply}
        >
          {justApplied ? cp.applied : cp.applySetup}
        </button>
      </section>

      {state.revealed && challenge.expectedObservation && (
        <section className={styles.expected} aria-label={cp.expectedLabel}>
          <span className={styles.sectionLabel}>{cp.expectedLabel}</span>
          <p>{challenge.expectedObservation}</p>
        </section>
      )}

      <section
        className={styles.answer}
        aria-label={cp.answerAria}
        aria-live="polite"
      >
        <div className={styles.sectionLabel}>{cp.yourAnswer}</div>
        <ul
          className={styles.options}
          role="radiogroup"
          aria-label={cp.optionsAria}
        >
          {challenge.answerOptions.map((opt) => {
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
                    name={`challenge-${challenge.id}`}
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
                          ? t.lesson.iconCorrect
                          : selected
                            ? t.lesson.iconIncorrect
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
            className={styles.checkButton}
            onClick={reveal}
            disabled={state.selectedOptionId === null}
          >
            {cp.check}
          </button>
        ) : (
          <div className={styles.explanation}>
            <span className={styles.explanationLabel}>
              {cp.explanationLabel}
            </span>
            <p>{challenge.explanation}</p>
          </div>
        )}
      </section>

      {(challenge.relatedConceptIds.length > 0 ||
        challenge.relatedLessonIds.length > 0) && (
        <section className={styles.links} aria-label={cp.relatedAria}>
          {challenge.relatedConceptIds.length > 0 && (
            <div className={styles.linkGroup}>
              <span className={styles.sectionLabel}>{cp.relatedConcepts}</span>
              <div className={styles.chips}>
                {challenge.relatedConceptIds.map((id) => {
                  const entry = getGlossaryEntry(id, locale);
                  if (!entry) return null;
                  return (
                    <button
                      key={id}
                      type="button"
                      className={styles.chip}
                      onClick={() => openEntry(id)}
                      title={cp.openInAtlas(entry.label)}
                    >
                      {entry.label}
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {challenge.relatedLessonIds.length > 0 && (
            <div className={styles.linkGroup}>
              <span className={styles.sectionLabel}>{cp.relatedLessons}</span>
              <ul className={styles.lessonList}>
                {challenge.relatedLessonIds.map((id) => {
                  const lesson = getLesson(id, locale);
                  return (
                    <li key={id}>
                      <button
                        type="button"
                        className={styles.lessonRow}
                        onClick={() => openLesson(id)}
                      >
                        <span className={styles.lessonOrder}>
                          {cp.lessonOrder(lesson.order)}
                        </span>
                        <span className={styles.lessonTitle}>
                          {lesson.title}
                        </span>
                        <span className={styles.lessonArrow} aria-hidden>
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

      <nav className={styles.nav} aria-label={cp.navAria}>
        <button
          type="button"
          className={styles.navButton}
          onClick={() => prev && onChangeChallenge(prev)}
          disabled={!prev}
        >
          {cp.prev}
        </button>
        <span className={styles.navCount}>
          {challenge.order} / {total}
        </span>
        <button
          type="button"
          className={styles.navButton}
          onClick={() => next && onChangeChallenge(next)}
          disabled={!next}
        >
          {cp.next}
        </button>
      </nav>
    </article>
  );
}
