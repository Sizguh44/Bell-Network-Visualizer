import type { ObservableDefinition, ObservableMode } from '../../types/graph';
import type { Locale } from '../../i18n/types';

interface LocalisedObservableCopy {
  label: string;
  shortDescription: string;
  interpretation: string;
}

interface LocalisedObservableRecord {
  id: ObservableMode;
  largerIsBetter: boolean | null;
  unit: string;
  headlineDigits: number;
  copy: Record<Locale, LocalisedObservableCopy>;
}

/**
 * Five toy "lenses" for reading the same underlying state. Each definition
 * tells the UI how to label, format and describe the observable; the actual
 * numeric computation lives in `deriveObservableSummary.ts`.
 */
const RAW: readonly LocalisedObservableRecord[] = [
  {
    id: 'alignment',
    largerIsBetter: true,
    unit: '',
    headlineDigits: 3,
    copy: {
      en: {
        label: 'Alignment',
        shortDescription: 'How close each pair is to anti-parallel on average.',
        interpretation:
          'Mean cosine-like alignment across the four face pairs. Higher means cleaner back-to-back orientation.',
      },
      tr: {
        label: 'Alignment',
        shortDescription:
          'Her pair’ın ortalamada anti-parallel’a ne kadar yakın olduğu.',
        interpretation:
          'Dört face pair üzerinde ortalama kosinüs benzeri alignment. Yüksek değer, daha temiz back-to-back yönelim demektir.',
      },
    },
  },
  {
    id: 'mismatch',
    largerIsBetter: false,
    unit: '°',
    headlineDigits: 1,
    copy: {
      en: {
        label: 'Mismatch',
        shortDescription:
          'Angular departure of each right-hand arrow from its ideal partner.',
        interpretation:
          'Mean pair-level mismatch angle in degrees. Lower is closer to a glued geometry.',
      },
      tr: {
        label: 'Mismatch',
        shortDescription:
          'Her sağ kol okun ideal partnerinden açısal sapması.',
        interpretation:
          'Derece cinsinden ortalama pair düzeyi mismatch açısı. Düşük değer glued geometry’ye daha yakındır.',
      },
    },
  },
  {
    id: 'gluing',
    largerIsBetter: true,
    unit: '',
    headlineDigits: 3,
    copy: {
      en: {
        label: 'Gluing',
        shortDescription:
          'Combined alignment × strength × uniformity — the "glued polyhedra" proxy.',
        interpretation:
          'Toy gluing score that aggregates per-pair alignment and strength, penalised by non-uniformity.',
      },
      tr: {
        label: 'Gluing',
        shortDescription:
          'Birleşik alignment × strength × uniformity — "glued polyhedra" proxy’si.',
        interpretation:
          'Pair başına alignment ve strength’i toplayan, düzensizlik ile cezalandırılan toy gluing skoru.',
      },
    },
  },
  {
    id: 'correlation',
    largerIsBetter: null,
    unit: '',
    headlineDigits: 3,
    copy: {
      en: {
        label: 'Correlation',
        shortDescription:
          'Per-pair correlation strength and how evenly it is distributed.',
        interpretation:
          'Mean per-pair local strength with the pair-range as a secondary figure. Shows whether the family spreads correlation uniformly or localises it.',
      },
      tr: {
        label: 'Correlation',
        shortDescription:
          'Pair başına korelasyon strength’i ve ne kadar eşit dağıldığı.',
        interpretation:
          'İkincil değer olarak pair aralığıyla birlikte pair başına ortalama yerel strength. Family’nin korelasyonu eşit dağıtıp dağıtmadığını ya da yerelleştirip yerelleştirmediğini gösterir.',
      },
    },
  },
  {
    id: 'uniformity',
    largerIsBetter: true,
    unit: '',
    headlineDigits: 3,
    copy: {
      en: {
        label: 'Uniformity',
        shortDescription: 'How similarly the four pairs behave.',
        interpretation:
          'Cohesion proxy, 1 − 2·σ of pair alignments. Symmetric families score high; frustrated and edge-biased families score low.',
      },
      tr: {
        label: 'Uniformity',
        shortDescription: 'Dört pair’ın birbirine ne kadar benzer davrandığı.',
        interpretation:
          'Cohesion proxy’si, 1 − 2·σ(pair alignment’ları). Simetrik family’ler yüksek, frustrated ve edge-biased family’ler düşük skor alır.',
      },
    },
  },
];

function project(record: LocalisedObservableRecord, locale: Locale): ObservableDefinition {
  const copy = record.copy[locale];
  return {
    id: record.id,
    label: copy.label,
    shortDescription: copy.shortDescription,
    interpretation: copy.interpretation,
    largerIsBetter: record.largerIsBetter,
    unit: record.unit,
    headlineDigits: record.headlineDigits,
  };
}

const BY_LOCALE: Record<Locale, readonly ObservableDefinition[]> = {
  en: RAW.map((r) => project(r, 'en')),
  tr: RAW.map((r) => project(r, 'tr')),
};

const LOOKUP: Record<Locale, Record<ObservableMode, ObservableDefinition>> = {
  en: BY_LOCALE.en.reduce<Record<ObservableMode, ObservableDefinition>>(
    (acc, d) => ({ ...acc, [d.id]: d }),
    {} as Record<ObservableMode, ObservableDefinition>,
  ),
  tr: BY_LOCALE.tr.reduce<Record<ObservableMode, ObservableDefinition>>(
    (acc, d) => ({ ...acc, [d.id]: d }),
    {} as Record<ObservableMode, ObservableDefinition>,
  ),
};

export function getObservables(locale: Locale): readonly ObservableDefinition[] {
  return BY_LOCALE[locale];
}

export function getObservable(id: ObservableMode, locale: Locale): ObservableDefinition {
  return LOOKUP[locale][id];
}
