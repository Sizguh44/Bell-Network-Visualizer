import type { UiStrings } from './en';

/**
 * Turkish UI string table.
 *
 * Çeviri ilkesi: belirli teknik fizik terimleri (spin network, Bell-network,
 * face pair, gluing, anti-parallel alignment, state family, observable lens,
 * dipole graph, cycle graph, vector geometry, Regge geometry, intertwiner,
 * automorphism, homogeneity, cosmology, loop quantum gravity, Hilbert space,
 * SU(2), polyhedron, cohesion, mismatch angle, alignment score, gluing proxy)
 * İngilizce kalır. Bu terimlerin etrafındaki cümle yapısı tamamen Türkçedir.
 */
export const TR: UiStrings = {
  language: {
    label: 'Dil',
    en: 'English',
    tr: 'Türkçe',
    switchTo: (name: string) => `${name} diline geç`,
    current: (name: string) => `Mevcut dil: ${name}`,
  },

  header: {
    eyebrow: (topology: string) => `Loop Quantum Gravity · ${topology}`,
    title: 'Bell-Network Visualizer',
    subtitle:
      'Küçük spin network’lerde entanglement ve glued-face geometry için bir toy model — state family’ler, observable lens’ler, pair bazlı inceleme.',
    howToUse: 'Nasıl kullanılır',
    howToUseTitle: 'Başlangıç kılavuzunu göster',
    atlas: 'Atlas',
    atlasTitle: 'Concept Atlas’ı aç',
    library: 'Kütüphane',
    libraryTitle: 'İçerik Kütüphanesini aç',
    badgeToy: 'Toy LQG demosu',
    badgeStatic: 'Statik · Etkileşimli',
    metaAria: 'Proje meta verileri ve mod',
    openInAtlasTitle: 'Concept Atlas’ta aç',
  },

  modes: {
    group: 'Uygulama modu',
    explore: {
      label: 'Explore',
      hint: 'Dört düğmeyle serbest deney',
    },
    learn: {
      label: 'Learn',
      hint: 'Önerilen yol — 8 rehberli lesson ve checkpoint',
    },
    challenge: {
      label: 'Challenge',
      hint: 'Anlayışını sına — 10 Sokratik görev',
    },
    bridge: {
      label: 'Bridge',
      hint: 'Graph düzeyi ve cosmology üzerine düşünme — 7 reflection',
    },
    lab: {
      label: 'Geometry Lab',
      hint:
        'Araştırma yüzeyi — gluing, symmetry, effective geometry · bu sürümde iskelet',
    },
  },

  controls: {
    title: 'Kontroller',
    topology: 'Graph topology',
    topologyAria: 'Graph topology',
    stateFamily: 'State family',
    stateFamilyAria: 'State family',
    observableLens: 'Observable lens',
    observableLensAria: 'Observable lens',
    strengthLabel: 'Entanglement strength',
    demoModeLabel: 'Demo modu',
    demoModeAria: 'Demo modunu aç/kapat',
    reset: 'Family varsayılanlarına dön',
    cleanStart: 'Temiz başlangıç',
    cleanStartTitle:
      'Mode, topology, family, strength, lens ve seçimi sıfırla — kaydedilen ilerleme korunur',
    resetHint:
      'Temiz başlangıç yalnız keşif yüzeyini sıfırlar; açılmış lesson ve challenge’lar kalır. İlerlemeyi de silmek istersen aşağıdaki bağlantıyı kullan.',
    resetProgress: 'Tüm ilerlemeyi sıfırla',
    resetProgressTitle:
      'Lesson checkpoint’leri, challenge cevapları, ayarlar ve onboarding durumu silinir',
    resetProgressConfirm:
      'Her şey sıfırlansın mı — lesson checkpoint’leri, challenge cevapları, tüm ayarlar ve onboarding durumu? Bu işlem geri alınamaz.',
    note:
      'State family korelasyon örüntüsünü belirler; observable lens bu örüntünün hangi yönünün görselde ve kartlarda vurgulanacağını seçer. Aşağıdaki sayılar gerçek fiziksel observable’lar değil, toy proxy’lerdir.',
    openAtlas: 'Concept Atlas’ı aç →',
  },

  visualization: {
    sceneEyebrow: 'Sahne',
    statusDemoOff: 'demo kapalı',
    statusFamilySuffix: 'family',
    hoverHint: 'İncelemek için bir face pair’ın üzerine gel veya tıkla',
    dipoleCanvasAria:
      'Dipole graph: iki düğüm arasında dört etkileşimli face-normal pair’ı',
    cycleCanvasAria:
      'Cycle graph: halka üzerinde dört düğüm ve dört etkileşimli face pair',
    facePairAria: (index: number, selected: boolean) =>
      `Face pair ${index}${selected ? ', seçili' : ''}`,
    statEntanglementStrength: 'Entanglement strength',
    statEntanglementHint: 'Kaydırıcı kontrolü (0 → 1)',
    statAntiParallel: 'Anti-parallel skoru',
    statAntiParallelHint: 'Ortalama pair seviyesinde alignment',
    statMutualInformation: 'Mutual information',
    statMutualInformationHint: 'Toy proxy, süperlineer',
    statGluingScore: 'Gluing skoru',
    statGluingScoreHint: 'Aligned × cohesive × strong',
  },

  legend: {
    aria: 'Gösterge',
    colourLead: 'Her renk bir',
    colourTail: '(kenar + iki normal) temsil eder.',
    facePairEmphasis: 'face pair',
    emphasisLead: 'Aktif lens altında yüksek vurgu daha',
    emphasisBold: 'kalın çizgiler',
    emphasisTail: 've daha yüksek opaklık demektir.',
    hoverLead: 'İzole etmek için',
    hoverBold: 'Üzerine gel veya tıkla',
    hoverTail: ' — boş alana tıkla sıfırlanır.',
  },

  summary: {
    lensEyebrow: 'Observable lens',
    viewSuffix: 'görünümü',
    statusAria: (status: string) => `Durum: ${status}`,
  },

  summaryStatus: {
    strong: 'güçlü',
    mixed: 'karışık',
    weak: 'zayıf',
    low: 'düşük',
    moderate: 'orta',
    high: 'yüksek',
    fragile: 'kırılgan',
    uniform: 'homojen',
    spread: 'dağınık',
    localized: 'yerelleşmiş',
    sparse: 'seyrek',
  },

  summaryInterpretations: {
    alignmentStrong: 'Dört pair da anti-parallel konumlanmaya yakın yönleniyor.',
    alignmentMixed: 'Ortalama alignment fena değil ama pair’lar arasında düzensiz.',
    alignmentWeak:
      'Pair’ların çoğu anti-parallel’den uzak — glued polyhedra görüntüsü zor oluşuyor.',
    mismatchLow:
      'Her pair kendi ideal anti-parallel partnerine yakın duruyor.',
    mismatchModerate:
      'Ortalamada belirgin bir açısal sapma var; bir-iki pair hâlâ temiz görünebilir.',
    mismatchHigh:
      'Geniş açısal mismatch — normal vektörler eşlerinden uzaklaşıyor.',
    mismatchCaution:
      'Bir pair ortalamadan çok daha sapkın — onu doğrudan incelemekte fayda var.',
    gluingStrong: 'Birleşik "glued polyhedra" görüntüsü ikna edici.',
    gluingMixed:
      'Kısmi gluing desteği — bazı pair’lar sezgiyi taşıyor, bazıları taşımıyor.',
    gluingFragile:
      'Gluing görüntüsü zayıf; düzeltmek için güçlü korelasyon gerekli.',
    correlationUniform:
      'Korelasyon dört pair arasında eşit dağılmış.',
    correlationSpread:
      'Pair bazında hafif varyasyon — family bazı pair’ları ölçülü biçimde kayırıyor.',
    correlationLocalized:
      'Korelasyon pair’ların bir alt kümesinde yoğunlaşıyor.',
    uniformityUniform:
      'Tüm pair’lar benzer davranıyor — family simetrik.',
    uniformityMixed:
      'Pair’lar tam örtüşmüyor; family kendi içinde yapıya sahip.',
    uniformitySparse:
      'Pair davranışları kuvvetle birbirinden ayrışıyor — bu simetrik bir family değil.',
  },

  summarySecondary: {
    cohesion: 'cohesion',
    peakPair: 'tepe pair',
    pairRange: 'pair aralığı',
    alignmentSigma: 'alignment σ',
  },

  edgeDetail: {
    titleSuffix: ' görünümü',
    titlePrefix: 'Face Pair Detayı — ',
    emptyHeadline: 'Seçili pair yok',
    emptyHint:
      'Önizleme için canvas’taki dört pair’dan birinin üzerine gel; yerel metrikleri sabitlemek için tıkla.',
    family: 'Family',
    pinned: 'seçili',
    hoverMode: 'hover',
    clear: 'Temizle',
    localStrength: 'Yerel strength',
    mismatchAngle: 'Mismatch açısı',
    alignmentScore: 'Alignment score',
    gluingProxy: 'Gluing proxy',
    deviationLabel: 'Family ortalama alignment’tan sapma',
    footnote:
      'Mismatch açısı, family’nin kenar bazlı gürültü katsayısının yerel strength ile ölçeklenmesinden gelir; kalan proxy’ler buradan türetilir.',
  },

  startHere: {
    aria: 'Buradan başla',
    eyebrow: 'Buradan başla',
    dismissAria: 'Başlangıç kılavuzunu kapat',
    dismissTitle: 'Kapat',
    title: 'Hoş geldin — üç giriş yolu',
    lede:
      'Küçük spin network’lerde entanglement ve glued-face geometry için etkileşimli bir toy model. Aşağıdan bir giriş yolu seç — istediğin an header’dan modlar arasında geçiş yapabilirsin.',
    guidedTag: 'Rehberli',
    guidedName: 'Learn ile başla',
    guidedBody:
      'Her birinde uygulanmış setup ve checkpoint bulunan sekiz kısa lesson. Eğer dipole graph ve Bell-network sözlüğü sana yeniyse önerilen yol budur.',
    guidedAction: 'Lesson 1’i aç →',
    freeTag: 'Serbest',
    freeName: 'Serbestçe keşfet',
    freeBody:
      'Kenar çubuğundaki dört düğmeyi — topology, state family, strength, observable lens — oynat ve canvas’ın tepkisini izle. İncelemek için bir face pair’a gel veya tıkla.',
    freeAction: 'Keşfetmeye devam et',
    referenceTag: 'Referans',
    referenceName: 'Concept Atlas’ı aç',
    referenceBody:
      'On yedi kavram girdisi — kısa tanımlar, uygulamadaki anlamı, tam teoride ne anlama geldiği. Bir lesson’da tanımadığın bir terime rastladığında işe yarar.',
    referenceAction: 'Kavramlara göz at',
    footnote:
      'İlerlemen, ayarların ve seçili pair yerel olarak kaydedilir. Belirli bir setup’ı paylaşmak için mevcut URL’yi kopyalayabilirsin.',
  },

  lesson: {
    aria: (title: string) => `Lesson: ${title}`,
    progress: (order: number, total: number) => `Lesson ${order} / ${total}`,
    conceptsAria: 'Bu lesson’daki kavramlar (atlas’ta açmak için tıkla)',
    openInAtlas: (label: string) => `"${label}" kavramını Concept Atlas’ta aç`,
    actionLabel: 'Eylem',
    applySetup: 'Lesson setup’ını uygula',
    applied: 'Uygulandı ✓',
    checkpointAria: 'Checkpoint sorusu',
    checkpointLabel: 'Checkpoint',
    optionsAria: 'Cevap seçenekleri',
    reveal: 'Açıklamayı göster',
    whyLabel: 'Neden',
    nextStepLabel: 'Sıradaki adım',
    nextStepAria: 'Önerilen sonraki adımlar',
    tryItTag: 'Deneyebilirsin',
    goDeeperTag: 'Daha derine',
    navAria: 'Lesson navigasyonu',
    prev: '← Önceki',
    next: 'Sonraki →',
    iconCorrect: 'doğru',
    iconIncorrect: 'yanlış',
  },

  challenge: {
    aria: (title: string) => `Challenge: ${title}`,
    introLabel: 'Challenge modu',
    introFlow: 'Setup uygula · canvas’ı incele · cevapla · üzerine düşün',
    empty: 'Aktif challenge yok.',
    progress: (order: number, total: number) => `Challenge ${order} / ${total}`,
    completedCount: (n: number) => `${n} açıldı`,
    promptLabel: 'Soru',
    applySetup: 'Challenge setup’ını uygula',
    applied: 'Uygulandı ✓',
    expectedLabel: 'Beklenen gözlem',
    answerLabel: 'Cevabın',
    answerAria: 'Cevap',
    yourAnswer: 'Cevabın',
    optionsAria: 'Cevap seçenekleri',
    check: 'Cevabı kontrol et',
    explanationLabel: 'Açıklama',
    relatedAria: 'İlgili materyal',
    relatedConcepts: 'İlgili kavramlar',
    relatedLessons: 'İlgili lesson’lar',
    lessonOrder: (order: number) => `Lesson ${order}`,
    navAria: 'Challenge navigasyonu',
    prev: '← Önceki',
    next: 'Sonraki →',
    openInAtlas: (label: string) => `"${label}" kavramını Concept Atlas’ta aç`,
    difficulty: {
      intro: 'giriş',
      core: 'temel',
      advanced: 'ileri',
    },
    type: {
      prediction: 'tahmin',
      comparison: 'karşılaştırma',
      diagnosis: 'tanı',
      conceptual: 'kavramsal',
    },
  },

  bridge: {
    aria: (title: string) => `Bridge lesson: ${title}`,
    introLabel: 'Cosmology bridge',
    introFlow: 'Yerel gluing · graph simetrisi · cosmology düşüncesi',
    empty: 'Aktif bridge lesson yok.',
    progress: (order: number, total: number) => `Bridge ${order} / ${total}`,
    keyIdea: 'Ana fikir',
    commonConfusion: 'Sık yapılan karışıklık',
    actionLabel: 'Eylem',
    applySetup: 'Önerilen setup’ı uygula',
    applied: 'Uygulandı ✓',
    reflectionAria: 'Reflection soruları',
    reflectionLabel: 'Reflection',
    reflectionNote:
      'Bu soruların checkpoint’i yok. Bilerek açık uçlu — amaç not almak değil, üzerine düşünmek.',
    relatedAria: 'İlgili materyal',
    relatedConcepts: 'İlgili kavramlar',
    relatedLessons: 'İlgili lesson’lar',
    relatedChallenges: 'İlgili challenge’lar',
    lessonOrder: (order: number) => `Lesson ${order}`,
    challengeOrder: (order: number) => `Challenge ${order}`,
    navAria: 'Bridge lesson navigasyonu',
    prev: '← Önceki',
    next: 'Sonraki →',
  },

  callouts: {
    key: 'Ana fikir',
    confusion: 'Sık yapılan karışıklık',
    inDemo: 'Bu demoda',
    inTheory: 'Tam teoride',
  },

  atlas: {
    aria: 'Concept Atlas',
    eyebrow: 'Concept Atlas',
    close: 'Concept Atlas’ı kapat',
    heading: 'Bir kavramı ara',
    subheading:
      'Kavram-merkezli referans — tanımadığın bir terime rastladığında Atlas’ı aç; kısa tanımı, uygulamadaki anlamıyla tam teorideki anlamının karşılaştırmasını, ve bu kavrama dokunan her lesson / challenge / bridge girdisini tek yerde gör.',
    searchPlaceholder: 'Kavram ara…',
    searchAria: 'Kavram ara',
    back: '← Atlas’a dön',
    emptyResults: 'Bu aramaya uyan kavram bulunamadı. Farklı bir terim dene.',
    whyItMatters: 'Neden önemli',
    inThisApp: 'Bu uygulamada',
    inFullTheory: 'Tam teoride',
    commonConfusion: 'Sık yapılan karışıklık',
    relatedConcepts: 'İlgili kavramlar',
    appearsInLessons: 'Geçtiği lesson’lar',
    drillWithChallenges: 'Challenge’larla pekiştir',
    cosmologyBridge: 'Cosmology bridge',
    alsoAppearsIn: 'Bu kavrama başka nerede rastlarsın',
    alsoAppearsInNote:
      'Yukarıda açıkça önerilenlerin dışında, bu kavramın geçtiği diğer yerler.',
    lessonNote: 'Learn modunda açılır.',
    challengeNote: 'Challenge modunda açılır.',
    bridgeNote: 'Bridge modunda açılır.',
    lessonOrder: (order: number) => `Lesson ${order}`,
    challengeOrder: (order: number) => `Challenge ${order}`,
    bridgeOrder: (order: number) => `Bridge ${order}`,
  },

  library: {
    aria: 'İçerik Kütüphanesi',
    eyebrow: 'İçerik Kütüphanesi',
    close: 'İçerik Kütüphanesini kapat',
    heading: 'Tüm içeriğe göz at',
    subheading:
      'İçerik-merkezli indeks — tüm lesson, challenge, bridge lesson ve glossary girdisinin aranabilir tek listesini görmek istediğinde Kütüphane’yi aç.',
    statsTemplate: (l: number, c: number, b: number, g: number) =>
      `${l} lesson · ${c} challenge · ${b} bridge lesson · ${g} glossary girdisi`,
    categoriesAria: 'İçerik kategorileri',
    searchAria: 'Aktif sekmede ara',
    searchPlaceholder: (tab: string) => `${tab} içinde ara…`,
    empty: 'Aramaya uyan bir şey yok. Farklı bir terim dene.',
    tabs: {
      lessons: 'Lesson’lar',
      challenges: 'Challenge’lar',
      bridge: 'Bridge',
      glossary: 'Glossary',
    },
    tagLesson: (order: number) => `Lesson ${order}`,
    tagChallenge: (order: number) => `Challenge ${order}`,
    tagBridge: (order: number) => `Bridge ${order}`,
    tagConcept: 'Kavram',
  },

  lab: {
    aria: 'Geometry Lab',
    eyebrow: 'Bell-Network Geometry Lab',
    heading: 'Geometry Lab — araştırma yüzeyi',
    subheading:
      'Bell-network state’lerinde entanglement, graph simetrisi ve korelasyonları effective-geometry sinyalleri olarak okuyacak diagnostic’lere ayrılmış mod. Bu sürüm Lab’ı iskelet olarak ship eder — altı placeholder paneli ve bir scope notu. Gerçek diagnostic’ler sonraki fazlarda gelir.',

    scopeNoteLabel: 'Kapsam notu',
    scopeNoteBody:
      'Bu mod şu an yalnız placeholder yüzeyleri çiziyor. Gelecek paneller pedagojik proxy’ler, conceptual diagnostic’ler, curated classification’lar ve future calculable observable’lar taşıyacak — her biri görünür bir proxy badge ile etiketlendiği için dürüstlük sınıfı asla gizlenmez.',

    /**
     * Faz 6.5 demo-off banner. Yapı EN ile birebir aynı.
     */
    demoOff: {
      label: 'Demo mode kapalı',
      body: 'Demo mode kapalı. Entanglement strength’e bağlı pedagogical proxy değerleri sıfır etkin strength ile gösteriliyor.',
    },

    panelSwitcherAria: 'Geometry Lab paneli',
    activePanelAria: (label: string) => `${label} paneli`,

    placeholderLabel: 'Placeholder',
    laterPhaseLabel: 'Sonraki faz',
    sampleProxyLabel: 'Hedeflenen dürüstlük sınıfı',
    sampleProxyHint:
      'Örnek rozet — Faz 2 yalnız taksonomiyi gösterir, gerçek çıktıları değil.',

    proxyKinds: {
      'pedagogical-proxy': {
        short: 'pedagogical proxy',
        title:
          'Doğru nitel yönde tepki veren ama gerçek bir LQG niceliğini hesaplamayan toy formül.',
      },
      'conceptual-diagnostic': {
        short: 'conceptual diagnostic',
        title:
          'Yapısal bir özelliğin niteliksel okuması — evet / hayır / zayıf / güçlü — ciddiye alınacak bir sayı değil.',
      },
      'curated-classification': {
        short: 'curated classification',
        title:
          'Yazarın koruduğu sabit bir kümeden seçilmiş ayrık etiket. Küme sayılabilir olduğu için dürüsttür.',
      },
      'future-calculable-observable': {
        short: 'future calculable observable',
        title:
          'Bir Bell-network state’inden dürüstçe hesaplanabilir olabilen ama şu an yalnız eskizi bulunan nicelik — boşluk gizlenmesin diye etiketlenir.',
      },
    },

    /**
     * Faz 3 — Gluing Diagnostics paneli içeriği. Panelin gösterdiği her
     * görünür string burada; sayısal değerler render anında canonical
     * pipeline’dan okunur ve çevrilmez. Yapı EN ile birebir aynı —
     * `validate-ui-i18n.mjs` parity’yi doğrular.
     */
    gluing: {
      intro:
        'Pair’lar arasındaki gluing, bu uygulamanın etrafında kurulduğu merkezi LQG-cosmology sezgisidir. Giderek sıkılaşan üç geometrik koşul — twisted, vector, Regge — “glued polyhedra” fikrinin farklı parçalarını yakalar. Bu panel mevcut pedagojik pipeline’ı bu hiyerarşi üzerinden okur ve nerede durduğu konusunda dürüsttür.',

      hierarchy: {
        label: 'Geometrik hiyerarşi',
        twisted: {
          name: 'Twisted geometry',
          definition:
            'Komşu polyhedra alanları paylaşır, ancak komşu face shape’leri ve normal’leri eşleşmek zorunda değildir.',
          inThisApp:
            'Bu uygulama face-shape verisi hesaplamaz; her kenardaki paylaşılan spin = ½, her pair için alanların eşleşmesini kendiliğinden sağlar — ama bu topology’nin tanımsal sonucudur, bir diagnostic değil.',
        },
        vector: {
          name: 'Vector geometry',
          definition:
            'Daha sıkı koşul: her paylaşılan yüzde iki normal sırt sırta (anti-parallel) durur.',
          inThisApp:
            'Visualizer’ın şu an yaklaşık olarak tuttuğu rejim budur. Toy alignment / mismatch / gluing pipeline’ı, bir vector-geometry okuması için pedagogical-proxy’dir.',
        },
        regge: {
          name: 'Regge geometry',
          definition:
            'Üçünün en sıkısı: glue edilen iki yüzün şekilleri eşleşmelidir — yalnız aynı alan ve back-to-back normal değil, aynı kenar uzunlukları da.',
          inThisApp:
            'Bu uygulama Regge shape-matching kısıtlarını çözmez. Aşağıda future-calculable-observable olarak işaretlenir.',
        },
      },

      diagnostics: {
        label: 'Diagnostic’ler',
        rowsAria: 'Gluing diagnostic satırları',
        notComputedLabel: 'hesaplanmıyor',
        rows: {
          antiParallel: {
            title: 'Anti-parallel normal alignment',
            body: 'Dört face pair üzerindeki ortalama alignment — bir vector-geometry pedagojik proxy’si.',
            proxyNote:
              '`antiParallelScore` değerini canvas pipeline’ından okur; bir LQG operator beklentisi değildir.',
          },
          gluingCoherence: {
            title: 'Gluing coherence across face pairs',
            body: 'Pair bazlı gluing proxy’lerinin tek sayı olarak ne kadar tutarlı olduğunu okur.',
            proxyNote:
              '`gluingScore` değerini okur — canvas’ın stat kartında halihazırda gösterdiği aynı değer.',
          },
          faceAreaMatching: {
            title: 'Face-area matching',
            body: 'Twisted geometry, paylaşılan yüzler arasında alanların eşleşmesini ister.',
            proxyNote:
              'Hesaplanmıyor. Face-area operator beklenti değerleri bu uygulamada değerlendirilmiyor.',
          },
          shapeMatching: {
            title: 'Shape matching / Regge condition',
            body: 'Regge geometry, paylaşılan yüzlerin şekillerinin eşleşmesini ister — yalnız aynı alan değil, aynı kenar uzunlukları da.',
            proxyNote:
              'Hesaplanmıyor. Hiçbir Regge shape-matching kısıtı çözülmüyor.',
          },
          closure: {
            title: 'Closure constraint at each node',
            body: 'Quantum polyhedron için closure (Σ face normals = 0, alanla ağırlıklı) tanım gereği bir değişmezliktir.',
            proxyNote:
              'Hesaplanmıyor. Düğüm bazlı closure observable’ı değerlendirilmiyor.',
          },
        },
      },

      pairTable: {
        label: 'Pair bazlı pedagogical-proxy değerleri',
        caption:
          'Değerler canvas pipeline’ını birebir yansıtır — Face Pair Detayı kartındaki aynı sayılar, burada gluing lens’i üzerinden sunulur.',
        columns: {
          pair: 'Pair',
          localStrength: 'Yerel strength',
          mismatch: 'Mismatch',
          alignment: 'Alignment',
          gluing: 'Gluing proxy',
        },
      },

      limitations: {
        label: 'Sınırlar',
        aria: 'Bu panelin sınırları',
        items: [
          'Bu uygulama şu an pedagojik bir vector-geometry proxy’si görselleştiriyor.',
          'Tam twisted-geometry phase-space verisi hesaplamıyor.',
          'Regge shape-matching koşullarını çözmüyor.',
          'Tam LQG intertwiner observable’ları değerlendirmiyor.',
          'Düğümlerde closure constraint’i uygulamıyor.',
        ],
      },

      howToRead: {
        label: 'Bu paneli nasıl okumalı',
        body: 'pedagogical-proxy etiketli diagnostic satırları, mevcut toy pipeline’dan gelen sayıları gösterir — canvas’ın halihazırda kullandığı aynı değerler, yalnız dürüstlük sınıfıyla etiketlenmiş halde. future-calculable-observable etiketli satırlar bilinçli olarak hiçbir sayı göstermez: bu uygulama ile gerçek bir LQG hesabı arasındaki boşluk gizlenmek değil, görünür kılınmak içindir.',
      },
    },

    /**
     * Faz 4 — Symmetry / Automorphism Diagnostics paneli içeriği. Yapı
     * EN ile birebir aynı; `validate-ui-i18n.mjs` parity’yi doğrular.
     * Curated symmetry okumaları ayrı bir data dosyasına değil, doğrudan
     * burada tutulur — kullanıcıya görünen prose i18n’in yapacağı işin
     * tam tanımıdır.
     */
    symmetry: {
      intro:
        'Graph simetrisi, küçük bir spin network’ün ilişkisiz parçaların toplamı yerine tutarlı bir geometri parçası gibi okunmasını sağlayan şeydir. LQG truncation’larında automorphism invariance, ayrık bir diffeomorphism-benzeri tutarlılığın rolünü oynar; homogeneous-graph state’leri ise node ve edge eşdeğerliğine bakmamızı motive eder. Bu panel, aktif topology ve state family’nin bu fikirlerle nasıl ilişkilendiğine dair conceptual bir okuma sunar — full automorphism grubunu hesaplamaz.',

      context: {
        label: 'Graph automorphism — burada ne anlama geliyor',
        body: 'Bir graph automorphism, graph’ın yapısını değiştirmeyen bir yeniden etiketlemedir: aynı node kümesi, aynı kenarlar, aynı bağlantı, sadece isimlendirme farklı. Homogeneous bir graph’ta her node tek bir orbitte ve her kenar tek bir orbitte yer alır, dolayısıyla etiketler bağlantının ötesinde bilgi taşımaz. LQG graph truncation’ları automorphism invariance’ı diffeomorphism invariance’ın ayrık karşılığı olarak kullanır — fiziğin hangi etiketin hangisi olduğuna bağlı olmaması gerekir. Bu panel aktif topology’i ve state family’i bu lens üzerinden conceptual olarak okur; grubu veya orbitleri tek tek listelemez.',
      },

      topologyReading: {
        label: 'Topology symmetry okuması',
        activeAria: 'Aktif topology symmetry okuması',
        readings: {
          dipole: {
            headline: 'Dipole — iki düğüm / dört kenar simetri sezgisi',
            body: 'Dört paralel kenarla bağlanmış iki düğüm. Doğal automorphism’lar A↔B düğüm değişimi ile dört kenarın keyfi permütasyonlarıdır; node eşdeğerliği ve edge eşdeğerliğinin ikisinin de geçerli olduğu en sade non-trivial yapıdır. Bu kavramsal olarak tek bir node orbiti ve tek bir edge orbiti üretir — graph, toy anlamda homogeneous’tur.',
          },
          cycle4: {
            headline: 'Cycle-4 — cyclic / dihedral simetri sezgisi',
            body: 'Ring üzerinde dört düğüm. Doğal automorphism’lar dihedral grup D₄’tür: dört cyclic rotasyon ve dört yansıma. Kavramsal olarak dört node eşdeğerdir ve dört kenar eşdeğerdir, dolayısıyla ring toy anlamda homogeneous’tur ve aynı state family korelasyonlarını tek bir polyhedron pair üzerinde yoğunlaştırmak yerine ring boyunca uzamsal olarak yayar.',
          },
        },
      },

      familyReading: {
        label: 'State-family symmetry okuması',
        activeAria: 'State-family curated sınıflandırmaları',
        activeChipLabel: 'aktif',
        classifications: {
          uncorrelated: {
            headline: 'Symmetry-neutral baseline',
            body: 'Entanglement-kaynaklı yapı yokken, state’in tercih ettiği bir yön de yoktur ve her topology automorphism’ına trivially saygı gösterir. Kıracak bir pattern olmadığı için kırılacak bir simetri de yoktur.',
          },
          weakAligned: {
            headline: 'Kısmen hizalı, zayıf symmetry-uyumlu',
            body: 'Dört pair neredeyse eşit mismatch katsayıları ve küçük, eşit yayılan strength offset’leri alır. State, topology’nin simetrisine kilitlenmeden işaret eder — pair eşdeğerliği korunur ama yalnız zayıf biçimde ifade edilir.',
          },
          bellSymmetric: {
            headline: 'Symmetry-respecting, near-uniform',
            body: 'Mismatch katsayıları dört pair arasında neredeyse eşittir (hepsi küçük, alternatif işaretli) ve strength offset’ler çok küçüktür. Bu family, dipole’un S₂ × S₄ yapısına ve cycle-4’ün D₄ yapısına deterministik bir toy’un yapabileceği en temiz biçimde saygı göstermek üzere tasarlanmıştır.',
          },
          frustrated: {
            headline: 'Deliberately symmetry-breaking, non-uniform',
            body: 'İki pair küçük mismatch katsayısı, iki pair büyük katsayı alır. Family pair’ların bir alt kümesini açıkça öne çıkarır — pair eşdeğerliği yapı gereği kırılmıştır; bu da onu aynı global strength’te symmetric family ile karşılaştırılabilir, yararlı bir referans yapar.',
          },
          edgeBiased: {
            headline: 'Edge-selected asymmetry',
            body: 'Strength offset’ler ve mismatch katsayıları öyle eğilmiştir ki iki pair güçlü destek, iki pair zayıf destek alır. Pair eşdeğerliği seçilmiş bir alt küme lehine kasıtlı olarak kırılır — homogeneous değil, lokalize bir korelasyon.',
          },
        },
      },

      diagnostics: {
        label: 'Diagnostic’ler',
        rowsAria: 'Symmetry diagnostic satırları',
        notComputedLabel: 'hesaplanmıyor',
        rows: {
          topologySymmetry: {
            title: 'Topology symmetry okuması',
            body: 'Aktif topology’i conceptual bir simetri lens’i üzerinden okur — hangi tür automorphism’lara izin verdiğini ve node ile edge orbitlerini nasıl düşünmek gerektiğini anlatır.',
            proxyNote:
              'Conceptual diagnostic. Hesaplanmış bir automorphism grubu değil; okuma iki shippable topology için kürasyonlu yazılmıştır.',
          },
          nodeEquivalence: {
            title: 'Node eşdeğerliği sezgisi',
            body: 'Topology’nin her düğümü değiştirilebilir olarak görüp görmediği. Dipole’da iki düğüm tek bir orbit oluşturur. Cycle-4’te dört düğüm tek bir orbit oluşturur. Toy graph register’ında "homogeneous" bunu ifade eder.',
            proxyNote:
              'Conceptual diagnostic. Uygulama orbit hesaplamaz — okumalar iki shippable topology için kürasyonludur.',
          },
          edgeOrbit: {
            title: 'Face-pair / edge orbit sezgisi',
            body: 'Dört face pair’ın tek bir denklik sınıfında mı yoksa alt kümelere mi ayrıldığı. Cevap hem topology’ye (orbit yapısı) hem de aktif state family’ye (state bu yapıya saygı gösteriyor mu, kırıyor mu) bağlıdır.',
            proxyNote:
              'Conceptual diagnostic. Hesaplanmış bir orbit ayrışımı değil; panel bunu aktif state-family dizilerinin yapısal pattern’ından okur.',
          },
          familyClassification: {
            title: 'State-family symmetry sınıflandırması',
            body: 'Her state family’nin topology’nin simetrileriyle nasıl ilişkilendiğine dair kürasyonlu okuma — symmetry-respecting, kısmen saygılı, ya da symmetry-breaking. Aktif family yukarıdaki okumalarda öne çıkarılmıştır.',
            proxyNote:
              'Curated classification. Beş okuma, sabit bir kümeden seçilmiş yazar-koruyumlu etiketlerdir; matematik tüketici olduğu için değil, küme sayılabilir olduğu için dürüsttür.',
          },
          fullAutomorphism: {
            title: 'Full automorphism-group computation',
            body: 'Gerçek bir hesaplama, aktif topology’nin simetri grubunu listeler, node ve kenarları orbitlere açıkça ayırır, ardından aktif state’in bu orbitlere saygı gösterip göstermediğini kontrol ederdi.',
            proxyNote:
              'Hesaplanmıyor. Hiçbir graph automorphism algoritması çalıştırılmıyor; yukarıdaki conceptual okumalar iki shippable topology için elle yazılmıştır.',
          },
          oneNodeObservables: {
            title: 'Automorphism-invariant one-node observables',
            body: 'Homogeneous-graph ve cosmological-state çizgisine bağlanır; tek bir düğüm üzerindeki one-node observables ve reduced density matrices doğal symmetry-invariant problardır.',
            proxyNote:
              'Hesaplanmıyor. Uygulama one-node observable cebirlerini veya reduced density matrices’i değerlendirmez.',
          },
        },
      },

      limitations: {
        label: 'Sınırlar',
        aria: 'Bu panelin sınırları',
        items: [
          'Bu uygulama full graph automorphism grubunu hesaplamaz.',
          'Node veya edge orbitlerini algoritmik olarak listelemez.',
          'One-node observables veya reduced density matrices değerlendirmez.',
          'State-family symmetry okumaları sabit bir kümeden seçilmiş kürasyonlu etiketlerdir, teorem değildir.',
          'Topology symmetry çerçevelemesi conceptual’dır, kanıt değildir.',
        ],
      },

      howToRead: {
        label: 'Bu paneli nasıl okumalı',
        body: 'conceptual-diagnostic etiketli satırlar niteliksel okumalar taşır — evet / kısmen / hayır, simetrik / kırık — sezgi vermek içindir, ciddiye alınacak bir sayı değil. curated-classification etiketli satırlar sabit, yazar-koruyumlu bir kümeden seçilmiş etiketler gösterir; küme sayılabilir olduğu için dürüsttür. future-calculable-observable etiketli satırlar bilinçli olarak hiçbir değer göstermez: gerçek bir automorphism-group hesabına ya da one-node observable cebirine olan boşluk gizlenmek değil, görünür kılınmak içindir.',
      },
    },

    /**
     * Faz 5 — Effective Geometry Summary paneli içeriği. Yapı EN ile
     * birebir aynı; `validate-ui-i18n.mjs` parity’yi doğrular. Sayısal
     * değerler render anında canonical pipeline’dan okunur ve
     * çevrilmez; kavramsal okumalar ve karşılaştırma metinleri burada
     * yaşar.
     */
    effectiveGeometry: {
      intro:
        'Bell-network state’leri entanglement-destekli gluing yapıları olarak okunabilir, ama taşıdıkları "geometri" otomatik olarak klasik düz bir tetrahedron ile aynı şey değildir. Effective geometry, eldeki veriyle hangi geometrik okumanın dürüst olduğunu sorar. Bu panel, aktif konfigürasyonu vector → twisted → Regge hiyerarşisinin içine yerleştirir ve hangi okumaların pedagojik proxy, hangilerinin conceptual diagnostic, hangilerinin uygulamanın henüz yapmadığı hesaplamalar olduğu konusunda açık konuşur.',

      hierarchy: {
        label: 'Effective geometry — bu panel ne okuyor',
        body: 'Aynı kombinatoryal verinin giderek talepkâr üç geometrik okuması burada işe yarar. **Vector geometry** en ucuzudur: yalnız her paylaşılan yüzde sırt sırta normal’ler ister — bu, canvas’taki alignment / mismatch / gluing proxy’nin tam olarak izlediği şeydir. **Twisted geometry** daha zengindir — her yüzde alan, şekil ve extrinsic angle gibi tam phase-space verisi ister. **Regge geometry** en talepkâr olanıdır — paylaşılan yüzlerin şekillerinin eşleşmesini ve her kenarda dihedral tutarlılığı talep eder. Uygulama şu an vector-geometry register’ında yaşar; aşağıdaki twisted ve Regge satırları, henüz yapmadığı şeyi tam olarak işaretler.',
      },

      comparison: {
        label: 'Vector vs twisted vs Regge geometry',
        aria: 'Vector, twisted ve Regge geometry karşılaştırma kartları',
        columns: {
          asksFor: 'Ne talep eder',
          thisApp: 'Bu uygulama şu an ne gösterir',
        },
        cards: {
          vector: {
            name: 'Vector geometry',
            asksFor:
              'Her paylaşılan yüzde sırt sırta komşu face normal’ler — pair başına tek bir yön-eşleştirme koşulu.',
            thisApp:
              'Canvas pipeline’ından gelen pedagojik alignment / mismatch / gluing proxy. Exact bir vector-geometry constraint çözümü değil.',
          },
          twisted: {
            name: 'Twisted geometry',
            asksFor:
              'Her yüzde tam phase-space üzerinde area variables, shape variables ve extrinsic angle verisi.',
            thisApp:
              'Hesaplanmıyor. Uygulama twisted-geometry phase-space verisini değerlendirmez.',
          },
          regge: {
            name: 'Regge geometry',
            asksFor:
              'Paylaşılan yüzlerin şekilleri eşleşmeli — aynı kenar uzunlukları ve her kenarda dihedral tutarlılık.',
            thisApp:
              'Hesaplanmıyor. Uygulama Regge shape-matching kısıtlarını çözmez.',
          },
        },
      },

      topologyNote: {
        label: 'Topology-specific not',
        activeAria: 'Aktif topology effective-geometry notu',
        notes: {
          dipole: {
            headline: 'Dipole — flat vs spherical tetrahedron okuması',
            body: 'Dipole graph — dört paralel kenarla bağlanmış iki düğüm — bu uygulamada iki glue edilmiş quantum polyhedron’u, Bell-network gluing’i ve dipole effective-geometry okumalarını tartışmak için doğal yerdir. İki glue edilmiş polyhedron’un effective geometry’sinin düz bir klasik tetrahedron olarak mı yoksa eğri bir spherical-tetrahedron deformasyonu olarak mı okunmasının daha uygun olduğu, tam da bu graph’ın motive ettiği soru türüdür.',
            followUp:
              'Spherical tetrahedron yorumu, uygulamanın gerçekleştirdiği bir hesaplama olarak değil, literatür-yönelimli bir conceptual diagnostic olarak okunmalıdır.',
          },
          cycle4: {
            headline: 'Cycle-4 — tekrarlayan pair yapısı',
            body: 'Cycle-4 graph — ring üzerindeki dört düğüm ve dört paylaşılan face pair — tekrarlayan pair yapısı ve cyclic / dihedral sezgi için işe yarar. Aynı state family korelasyonlarını tek bir polyhedron pair’ında yoğunlaştırmak yerine ring boyunca uzamsal olarak yayar.',
            followUp:
              'Bu panel cycle-4’e dipole-specific bir spherical-tetrahedron okuması atfetmez — o diagnostic yapı gereği yalnız dipole için kalır.',
          },
        },
      },

      diagnostics: {
        label: 'Diagnostic’ler',
        rowsAria: 'Effective geometry diagnostic satırları',
        notComputedLabel: 'hesaplanmıyor',
        dipoleSpecificLabel: 'dipole-specific',
        rows: {
          vectorGeometryProxy: {
            title: 'Vector-geometry proxy',
            body: 'Canvas anti-parallel alignment skorunu okur — paylaşılan yüzler arasında sırt sırta face normal’ler için pedagojik proxy.',
            proxyNote:
              '`antiParallelScore` değerini canvas pipeline’ından okur; exact bir vector-geometry constraint çözümü değil ve bir LQG operator beklentisi değildir.',
          },
          effectiveGluingTendency: {
            title: 'Effective gluing tendency',
            body: 'Canvas gluing skorunu okur — aktif strength ve family altında dört pair’ın tek bir glue edilmiş polyhedra resmini ne kadar tutarlı biçimde desteklediği.',
            proxyNote:
              '`gluingScore` değerini canvas pipeline’ından okur; canvas stat kartlarında ve Faz 3 Gluing Diagnostics panelinde halihazırda gösterilen aynı değeri yansıtır.',
          },
          flatTetrahedron: {
            title: 'Flat tetrahedron beklentisi',
            body: 'Klasik düz bir tetrahedron, bir quantum polyhedron’un olası klasik limitlerinden biridir; ama otomatik değildir — Bell-network state’leri açık bir biçimde flat tetrahedra üzerinde lokalize olmak zorunda değildir.',
            proxyNote:
              'Conceptual diagnostic. Uygulama aktif state üzerinde flat-tetrahedron beklenti değerlerini değerlendirmez.',
          },
          sphericalTetrahedron: {
            title: 'Spherical tetrahedron yorumu',
            body: 'Dipole graph üzerinde literatür-yönelimli bir effective-geometry okuması — iki glue edilmiş quantum polyhedron’un effective geometry’sinin düz yerine eğri (spherical-tetrahedron) okunduğu durumlar için anlamlıdır. Okuma betimlemedir, hesaplanmaz.',
            proxyNote:
              'Conceptual diagnostic. Uygulama spherical-tetrahedron beklenti değerlerini hesaplamaz; satır okumanın sessizce düşmemesi için her topology’de görünür kalır, çip ise aktif topology dipole olmadığında bunu işaret eder.',
          },
          twistedPhaseSpace: {
            title: 'Twisted-geometry phase-space verisi',
            body: 'Twisted geometry her yüzde tam phase-space üzerinde area, shape ve extrinsic angle verisi ister — vector-geometry proxy’sinin izlediği tek yönden çok daha zengindir.',
            proxyNote:
              'Hesaplanmıyor. Uygulama twisted-geometry phase-space değişkenlerini değerlendirmez.',
          },
          reggeShapeMatching: {
            title: 'Regge shape-matching verisi',
            body: 'Regge geometry, paylaşılan yüzlerin şekillerinin eşleşmesini ister — aynı kenar uzunlukları ve her kenarda dihedral tutarlılık.',
            proxyNote:
              'Hesaplanmıyor. Hiçbir Regge shape-matching kısıtı çözülmüyor.',
          },
          exactExpectations: {
            title: 'Exact LQG expectation değerleri',
            body: 'LQG Hilbert uzayındaki gerçek geometric operator’lar — area, volume, dihedral angle — bir Bell-network state’i üzerinde exact beklenti değerleri taşır. Gerçek bir effective-geometry hesabı bunları okur.',
            proxyNote:
              'Hesaplanmıyor. Uygulama intertwiner-space geometric operator beklenti değerlerini değerlendirmez.',
          },
        },
      },

      limitations: {
        label: 'Sınırlar',
        aria: 'Bu panelin sınırları',
        items: [
          'Bu uygulama şu an pedagojik bir vector-geometry proxy’si görselleştiriyor.',
          'Twisted-geometry phase-space verisini hesaplamaz.',
          'Regge shape-matching koşullarını çözmez.',
          'Exact LQG geometric operator beklenti değerlerini değerlendirmez.',
          'Flat-vs-spherical tetrahedron ayrımı, hesaplanmış bir sonuç değil, conceptual bir diagnostic olarak sunulur.',
        ],
      },

      howToRead: {
        label: 'Bu paneli nasıl okumalı',
        body: 'pedagogical-proxy etiketli satırlar canvas pipeline’ından gelen sayıları taşır — canvas stat kartlarının ve Gluing Diagnostics panelinin kullandığı aynı değerler, yalnız bir vector-geometry lens’i üzerinden yeniden etiketlenmiş halde. conceptual-diagnostic etiketli satırlar literatür-yönelimli bir okumayı betimler ve bilinçli olarak hiçbir sayı taşımaz: betimleme zaten diagnostic’tir. future-calculable-observable etiketli satırlar "hesaplanmıyor" pill’i gösterir, böylece bu uygulama ile gerçek bir twisted, Regge ya da exact-LQG hesabı arasındaki boşluk gizlenmek değil, görünür kılınmak içindir.',
      },
    },

    /**
     * Faz 6 — Correlation Summary paneli içeriği. Yapı EN ile birebir
     * aynı; `validate-ui-i18n.mjs` parity’yi doğrular. Sayısal değerler
     * canonical pipeline’dan okunur ve çevrilmez; kürasyonlu prose
     * burada yaşar.
     */
    correlations: {
      intro:
        'Korelasyonlar Bell-network araştırma hattının merkezinde durur — hem bir state family’yi diğerinden ayıran yapısal girdi olarak, hem de gerçek LQG hesaplarının nihayetinde değerlendireceği cosmological observable olarak. Bu panel canonical pipeline’ı bu lens üzerinden okur: face pair başına toy değerler, global proxy özet, ve her state family’nin korelasyonlarını nasıl kodladığına dair kürasyonlu okuma. Neyi hesaplamadığı konusunda açık konuşur.',

      hierarchy: {
        label: 'Korelasyon okuma hiyerarşisi',
        body: 'Bell-network register’ı için "korelasyon"un üç düzeyi önemlidir; her biri farklı bir dürüstlük sınıfında. **Pair-level korelasyonlar** her face pair’ın global örüntüye nasıl katkıda bulunduğuna bakar — burada kanonik pair başına toy değerler (local strength, alignment, gluing proxy) olarak yüzeylenir. **Graph-level eğilimler** state’i bütün olarak global agregalardan okur — anti-parallel score, gluing score ve mutual-information proxy. **Exact intertwiner-space correlator’lar** gerçek geometric operator iki-nokta fonksiyonlarını LQG Hilbert uzayında hesaplardı — uygulama bunu yapmaz, dolayısıyla o satırlar future-calculable-observable olarak etiketlenir.',
      },

      pairProfile: {
        label: 'Pair-level korelasyon profili',
        aria: 'Face pair başına toy korelasyon değerleri',
        caption:
          'Face pair başına üç toy değer, canvas pipeline’ından birebir alınır. Pedagojik proxy’dirler — aktif state için pair bazlı bir okumadır, exact iki-nokta fonksiyonu değildir.',
        metrics: {
          localStrength: 'Yerel strength',
          alignment: 'Alignment',
          gluing: 'Gluing proxy',
        },
      },

      globalSummary: {
        label: 'Global proxy özeti',
        aria: 'Global korelasyon proxy değerleri',
        caption:
          'Aktif state için üç global proxy. Canvas’ın stat kartlarında ve Gluing Diagnostics panelinde halihazırda gösterilen aynı değerler — aynı sayılar, farklı çerçeveleme.',
        metrics: {
          antiParallel: 'Anti-parallel score',
          gluing: 'Gluing score',
          mutualInformation: 'Mutual information proxy',
        },
      },

      familyReading: {
        label: 'State-family korelasyon okuması',
        activeAria: 'Kürasyonlu state-family korelasyon sınıflandırmaları',
        activeChipLabel: 'aktif',
        classifications: {
          uncorrelated: {
            headline: 'Yapılandırılmış korelasyonun en aza indiği baseline',
            body: 'Bu uygulamanın kürasyonlu okumasında, uncorrelated family entanglement-kaynaklı bir korelasyon örüntüsü taşımaz. Pair-level ve global proxy’ler unentangled baseline’a yakın kalır; korelasyon yapı varlığı değil, yokluğudur.',
          },
          weakAligned: {
            headline: 'Hafifçe hizalı, güçlü korelasyon yok',
            body: 'Bu uygulamanın kürasyonlu okumasında, weakly-aligned family yumuşak ve eşit yayılan bir korelasyon eğilimi üretir — pair-level proxy’ler önemsiz değildir ama küçüktür, global proxy’ler ölçülüdür. Korelasyonlar var ama zayıf ve homojen.',
          },
          bellSymmetric: {
            headline: 'Homojen Bell-benzeri korelasyon örüntüsü',
            body: 'Bu uygulamanın kürasyonlu okumasında, Bell-symmetric family dört pair üzerinde homojen biçimde korele görünmek için tasarlanmıştır. Pair-level proxy’ler birbirine yakın kümelenir; global proxy’ler yüksek seyreder. Bu, toy "Bell-network" çerçevelemesine en çok uyan family’dir.',
          },
          frustrated: {
            headline: 'Çelişen pair eğilimleri, homojen olmayan örüntü',
            body: 'Bu uygulamanın kürasyonlu okumasında, frustrated family bilinçli olarak bölünmüş bir korelasyon örüntüsü üretir — iki pair iyi-korele alt kümeye düşerken iki pair zayıf-korele kalır. Global proxy’ler ılımlı kalır ama pair-level cohesion düşüktür; korelasyon var ama homojen değil.',
          },
          edgeBiased: {
            headline: 'Seçilmiş edge / face-pair eğilimi',
            body: 'Bu uygulamanın kürasyonlu okumasında, edge-biased family korelasyonu seçilmiş bir face pair alt kümesinde yoğunlaştırır. Pair-level proxy’ler güçlü ve zayıf arasında keskin biçimde ayrılır; global proxy’ler eğilimin nasıl ortalandığına bağlıdır. Korelasyonlar var ama lokalize, homojen değil.',
          },
        },
      },

      diagnostics: {
        label: 'Diagnostic’ler',
        rowsAria: 'Korelasyon diagnostic satırları',
        notComputedLabel: 'hesaplanmıyor',
        rows: {
          pairProfile: {
            title: 'Pair-level korelasyon profili',
            body: 'Canonical pipeline’ın pair başına toy değerlerini bir "korelasyon profili" lens’i üzerinden yüzeyler — hangi pair ne kadar katkıda bulunuyor ve dört pair tek bir örüntü olarak ne kadar tutarlı.',
            proxyNote:
              '`localStrength`, `localAlignmentScore` ve `localGluingProxy` değerlerini `deriveEdgeDetails`’ten okur. Bunlar pedagojik proxy’dirler, intertwiner uzayında exact iki-nokta fonksiyonları değildir.',
          },
          globalTendency: {
            title: 'Global korelasyon eğilimi',
            body: 'Aktif state’i graph-level üç global proxy üzerinden okur — anti-parallel score, gluing score ve mutual-information proxy — canvas pipeline’ından birebir alınır.',
            proxyNote:
              '`antiParallelScore`, `gluingScore` ve `mutualInformationProxy` değerlerini `deriveCorrelationState`’ten okur. `mutualInformationProxy`, `(strengthMean × alignMean)^1.5` üzerine kurulu deterministik bir toy formüldür; herhangi bir density matrix’in quantum mutual information’ı değildir.',
          },
          familyReading: {
            title: 'State-family korelasyon okuması',
            body: 'Beş shippable state family’nin korelasyonları nasıl kodladığına dair kürasyonlu okuma — homojen, kısmen-homojen, frustrated ya da edge-biased. Aktif family yukarıdaki okumalarda öne çıkarılır.',
            proxyNote:
              'Curated classification. Beş okuma sabit bir kümeden seçilmiş yazar-koruyumlu etiketlerdir; matematik tüketici olduğu için değil, küme sayılabilir olduğu için dürüsttür.',
          },
          symmetryVsCorrelation: {
            title: 'Simetri ile korelasyon arasındaki ayrım',
            body: 'Homojen görünen bir state simetri çağrıştırabilir, ama simetri ve korelasyon aynı şey değildir. İki pair aynı orbit’te (simetri-eşdeğer) sitting’ken korelasyon kuvvetleri farklı olabilir; tersi de geçerli — bir state graph automorphism’ını kırarken pair-level korelasyonları tutarlı tutabilir.',
            proxyNote:
              'Conceptual diagnostic. Okuma betimleyicidir — bir simetri grup eylemi ile bir korelasyon operatörü arasında hesaplanmış bir orthogonality değildir.',
          },
          exactCorrelators: {
            title: 'Exact intertwiner-space correlator’lar',
            body: 'Gerçek bir korelasyon hesabı, geometric operator’ların (alanlar, hacimler, dihedral angle’lar, edge holonomies) Bell-network state üzerindeki iki-nokta fonksiyonlarını LQG Hilbert uzayında değerlendirirdi.',
            proxyNote:
              'Hesaplanmıyor. Uygulama intertwiner-space correlator’ları veya herhangi bir pair-pair correlation matrix değerlendirmez.',
          },
          reducedDensityMatrix: {
            title: 'Reduced density matrix ve entanglement entropy',
            body: 'Tek bir node üzerindeki local entanglement entropy — homogeneous-graph ve cosmological-state çizgisindeki doğal symmetry-invariant prob — Bell-network state’in o node’a kısıtlanmış reduced density matrix’inden hesaplanır.',
            proxyNote:
              'Hesaplanmıyor. Uygulama tek-düğüm reduced density matrix veya local entanglement entropy değerlendirmez.',
          },
        },
      },

      limitations: {
        label: 'Sınırlar',
        aria: 'Bu panelin sınırları',
        items: [
          'Bu uygulama exact intertwiner-space correlator’ları (iki-nokta fonksiyonları) hesaplamaz.',
          'Tek-düğüm reduced density matrix değerlendirmez.',
          'Bell-network state üzerinde local entanglement entropy hesaplamaz.',
          'Pair-level sayılar toy proxy’dir, gerçek quantum-correlation operatörleri değildir.',
          'State-family korelasyon okumaları sabit bir kümeden seçilmiş kürasyonlu etiketlerdir, teorem değildir.',
        ],
      },

      howToRead: {
        label: 'Bu paneli nasıl okumalı',
        body: 'pedagogical-proxy etiketli satırlar canvas pipeline’ından gelen sayıları taşır — canvas’ın, Gluing Diagnostics panelinin ve Effective Geometry panelinin gösterdiği aynı değerler, yalnız bir "korelasyon" lens’i üzerinden yeniden etiketlenmiş halde. conceptual-diagnostic ve curated-classification etiketli satırlar niteliksel okumalar veya yazar-koruyumlu etiketler taşır; hesaplama yerine betimleme oldukları için dürüsttürler. future-calculable-observable etiketli satırlar bilinçli olarak "hesaplanmıyor" pill’leri gösterir: bu uygulama ile gerçek bir LQG correlator’ı veya entanglement-entropy hesabı arasındaki boşluk gizlenmek değil, görünür kılınmak içindir.',
      },

      /**
       * Faz 9B — Minimal Qubit Engine Preview içeriği. Yapı EN ile
       * birebir aynı; `validate-ui-i18n.mjs` parity’yi doğrular.
       * Teknik LQG / quantum-information terimleri (minimal qubit
       * model, density matrix, partial trace, von Neumann entropy,
       * intertwiner space, Bell pair, GHZ state) İngilizce kalır.
       */
      enginePreview: {
        label: 'Minimal Qubit Engine Preview',
        intro:
          'Aktif topology ve state family’den seçilen bir minimal qubit model üzerinde *exact* finite-dimensional quantum-information hesapları. Density matrix, partial trace ve von Neumann entropy bu model içinde tam olarak hesaplanır — ama model bir SU(2) intertwiner-space yapımı *değildir*, bir LQG Bell-network state *değildir* ve area / volume / dihedral angle gibi geometric operator beklenti değeri *değildir*.',
        modelLabel: 'minimal qubit model',
        exactLabel: 'modelin içinde exact',
        notLqgLabel: 'LQG değil',

        topologyLabel: 'Aktif topology',
        familyLabel: 'Aktif state family',
        selectedStateLabel: 'Seçilen engine state',
        qubitsLabel: 'Qubit sayısı',
        mappingReasonLabel: 'Neden bu state?',

        entropyLabel: 'Qubit başına von Neumann entropy',
        entropyBitsLabel: 'bits',
        entropyNatsLabel: 'nats',
        qubitLabel: (n: number) => `Qubit ${n}`,

        reducedDensityMatrixLabel: 'Reduced density matrix',
        firstQubitLabel: 'ρ — qubit 0 (2 × 2)',

        exactVsProxyLabel: 'Modelin içinde exact · modelin dışında proxy',
        exactVsProxyBody:
          'Yukarıdaki density matrices, partial traces ve entropy değerleri exact finite-dimensional quantum-information hesaplarıdır — ama yalnız bu minimal qubit model’in içinde. Yukarıdaki Correlation Summary sayıları (anti-parallel score, gluing score, mutual-information proxy) ve curated state-family okumaları LQG register’ının pedagojik proxy’leri olmaya devam eder. İki register birbirini tamamlar; biri diğerinin yerini almaz. Bir SU(2) intertwiner-space yükseltmesi gelecek Phase 9C’nin parçasıdır.',

        mappingReasons: {
          dipoleProduct:
            'Dipole’un iki düğümü vardır; uncorrelated family ile minimal qubit preview |00⟩ product state kullanır — gösterilecek entanglement-kaynaklı yapı yoktur.',
          dipoleBell:
            'Dipole’un iki düğümü vardır; uncorrelated dışındaki family’ler minimal qubit preview’da iki-qubit Bell state |Φ+⟩ ile temsil edilir; bu maximally-entangled bir toy baseline’dır.',
          cycle4Product:
            'Cycle-4’ün dört düğümü vardır; uncorrelated family ile minimal qubit preview |0000⟩ product state kullanır — gösterilecek global entanglement yoktur.',
          cycle4Ghz:
            'Cycle-4’ün dört düğümü vardır; uncorrelated dışındaki family’ler minimal qubit preview’da dört-qubit GHZ state ile temsil edilir; bu global-correlation için bir toy baseline’dır.',
        },

        stateKinds: {
          product: 'Product state',
          bellPair: 'Bell pair |Φ+⟩',
          ghz: 'GHZ state',
        },

        /**
         * Faz 9B.5 → Faz 9C-1 — exact qubit mutual information bloku.
         * Yapı EN ile birebir aynı; teknik LQG / quantum-information
         * terimleri (mutual information, subsystem entropy, eigensolver,
         * bits, nats) İngilizce kalır. Faz 9C-1 ile her engine state
         * (Bell pair, Cycle-4 / GHZ pair, GHZ(3), GHZ(4), product(4))
         * artık `'computed'` döner; `'unsupported'` dalı yalnızca
         * gelecekte karmaşık Hermitian reduced ρ için saklanır.
         */
        mutualInformation: {
          label: 'Exact qubit mutual information',
          exactLabel: 'Minimal qubit model içinde exact',
          proxyLabel: 'Mevcut pedagojik proxy',
          unitlessLabel: 'boyutsuz',
          unsupportedLabel: 'Exact MI hesaplanmıyor',
          unsupportedBody:
            'Pair mutual information genel bir subsystem-entropy eigensolver gerektirir. Motor herhangi bir qubit subsystem için real-symmetric reduced ρ’yu işler; bu uyarı yalnızca reduced ρ önemli derecede karmaşık Hermitian off-diagonal taşırsa görünür (gelecekteki bir SU(2) senaryosu).',
          computedBody:
            'I(A:B) = S(A) + S(B) − S(AB), motorun genel real-symmetric Hermitian eigensolver’ı ile hesaplanır. S(A) ve S(B) yukarıdaki qubit-bazlı entropy ızgarasında görünür; S(AB) ise A∪B subsystem’i üzerindeki ortak reduced entropy’dir (iki-qubit saf state için 0’a eşittir, daha büyük indirgemelerde reel bir sayı olarak ortaya çıkar).',
          entropyABLabel: 'S(AB)',
          bitsLabel: 'bits',
          natsLabel: 'nats',
          qualitativeComparisonLabel: 'Sadece niteliksel karşılaştırma',
          qualitativeComparisonBody:
            'Proxy boyutsuzdur; exact mutual information bits / nats cinsindendir. Bunu sayısal bir hata payı olarak değil, niteliksel bir karşılaştırma olarak değerlendir.',
        },

        /**
         * Faz 9C-2 — heatmap yüzeyleri. Yapı EN ile birebir aynı;
         * teknik terimler (mutual information, intertwiner-space, bits)
         * İngilizce kalır, açıklamalar Türkçe.
         */
        heatmaps: {
          entropyHeatmapLabel: 'Node entropy heatmap',
          entropyHeatmapBody:
            'Her bar, minimal qubit model içindeki tek-qubit entropy değerini bits cinsinden görselleştirir. Bir qubit için maksimum 1 bit olduğundan bar yalnızca görsel bir normalizasyondur — yeni bir physics score değildir.',
          entropyFillLabel: 'Tek-qubit entropy doluluğu',
          pairwiseMiLabel: 'Exact pairwise qubit mutual information',
          pairwiseMiBody:
            'Her diagonal-dışı hücre, minimal qubit model içindeki I(Qᵢ : Qⱼ) değerini bits cinsinden gösterir. Arka plan yoğunluğu, matristeki maksimum bits değerine göre ölçeklenir; bu LQG intertwiner-space mutual information değildir.',
          diagonalLabel: '—',
          unsupportedCellLabel: 'n/a',
          qubitAxisLabel: 'Qubit ekseni',
          exactQubitMiLabel: 'Exact qubit MI · bits',
        },
      },

      /**
       * Faz 9E-1 — single-node SU(2) intertwiner sandbox bloku.
       * Yapı EN ile birebir aynı; teknik terimler (SU(2),
       * intertwiner, invariant subspace, projector, spectrum, spin
       * tuple) İngilizce kalır, açıklamalar Türkçe.
       *
       * **Dürüstlük pini:** sandbox tek-node SU(2)-invariant subspace
       * hesaplar; Bell-network state, multi-node graph state veya
       * geometry observable değildir.
       */
      intertwinerSandbox: {
        label: 'Single-node SU(2) intertwiner sandbox',
        modelChip: 'single-node SU(2) model',
        intro:
          'Bu sandbox, tek-bir tensor-product spin node’unun SU(2)-invariant subspace’ini — total Casimir’in j_total = 0 öz-uzayını — hesaplar. Bell-network state değildir, edge-gluing kurgusu değildir, geometry observable değildir. Multi-node gluing ileri faza ertelenmiştir.',
        spinTupleLabel: 'Spin tuple',
        totalDimensionLabel: 'Toplam boyut',
        invariantDimensionLabel: 'Invariant boyut',
        expectedDimensionLabel: 'Beklenen (textbook)',
        keptIndicesLabel: 'Tutulan eigenvalue indisleri',
        keptIndicesEmpty: '—',
        spectrumPreviewLabel: 'Spectrum önizleme',
        spectrumPreviewEllipsis: '…',
        sanityLabel: 'Projector sağlamlık',
        hermitianProjectorLabel: 'P† = P',
        idempotentProjectorLabel: 'P² = P',
        traceMatchesLabel: 'Tr(P) = boyut',
        passLabel: 'pass',
        failLabel: 'fail',
        examples: {
          twoSpinHalf: {
            title: 'İki spin-1/2 faktörü',
            interpretation:
              'Textbook ½ ⊗ ½ = 0 ⊕ 1 ayrışımı. Tek invariant basis vector ±|singlet⟩ = ±(|↑↓⟩ − |↓↑⟩) / √2. Bu tek bir node’daki singlet sector’dür; Bell-network kenarı değildir.',
          },
          fourSpinHalf: {
            title: 'Dört spin-1/2 faktörü',
            interpretation:
              'Minimal 4-valent spin-1/2 node’u 2-boyutlu bir intertwiner space taşır. İki basis vector (½)⁴’ün j_total = 0 alt-uzayını gerer; explicit formları recoupling sırasına bağlıdır.',
          },
          twoSpinOne: {
            title: 'İki spin-1 faktörü',
            interpretation:
              '1 ⊗ 1 = 0 ⊕ 1 ⊕ 2 ayrışımı 1-boyutlu bir invariant subspace verir. Basis vector iki spin-1 faktörünün SU(2)-singlet’idir.',
          },
          spinOneTwoSpinHalf: {
            title: 'Bir spin-1 + iki spin-1/2 faktörü',
            interpretation:
              'Karışık spinli 3-valent bir node: 1 ⊗ ½ ⊗ ½ = 0 ⊕ 1 ⊕ 1 ⊕ 2, dolayısıyla invariant subspace 1-boyutlu. Bu tek-node intertwiner’dir; Bell-network state değildir.',
          },
        },
      },

      /**
       * Mega Faz 9E-3 — Bell-network graph sandbox bloku. Yapı EN ile
       * birebir aynı; teknik terimler (Bell-network, graph contract,
       * edge-slot bookkeeping, intertwiner, invariant subspace,
       * prototype state) İngilizce kalır, açıklamalar Türkçe.
       *
       * **Dürüstlük pini:** dipole ve cycle-4 cards graph contract +
       * per-node summary gösterir; tamamlanmış Bell-network state
       * değildir. Yalnızca two-node single-edge graph minimal
       * graph-level prototype state taşır.
       */
      bellNetworkSandbox: {
        label: 'Bell-network graph sandbox',
        modelChip: 'graph contract · projected spin-1/2 state’ler',
        intro:
          'Bu sandbox, motorun bildiği canonical spin-1/2 graph’ları ve onların per-node SU(2)-invariant subspace özetlerini yüzeye çıkarır. Mega Faz 9E-4 ile dipole ve cycle-4 graph’ları için projected graph-level state’ler eklendi (link-singlet ürününün her node’un SU(2)-invariant projektörünün tensor ürününe izdüşümü); two-node single-edge graph önceki minimal prototype’ında kalır. Bu katmanda hiçbir geometry operator (area / volume / dihedral) expectation value hesaplanmaz.',
        graphFactsLabel: 'Graph bilgileri',
        nodesLabel: 'Nodes',
        edgesLabel: 'Edges',
        edgeSpinsLabel: 'Edge spinleri',
        parallelEdgesLabel: 'Paralel kenarlar',
        yesLabel: 'evet',
        noLabel: 'hayır',
        prototypeStateLabel: 'Prototype state',
        prototypeAvailableLabel: 'mevcut',
        prototypeDeferredLabel: 'ertelendi',
        prototypeKindLabel: 'Tür',
        prototypeDimensionLabel: 'Boyut',
        prototypeNormalisedLabel: 'Normalize',
        prototypeHonestyLabel: 'Dürüstlük',
        stateRegisterLabel: 'State register',
        endpointDimensionLabel: 'Endpoint boyutu',
        graphInvariantDimensionLabel: 'Graph invariant boyutu',
        perNodeInvariantDimensionsLabel: 'Per-node invariant boyutları',
        normBeforeProjectionLabel: 'Norm. öncesi ‖P · ⊗|S⟩‖',
        stateRegisters: {
          minimalTwoNodePrototype: 'minimal two-node prototype',
          spinHalfProjectedBellNetworkState:
            'spin-1/2 projected Bell-network state',
        },
        nodeSummariesLabel: 'Per-node intertwiner özetleri',
        nodeLabel: 'Node',
        incidentEdgesLabel: 'Incident edge’ler',
        spinTupleLabel: 'Spin tuple',
        totalDimensionLabel: 'Toplam boyut',
        invariantDimensionLabel: 'Invariant boyut',
        deferredReasons: {
          requiresEdgeSlotBookkeeping:
            'Graph-level state ertelendi — multi-edge gluing edge-slot bookkeeping gerektirir.',
          phaseScope:
            'Graph-level state ertelendi — bu fazın kapsamı dışında.',
        },
        examples: {
          twoNodeSingleEdge: {
            title: 'İki-node, tek spin-1/2 kenarlı graph',
            interpretation:
              'Mümkün olan en küçük non-trivial Bell-network graph’ı: tek bir spin-1/2 kenarla birleşmiş iki node. Her node tek bir spin-1/2 incident faktör taşır, yani per-node total dim 2 ve invariant dim 0 (tek spin-1/2 SU(2)-invariant alt-state taşımaz). Graph-level prototype state, kenar üzerindeki spin-1/2 singlet’tir; iki uç-node’un Hilbert faktörleri üzerindeki ortak state olarak yorumlanır. Bu durum minimal-prototype register’ında kalır çünkü projected register her node için sıfırdan büyük invariant boyut gerektirir.',
          },
          dipoleSpinHalf: {
            title: 'Dört spin-1/2 kenarlı dipole graph',
            interpretation:
              'İki node, aralarında dört paralel spin-1/2 kenarla birleştirilmiş. Her node’un incident spin tuple’ı [1/2, 1/2, 1/2, 1/2], total dim 16 ve 2-boyutlu intertwiner subspace (textbook 4-valent spin-1/2 intertwiner). Graph-level state, link-singlet ürününün 4-boyutlu graph invariant subspace’e izdüşümüdür (= 2 × 2 per-node intertwiner boyutları). Bu state’ten hiçbir geometry operator veya geometry iddiası türetilmez.',
          },
          cycle4SpinHalf: {
            title: 'Spin-1/2 kenarlı cycle-4 graph',
            interpretation:
              'Dört node, halka biçiminde dört spin-1/2 kenarla bağlı. Her node’un incident spin tuple’ı [1/2, 1/2], total dim 4 ve 1-boyutlu intertwiner subspace (textbook iki-spin-1/2 singlet’i). Graph-level state, link-singlet ürününün 1-boyutlu graph invariant subspace’e izdüşümüdür; projected state global bir faza kadar tektir. Bu state’ten hiçbir geometry operator veya geometry iddiası türetilmez.',
          },
        },
      },
    },

    /**
     * Faz 7 — Research Notes paneli içeriği. Yapı EN ile birebir
     * aynı; `validate-ui-i18n.mjs` parity’yi doğrular. İçerik yeni
     * bir `src/data/researchNotes.ts` dosyasında değil i18n ağacında
     * yaşar — `validate-i18n.mjs`’in kapalı path listesi
     * değiştirilmedi.
     */
    researchNotes: {
      intro:
        'Lab’in etkileşimli yüzeylerini Bell-network araştırma hattına bağlayan altı kısa research note. Her not bir tez, neden önemli olduğu, uygulamanın şu an ne gösterdiği ve ileride yapılacaklar alanlarını taşır — açıklama ile hesaplama arasındaki sınırı açıkça çizer.',

      panelScopeLabel: 'Kapsam',
      panelScopeBody:
        'Bu panel açıklayıcıdır, hesaplayıcı değildir. Uygulama exact LQG operator expectation value hesaplamaz, reduced density matrix veya local entanglement entropy hesaplamaz ve hiçbir automorphism algoritması çalıştırmaz. Lab’in başka yerlerinde gösterilen sayılar, açıkça aksi belirtilmedikçe, pedagogical proxy’dir — her diagnostic satırı dürüstlük sınıfını ProxyBadge ile görünür kılar.',

      noteListAria: 'Research notları',

      fields: {
        whyItMatters: 'Neden önemli',
        inThisApp: 'Bu uygulamada',
        futureWork: 'İleride yapılacaklar',
      },

      notes: {
        bellNetworkGluing: {
          title: 'Bell-network states ve entanglement-induced gluing',
          thesis:
            'Bell-network states, sabit bir graph üzerinde korele süperpozisyonlardır; komşu quantum polyhedra’nın paylaşılan yüzleri arasında "glue" edildiği sezgisini kodlar — bu klasik bir kısıtlamadan değil, face-normal serbestlik derecelerinin entangle olmasından kaynaklanır.',
          whyItMatters:
            'Loop quantum gravity’de tek başına bir spin-network basis state face area’ları sabitler ama komşu polyhedra’ları temelde serbest bırakır — paylaşılan bir kenarın iki yanındaki face normal’ler bağımsız dalgalanır. Onları bağlayan şey entanglement’tır. Bell-network kurgusu bu bağlantıyı izlenebilir bir state ailesinde yakalar ve dipole graph üzerinde "iki glue edilmiş polyhedron" zihin resmini destekler.',
          inThisApp:
            'Gluing Diagnostics paneli üç pedagojik proxy’yi okur — canvas anti-parallel score, gluing score ve pair bazlı gluing-proxy değerleri — entanglement strength yükseldiğinde doğru nitel yönde tepki verir. Bunlar exact intertwiner-space operator expectation değerleri değildir. Face-area matching, Regge shape matching ve node-closure satırları açıkça future-calculable-observable olarak etiketlenmiştir.',
          futureWork:
            'Toy alignment / gluing pipeline’ını intertwiner-space normal operator’larının cross-face inner product’larıyla değiştirmek, gluing okumasını proxy yerine hesaplanabilir bir observable’a çevirirdi. Gluing Diagnostics’teki future-calculable-observable satırları boşluğu açıkça işaret eder.',
        },

        geometryHierarchy: {
          title: 'Twisted, vector ve Regge geometry',
          thesis:
            'Aynı kombinatoryal spin-network verisinin giderek talepkâr üç geometrik okuması LQG yarı-klasik analizinin merkezindedir: vector geometry yalnız sırt sırta face normal’ler ister; twisted geometry alan, şekil ve extrinsic angle verisi ekler; Regge geometry, dihedral tutarlılıkla birlikte tam shape-matching ekler.',
          whyItMatters:
            'Her katman aynı kuantum state’in farklı bir yarı-klasik limitine karşılık gelir. Vector geometry en ucuz okumadır — alttaki state yalnız kaba bir uyum taşıdığında bile hayatta kalır. Twisted ve Regge geometry daha zengindir; onlara ulaşmak state’in graph boyunca alan, şekil ve kenar uzunluğu verisini tutarlı biçimde kodlamasını gerektirir.',
          inThisApp:
            'Effective Geometry paneli ve canvas pipeline’ı yalnız bir vector-geometry register’ına yaklaşır — alignment / mismatch / gluing proxy üzerinden. Twisted-geometry phase-space verisi ve Regge shape-matching kısıtları, Effective Geometry diagnostic satırlarında açıkça future-calculable-observable olarak etiketlenir; uygulama bunları hesaplamaz.',
          futureWork:
            'Phase-space verisi değerlendirmesi (alanlar, şekiller, extrinsic angle’lar) ve bir Regge shape-matching çözücüsü, Effective Geometry panelinin twisted ve Regge tier’larında gerçek okumaları kendi dürüstlük sınıflarıyla yüzeylemesine olanak verirdi.',
        },

        homogeneousGraphs: {
          title: 'Homogeneous graphs ve automorphism invariance',
          thesis:
            'Bir graph, toy LQG register’ında "homogeneous"tur — her node graph automorphism grubunun tek bir orbitinde, her edge tek bir orbitinde yer alıyorsa. Homogeneous graph’larda doğal fiziksel observable’lar automorphism-invariant’tır — one-node observable’lar ve reduced density matrices bu durumda state’in belirsizlik içermeyen problarıdır.',
          whyItMatters:
            'LQG truncation’ları automorphism invariance’ı diffeomorphism invariance’ın ayrık karşılığı olarak kullanır — fizik hangi node’un A, hangisinin B etiketlendiğine bağlı olmamalı. Homogeneous-graph state’leri bunu somutlaştırır: "her node diğer her node gibi görünür" şartını sağlayan en sade ortamdır ve bir one-node observable, tercih edilen bir site seçmeden cosmology sezgisini probe edebilir.',
          inThisApp:
            'Symmetry / Automorphism Diagnostics paneli iki shippable topology (dipole, cycle-4) için node ve edge orbitlerinin conceptual okumalarını yüzeyler; ek olarak her state family’nin topology simetrileriyle nasıl ilişkili olduğuna dair kürasyonlu bir sınıflandırma sunar. Hiçbir automorphism algoritması çalışmaz; okumalar topology id ile anahtarlanmış yazar-kürasyonlu metindir.',
          futureWork:
            'Keyfi bir topology’nin automorphism grubunu hesaplamak, node ve kenarları algoritmik olarak orbitlere ayrıştırmak ve bir Bell-network state üzerinde one-node observable’ları değerlendirmek, conceptual diagnostic’leri hesaplanmış niceliklere dönüştürürdü.',
        },

        dipoleEffectiveGeometry: {
          title: 'Dipole graph üzerinde effective geometry',
          thesis:
            'Dipole graph üzerinde — dört paralel kenarla bağlanmış iki düğüm — Bell-network state’leri iki glue edilmiş quantum polyhedron’u modeller. Glue edilmiş çiftin effective geometry’sinin düz bir klasik tetrahedron olarak mı yoksa spherical-tetrahedron deformasyonu olarak mı okunacağı, bu graph’ın motive ettiği soru türüdür ve hangi observable’ların değerlendirildiğine bağlı bir ayrımdır.',
          whyItMatters:
            'Dipole, "iki glue edilmiş polyhedron"un anlamlı bir nesne olduğu en sade spin-network truncation’ıdır. Bell-network korelasyonlarının glue edilmiş bir geometriyi nasıl desteklediğini sormak ve düz bir tetrahedron klasik limiti ile eğri bir spherical-tetrahedron okuması arasında ayrım yapmak için doğal laboratuvardır. Cosmology-bridge sezgisi — küçük bir graph üzerinde effective geometry’nin coarse-grained klasik geometrinin yerini tuttuğu fikri — ilk somut testini burada bulur.',
          inThisApp:
            'Effective Geometry paneli, flat-vs-spherical ayrımını literatür-yönelimli bir conceptual diagnostic olarak çerçeveleyen topology-specific bir not yüzeyler. Spherical Tetrahedron satırı, aktif topology dipole olmadığında bir "dipole-specific" chip taşır. Hiçbir flat-tetrahedron veya spherical-tetrahedron expectation değeri hesaplanmaz.',
          futureWork:
            'Dipole’un Bell-network state’leri üzerinde curvature observable’larını değerlendirmek — örneğin glue edilmiş çift üzerinde dihedral-angle expectation değerleri veya paylaşılan yüzler arasındaki area-mismatch katsayıları — panelin iki yorumu betimlemek yerine onlara sayısal okumalar iliştirmesine olanak verirdi.',
        },

        correlations: {
          title: 'Quantum geometry ve cosmology’de korelasyonlar',
          thesis:
            'Korelasyonlar Bell-network araştırma hattının iki ucunda da merkezdedir — yerel pair düzeyinde bir state family’yi diğerinden ayıran şeydir ve büyük-graph limitinin nihayetinde hesaplayacağı cosmological observable’dır. Pair düzeyi korelasyonlar ile graph düzeyi homogeneity bir süreklilik üzerinde durur; aralarındaki bağlantıyı anlamak işin yarısıdır.',
          whyItMatters:
            'Geometri tarafında korelasyonlar, entanglement’ın "glue edilmiş geometri"ye dönüştüğü yoldur: korelasyon örüntüsü ne kadar temizse, state ilişkisiz parçaların toplamı yerine tutarlı bir effective geometry parçası olarak o kadar iyi okunur. Cosmology tarafında, homogeneous bir graph üzerindeki automorphism-invariant korelasyonlar cosmological homogeneity’nin toy karşılığıdır — ve o korelasyonların momentleri, gerçek bir LQG hesabının değerlendireceği şeydir.',
          inThisApp:
            'Correlation Summary paneli üç pedagogical-proxy okuma yüzeyler — pair başına korelasyon profili, global proxy özet (anti-parallel, gluing, mutual-information proxy) ve kürasyonlu state-family sınıflandırması. Mutual-information proxy, herhangi bir density matrix’in quantum mutual information’ı değil, deterministik bir toy formüldür: `(strengthMean × alignMean)^1.5`. Exact intertwiner-space correlator’lar, reduced density matrix’ler ve local entanglement entropy’ler future-calculable-observable olarak işaretlidir.',
          futureWork:
            'Bell-network state’leri üzerinde geometric operator’ların (area, volume, dihedral angle) iki-nokta fonksiyonlarını hesaplamak, tek-düğüm reduced density matrix’leri değerlendirmek ve bunlardan local entanglement entropy’leri çıkarmak, toy proxy’leri sayısal fiziksel anlam taşıyan niceliklerle değiştirirdi.',
        },

        proxiesToObservables: {
          title: 'Pedagogical proxy’lerden hesaplanabilir observable’lara',
          thesis:
            'Lab’in diagnostic satırları halihazırda her değeri dört dürüstlük sınıfından biriyle işaretliyor. Doğal araştırma yolu her future-calculable-observable satırını gerçek bir diagnostic’e çevirmektir: bir proxy ile bir hesaplama arasındaki boşluk tam olarak etiketlerin görünür kıldığı şeydir.',
          whyItMatters:
            'Dürüst proxy’ler bir başlangıç noktasıdır, bir varış noktası değil. Lab’in "hesaplanmıyor" pill’leri yalnız uyarı değil, aynı zamanda yol haritasıdır. Her biri, bir gelecekteki hesaplamanın aynı yüzeyde gerçek bir okuma olarak ship edebileceği belirli bir niceliği adlandırır (face-area matching, Regge shape matching, closure constraints, twisted-geometry phase space, one-node reduced density matrices, local entanglement entropies, exact LQG expectation values).',
          inThisApp:
            'Bugün her Lab paneli boşluklarını future-calculable-observable proxy kind üzerinden açıkça işaretler. Dürüstlük taksonomisi (pedagogical-proxy / conceptual-diagnostic / curated-classification / future-calculable-observable) boşluğun gizlenmek değil görünür kılınmasını sağlayan disiplindir; Open Problems paneli bu boşlukları tek bir yol haritasında toplayacak.',
          futureWork:
            'Her future-calculable-observable satırı somut bir uygulama hedefidir. Onları teker teker — en sadelerinden başlayarak (sabit-spin bir graph üzerinde face-area matching, ya da tek-düğüm trace operatörleri) — değiştirmek Lab’i pedagojik bir yüzeyden bir araştırma aracına doğru kademeli olarak hareket ettirirdi.',
        },
      },
    },

    /**
     * Faz 8 — Open Problems paneli shell stringleri. Yapı EN ile
     * birebir aynı; per-problem içerik `src/data/openProblems.ts`
     * dosyasında locale-keyed records olarak yaşar.
     */
    openProblems: {
      intro:
        'Bu uygulamanın pedagojik proxy’leri ile yaklaştıkları gerçek LQG observable’ları arasındaki boşluğu haritalandıran sekiz Open Problem. Her kart bir research-paper abstract’ı olarak okunur — gerçek observable ne olurdu, uygulama şu an onun yerine ne yüzeyliyor, hangi fizik eksik, neden önemli ve ileriye dönük bir araştırma yönü.',

      problemListAria: 'Open Problems',
      sourcePanelsLabel: 'Şu panellerde geçer',

      fields: {
        realObservable: 'Real observable',
        proxyUsed: 'Uygulamadaki proxy',
        missingPhysics: 'Eksik fizik',
        whyItMatters: 'Neden önemli',
        researchDirection: 'Araştırma yönü',
      },
    },

    panels: {
      gluing: {
        label: 'Gluing Diagnostics',
        shortGoal:
          'Paylaşılan yüzler arasındaki entanglement-induced gluing için pair bazlı ve toplam sinyaller.',
        placeholder:
          'Gelecek panel: proxy olarak yeniden okunan pair bazlı gluing skorları, toplam gluing kuvveti, ve toy alignment proxy ile hesaplanabilir bir cross-face inner product arasındaki bilinçli ayrım.',
      },
      symmetry: {
        label: 'Symmetry / Automorphism',
        shortGoal:
          'Aktif state’in seçili topology’nin graph automorphism grubuna ne kadar saygı gösterdiği.',
        placeholder:
          'Gelecek panel: aktif topology’nin automorphism grubu, denklik sınıfı raporu, ve state’in tam simetrik mi, kısmen simetrik mi yoksa simetri kıran mı olduğunu söyleyen bir conceptual diagnostic.',
      },
      effectiveGeometry: {
        label: 'Effective Geometry',
        shortGoal:
          'Aynı kombinatoryal veri üzerinde vector-geometry vs Regge-geometry yarı-klasik okumalar.',
        placeholder:
          'Gelecek panel: yan yana vector-geometry vs Regge-geometry özetleri, dipole üzerinde spherical-tetrahedron okuması ve düğüm bazlı twisted-geometry eskizi.',
      },
      correlations: {
        label: 'Correlation Summary',
        shortGoal:
          'Pair bazlı korelasyon tablosu ve family’nin ne kadar yerelleşmiş ya da dağınık olduğunun toplam proxy’si.',
        placeholder:
          'Gelecek panel: hücre başına proxy rozeti taşıyan 4×4 pair-correlation matrisi, toplam dağınıklık / yerelleşme etiketleri ve tek-düğüm entanglement-entropy proxy’si.',
      },
      researchNotes: {
        label: 'Research Notes',
        shortGoal:
          'Her Lab diagnostic’ini en yakın LQG literatürüne bağlayan, yazarın koruduğu küratoryal notlar.',
        placeholder:
          'Gelecek panel: adlandırılmış iddiaların curated-classification indeksi (Bell-network states, entanglement-induced gluing, vector vs Regge geometry, dipole effective geometry, correlations and cosmology) — kısa işaretler, yeni fizik üretimi yok.',
      },
      openProblems: {
        label: 'Open Problems',
        shortGoal:
          'Lab’ın dürüstçe hesaplayabileceği ama henüz hesaplamadığı nicelikler — boşluk görünür kalsın diye etiketlenir.',
        placeholder:
          'Gelecek panel: future calculable observable listesi — tek-düğüm entropy’si, intertwiner correlator’ları, automorphism-invariant momentler, Regge-vs-vector mismatch — her biri dürüstçe ship edilebilmesi için gereken şeyle birlikte etiketlenir.',
      },
    },
  },

  theoryCards: {
    theoryNotesTitle: 'Teori Notları',
    theoryNotesPill: 'Giriş',
    theoryNotesP1a: 'Loop quantum gravity’de bir ',
    theoryNotesP1b:
      ' basis state, her kenara bir SU(2) temsili ve her düğüme bir ',
    theoryNotesP1c:
      ' atar. Böyle bir basis state elementer yüzlerin alanlarını sabitler; ancak tek başına komşu düğümlerdeki quantum polyhedra’yı ',
    theoryNotesP1notEm: 'entangle',
    theoryNotesP1d:
      ' etmez — face normal’ları temelde bağımsız dalgalanır.',
    theoryNotesP2a: 'Bell-network state’leri',
    theoryNotesP2b:
      ' bu polyhedra arasında korelasyon üreten süperpozisyonlardır. ',
    theoryNotesP2c:
      ' — iki düğüm ve bunları bağlayan dört paralel kenar — bu davranışın görülebildiği minimal yapıdır ve yukarıdaki canvas’taki nesnedir.',

    whyMattersTitle: 'Neden Önemli',
    whyMattersPill: 'Motivasyon',
    whyMattersP1a: 'Genel bir spin-network basis state komşu quantum polyhedra’yı ',
    whyMattersP1notStrong: 'birbirine bağlamaz',
    whyMattersP1b:
      ' — face normal’ları bağımsız dalgalanır. ',
    whyMattersP1c: 'Bell-network benzeri korelasyonlar',
    whyMattersP1d:
      ' bu tabloyu değiştirir: paylaşılan yüzeyin iki yanındaki normal’ları birbirine bağlar, böylece eşleşen yüzler — iki polyhedron gerçekten ',
    whyMattersP1e: 'glued',
    whyMattersP1f:
      ' olduğunda beklediğimiz gibi — sırt sırta yönlenme eğilimi gösterir.',
    whyMattersP2a: 'Strength kaydırıcısını oynatmak bu iddiayı ',
    whyMattersP2feelEm: 'hissetmeni',
    whyMattersP2b:
      ' sağlar: düşük strength’te normal’lar dağılır, Bell-like symmetric family’de yüksek strength’te temiz bir back-to-back kilide geçerler. Bu tam bir LQG hesabı değildir; ekranda test edilebilir biçimde ',
    whyMattersP2strong: 'entanglement ≈ geometric gluing',
    whyMattersP2c: ' sezgisini taşıyan pedagojik bir araçtır.',

    familyCompTitle: 'Family Karşılaştırması',
    familyCompPill: 'Referans',
    familyCompIntro:
      'Farklı korelasyon örüntüleri aynı toplam strength’te bile farklı geometrik sezgiler üretir. Family seçicisi bu deterministik toy preset’ler arasında geçiş yapar:',
    familyCompActive: 'aktif',

    obsNotesTitle: 'Observable Notları',
    obsNotesPill: 'Lens’ler',
    obsNotesP1a: 'Bu arayüz loop quantum gravity’nin gerçek spektral veya geometrik operatörlerini ',
    obsNotesP1notStrong: 'hesaplamaz',
    obsNotesP1b:
      '. Bunun yerine okunabilir, küçük bir toy ',
    obsNotesP1c: 'lens',
    obsNotesP1d:
      ' takımı sunar — aynı temel state’e farklı sorular sorar.',
    obsNotesP2a: 'Sabit bir ',
    obsNotesP2b: 'state family',
    obsNotesP2c: ' üzerinde lens değiştirmek, o family’nin hangi yönü öne çıkardığını gösterir: ',
    obsNotesP2bellEm: 'Bell-like symmetric',
    obsNotesP2d: ' family her lens altında iyi okunur; ',
    obsNotesP2frustEm: 'Frustrated',
    obsNotesP2e: ' alignment’ta temiz ama uniformity’de zayıf skor verir; ',
    obsNotesP2edgeEm: 'Edge-biased',
    obsNotesP2f: ' ise correlation range üzerinde parlar.',
  },

  graphSymmetry: {
    heading: 'Dipole automorphism',
    aria: 'Dipole automorphism görselleştirmesi',
    miniAria: (left: string, right: string) =>
      `${left} ↔ ${right} etiketli mini dipole`,
    arrowCaption: 'A ↔ B değişimi',
    caption:
      'Node A ile Node B’yi yer değiştirmek graph’ın yapısını değiştirmez: aynı dört kenar hâlâ aynı düğüm çiftini bağlar ve bir küme olarak kendilerine haritalanır. Bu yeniden etiketleme bir graph automorphism’idir. Bu otomorfizmaya uyan bir state, dipole’un doğal simetrisi altında simetriktir — Bell-like symmetric family’nin tam da yapmaya çalıştığı şey budur.',
  },

  levelComparison: {
    heading: 'Üç düzey, tek araç',
    aria: 'Bu aracın kapsadığı düzeyler',
    caption:
      'Demo, pair düzeyi sütununda sağlam biçimde oturur, graph düzeyine (state family’ler ve automorphism fikri üzerinden) biraz uzanır ve cosmology sütununa yalnızca analoji yoluyla değinir. Bu üç düzeyi birbirine karıştırmamak mücadelenin yarısıdır.',
    pairLevel: 'Pair düzeyi',
    pairScope: 'Doğrudan modelleniyor',
    pairBullets: [
      'yerel strength',
      'mismatch açısı',
      'yerel alignment score',
      'tek pair için gluing proxy',
    ],
    graphLevel: 'Graph düzeyi',
    graphScope: 'Kısmen modelleniyor (yalnızca dipole)',
    graphBullets: [
      'automorphism değişmezliği',
      'düğüm / kenar denklik sınıfları',
      'state graph’ın simetrisine uyar ya da uymaz',
      'pair’lar arasında cohesion',
    ],
    cosmologyLevel: 'Cosmology düzeyi',
    cosmologyScope: 'Burada kapsam dışı',
    cosmologyBullets: [
      'sürekli homogeneity & isotropy',
      'klasik uzaya coarse-graining',
      'madde içeriği ve dinamik',
      'lattice / büyük graph limitleri',
    ],
  },
};
