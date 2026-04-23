import type { BridgeLesson } from '../../types/bridge';

/**
 * English bridge-lesson content. See `src/data/bridgeLessons.ts` for the
 * locale-aware dispatcher (`getBridgeLesson`, `FIRST_BRIDGE_LESSON_ID`).
 */
export const BRIDGE_LESSONS_EN: readonly BridgeLesson[] = [
  {
    id: 'local-vs-global',
    order: 1,
    title: 'Local relation vs global structure',
    shortGoal: 'See why one well-aligned pair does not make the graph well-glued.',
    narrative: [
      'So far in this tool, our attention has been on individual [[face-pair|face pairs]] — how one pair\'s normals align, how its mismatch angle behaves, how its local strength compares to its neighbours. This builds the intuition that *gluing* is a pair-level condition.',
      'Structure at scale is a different question. A graph can satisfy pair-level alignment and still fail to be a symmetric, consistent quantum geometry if the pairs relate to each other in the wrong way. A graph can also fall short on some pair metrics yet carry a non-trivial global structure that matters.',
      'Pair-level observations are necessary inputs, not graph-level claims. These Bridge lessons walk through a handful of those graph-level claims — starting with the difference between "local condition holds" and "global symmetry holds".',
    ],
    keyIdea:
      'Pair-level success does not automatically imply graph-level structure. Both matter; they are different questions.',
    commonConfusion:
      'Seeing four anti-parallel pairs on the dipole canvas does not, by itself, make the state "cosmologically homogeneous" — it just means four local [[gluing|gluing]] conditions happen to be satisfied.',
    actionPrompt:
      'Apply the suggested setup (Bell-like symmetric at 0.9). Each pair looks locked. Now ask yourself: what would it *also* take for this state to be called structurally symmetric in a graph-theory sense?',
    reflectionPrompts: [
      'If one pair is well aligned, does that already make the whole graph homogeneous?',
      'What extra ingredient would be needed to move from local pairwise support to a truly symmetric graph state?',
      'Can you imagine a graph where every pair is well aligned but the global structure is still asymmetric?',
    ],
    relatedConceptIds: ['face-pair', 'state-family', 'gluing', 'automorphism'],
    relatedLessonIds: ['local-pair-inspection', 'alignment-vs-shape'],
    suggestedChallengeIds: ['global-vs-local', 'frustration-vs-weakness'],
    optionalSetupConfig: {
      stateFamily: 'bellSymmetric',
      entanglementStrength: 0.9,
      observableMode: 'alignment',
      demoMode: true,
    },
    widget: 'level-comparison',
    nextBridgeLessonId: 'graph-symmetry',
  },

  {
    id: 'graph-symmetry',
    order: 2,
    title: 'What does symmetry mean on a graph?',
    shortGoal: 'Introduce graph symmetry through the dipole\'s own.',
    narrative: [
      'A symmetry of a graph is a relabelling of nodes and edges that preserves its connection structure. In the [[dipole-graph|dipole graph]] two obvious relabellings exist: swap Node A with Node B, or permute the four edges among themselves.',
      'Both operations leave the graph untouched as a combinatorial object. They are called [[automorphism|automorphisms]]. Informally: the graph does not know whether you relabelled it.',
      'Why does this matter? A physical state on the graph can either respect these automorphisms or break them. A Bell-like symmetric state respects the dipole\'s automorphisms. A Frustrated or Edge-biased state breaks some of them. The distinction between "symmetric graph" and "symmetric state on the graph" is the seed of everything that follows.',
    ],
    keyIdea:
      'A graph automorphism is a relabelling that preserves the graph\'s structure. A symmetric state is one whose content is invariant under such relabellings.',
    commonConfusion:
      'Symmetry of the graph is not the same as symmetry of the state. The dipole itself is always fully symmetric; whether our *state* respects that symmetry depends on the family we pick.',
    actionPrompt:
      'Open the Concept Atlas and read the [[automorphism|automorphism]] entry. Then switch between Bell-like symmetric and Edge-biased families. The graph is unchanged; only the state is violating a symmetry the graph otherwise allows.',
    reflectionPrompts: [
      'Which of the five state families most visibly break the dipole\'s symmetry?',
      'Why might graph automorphisms matter more on larger graphs than on a dipole?',
      'Would a state that respects every automorphism always have the "best" gluing score?',
    ],
    relatedConceptIds: ['automorphism', 'dipole-graph', 'state-family'],
    relatedLessonIds: ['state-families'],
    suggestedChallengeIds: ['edge-bias-lens'],
    optionalSetupConfig: {
      stateFamily: 'bellSymmetric',
      entanglementStrength: 0.8,
      observableMode: 'alignment',
      demoMode: true,
    },
    prevBridgeLessonId: 'local-vs-global',
    nextBridgeLessonId: 'automorphisms-equivalent-nodes',
  },

  {
    id: 'automorphisms-equivalent-nodes',
    order: 3,
    title: 'Automorphisms and equivalent nodes',
    shortGoal: 'See how graph symmetries group nodes and edges into equivalence classes.',
    narrative: [
      'An automorphism identifies which parts of a graph are interchangeable. In the dipole, Node A and Node B are interchangeable under the A↔B swap. The four edges are interchangeable among themselves under edge permutations.',
      '"Interchangeable" is the seed of [[homogeneity|homogeneity]]. On a bigger graph — say a lattice of many nodes — automorphisms would be translations, rotations and other label reassignments. A state that is invariant under all of them is "homogeneous" in a discrete sense.',
      'The dipole is the smallest graph where this logic shows its face. Coarse, yes — only two nodes — but already non-trivial: swapping A and B is not nothing, and the group of edge permutations is S₄.',
    ],
    keyIdea:
      'Automorphisms carve a graph into equivalence classes. Homogeneity asks that the state treat every equivalent element the same way.',
    commonConfusion:
      'Two nodes being "equivalent under an automorphism" does not mean they are the same node. It means swapping them preserves both the graph and the state.',
    actionPrompt:
      'Read the mini GraphSymmetryCard below. It visualises the A ↔ B swap. Notice how the four edges map to themselves as a *set* even when individual labels move.',
    reflectionPrompts: [
      'Can you describe the full automorphism group of the dipole? (Hint: node swap × edge permutations.)',
      'Which state families here are invariant under the *entire* automorphism group of the dipole?',
      'If you glued two dipoles together, how would the combined graph\'s automorphisms compare to the original dipole\'s?',
    ],
    relatedConceptIds: ['automorphism', 'dipole-graph', 'face-pair', 'state-family'],
    relatedLessonIds: ['intro-dipole'],
    optionalSetupConfig: {
      stateFamily: 'bellSymmetric',
      entanglementStrength: 0.8,
      observableMode: 'alignment',
      demoMode: true,
    },
    widget: 'graph-symmetry',
    prevBridgeLessonId: 'graph-symmetry',
    nextBridgeLessonId: 'homogeneity-structural',
  },

  {
    id: 'homogeneity-structural',
    order: 4,
    title: 'Homogeneity is not just "everything looks identical"',
    shortGoal: 'Separate visual uniformity from structural homogeneity.',
    narrative: [
      'A common beginner\'s reading of [[homogeneity|homogeneity]] is "every piece looks like every other piece". That is not wrong — but it is a consequence of a deeper structural claim, not the definition.',
      'Structurally, a homogeneous state on a graph is one that is invariant under the graph\'s automorphisms. Two nodes that are interchangeable must carry the same local data; two edges that permute into each other must carry the same shared structure.',
      'On the dipole, the Bell-like symmetric family approximates this: all four pairs are equally treated; Nodes A and B play symmetric roles. Frustrated and Edge-biased break this in different ways — one by making two pairs special, the other by giving one side dominance.',
    ],
    keyIdea:
      'Homogeneity is an invariance property, not a visual uniformity. The state must commute with the graph\'s symmetries.',
    commonConfusion:
      'A "homogeneous" state doesn\'t mean every pair shows the same numbers by accident — it means the state is *defined* so that any automorphism leaves it unchanged.',
    actionPrompt:
      'Switch between families at strength 0.5. Bell-like symmetric is the only family here that visibly respects the full dipole symmetry at that strength. Notice how the other families break that invariance in specific, identifiable ways.',
    reflectionPrompts: [
      'If a state looks uniform on the canvas, is that enough to call it homogeneous?',
      'Could a state be homogeneous under the graph automorphisms yet score poorly on the Gluing lens? Why or why not?',
      'How would you check, in principle, whether a state on a 100-node graph is homogeneous?',
    ],
    relatedConceptIds: ['homogeneity', 'automorphism', 'state-family'],
    relatedLessonIds: ['state-families'],
    suggestedChallengeIds: ['edge-bias-lens', 'bell-vs-strong'],
    optionalSetupConfig: {
      stateFamily: 'bellSymmetric',
      entanglementStrength: 0.5,
      observableMode: 'uniformity',
      demoMode: true,
    },
    prevBridgeLessonId: 'automorphisms-equivalent-nodes',
    nextBridgeLessonId: 'cosmology-bridge-value',
  },

  {
    id: 'cosmology-bridge-value',
    order: 5,
    title: 'Why toy local gluing can still matter for cosmological thinking',
    shortGoal: 'Connect the demo to the emergent-geometry narrative.',
    narrative: [
      'A classical cosmological model is homogeneous and isotropic at large scales. In quantum gravity, one would like that property to *emerge* from a discrete quantum substrate — a spin network or lattice state — rather than being postulated.',
      'One guiding idea is that [[entanglement|entanglement]] between adjacent polyhedra is the microscopic mechanism that glues neighbouring regions into a consistent classical geometry. At full-theory scale this gluing has to happen on large, richly symmetric graphs, not on a single dipole.',
      'But the logic generalises. Even on the dipole, you see (a) how strong correlations build up a back-to-back geometric picture, (b) how uneven correlations spoil it, and (c) how the state respects or breaks the graph\'s symmetries. These are exactly the questions the full-theory version asks — just on tiny graphs instead of big ones.',
    ],
    keyIdea:
      'The dipole is a miniature lab for a recurring pattern in quantum gravity: correlations at the micro-level → geometric regularity at the macro-level.',
    commonConfusion:
      'Watching a Bell-like symmetric dipole does not establish cosmological homogeneity. It establishes an analogy — and a testbed for the intuitions one would want to verify at scale.',
    actionPrompt:
      'Stay in Bell-like symmetric at 0.9. Imagine a graph made of 100 copies of this dipole, each in the same Bell-like state. What would the automorphism group of that combined graph look like, and what would "homogeneous" mean there?',
    reflectionPrompts: [
      'Can a toy truncation still teach useful structural lessons?',
      'Which of the intuitions you built on the dipole do you expect to survive on larger graphs?',
      'Which of them probably do not?',
    ],
    relatedConceptIds: ['homogeneity', 'gluing', 'entanglement', 'bell-network'],
    relatedLessonIds: ['why-it-matters'],
    suggestedChallengeIds: ['bell-vs-strong'],
    optionalSetupConfig: {
      stateFamily: 'bellSymmetric',
      entanglementStrength: 0.9,
      observableMode: 'gluing',
      demoMode: true,
    },
    prevBridgeLessonId: 'homogeneity-structural',
    nextBridgeLessonId: 'dipole-truncation-limits',
  },

  {
    id: 'dipole-truncation-limits',
    order: 6,
    title: 'Why this app still stops short of full cosmological states',
    shortGoal: 'Be honest about what the dipole truncation leaves out.',
    narrative: [
      'This tool has a single [[dipole-graph|dipole graph]]. No lattice, no continuous symmetry groups, no Wilsonian coarse-graining, no dynamics. That is a lot of "no".',
      'What the dipole *does* is isolate one conceptual move — the relation between local entanglement and the geometric gluing that one hopes, at large scales, will emerge as classical space. Everything else is stripped out so that one move is readable.',
      'A real cosmological state in loop quantum gravity would live on a much richer graph, often with continuous gauge and diffeomorphism constraints, and would have to match large-scale features such as isotropy and matter content. None of that is modelled here — and this Bridge lesson exists so you are not left with the impression that it is.',
    ],
    keyIdea:
      'The dipole is a pedagogical truncation. It is faithful to one aspect of the larger story and silent on most others.',
    commonConfusion:
      'A fully symmetric Bell-like state on the dipole is not itself a "cosmological solution" — it is a single data point in a much larger story this app deliberately does not tell.',
    actionPrompt:
      'Close this lesson and open the Concept Atlas "homogeneity" entry. Read its *In full theory* block carefully — it names the gap this bridge does not cross.',
    reflectionPrompts: [
      'What additional structure would a minimal "cosmological" toy need beyond what this demo provides?',
      'How would you extend the state-family idea to a graph of, say, 20 nodes?',
      'What would you still not have, even then?',
    ],
    relatedConceptIds: ['dipole-graph', 'homogeneity', 'regge-geometry'],
    relatedLessonIds: ['alignment-vs-shape', 'why-it-matters'],
    prevBridgeLessonId: 'cosmology-bridge-value',
    nextBridgeLessonId: 'larger-graph-symmetry',
  },

  {
    id: 'larger-graph-symmetry',
    order: 7,
    title: 'Why homogeneity becomes more meaningful on larger graphs',
    shortGoal: 'See why the symmetry question grows teeth as the graph grows.',
    narrative: [
      'On the [[dipole-graph|dipole]] the [[automorphism|automorphism]] group is small — node swap × edge permutations. Any family\'s claim to respect that symmetry can be checked almost at a glance, and "[[homogeneity|homogeneity]]" more or less collapses to "treat the four pairs equally".',
      'The [[graph-topology|Cycle Graph (4)]] already pulls this further. Now automorphisms include four rotations and four reflections — the dihedral group D₄. A state can respect rotation invariance and break reflection invariance, or vice versa. "Homogeneity" splits into multiple inequivalent meanings.',
      'This is the direction larger graphs push. On real cosmological lattices, the automorphism group is rich enough that homogeneity becomes a substantive constraint with many non-trivial special cases. Cycle Graph (4) is a small, tractable preview of that situation.',
    ],
    keyIdea:
      'Richer automorphism groups give homogeneity non-trivial content. On the dipole the constraint is almost vacuous; on Cycle Graph (4) it already splits into distinct subgroups to track.',
    commonConfusion:
      'A larger graph does not automatically make states easier to classify. Often the opposite: more symmetry means more ways for a state to respect some invariances while breaking others. "Symmetric" becomes an adjective with multiple flavours, not a single checkbox.',
    actionPrompt:
      'Apply the suggested setup (Bell-like symmetric on Cycle Graph (4), strength 0.8, Uniformity lens). Flip to Edge-biased and note which rotations of the ring the state still respects, and which it does not.',
    reflectionPrompts: [
      'On Cycle Graph (4), could a state be invariant under 180° rotation but not 90° rotation? What would that look like?',
      'Which of the five families respects the full D₄ symmetry of Cycle Graph (4)?',
      'What would the "space of homogeneous Cycle (4) states" even be, and how big would it feel?',
    ],
    relatedConceptIds: ['automorphism', 'homogeneity', 'state-family', 'graph-topology'],
    relatedLessonIds: ['topology-upgrade', 'state-families'],
    suggestedChallengeIds: ['family-topology-crosstalk', 'topology-detects-bias'],
    optionalSetupConfig: {
      graphTopology: 'cycle4',
      stateFamily: 'bellSymmetric',
      entanglementStrength: 0.8,
      observableMode: 'uniformity',
      demoMode: true,
    },
    widget: 'level-comparison',
    prevBridgeLessonId: 'dipole-truncation-limits',
  },
];
