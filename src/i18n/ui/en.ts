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
    lab: {
      label: 'Geometry Lab',
      hint: 'Research surface — gluing, symmetry, effective geometry · skeleton in this build',
    },
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

  lab: {
    aria: 'Geometry Lab',
    eyebrow: 'Bell-Network Geometry Lab',
    heading: 'Geometry Lab — research surface',
    subheading:
      'A dedicated mode for diagnostics that read entanglement, graph symmetry and correlations as effective-geometry signals on Bell-network states. This build ships the Lab as a skeleton — six placeholder panels and a scope note. Real diagnostics arrive in later phases.',

    scopeNoteLabel: 'Scope note',
    scopeNoteBody:
      'This mode currently renders only placeholder surfaces. Future panels will carry pedagogical proxies, conceptual diagnostics, curated classifications and future calculable observables — each visibly tagged with a proxy badge so the honesty class is never hidden.',

    /**
     * Faz 6.5 demo-off banner shown only when `config.demoMode === false`.
     * Explains why every pedagogical-proxy value across the four real
     * Lab panels reads zero in that case — `strength = 0` is fed to the
     * pipeline, mirroring `VisualizationPanel`'s pre-existing behaviour.
     * Context only; no diagnostic claim.
     */
    demoOff: {
      label: 'Demo mode off',
      body: 'Demo mode is off. Pedagogical proxy values that depend on entanglement strength are shown with zero effective strength.',
    },

    panelSwitcherAria: 'Geometry Lab panel',
    activePanelAria: (label: string) => `${label} panel`,

    placeholderLabel: 'Placeholder',
    laterPhaseLabel: 'Later phase',
    sampleProxyLabel: 'Intended honesty class',
    sampleProxyHint:
      'Sample badge — Faz 2 surfaces only the taxonomy, not real outputs.',

    proxyKinds: {
      'pedagogical-proxy': {
        short: 'pedagogical proxy',
        title:
          'A toy formula that responds in the right qualitative direction but does not compute a real LQG quantity.',
      },
      'conceptual-diagnostic': {
        short: 'conceptual diagnostic',
        title:
          'A qualitative read on a structural property — yes / no / weak / strong — not a number to take seriously.',
      },
      'curated-classification': {
        short: 'curated classification',
        title:
          'A discrete tag chosen from a fixed, author-maintained set. Honest because the set is enumerable.',
      },
      'future-calculable-observable': {
        short: 'future calculable observable',
        title:
          'A quantity that could be computed honestly from a Bell-network state but is currently only sketched — flagged so the gap is visible.',
      },
    },

    /**
     * Faz 3 — Gluing Diagnostics panel content. Every visible string the
     * `GluingDiagnosticsPanel` renders lives here so EN ↔ TR parity is a
     * single check at validate time. The numeric values themselves are
     * read from the canonical pipeline at render time and are not
     * translated.
     */
    gluing: {
      intro:
        'Gluing across face pairs is the central LQG-cosmology intuition this app is built around. Three increasingly strict geometric conditions — twisted, vector, Regge — capture different parts of what "glued polyhedra" actually means. This panel reads the existing pedagogical pipeline through that hierarchy and is honest about where it stops.',

      hierarchy: {
        label: 'Geometric hierarchy',
        twisted: {
          name: 'Twisted geometry',
          definition:
            'Neighbouring polyhedra share areas, but adjacent face shapes and normals are not required to match.',
          inThisApp:
            'This app does not compute face-shape data; the shared spin = ½ on every edge means areas trivially match across each pair, but that is a definitional consequence of the topology, not a diagnostic.',
        },
        vector: {
          name: 'Vector geometry',
          definition:
            'A stricter condition: across each shared face the two normals point back-to-back (anti-parallel).',
          inThisApp:
            'This is the regime the visualizer currently approximates. The toy alignment / mismatch / gluing pipeline is a pedagogical-proxy for a vector-geometry read.',
        },
        regge: {
          name: 'Regge geometry',
          definition:
            'Strictest of the three: the shapes of the two glued faces must match — same edge lengths, not only same area and back-to-back normal.',
          inThisApp:
            'This app does not solve the Regge shape-matching constraints. It is flagged below as a future-calculable-observable.',
        },
      },

      diagnostics: {
        label: 'Diagnostics',
        rowsAria: 'Gluing diagnostic rows',
        notComputedLabel: 'not computed',
        rows: {
          antiParallel: {
            title: 'Anti-parallel normal alignment',
            body: 'Mean alignment across the four face pairs — a vector-geometry pedagogical proxy.',
            proxyNote:
              'Reads `antiParallelScore` from the canvas pipeline; not an LQG operator expectation.',
          },
          gluingCoherence: {
            title: 'Gluing coherence across face pairs',
            body: 'How tightly the per-pair gluing proxies cohere as a single number.',
            proxyNote:
              'Reads `gluingScore` — the same value the canvas already displays in its stat card.',
          },
          faceAreaMatching: {
            title: 'Face-area matching',
            body: 'Twisted geometry asks adjacent areas to match across shared faces.',
            proxyNote:
              'Not computed. The face-area operator expectation values are not evaluated in this app.',
          },
          shapeMatching: {
            title: 'Shape matching / Regge condition',
            body: 'Regge geometry asks shared faces to have matching shapes — same edge lengths, not only same area.',
            proxyNote:
              'Not computed. No Regge shape-matching constraint is solved.',
          },
          closure: {
            title: 'Closure constraint at each node',
            body: 'For a quantum polyhedron, closure (Σ face normals = 0 weighted by area) is a defining invariance.',
            proxyNote:
              'Not computed. No node-level closure observable is evaluated.',
          },
        },
      },

      pairTable: {
        label: 'Per-pair pedagogical-proxy values',
        caption:
          'Values mirror the canvas pipeline exactly — same numbers as the Face Pair Detail card, presented here through the gluing lens.',
        columns: {
          pair: 'Pair',
          localStrength: 'Local strength',
          mismatch: 'Mismatch',
          alignment: 'Alignment',
          gluing: 'Gluing proxy',
        },
      },

      limitations: {
        label: 'Limitations',
        aria: 'Limitations of this panel',
        items: [
          'This app currently visualizes a pedagogical vector-geometry proxy.',
          'It does not compute full twisted-geometry phase-space data.',
          'It does not solve Regge shape-matching conditions.',
          'It does not evaluate exact LQG intertwiner observables.',
          'It does not enforce closure constraints at nodes.',
        ],
      },

      howToRead: {
        label: 'How to read this panel',
        body: 'Diagnostic rows tagged pedagogical-proxy show numbers from the existing toy pipeline — the same values the canvas already uses, just labelled with their honesty class. Rows tagged future-calculable-observable show no number on purpose: the gap between this app and a real LQG calculation is meant to be visible, not hidden.',
      },
    },

    /**
     * Faz 4 — Symmetry / Automorphism Diagnostics panel content.
     *
     * Co-locating the curated readings here (rather than in a separate
     * `src/data/labSymmetryProfiles.ts`) keeps EN ↔ TR parity under the
     * existing `validate-ui-i18n.mjs` check at zero cost — the readings
     * ARE user-facing prose, which is exactly what i18n is for. The
     * structural id sets (which two topologies, which five state
     * families) come from the canonical lookups in `src/data/topologies.ts`
     * and `src/data/stateFamilies.ts`; only the *labels* keyed by those
     * ids live here.
     */
    symmetry: {
      intro:
        'Graph symmetry is what makes a small spin network feel like a coherent piece of geometry rather than a collection of unrelated pieces. In LQG truncations, automorphism invariance plays the role of a discrete diffeomorphism-like consistency, and homogeneous-graph states motivate looking at node and edge equivalence. This panel offers a conceptual reading of how the active topology and state family relate to those ideas — it does not compute the full automorphism group.',

      context: {
        label: 'Graph automorphism — what it means here',
        body: 'A graph automorphism is a relabelling that leaves the graph’s structure unchanged: same set of nodes, same edges, same connectivity, just a different way of naming them. On a homogeneous graph every node sits in a single orbit and every edge sits in a single orbit, so the labels carry no information beyond the connectivity itself. LQG graph truncations use automorphism invariance as a discrete analogue of diffeomorphism invariance — the physics should not depend on which label is which. This panel reads the active topology and state family through that lens conceptually, without enumerating the group or its orbits.',
      },

      topologyReading: {
        label: 'Topology symmetry reading',
        activeAria: 'Active topology symmetry reading',
        readings: {
          dipole: {
            headline: 'Dipole — two-node / four-link symmetry intuition',
            body: 'Two nodes connected by four parallel edges. The natural automorphisms are the A↔B node swap together with arbitrary permutations of the four edges, which is the simplest non-trivial setting where node equivalence and edge equivalence both hold. Conceptually this gives a single node orbit and a single edge orbit — the graph is homogeneous in the toy sense.',
          },
          cycle4: {
            headline: 'Cycle-4 — cyclic / dihedral symmetry intuition',
            body: 'Four nodes arranged on a ring. The natural automorphisms are the dihedral group D₄: four cyclic rotations and four reflections. Conceptually all four nodes are equivalent and all four edges are equivalent, so the ring is homogeneous in the toy sense and the same state family stretches its correlations spatially across the ring instead of concentrating on a single polyhedron pair.',
          },
        },
      },

      familyReading: {
        label: 'State-family symmetry reading',
        activeAria: 'State-family curated classifications',
        activeChipLabel: 'active',
        classifications: {
          uncorrelated: {
            headline: 'Symmetry-neutral baseline',
            body: 'With no entanglement-induced structure, the state has no preferred direction and respects every topology automorphism trivially. There is no symmetry to break because there is no pattern to break it on.',
          },
          weakAligned: {
            headline: 'Partially aligned, weakly symmetry-compatible',
            body: 'The four pairs receive nearly equal mismatch coefficients and small evenly-spread strength offsets. The state hints at the topology’s symmetry without locking into it — pair equivalence is preserved but only weakly expressed.',
          },
          bellSymmetric: {
            headline: 'Highly symmetry-respecting, near-uniform',
            body: 'Mismatch coefficients are nearly equal across the four pairs (all small, alternating sign) and strength offsets are tiny. This is the family designed to respect the dipole’s S₂ × S₄ structure and the cycle-4’s D₄ structure as cleanly as a deterministic toy can.',
          },
          frustrated: {
            headline: 'Deliberately symmetry-breaking, non-uniform',
            body: 'Two pairs receive small mismatch coefficients while two receive large ones. The family explicitly singles out a subset of pairs — pair equivalence is broken by construction, which is what makes it a useful comparison to the symmetric family at the same global strength.',
          },
          edgeBiased: {
            headline: 'Edge-selected asymmetry',
            body: 'Strength offsets and mismatch coefficients are biased so that two pairs receive strong support and two receive weak support. Pair equivalence is intentionally broken in favour of a chosen subset — a localised correlation rather than a homogeneous one.',
          },
        },
      },

      diagnostics: {
        label: 'Diagnostics',
        rowsAria: 'Symmetry diagnostic rows',
        notComputedLabel: 'not computed',
        rows: {
          topologySymmetry: {
            title: 'Topology symmetry reading',
            body: 'Reads the active topology through a conceptual symmetry lens — what kinds of automorphisms it admits and how to think about node and edge orbits.',
            proxyNote:
              'Conceptual diagnostic. Not a computed automorphism group; the reading is curated for the two shippable topologies.',
          },
          nodeEquivalence: {
            title: 'Node equivalence intuition',
            body: 'Whether the topology treats every node as interchangeable. On the dipole, two nodes form a single orbit. On the cycle-4, all four nodes form a single orbit. This is what "homogeneous" means in the toy graph register.',
            proxyNote:
              'Conceptual diagnostic. The app does not compute orbits — the readings are curated for the two shippable topologies.',
          },
          edgeOrbit: {
            title: 'Face-pair / edge orbit intuition',
            body: 'Whether the four face pairs sit in a single equivalence class or split into subsets. The answer depends on both the topology (orbit structure) and the active state family (whether the state respects that structure or breaks it).',
            proxyNote:
              'Conceptual diagnostic. Not a computed orbit decomposition; the panel reads it from the structural pattern of the active state-family arrays.',
          },
          familyClassification: {
            title: 'State-family symmetry classification',
            body: 'Curated reading of how each state family relates to the topology’s symmetries — symmetry-respecting, partially-respecting, or symmetry-breaking. The active family is highlighted in the readings above.',
            proxyNote:
              'Curated classification. The five readings are author-maintained labels chosen from a fixed set; they are honest because the set is enumerable, not because the math is exhaustive.',
          },
          fullAutomorphism: {
            title: 'Full automorphism-group computation',
            body: 'A real computation would enumerate the symmetry group of the active topology and decompose nodes and edges into orbits explicitly, then check whether the active state respects those orbits.',
            proxyNote:
              'Not computed. No graph automorphism algorithm is run; the conceptual readings above are written by hand for the two shippable topologies.',
          },
          oneNodeObservables: {
            title: 'Automorphism-invariant one-node observables',
            body: 'Connects to the homogeneous-graph and cosmological-state line of work where one-node observables and reduced density matrices on a single node are the natural symmetry-invariant probes.',
            proxyNote:
              'Not computed. The app does not evaluate one-node observable algebras or reduced density matrices.',
          },
        },
      },

      limitations: {
        label: 'Limitations',
        aria: 'Limitations of this panel',
        items: [
          'This app does not compute the full graph automorphism group.',
          'It does not enumerate node orbits or edge orbits algorithmically.',
          'It does not evaluate one-node observables or reduced density matrices.',
          'State-family symmetry readings are curated labels chosen from a fixed set, not theorems.',
          'Topology symmetry framing is conceptual, not a proof.',
        ],
      },

      howToRead: {
        label: 'How to read this panel',
        body: 'Rows tagged conceptual-diagnostic carry qualitative readings — yes / partial / no, symmetric / broken — meant to give intuition rather than a number to take seriously. Rows tagged curated-classification show labels chosen from a fixed, author-maintained set; they are honest because the set is enumerable. Rows tagged future-calculable-observable show no value on purpose: the gap to a real automorphism-group computation or one-node observable algebra is meant to be visible rather than hidden.',
      },
    },

    /**
     * Faz 5 — Effective Geometry Summary panel content.
     *
     * Numeric values are read from the canonical `deriveCorrelationState`
     * pipeline — same call as the Faz 3 Gluing panel + the canvas stat
     * cards, so Lab and canvas cannot drift. Conceptual readings (vector
     * / twisted / Regge comparison, flat-vs-spherical tetrahedron, the
     * topology-specific notes) live here as user-facing prose rather
     * than in a separate data file, so `validate-ui-i18n.mjs` enforces
     * EN ↔ TR parity automatically.
     */
    effectiveGeometry: {
      intro:
        'Bell-network states can be read as entanglement-supported gluing structures, but the "geometry" they carry is not automatically the same as a flat classical tetrahedron. Effective geometry asks what kind of geometric reading is honest given the data on hand. This panel sits the active configuration inside the vector → twisted → Regge hierarchy and is explicit about which readings are pedagogical proxies, which are conceptual diagnostics, and which would need calculations the app does not yet perform.',

      hierarchy: {
        label: 'Effective geometry — what this panel reads',
        body: 'Three increasingly demanding geometric readings of the same combinatorial data are useful here. **Vector geometry** is the cheapest: it asks only for back-to-back face normals across each shared face, which is exactly what the canvas alignment / mismatch / gluing proxy tracks. **Twisted geometry** is richer — it adds areas, shapes and extrinsic angle data on the full phase space at each face. **Regge geometry** is the most demanding — it asks shared faces to have matching shapes, with dihedral consistency at every edge. The app currently lives in the vector-geometry register; the twisted and Regge rows below mark exactly what it does not yet do.',
      },

      comparison: {
        label: 'Vector vs twisted vs Regge geometry',
        aria: 'Vector, twisted and Regge geometry comparison cards',
        columns: {
          asksFor: 'What it asks for',
          thisApp: 'What this app currently shows',
        },
        cards: {
          vector: {
            name: 'Vector geometry',
            asksFor:
              'Anti-parallel neighbouring face normals across each shared face — a single direction-matching condition per pair.',
            thisApp:
              'Pedagogical alignment / mismatch / gluing proxy from the canvas pipeline. Not an exact vector-geometry constraint solution.',
          },
          twisted: {
            name: 'Twisted geometry',
            asksFor:
              'Area variables, shape variables and extrinsic angle data on the full phase space at each face.',
            thisApp:
              'Not computed. The app does not evaluate twisted-geometry phase-space data.',
          },
          regge: {
            name: 'Regge geometry',
            asksFor:
              'Shared face shapes must match — same edge lengths, plus dihedral consistency at every edge.',
            thisApp:
              'Not computed. The app does not solve Regge shape-matching constraints.',
          },
        },
      },

      topologyNote: {
        label: 'Topology-specific note',
        activeAria: 'Active topology effective-geometry note',
        notes: {
          dipole: {
            headline: 'Dipole — flat vs spherical tetrahedron reading',
            body: 'The dipole graph — two nodes connected by four parallel edges — is the natural place in this app to discuss two glued quantum polyhedra, Bell-network gluing and dipole effective-geometry readings. Whether the effective geometry of two glued polyhedra is best read as a flat classical tetrahedron or as a curved spherical-tetrahedron deformation is exactly the kind of question this graph motivates.',
            followUp:
              'The spherical tetrahedron interpretation should be read as a literature-oriented conceptual diagnostic, not as a computation performed by this app.',
          },
          cycle4: {
            headline: 'Cycle-4 — repeated pair structure',
            body: 'The cycle-4 graph — four nodes on a ring with four shared face pairs — is useful for repeated pair structure and cyclic / dihedral intuition. The same state family stretches its correlations spatially across the ring instead of concentrating on a single polyhedron pair.',
            followUp:
              'This panel does not assign a dipole-specific spherical-tetrahedron reading to the cycle-4 — that diagnostic stays dipole-only by design.',
          },
        },
      },

      diagnostics: {
        label: 'Diagnostics',
        rowsAria: 'Effective geometry diagnostic rows',
        notComputedLabel: 'not computed',
        dipoleSpecificLabel: 'dipole-specific',
        rows: {
          vectorGeometryProxy: {
            title: 'Vector-geometry proxy',
            body: 'Reads the canvas anti-parallel alignment score — the pedagogical proxy for back-to-back face normals across shared faces.',
            proxyNote:
              'Reads `antiParallelScore` from the canvas pipeline; not an exact vector-geometry constraint solution and not an LQG operator expectation.',
          },
          effectiveGluingTendency: {
            title: 'Effective gluing tendency',
            body: 'Reads the canvas gluing score — how cohesively the four pairs support a single glued-polyhedra picture under the active strength and family.',
            proxyNote:
              'Reads `gluingScore` from the canvas pipeline; mirrors the value already shown in the canvas stat cards and the Faz 3 Gluing Diagnostics panel.',
          },
          flatTetrahedron: {
            title: 'Flat tetrahedron expectation',
            body: 'A classical flat tetrahedron is one possible classical limit of a quantum polyhedron, but it is not automatic — Bell-network states need not localise on flat tetrahedra in any obvious way.',
            proxyNote:
              'Conceptual diagnostic. The app does not evaluate flat-tetrahedron expectation values on the active state.',
          },
          sphericalTetrahedron: {
            title: 'Spherical tetrahedron interpretation',
            body: 'A literature-oriented effective-geometry reading on the dipole graph — relevant when the effective geometry of two glued quantum polyhedra is best read as curved (spherical-tetrahedron) rather than flat. The reading is descriptive, not computed.',
            proxyNote:
              'Conceptual diagnostic. The app does not compute spherical-tetrahedron expectation values; the row stays visible on every topology so the reading is not silently dropped, but the chip flags when the active topology is not the dipole.',
          },
          twistedPhaseSpace: {
            title: 'Twisted-geometry phase-space data',
            body: 'Twisted geometry needs area, shape and extrinsic angle data on the full phase space at each face — richer than the single direction the vector-geometry proxy tracks.',
            proxyNote:
              'Not computed. The app does not evaluate twisted-geometry phase-space variables.',
          },
          reggeShapeMatching: {
            title: 'Regge shape-matching data',
            body: 'Regge geometry asks shared faces to have matching shapes — same edge lengths, plus dihedral consistency at every edge.',
            proxyNote:
              'Not computed. No Regge shape-matching constraint is solved.',
          },
          exactExpectations: {
            title: 'Exact LQG expectation values',
            body: 'Real geometric operators on the LQG Hilbert space — area, volume, dihedral angle — admit exact expectation values on a Bell-network state. A real effective-geometry calculation reads those.',
            proxyNote:
              'Not computed. The app does not evaluate intertwiner-space geometric operator expectation values.',
          },
        },
      },

      limitations: {
        label: 'Limitations',
        aria: 'Limitations of this panel',
        items: [
          'This app currently visualizes a pedagogical vector-geometry proxy.',
          'It does not compute twisted-geometry phase-space data.',
          'It does not solve Regge shape-matching conditions.',
          'It does not evaluate exact LQG geometric operator expectation values.',
          'The flat-vs-spherical tetrahedron distinction is presented as a conceptual diagnostic, not a computed result.',
        ],
      },

      howToRead: {
        label: 'How to read this panel',
        body: 'Rows tagged pedagogical-proxy carry numbers that come verbatim from the canvas pipeline — the same values the canvas stat cards and the Gluing Diagnostics panel use, just relabelled through a vector-geometry lens. Rows tagged conceptual-diagnostic describe a literature-oriented reading and carry no number on purpose: the description is the diagnostic. Rows tagged future-calculable-observable show a "not computed" pill so the gap between this app and a real twisted, Regge or exact-LQG calculation stays visible rather than hidden.',
      },
    },

    /**
     * Faz 6 — Correlation Summary panel content.
     *
     * Numeric values are read from the canonical `deriveCorrelationState`
     * + `deriveEdgeDetails` pipeline (same calls as the canvas + the
     * Gluing / Effective Geometry panels) so Lab and canvas cannot
     * drift. The `mutualInformationProxy` value surfaced in the global
     * summary is a deterministic toy formula
     * `(strengthMean × alignMean)^1.5` — its diagnostic row note states
     * this verbatim. Curated state-family correlation readings live
     * here as user-facing prose under
     * `familyReading.classifications.<id>` so `validate-ui-i18n.mjs`
     * enforces EN ↔ TR parity automatically.
     */
    correlations: {
      intro:
        'Correlations sit at the centre of the Bell-network research line — both as the structural input that distinguishes one state family from another, and as the cosmological observable real LQG calculations would eventually evaluate. This panel reads the canonical pipeline through that lens: pair-level toy values per face pair, a global proxy summary, and a curated reading of how each state family encodes its correlations. It is explicit about what it does not compute.',

      hierarchy: {
        label: 'Correlation reading hierarchy',
        body: 'Three levels of "correlation" matter for the Bell-network register, each at a different honesty class. **Pair-level correlations** look at how each face pair contributes to the global pattern — surfaced here as the canonical per-pair toy values (local strength, alignment, gluing proxy). **Graph-level tendencies** read the whole state through global aggregates — anti-parallel score, gluing score, and the mutual-information proxy. **Exact intertwiner-space correlators** would compute true two-point functions of geometric operators on the LQG Hilbert space — the app does not do this, so those rows are tagged future-calculable-observable.',
      },

      pairProfile: {
        label: 'Pair-level correlation profile',
        aria: 'Per-pair toy correlation values',
        caption:
          'Three toy values per face pair, taken verbatim from the canvas pipeline. They are pedagogical proxies — useful as a per-pair reading of the active state, not exact two-point functions.',
        metrics: {
          localStrength: 'Local strength',
          alignment: 'Alignment',
          gluing: 'Gluing proxy',
        },
      },

      globalSummary: {
        label: 'Global proxy summary',
        aria: 'Global correlation proxy values',
        caption:
          'Three global proxies for the active state. They mirror the values the canvas already shows in its stat cards and the Gluing Diagnostics panel — same numbers, different framing.',
        metrics: {
          antiParallel: 'Anti-parallel score',
          gluing: 'Gluing score',
          mutualInformation: 'Mutual information proxy',
        },
      },

      familyReading: {
        label: 'State-family correlation reading',
        activeAria: 'Curated state-family correlation classifications',
        activeChipLabel: 'active',
        classifications: {
          uncorrelated: {
            headline: 'Baseline with minimal structured correlation',
            body: 'In this app’s curated reading, the uncorrelated family carries no entanglement-induced correlation pattern. Pair-level and global proxies stay near their unentangled baseline; correlations are the absence rather than the presence of structure.',
          },
          weakAligned: {
            headline: 'Weakly aligned, not strongly correlated',
            body: 'In this app’s curated reading, the weakly-aligned family produces a soft, evenly-spread correlation tendency — pair-level proxies are non-trivial but small, and global proxies are modest. Correlations exist but are weak and uniform.',
          },
          bellSymmetric: {
            headline: 'Uniform Bell-like correlation pattern',
            body: 'In this app’s curated reading, the Bell-symmetric family is the one designed to look uniformly correlated across all four pairs. Pair-level proxies are tightly clustered; global proxies sit high. This is the family that most closely matches the toy "Bell-network" framing.',
          },
          frustrated: {
            headline: 'Competing pair tendencies, non-uniform pattern',
            body: 'In this app’s curated reading, the frustrated family produces a deliberately split correlation pattern — two pairs land in a well-correlated subset, two stay weakly correlated. Global proxies stay moderate but pair-level cohesion is low; correlations are present but inhomogeneous.',
          },
          edgeBiased: {
            headline: 'Selected edge / face-pair bias',
            body: 'In this app’s curated reading, the edge-biased family concentrates correlation on a chosen subset of face pairs. Pair-level proxies split sharply between strong and weak; global proxies depend on how the bias is averaged. Correlations exist but are localised, not homogeneous.',
          },
        },
      },

      diagnostics: {
        label: 'Diagnostics',
        rowsAria: 'Correlation diagnostic rows',
        notComputedLabel: 'not computed',
        rows: {
          pairProfile: {
            title: 'Pair-level correlation profile',
            body: 'Surfaces the per-pair toy values from the canonical pipeline through a "correlation profile" lens — which pair contributes how much, and how cohesively the four pairs cohere as a single pattern.',
            proxyNote:
              'Reads `localStrength`, `localAlignmentScore` and `localGluingProxy` from `deriveEdgeDetails`. These are pedagogical proxies, not exact two-point functions on the intertwiner space.',
          },
          globalTendency: {
            title: 'Global correlation tendency',
            body: 'A graph-level read of the active state through three global proxies — anti-parallel score, gluing score, and the mutual-information proxy — taken verbatim from the canvas pipeline.',
            proxyNote:
              'Reads `antiParallelScore`, `gluingScore` and `mutualInformationProxy` from `deriveCorrelationState`. The `mutualInformationProxy` is a deterministic toy formula based on `(strengthMean × alignMean)^1.5`; it is not the quantum mutual information of any density matrix.',
          },
          familyReading: {
            title: 'State-family correlation reading',
            body: 'Curated reading of how each of the five shippable state families encodes its correlations — uniform, partially-uniform, frustrated, or edge-biased. The active family is highlighted in the readings above.',
            proxyNote:
              'Curated classification. The five readings are author-maintained labels chosen from a fixed set; they are honest because the set is enumerable, not because the math is exhaustive.',
          },
          symmetryVsCorrelation: {
            title: 'Symmetry vs correlation distinction',
            body: 'A uniform-looking state may suggest symmetry, but symmetry and correlation are not the same thing. Two pairs can sit in the same orbit (symmetry-equivalent) while their correlation strengths differ; conversely, a state can break a graph automorphism while keeping pair-level correlations cohesive.',
            proxyNote:
              'Conceptual diagnostic. The reading is descriptive — not a computed orthogonality between a symmetry group action and a correlation operator.',
          },
          exactCorrelators: {
            title: 'Exact intertwiner-space correlators',
            body: 'A real correlation calculation would evaluate two-point functions of geometric operators (areas, volumes, dihedral angles, edge holonomies) on the Bell-network state, on the LQG Hilbert space proper.',
            proxyNote:
              'Not computed. The app does not evaluate intertwiner-space correlators or any pair-pair correlation matrix.',
          },
          reducedDensityMatrix: {
            title: 'Reduced density matrix and entanglement entropy',
            body: 'Local entanglement entropy on a single node — the natural symmetry-invariant probe in the homogeneous-graph and cosmological-state line of work — is computed from the reduced density matrix of the Bell-network state restricted to that node.',
            proxyNote:
              'Not computed. The app does not evaluate one-node reduced density matrices or local entanglement entropies.',
          },
        },
      },

      limitations: {
        label: 'Limitations',
        aria: 'Limitations of this panel',
        items: [
          'This app does not compute exact intertwiner-space correlators (two-point functions).',
          'It does not evaluate one-node reduced density matrices.',
          'It does not compute local entanglement entropies on Bell-network states.',
          'Pair-level numbers are toy proxies, not true quantum-correlation operators.',
          'State-family correlation readings are curated labels chosen from a fixed set, not theorems.',
        ],
      },

      howToRead: {
        label: 'How to read this panel',
        body: 'Rows tagged pedagogical-proxy carry numbers that come verbatim from the canvas pipeline — the same values the canvas, the Gluing Diagnostics panel and the Effective Geometry panel display, just relabelled through a "correlation" lens. Rows tagged conceptual-diagnostic and curated-classification carry qualitative readings or author-maintained labels; they are honest because they are descriptive rather than calculated. Rows tagged future-calculable-observable show "not computed" pills on purpose: the gap between this app and a real LQG correlator or entanglement-entropy calculation is meant to be visible rather than hidden.',
      },

      /**
       * Faz 9B — Minimal Qubit Engine Preview content.
       *
       * Renders inside the Correlation Summary panel between the
       * global proxy summary and the state-family curated reading.
       * Drives a section that displays *exact* finite-dimensional
       * quantum-information calculations (density matrices, partial
       * traces, von Neumann entropy) on a minimal qubit model
       * selected from the active topology + family.
       *
       * The whole register is honest about what it is and isn't:
       * the section header carries a `[minimal qubit model]` chip,
       * the intro states the model boundary, and the closing
       * exact-vs-proxy callout pins the distinction between "exact
       * within the qubit model" and "pedagogical proxy of the LQG
       * register". No `<ProxyBadge>` is used here — the engine
       * outputs are exact within their model rather than proxies,
       * but the model itself is minimal; the existing four
       * ProxyKinds don't fit, so a plain chip stands in.
       */
      enginePreview: {
        label: 'Minimal Qubit Engine Preview',
        intro:
          'Exact finite-dimensional quantum-information calculations on a minimal qubit model selected from the active topology and state family. Density matrix, partial trace and von Neumann entropy are computed exactly inside this model — but the model is *not* an SU(2) intertwiner-space construction, *not* an LQG Bell-network state, and *not* a geometric-operator (area, volume, dihedral angle) expectation value.',
        modelLabel: 'minimal qubit model',
        exactLabel: 'exact within model',
        notLqgLabel: 'not LQG',

        topologyLabel: 'Active topology',
        familyLabel: 'Active state family',
        selectedStateLabel: 'Selected engine state',
        qubitsLabel: 'Number of qubits',
        mappingReasonLabel: 'Why this state?',

        entropyLabel: 'Per-qubit von Neumann entropy',
        entropyBitsLabel: 'bits',
        entropyNatsLabel: 'nats',
        qubitLabel: (n: number) => `Qubit ${n}`,

        reducedDensityMatrixLabel: 'Reduced density matrix',
        firstQubitLabel: 'ρ for qubit 0 (2 × 2)',

        exactVsProxyLabel: 'Exact within model · Proxy outside model',
        exactVsProxyBody:
          'The density matrices, partial traces and entropies above are exact finite-dimensional quantum-information calculations — but only within this minimal qubit model. The Correlation Summary numbers above (anti-parallel score, gluing score, mutual-information proxy) and the curated state-family readings remain pedagogical proxies of the LQG register. The two registers complement each other; neither replaces the other. An SU(2) intertwiner-space upgrade is part of a future Phase 9C.',

        mappingReasons: {
          dipoleProduct:
            'Dipole has two nodes; with the uncorrelated family, the minimal qubit preview uses a |00⟩ product state — no entanglement-induced structure to display.',
          dipoleBell:
            'Dipole has two nodes; non-uncorrelated families are represented by the two-qubit Bell state |Φ+⟩ in the minimal qubit preview as a maximally-entangled toy baseline.',
          cycle4Product:
            'Cycle-4 has four nodes; with the uncorrelated family, the minimal qubit preview uses a |0000⟩ product state — no global entanglement to display.',
          cycle4Ghz:
            'Cycle-4 has four nodes; non-uncorrelated families are represented by a four-qubit GHZ state in the minimal qubit preview as a global-correlation toy baseline.',
        },

        stateKinds: {
          product: 'Product state',
          bellPair: 'Bell pair |Φ+⟩',
          ghz: 'GHZ state',
        },

        /**
         * Faz 9B.5 → Faz 9C-1 — exact qubit mutual information block.
         *
         * Surfaces inside the existing Engine Preview section, between
         * the reduced density matrix and the closing exact-vs-proxy
         * callout. Two cases:
         *   • computed — every state the engine currently produces
         *     (Bell pair, Cycle-4 / GHZ pair, GHZ(3), GHZ(4),
         *     product(4)). Phase 9C-1's general real-symmetric Jacobi
         *     eigensolver lifts the previous Phase 9B.5 numQubits === 2
         *     restriction. Shows I(Q0:Q1) in bits + nats, the computed
         *     S(AB), and the existing `mutualInformationProxy` value
         *     alongside as a *qualitative* comparison (different units).
         *   • unsupported — only reachable if a reduced ρ has
         *     significant complex Hermitian off-diagonals (a future
         *     SU(2) scenario). Currently unreachable through normal
         *     app flows; the branch stays in the codebase as a
         *     defence against future complex-Hermitian states.
         *
         * The qualitative-comparison disclaimer at the bottom is the
         * Phase 9B.5 honesty pin (unchanged): the proxy is unitless;
         * exact MI is in bits/nats; the two are NOT a numeric error bar
         * against each other.
         */
        mutualInformation: {
          label: 'Exact qubit mutual information',
          exactLabel: 'Exact within minimal qubit model',
          proxyLabel: 'Existing pedagogical proxy',
          unitlessLabel: 'unitless',
          unsupportedLabel: 'Exact MI not computed',
          unsupportedBody:
            'Pair mutual information requires a general subsystem-entropy eigensolver. The engine handles real-symmetric reduced ρ for any qubit subsystem; this notice appears only if a reduced ρ has significant complex Hermitian off-diagonals (a future SU(2) scenario).',
          computedBody:
            'I(A:B) = S(A) + S(B) − S(AB), computed via the engine’s general real-symmetric Hermitian eigensolver. S(A) and S(B) appear in the per-qubit entropy grid above; S(AB) is the joint reduced entropy on subsystem A∪B (it equals 0 for two-qubit pure states and emerges as a real number for larger reductions).',
          entropyABLabel: 'S(AB)',
          bitsLabel: 'bits',
          natsLabel: 'nats',
          qualitativeComparisonLabel: 'Qualitative comparison only',
          qualitativeComparisonBody:
            'The proxy is unitless; exact mutual information is measured in bits / nats. Treat this as a qualitative comparison — not a numeric error bar.',
        },

        /**
         * Faz 9C-2 — heatmap surfaces.
         *
         * Two visualisations sit inside the Engine Preview section:
         *   • Node entropy heatmap — a horizontal fill bar appended to
         *     each existing per-qubit entropy card. Width =
         *     `entropyBits / 1` (one bit is the maximum single-qubit
         *     entropy for any state). Visual normalisation only — not
         *     a new physics score.
         *   • Pairwise MI heatmap — an `n × n` grid of `I(Qᵢ : Qⱼ)`
         *     values. Diagonals show an em-dash (a qubit's MI with
         *     itself is undefined). Off-diagonal background tint scales
         *     with `bits / maxComputedBits`. Unsupported cells (future
         *     SU(2) only) render as "n/a".
         *
         * **Honesty pin (unchanged from Phase 9C-1).** Both heatmaps
         * surface values that are *exact within the minimal qubit
         * model* — they are NOT LQG mutual information, NOT
         * intertwiner-space correlators, NOT geometric-operator
         * expectation values. The body strings repeat the model
         * boundary so the caveat travels with the heatmap.
         */
        heatmaps: {
          entropyHeatmapLabel: 'Node entropy heatmap',
          entropyHeatmapBody:
            'Each bar visualises the single-qubit entropy in bits inside the minimal qubit model. One bit is the maximum for a qubit, so the bar is purely a visual normalisation — not a new physics score.',
          entropyFillLabel: 'Single-qubit entropy fill',
          pairwiseMiLabel: 'Exact pairwise qubit mutual information',
          pairwiseMiBody:
            'Each off-diagonal cell shows I(Qᵢ : Qⱼ) in bits inside the minimal qubit model. Background intensity scales with bits / max bits across the matrix; this is not LQG intertwiner-space mutual information.',
          diagonalLabel: '—',
          unsupportedCellLabel: 'n/a',
          qubitAxisLabel: 'Qubit axis',
          exactQubitMiLabel: 'Exact qubit MI · bits',
        },
      },

      /**
       * Faz 9E-1 — single-node SU(2) intertwiner sandbox block.
       *
       * Sits as a sibling section after the Engine Preview inside the
       * Correlation Summary panel. Surfaces the Phase 9D-2-b
       * `invariantSubspaceProjector` engine helper for a fixed list
       * of small spin tuples; renders dimensions, kept eigenvalues,
       * a spectrum preview and three projector sanity chips.
       *
       * **Honesty pin (read this before editing copy).** The sandbox
       * computes a single-node SU(2)-invariant subspace; it is NOT a
       * Bell-network state, NOT a multi-node graph state, NOT an edge
       * gluing construction, and NOT a geometric-operator (area /
       * volume / dihedral) eigenspace. UI copy must NOT call any
       * example a "Bell-network state" or describe its dimension as
       * "geometry" / "volume" / "curvature".
       */
      intertwinerSandbox: {
        label: 'Single-node SU(2) intertwiner sandbox',
        modelChip: 'single-node SU(2) model',
        intro:
          'This sandbox computes the SU(2)-invariant subspace of a single tensor-product spin node — the j_total = 0 eigenspace of the total Casimir. It is not a Bell-network state, not an edge-gluing construction, and not a geometry observable. Multi-node gluing is deferred to a future phase.',
        spinTupleLabel: 'Spin tuple',
        totalDimensionLabel: 'Total dimension',
        invariantDimensionLabel: 'Invariant dimension',
        expectedDimensionLabel: 'Expected (textbook)',
        keptIndicesLabel: 'Kept eigenvalue indices',
        keptIndicesEmpty: '—',
        spectrumPreviewLabel: 'Spectrum preview',
        spectrumPreviewEllipsis: '…',
        sanityLabel: 'Projector sanity',
        hermitianProjectorLabel: 'P† = P',
        idempotentProjectorLabel: 'P² = P',
        traceMatchesLabel: 'Tr(P) = dim',
        passLabel: 'pass',
        failLabel: 'fail',
        examples: {
          twoSpinHalf: {
            title: 'Two spin-1/2 factors',
            interpretation:
              'The textbook ½ ⊗ ½ = 0 ⊕ 1 decomposition. The single invariant basis vector is ±|singlet⟩ = ±(|↑↓⟩ − |↓↑⟩) / √2. This is a singlet sector at one node, not a Bell-network edge.',
          },
          fourSpinHalf: {
            title: 'Four spin-1/2 factors',
            interpretation:
              'The minimal 4-valent spin-1/2 node has a 2-dimensional intertwiner space. The two basis vectors span the j_total = 0 subspace of (½)⁴; their explicit form depends on the recoupling order.',
          },
          twoSpinOne: {
            title: 'Two spin-1 factors',
            interpretation:
              'The 1 ⊗ 1 = 0 ⊕ 1 ⊕ 2 decomposition has a 1-dimensional invariant subspace. The basis vector is the SU(2)-singlet of two spin-1 factors.',
          },
          spinOneTwoSpinHalf: {
            title: 'One spin-1 + two spin-1/2 factors',
            interpretation:
              'A 3-valent node with mixed spins: 1 ⊗ ½ ⊗ ½ decomposes as 0 ⊕ 1 ⊕ 1 ⊕ 2, so the invariant subspace is 1-dimensional. This is a single-node intertwiner, not a Bell-network state.',
          },
        },
      },

      /**
       * Mega Faz 9E-3 — Bell-network graph sandbox block.
       *
       * Sits as a sibling section after the Phase 9E-1 single-node
       * intertwiner sandbox inside the Correlation Summary panel.
       * Surfaces the Phase 9E-2 graph contract + per-node intertwiner
       * summaries for the three canonical spin-1/2 graphs; only the
       * two-node single-edge graph carries an explicit graph-level
       * prototype state (dipole / cycle-4 are deferred to Phase 9E-4).
       *
       * **Honesty pin (read this before editing copy).** Per-node
       * summaries are NOT graph-level Bell-network states. The
       * dipole and cycle-4 cards must NOT be described as "completed
       * Bell-network states"; they are graph contracts with
       * per-node intertwiner-space metadata. The two-node prototype
       * state IS a graph-level state but only at the smallest
       * possible scale (one spin-½ edge between two nodes); it is
       * NOT a dipole or cycle-4 state. Edge `source` / `target` are
       * bookkeeping only — UI must NOT describe them as physical
       * orientation. Higher-spin gluing, area / volume / dihedral
       * geometry, and graph-level dynamics are all out of scope at
       * this UI surface.
       */
      bellNetworkSandbox: {
        label: 'Bell-network graph sandbox',
        modelChip: 'graph contract · projected spin-1/2 states',
        intro:
          'This sandbox surfaces the canonical spin-1/2 graphs the engine knows about and their per-node SU(2)-invariant subspace summaries. Mega Phase 9E-4 adds projected graph-level states for the dipole and cycle-4 graphs (link-singlet product projected by the tensor product of per-node SU(2)-invariant projectors); the two-node single-edge graph keeps its earlier minimal prototype. No geometric-operator (area / volume / dihedral) expectation values are computed at this layer.',
        graphFactsLabel: 'Graph facts',
        nodesLabel: 'Nodes',
        edgesLabel: 'Edges',
        edgeSpinsLabel: 'Edge spins',
        parallelEdgesLabel: 'Parallel edges',
        yesLabel: 'yes',
        noLabel: 'no',
        prototypeStateLabel: 'Prototype state',
        prototypeAvailableLabel: 'available',
        prototypeDeferredLabel: 'deferred',
        prototypeKindLabel: 'Kind',
        prototypeDimensionLabel: 'Dimension',
        prototypeNormalisedLabel: 'Normalised',
        prototypeHonestyLabel: 'Honesty',
        stateRegisterLabel: 'State register',
        endpointDimensionLabel: 'Endpoint dim',
        graphInvariantDimensionLabel: 'Graph invariant dim',
        perNodeInvariantDimensionsLabel: 'Per-node invariant dims',
        normBeforeProjectionLabel: 'Pre-norm. ‖P · ⊗|S⟩‖',
        stateRegisters: {
          minimalTwoNodePrototype: 'minimal two-node prototype',
          spinHalfProjectedBellNetworkState:
            'spin-1/2 projected Bell-network state',
        },
        nodeSummariesLabel: 'Per-node intertwiner summaries',
        nodeLabel: 'Node',
        incidentEdgesLabel: 'Incident edges',
        spinTupleLabel: 'Spin tuple',
        totalDimensionLabel: 'Total dimension',
        invariantDimensionLabel: 'Invariant dimension',
        deferredReasons: {
          requiresEdgeSlotBookkeeping:
            'Graph-level state deferred — multi-edge gluing requires edge-slot bookkeeping.',
          phaseScope:
            'Graph-level state deferred — outside this phase’s scope.',
        },
        examples: {
          twoNodeSingleEdge: {
            title: 'Two-node single-edge spin-1/2 graph',
            interpretation:
              'The smallest non-trivial Bell-network graph: two nodes joined by one spin-1/2 edge. Each node carries a single spin-1/2 incident factor, so per-node total dim is 2 and invariant dim is 0 (a single spin-1/2 has no SU(2)-invariant sub-state). The graph-level prototype state is the spin-1/2 singlet on the edge, interpreted as the joint state on the two endpoint Hilbert factors. This case stays on the minimal-prototype register because the projected register requires every node to have non-zero invariant dimension.',
          },
          dipoleSpinHalf: {
            title: 'Dipole graph with four spin-1/2 edges',
            interpretation:
              'Two nodes joined by four parallel spin-1/2 edges. Each node has incident spin tuple [1/2, 1/2, 1/2, 1/2], total dim 16, and a 2-dimensional intertwiner subspace (the textbook 4-valent spin-1/2 intertwiner). The graph-level state is the link-singlet product projected onto the 4-dimensional graph invariant subspace (= 2 × 2 per-node intertwiner dimensions). No geometry operators or geometry claims are produced from this state.',
          },
          cycle4SpinHalf: {
            title: 'Cycle-4 graph with spin-1/2 edges',
            interpretation:
              'Four nodes joined by four spin-1/2 edges in a ring. Each node has incident spin tuple [1/2, 1/2], total dim 4, and a 1-dimensional intertwiner subspace (the textbook two-spin-1/2 singlet). The graph-level state is the link-singlet product projected onto the 1-dimensional graph invariant subspace; the projected state is unique up to a global phase. No geometry operators or geometry claims are produced from this state.',
          },
        },
      },
    },

    /**
     * Faz 7 — Research Notes panel content.
     *
     * Six short, source-oriented but bounded research notes that
     * connect the Lab's interactive surfaces to the Bell-network
     * research line. Each note carries a thesis, why it matters,
     * what this app currently shows, and what remains future work.
     * The content lives in the i18n tree (not a new
     * `src/data/researchNotes.ts` file) so that EN ↔ TR parity is
     * checked by the existing `validate-ui-i18n.mjs` script — no
     * change to `validate-i18n.mjs`'s closed path list is needed.
     */
    researchNotes: {
      intro:
        'Six short research notes that connect the Lab’s interactive surfaces to the Bell-network research line. Each note carries a thesis, why it matters, what this app currently shows, and what remains future work — making the boundary between explanation and computation explicit.',

      panelScopeLabel: 'Scope',
      panelScopeBody:
        'This panel is explanatory, not computational. The app does not evaluate exact LQG operator expectation values, does not compute reduced density matrices or local entanglement entropies, and does not run any automorphism algorithm. Numbers shown elsewhere in the Lab are pedagogical proxies unless explicitly stated otherwise — every diagnostic row makes its honesty class visible via a ProxyBadge.',

      noteListAria: 'Research notes',

      fields: {
        whyItMatters: 'Why it matters',
        inThisApp: 'In this app',
        futureWork: 'Future work',
      },

      notes: {
        bellNetworkGluing: {
          title: 'Bell-network states and entanglement-induced gluing',
          thesis:
            'Bell-network states are correlated superpositions on a fixed graph that encode the intuition that adjacent quantum polyhedra are "glued" across their shared faces because their face-normal degrees of freedom are entangled, not because they are constrained classically.',
          whyItMatters:
            'In loop quantum gravity, individual spin-network basis states fix face areas but leave neighbouring polyhedra essentially free — face normals on either side of a shared edge fluctuate independently. Entanglement is what connects them. The Bell-network construction captures this connection in a tractable family of states and underwrites the mental picture of "two glued polyhedra" on the dipole graph.',
          inThisApp:
            'The Gluing Diagnostics panel reads three pedagogical proxies — the canvas anti-parallel score, the gluing score, and the per-pair gluing-proxy values — that respond in the right qualitative direction when entanglement strength rises. They are not exact intertwiner-space operator expectation values. The face-area matching, Regge shape matching and node-closure rows are explicitly tagged future-calculable-observable.',
          futureWork:
            'Replacing the toy alignment / gluing pipeline with cross-face inner products of intertwiner-space normal operators would turn the gluing reading into a computable observable rather than a proxy. The future-calculable-observable rows in Gluing Diagnostics flag the gap explicitly.',
        },

        geometryHierarchy: {
          title: 'Twisted, vector and Regge geometries',
          thesis:
            'Three increasingly demanding geometric readings of the same combinatorial spin-network data sit at the centre of LQG semiclassical analysis: vector geometry asks only for back-to-back face normals; twisted geometry adds areas, shapes and extrinsic angle data; Regge geometry adds full shape-matching with dihedral consistency.',
          whyItMatters:
            'Each layer corresponds to a different semiclassical limit of the same quantum state. Vector geometry is the cheapest reading — it survives even when the underlying state has only crude coherence. Twisted and Regge geometries are richer; reaching them requires the state to encode area, shape and edge-length data consistently across the graph.',
          inThisApp:
            'The Effective Geometry panel and the canvas pipeline approximate a vector-geometry register only — through the alignment / mismatch / gluing proxy. Twisted-geometry phase-space data and Regge shape-matching constraints are explicitly tagged future-calculable-observable in the Effective Geometry diagnostic rows; the app does not compute them.',
          futureWork:
            'Phase-space data evaluation (areas, shapes, extrinsic angles) and a Regge shape-matching solver would let the Effective Geometry panel surface real readings at the twisted and Regge tiers, with their own honesty class.',
        },

        homogeneousGraphs: {
          title: 'Homogeneous graphs and automorphism invariance',
          thesis:
            'A graph is "homogeneous" in the toy LQG register when every node sits in a single orbit and every edge sits in a single orbit of the graph automorphism group. On homogeneous graphs, the natural physical observables are automorphism-invariant — one-node observables and reduced density matrices are then unambiguous probes of the state.',
          whyItMatters:
            'LQG truncations use automorphism invariance as a discrete analogue of diffeomorphism invariance — physics should not depend on which node is labelled A and which is labelled B. Homogeneous-graph states make this concrete: they are the simplest setting where "every node looks like every other node" and a one-node observable can probe the cosmological intuition without picking a preferred site.',
          inThisApp:
            'The Symmetry / Automorphism Diagnostics panel surfaces conceptual readings of node and edge orbits for the two shippable topologies (dipole, cycle-4) plus a curated classification of how each state family relates to the topology’s symmetries. No automorphism algorithm is run; the readings are author-curated text keyed by topology id.',
          futureWork:
            'Computing the automorphism group of an arbitrary topology, decomposing nodes and edges into orbits algorithmically, and evaluating one-node observables on a Bell-network state would all turn the conceptual diagnostics into calculated quantities.',
        },

        dipoleEffectiveGeometry: {
          title: 'Effective geometry on dipole graphs',
          thesis:
            'On the dipole graph — two nodes connected by four parallel edges — Bell-network states model two glued quantum polyhedra. Whether the effective geometry of the glued pair reads as a flat classical tetrahedron or as a spherical-tetrahedron deformation is the kind of question this graph motivates and the kind of distinction that depends on which observables one evaluates.',
          whyItMatters:
            'The dipole is the simplest spin-network truncation where "two glued polyhedra" is a meaningful object. It is the natural laboratory for asking how Bell-network correlations support a glued geometry, and for distinguishing a flat-tetrahedron classical limit from a curved spherical-tetrahedron reading. The cosmology-bridge intuition — that effective geometry on a small graph stands in for a coarse-grained classical geometry — finds its first concrete test here.',
          inThisApp:
            'The Effective Geometry panel surfaces a topology-specific note that frames the flat-vs-spherical distinction as a literature-oriented conceptual diagnostic. The Spherical Tetrahedron row carries a "dipole-specific" chip when the active topology is not the dipole. No flat-tetrahedron or spherical-tetrahedron expectation values are computed.',
          futureWork:
            'Evaluating curvature observables on the dipole’s Bell-network states — for instance dihedral-angle expectation values on the glued pair, or area-mismatch coefficients across the shared faces — would let the panel attach numerical readings to the two interpretations rather than describing them.',
        },

        correlations: {
          title: 'Correlations in quantum geometry and cosmology',
          thesis:
            'Correlations are central to the Bell-network research line on both ends — they are what distinguishes one state family from another at the local pair level, and they are the cosmological observable any large-graph limit would eventually compute. Pair-level correlations and graph-level homogeneity sit on a continuum; understanding the connection is half the work.',
          whyItMatters:
            'On the geometry side, correlations are how entanglement becomes "glued geometry": the cleaner the correlation pattern, the more the state reads as a coherent piece of effective geometry rather than a collection of unrelated pieces. On the cosmology side, automorphism-invariant correlations on a homogeneous graph are the toy stand-in for cosmological homogeneity — and the moments of those correlations would be what a real LQG calculation evaluates.',
          inThisApp:
            'The Correlation Summary panel surfaces three pedagogical-proxy reads — the per-pair correlation profile, the global proxy summary (anti-parallel, gluing, mutual-information proxy), and a curated state-family classification. The mutual-information proxy is a deterministic toy formula `(strengthMean × alignMean)^1.5`, not the quantum mutual information of any density matrix. Exact intertwiner-space correlators, reduced density matrices and local entanglement entropies are flagged future-calculable-observable.',
          futureWork:
            'Computing two-point functions of geometric operators (area, volume, dihedral angle) on Bell-network states, evaluating reduced density matrices on individual nodes, and extracting their entanglement entropies would all replace the toy proxies with quantities that bear quantitative physical meaning.',
        },

        proxiesToObservables: {
          title: 'From pedagogical proxies to calculable observables',
          thesis:
            'The Lab’s diagnostic rows already mark every value with one of four honesty classes. The natural research path is to convert each future-calculable-observable row into a real diagnostic: the gap between a proxy and a calculation is exactly what the labels make visible.',
          whyItMatters:
            'Honest proxies are a starting point, not a destination. The Lab’s "not computed" pills are not just disclaimers; they are a roadmap. Each one names a specific quantity (face-area matching, Regge shape matching, closure constraints, twisted-geometry phase space, one-node reduced density matrices, local entanglement entropies, exact LQG expectation values) that a future computation could ship as a real reading on the same surface.',
          inThisApp:
            'Every Lab panel today flags its gaps explicitly through the future-calculable-observable proxy kind. The honesty taxonomy (pedagogical-proxy / conceptual-diagnostic / curated-classification / future-calculable-observable) is the discipline that keeps the gap visible rather than hidden, and the Open Problems panel will collect those gaps as a single roadmap.',
          futureWork:
            'Each future-calculable-observable row is a concrete implementation target. Replacing them one by one — starting with the simplest (face-area matching on a fixed-spin graph, or one-node trace operators) — would gradually move the Lab from a pedagogical surface to a research instrument.',
        },
      },
    },

    /**
     * Faz 8 — Open Problems panel shell strings.
     *
     * Per-problem content (title, the five card fields, and the
     * `sourcePanels` cross-references) lives in
     * `src/data/openProblems.ts` as locale-keyed records. This block
     * carries only the panel chrome — intro, field labels reused
     * across all eight cards, and the `Appears in:` chip-row label.
     * Keeping shell strings in i18n + per-problem text in a data file
     * mirrors the established `topologies.ts` / `stateFamilies.ts`
     * pattern: stable structural ids in code, localised prose in
     * Record<Locale, …> records.
     */
    openProblems: {
      intro:
        'Eight Open Problems that map the gap between this app’s pedagogical proxies and the real LQG observables they approximate. Each card reads as a research-paper abstract — what the real observable would be, what the app currently surfaces instead, what physics is missing, why it matters, and a forward-looking research direction.',

      problemListAria: 'Open Problems',
      sourcePanelsLabel: 'Appears in',

      fields: {
        realObservable: 'Real observable',
        proxyUsed: 'Proxy used in app',
        missingPhysics: 'Missing physics',
        whyItMatters: 'Why it matters',
        researchDirection: 'Research direction',
      },
    },

    panels: {
      gluing: {
        label: 'Gluing Diagnostics',
        shortGoal:
          'Per-pair and aggregate signals for entanglement-induced gluing across shared faces.',
        placeholder:
          'Future panel: per-pair gluing scores re-read as proxies, aggregate gluing strength, and a deliberate split between the toy alignment proxy and a calculable cross-face inner product.',
      },
      symmetry: {
        label: 'Symmetry / Automorphism',
        shortGoal:
          'How well the active state respects the graph automorphism group of the chosen topology.',
        placeholder:
          'Future panel: automorphism group of the active topology, equivalence-class report, and a conceptual diagnostic for whether the state is symmetric, partially symmetric, or symmetry-breaking.',
      },
      effectiveGeometry: {
        label: 'Effective Geometry',
        shortGoal:
          'Vector-geometry vs Regge-geometry semiclassical reads on the same combinatorial data.',
        placeholder:
          'Future panel: side-by-side vector-geometry vs Regge-geometry summaries, the spherical-tetrahedron reading on the dipole, and a per-node twisted-geometry sketch.',
      },
      correlations: {
        label: 'Correlation Summary',
        shortGoal:
          'Pair-by-pair correlation table and the aggregate proxy for how localised or spread the family is.',
        placeholder:
          'Future panel: a 4×4 pair-correlation matrix with per-cell proxy badges, aggregate spread / localisation tags, and a one-node entanglement-entropy proxy.',
      },
      researchNotes: {
        label: 'Research Notes',
        shortGoal:
          'Curated, author-maintained notes mapping each Lab diagnostic to its closest LQG literature.',
        placeholder:
          'Future panel: a curated-classification index of named claims (Bell-network states, entanglement-induced gluing, vector vs Regge geometry, dipole effective geometry, correlations and cosmology) with short pointers, no original physics.',
      },
      openProblems: {
        label: 'Open Problems',
        shortGoal:
          'Quantities the Lab could compute honestly but does not yet — flagged so the gap is visible.',
        placeholder:
          'Future panel: a list of future-calculable observables — one-node entropy, intertwiner correlators, automorphism-invariant moments, Regge-vs-vector mismatch — each tagged with what would be needed to ship it honestly.',
      },
    },
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
