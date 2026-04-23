import type { DemoConfig, StateFamily, StateFamilyPreset } from '../types/graph';
import type { Locale } from '../i18n/types';

/**
 * Localised core content of one state family. The `id`, offsets, coefficients
 * and `defaultStrength` are locale-independent — only user-facing copy
 * changes between locales.
 */
interface LocalisedFamilyCopy {
  label: string;
  shortDescription: string;
  edgeNarratives: readonly string[];
}

interface LocalisedFamilyRecord {
  id: StateFamily;
  defaultStrength: number;
  strengthOffsets: readonly number[];
  mismatchCoeff: readonly number[];
  copy: Record<Locale, LocalisedFamilyCopy>;
}

/**
 * Five deterministic toy families. Each ships length-`PAIR_COUNT` (= 4)
 * arrays for `strengthOffsets`, `mismatchCoeff` and `edgeNarratives`, so the
 * same family runs unchanged on either shippable topology (Dipole or
 * Cycle-4). Same global strength + different family ⇒ different geometry.
 */
const RAW_PRESETS: readonly LocalisedFamilyRecord[] = [
  {
    id: 'uncorrelated',
    defaultStrength: 0.15,
    strengthOffsets: [0, 0, 0, 0],
    mismatchCoeff: [0.85, -1.0, 0.55, -0.75],
    copy: {
      en: {
        label: 'Uncorrelated',
        shortDescription:
          'Weak shared structure — the polyhedra behave almost independently.',
        edgeNarratives: [
          "Without shared correlations, this pair's normals remain indifferent to its neighbours.",
          'This pair shows the baseline scatter typical of independent polyhedra.',
          'Uncorrelated regime — no preferred direction, no gluing signature.',
          'The uncorrelated family leaves every pair, including this one, essentially free.',
        ],
      },
      tr: {
        label: 'Uncorrelated',
        shortDescription:
          'Paylaşılan yapı zayıf — polyhedra’lar neredeyse bağımsız davranıyor.',
        edgeNarratives: [
          'Paylaşılan korelasyon olmayınca, bu pair’ın normal’ları komşularına kayıtsız kalıyor.',
          'Bu pair, bağımsız polyhedra’lara özgü temel dağılımı sergiliyor.',
          'Uncorrelated rejim — tercih edilen yön yok, gluing izi yok.',
          'Uncorrelated family, bu da dahil tüm pair’ları esasen serbest bırakıyor.',
        ],
      },
    },
  },
  {
    id: 'weakAligned',
    defaultStrength: 0.45,
    strengthOffsets: [-0.04, 0.03, -0.02, 0.04],
    mismatchCoeff: [0.55, -0.65, 0.4, -0.5],
    copy: {
      en: {
        label: 'Weakly aligned',
        shortDescription:
          'Partial support for paired orientation — soft, evenly spread correlations.',
        edgeNarratives: [
          'Weak alignment gently tilts this pair toward back-to-back without locking it.',
          'A soft pull — this pair hints at gluing without committing.',
          'Partial support: the alignment is visible but geometrically ambiguous.',
          'Weakly aligned correlations are spread evenly across all four pairs, including this one.',
        ],
      },
      tr: {
        label: 'Weakly aligned',
        shortDescription:
          'Eşleşmiş yönelim için kısmi destek — yumuşak, eşit yayılan korelasyonlar.',
        edgeNarratives: [
          'Zayıf alignment bu pair’ı kilitlemeden back-to-back yönüne hafifçe eğiyor.',
          'Yumuşak bir çekim — bu pair gluing’e işaret ediyor ama taahhüt etmiyor.',
          'Kısmi destek: alignment görülebilir ama geometrik olarak belirsiz.',
          'Zayıfça hizalı korelasyonlar, bu pair dahil dört pair arasında eşit dağılmış.',
        ],
      },
    },
  },
  {
    id: 'bellSymmetric',
    defaultStrength: 0.9,
    strengthOffsets: [0.02, -0.02, 0.02, -0.02],
    mismatchCoeff: [0.25, -0.2, 0.28, -0.22],
    copy: {
      en: {
        label: 'Bell-like symmetric',
        shortDescription:
          'Strongest clean back-to-back intuition — uniform, symmetric correlations.',
        edgeNarratives: [
          'This pair is crisply anti-parallel alongside the other three.',
          'Symmetric Bell-like support: clean alignment matching its neighbours.',
          'Strong symmetric correlation — this pair glues as cleanly as any other.',
          'Uniform Bell-like correlations leave this pair nearly perfectly back-to-back.',
        ],
      },
      tr: {
        label: 'Bell-like symmetric',
        shortDescription:
          'En temiz back-to-back sezgi — homojen, simetrik korelasyonlar.',
        edgeNarratives: [
          'Bu pair, diğer üçüyle birlikte net biçimde anti-parallel.',
          'Simetrik Bell-like destek: komşularıyla uyumlu temiz alignment.',
          'Güçlü simetrik korelasyon — bu pair diğerleri kadar temiz gluing veriyor.',
          'Homojen Bell-like korelasyonlar, bu pair’ı neredeyse kusursuz biçimde back-to-back bırakıyor.',
        ],
      },
    },
  },
  {
    id: 'frustrated',
    defaultStrength: 0.7,
    strengthOffsets: [0.05, -0.1, 0.08, -0.12],
    mismatchCoeff: [0.08, -0.95, 0.12, -0.9],
    copy: {
      en: {
        label: 'Frustrated',
        shortDescription:
          'Correlation present but geometrically uneven — some pairs resist alignment.',
        edgeNarratives: [
          'In the frustrated family, this pair lands in the well-aligned subset.',
          'Geometrically frustrated: this pair refuses to align even as the global correlation rises.',
          'Another pair that aligns cleanly while half the graph stays frustrated.',
          'Frustration shows itself here — the pair stays noticeably misaligned despite the overall correlation.',
        ],
      },
      tr: {
        label: 'Frustrated',
        shortDescription:
          'Korelasyon var ama geometrik olarak düzensiz — bazı pair’lar hizalanmaya direniyor.',
        edgeNarratives: [
          'Frustrated family’de bu pair iyi hizalanmış alt kümeye düşüyor.',
          'Geometrik frustration: toplam korelasyon yükselse bile bu pair hizalanmayı reddediyor.',
          'Graph’ın yarısı frustrated kalırken temiz hizalanan başka bir pair.',
          'Frustration burada kendini gösteriyor — pair, genel korelasyona rağmen belirgin biçimde hizasız kalıyor.',
        ],
      },
    },
  },
  {
    id: 'edgeBiased',
    defaultStrength: 0.65,
    strengthOffsets: [0.22, 0.18, -0.25, -0.3],
    mismatchCoeff: [0.05, 0.08, 0.85, -0.9],
    copy: {
      en: {
        label: 'Edge-biased',
        shortDescription:
          'Localized support on a subset of pairs — correlations are not spread uniformly.',
        edgeNarratives: [
          'Edge-biased correlations favour this pair: it receives stronger-than-average support for anti-parallel alignment.',
          'A favoured pair — its normals snap cleanly anti-parallel.',
          'Correlations concentrate elsewhere; this pair is relatively starved and its alignment suffers.',
          'The edge-biased family leaves this pair under-supported — its orientation remains comparatively loose.',
        ],
      },
      tr: {
        label: 'Edge-biased',
        shortDescription:
          'Pair’ların bir alt kümesinde yerelleşmiş destek — korelasyonlar homojen yayılmıyor.',
        edgeNarratives: [
          'Edge-biased korelasyonlar bu pair’ı kayırıyor: anti-parallel alignment için ortalamanın üzerinde destek alıyor.',
          'Kayırılan bir pair — normal’ları temiz biçimde anti-parallel’a kilitleniyor.',
          'Korelasyonlar başka yerde yoğunlaşıyor; bu pair görece aç kalıyor ve alignment’ı zayıflıyor.',
          'Edge-biased family bu pair’ı yeterince beslemiyor — yönelimi göreceli olarak gevşek kalıyor.',
        ],
      },
    },
  },
];

