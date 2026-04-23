import type { Lesson } from '../../types/learning';

/**
 * English lesson content. See `src/data/lessons.ts` for the locale-aware
 * dispatcher (`getLesson`, `initialLessonStates`, `FIRST_LESSON_ID`).
 */
export const LESSONS_EN: readonly Lesson[] = [
  {
    id: 'intro-dipole',
    order: 1,
    title: 'What is the dipole graph?',
    shortGoal: 'Meet the two-node, four-link object that anchors this demo.',
    conceptTags: ['dipole-graph', 'face-pair', 'vector-geometry'],
    narrative: [
      "The [[dipole-graph|dipole graph]] is the minimal non-trivial [[spin-network|spin network]]: two nodes connected by four parallel edges. Each node stands for a quantum polyhedron; each edge stands for a shared face between the two polyhedra.",
      "In the canvas above, these four [[face-pair|face pairs]] appear as curves between two circular nodes. Every curve carries two small arrows — one from each node — representing the face normal on each side of the shared surface.",
      "This is the smallest setting where we can meaningfully talk about two polyhedra being 'glued' along their faces. Even here, a surprising amount of structure appears.",
    ],
    callouts: [
      {
        kind: 'key',
        body: 'A face pair is one shared face between the two polyhedra. The dipole has four such faces, hence four edges.',
      },
    ],
    actionPrompt:
      'Look at the canvas. Locate the four pairs — each one has its own colour, and each pair is two arrows plus the curve that joins them. Leave the default settings for now.',
    recommendedConfig: {
      stateFamily: 'bellSymmetric',
      entanglementStrength: 0.75,
      observableMode: 'alignment',
      demoMode: true,
    },
    recommendedSelection: null,
    checkpointQuestion: 'How many face pairs does the dipole graph contain?',
    checkpointOptions: [
      {
        id: 'a',
        text: 'Two',
        correct: false,
        feedback: 'That would be the number of nodes, not the number of shared faces.',
      },
      {
        id: 'b',
        text: 'Four',
        correct: true,
        feedback: 'Correct. Four parallel edges — one per shared face.',
      },
      {
        id: 'c',
        text: 'Six',
        correct: false,
        feedback: 'Too many. The dipole is defined by exactly four parallel links between two nodes.',
      },
    ],
    checkpointExplanation:
      'The dipole graph has two nodes and four parallel edges. Each edge represents a shared face between the two polyhedra, pairing the normals on either side.',
    nextLessonId: 'strength-response',
  },

  {
    id: 'strength-response',
    order: 2,
    title: 'What changes when correlation strength increases?',
    shortGoal: 'Build intuition for the strength slider as a coherence knob.',
    conceptTags: ['entanglement', 'alignment', 'face-pair'],
    narrative: [
      "A [[spin-network|spin-network basis state]] does not by itself [[entanglement|entangle]] neighbouring polyhedra — their face normals fluctuate independently. The entanglement-strength slider s ∈ [0, 1] is a toy knob that scales how coherently the normals on opposite sides of a shared face are correlated.",
      "At low strength, each right-hand arrow drifts away from its ideal [[alignment|anti-parallel]] partner. At high strength, the arrows lock close to back-to-back — the visual proxy for a 'glued' geometry.",
      "Move the slider from near 0 to near 1 and watch the four pairs converge. In the Bell-like symmetric family, all four participate equally.",
    ],
    callouts: [
      {
        kind: 'in-demo',
        body: 'In this demo, strength is a single scalar. In full theory, correlations live in the intertwiner-space structure of the state and are not captured by one number.',
      },
    ],
    actionPrompt:
      'Move the entanglement strength slider between 0.1 and 0.9 slowly. Notice how the arrows scatter at low values and lock into anti-parallel pairs at high values.',
    recommendedConfig: {
      stateFamily: 'bellSymmetric',
      entanglementStrength: 0.9,
      observableMode: 'alignment',
      demoMode: true,
    },
    recommendedSelection: null,
    checkpointQuestion:
      'In the Bell-like symmetric family at strength 0.9, the four pairs of normals mostly:',
    checkpointOptions: [
      {
        id: 'a',
        text: 'Point in random, unrelated directions',
        correct: false,
        feedback: 'That is the uncorrelated or low-strength regime, not Bell-like symmetric at 0.9.',
      },
      {
        id: 'b',
        text: 'Lock into nearly anti-parallel orientations',
        correct: true,
        feedback: 'Correct. Anti-parallel across the shared face is the visual proxy for glued geometry.',
      },
      {
        id: 'c',
        text: 'Point in the same direction on each side',
        correct: false,
        feedback: 'Same-direction would mean faces pointing the same way — not how gluing works.',
      },
    ],
    checkpointExplanation:
      'High strength in the Bell-like symmetric family drives every right-hand arrow close to 180° from its left-hand partner. The visible result is four clean anti-parallel pairs.',
    prevLessonId: 'intro-dipole',
    nextLessonId: 'local-pair-inspection',
  },

  {
    id: 'local-pair-inspection',
    order: 3,
    title: 'Local pair inspection',
    shortGoal: 'See how per-pair behaviour can disagree with the global average.',
    conceptTags: ['face-pair', 'alignment', 'observable-lens'],
    narrative: [
      "Global averages hide per-pair differences. Each [[face-pair|face pair]] has its own local strength, its own mismatch angle (degrees between its right arrow and the ideal anti-parallel partner), and its own [[alignment|alignment score]].",
      "Hover a pair to preview it; click to pin a selection. The Face Pair Detail card below the stats then shows the four local metrics, and — in certain families — they disagree with each other substantially.",
      "In the Frustrated family, for instance, two pairs align cleanly and two stay stubbornly off-axis, even at moderate overall strength. Pair 2 is a good one to inspect.",
    ],
    callouts: [
      {
        kind: 'key',
        body: 'Local is not the same as global. A reasonable average can hide meaningful per-pair disagreement — which is exactly why we can inspect individual pairs.',
      },
    ],
    actionPrompt:
      'Click the second curve in the canvas (pair 2). The Face Pair Detail card will pin to it. Read the mismatch angle — it will be noticeably higher than the global mean.',
    recommendedConfig: {
      stateFamily: 'frustrated',
      entanglementStrength: 0.7,
      observableMode: 'mismatch',
      demoMode: true,
    },
    recommendedSelection: 'e2',
    checkpointQuestion:
      'In the Frustrated family at strength 0.7, pair 2 specifically shows:',
    checkpointOptions: [
      {
        id: 'a',
        text: 'A small mismatch angle, close to 0°',
        correct: false,
        feedback: 'That describes the aligned subset of pairs. Pair 2 is in the frustrated subset.',
      },
      {
        id: 'b',
        text: 'A visibly large mismatch angle',
        correct: true,
        feedback: 'Correct. The frustrated family alternates — some pairs align, others keep a wide gap.',
      },
      {
        id: 'c',
        text: 'Zero local strength',
        correct: false,
        feedback: 'Local strength stays close to the global value; the distinction is in mismatch, not strength.',
      },
    ],
    checkpointExplanation:
      'In the toy Frustrated family, the mismatch coefficient for pair 2 is deliberately large. So even when the global strength is high, pair 2 keeps a wide mismatch angle — a geometric tension.',
    prevLessonId: 'strength-response',
    nextLessonId: 'state-families',
  },

  {
    id: 'state-families',
    order: 4,
    title: 'State families: same strength, different patterns',
    shortGoal: 'See that how correlations are distributed can matter as much as how strong they are.',
    conceptTags: ['state-family', 'gluing', 'entanglement'],
    narrative: [
      "The strength slider answers how much correlation there is. The [[state-family|state family]] answers how that correlation is distributed across the four pairs. These are independent knobs.",
      "At a fixed strength, switching families produces distinct pictures: Bell-like symmetric glues all four pairs evenly, Frustrated leaves two pairs stubbornly off, Edge-biased favours a specific subset.",
      "The [[gluing|Gluing]] score in the Observable Summary card captures this distinction. It multiplies mean alignment by a [[cohesion|cohesion]] term that penalises uneven behaviour — so families with the same average but different patterns end up with different gluing scores.",
    ],
    callouts: [
      {
        kind: 'confusion',
        body: "Common confusion: 'more entanglement = more gluing'. Not quite — only well-distributed entanglement produces a clean glued picture. Uneven entanglement can actively hurt it.",
      },
    ],
    actionPrompt:
      'Leave the strength at 0.7. Switch between Bell-like symmetric and Frustrated using the sidebar pills. Watch the Gluing lens status flip from "strong" to "fragile".',
    recommendedConfig: {
      stateFamily: 'frustrated',
      entanglementStrength: 0.7,
      observableMode: 'gluing',
      demoMode: true,
    },
    recommendedSelection: null,
    checkpointQuestion:
      'Comparing Bell-like symmetric and Frustrated at the same strength 0.7 under the Gluing lens:',
    checkpointOptions: [
      {
        id: 'a',
        text: 'They produce the same gluing score',
        correct: false,
        feedback: 'They have different per-pair patterns, so the cohesion term pulls the gluing score apart.',
      },
      {
        id: 'b',
        text: 'Frustrated scores higher than Bell-like symmetric',
        correct: false,
        feedback: 'Frustrated has internal disagreement, which lowers cohesion, which lowers gluing.',
      },
      {
        id: 'c',
        text: 'Bell-like symmetric scores higher than Frustrated',
        correct: true,
        feedback: 'Correct. Uniform correlations beat uneven ones for gluing — pattern matters.',
      },
    ],
    checkpointExplanation:
      'At the same global strength, Bell-like symmetric keeps all four pairs tightly aligned, while Frustrated splits into an aligned and a misaligned subset. The cohesion penalty in the toy gluing score reflects that.',
    prevLessonId: 'local-pair-inspection',
    nextLessonId: 'observable-lenses',
  },

  {
    id: 'observable-lenses',
    order: 5,
    title: 'Observable lenses: same state, different reads',
    shortGoal: 'Notice that the observable lens is interpretation, not geometry.',
    conceptTags: ['observable-lens', 'alignment', 'gluing'],
    narrative: [
      "Each of the five [[observable-lens|observable lenses]] asks a different question of the same toy state. Alignment asks how anti-parallel things are on average. Mismatch asks how far off they are in degrees. Gluing asks how uniformly glued the whole dipole looks. Correlation asks how much shared structure each pair carries. Uniformity asks how similarly the pairs behave.",
      "Crucially, switching lenses does not move the arrows on the canvas. It re-weights which pairs the UI emphasises and re-reads the headline number. The underlying state is unchanged.",
      "This separation mirrors how an observable works in quantum theory: the same state can have very different expectation values depending on which operator you choose to measure.",
    ],
    callouts: [
      {
        kind: 'in-theory',
        body: 'In full theory, each observable corresponds to a different operator acting on the Hilbert space of the state. Here we just swap what the UI reports.',
      },
    ],
    actionPrompt:
      'Cycle through all five observables using the sidebar dropdown. Watch the headline change while the arrows stay put.',
    recommendedConfig: {
      stateFamily: 'edgeBiased',
      entanglementStrength: 0.65,
      observableMode: 'alignment',
      demoMode: true,
    },
    recommendedSelection: null,
    checkpointQuestion: 'Switching the observable lens:',
    checkpointOptions: [
      {
        id: 'a',
        text: 'Rotates the arrows on the canvas',
        correct: false,
        feedback: 'The arrows are pinned by the family and strength, not by the lens.',
      },
      {
        id: 'b',
        text: 'Changes only which aspect of the state the UI emphasises',
        correct: true,
        feedback: 'Correct. The observable lens is interpretation, not geometry.',
      },
      {
        id: 'c',
        text: 'Switches to a new random state',
        correct: false,
        feedback: 'Nothing in this toy is random — all outputs are deterministic functions of family, strength and lens.',
      },
    ],
    checkpointExplanation:
      'The observable lens acts on what the UI reports — the headline value, the status, the per-pair emphasis — but it does not change the family, strength, or geometry. Same state, different read.',
    prevLessonId: 'state-families',
    nextLessonId: 'alignment-vs-shape',
  },

  {
    id: 'alignment-vs-shape',
    order: 6,
    title: 'Alignment is not yet full shape matching',
    shortGoal: 'See honestly where this toy stops and real Regge geometry begins.',
    conceptTags: ['alignment', 'regge-geometry', 'gluing'],
    narrative: [
      "[[alignment|Anti-parallel]] face normals across the shared surface is one condition for [[gluing|gluing]] two polyhedra — but it is not the whole story. Classical [[regge-geometry|Regge geometry]] also requires the faces to match in shape: equal areas, matching dihedral angles, consistent triangulation.",
      "This toy tracks only the angular relation between the face normals. Even in the cleanest Bell-like symmetric regime at strength 1.0, the alignment score saturates near 1.0, but that is not a certificate of full Regge gluing.",
      "Think of this demo as training wheels: it builds the directional intuition first, leaving the shape-matching conditions as later work.",
    ],
    callouts: [
      {
        kind: 'in-theory',
        body: 'Full shape matching in Regge calculus also requires matching areas and dihedral angles between the faces being glued. Our toy handles the normals only.',
      },
      {
        kind: 'key',
        body: 'High alignment here is a necessary condition for gluing, not a sufficient one.',
      },
    ],
    actionPrompt:
      'Set Bell-like symmetric, strength 1.0, Alignment lens. Note that the headline hits close to 1.000 — but reflect on what the toy does not check.',
    recommendedConfig: {
      stateFamily: 'bellSymmetric',
      entanglementStrength: 1.0,
      observableMode: 'alignment',
      demoMode: true,
    },
    recommendedSelection: null,
    checkpointQuestion: 'Anti-parallel alignment of the face normals is:',
    checkpointOptions: [
      {
        id: 'a',
        text: 'Sufficient on its own for full Regge gluing',
        correct: false,
        feedback: 'Regge gluing also requires matching areas and dihedral angles — alignment is only part of the picture.',
      },
      {
        id: 'b',
        text: 'One necessary condition among several',
        correct: true,
        feedback: 'Correct. Alignment is necessary but not sufficient for full gluing.',
      },
      {
        id: 'c',
        text: 'Unrelated to geometric gluing',
        correct: false,
        feedback: 'It is certainly related — just not the whole story.',
      },
    ],
    checkpointExplanation:
      'This toy captures one direction-of-face constraint. A physically complete gluing story would also demand that matching faces share areas and that dihedral angles are consistent — Regge-style shape matching, which this demo does not implement.',
    prevLessonId: 'observable-lenses',
    nextLessonId: 'why-it-matters',
  },

  {
    id: 'why-it-matters',
    order: 7,
    title: 'Why local geometric correlation matters',
    shortGoal: 'Place this demo inside the larger question of emergent geometry.',
    conceptTags: ['gluing', 'regge-geometry', 'state-family'],
    narrative: [
      "A recurring theme in quantum gravity is that classical geometry should emerge from correlations in a more fundamental quantum substrate. [[entanglement|Entanglement]] between neighbouring quantum polyhedra — for instance through [[bell-network|Bell-network states]] — is one concrete proposal for the micro-level glue that, at macro scale, looks like smooth space.",
      "This interface is a single data point along that story: it shows, deterministically and visually, how distributing correlation across face pairs can make the glued-polyhedra picture look more or less convincing, and how different observables read the same state differently.",
      "Switch to Explore mode when you are ready to stop being led by the hand. Everything you have learned here — strength vs. pattern, local vs. global, observable as interpretation — continues to hold.",
    ],
    callouts: [
      {
        kind: 'key',
        body: 'Entanglement pattern ≠ entanglement strength. Both matter. The toy is a place to feel the difference.',
      },
    ],
    actionPrompt:
      'Revisit the controls with the full picture in mind. Try Bell-like symmetric under the Gluing lens at strength 0.9 for a satisfying closing view.',
    recommendedConfig: {
      stateFamily: 'bellSymmetric',
      entanglementStrength: 0.9,
      observableMode: 'gluing',
      demoMode: true,
    },
    recommendedSelection: null,
    checkpointQuestion: 'In this toy, the gluingScore is:',
    checkpointOptions: [
      {
        id: 'a',
        text: 'A proof that semiclassical geometry emerges from entanglement',
        correct: false,
        feedback: 'The toy does not prove anything. It visualises one aspect of the intuition.',
      },
      {
        id: 'b',
        text: "A proxy for the 'glued polyhedra' intuition, not an LQG observable",
        correct: true,
        feedback: 'Correct. It communicates intuition; it is not a computed LQG quantity.',
      },
      {
        id: 'c',
        text: 'An exact LQG observable computed from intertwiners',
        correct: false,
        feedback: 'That is exactly what the toy does not do. A physics-accurate implementation is future work.',
      },
    ],
    checkpointExplanation:
      'The gluingScore is a pedagogical proxy. It responds in the right qualitative direction — higher with good alignment, lower with uneven patterns — but it is not a real LQG observable. This is honesty by design: the demo exists to build intuition, not to prove results.',
    prevLessonId: 'alignment-vs-shape',
    nextLessonId: 'topology-upgrade',
  },

  {
    id: 'topology-upgrade',
    order: 8,
    title: 'Same family, different topology',
    shortGoal: 'Feel what changes when a family lives on a larger graph.',
    conceptTags: ['state-family', 'graph-topology', 'dipole-graph', 'automorphism'],
    narrative: [
      'Everything we have built so far lives on the [[dipole-graph|dipole]] — two nodes, four parallel edges. The [[state-family|state family]] choice distributes correlations across those four pairs.',
      'Switch the topology to [[graph-topology|Cycle Graph (4)]] in the sidebar. The family arrays are unchanged — still four per-edge offsets and four per-edge mismatch coefficients. But now the four edges wrap around a ring of four nodes instead of bridging the same two polyhedra.',
      'The numbers do not move; the geometry does. A Bell-like symmetric state distributes correlation evenly around the ring; an Edge-biased state now picks out one region of the ring. Same family, same per-pair values, a genuinely different spatial picture.',
    ],
    callouts: [
      {
        kind: 'key',
        body: 'Topology selects *where* the family pattern lives; family selects *how* correlation is distributed. These are independent knobs.',
      },
      {
        kind: 'in-demo',
        body: 'The four per-pair snapshots (local strength, mismatch, alignment, gluing proxy) come from family + strength alone. Topology does not change them — it changes their spatial arrangement and which graph automorphisms they respect.',
      },
    ],
    actionPrompt:
      'Apply the lesson setup to put the app on Cycle Graph (4) with Bell-like symmetric. Then flip the family to Edge-biased and watch how "edge-biased" now reads as a localised region around the ring, not as two favoured parallel edges.',
    recommendedConfig: {
      graphTopology: 'cycle4',
      stateFamily: 'bellSymmetric',
      entanglementStrength: 0.75,
      observableMode: 'alignment',
      demoMode: true,
    },
    recommendedSelection: null,
    checkpointQuestion:
      'Switching from Dipole to Cycle Graph (4) at the same family and strength:',
    checkpointOptions: [
      {
        id: 'a',
        text: 'Changes the four per-pair numbers dramatically.',
        correct: false,
        feedback: 'The per-pair snapshots come from family + strength only — none of which changed.',
      },
      {
        id: 'b',
        text: 'Leaves the per-pair numbers unchanged but changes what they mean spatially.',
        correct: true,
        feedback: 'Correct. Topology places the four pairs in the canvas; it does not compute them.',
      },
      {
        id: 'c',
        text: 'Homogenises the state regardless of family.',
        correct: false,
        feedback: 'Nothing in topology forces uniformity — only the state family controls that.',
      },
    ],
    checkpointExplanation:
      'The toy numbers depend on family + strength + observable lens. Topology arranges those four face pairs in space: the dipole packs them between two nodes; Cycle Graph (4) spreads them around a ring. Edge-biased goes from "half of a local pair region is starved" to "one spatial region of the ring is starved" — same mathematics, different spatial signature.',
    prevLessonId: 'why-it-matters',
  },
];
