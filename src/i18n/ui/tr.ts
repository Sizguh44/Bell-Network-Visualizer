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
