import type { Challenge } from '../../types/challenge';

/**
 * English challenge content. See `src/data/challenges.ts` for the locale-aware
 * dispatcher (`getChallenge`, `initialChallengeStates`, `FIRST_CHALLENGE_ID`).
 */
export const CHALLENGES_EN: readonly Challenge[] = [
  {
    id: 'most-misaligned',
    order: 1,
    title: 'Which pair is the most misaligned?',
    shortGoal: 'Spot the worst offender under the Mismatch lens.',
    difficulty: 'intro',
    type: 'diagnosis',
    prompt:
      'Under the Mismatch lens, one of the four pairs carries a dramatically larger angular gap than the others. Before clicking any pair, look at the canvas alone: which number is the worst offender?',
    setupConfig: {
      stateFamily: 'edgeBiased',
      entanglementStrength: 0.65,
      observableMode: 'mismatch',
      demoMode: true,
    },
    setupSelection: null,
    expectedObservation:
      'The left-half pairs should look crisp and bright; the right-half pairs should look scattered and dim.',
    answerOptions: [
      {
        id: 'a',
        text: 'Pair 1',
        correct: false,
        feedback: 'Pair 1 is one of the favoured pairs in the Edge-biased family. Its arrows lock cleanly.',
      },
      {
        id: 'b',
        text: 'Pair 2',
        correct: false,
        feedback: 'Pair 2 also participates in the aligned subset here.',
      },
      {
        id: 'c',
        text: 'Pair 3',
        correct: false,
        feedback: 'Close — pair 3 is misaligned, but pair 4 has a slightly larger coefficient and a deeper negative strength offset.',
      },
      {
        id: 'd',
        text: 'Pair 4',
        correct: true,
        feedback: 'Correct. Edge-biased combines the largest mismatch coefficient with the most negative strength offset at pair 4.',
      },
    ],
    explanation:
      'Edge-biased concentrates correlation on the first two pairs. Pair 4 receives both the largest |mismatchCoeff| (0.9) and a noticeable negative strength offset (−0.3), so its local mismatch angle is the widest of the four.',
    relatedConceptIds: ['state-family', 'face-pair', 'alignment', 'observable-lens'],
    relatedLessonIds: ['local-pair-inspection', 'state-families'],
    nextChallengeId: 'strength-vs-family',
  },

  {
    id: 'strength-vs-family',
    order: 2,
    title: 'Same strength, different family',
    shortGoal: 'Predict how the Gluing score moves when only the family changes.',
    difficulty: 'intro',
    type: 'prediction',
    prompt:
      'You are viewing Bell-like symmetric at strength 0.7 under the Gluing lens. Before you switch the family pill to Frustrated — keeping the strength at 0.7 — predict what happens to the Gluing score.',
    setupConfig: {
      stateFamily: 'bellSymmetric',
      entanglementStrength: 0.7,
      observableMode: 'gluing',
      demoMode: true,
    },
    setupSelection: null,
    expectedObservation:
      'After switching to Frustrated, the Summary headline should clearly drop and the status should slide toward "fragile".',
    answerOptions: [
      {
        id: 'a',
        text: 'It goes up.',
        correct: false,
        feedback: 'Frustrated is a less uniform pattern — the cohesion penalty pulls the score down, not up.',
      },
      {
        id: 'b',
        text: 'It stays roughly the same — the strength is identical.',
        correct: false,
        feedback: 'Strength alone does not fix the gluing score. The distribution of correlations matters too.',
      },
      {
        id: 'c',
        text: 'It drops noticeably.',
        correct: true,
        feedback: 'Correct. Bell-like symmetric keeps cohesion near 1; Frustrated splits into clean + off pairs, which drops cohesion and the gluing score.',
      },
    ],
    explanation:
      'The toy gluing score multiplies mean alignment by a cohesion term and by mean strength. Strength alone is unchanged here, but cohesion drops sharply when two of the four pairs refuse to align — which is exactly the Frustrated signature.',
    relatedConceptIds: ['state-family', 'gluing', 'cohesion', 'entanglement'],
    relatedLessonIds: ['state-families'],
    prevChallengeId: 'most-misaligned',
    nextChallengeId: 'lens-not-state',
  },

  {
    id: 'lens-not-state',
    order: 3,
    title: 'Change the lens, not the state',
    shortGoal: 'Confirm that observable lenses do not rotate the arrows.',
    difficulty: 'intro',
    type: 'conceptual',
    prompt:
      'You are at Bell-like symmetric, strength 0.9, Alignment lens. Switch the observable dropdown to Mismatch, then to Uniformity, then back. Are the arrows on the canvas actually moving?',
    setupConfig: {
      stateFamily: 'bellSymmetric',
      entanglementStrength: 0.9,
      observableMode: 'alignment',
      demoMode: true,
    },
    setupSelection: null,
    expectedObservation:
      'The arrows and their angles should be pinned. Only the per-pair emphasis (opacity, stroke width) and the Summary card change.',
    answerOptions: [
      {
        id: 'a',
        text: 'Yes — the arrows rotate when the lens changes.',
        correct: false,
        feedback: 'The canvas geometry is a function of family + strength only. The lens does not touch the angles.',
      },
      {
        id: 'b',
        text: 'No — they stay pinned; only the emphasis and the summary change.',
        correct: true,
        feedback: 'Correct. The observable lens is a *reading*, not a transformation of the state.',
      },
      {
        id: 'c',
        text: 'Only the selected pair rotates.',
        correct: false,
        feedback: 'Selection has no effect on the geometry either; it just highlights which pair the detail card pins to.',
      },
    ],
    explanation:
      'The canvas angles are derived once from the family and strength. The observable lens only re-weights which per-pair value drives the visual emphasis and re-reads the Summary headline. It is the toy analogue of measuring a different operator on the same quantum state.',
    relatedConceptIds: ['observable-lens', 'state-family', 'alignment'],
    relatedLessonIds: ['observable-lenses'],
    prevChallengeId: 'strength-vs-family',
    nextChallengeId: 'alignment-vs-regge',
  },

  {
    id: 'alignment-vs-regge',
    order: 4,
    title: 'Does high alignment imply Regge matching?',
    shortGoal: 'Separate anti-parallel alignment from full shape matching.',
    difficulty: 'core',
    type: 'conceptual',
    prompt:
      'At Bell-like symmetric, strength 1.0, Alignment lens, the headline sits near 1.000. A colleague leans over and says "this proves the two polyhedra are Regge-glued." Are they right?',
    setupConfig: {
      stateFamily: 'bellSymmetric',
      entanglementStrength: 1.0,
      observableMode: 'alignment',
      demoMode: true,
    },
    setupSelection: null,
    answerOptions: [
      {
        id: 'a',
        text: 'Yes — high alignment is sufficient for Regge gluing.',
        correct: false,
        feedback: 'Alignment is necessary, not sufficient. Matching areas and dihedral angles are required too.',
      },
      {
        id: 'b',
        text: 'No — alignment is necessary, but Regge gluing also demands matching areas and dihedral angles.',
        correct: true,
        feedback: 'Correct. The toy tracks only one direction-of-face constraint. Full shape matching lives in additional conditions this demo never checks.',
      },
      {
        id: 'c',
        text: 'Yes, but only for the dipole graph.',
        correct: false,
        feedback: 'The dipole graph is no exception: Regge gluing still requires more than anti-parallel normals.',
      },
    ],
    explanation:
      'Anti-parallel face normals across a shared surface is *one* condition for a consistent piecewise-flat gluing. Classical Regge calculus additionally requires that matched faces share areas and that dihedral angles agree along shared edges. This demo captures only the first condition. Treating a maxed-out alignment score as proof of Regge gluing is a common but real category error.',
    relatedConceptIds: ['alignment', 'regge-geometry', 'gluing', 'vector-geometry'],
    relatedLessonIds: ['alignment-vs-shape', 'why-it-matters'],
    prevChallengeId: 'lens-not-state',
    nextChallengeId: 'edge-bias-lens',
  },

  {
    id: 'edge-bias-lens',
    order: 5,
    title: 'Which observable best exposes edge bias?',
    shortGoal: 'Pick the lens that makes per-pair asymmetry loudest.',
    difficulty: 'core',
    type: 'comparison',
    prompt:
      'You are in the Edge-biased family. Try each observable lens in the sidebar dropdown. Which one most directly exposes the asymmetry — that two pairs are favoured and two are starved?',
    setupConfig: {
      stateFamily: 'edgeBiased',
      entanglementStrength: 0.65,
      observableMode: 'alignment',
      demoMode: true,
    },
    setupSelection: null,
    answerOptions: [
      {
        id: 'a',
        text: 'Alignment — the score is decent, but nothing screams asymmetry.',
        correct: false,
        feedback: 'Mean alignment hides the split between the clean and the starved pairs.',
      },
      {
        id: 'b',
        text: 'Mismatch — the wide angles on pairs 3 and 4 show.',
        correct: false,
        feedback: 'Mismatch makes the gap visible, but it mixes strength and pattern into one number.',
      },
      {
        id: 'c',
        text: 'Gluing — the status drops to "fragile".',
        correct: false,
        feedback: 'Gluing summarises the whole graph. It does not isolate per-pair deviation.',
      },
      {
        id: 'd',
        text: 'Uniformity — the emphasis is literally deviation from the family mean.',
        correct: true,
        feedback: 'Correct. Uniformity uses |alignment − meanAlignment| as per-pair emphasis, which is exactly the "outlier" signal the Edge-biased family carries.',
      },
      {
        id: 'e',
        text: 'Correlation — its pair-range secondary shows the spread.',
        correct: false,
        feedback: 'Defensible — Correlation does report the pair range. But its per-pair emphasis follows localStrength, which does not isolate the deviation the way Uniformity does.',
      },
    ],
    explanation:
      'Every observable lens has a specific per-pair emphasis driver. Uniformity\'s driver is the absolute deviation of each pair\'s alignment from the family mean, so it lights up exactly the pairs that are "different from the others". For Edge-biased, that is the whole point of the family.',
    relatedConceptIds: ['observable-lens', 'state-family', 'cohesion', 'automorphism'],
    relatedLessonIds: ['state-families', 'observable-lenses'],
    prevChallengeId: 'alignment-vs-regge',
    nextChallengeId: 'frustration-vs-weakness',
  },

  {
    id: 'frustration-vs-weakness',
    order: 6,
    title: 'Frustration vs weakness',
    shortGoal: 'Tell apart two different reasons for a low gluing score.',
    difficulty: 'core',
    type: 'diagnosis',
    prompt:
      'The Gluing lens reads "fragile" and the headline is modest — yet the entanglement strength is 0.7, not tiny. Is the state weakly correlated overall, or is correlation unevenly distributed across pairs?',
    setupConfig: {
      stateFamily: 'frustrated',
      entanglementStrength: 0.7,
      observableMode: 'gluing',
      demoMode: true,
    },
    setupSelection: null,
    answerOptions: [
      {
        id: 'a',
        text: 'Weakly correlated — all four pairs are mildly involved.',
        correct: false,
        feedback: 'If every pair behaved similarly at 0.7, you would see four comparably lit pairs. You do not.',
      },
      {
        id: 'b',
        text: 'Unevenly distributed — nominal strength is fine, but a subset of pairs resists alignment.',
        correct: true,
        feedback: 'Correct. Two pairs are clean, two are off-axis. The problem is pattern, not size.',
      },
      {
        id: 'c',
        text: 'Both, to roughly equal degrees.',
        correct: false,
        feedback: 'At 0.7 global strength, "weak" is not a great diagnosis. The real signal is the per-pair disagreement.',
      },
    ],
    explanation:
      'Frustrated at strength 0.7 keeps two pairs tightly aligned (small mismatch coefficients) and leaves two pairs noticeably off-axis (large mismatch coefficients). The Gluing lens\'s cohesion penalty therefore drags the headline down, even though the strength knob is well above weak-correlation territory. The fix would be to change the family, not to push the strength.',
    relatedConceptIds: ['state-family', 'gluing', 'cohesion', 'entanglement'],
    relatedLessonIds: ['state-families', 'local-pair-inspection'],
    prevChallengeId: 'edge-bias-lens',
    nextChallengeId: 'global-vs-local',
  },

  {
    id: 'global-vs-local',
    order: 7,
    title: 'Global score, local problem',
    shortGoal: 'Use per-pair inspection to find the source of a fragile global reading.',
    difficulty: 'advanced',
    type: 'diagnosis',
    prompt:
      'The Gluing lens reads "fragile" at strength 0.7. Open the Face Pair Detail card and step through each pair. What is the structure of the failure?',
    setupConfig: {
      stateFamily: 'frustrated',
      entanglementStrength: 0.7,
      observableMode: 'gluing',
      demoMode: true,
    },
    setupSelection: 'e2',
    expectedObservation:
      'Pair 2 and pair 4 should show large mismatch angles and low alignment scores; pair 1 and pair 3 should look crisp.',
    answerOptions: [
      {
        id: 'a',
        text: 'One pair fails; the other three are clean.',
        correct: false,
        feedback: 'Close, but the failure is broader than a single pair.',
      },
      {
        id: 'b',
        text: 'Two pairs fail; the other two are clean.',
        correct: true,
        feedback: 'Correct. The Frustrated family splits into an aligned and a misaligned subset of two pairs each.',
      },
      {
        id: 'c',
        text: 'All four pairs fail to similar degrees.',
        correct: false,
        feedback: 'If every pair failed similarly, the cohesion term would stay high — that is not what you see here.',
      },
    ],
    explanation:
      'Frustrated\'s mismatchCoeff is roughly [0.08, 0.95, 0.12, 0.9]. Pairs 1 and 3 inherit tiny noise and lock cleanly; pairs 2 and 4 inherit large noise and keep wide mismatch angles even at full nominal strength. The global gluing score averages all four, so it lands in "fragile" — not because all fail, but because *half* fail. Per-pair inspection is how you tell those two failure shapes apart.',
    relatedConceptIds: ['face-pair', 'gluing', 'observable-lens', 'cohesion'],
    relatedLessonIds: ['local-pair-inspection', 'state-families'],
    prevChallengeId: 'frustration-vs-weakness',
    nextChallengeId: 'bell-vs-strong',
  },

  {
    id: 'bell-vs-strong',
    order: 8,
    title: 'Bell-like is not just high strength',
    shortGoal: 'Separate "strongly correlated" from "Bell-like".',
    difficulty: 'advanced',
    type: 'conceptual',
    prompt:
      'Crank the Frustrated family up to strength 0.9. Overall correlation is high by any reasonable measure. Does that make the state behave like Bell-like symmetric at 0.9?',
    setupConfig: {
      stateFamily: 'frustrated',
      entanglementStrength: 0.9,
      observableMode: 'gluing',
      demoMode: true,
    },
    setupSelection: null,
    answerOptions: [
      {
        id: 'a',
        text: 'Yes — at high strength, all families converge to Bell-like behaviour.',
        correct: false,
        feedback: 'Strength does not erase a family\'s built-in asymmetry. Frustrated keeps its split even at 0.9.',
      },
      {
        id: 'b',
        text: 'No — Bell-like describes a *pattern* of correlations, not their size.',
        correct: true,
        feedback: 'Correct. Structural asymmetry in the family survives any reasonable strength setting.',
      },
      {
        id: 'c',
        text: 'They look identical on the canvas but differ numerically.',
        correct: false,
        feedback: 'The canvas itself shows the difference — two pairs stay off-axis even at 0.9.',
      },
    ],
    explanation:
      '"Bell-like" is a label about *how* correlations are distributed across pairs, not *how strong* they are. The Frustrated family\'s mismatch coefficients build in a permanent asymmetry — two aligned pairs, two off-axis pairs — that survives any global strength setting. Bell-like symmetric, by contrast, applies its correlations uniformly by design. High strength alone cannot convert one into the other.',
    relatedConceptIds: ['bell-network', 'state-family', 'entanglement', 'gluing'],
    relatedLessonIds: ['state-families', 'why-it-matters'],
    prevChallengeId: 'global-vs-local',
    nextChallengeId: 'topology-detects-bias',
  },

  {
    id: 'topology-detects-bias',
    order: 9,
    title: 'Which topology makes edge bias easier to detect?',
    shortGoal: 'Compare how Edge-biased reads on the dipole vs on the cycle.',
    difficulty: 'core',
    type: 'comparison',
    prompt:
      'You are on the Edge-biased family at strength 0.65 under the Uniformity lens. Try both topologies — Dipole and Cycle Graph (4) — from the sidebar. Which topology makes the asymmetry most visually obvious on the canvas?',
    setupConfig: {
      graphTopology: 'dipole',
      stateFamily: 'edgeBiased',
      entanglementStrength: 0.65,
      observableMode: 'uniformity',
      demoMode: true,
    },
    setupSelection: null,
    expectedObservation:
      'On the dipole, the favoured and starved pairs overlap as four fanned curves between two nodes. On Cycle (4), the favoured edges form a local region of the ring while the starved ones form another region — spatially separate.',
    answerOptions: [
      {
        id: 'a',
        text: 'Dipole — all four pairs are packed between the same two nodes, so the asymmetry is concentrated.',
        correct: false,
        feedback: 'Concentrated, yes — and therefore hard to read spatially, since the favoured and starved curves overlap in the canvas.',
      },
      {
        id: 'b',
        text: 'Cycle Graph (4) — the ring spreads favoured and starved edges into distinct neighbourhoods.',
        correct: true,
        feedback: 'Correct. Spatial separation makes the edge bias a recognisable region of the ring instead of overlapping curves.',
      },
      {
        id: 'c',
        text: 'Neither — bias is a family property and looks the same regardless of graph.',
        correct: false,
        feedback: 'The numbers are identical; the *visual readability* is not. Topology controls spatial layout, and layout changes what the eye picks up.',
      },
    ],
    explanation:
      'Per-pair numbers come from the family: strengthOffsets + mismatchCoeff under the current strength. On the dipole, all four face pairs live between the same two polyhedra, so "edge-biased" collapses into overlapping fanned curves. On Cycle Graph (4), those same four edges distribute around a ring, and the favoured region vs starved region becomes a spatial feature you can point at. The mathematics is topology-blind; the readability is not.',
    relatedConceptIds: ['state-family', 'graph-topology', 'observable-lens', 'edge-pattern'],
    relatedLessonIds: ['state-families', 'topology-upgrade'],
    prevChallengeId: 'bell-vs-strong',
    nextChallengeId: 'family-topology-crosstalk',
  },

  {
    id: 'family-topology-crosstalk',
    order: 10,
    title: 'Same family, different topology',
    shortGoal: 'Predict how the Gluing score moves when only the graph changes.',
    difficulty: 'core',
    type: 'prediction',
    prompt:
      'You have Frustrated at strength 0.7 under the Gluing lens. Before switching the graph topology from Dipole to Cycle (4) in the sidebar, predict: what happens to the headline Gluing score?',
    setupConfig: {
      graphTopology: 'dipole',
      stateFamily: 'frustrated',
      entanglementStrength: 0.7,
      observableMode: 'gluing',
      demoMode: true,
    },
    setupSelection: null,
    expectedObservation:
      'The headline number should stay effectively identical to the first decimal; only the canvas geometry changes.',
    answerOptions: [
      {
        id: 'a',
        text: 'It rises noticeably.',
        correct: false,
        feedback: 'Per-pair metrics are unchanged — the family, strength and lens all stayed put.',
      },
      {
        id: 'b',
        text: 'It stays the same to the first decimal.',
        correct: true,
        feedback: 'Correct. The four per-pair snapshots come from family + strength; topology only rearranges where they sit on the canvas.',
      },
      {
        id: 'c',
        text: 'It drops noticeably.',
        correct: false,
        feedback: 'Same reasoning — nothing in the per-pair computation depends on topology.',
      },
    ],
    explanation:
      'The toy gluing score aggregates the four per-pair snapshots, which are pure functions of family and strength. Topology does not enter those formulas; it controls where each pair sits in the canvas and which graph automorphisms it can respect. Expect the global number to freeze while the spatial picture flips. This is the cleanest handle on the "topology is layout, not computation" lesson.',
    relatedConceptIds: ['gluing', 'state-family', 'graph-topology', 'cohesion'],
    relatedLessonIds: ['topology-upgrade', 'state-families'],
    prevChallengeId: 'topology-detects-bias',
  },
];
