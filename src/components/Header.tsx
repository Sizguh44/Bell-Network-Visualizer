import type { GraphTopologyId } from '../types/graph';
import type { AppMode } from '../types/learning';
import { ModeToggle } from '../features/learning/ModeToggle';
import { useGlossary } from '../features/learning/GlossaryContext';
import { getTopology } from '../data/topologies';
import { useLocale, useUiText } from '../i18n';
import { LanguageSwitcher } from './LanguageSwitcher';
import styles from './Header.module.css';

interface HeaderProps {
  mode: AppMode;
  onModeChange: (next: AppMode) => void;
  topologyId: GraphTopologyId;
  onShowOnboarding: () => void;
}

export function Header({
  mode,
  onModeChange,
  topologyId,
  onShowOnboarding,
}: HeaderProps) {
  const { openAtlas, openLibrary } = useGlossary();
  const locale = useLocale();
  const t = useUiText();
  const topology = getTopology(topologyId, locale);

  return (
    <div className={styles.root}>
      <div className={styles.lead}>
        <span className={styles.eyebrow}>{t.header.eyebrow(topology.label)}</span>
        <h1 className={styles.title}>{t.header.title}</h1>
        <p className={styles.subtitle}>{t.header.subtitle}</p>
      </div>

      <div className={styles.meta} aria-label={t.header.metaAria}>
        <div className={styles.controlsRow}>
          <ModeToggle mode={mode} onChange={onModeChange} />
          <button
            type="button"
            className={styles.navButton}
            onClick={onShowOnboarding}
            title={t.header.howToUseTitle}
          >
            <span aria-hidden>?</span>
            {t.header.howToUse}
          </button>
          <button
            type="button"
            className={styles.navButton}
            onClick={openAtlas}
            title={t.header.atlasTitle}
          >
            <span aria-hidden>◈</span>
            {t.header.atlas}
          </button>
          <button
            type="button"
            className={styles.navButton}
            onClick={() => openLibrary()}
            title={t.header.libraryTitle}
          >
            <span aria-hidden>☰</span>
            {t.header.library}
          </button>
          <LanguageSwitcher />
        </div>
        <div className={styles.badges}>
          <span className={styles.badge}>{t.header.badgeToy}</span>
          <span className={styles.badge}>{t.header.badgeStatic}</span>
          <span className={styles.badgeMuted}>v0.5</span>
        </div>
      </div>
    </div>
  );
}
