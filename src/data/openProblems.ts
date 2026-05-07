import type { Locale } from '../i18n/types';
import type { LabPanelId } from '../types/lab';

/**
 * Faz 8 — Open Problems data source.
 *
 * Eight curated entries that map the gap between this app's pedagogical
 * proxies and the real LQG observables they approximate. Each problem
 * is rendered by `OpenProblemsPanel` as a research-paper-abstract-style
 * card with five labelled sub-fields (real observable / proxy used in
 * app / missing physics / why it matters / research direction).
 *
 * The data is structurally cross-referenced — every problem lists the
 * `LabPanelId`s where the corresponding `future-calculable-observable`
 * row already surfaces in the diagnostic Lab panels. This is the spirit
 * of the user-spec'd "auto-generated from diagnostics" requirement: the
 * problems are not literally synthesised at runtime from a row registry
 * (that would require refactoring the diagnostic panels into a metadata
 * pipeline, which is out of scope for Faz 8) but each problem id is
 * explicitly anchored to the panels where it appears, so the Lab forms
 * a coherent research-program graph.
 *
 * **Honesty discipline.** This file does not claim that any of the
 * `realObservable` quantities are computed by the app. Every entry's
 * `proxyUsed` field names the actual Lab surface (or its omission), and
 * the `missingPhysics` field names the conceptual gap. The
 * `researchDirection` field is forward-looking — phrased in conditional
 * / imperative form, never as a current state.
 *
 * Per project policy, technical LQG terms (SU(2), SU(1,1), intertwiner,
 * Regge, twisted, dipole, holonomy, density matrix, Hamiltonian, etc.)
 * stay in English in both locales; surrounding sentence structure in
 * the `tr` copy is Turkish.
 */

/* ------------------------------------------------------------------ */
/*  Public types                                                       */
/* ------------------------------------------------------------------ */

/**
 * Closed set of Open Problem ids. Ordering here drives the on-screen
 * order of the cards in `OpenProblemsPanel`.
 */
export type OpenProblemId =
  | 'shapeMatching'
  | 'closureConstraint'
  | 'reducedDensityMatrix'
  | 'longRangeCorrelations'
  | 'effectiveGeometryReconstruction'
  | 'cosmologicalSectorMapping'
  | 'harmonicCosmology'
  | 'semiclassicalMoments';

export const OPEN_PROBLEM_IDS: readonly OpenProblemId[] = [
  'shapeMatching',
  'closureConstraint',
  'reducedDensityMatrix',
  'longRangeCorrelations',
  'effectiveGeometryReconstruction',
  'cosmologicalSectorMapping',
  'harmonicCosmology',
  'semiclassicalMoments',
];

/**
 * Resolved Open Problem at a given locale. Matches the user-spec'd
 * shape one-to-one — `id`, `title`, `sourcePanels`, `realObservable`,
 * `proxyUsed`, `missingPhysics`, `whyItMatters`, `researchDirection`.
 */
export interface OpenProblem {
  /** Stable id, also used as the React key in the panel list. */
  id: OpenProblemId;
  /** Short title for the card heading. */
  title: string;
  /** Lab panel ids whose `future-calculable-observable` rows correspond
   *  to this problem. Drives the `Appears in` chip row on each card. */
  sourcePanels: readonly LabPanelId[];
  /** What the real LQG observable is — phrased as a description, not as
   *  something the app computes. */
  realObservable: string;
  /** What the app currently surfaces in place of that observable
   *  (typically a pedagogical proxy or an explicit omission). */
  proxyUsed: string;
  /** The conceptual gap between proxy and real observable — what would
   *  need to exist in the app's data model. */
  missingPhysics: string;
  /** Research motivation — why the gap matters in the LQG line of work. */
  whyItMatters: string;
  /** Forward-looking implementation pointer, phrased as imperative or
   *  conditional, never as a current state. */
  researchDirection: string;
}