const PRESETS_BY_LOCALE: Record<Locale, readonly StateFamilyPreset[]> = {
  en: RAW_PRESETS.map(
    (r): StateFamilyPreset => ({
      id: r.id,
      label: r.copy.en.label,
      shortDescription: r.copy.en.shortDescription,
      defaultStrength: r.defaultStrength,
      strengthOffsets: r.strengthOffsets,
      mismatchCoeff: r.mismatchCoeff,
      edgeNarratives: r.copy.en.edgeNarratives,
    }),
  ),
  tr: RAW_PRESETS.map(
    (r): StateFamilyPreset => ({
      id: r.id,
      label: r.copy.tr.label,
      shortDescription: r.copy.tr.shortDescription,
      defaultStrength: r.defaultStrength,
      strengthOffsets: r.strengthOffsets,
      mismatchCoeff: r.mismatchCoeff,
      edgeNarratives: r.copy.tr.edgeNarratives,
    }),
  ),
};

const PRESETS_LOOKUP: Record<Locale, Record<StateFamily, StateFamilyPreset>> = {
  en: PRESETS_BY_LOCALE.en.reduce<Record<StateFamily, StateFamilyPreset>>(
    (acc, p) => ({ ...acc, [p.id]: p }),
    {} as Record<StateFamily, StateFamilyPreset>,
  ),
  tr: PRESETS_BY_LOCALE.tr.reduce<Record<StateFamily, StateFamilyPreset>>(
    (acc, p) => ({ ...acc, [p.id]: p }),
    {} as Record<StateFamily, StateFamilyPreset>,
  ),
};

/** Canonical preset list for a locale, preserving declaration order. */
export function getStateFamilies(locale: Locale): readonly StateFamilyPreset[] {
  return PRESETS_BY_LOCALE[locale];
}

/** Preset lookup by id within a locale. */
export function getStateFamily(id: StateFamily, locale: Locale): StateFamilyPreset {
  return PRESETS_LOOKUP[locale][id];
}

export function getDefaultConfig(id: StateFamily): DemoConfig {
  const preset = PRESETS_LOOKUP.en[id];
  return {
    demoMode: true,
    stateFamily: id,
    entanglementStrength: preset.defaultStrength,
    observableMode: 'alignment',
    graphTopology: 'dipole',
  };
}

export const defaultDemoConfig: DemoConfig = getDefaultConfig('bellSymmetric');
