import type { DemoConfig } from '../../types/graph';
import { NarrativeCard } from '../../components/NarrativeCard';
import { getObservables } from '../graph/observableDefinitions';
import { GlossaryLink } from '../learning/GlossaryLink';
import { useLocale, useUiText } from '../../i18n';
import styles from './ObservableNotesCard.module.css';

interface ObservableNotesCardProps {
  config: DemoConfig;
}

export function ObservableNotesCard({ config }: ObservableNotesCardProps) {
  const locale = useLocale();
  const t = useUiText().theoryCards;
  const observables = getObservables(locale);
  return (
    <NarrativeCard title={t.obsNotesTitle} pill={t.obsNotesPill}>
      <p>
        {t.obsNotesP1a}
        <strong>{t.obsNotesP1notStrong}</strong>
        {t.obsNotesP1b}
        <GlossaryLink id="observable-lens">{t.obsNotesP1c}</GlossaryLink>
        {t.obsNotesP1d}
      </p>
      <ul className={styles.list}>
        {observables.map((o) => {
          const active = config.observableMode === o.id;
          return (
            <li
              key={o.id}
              className={`${styles.item} ${active ? styles.itemActive : ''}`}
            >
              <span className={styles.name}>{o.label}</span>
              <span className={styles.desc}>{o.interpretation}</span>
            </li>
          );
        })}
      </ul>
      <p>
        {t.obsNotesP2a}
        <GlossaryLink id="state-family">{t.obsNotesP2b}</GlossaryLink>
        {t.obsNotesP2c}
        <em>{t.obsNotesP2bellEm}</em>
        {t.obsNotesP2d}
        <em>{t.obsNotesP2frustEm}</em>
        {t.obsNotesP2e}
        <em>{t.obsNotesP2edgeEm}</em>
        {t.obsNotesP2f}
      </p>
    </NarrativeCard>
  );
}