/* ------------------------------------------------------------------ */
/*  Internal records (locale-keyed copy)                               */
/* ------------------------------------------------------------------ */

interface OpenProblemCopy {
  title: string;
  realObservable: string;
  proxyUsed: string;
  missingPhysics: string;
  whyItMatters: string;
  researchDirection: string;
}

interface OpenProblemRecord {
  id: OpenProblemId;
  sourcePanels: readonly LabPanelId[];
  copy: Record<Locale, OpenProblemCopy>;
}

const RAW_PROBLEMS: readonly OpenProblemRecord[] = [
  {
    id: 'shapeMatching',
    sourcePanels: ['gluing', 'effectiveGeometry'],
    copy: {
      en: {
        title: 'Shape Matching Constraints',
        realObservable:
          'Shape-matching constraints across shared faces — paired faces in a glued spin-network state should not only have the same area but also the same shape (matching edge lengths and dihedral angles), the condition that distinguishes a Regge-geometry state from a generic twisted-geometry state.',
        proxyUsed:
          'The Lab surfaces an alignment / mismatch / gluing pedagogical proxy in the Gluing Diagnostics and Effective Geometry panels — a back-to-back face-normal reading that approximates vector geometry only, not full shape matching.',
        missingPhysics:
          'Face shape (edge-length data) and per-edge dihedral consistency are not represented in the toy state. The pipeline tracks one direction per face pair, not the full 2D face shape, so Regge consistency cannot be evaluated.',
        whyItMatters:
          'Without shape matching, glued tetrahedra describe a twisted-geometry state — locally consistent but globally non-Regge. Recovering classical Regge geometry from a Bell-network state in the semiclassical limit requires shape matching to hold (or approach holding) on every pair simultaneously.',
        researchDirection:
          'Add a per-face shape variable (edge-length tuple or 2D shape parameter) to the toy data structure. Compute shape-mismatch metrics across paired faces and surface a true Regge-violation diagnostic alongside the existing alignment proxy.',
      },
      tr: {
        title: 'Shape Matching Kısıtları',
        realObservable:
          'Paylaşılan yüzlerde shape-matching kısıtları — bir glue edilmiş spin-network state’inde eşleşen yüzler yalnız aynı alana değil aynı şekle de (eşleşen edge length’leri ve dihedral angle’ları) sahip olmalıdır; bu, bir Regge-geometry state’ini genel bir twisted-geometry state’inden ayıran koşuldur.',
        proxyUsed:
          'Lab, Gluing Diagnostics ve Effective Geometry panellerinde bir alignment / mismatch / gluing pedagojik proxy’si yüzeyler — yalnız vector geometry’ye yaklaşan, full shape matching’e değil, sırt sırta face-normal okuması.',
        missingPhysics:
          'Face shape (edge-length verisi) ve edge başına dihedral tutarlılık toy state’te temsil edilmiyor. Pipeline her face pair için tek bir yön izliyor, full 2D face shape’i değil; dolayısıyla Regge tutarlılığı değerlendirilemez.',
        whyItMatters:
          'Shape matching olmadan glue edilmiş tetrahedra twisted-geometry state’i tarif eder — yerel olarak tutarlı ama global olarak Regge değil. Bell-network state’inden klasik Regge geometry’yi yarı-klasik limitte geri kazanmak, shape matching’in her pair üzerinde aynı anda geçerli olmasını (ya da yaklaşıkça geçerli olmasını) gerektirir.',
        researchDirection:
          'Toy data yapısına yüz başına bir shape değişkeni (edge-length tuple veya 2D shape parametresi) ekle. Eşleşen yüzler arasında shape-mismatch metrikleri hesapla ve mevcut alignment proxy’sinin yanına gerçek bir Regge-violation diagnostic’i yüzeyle.',
      },
    },
  },

  {
    id: 'closureConstraint',
    sourcePanels: ['gluing', 'symmetry'],
    copy: {
      en: {
        title: 'Closure Constraint at Each Node',
        realObservable:
          'SU(2) closure at every node — the gauge constraint that the sum of face normals weighted by face area vanishes. In LQG this defines the intertwiner space at each node and is what makes a node a valid quantum polyhedron.',
        proxyUsed:
          'The Lab does not surface a closure indicator at all. Gluing Diagnostics flags closure as `not computed` in its future-calculable-observable row, and Symmetry Diagnostics treats node-orbit equivalence as a conceptual diagnostic without checking the underlying gauge condition.',
        missingPhysics:
          'The state is not represented as a vector in an SU(2)-invariant intertwiner space; node-level gauge invariance is implicit in the toy presentation rather than enforced. There is no orthogonal projection onto the intertwiner subspace.',
        whyItMatters:
          'Closure is what selects valid quantum polyhedra from the unconstrained tensor product of edge representations. A Bell-network state that violates closure does not correspond to a kinematical LQG state at all — it lives outside the physical Hilbert space.',
        researchDirection:
          'Introduce an SU(2)-invariant intertwiner basis at each node and project the toy correlation pattern onto it. Surface the residual norm as a `closure violation` diagnostic, with `closure-respecting` as the trivial-violation case.',
      },
      tr: {
        title: 'Her Düğümde Closure Constraint',
        realObservable:
          'Her node’da SU(2) closure — face normal’larının face area’larıyla ağırlıklı toplamının sıfır olması koşulu. LQG’de bu koşul her node’daki intertwiner uzayını tanımlar ve bir node’u geçerli bir quantum polyhedron yapan şeydir.',
        proxyUsed:
          'Lab hiç closure göstergesi yüzeylemiyor. Gluing Diagnostics closure’ı future-calculable-observable satırında `not computed` olarak işaretler ve Symmetry Diagnostics node-orbit eşdeğerliğini, alttaki gauge koşulunu kontrol etmeden conceptual diagnostic olarak ele alır.',
        missingPhysics:
          'State, SU(2)-değişmez bir intertwiner uzayında bir vektör olarak temsil edilmiyor; node düzeyinde gauge invariance toy sunumda zımni — açıkça uygulanmıyor. Intertwiner alt-uzayına bir ortogonal projeksiyon yok.',
        whyItMatters:
          'Closure, kenar temsillerinin kısıtlanmamış tensor product’ından geçerli quantum polyhedra’ları seçer. Closure’ı ihlal eden bir Bell-network state, kinematik bir LQG state’ine karşılık gelmez bile — fiziksel Hilbert uzayının dışında yaşar.',
        researchDirection:
          'Her node’da bir SU(2)-değişmez intertwiner basis tanımla ve toy korelasyon örüntüsünü bunun üzerine projekte et. Geriye kalan normu bir `closure violation` diagnostic’i olarak yüzeyle; trivial-violation durumu `closure-respecting` olur.',
      },
    },
  },

  {
    id: 'reducedDensityMatrix',
    sourcePanels: ['correlations', 'symmetry'],
    copy: {
      en: {
        title: 'Reduced Density Matrix and Entanglement Entropy',
        realObservable:
          'The one-node reduced density matrix obtained by tracing the Bell-network state over all degrees of freedom outside a chosen node, plus its von Neumann entropy. On homogeneous graphs this is the natural symmetry-invariant entanglement probe.',
        proxyUsed:
          'The Correlation Summary panel surfaces a deterministic mutual-information proxy `(strengthMean × alignMean)^1.5` and a global gluing score, both pedagogical-proxy. Neither is computed from a density matrix; both are functions of the four-knob configuration with no Hilbert-space content.',
        missingPhysics:
          'The toy has no density matrix to trace — the Bell-network state is not represented as a vector or operator on a tensor product of edge / node Hilbert spaces. Entanglement entropy therefore has no place to live in the current data flow.',
        whyItMatters:
          'Local entanglement entropy is the central observable connecting Bell-network correlations to cosmological homogeneity in the homogeneous-graph line of work. Without a real reduced density matrix, statements about entanglement structure on the graph remain narrative, not numerical.',
        researchDirection:
          'Implement an explicit intertwiner-space representation of the chosen state family (at least for the dipole), construct the one-node reduced density matrix by tracing over the partner node, and compute its von Neumann entropy as a node-level scalar diagnostic.',
      },
      tr: {
        title: 'Reduced Density Matrix ve Entanglement Entropy',
        realObservable:
          'Bell-network state’i, seçilen bir node dışındaki tüm serbestlik dereceleri üzerinden trace edilerek elde edilen tek-düğüm reduced density matrix’i ve onun von Neumann entropy’si. Homogeneous graph’larda bu, doğal symmetry-invariant entanglement probu’dur.',
        proxyUsed:
          'Correlation Summary paneli deterministik bir mutual-information proxy’si `(strengthMean × alignMean)^1.5` ve bir global gluing skoru yüzeyler — her ikisi de pedagogical-proxy. İkisi de bir density matrix’ten hesaplanmaz; ikisi de Hilbert-uzayı içeriği olmayan dört-düğme konfigürasyonunun fonksiyonlarıdır.',
        missingPhysics:
          'Toy’un trace edilecek bir density matrix’i yok — Bell-network state’i edge / node Hilbert uzaylarının tensor product’ı üzerinde bir vektör veya operator olarak temsil edilmiyor. Entanglement entropy mevcut data akışında yaşayacak yer bulamaz.',
        whyItMatters:
          'Local entanglement entropy, Bell-network korelasyonlarını cosmological homogeneity’ye bağlayan, homogeneous-graph çalışma hattının merkezindeki observable’dır. Gerçek bir reduced density matrix olmadan, graph üzerindeki entanglement yapısı hakkındaki ifadeler sayısal değil, anlatımsal kalır.',
        researchDirection:
          'Seçilen state family’nin (en az dipole için) açık intertwiner-uzayı temsilini implement et, partner node üzerinden trace alarak tek-düğüm reduced density matrix’i kur ve onun von Neumann entropy’sini bir node-level scalar diagnostic olarak hesapla.',
      },
    },
  },

  {
    id: 'longRangeCorrelations',
    sourcePanels: ['correlations'],
    copy: {
      en: {
        title: 'Long-Range Correlation Build-Up',
        realObservable:
          'Time evolution of two-point correlation functions across distant face pairs — how correlations build up under a chosen Hamiltonian or projector dynamics, and how the correlation length scales with graph size.',
        proxyUsed:
          'The Lab is fully static. Pair-level toy values are computed from the four-knob configuration in a single pass; no dynamics, no propagation, no time variable enters the pipeline. Correlation Summary’s reads are snapshot reads.',
        missingPhysics:
          'Dynamics. There is no Hamiltonian, no Schrödinger evolution, no projector / spinfoam amplitude. The four-knob configuration is treated as a frozen labelling of a state, not a starting point for an evolution problem.',
        whyItMatters:
          'Cosmological correlations in LQG are inherently dynamical — the cosmological homogeneity that homogeneous-graph states model is a fixed point of an evolution, not a static configuration. Without dynamics, the gap from quantum geometry to cosmology cannot even be approached numerically.',
        researchDirection:
          'Introduce a discrete time parameter and a chosen toy Hamiltonian (e.g. a graph-Laplacian-based generator). Track how an initial product state evolves into a correlated Bell-network state under that dynamics, and surface the correlation build-up as a per-pair time series.',
      },
      tr: {
        title: 'Uzun Erimli Korelasyonların Oluşumu',
        realObservable:
          'Uzak face pair’lar arası iki-nokta korelasyon fonksiyonlarının zaman evrimi — seçilen bir Hamiltonian veya projector dynamics altında korelasyonların nasıl kurulduğu ve korelasyon uzunluğunun graph boyutu ile nasıl ölçeklendiği.',
        proxyUsed:
          'Lab tamamen statik. Pair düzeyi toy değerleri dört-düğme konfigürasyonundan tek geçişte hesaplanır; pipeline’a hiçbir dinamik, propagation veya zaman değişkeni girmez. Correlation Summary’nin okumaları snapshot okumalarıdır.',
        missingPhysics:
          'Dinamik. Hamiltonian yok, Schrödinger evrimi yok, projector / spinfoam genliği yok. Dört-düğme konfigürasyonu, bir evrim probleminin başlangıç noktası olarak değil, bir state’in donmuş etiketlemesi olarak ele alınır.',
        whyItMatters:
          'LQG’de cosmological korelasyonlar doğası gereği dinamiktir — homogeneous-graph state’lerinin modellediği cosmological homogeneity, statik bir konfigürasyon değil bir evrimin sabit noktasıdır. Dinamik olmadan, quantum geometry’den cosmology’ye olan boşluk sayısal olarak yaklaşılamaz bile.',
        researchDirection:
          'Bir ayrık zaman parametresi ve seçilen bir toy Hamiltonian (ör. graph-Laplacian tabanlı bir generator) ekle. Başlangıç bir product state’in bu dinamik altında nasıl korele bir Bell-network state’ine evrildiğini izle ve korelasyon birikimini pair başına bir zaman serisi olarak yüzeyle.',
      },
    },
  },

  {
    id: 'effectiveGeometryReconstruction',
    sourcePanels: ['effectiveGeometry'],
    copy: {
      en: {
        title: 'Effective Geometry Reconstruction',
        realObservable:
          'Expectation values of geometric operators — area, volume, dihedral angle — on the Bell-network state, evaluated as exact functionals of the intertwiner-space representation rather than read off heuristic labels.',
        proxyUsed:
          'The Effective Geometry panel reads the canvas anti-parallel and gluing scores as a vector-geometry pedagogical proxy, plus topology-keyed conceptual notes (flat vs spherical tetrahedron). The flat-vs-spherical distinction is presented descriptively; no operator expectation is evaluated.',
        missingPhysics:
          'Geometric operators are not implemented. There is no area operator, no volume operator, no dihedral-angle operator acting on a state vector. The reconstruction-of-classical-geometry problem cannot be posed numerically without them.',
        whyItMatters:
          'Whether the effective geometry of a Bell-network state on the dipole reads as a flat tetrahedron, a spherical tetrahedron, or something else depends on which expectation values one evaluates. The literature-oriented narrative the panel currently surfaces is exactly the question a real calculation would settle.',
        researchDirection:
          'Implement an area operator and a volume operator acting on the dipole’s intertwiner-space representation. Compute their expectation values on the active state family and surface deviations from the flat-tetrahedron prediction as a `curvature signature` diagnostic.',
      },
      tr: {
        title: 'Effective Geometry Reconstruction',
        realObservable:
          'Bell-network state’i üzerinde geometric operator beklenti değerleri — alan, hacim, dihedral angle — heuristik etiketlerden okunmak yerine intertwiner-uzayı temsiliyle exact functional’lar olarak değerlendirilen.',
        proxyUsed:
          'Effective Geometry paneli, canvas anti-parallel ve gluing skorlarını bir vector-geometry pedagogical proxy olarak okur, ek olarak topology-anahtarlanmış conceptual notlar (flat vs spherical tetrahedron). Flat-vs-spherical ayrımı betimleyici olarak sunulur; hiçbir operator beklentisi değerlendirilmez.',
        missingPhysics:
          'Geometric operator’lar implement edilmemiş. Bir state vektörü üzerine etki eden area operator yok, volume operator yok, dihedral-angle operator yok. Klasik geometry’nin reconstruction’ı problemi onlar olmadan sayısal olarak konulamaz.',
        whyItMatters:
          'Dipole üzerindeki bir Bell-network state’inin effective geometry’sinin flat tetrahedron, spherical tetrahedron veya başka bir şey olarak okunması, hangi beklenti değerlerinin değerlendirildiğine bağlıdır. Panelin şu an yüzeylediği literatür-yönelimli anlatım, gerçek bir hesabın çözeceği soruyla tam olarak aynıdır.',
        researchDirection:
          'Dipole’un intertwiner-uzayı temsilinde etki eden bir area operator ve bir volume operator implement et. Aktif state family üzerinde beklenti değerlerini hesapla ve flat-tetrahedron öngörüsünden sapmaları bir `curvature signature` diagnostic’i olarak yüzeyle.',
      },
    },
  },

  {
    id: 'cosmologicalSectorMapping',
    sourcePanels: ['symmetry', 'correlations'],
    copy: {
      en: {
        title: 'Cosmological Sector Mapping',
        realObservable:
          'The map from a homogeneous-graph spin-network state to a sector of homogeneous / isotropic LQG cosmology — the truncation that turns symmetric Bell-network states into a cosmological-state ansatz with calculable correlators.',
        proxyUsed:
          'The Lab’s two shippable topologies (dipole, cycle-4) are presented as "symmetric graph presets", and the Bell-symmetric family is curated as "uniform Bell-like correlation pattern". Symmetry Diagnostics describes node-orbit equivalence conceptually.',
        missingPhysics:
          'There is no formal map. The label "homogeneous" is applied to graphs that satisfy a structural condition (single node orbit, single edge orbit), but no cosmological reduction is performed; nothing translates the toy state into a cosmological-state Hilbert space.',
        whyItMatters:
          'The whole rationale for studying small homogeneous spin networks in the Bell-network research line is the hope that cosmological dynamics emerges from such states in the appropriate limit. Without an explicit reduction map, the cosmological framing remains motivational rather than predictive.',
        researchDirection:
          'Specify a reduction procedure (symmetric-state superselection, group averaging, or coherent-state ansatz) that takes a Bell-network state on a homogeneous graph and outputs a state in a cosmological mini-superspace Hilbert space. Surface the residual non-cosmological content as a `non-homogeneous remainder`.',
      },
      tr: {
        title: 'Cosmological Sector Mapping',
        realObservable:
          'Homogeneous-graph spin-network state’inden homogeneous / isotropic LQG cosmology’nin bir sektörüne harita — simetrik Bell-network state’lerini hesaplanabilir korelatorlara sahip bir cosmological-state ansatz’ına çeviren truncation.',
        proxyUsed:
          'Lab’in iki shippable topology’si (dipole, cycle-4) "symmetric graph preset" olarak sunulur ve Bell-symmetric family "uniform Bell-like correlation pattern" olarak küratörlenir. Symmetry Diagnostics node-orbit eşdeğerliğini conceptual olarak betimler.',
        missingPhysics:
          'Resmi bir harita yok. "Homogeneous" etiketi, yapısal bir koşulu sağlayan graph’lara (tek node orbit, tek edge orbit) uygulanır ama hiçbir cosmological reduction yapılmaz; toy state’i bir cosmological-state Hilbert uzayına çeviren hiçbir şey yok.',
        whyItMatters:
          'Bell-network araştırma hattında küçük homogeneous spin network’ler çalışmanın tüm gerekçesi, uygun limitte böyle state’lerden cosmological dynamics’in ortaya çıkacağı umududur. Açık bir reduction haritası olmadan, cosmological çerçeveleme öngörücü değil motivasyonel kalır.',
        researchDirection:
          'Bir homogeneous graph üzerindeki Bell-network state’ini bir cosmological mini-superspace Hilbert uzayında bir state’e çıkaran bir reduction prosedürü (symmetric-state superselection, group averaging veya coherent-state ansatz) belirle. Geriye kalan non-cosmological içeriği bir `non-homogeneous remainder` olarak yüzeyle.',
      },
    },
  },

  {
    id: 'harmonicCosmology',
    sourcePanels: ['effectiveGeometry'],
    copy: {
      en: {
        title: 'Harmonic Cosmology and Bounce Dynamics',
        realObservable:
          'SU(1,1) cosmological dynamics — the symmetry algebra that organises homogeneous LQG cosmological states and supports bounce-like solutions, plus its action on Bell-network-derived cosmological states.',
        proxyUsed:
          'The Lab does not surface harmonic-cosmology content at all. The "cosmology" framing in the Bridge module and the Research Notes panel is conceptual, with no SU(1,1) generator, no bounce indicator, no cosmological time variable in any data flow.',
        missingPhysics:
          'The cosmological symmetry algebra is not implemented. There is no SU(1,1) representation, no Casimir, no orbit structure, and no Hamiltonian whose flow would produce bounce dynamics on the dipole’s reduced state space.',
        whyItMatters:
          'Bounce-replacing-singularity is one of the most concrete predictions LQG cosmology offers. Connecting Bell-network states to that prediction requires turning the harmonic-cosmology algebra into an operator that acts on the toy state — without it, the bounce stays a literature claim outside the Lab.',
        researchDirection:
          'Embed the dipole’s reduced state space into an SU(1,1) representation. Implement the harmonic-cosmology Hamiltonian and trace bounce-like trajectories of an initial Bell-symmetric state through the resulting effective dynamics.',
      },
      tr: {
        title: 'Harmonic Cosmology ve Bounce Dynamics',
        realObservable:
          'SU(1,1) cosmological dynamics — homogeneous LQG cosmological state’lerini düzenleyen ve bounce-benzeri çözümleri destekleyen simetri cebiri, ek olarak Bell-network kaynaklı cosmological state’ler üzerindeki etkisi.',
        proxyUsed:
          'Lab harmonic-cosmology içeriği yüzeylemiyor. Bridge modülünde ve Research Notes panelinde "cosmology" çerçevelemesi conceptual’dır; hiçbir SU(1,1) generator’ı, bounce göstergesi veya cosmological zaman değişkeni hiçbir data akışında yer almaz.',
        missingPhysics:
          'Cosmological simetri cebiri implement edilmemiş. SU(1,1) temsili yok, Casimir yok, orbit yapısı yok ve dipole’un reduced state space’i üzerinde bounce dynamics üretecek bir Hamiltonian yok.',
        whyItMatters:
          'Bounce-singularity-yerine LQG cosmology’nin sunduğu en somut öngörülerden biridir. Bell-network state’lerini bu öngörüye bağlamak, harmonic-cosmology cebirini toy state üzerinde etki eden bir operator’a çevirmeyi gerektirir — onsuz bounce, Lab’in dışında bir literatür iddiası olarak kalır.',
        researchDirection:
          'Dipole’un reduced state space’ini bir SU(1,1) temsiline gömün. Harmonic-cosmology Hamiltonian’ını implement et ve başlangıç Bell-symmetric state’inin oluşan effective dynamics altında bounce-benzeri yörüngelerini izle.',
      },
    },
  },

  {
    id: 'semiclassicalMoments',
    sourcePanels: ['effectiveGeometry', 'correlations'],
    copy: {
      en: {
        title: 'Semiclassical Truncation and Higher Moments',
        realObservable:
          'Higher-order quantum moments of geometric operators on a Bell-network state — variances, skewnesses, three-point functions — and their semiclassical truncation that defines an effective phase space with controlled corrections.',
        proxyUsed:
          'The Lab surfaces only first-order pedagogical-proxy reads (mean alignment, mean gluing, mutual-information proxy). No second moment is computed, no variance, no skewness; the displayed numbers are point estimates with no spread information attached.',
        missingPhysics:
          'Quantum moments. The toy pipeline computes scalar functions of the configuration but does not represent the state as anything from which higher moments could be extracted. There is no phase-space variable, no canonical pair, no commutator.',
        whyItMatters:
          'Semiclassical analysis of LQG states proceeds by truncating the moment hierarchy at finite order — keeping enough moments to capture quantum corrections but few enough to remain tractable. Without higher moments, the semiclassical limit cannot be approached systematically.',
        researchDirection:
          'Define a phase-space pair (e.g. area / extrinsic-angle on each face) and compute first and second moments on the active state family. Truncate the moment hierarchy at a chosen order and surface the truncation error as a `semiclassical residual` diagnostic.',
      },
      tr: {
        title: 'Semiclassical Truncation ve Yüksek Momentler',
        realObservable:
          'Bell-network state’i üzerinde geometric operator’ların yüksek-mertebeden quantum momentleri — varyanslar, çarpıklıklar, üç-nokta fonksiyonları — ve kontrollü düzeltmelerle bir effective phase space tanımlayan semiclassical truncation’ları.',
        proxyUsed:
          'Lab yalnız birinci-mertebe pedagogical-proxy okumaları yüzeyler (ortalama alignment, ortalama gluing, mutual-information proxy). İkinci moment hesaplanmaz, varyans yok, çarpıklık yok; gösterilen sayılar yayılım bilgisi taşımayan nokta tahminleridir.',
        missingPhysics:
          'Quantum momentler. Toy pipeline konfigürasyonun skalar fonksiyonlarını hesaplar ama state’i, daha yüksek momentlerin çıkarılabileceği bir şey olarak temsil etmez. Phase-space değişkeni yok, kanonik çift yok, commutator yok.',
        whyItMatters:
          'LQG state’lerinin semiclassical analizi moment hiyerarşisini sonlu mertebede truncate ederek ilerler — quantum düzeltmeleri yakalamaya yetecek kadar moment tutmak, izlenebilir kalmaya yetecek kadar az tutmak. Yüksek momentler olmadan, semiclassical limite sistematik olarak yaklaşılamaz.',
        researchDirection:
          'Bir phase-space çifti (ör. her face üzerinde area / extrinsic-angle) tanımla ve aktif state family üzerinde birinci ve ikinci momentleri hesapla. Moment hiyerarşisini seçilen bir mertebede truncate et ve truncation hatasını bir `semiclassical residual` diagnostic’i olarak yüzeyle.',
      },
    },
  },
];

