/**
 * English UI string table. Canonical source — every other locale mirrors
 * this shape. Keep keys short and component-scoped; do not inline entire
 * paragraphs if you can avoid it.
 */
export const EN = {
  language: {
    label: 'Language',
    en: 'English',
    tr: 'Türkçe',
    switchTo: (name: string) => `Switch to ${name}`,
    current: (name: string) => `Current language: ${name}`,
  },

  header: {
    eyebrow: (topology: string) => `Loop Quantum Gravity · ${topology}`,
    title: 'Bell-Network Visualizer',
    subtitle:
      'A toy model for entanglement and glued-face geometry on small spin networks — state families, observable lenses, pair-level inspection.',
    howToUse: 'How to use',
    howToUseTitle: 'Show the start-here guide',
    atlas: 'Atlas',
    atlasTitle: 'Open the Concept Atlas',
    library: 'Library',
    libraryTitle: 'Open the Content Library',
    badgeToy: 'Toy LQG demo',
    badgeStatic: 'Static · Interactive',
    metaAria: 'Project metadata and mode',
    openInAtlasTitle: 'Open in Concept Atlas',
  },

  modes: {
    group: 'App mode',
    explore: { label: 'Explore', hint: 'Free experimentation with the four knobs' },
    learn: { label: 'Learn', hint: 'Recommended path — 8 guided lessons with checkpoints' },
    challenge: { label: 'Challenge', hint: 'Test your understanding — 10 Socratic tasks' },
    bridge: { label: 'Bridge', hint: 'Graph-level and cosmology thinking — 7 reflections' },
  },

  controls: {
    title: 'Controls',
    topology: 'Graph topology',
    topologyAria: 'Graph topology',
    stateFamily: 'State family',
    stateFamilyAria: 'State family',
    observableLens: 'Observable lens',
    observableLensAria: 'Observable lens',
    strengthLabel: 'Entanglement strength',
    demoModeLabel: 'Demo mode',
    demoModeAria: 'Toggle demo mode',
    reset: 'Reset to family defaults',
    cleanStart: 'Clean start',
    cleanStartTitle:
      'Reset mode, topology, family, strength, lens and selection — keeps your saved progress',
    resetHint:
      'Clean start only resets the exploration surface; revealed lessons and challenges stay. Use the link below if you also want to wipe progress.',
    resetProgress: 'Reset all progress',
    resetProgressTitle:
      'Wipe lesson checkpoints, challenge answers, settings and the onboarding status',
    resetProgressConfirm:
      'Reset everything — lesson checkpoints, challenge answers, all settings and the onboarding state? This cannot be undone.',
    note:
      'The state family sets the correlation pattern; the observable lens decides which aspect of it the visualization and cards emphasize. Numbers below are illustrative proxies, not physical observables.',
    openAtlas: 'Open Concept Atlas →',
  },

  visualization: {
    sceneEyebrow: 'Scene',
    statusDemoOff: 'demo off',
    statusFamilySuffix: 'family',
    hoverHint: 'Hover or click a face pair to inspect',
    dipoleCanvasAria:
      'Dipole graph: four interactive face-normal pairs between two nodes',
    cycleCanvasAria:
      'Cycle graph: four nodes arranged on a ring with four interactive face pairs',
    facePairAria: (index: number, selected: boolean) =>
      `Face pair ${index}${selected ? ', selected' : ''}`,
    statEntanglementStrength: 'Entanglement Strength',
    statEntanglementHint: 'Slider-driven control (0 → 1)',
    statAntiParallel: 'Anti-parallel Score',
    statAntiParallelHint: 'Mean pair-level alignment',
    statMutualInformation: 'Mutual Information',
    statMutualInformationHint: 'Toy proxy, superlinear',
    statGluingScore: 'Gluing Score',
    statGluingScoreHint: 'Aligned × cohesive × strong',
  },

  legend: {
    aria: 'Legend',
    colourLead: 'Each colour marks a',
    colourTail: '(edge + its two normals).',
    facePairEmphasis: 'face pair',
    emphasisLead: 'Stronger emphasis under the active lens means',
    emphasisBold: 'bolder strokes',
    emphasisTail: 'and higher opacity.',
    hoverLead: 'Hover or click',
    hoverBold: 'Hover or click',
    hoverTail: 'a pair to isolate it; click empty space to clear.',
  },

  summary: {
    lensEyebrow: 'Observable lens',
    viewSuffix: 'view',
    statusAria: (status: string) => `Status: ${status}`,
  },

  summaryStatus: {
    strong: 'strong',
    mixed: 'mixed',
    weak: 'weak',
    low: 'low',
    moderate: 'moderate',
    high: 'high',
    fragile: 'fragile',
    uniform: 'uniform',
    spread: 'spread',
    localized: 'localized',
    sparse: 'sparse',
  },

  summaryInterpretations: {
    alignmentStrong: 'All four pairs orient close to anti-parallel.',
    alignmentMixed: 'Average alignment is decent but uneven across pairs.',
    alignmentWeak:
      'Most pairs are far from anti-parallel — the glued picture barely appears.',
    mismatchLow: 'Every pair sits close to its ideal anti-parallel partner.',
    mismatchModerate:
      'Noticeable angular slack on average; one or two pairs may still look sharp.',
    mismatchHigh: 'Wide angular mismatch — normals drift from their partners.',
    mismatchCaution:
      'One pair is much farther off than the average — worth inspecting directly.',
    gluingStrong: 'The combined "glued polyhedra" picture is convincing.',
    gluingMixed:
      "Partial gluing support — some pairs carry the intuition, others don't.",
    gluingFragile: 'The gluing picture is weak; strong correlation is needed to rescue it.',
    correlationUniform: 'Correlation is spread evenly across all four pairs.',
    correlationSpread:
      'Slight per-pair variation — the family favours some pairs modestly.',
    correlationLocalized: 'Correlation concentrates on a subset of pairs.',
    uniformityUniform: 'All pairs behave similarly — the family is symmetric.',
    uniformityMixed: "Pairs don't fully agree; the family has internal structure.",
    uniformitySparse: 'Pair behaviours diverge strongly — this is not a symmetric family.',
  },

  summarySecondary: {
    cohesion: 'cohesion',
    peakPair: 'peak pair',
    pairRange: 'pair range',
    alignmentSigma: 'alignment σ',
  },

  edgeDetail: {
    titleSuffix: ' view',
    titlePrefix: 'Face Pair Detail — ',
    emptyHeadline: 'No pair selected',
    emptyHint:
      'Hover any of the four pairs in the canvas to preview it, or click to pin a selection and inspect its local metrics.',
    family: 'Family',
    pinned: 'selected',
    hoverMode: 'hover',
    clear: 'Clear',
    localStrength: 'Local strength',
    mismatchAngle: 'Mismatch angle',
    alignmentScore: 'Alignment score',
    gluingProxy: 'Gluing proxy',
    deviationLabel: 'Deviation from family mean alignment',
    footnote:
      "Mismatch angle comes from the family's per-edge noise coefficient scaled by the local strength; the remaining proxies are derived from it.",
  },

  startHere: {
    aria: 'Start here',
    eyebrow: 'Start here',
    dismissAria: 'Dismiss the start-here guide',
    dismissTitle: 'Dismiss',
    title: 'Welcome — three ways in',
    lede:
      'An interactive toy model for entanglement and glued-face geometry on small spin networks. Pick an entry point below — you can switch modes at any time from the header.',
    guidedTag: 'Guided',
    guidedName: 'Start with Learn',
    guidedBody:
      'Eight short lessons with an applied setup and a checkpoint each. The recommended path if the dipole and Bell-network vocabulary are new to you.',
    guidedAction: 'Open lesson 1 →',
    freeTag: 'Free',
    freeName: 'Explore freely',
    freeBody:
      'Play with the four knobs in the sidebar — topology, state family, strength, observable lens — and watch the canvas respond. Hover or click a face pair to inspect it.',
    freeAction: 'Keep exploring',
    referenceTag: 'Reference',
    referenceName: 'Open the Concept Atlas',
    referenceBody:
      'Seventeen concept entries — short definitions, what they mean in this app, and what they mean in full theory. Good when you hit an unfamiliar term in any lesson.',
    referenceAction: 'Browse concepts',
    footnote:
      'Your progress, settings and selected pair are saved locally. Share a specific setup by copying the current URL.',
  },

  lesson: {
    aria: (title: string) => `Lesson: ${title}`,
    progress: (order: number, total: number) => `Lesson ${order} of ${total}`,
    conceptsAria: 'Concepts in this lesson (click to open in atlas)',
    openInAtlas: (label: string) => `Open "${label}" in Concept Atlas`,
    actionLabel: 'Action',
    applySetup: 'Apply lesson setup',
    applied: 'Applied ✓',
    checkpointAria: 'Checkpoint question',
    checkpointLabel: 'Checkpoint',
    optionsAria: 'Answer options',
    reveal: 'Reveal explanation',
    whyLabel: 'Why',
    nextStepLabel: 'Next step',
    nextStepAria: 'Recommended next steps',
    tryItTag: 'Try it',
    goDeeperTag: 'Go deeper',
    navAria: 'Lesson navigation',
    prev: '← Previous',
    next: 'Next →',
    iconCorrect: 'correct',
    iconIncorrect: 'incorrect',
  },

  challenge: {
    aria: (title: string) => `Challenge: ${title}`,
    introLabel: 'Challenge mode',
    introFlow: 'Apply setup · inspect canvas · answer · reflect',
    empty: 'No active challenge.',
    progress: (order: number, total: number) => `Challenge ${order} of ${total}`,
    completedCount: (n: number) => `${n} revealed`,
    promptLabel: 'Prompt',
    applySetup: 'Apply challenge setup',
    applied: 'Applied ✓',
    expectedLabel: 'What you should see',
    answerLabel: 'Your answer',
    answerAria: 'Answer',
    yourAnswer: 'Your answer',
    optionsAria: 'Answer options',
    check: 'Check answer',
    explanationLabel: 'Explanation',
    relatedAria: 'Related material',
    relatedConcepts: 'Related concepts',
    relatedLessons: 'Related lessons',
    lessonOrder: (order: number) => `Lesson ${order}`,
    navAria: 'Challenge navigation',
    prev: '← Previous',
    next: 'Next →',
    openInAtlas: (label: string) => `Open "${label}" in Concept Atlas`,
    difficulty: {
      intro: 'intro',
      core: 'core',
      advanced: 'advanced',
    },
    type: {
      prediction: 'prediction',
      comparison: 'comparison',
      diagnosis: 'diagnosis',
      conceptual: 'conceptual',
    },
  },

  bridge: {
    aria: (title: string) => `Bridge lesson: ${title}`,
    introLabel: 'Cosmology bridge',
    introFlow: 'Local gluing · graph symmetry · cosmology thinking',
    empty: 'No active bridge lesson.',
    progress: (order: number, total: number) => `Bridge ${order} of ${total}`,
    keyIdea: 'Key idea',
    commonConfusion: 'Common confusion',
    actionLabel: 'Action',
    applySetup: 'Apply suggested setup',
    applied: 'Applied ✓',
    reflectionAria: 'Reflection prompts',
    reflectionLabel: 'Reflection',
    reflectionNote:
      'These prompts have no checkpoint. They are deliberately open-ended — the point is to think, not to be graded.',
    relatedAria: 'Related material',
    relatedConcepts: 'Related concepts',
    relatedLessons: 'Related lessons',
    relatedChallenges: 'Related challenges',
    lessonOrder: (order: number) => `Lesson ${order}`,
    challengeOrder: (order: number) => `Challenge ${order}`,
    navAria: 'Bridge lesson navigation',
    prev: '← Previous',
    next: 'Next →',
  },

  callouts: {
    key: 'Key idea',
    confusion: 'Common confusion',
    inDemo: 'In this demo',
    inTheory: 'In full theory',
  },

  atlas: {
    aria: 'Concept Atlas',
    eyebrow: 'Concept Atlas',
    close: 'Close Concept Atlas',
    heading: 'Look up a concept',
    subheading:
      'Concept-centred reference — open the Atlas when you hit an unfamiliar term and want a short definition, what it means in this app vs in full theory, and every lesson, challenge and bridge that touches it.',
    searchPlaceholder: 'Search concepts…',
    searchAria: 'Search concepts',
    back: '← Back to atlas',
    emptyResults: 'No concept matched that search. Try a different term.',
    whyItMatters: 'Why it matters',
    inThisApp: 'In this app',
    inFullTheory: 'In full theory',
    commonConfusion: 'Common confusion',
    relatedConcepts: 'Related concepts',
    appearsInLessons: 'Appears in lessons',
    drillWithChallenges: 'Drill with challenges',
    cosmologyBridge: 'Cosmology bridge',
    alsoAppearsIn: 'Where else this appears',
    alsoAppearsInNote:
      'Further places this concept is mentioned — beyond the explicitly suggested items above.',
    lessonNote: 'Opens in Learn mode.',
    challengeNote: 'Opens in Challenge mode.',
    bridgeNote: 'Opens in Bridge mode.',
    lessonOrder: (order: number) => `Lesson ${order}`,
    challengeOrder: (order: number) => `Challenge ${order}`,
    bridgeOrder: (order: number) => `Bridge ${order}`,
  },

  library: {
    aria: 'Content Library',
    eyebrow: 'Content Library',
    close: 'Close Content Library',
    heading: 'Browse every piece of content',
    subheading:
      'Content-centred index — open the Library when you want the full catalogue of lessons, challenges, bridge lessons and glossary entries in one searchable list.',
    statsTemplate: (l: number, c: number, b: number, g: number) =>
      `${l} lessons · ${c} challenges · ${b} bridge lessons · ${g} glossary entries`,
    categoriesAria: 'Content categories',
    searchAria: 'Search within the current tab',
    searchPlaceholder: (tab: string) => `Search ${tab}…`,
    empty: 'Nothing matches your search. Try a different term.',
    tabs: {
      lessons: 'Lessons',
      challenges: 'Challenges',
      bridge: 'Bridge',
      glossary: 'Glossary',
    },
    tagLesson: (order: number) => `Lesson ${order}`,
    tagChallenge: (order: number) => `Challenge ${order}`,
    tagBridge: (order: number) => `Bridge ${order}`,
    tagConcept: 'Concept',
  },

  theoryCards: {
    theoryNotesTitle: 'Theory Notes',
    theoryNotesPill: 'Primer',
    theoryNotesP1a: 'In loop quantum gravity, a ',
    theoryNotesP1b:
      ' basis state assigns an SU(2) representation to every edge and an ',
    theoryNotesP1c:
      ' to every node. Such a basis state fixes the areas of the elementary faces but, on its own, does ',
    theoryNotesP1notEm: 'not',
    theoryNotesP1d:
      ' entangle the quantum polyhedra at neighbouring nodes — their face normals fluctuate essentially independently.',
    theoryNotesP2a: 'Bell-network states',
    theoryNotesP2b:
      ' are superpositions that introduce correlations between those polyhedra. The ',
    theoryNotesP2c:
      ' — two nodes connected by four parallel links — is the minimal setting where this behaviour can be displayed, and it is the object in the canvas above.',

    whyMattersTitle: 'Why This Matters',
    whyMattersPill: 'Motivation',
    whyMattersP1a: 'A generic spin-network basis state does ',
    whyMattersP1notStrong: 'not',
    whyMattersP1b:
      ' glue neighbouring quantum polyhedra together — their face normals fluctuate independently. ',
    whyMattersP1c: 'Bell-network-like correlations',
    whyMattersP1d:
      ' change this picture: they link the normals across the shared surface so that matched faces tend to orient back-to-back, as two polyhedra do when they are actually ',
    whyMattersP1e: 'glued',
    whyMattersP1f: '.',
    whyMattersP2a: 'Moving the strength slider lets you ',
    whyMattersP2feelEm: 'feel',
    whyMattersP2b:
      ' this claim: at low strength the normals scatter, at high strength on the Bell-like symmetric family they lock into clean back-to-back pairs. This is not a full LQG calculation; it is a pedagogical instrument that makes the intuition ',
    whyMattersP2strong: 'entanglement ≈ geometric gluing',
    whyMattersP2c: ' testable on screen.',

    familyCompTitle: 'Family Comparison',
    familyCompPill: 'Reference',
    familyCompIntro:
      'Different correlation patterns produce different geometric intuitions — even at the same overall strength. The family selector picks between these deterministic toy presets:',
    familyCompActive: 'active',

    obsNotesTitle: 'Observable Notes',
    obsNotesPill: 'Lenses',
    obsNotesP1a: 'This interface does ',
    obsNotesP1notStrong: 'not',
    obsNotesP1b:
      ' evaluate the real spectral or geometric operators of loop quantum gravity. What it offers instead is a small set of readable toy ',
    obsNotesP1c: 'lenses',
    obsNotesP1d: ' — different questions asked of the same underlying state.',
    obsNotesP2a: 'Switching lenses on a fixed ',
    obsNotesP2b: 'state family',
    obsNotesP2c: ' exposes which aspect that family emphasises: the ',
    obsNotesP2bellEm: 'Bell-like symmetric',
    obsNotesP2d: ' family reads well under every lens; ',
    obsNotesP2frustEm: 'Frustrated',
    obsNotesP2e: ' scores cleanly on alignment but poorly on uniformity; ',
    obsNotesP2edgeEm: 'Edge-biased',
    obsNotesP2f: ' shines on correlation range.',
  },

  graphSymmetry: {
    heading: 'Dipole automorphism',
    aria: 'Dipole automorphism visualisation',
    miniAria: (left: string, right: string) =>
      `Mini dipole labelled ${left} ↔ ${right}`,
    arrowCaption: 'A ↔ B swap',
    caption:
      "Swapping Node A with Node B leaves the graph's structure unchanged: the same four edges still connect the same pair of nodes, and they still map to themselves as a set. The relabelling is a graph automorphism. A state that respects it is symmetric under the dipole's natural symmetry — which is exactly what Bell-like symmetric tries to do.",
  },

  levelComparison: {
    heading: 'Three levels, one tool',
    aria: 'Levels covered by this tool',
    caption:
      'The demo lives firmly in the pair-level column, reaches a little into the graph-level column (via state families and the automorphism notion), and only gestures at the cosmology column through analogy. Keeping the three levels distinct is half the battle.',
    pairLevel: 'Pair-level',
    pairScope: 'Directly modelled',
    pairBullets: [
      'local strength',
      'mismatch angle',
      'local alignment score',
      'gluing proxy for one pair',
    ],
    graphLevel: 'Graph-level',
    graphScope: 'Partially modelled (dipole only)',
    graphBullets: [
      'automorphism invariance',
      'node / edge equivalence classes',
      "state respects or breaks the graph's symmetry",
      'cohesion across pairs',
    ],
    cosmologyLevel: 'Cosmology-level',
    cosmologyScope: 'Out of scope here',
    cosmologyBullets: [
      'continuous homogeneity & isotropy',
      'coarse-graining to classical space',
      'matter content and dynamics',
      'lattice / large-graph limits',
    ],
  },
};

export type UiStrings = typeof EN;
