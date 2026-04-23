import { NarrativeCard } from '../../components/NarrativeCard';
import { GlossaryLink } from '../learning/GlossaryLink';
import { useUiText } from '../../i18n';

export function WhyThisMattersCard() {
  const t = useUiText().theoryCards;
  return (
    <NarrativeCard title={t.whyMattersTitle} pill={t.whyMattersPill}>
      <p>
        {t.whyMattersP1a}
        <strong>{t.whyMattersP1notStrong}</strong>
        {t.whyMattersP1b}
        <GlossaryLink id="bell-network">
          {t.whyMattersP1c}
        </GlossaryLink>
        {t.whyMattersP1d}
        <GlossaryLink id="gluing">{t.whyMattersP1e}</GlossaryLink>
        {t.whyMattersP1f}
      </p>
      <p>
        {t.whyMattersP2a}
        <em>{t.whyMattersP2feelEm}</em>
        {t.whyMattersP2b}
        <strong>{t.whyMattersP2strong}</strong>
        {t.whyMattersP2c}
      </p>
    </NarrativeCard>
  );
}
