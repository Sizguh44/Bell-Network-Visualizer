import type {
  GraphEdge,
  GraphNode,
  GraphTopology,
  GraphTopologyId,
} from '../types/graph';
import type { Locale } from '../i18n/types';

/* ------------------------------------------------------------------ */
/*  Dipole — 2 nodes, 4 parallel edges                                */
/* ------------------------------------------------------------------ */

const DIPOLE_NODES: readonly GraphNode[] = [
  { id: 'n1', label: 'Node A', position: { x: -1, y: 0 }, intertwiner: 0 },
  { id: 'n2', label: 'Node B', position: { x: 1, y: 0 }, intertwiner: 0 },
];

const DIPOLE_EDGES: readonly GraphEdge[] = [
  { id: 'e1', source: 'n1', target: 'n2', spin: 0.5 },
  { id: 'e2', source: 'n1', target: 'n2', spin: 0.5 },
  { id: 'e3', source: 'n1', target: 'n2', spin: 0.5 },
  { id: 'e4', source: 'n1', target: 'n2', spin: 0.5 },
];

/* ------------------------------------------------------------------ */
/*  Cycle (4) — 4 nodes arranged on a ring, 4 edges                   */
/*                                                                    */
/*     positions are normalised to the unit circle; projection to     */
/*     canvas coords happens inside CycleGraphView.                   */
/* ------------------------------------------------------------------ */

const CYCLE4_NODES: readonly GraphNode[] = [
  { id: 'c1', label: '1', position: { x: 0, y: -1 }, intertwiner: 0 },
  { id: 'c2', label: '2', position: { x: 1, y: 0 }, intertwiner: 0 },
  { id: 'c3', label: '3', position: { x: 0, y: 1 }, intertwiner: 0 },
  { id: 'c4', label: '4', position: { x: -1, y: 0 }, intertwiner: 0 },
];

const CYCLE4_EDGES: readonly GraphEdge[] = [
  { id: 'c12', source: 'c1', target: 'c2', spin: 0.5 },
  { id: 'c23', source: 'c2', target: 'c3', spin: 0.5 },
  { id: 'c34', source: 'c3', target: 'c4', spin: 0.5 },
  { id: 'c41', source: 'c4', target: 'c1', spin: 0.5 },
];

/* ------------------------------------------------------------------ */
/*  Localised copy                                                     */
/* ------------------------------------------------------------------ */

interface LocalisedTopologyCopy {
  label: string;
  shortDescription: string;
  symmetryNote: string;
}

interface LocalisedTopologyRecord {
  id: GraphTopologyId;
  nodes: readonly GraphNode[];
  edges: readonly GraphEdge[];
  copy: Record<Locale, LocalisedTopologyCopy>;
}

const RAW: readonly LocalisedTopologyRecord[] = [
  {
    id: 'dipole',
    nodes: DIPOLE_NODES,
    edges: DIPOLE_EDGES,
    copy: {
      en: {
        label: 'Dipole Graph',
        shortDescription:
          'Two nodes with four parallel edges — a minimal truncation for local pairwise geometric intuition.',
        symmetryNote:
          'Automorphisms: swap Node A ↔ Node B, and independently permute the four edges. Group: S₂ × S₄.',
      },
      tr: {
        label: 'Dipole Graph',
        shortDescription:
          'Dört paralel kenarlı iki düğüm — yerel pair bazlı geometrik sezgi için minimal bir truncation.',
        symmetryNote:
          'Automorphism’lar: Node A ↔ Node B değişimi ve dört kenarın birbirleri arasında permütasyonu. Grup: S₂ × S₄.',
      },
    },
  },
  {
    id: 'cycle4',
    nodes: CYCLE4_NODES,
    edges: CYCLE4_EDGES,
    copy: {
      en: {
        label: 'Cycle Graph (4)',
        shortDescription:
          'Four nodes on a ring — a larger toy graph where the same family spreads correlations spatially instead of between one polyhedron pair.',
        symmetryNote:
          'Automorphisms: dihedral group D₄ — four rotations and four reflections. Every node is equivalent; every edge is equivalent.',
      },
      tr: {
        label: 'Cycle Graph (4)',
        shortDescription:
          'Ring üzerinde dört düğüm — aynı family’nin korelasyonları tek polyhedron çifti yerine uzamsal olarak dağıttığı, daha büyük bir toy graph.',
        symmetryNote:
          'Automorphism’lar: dihedral grup D₄ — dört rotasyon ve dört yansıma. Her düğüm eşdeğer; her kenar eşdeğer.',
      },
    },
  },
];

function project(record: LocalisedTopologyRecord, locale: Locale): GraphTopology {
  const copy = record.copy[locale];
  return {
    id: record.id,
    label: copy.label,
    shortDescription: copy.shortDescription,
    symmetryNote: copy.symmetryNote,
    nodes: record.nodes,
    edges: record.edges,
    pairCount: record.edges.length,
  };
}

const BY_LOCALE: Record<Locale, readonly GraphTopology[]> = {
  en: RAW.map((r) => project(r, 'en')),
  tr: RAW.map((r) => project(r, 'tr')),
};

const LOOKUP: Record<Locale, Record<GraphTopologyId, GraphTopology>> = {
  en: BY_LOCALE.en.reduce<Record<GraphTopologyId, GraphTopology>>(
    (acc, t) => ({ ...acc, [t.id]: t }),
    {} as Record<GraphTopologyId, GraphTopology>,
  ),
  tr: BY_LOCALE.tr.reduce<Record<GraphTopologyId, GraphTopology>>(
    (acc, t) => ({ ...acc, [t.id]: t }),
    {} as Record<GraphTopologyId, GraphTopology>,
  ),
};

export function getTopologies(locale: Locale): readonly GraphTopology[] {
  return BY_LOCALE[locale];
}

export function getTopology(id: GraphTopologyId, locale: Locale): GraphTopology {
  return LOOKUP[locale][id];
}

export const DEFAULT_TOPOLOGY_ID: GraphTopologyId = 'dipole';
