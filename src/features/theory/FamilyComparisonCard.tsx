import type { DemoConfig } from '../../types/graph';
import { NarrativeCard } from '../../components/NarrativeCard';
import { getStateFamilies } from '../../data/stateFamilies';
import { useLocale, useUiText } from '../../i18n';
import styles from './FamilyComparisonCard.module.css';

interface FamilyComparisonCardProps {
  config: DemoConfig;
}

export function FamilyComparisonCard({ config }: FamilyComparisonCardProps) {
  const locale = useLocale();
  const t = useUiText().theoryCards;
  const presets = getStateFamilies(locale);
  return (
    <NarrativeCard title={t.familyCompTitle} pill={t.familyCompPill}>
      <p className={styles.intro}>{t.familyCompIntro}</p>
      <ul className={styles.list}>
        {presets.map((f) => {
          const active = config.stateFamily === f.id;
          return (
            <li
              key={f.id}
              className={`${styles.item} ${active ? styles.itemActive : ''}`}
            >
              <div className={styles.itemHeader}>
                <span className={styles.name}>{f.label}</span>
                {active && (
                  <span className={styles.activeTag}>{t.familyCompActive}</span>
                )}
              </div>
              <span className={styles.desc}>{f.shortDescription}</span>
            </li>
          );
        })}
      </ul>
    </NarrativeCard>
  );
}
