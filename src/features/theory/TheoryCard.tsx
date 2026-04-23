import { NarrativeCard } from '../../components/NarrativeCard';
import { GlossaryLink } from '../learning/GlossaryLink';
import { useUiText } from '../../i18n';

export function TheoryCard() {
  const t = useUiText().theoryCards;
  return (
    <NarrativeCard title={t.theoryNotesTitle} pill={t.theoryNotesPill}>
      <p>
        {t.theoryNotesP1a}
        <GlossaryLink id="spin-network">
          <strong>spin-network</strong>
        </GlossaryLink>
        {t.theoryNotesP1b}
        <GlossaryLink id="intertwiner">intertwiner</GlossaryLink>
        {t.theoryNotesP1c}
        <em>{t.theoryNotesP1notEm}</em>
        {t.theoryNotesP1d}
      </p>
      <p>
        <GlossaryLink id="bell-network">
          <strong>{t.theoryNotesP2a}</strong>
        </GlossaryLink>
        {t.theoryNotesP2b}
        <GlossaryLink id="dipole-graph">dipole graph</GlossaryLink>
        {t.theoryNotesP2c}
      </p>
    </NarrativeCard>
  );
}
