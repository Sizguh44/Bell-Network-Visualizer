import type { BridgeLesson } from '../../types/bridge';

/**
 * Türkçe bridge lesson içeriği.
 *
 * Çeviri ilkesi: teknik fizik terimleri (spin network, Bell-network, face
 * pair, gluing, anti-parallel alignment, state family, observable lens,
 * dipole graph, cycle graph, vector geometry, Regge geometry, intertwiner,
 * automorphism, homogeneity, cosmology, loop quantum gravity, Hilbert space,
 * SU(2), polyhedron, cohesion, mismatch, alignment score, gluing proxy)
 * İngilizce kalır. Geri kalan tüm anlatım Türkçedir. Lesson id, sıra,
 * widget, optionalSetupConfig, relatedConceptIds, relatedLessonIds,
 * suggestedChallengeIds ve prev/next zinciri EN versiyonuyla birebir aynıdır.
 */
export const BRIDGE_LESSONS_TR: readonly BridgeLesson[] = [
  {
    id: 'local-vs-global',
    order: 1,
    title: 'Yerel ilişki ile küresel yapı',
    shortGoal:
      'İyi hizalanmış tek bir pair’ın graph’ı iyi glued yapmadığını gör.',
    narrative: [
      'Bu aracın şimdiye kadarki odağı tek tek [[face-pair|face pair]]’lardaydı — bir pair’ın normal’larının nasıl hizalandığı, mismatch açısının nasıl davrandığı, yerel strength’inin komşularıyla nasıl karşılaştırıldığı. Bu, *gluing*’in bir pair düzeyi koşulu olduğu sezgisini kurar.',
      'Büyük ölçek yapısı ise farklı bir sorudur. Bir graph pair düzeyi hizalanmasını sağlayıp yine de simetrik, tutarlı bir quantum geometry olmayı başaramayabilir — pair’lar birbirine yanlış ilişkiliyse. Aynı şekilde, bazı pair metriklerinde zayıf olup yine de önemli, bariz bir küresel yapı taşıyabilir.',
      'Pair düzeyi gözlemler gerekli girdilerdir, graph düzeyi iddialar değil. Bu Bridge lesson’lar bu graph düzeyi iddialarının bir kaçında yürüyüşe çıkar — "yerel koşul sağlanıyor" ile "küresel simetri sağlanıyor" arasındaki farkla başlayarak.',
    ],
    keyIdea:
      'Pair düzeyi başarı, graph düzeyi yapıyı otomatik olarak getirmez. İkisi de önemlidir; ayrı sorulardır.',
    commonConfusion:
      'Dipole canvas’ında dört anti-parallel pair görmek, tek başına state’i "cosmologically homogeneous" yapmaz — yalnız dört yerel [[gluing|gluing]] koşulunun sağlandığı anlamına gelir.',
    actionPrompt:
      'Önerilen setup’ı uygula (0.9 strength’te Bell-like symmetric). Her pair kilitli görünüyor. Şimdi kendine sor: bu state’e graph-teorisi anlamında yapısal olarak simetrik demek için *başka* ne gerekirdi?',
    reflectionPrompts: [
      'Tek bir pair iyi hizalanmışsa, bu tüm graph’ı homogeneous yapmaya yeter mi?',
      'Yerel pair desteğinden gerçekten simetrik bir graph state’e geçmek için hangi ek bileşen gereklidir?',
      'Her pair’ın iyi hizalandığı ama küresel yapının hâlâ asimetrik kaldığı bir graph hayal edebilir misin?',
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
    title: 'Bir graph üzerinde simetri ne demek?',
    shortGoal:
      'Graph simetrisini dipole’un kendi simetrisi üzerinden tanıt.',
    narrative: [
      'Bir graph’ın simetrisi, düğümlerin ve kenarların yeniden etiketlenmesidir — bağlantı yapısını koruyacak şekilde. [[dipole-graph|Dipole graph]]’da iki bariz yeniden etiketleme vardır: Node A ile Node B’yi değiş tokuş et, ya da dört kenarı kendi aralarında permüte et.',
      'Her iki operasyon da graph’ı kombinatoryel bir nesne olarak dokunulmaz bırakır. Bunlara [[automorphism|automorphism]] denir. Gayriresmi söyleyişle: graph, yeniden etiketlendiğini bilmez.',
      'Bu neden önemli? Graph üzerindeki fiziksel bir state bu automorphism’lara uyabilir ya da onları bozabilir. Bell-like symmetric state dipole’un automorphism’larına uyar. Frustrated ya da Edge-biased ise bazılarını bozar. "Simetrik graph" ile "graph üzerinde simetrik state" arasındaki ayrım, bundan sonra gelen her şeyin tohumudur.',
    ],
    keyIdea:
      'Bir graph automorphism’ı, graph’ın yapısını koruyan bir yeniden etiketlemedir. Simetrik state ise içeriği bu yeniden etiketlemeler altında değişmeyen state’tir.',
    commonConfusion:
      'Graph’ın simetrisi, state’in simetrisiyle aynı şey değildir. Dipole’un kendisi her zaman tam simetriktir; *state*’imizin bu simetriye uyup uymadığı ise seçtiğimiz family’ye bağlıdır.',
    actionPrompt:
      'Concept Atlas’ı aç ve [[automorphism|automorphism]] girdisini oku. Sonra Bell-like symmetric ile Edge-biased family’leri arasında geçiş yap. Graph değişmedi; yalnız state, graph’ın izin verdiği bir simetriyi bozuyor.',
    reflectionPrompts: [
      'Beş state family’den hangileri dipole’un simetrisini en belirgin biçimde bozar?',
      'Graph automorphism’ları neden dipole’dan daha büyük graph’larda daha önemli olabilir?',
      'Her automorphism’a uyan bir state, her zaman "en iyi" gluing skorunu alır mı?',
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
    title: 'Automorphism’lar ve eşdeğer düğümler',
    shortGoal:
      'Graph simetrilerinin düğümleri ve kenarları denklik sınıflarına nasıl ayırdığını gör.',
    narrative: [
      'Bir automorphism, graph’ın hangi parçalarının birbirinin yerine geçebileceğini tanımlar. Dipole’da Node A ve Node B, A↔B değişimi altında birbirinin yerine geçebilir. Dört kenar da kenar permütasyonları altında kendi aralarında birbirinin yerine geçebilir.',
      '"Birbirinin yerine geçebilir" olma [[homogeneity|homogeneity]]’nin tohumudur. Daha büyük bir graph’ta — örneğin çok sayıda düğümlü bir lattice’te — automorphism’lar ötelemeler, rotasyonlar ve diğer etiket yeniden atamaları olurdu. Hepsi altında değişmez kalan bir state, ayrık anlamda "homogeneous"tur.',
      'Dipole, bu mantığın yüzünü gösterdiği en küçük graph’tır. Kaba, evet — yalnız iki düğüm — ama şimdiden önemsiz değil: A ile B’yi değiştirmek bir şeydir ve kenar permütasyon grubu S₄’tür.',
    ],
    keyIdea:
      'Automorphism’lar graph’ı denklik sınıflarına böler. Homogeneity, state’in eşdeğer her öğeye aynı muameleyi yapmasını ister.',
    commonConfusion:
      'İki düğümün "bir automorphism altında eşdeğer" olması, aynı düğüm olduğu anlamına gelmez. Bu, yer değiştirdiklerinde hem graph’ın hem state’in korunduğu anlamına gelir.',
    actionPrompt:
      'Aşağıdaki mini GraphSymmetryCard’ı oku. A ↔ B değişimini görselleştirir. Tek tek etiketler yer değiştirse bile dört kenarın bir *küme* olarak kendilerine nasıl haritalandığına dikkat et.',
    reflectionPrompts: [
      'Dipole’un tam automorphism grubunu tarif edebilir misin? (İpucu: düğüm değişimi × kenar permütasyonları.)',
      'Buradaki state family’lerden hangileri dipole’un *tüm* automorphism grubu altında değişmezdir?',
      'İki dipole’u birbirine yapıştırsan, birleştirilmiş graph’ın automorphism’ları orijinal dipole’unkilerle nasıl karşılaştırılır?',
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
    title: 'Homogeneity sadece "her şey aynı görünür" demek değildir',
    shortGoal:
      'Görsel uniformity ile yapısal homogeneity’i birbirinden ayır.',
    narrative: [
      '[[homogeneity|Homogeneity]] için yaygın bir başlangıç okuması "her parça diğerlerine benzer" şeklindedir. Bu yanlış değil — ama daha derin bir yapısal iddianın sonucudur, tanımı değildir.',
      'Yapısal olarak, bir graph üzerindeki homogeneous bir state, graph’ın automorphism’ları altında değişmez olan state’tir. Birbirinin yerine geçebilen iki düğüm aynı yerel veriyi taşımalı; birbirine permüte olan iki kenar aynı paylaşılan yapıyı taşımalıdır.',
      'Dipole’da Bell-like symmetric family buna yaklaşır: dört pair da eşit muamele görür; Node A ve Node B simetrik roller oynar. Frustrated ve Edge-biased bunu farklı biçimlerde bozar — biri iki pair’ı özel kılarak, öteki bir tarafa üstünlük vererek.',
    ],
    keyIdea:
      'Homogeneity bir değişmezlik özelliğidir, görsel uniformity değil. State, graph’ın simetrileriyle komütatif olmalıdır.',
    commonConfusion:
      '"Homogeneous" bir state’in, her pair’ın tesadüfen aynı sayıları göstermesi demek olmadığını bilmek gerekir — demek istenen şey, herhangi bir automorphism’ın state’i değiştirmeyecek biçimde *tanımlanmış* olmasıdır.',
    actionPrompt:
      '0.5 strength’te family’ler arasında geçiş yap. O strength’te dipole’un tam simetrisine görünür biçimde uyan tek family Bell-like symmetric’tir. Diğer family’lerin bu değişmezliği belirli, tanınabilir biçimlerde nasıl bozduğuna dikkat et.',
    reflectionPrompts: [
      'Bir state canvas’ta homojen görünüyorsa, ona homogeneous demek yeterli mi?',
      'Bir state graph automorphism’ları altında homogeneous olup yine de Gluing lens altında düşük skor alabilir mi? Neden ya da neden olmaz?',
      '100 düğümlü bir graph üzerinde bir state’in homogeneous olup olmadığını prensipte nasıl kontrol ederdin?',
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
    title:
      'Toy yerel gluing, cosmology düşüncesi için neden hâlâ önemli olabilir',
    shortGoal:
      'Demoyu, ortaya çıkan geometry anlatısıyla birleştir.',
    narrative: [
      'Klasik bir cosmology modeli büyük ölçeklerde homogeneous ve isotropic’tir. Quantum gravity’de, bu özelliğin postüle edilmesini değil, ayrık bir quantum altyapıdan — bir spin network ya da lattice state’ten — *ortaya çıkmasını* bekleriz.',
      'Yönlendirici fikirlerden biri, komşu polyhedra arasındaki [[entanglement|entanglement]]’ın, komşu bölgeleri tutarlı bir klasik geometry’de birleştiren mikroskobik mekanizma olduğudur. Tam teori ölçeğinde bu gluing, tek bir dipole üzerinde değil, büyük ve zengin simetrili graph’lar üzerinde olmak zorundadır.',
      'Ama mantık genelleşir. Dipole üzerinde bile (a) güçlü korelasyonların back-to-back bir geometrik resmi nasıl kurduğunu, (b) eşitsiz korelasyonların bunu nasıl bozduğunu ve (c) state’in graph simetrilerine nasıl uyduğunu ya da bozduğunu görürsün. Bunlar tam teori versiyonunun da sorduğu sorulardır — yalnız büyük graph’lar yerine çok küçük graph’lar üzerinde.',
    ],
    keyIdea:
      'Dipole, quantum gravity’de tekrar eden bir örüntünün minyatür laboratuvarıdır: mikro düzeyde korelasyonlar → makro düzeyde geometrik düzenlilik.',
    commonConfusion:
      'Bell-like symmetric bir dipole izlemek cosmological homogeneity’i ortaya koymaz. Bir analoji kurar — ve ölçekte doğrulamak istenecek sezgiler için bir test yatağı.',
    actionPrompt:
      '0.9 strength’te Bell-like symmetric’te kal. Her biri aynı Bell-like state’te olan 100 kopya dipole’dan oluşan bir graph hayal et. Bu birleştirilmiş graph’ın automorphism grubu nasıl görünürdü ve orada "homogeneous" ne anlama gelirdi?',
    reflectionPrompts: [
      'Bir toy truncation yine de faydalı yapısal dersler öğretebilir mi?',
      'Dipole üzerinde kurduğun sezgilerden hangilerinin daha büyük graph’larda yaşamaya devam etmesini beklersin?',
      'Hangileri muhtemelen yaşamaz?',
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
    title:
      'Bu uygulama neden hâlâ tam cosmology state’lerine ulaşmıyor',
    shortGoal:
      'Dipole truncation’ın dışarıda bıraktıkları konusunda dürüst ol.',
    narrative: [
      'Bu aracın tek bir [[dipole-graph|dipole graph]]’ı var. Lattice yok, sürekli simetri grupları yok, Wilsonian coarse-graining yok, dinamik yok. Bu çok sayıda "yok" demektir.',
      'Dipole’un *yaptığı* şey, tek bir kavramsal hamleyi izole etmektir — yerel entanglement ile, büyük ölçeklerde klasik uzay olarak ortaya çıkması umulan geometrik gluing arasındaki ilişki. Başka her şey soyulmuştur ki bu tek hamle okunabilsin.',
      'Loop quantum gravity’deki gerçek bir cosmology state’i çok daha zengin bir graph üzerinde yaşar, çoğunlukla sürekli gauge ve diffeomorphism kısıtları taşır ve isotropy, matter content gibi büyük ölçek özelliklerine uymak zorundadır. Bunların hiçbiri burada modellenmedi — ve bu Bridge lesson da seni "modellendi" izlenimiyle bırakmamak için var.',
    ],
    keyIdea:
      'Dipole pedagojik bir truncation’dır. Daha büyük hikâyenin tek bir yönüne sadıktır ve geri kalanların çoğunda sessizdir.',
    commonConfusion:
      'Dipole üzerinde tam simetrik bir Bell-like state, kendi başına bir "cosmology çözümü" değildir — çok daha büyük bir hikâyedeki tek veri noktasıdır ve bu uygulama onu bilerek anlatmaz.',
    actionPrompt:
      'Bu lesson’ı kapat ve Concept Atlas’tan "homogeneity" girdisini aç. *In full theory* bölümünü dikkatle oku — bu bridge’in geçmediği boşluğu adlandırır.',
    reflectionPrompts: [
      'Minimal bir "cosmology" toy’u bu demonun sağladıklarının ötesinde hangi ek yapıyı isterdi?',
      'State family fikrini 20 düğümlü bir graph’a nasıl genişletirdin?',
      'Orada bile hâlâ neyi elde etmezdin?',
    ],
    relatedConceptIds: ['dipole-graph', 'homogeneity', 'regge-geometry'],
    relatedLessonIds: ['alignment-vs-shape', 'why-it-matters'],
    prevBridgeLessonId: 'cosmology-bridge-value',
    nextBridgeLessonId: 'larger-graph-symmetry',
  },

  {
    id: 'larger-graph-symmetry',
    order: 7,
    title:
      'Homogeneity daha büyük graph’larda neden daha anlamlı hale geliyor',
    shortGoal:
      'Graph büyüdükçe simetri sorusunun nasıl diş gösterdiğini gör.',
    narrative: [
      '[[dipole-graph|Dipole]] üzerinde [[automorphism|automorphism]] grubu küçüktür — düğüm değişimi × kenar permütasyonları. Bir family’nin bu simetriye uyma iddiası neredeyse ilk bakışta kontrol edilebilir ve "[[homogeneity|homogeneity]]" aşağı yukarı "dört pair’a eşit muamele et" haline çöker.',
      '[[graph-topology|Cycle Graph (4)]] bunu şimdiden ileri taşır. Automorphism’lar artık dört rotasyon ve dört yansıma içerir — dihedral grup D₄. Bir state rotasyon değişmezliğine uyup yansıma değişmezliğini bozabilir ya da tersi. "Homogeneity" birden çok denk olmayan anlama bölünür.',
      'Büyük graph’ların ittiği yön budur. Gerçek cosmology lattice’lerinde automorphism grubu, homogeneity’nin birçok önemsiz olmayan özel duruma sahip gerçek bir kısıt haline geldiği kadar zengindir. Cycle Graph (4), bu durumun küçük, elle tutulabilir bir önizlemesidir.',
    ],
    keyIdea:
      'Daha zengin automorphism grupları homogeneity’e önemsiz olmayan bir içerik verir. Dipole’da kısıt neredeyse boştur; Cycle Graph (4)’te takip edilecek ayrı alt gruplara bölünür bile.',
    commonConfusion:
      'Daha büyük bir graph, state’leri otomatik olarak sınıflandırmayı kolaylaştırmaz. Çoğu zaman tersi: daha fazla simetri, bir state’in bazı değişmezlikleri korurken başkalarını bozmasının daha çok yolu olması demektir. "Simetrik", tek bir kutucuk yerine birden çok tada sahip bir sıfata dönüşür.',
    actionPrompt:
      'Önerilen setup’ı uygula (Cycle Graph (4) üzerinde 0.8 strength’te Bell-like symmetric, Uniformity lens). Edge-biased’a çevir ve ring’in hangi rotasyonlarına state’in hâlâ uyduğunu, hangilerine uymadığını not et.',
    reflectionPrompts: [
      'Cycle Graph (4) üzerinde bir state 180° rotasyon altında değişmez olup 90° rotasyon altında olmayabilir mi? Bu nasıl görünürdü?',
      'Beş family’den hangileri Cycle Graph (4)’ün tam D₄ simetrisine uyar?',
      '"Homogeneous Cycle (4) state’lerinin uzayı" neye benzerdi ve nasıl bir büyüklük hissi verirdi?',
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
