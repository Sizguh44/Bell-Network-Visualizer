import { useEffect, useMemo, useState } from 'react';
import type { LibraryTab } from '../../types/content';
import {
  getBridgeLessons,
  getChallenges,
  getContentStats,
  getGlossaryEntries,
  getLessons,
} from '../../data/contentIndex';
import { useGlossary } from '../learning/GlossaryContext';
import { useLocale, useUiText } from '../../i18n';
import styles from './ContentLibraryPanel.module.css';

interface ContentLibraryPanelProps {
  open: boolean;
  activeTab: LibraryTab;
  onClose: () => void;
  onChangeTab: (tab: LibraryTab) => void;
}

const TAB_ORDER: readonly LibraryTab[] = [
  'lessons',
  'challenges',
  'bridge',
  'glossary',
];

export function ContentLibraryPanel({
  open,
  activeTab,
  onClose,
  onChangeTab,
}: ContentLibraryPanelProps) {
  const { openEntry, openLesson, openChallenge, openBridgeLesson } = useGlossary();
  const locale = useLocale();
  const t = useUiText();
  const lib = t.library;
  const [query, setQuery] = useState('');

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open, onClose]);

  useEffect(() => {
    if (open) setQuery('');
  }, [open, activeTab]);

  const stats = useMemo(() => getContentStats(), []);
  // Content lists pulled in the active locale so all titles / descriptions
  // / searchable fields live in the same language as the UI chrome.
  const lessons = useMemo(() => getLessons(locale), [locale]);
  const challenges = useMemo(() => getChallenges(locale), [locale]);
  const bridges = useMemo(() => getBridgeLessons(locale), [locale]);
  const glossaryEntries = useMemo(() => getGlossaryEntries(locale), [locale]);

  if (!open) return null;

  const handleBackdropClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) onClose();
  };

  const q = query.trim().toLowerCase();
  const matches = (haystack: string) => haystack.toLowerCase().includes(q);

  const activeTabLabel = lib.tabs[activeTab];

  return (
    <div
      className={styles.overlay}
      role="dialog"
      aria-modal="true"
      aria-label={lib.aria}
      onClick={handleBackdropClick}
    >
      <aside className={styles.panel}>
        <header className={styles.header}>
          <div className={styles.titleRow}>
            <span className={styles.eyebrow}>{lib.eyebrow}</span>
            <button
              type="button"
              onClick={onClose}
              className={styles.closeButton}
              aria-label={lib.close}
            >
              ×
            </button>
          </div>
          <h2 className={styles.heading}>{lib.heading}</h2>
          <p className={styles.subheading}>{lib.subheading}</p>
          <p className={styles.stats}>
            {lib.statsTemplate(
              stats.lessons,
              stats.challenges,
              stats.bridges,
              stats.glossaryEntries,
            )}
          </p>
        </header>

        <div
          className={styles.tabs}
          role="tablist"
          aria-label={lib.categoriesAria}
        >
          {TAB_ORDER.map((tabId) => {
            const active = tabId === activeTab;
            const counts: Record<LibraryTab, number> = {
              lessons: stats.lessons,
              challenges: stats.challenges,
              bridge: stats.bridges,
              glossary: stats.glossaryEntries,
            };
            return (
              <button
                key={tabId}
                type="button"
                role="tab"
                aria-selected={active}
                className={`${styles.tab} ${active ? styles.tabActive : ''}`}
                onClick={() => onChangeTab(tabId)}
              >
                <span className={styles.tabLabel}>{lib.tabs[tabId]}</span>
                <span className={styles.tabCount}>{counts[tabId]}</span>
              </button>
            );
          })}
        </div>

        <div className={styles.searchRow}>
          <input
            type="search"
            className={styles.search}
            placeholder={lib.searchPlaceholder(activeTabLabel.toLowerCase())}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            aria-label={lib.searchAria}
          />
        </div>

        <div className={styles.body}>
          {activeTab === 'lessons' && (
            <ul className={styles.list}>
              {lessons
                .filter(
                  (l) =>
                    !l.hidden &&
                    (!q || matches(l.title) || matches(l.shortGoal)),
                )
                .map((l) => (
                  <li key={l.id}>
                    <button
                      type="button"
                      className={styles.tile}
                      onClick={() => {
                        openLesson(l.id);
                        onClose();
                      }}
                    >
                      <span className={styles.tileTag}>
                        {lib.tagLesson(l.order)}
                      </span>
                      <span className={styles.tileTitle}>{l.title}</span>
                      <span className={styles.tileSubtitle}>{l.shortGoal}</span>
                    </button>
                  </li>
                ))}
              <EmptyState
                visible={
                  lessons.filter(
                    (l) =>
                      !l.hidden &&
                      (!q || matches(l.title) || matches(l.shortGoal)),
                  ).length === 0
                }
                text={lib.empty}
              />
            </ul>
          )}

          {activeTab === 'challenges' && (
            <ul className={styles.list}>
              {challenges
                .filter(
                  (c) =>
                    !c.hidden &&
                    (!q || matches(c.title) || matches(c.shortGoal)),
                )
                .map((c) => (
                  <li key={c.id}>
                    <button
                      type="button"
                      className={styles.tile}
                      onClick={() => {
                        openChallenge(c.id);
                        onClose();
                      }}
                    >
                      <span className={styles.tileTagRow}>
                        <span className={styles.tileTag}>
                          {lib.tagChallenge(c.order)}
                        </span>
                        <span
                          className={`${styles.tileBadge} ${styles[`diff-${c.difficulty}`]}`}
                        >
                          {t.challenge.difficulty[c.difficulty]}
                        </span>
                        <span className={styles.tileBadge}>
                          {t.challenge.type[c.type]}
                        </span>
                      </span>
                      <span className={styles.tileTitle}>{c.title}</span>
                      <span className={styles.tileSubtitle}>{c.shortGoal}</span>
                    </button>
                  </li>
                ))}
              <EmptyState
                visible={
                  challenges.filter(
                    (c) =>
                      !c.hidden &&
                      (!q || matches(c.title) || matches(c.shortGoal)),
                  ).length === 0
                }
                text={lib.empty}
              />
            </ul>
          )}

          {activeTab === 'bridge' && (
            <ul className={styles.list}>
              {bridges
                .filter(
                  (b) =>
                    !b.hidden &&
                    (!q || matches(b.title) || matches(b.shortGoal)),
                )
                .map((b) => (
                  <li key={b.id}>
                    <button
                      type="button"
                      className={styles.tile}
                      onClick={() => {
                        openBridgeLesson(b.id);
                        onClose();
                      }}
                    >
                      <span className={styles.tileTag}>
                        {lib.tagBridge(b.order)}
                      </span>
                      <span className={styles.tileTitle}>{b.title}</span>
                      <span className={styles.tileSubtitle}>{b.shortGoal}</span>
                    </button>
                  </li>
                ))}
              <EmptyState
                visible={
                  bridges.filter(
                    (b) =>
                      !b.hidden &&
                      (!q || matches(b.title) || matches(b.shortGoal)),
                  ).length === 0
                }
                text={lib.empty}
              />
            </ul>
          )}

          {activeTab === 'glossary' && (
            <ul className={styles.list}>
              {glossaryEntries
                .filter(
                  (g) =>
                    !g.hidden &&
                    (!q ||
                      matches(g.label) ||
                      matches(g.shortDefinition) ||
                      matches(g.id)),
                )
                .map((g) => (
                  <li key={g.id}>
                    <button
                      type="button"
                      className={styles.tile}
                      onClick={() => {
                        openEntry(g.id);
                        onClose();
                      }}
                    >
                      <span className={styles.tileTag}>{lib.tagConcept}</span>
                      <span className={styles.tileTitle}>{g.label}</span>
                      <span className={styles.tileSubtitle}>
                        {g.shortDefinition}
                      </span>
                    </button>
                  </li>
                ))}
              <EmptyState
                visible={
                  glossaryEntries.filter(
                    (g) =>
                      !g.hidden &&
                      (!q ||
                        matches(g.label) ||
                        matches(g.shortDefinition) ||
                        matches(g.id)),
                  ).length === 0
                }
                text={lib.empty}
              />
            </ul>
          )}
        </div>
      </aside>
    </div>
  );
}

function EmptyState({ visible, text }: { visible: boolean; text: string }) {
  if (!visible) return null;
  return (
    <li className={styles.emptyState}>
      <p>{text}</p>
    </li>
  );
}