/* ------------------------------------------------------------------ */
/*  Locale projection                                                  */
/* ------------------------------------------------------------------ */

function project(record: OpenProblemRecord, locale: Locale): OpenProblem {
  const c = record.copy[locale];
  return {
    id: record.id,
    sourcePanels: record.sourcePanels,
    title: c.title,
    realObservable: c.realObservable,
    proxyUsed: c.proxyUsed,
    missingPhysics: c.missingPhysics,
    whyItMatters: c.whyItMatters,
    researchDirection: c.researchDirection,
  };
}

const BY_LOCALE: Record<Locale, readonly OpenProblem[]> = {
  en: RAW_PROBLEMS.map((r) => project(r, 'en')),
  tr: RAW_PROBLEMS.map((r) => project(r, 'tr')),
};

const LOOKUP: Record<Locale, Record<OpenProblemId, OpenProblem>> = {
  en: BY_LOCALE.en.reduce<Record<OpenProblemId, OpenProblem>>(
    (acc, p) => ({ ...acc, [p.id]: p }),
    {} as Record<OpenProblemId, OpenProblem>,
  ),
  tr: BY_LOCALE.tr.reduce<Record<OpenProblemId, OpenProblem>>(
    (acc, p) => ({ ...acc, [p.id]: p }),
    {} as Record<OpenProblemId, OpenProblem>,
  ),
};

/** Canonical Open Problem list at a given locale, in `OPEN_PROBLEM_IDS` order. */
export function getOpenProblems(locale: Locale): readonly OpenProblem[] {
  return BY_LOCALE[locale];
}

/** Single Open Problem by id at a given locale. */
export function getOpenProblem(id: OpenProblemId, locale: Locale): OpenProblem {
  return LOOKUP[locale][id];
}
