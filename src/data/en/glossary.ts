import type { GlossaryEntry } from '../../types/glossary';

/**
 * English Concept-Atlas content. See `src/data/glossary.ts` for the
 * locale-aware dispatcher (`getGlossaryEntry`, `getConceptLabel`,
 * `getGlossaryEntries`). Every entry is split into a short definition, why
 * it matters, what it means inside this demo, and what it means in full
 * theory — so the toy/real boundary is always visible.
 *
 * The list order determines the default display order of the atlas list view.
 */
export const GLOSSARY_ENTRIES_EN: readonly GlossaryEntry[] = [
  {
    id: 'dipole-graph',
    label: 'Dipole graph',
    shortDefinition:
      'The two-node, four-edge spin network — the minimal setting in which two quantum polyhedra share faces.',
    whyItMatters:
      'It is the smallest non-trivial example in which we can talk coherently about gluing polyhedra along faces. Everything in this demo lives on it — and everything the Cosmology Bridge module points at beyond it.',
    inThisApp:
      'Two labelled nodes (A and B) connected by four coloured curves. Each curve is a shared face; each endpoint carries a normal arrow. One of two shippable topologies — the other is Cycle Graph (4), selectable from the sidebar.',
    inFullTheory:
      'A well-studied spin network whose Hilbert space has been analysed in detail in loop quantum gravity — sometimes called the fundamental dipole. The full story extends to arbitrarily large graphs and lattices.',
    commonConfusion:
      'The dipole is a useful truncation, not a stand-in for a full cosmological state. Everything taught here is the first step, not the last — the Cosmology Bridge module draws the line explicitly.',
    relatedConceptIds: ['face-pair', 'spin-network', 'intertwiner', 'automorphism', 'graph-topology'],
    suggestedLessonIds: ['intro-dipole', 'topology-upgrade'],
    suggestedBridgeLessonIds: ['graph-symmetry', 'dipole-truncation-limits', 'larger-graph-symmetry'],
    tags: ['graph', 'topology', 'truncation'],
  },

  {
    id: 'face-pair',
    label: 'Face pair',
    shortDefinition:
      'One shared face between two adjacent polyhedra — an edge in the graph together with a pair of face normals.',
    whyItMatters:
      'The individual face pair is the place where "gluing" actually happens. Looking pair by pair is often more revealing than reading global averages.',
    inThisApp:
      'Each of the four coloured curves plus its two endpoint arrows. Each pair has its own local strength, mismatch angle and alignment score.',
    inFullTheory:
      'A pair of matching faces whose normal vectors, areas and shapes together determine whether they can be consistently glued into piecewise-flat geometry.',
    commonConfusion:
      'A face pair is not the same as an edge — it is the edge plus the two normal vectors that live on its endpoints.',
    relatedConceptIds: ['dipole-graph', 'vector-geometry', 'gluing'],
    suggestedLessonIds: ['intro-dipole', 'local-pair-inspection'],
    suggestedChallengeIds: ['most-misaligned', 'global-vs-local'],
    suggestedBridgeLessonIds: ['local-vs-global'],
    tags: ['pair', 'normal', 'face'],
  },

  {
    id: 'spin-network',
    label: 'Spin network',
    shortDefinition:
      'A graph whose edges carry SU(2) representations (spins) and whose nodes carry intertwiners.',
    whyItMatters:
      'Spin networks form a basis for the kinematical Hilbert space of loop quantum gravity — the natural language for discrete quantum geometry.',
    inThisApp:
      'The demo uses one spin network only — the dipole graph — with all four edges set to spin ½ and both nodes carrying trivial intertwiner labels.',
    inFullTheory:
      'The building blocks of spin foam models: states are superpositions of spin networks, and geometric operators act on them through SU(2) recoupling.',
    relatedConceptIds: ['dipole-graph', 'intertwiner', 'entanglement'],
    suggestedLessonIds: ['intro-dipole', 'strength-response'],
    tags: ['LQG', 'basis state'],
  },

  {
    id: 'intertwiner',
    label: 'Intertwiner',
    shortDefinition:
      'An SU(2)-invariant tensor at a spin-network node — it tells you how incoming face spins combine into a rotationally-invariant state.',
    whyItMatters:
      'Each intertwiner corresponds to a quantum polyhedron with specified face areas. Choosing different intertwiners means choosing different polyhedral shapes.',
    inThisApp:
      'Intertwiner structure is not manipulated directly here; it is fixed implicitly. The demo focuses on correlations between normals, not on intertwiner degrees of freedom.',
    inFullTheory:
      'The intertwiner Hilbert space at a node is the space of SU(2) singlets in the tensor product of incoming representations — and it is precisely here that Bell-network correlations live.',
    commonConfusion:
      'An intertwiner is attached to a node, not to an edge. Edges carry spins; nodes carry intertwiners.',
    relatedConceptIds: ['spin-network', 'face-pair', 'bell-network'],
    suggestedLessonIds: ['strength-response'],
    tags: ['SU(2)', 'node', 'tensor'],
  },

  {
    id: 'entanglement',
    label: 'Entanglement',
    shortDefinition:
      'A quantum correlation between subsystems that cannot be reproduced by any classical probabilistic mixture.',
    whyItMatters:
      'Entanglement is the microscopic glue behind proposals that classical geometry emerges from quantum information structure.',
    inThisApp:
      'The entanglement-strength slider is a toy scalar knob that scales how coherently the two nodes\' intertwiner-space degrees of freedom are linked. It does not model a real quantum state.',
    inFullTheory:
      'Entanglement between neighbouring nodes is captured by how the full quantum state fails to factor over the two intertwiner spaces.',
    commonConfusion:
      'Entanglement strength is not the same as correlation distribution. A uniformly entangled state and a lopsided one can share a nominal strength yet produce very different geometric behaviours.',
    relatedConceptIds: ['bell-network', 'intertwiner', 'state-family'],
    suggestedLessonIds: ['strength-response', 'state-families'],
    suggestedChallengeIds: ['strength-vs-family', 'frustration-vs-weakness'],
    tags: ['correlation', 'quantum'],
  },

  {
    id: 'bell-network',
    label: 'Bell-network state',
    shortDefinition:
      'A superposition of spin networks whose nodes are entangled across shared edges, inducing correlations between their intertwiners.',
    whyItMatters:
      'Bell-network states are concrete candidates for how classical geometric gluing might emerge from quantum information — they tie polyhedra together at the level of the state.',
    inThisApp:
      'The Bell-like symmetric family is our toy avatar for a fully, uniformly entangled state: every face pair participates equally in the correlation.',
    inFullTheory:
      'Constructed explicitly for the dipole and more general graphs, typically starting from maximally-entangled singlet states on each edge before projecting onto the intertwiner subspace.',
    commonConfusion:
      '"Bell-network" is not synonymous with "strongly entangled" — it refers to a specific construction pattern, not to a strength level.',
    relatedConceptIds: ['entanglement', 'intertwiner', 'gluing'],
    suggestedLessonIds: ['strength-response', 'state-families'],
    suggestedChallengeIds: ['bell-vs-strong', 'strength-vs-family'],
    tags: ['state', 'pattern', 'correlation'],
  },

  {
    id: 'alignment',
    label: 'Anti-parallel alignment',
    shortDefinition:
      'The condition that normal vectors on opposite sides of a shared face point in opposite directions.',
    whyItMatters:
      'Anti-parallel normals are a necessary condition for two polyhedra to be consistently glued along a shared face — the most visual aspect of gluing.',
    inThisApp:
      'The Alignment observable lens measures how close each right-hand arrow is to 180° from its left-hand partner, through a cos²(mismatch) score.',
    inFullTheory:
      'A well-defined gluing in Regge calculus requires anti-parallel alignment as one of several conditions; shape constraints (areas, dihedral angles) must also hold.',
    commonConfusion:
      'Perfect alignment is necessary but not sufficient for full geometric gluing — this is one of the sharpest lessons of the demo.',
    relatedConceptIds: ['gluing', 'vector-geometry', 'regge-geometry'],
    suggestedLessonIds: ['strength-response', 'alignment-vs-shape'],
    suggestedChallengeIds: ['alignment-vs-regge', 'most-misaligned'],
    tags: ['alignment', 'normal', 'anti-parallel'],
  },

  {
    id: 'gluing',
    label: 'Gluing',
    shortDefinition:
      'The process and conditions by which two polyhedra can be identified along a shared face to form a consistent piecewise-flat geometry.',
    whyItMatters:
      'Gluing is how discrete pieces combine into a continuous-looking geometry. Understanding when and how it happens is central to emergent-geometry arguments.',
    inThisApp:
      'The Gluing observable lens combines mean alignment, mean strength and a cohesion penalty into a toy score that tracks how convincingly the two polyhedra look "glued".',
    inFullTheory:
      'A classical glued configuration must satisfy Regge-style constraints: matching face areas and consistent dihedral angles along every shared edge.',
    commonConfusion:
      'Gluing support (what this demo measures) is not the same as Regge gluing (what full theory demands). The demo touches only the normal-alignment part.',
    relatedConceptIds: ['alignment', 'regge-geometry', 'cohesion'],
    suggestedLessonIds: ['state-families', 'alignment-vs-shape'],
    suggestedChallengeIds: ['strength-vs-family', 'frustration-vs-weakness', 'global-vs-local'],
    suggestedBridgeLessonIds: ['local-vs-global', 'cosmology-bridge-value'],
    tags: ['gluing', 'geometry'],
  },

  {
    id: 'state-family',
    label: 'State family',
    shortDefinition:
      'A deterministic preset that chooses how correlation is distributed across the four face pairs at a given overall strength.',
    whyItMatters:
      'The strength slider answers "how much". The state family answers "how distributed". Distinguishing the two is the main pedagogical move of this demo.',
    inThisApp:
      'Five toy families — Uncorrelated, Weakly aligned, Bell-like symmetric, Frustrated, Edge-biased — each with hand-chosen per-edge strength offsets and mismatch coefficients. The same family arrays run unchanged on either topology; only the spatial placement of the four pairs differs.',
    inFullTheory:
      'Corresponds roughly to a choice of state in the space of Bell-network-like constructions, each encoding a different pattern of intertwiner-space entanglement.',
    relatedConceptIds: ['entanglement', 'bell-network', 'observable-lens', 'automorphism', 'edge-pattern'],
    suggestedLessonIds: ['state-families', 'topology-upgrade'],
    suggestedChallengeIds: [
      'strength-vs-family',
      'edge-bias-lens',
      'bell-vs-strong',
      'topology-detects-bias',
      'family-topology-crosstalk',
    ],
    suggestedBridgeLessonIds: [
      'local-vs-global',
      'graph-symmetry',
      'homogeneity-structural',
      'larger-graph-symmetry',
    ],
    tags: ['family', 'pattern', 'preset'],
  },

  {
    id: 'observable-lens',
    label: 'Observable lens',
    shortDefinition:
      'A choice of which toy quantity to read off a given state — alignment, mismatch, gluing, correlation, uniformity.',
    whyItMatters:
      'Different observables emphasise different aspects of the same underlying state. Switching lenses is the toy analogue of measuring different quantum operators.',
    inThisApp:
      'The sidebar dropdown. It does not change the geometry on the canvas; it only redirects emphasis and re-reads the headline summary.',
    inFullTheory:
      'Each observable corresponds to a self-adjoint operator acting on the state\'s Hilbert space; its expectation value in a given state is what a measurement returns.',
    commonConfusion:
      'Observables do not reshape the state; they reveal different faces of it. Changing the lens never moves the arrows on the canvas here.',
    relatedConceptIds: ['state-family', 'alignment', 'gluing', 'cohesion'],
    suggestedLessonIds: ['observable-lenses'],
    suggestedChallengeIds: ['lens-not-state', 'edge-bias-lens'],
    tags: ['lens', 'measurement'],
  },

  {
    id: 'vector-geometry',
    label: 'Vector geometry',
    shortDefinition:
      'The geometric content of a polyhedron recorded as a set of face-normal vectors with associated face areas.',
    whyItMatters:
      'In LQG, the classical polyhedron associated with a node is reconstructed from the intertwiner\'s peaked vector data — normals and face areas.',
    inThisApp:
      'Only the direction of normals is tracked. Face areas, positions and dihedral angles are not modelled.',
    inFullTheory:
      'A polyhedron is determined (up to congruence) by its face normals and areas, subject to closure. The Minkowski theorem then reconstructs the shape.',
    relatedConceptIds: ['face-pair', 'alignment', 'regge-geometry'],
    suggestedLessonIds: ['local-pair-inspection', 'alignment-vs-shape'],
    tags: ['vector', 'geometry', 'normal'],
  },

  {
    id: 'regge-geometry',
    label: 'Regge geometry',
    shortDefinition:
      'A piecewise-flat discrete geometry built by gluing flat simplices or polyhedra along matching faces.',
    whyItMatters:
      'Regge calculus is the natural discrete language for classical general relativity and provides the continuum limit that spin foams aim to reproduce.',
    inThisApp:
      'Not implemented. The demo tracks only the angular relation between face normals; it does not check the shape-matching conditions Regge geometry requires.',
    inFullTheory:
      'Consistent Regge gluing at a shared edge demands that matching faces have equal areas and that dihedral angles satisfy specific consistency relations.',
    commonConfusion:
      'High alignment in this toy is necessary for Regge gluing but not sufficient. This is the clearest place where the demo stops and full theory begins.',
    relatedConceptIds: ['gluing', 'vector-geometry', 'alignment'],
    suggestedLessonIds: ['alignment-vs-shape', 'why-it-matters'],
    suggestedChallengeIds: ['alignment-vs-regge'],
    tags: ['Regge', 'discrete geometry'],
  },

  {
    id: 'cohesion',
    label: 'Cohesion',
    shortDefinition:
      'A toy quantity measuring how uniformly the four face pairs share the same alignment — 1 when they agree, 0 when they diverge.',
    whyItMatters:
      'Cohesion separates well-distributed correlation (Bell-like symmetric) from uneven correlation (Frustrated, Edge-biased) and directly shapes the gluing score.',
    inThisApp:
      'Defined as `clamp(1 − 2·stddev(localAlignmentScore), 0, 1)` — a simple, readable proxy.',
    inFullTheory:
      'There is no single "cohesion" operator. The full-theory analogue would involve multi-pair correlators and possibly entanglement structure across shared boundaries.',
    relatedConceptIds: ['gluing', 'state-family', 'observable-lens'],
    suggestedLessonIds: ['state-families', 'observable-lenses'],
    suggestedChallengeIds: ['edge-bias-lens', 'frustration-vs-weakness'],
    tags: ['uniformity', 'proxy'],
  },

  {
    id: 'automorphism',
    label: 'Automorphism',
    shortDefinition:
      'A relabelling of a graph\'s nodes and edges that preserves its structure — the formal statement of a graph\'s symmetry.',
    whyItMatters:
      'Automorphisms make precise what "interchangeable" means for nodes and edges. They are the seed idea behind homogeneity and isotropy on larger graphs, and they are the first real structural ladder out of the pair-level picture.',
    inThisApp:
      'The dipole\'s automorphism group is generated by the A ↔ B node swap and by permutations of the four edges (S₂ × S₄). Cycle Graph (4) adds the dihedral group D₄ — four rotations and four reflections. Bell-like symmetric respects the full group on either topology; Frustrated and Edge-biased break distinct subgroups depending on the graph.',
    inFullTheory:
      'Graph automorphisms descend to unitaries on the spin-network Hilbert space. States that are invariant under the automorphism group form a natural subspace and are directly connected to symmetric and homogeneous configurations.',
    commonConfusion:
      'A graph automorphism is a property of the graph, not of any particular state. Whether a state "respects" the automorphism is a further question — the graph and the state can be symmetric or asymmetric independently.',
    relatedConceptIds: ['state-family', 'bell-network', 'homogeneity', 'dipole-graph', 'graph-topology'],
    suggestedLessonIds: ['state-families', 'topology-upgrade'],
    suggestedChallengeIds: ['edge-bias-lens', 'family-topology-crosstalk'],
    suggestedBridgeLessonIds: [
      'graph-symmetry',
      'automorphisms-equivalent-nodes',
      'homogeneity-structural',
      'larger-graph-symmetry',
    ],
    tags: ['symmetry', 'group'],
  },

  {
    id: 'homogeneity',
    label: 'Homogeneity',
    shortDefinition:
      'The property that a state is invariant under the automorphisms of the underlying graph — every equivalent element carries the same data.',
    whyItMatters:
      'Classical cosmology assumes large-scale homogeneity. Recovering a discrete version of this at the quantum level — from Bell-network-style correlations on richly symmetric graphs — is one of the motivating threads from spin networks toward cosmology.',
    inThisApp:
      'Partially modelled through the two shippable topologies. Bell-like symmetric on the dipole respects S₂ × S₄; on Cycle Graph (4) it respects the full dihedral D₄. Other families break distinct subgroups on each graph. The Cosmology Bridge module frames this as a preview of the real constraint, not the real thing.',
    inFullTheory:
      'Discrete analogues of homogeneity appear in loop quantum cosmology, in sum-over-lattices approaches, and in group-field-theory condensates — each with its own technical definition of what "symmetric repetition" means at the quantum level.',
    commonConfusion:
      'Visual uniformity is a consequence of homogeneity, not the definition. Homogeneity is a structural invariance claim about the state + graph pair: the state must commute with the graph\'s automorphisms.',
    relatedConceptIds: ['state-family', 'bell-network', 'gluing', 'automorphism', 'graph-topology'],
    suggestedLessonIds: ['why-it-matters', 'topology-upgrade'],
    suggestedBridgeLessonIds: [
      'homogeneity-structural',
      'cosmology-bridge-value',
      'dipole-truncation-limits',
      'larger-graph-symmetry',
    ],
    tags: ['cosmology', 'symmetry'],
  },

  {
    id: 'graph-topology',
    label: 'Graph topology',
    shortDefinition:
      'The combinatorial shape of the underlying spin network — which nodes exist and how edges connect them.',
    whyItMatters:
      'Topology fixes which graph automorphisms exist, and therefore which symmetries a state can respect or break. It is the first structural knob above the pair level: the same family arrays can look symmetric on one graph and frustrated on another.',
    inThisApp:
      'Two shippable topologies — Dipole Graph (two nodes, four parallel edges) and Cycle Graph (4) (four nodes on a ring). Both carry exactly four face pairs, so the same state-family arrays run unchanged on either. Only the spatial layout and the automorphism group differ.',
    inFullTheory:
      'In full LQG the combinatorial graph underlies a whole superselection sector of the kinematical Hilbert space. Different graphs host different states; relating them requires cylindrical consistency and, ultimately, a continuum limit.',
    commonConfusion:
      'Changing topology does not change per-pair numbers — the four strength offsets and mismatch coefficients stay the same. What changes is which pairs the automorphism group relates, and therefore which families look symmetric and which look broken.',
    relatedConceptIds: [
      'dipole-graph',
      'automorphism',
      'state-family',
      'homogeneity',
      'edge-pattern',
    ],
    suggestedLessonIds: ['topology-upgrade', 'intro-dipole'],
    suggestedChallengeIds: ['topology-detects-bias', 'family-topology-crosstalk'],
    suggestedBridgeLessonIds: ['larger-graph-symmetry', 'dipole-truncation-limits'],
    tags: ['graph', 'topology', 'structure'],
  },

  {
    id: 'edge-pattern',
    label: 'Edge pattern',
    shortDefinition:
      'The deterministic per-edge arrays — strength offsets and mismatch coefficients — that define how a state family distributes correlation across the four face pairs.',
    whyItMatters:
      'It is the concrete data behind the abstract idea of "which pairs carry how much". Two families at the same overall strength can have very different edge patterns, and different edge patterns make symmetry arguments either respect or break a topology\'s automorphism group.',
    inThisApp:
      'Each state family ships with two length-four arrays: strength offsets added to the global slider per pair, and mismatch coefficients scaling the base mismatch angle per pair. The arrays are topology-agnostic — the same pattern runs on Dipole or Cycle Graph (4); the graph decides which pairs are automorphism-equivalent.',
    inFullTheory:
      'Corresponds loosely to the coefficient structure of a specific Bell-network-like state in the intertwiner basis — how node-to-node entanglement is distributed across incident edges.',
    commonConfusion:
      'An edge pattern is not a measurement. It is a choice baked into the family definition. Alignment, mismatch and gluing are what you read off once a pattern and a topology are picked.',
    relatedConceptIds: [
      'state-family',
      'graph-topology',
      'bell-network',
      'entanglement',
      'face-pair',
    ],
    suggestedLessonIds: ['state-families', 'topology-upgrade'],
    suggestedChallengeIds: ['edge-bias-lens', 'family-topology-crosstalk', 'topology-detects-bias'],
    tags: ['structure', 'family'],
  },
];
