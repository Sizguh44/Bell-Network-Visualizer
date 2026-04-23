import type { Lesson } from '../../types/learning';

/**
 * Türkçe lesson içeriği.
 *
 * Çeviri ilkesi: belirli teknik fizik terimleri (spin network, Bell-network,
 * face pair, gluing, anti-parallel alignment, state family, observable lens,
 * dipole graph, cycle graph, vector geometry, Regge geometry, intertwiner,
 * automorphism, homogeneity, cosmology, loop quantum gravity, Hilbert space,
 * SU(2), polyhedron, cohesion, mismatch angle, alignment score, gluing proxy)
 * İngilizce kalır. Geri kalan tüm anlatım, bağlantılar ve arayüz metinleri
 * Türkçedir. Lesson id'leri, sıraları ve prev/next zinciri `en/lessons.ts`
 * ile birebir aynıdır.
 */
export const LESSONS_TR: readonly Lesson[] = [
  {
    id: 'intro-dipole',
    order: 1,
    title: 'Dipole graph nedir?',
    shortGoal:
      'Bu demo’nun üzerine oturduğu iki-düğüm, dört-kenar nesnesiyle tanış.',
    conceptTags: ['dipole-graph', 'face-pair', 'vector-geometry'],
    narrative: [
      '[[dipole-graph|Dipole graph]], en küçük anlamlı [[spin-network|spin network]]’tür: iki düğüm ve onları bağlayan dört paralel kenar. Her düğüm bir quantum polyhedron’u, her kenar iki polyhedron arasında paylaşılan bir yüzü temsil eder.',
      'Yukarıdaki canvas’ta bu dört [[face-pair|face pair]], iki dairesel düğüm arasında eğriler olarak görünür. Her eğri üzerinde iki küçük ok vardır — her düğümden bir tane — ve paylaşılan yüzeyin iki yanındaki face normal’larını temsil ederler.',
      'Bu, iki polyhedron’un yüzleri üzerinden “glued” olmasından anlamlı biçimde söz edebildiğimiz en küçük ortamdır. Buna rağmen şaşırtıcı miktarda yapı ortaya çıkar.',
    ],
    callouts: [
      {
        kind: 'key',
        body: 'Bir face pair, iki polyhedron arasındaki paylaşılan tek bir yüzdür. Dipole’da böyle dört yüz vardır, dolayısıyla dört kenar.',
      },
    ],
    actionPrompt:
      'Canvas’a bak. Dört pair’ı bul — her birinin kendi rengi var ve her pair iki ok artı onları birleştiren eğriden oluşuyor. Şimdilik varsayılan ayarları olduğu gibi bırak.',
    recommendedConfig: {
      stateFamily: 'bellSymmetric',
      entanglementStrength: 0.75,
      observableMode: 'alignment',
      demoMode: true,
    },
    recommendedSelection: null,
    checkpointQuestion: 'Dipole graph kaç face pair içerir?',
    checkpointOptions: [
      {
        id: 'a',
        text: 'İki',
        correct: false,
        feedback:
          'Bu düğüm sayısı olurdu; paylaşılan yüz sayısı değil.',
      },
      {
        id: 'b',
        text: 'Dört',
        correct: true,
        feedback:
          'Doğru. Dört paralel kenar — her biri bir paylaşılan yüz.',
      },
      {
        id: 'c',
        text: 'Altı',
        correct: false,
        feedback:
          'Çok fazla. Dipole, iki düğüm arasında tam olarak dört paralel bağlantıyla tanımlanır.',
      },
    ],
    checkpointExplanation:
      'Dipole graph iki düğüm ve dört paralel kenar içerir. Her kenar, iki polyhedron arasında paylaşılan bir yüzü temsil eder ve o yüzeyin iki yanındaki normal’ları eşler.',
    nextLessonId: 'strength-response',
  },

  {
    id: 'strength-response',
    order: 2,
    title: 'Korelasyon strength’i artınca ne değişir?',
    shortGoal:
      'Strength kaydırıcısını bir tutarlılık (coherence) düğmesi olarak hissetmek.',
    conceptTags: ['entanglement', 'alignment', 'face-pair'],
    narrative: [
      'Bir [[spin-network|spin-network basis state]], kendi başına komşu polyhedra’ları [[entanglement|entangle]] etmez — face normal’ları bağımsız dalgalanır. Entanglement-strength kaydırıcısı s ∈ [0, 1], paylaşılan bir yüzün iki yanındaki normal’ların ne kadar tutarlı biçimde korele olduğunu ölçekleyen bir toy düğmedir.',
      'Düşük strength’te her sağ kol ok, ideal [[alignment|anti-parallel]] partnerinden uzaklaşır. Yüksek strength’te ise oklar back-to-back konuma kilitlenir — “glued” bir geometry’nin görsel proxy’sidir bu.',
      'Kaydırıcıyı 0’a yakın bir yerden 1’e yakın bir yere yavaşça kaydır ve dört pair’ın birbirine yaklaşmasını izle. Bell-like symmetric family’de dört pair da eşit biçimde bu davranışa katılır.',
    ],
    callouts: [
      {
        kind: 'in-demo',
        body: 'Bu demoda strength tek bir skaler. Tam teoride ise korelasyonlar state’in intertwiner-uzayı yapısında yaşar ve tek bir sayı ile yakalanamaz.',
      },
    ],
    actionPrompt:
      'Entanglement strength kaydırıcısını 0.1 ile 0.9 arasında yavaşça oynat. Düşük değerlerde okların nasıl dağıldığına, yüksek değerlerde ise anti-parallel çiftlere nasıl kilitlendiğine dikkat et.',
    recommendedConfig: {
      stateFamily: 'bellSymmetric',
      entanglementStrength: 0.9,
      observableMode: 'alignment',
      demoMode: true,
    },
    recommendedSelection: null,
    checkpointQuestion:
      'Bell-like symmetric family’de 0.9 strength’te dört normal pair’ı çoğunlukla:',
    checkpointOptions: [
      {
        id: 'a',
        text: 'Rastgele, birbiriyle ilgisiz yönlere bakar',
        correct: false,
        feedback:
          'Bu, uncorrelated ya da düşük-strength rejimidir; 0.9’daki Bell-like symmetric değil.',
      },
      {
        id: 'b',
        text: 'Neredeyse anti-parallel yönelimlere kilitlenir',
        correct: true,
        feedback:
          'Doğru. Paylaşılan yüzün iki yanında anti-parallel, glued geometry’nin görsel proxy’sidir.',
      },
      {
        id: 'c',
        text: 'İki yanda da aynı yöne bakar',
        correct: false,
        feedback:
          'Aynı yön, yüzlerin aynı tarafa bakması demektir — gluing bu şekilde çalışmaz.',
      },
    ],
    checkpointExplanation:
      'Bell-like symmetric family’de yüksek strength, her sağ kol oku sol kol partnerinden 180°’ye yakın bir açıya iter. Görünür sonuç dört temiz anti-parallel pair’dır.',
    prevLessonId: 'intro-dipole',
    nextLessonId: 'local-pair-inspection',
  },

  {
    id: 'local-pair-inspection',
    order: 3,
    title: 'Yerel pair incelemesi',
    shortGoal:
      'Pair başına davranışın küresel ortalamayla nasıl uyuşmayabileceğini görmek.',
    conceptTags: ['face-pair', 'alignment', 'observable-lens'],
    narrative: [
      'Küresel ortalamalar pair başına farkları gizler. Her [[face-pair|face pair]]’ın kendi yerel strength’i, kendi mismatch açısı (sağ okun ideal anti-parallel partnerinden derece cinsinden sapması) ve kendi [[alignment|alignment score]]’u vardır.',
      'Önizleme için bir pair’ın üzerine gel; seçimi sabitlemek için tıkla. İstatistiklerin altındaki Face Pair Detail kartı dört yerel metriği gösterir ve bazı family’lerde bu metrikler birbirinden belirgin biçimde ayrışır.',
      'Örneğin Frustrated family’de iki pair temiz biçimde hizalanırken iki tanesi orta düzeyde toplam strength altında bile inatçı şekilde eksen dışında kalır. İncelemek için Pair 2 iyi bir adaydır.',
    ],
    callouts: [
      {
        kind: 'key',
        body: 'Yerel, küreselle aynı şey değildir. Makul bir ortalama, anlamlı pair-başına uyuşmazlığı gizleyebilir — zaten tek tek pair’ları inceleyebilmemizin nedeni tam da budur.',
      },
    ],
    actionPrompt:
      'Canvas’taki ikinci eğriye (Pair 2) tıkla. Face Pair Detail kartı ona sabitlenecek. Mismatch açısını oku — küresel ortalamadan belirgin biçimde yüksek olacak.',
    recommendedConfig: {
      stateFamily: 'frustrated',
      entanglementStrength: 0.7,
      observableMode: 'mismatch',
      demoMode: true,
    },
    recommendedSelection: 'e2',
    checkpointQuestion:
      'Frustrated family’de 0.7 strength’te özel olarak Pair 2 ne gösterir?',
    checkpointOptions: [
      {
        id: 'a',
        text: '0°’ye yakın, küçük bir mismatch açısı',
        correct: false,
        feedback:
          'Bu, hizalanmış pair alt kümesini tanımlar. Pair 2 ise frustrated alt kümededir.',
      },
      {
        id: 'b',
        text: 'Gözle görülür şekilde büyük bir mismatch açısı',
        correct: true,
        feedback:
          'Doğru. Frustrated family dönüşümlü davranır — bazı pair’lar hizalanır, diğerleri geniş bir açı tutar.',
      },
      {
        id: 'c',
        text: 'Sıfır yerel strength',
        correct: false,
        feedback:
          'Yerel strength küresel değere yakın kalır; ayrım strength’te değil, mismatch’tedir.',
      },
    ],
    checkpointExplanation:
      'Toy Frustrated family’de Pair 2 için mismatch katsayısı bilinçli olarak büyüktür. Bu yüzden küresel strength yüksek olsa bile Pair 2 geniş bir mismatch açısını korur — geometrik bir gerilim.',
    prevLessonId: 'strength-response',
    nextLessonId: 'state-families',
  },

  {
    id: 'state-families',
    order: 4,
    title: 'State family’ler: aynı strength, farklı örüntüler',
    shortGoal:
      'Korelasyonların nasıl dağıldığının, ne kadar güçlü olduğu kadar önemli olabileceğini görmek.',
    conceptTags: ['state-family', 'gluing', 'entanglement'],
    narrative: [
      'Strength kaydırıcısı “ne kadar korelasyon var?” sorusunu cevaplar. [[state-family|State family]] ise “bu korelasyon dört pair arasında nasıl dağılıyor?” sorusunu cevaplar. Bunlar bağımsız düğmelerdir.',
      'Sabit bir strength’te family’yi değiştirmek farklı görüntüler üretir: Bell-like symmetric dört pair’ı eşit biçimde birbirine bağlar, Frustrated iki pair’ı inatçı şekilde dışarıda bırakır, Edge-biased ise belirli bir alt kümeyi kayırır.',
      'Observable Summary kartındaki [[gluing|Gluing]] skoru tam da bu farkı yakalar. Ortalama alignment’ı, eşitsiz davranışı cezalandıran bir [[cohesion|cohesion]] terimiyle çarpar — böylece aynı ortalamaya ama farklı örüntüye sahip family’ler farklı gluing skoru alır.',
    ],
    callouts: [
      {
        kind: 'confusion',
        body: 'Sık yapılan karışıklık: “daha fazla entanglement = daha fazla gluing”. Tam olarak değil — yalnızca iyi dağılmış entanglement temiz bir glued görüntüsü üretir. Eşitsiz entanglement bu görüntüyü aktif olarak zedeleyebilir.',
      },
    ],
    actionPrompt:
      'Strength’i 0.7’de bırak. Kenar çubuğundaki pill’leri kullanarak Bell-like symmetric ve Frustrated arasında geçiş yap. Gluing lens’inin status’ünün “strong”dan “fragile”a kaymasını izle.',
    recommendedConfig: {
      stateFamily: 'frustrated',
      entanglementStrength: 0.7,
      observableMode: 'gluing',
      demoMode: true,
    },
    recommendedSelection: null,
    checkpointQuestion:
      'Aynı 0.7 strength’te Bell-like symmetric ile Frustrated’ı Gluing lens altında karşılaştırınca:',
    checkpointOptions: [
      {
        id: 'a',
        text: 'Aynı gluing skorunu üretirler',
        correct: false,
        feedback:
          'Farklı pair-başına örüntüleri vardır; cohesion terimi gluing skorunu birbirinden ayırır.',
      },
      {
        id: 'b',
        text: 'Frustrated, Bell-like symmetric’ten daha yüksek skor alır',
        correct: false,
        feedback:
          'Frustrated’ın iç uyuşmazlığı cohesion’ı düşürür; cohesion düşünce gluing da düşer.',
      },
      {
        id: 'c',
        text: 'Bell-like symmetric, Frustrated’tan daha yüksek skor alır',
        correct: true,
        feedback:
          'Doğru. Gluing için homojen korelasyonlar eşitsiz olanları yener — örüntü önemlidir.',
      },
    ],
    checkpointExplanation:
      'Aynı küresel strength’te Bell-like symmetric dört pair’ı sıkı biçimde hizalı tutarken Frustrated, hizalı ve hizasız iki alt kümeye bölünür. Toy gluing skorundaki cohesion cezası bunu yansıtır.',
    prevLessonId: 'local-pair-inspection',
    nextLessonId: 'observable-lenses',
  },

  {
    id: 'observable-lenses',
    order: 5,
    title: 'Observable lens’ler: aynı state, farklı okumalar',
    shortGoal:
      'Observable lens’in geometry değil, yorum olduğunu fark etmek.',
    conceptTags: ['observable-lens', 'alignment', 'gluing'],
    narrative: [
      'Beş [[observable-lens|observable lens]]’in her biri, aynı toy state’e farklı bir soru sorar. Alignment ortalamada ne kadar anti-parallel olduğumuzu sorar. Mismatch derece cinsinden ne kadar saptığımızı sorar. Gluing tüm dipole’un ne kadar homojen biçimde glued göründüğünü sorar. Correlation her pair’ın ne kadar paylaşılan yapı taşıdığını sorar. Uniformity ise pair’ların birbirine ne kadar benzer davrandığını sorar.',
      'Önemli nokta: lens değiştirmek canvas’taki okları kıpırdatmaz. Yalnız UI’ın hangi pair’ları vurguladığını ve headline sayıyı yeniden okur. Temelindeki state değişmemiştir.',
      'Bu ayrım, kuantum teorisinde bir observable’ın nasıl çalıştığının aynısıdır: aynı state, ölçmeyi seçtiğin operatöre göre çok farklı beklenen değerler verebilir.',
    ],
    callouts: [
      {
        kind: 'in-theory',
        body: 'Tam teoride her observable, state’in Hilbert space’i üzerinde etki eden farklı bir operatöre karşılık gelir. Burada ise yalnızca UI’ın neyi raporladığını değiştiriyoruz.',
      },
    ],
    actionPrompt:
      'Kenar çubuğundaki dropdown ile beş observable’ı sırayla dolaş. Oklar yerinde kalırken headline’ın nasıl değiştiğini izle.',
    recommendedConfig: {
      stateFamily: 'edgeBiased',
      entanglementStrength: 0.65,
      observableMode: 'alignment',
      demoMode: true,
    },
    recommendedSelection: null,
    checkpointQuestion: 'Observable lens’i değiştirmek:',
    checkpointOptions: [
      {
        id: 'a',
        text: 'Canvas’taki okları döndürür',
        correct: false,
        feedback:
          'Okları family ve strength sabitler; lens değil.',
      },
      {
        id: 'b',
        text: 'Yalnızca UI’ın state’in hangi yönünü vurguladığını değiştirir',
        correct: true,
        feedback: 'Doğru. Observable lens yorumdur, geometry değil.',
      },
      {
        id: 'c',
        text: 'Yeni bir rastgele state’e geçer',
        correct: false,
        feedback:
          'Bu toy’da hiçbir şey rastgele değil — tüm çıktılar family, strength ve lens’in deterministik fonksiyonlarıdır.',
      },
    ],
    checkpointExplanation:
      'Observable lens, UI’ın raporladığı şeyi değiştirir — headline, status, pair başına vurgu. Ama family’yi, strength’i ya da geometry’yi değiştirmez. Aynı state, farklı okuma.',
    prevLessonId: 'state-families',
    nextLessonId: 'alignment-vs-shape',
  },

  {
    id: 'alignment-vs-shape',
    order: 6,
    title: 'Alignment henüz tam şekil eşleşmesi değildir',
    shortGoal:
      'Bu toy’un nerede bitip gerçek Regge geometry’nin nerede başladığını dürüstçe görmek.',
    conceptTags: ['alignment', 'regge-geometry', 'gluing'],
    narrative: [
      'Paylaşılan yüzeyin iki yanındaki face normal’ların [[alignment|anti-parallel]] olması, iki polyhedron’u [[gluing|gluing]] için gerekli koşullardan biridir — ama hikâyenin tamamı değildir. Klasik [[regge-geometry|Regge geometry]] yüzlerin şekil bakımından da eşleşmesini ister: eşit alanlar, tutarlı dihedral açılar, uyumlu triangulation.',
      'Bu toy yalnızca face normal’ları arasındaki açısal ilişkiyi takip eder. En temiz Bell-like symmetric rejimde 1.0 strength’te bile alignment skoru 1.0’a yakın doyarken bu, tam Regge gluing’in bir sertifikası değildir.',
      'Bu demoyu destek tekerlekleri gibi düşün: önce yön sezgisini kuruyor, şekil eşleşmesi koşullarını sonraya bırakıyor.',
    ],
    callouts: [
      {
        kind: 'in-theory',
        body: 'Regge calculus’te tam şekil eşleşmesi ayrıca glued yüzler arasında alanların ve dihedral açıların eşleşmesini de gerektirir. Toy’umuz yalnız normal’ları ele alır.',
      },
      {
        kind: 'key',
        body: 'Buradaki yüksek alignment, gluing için gerekli koşuldur — yeterli değildir.',
      },
    ],
    actionPrompt:
      'Bell-like symmetric, 1.0 strength, Alignment lens’i uygula. Headline’ın 1.000’e çok yaklaştığını gör — ama toy’un neyi kontrol etmediğini düşün.',
    recommendedConfig: {
      stateFamily: 'bellSymmetric',
      entanglementStrength: 1.0,
      observableMode: 'alignment',
      demoMode: true,
    },
    recommendedSelection: null,
    checkpointQuestion:
      'Face normal’ların anti-parallel alignment’ı:',
    checkpointOptions: [
      {
        id: 'a',
        text: 'Tam Regge gluing için tek başına yeterlidir',
        correct: false,
        feedback:
          'Regge gluing ayrıca eşleşen alanlar ve dihedral açılar ister — alignment tablonun yalnız bir parçasıdır.',
      },
      {
        id: 'b',
        text: 'Gerekli olan birkaç koşuldan biridir',
        correct: true,
        feedback:
          'Doğru. Alignment gluing için gereklidir ama yeterli değildir.',
      },
      {
        id: 'c',
        text: 'Geometrik gluing ile ilgisizdir',
        correct: false,
        feedback:
          'Kesinlikle ilgili — yalnızca tek başına yeterli değil.',
      },
    ],
    checkpointExplanation:
      'Bu toy, yüz yönüne dair tek bir kısıtı yakalar. Fiziksel olarak eksiksiz bir gluing hikâyesi eşleşen yüzlerin alanlarının aynı olmasını ve dihedral açıların tutarlı olmasını da talep eder — bu demo’nun uygulamadığı Regge-stili bir şekil eşleşmesidir.',
    prevLessonId: 'observable-lenses',
    nextLessonId: 'why-it-matters',
  },

  {
    id: 'why-it-matters',
    order: 7,
    title: 'Yerel geometrik korelasyon neden önemli?',
    shortGoal:
      'Bu demoyu, klasik geometri’nin nasıl ortaya çıktığı sorusunun içine yerleştirmek.',
    conceptTags: ['gluing', 'regge-geometry', 'state-family'],
    narrative: [
      'Quantum gravity’de tekrar eden bir tema, klasik geometry’nin daha temel bir quantum altyapıdaki korelasyonlardan ortaya çıkması gerektiğidir. Komşu quantum polyhedra arasındaki [[entanglement|entanglement]] — örneğin [[bell-network|Bell-network state]]’leri üzerinden — makro ölçekte düzgün uzaya benzeyen, mikro düzeydeki yapıştırıcı için somut bir öneridir.',
      'Bu arayüz, o hikâyedeki tek bir veri noktasıdır: korelasyonu face pair’lar arasında dağıtmanın glued-polyhedra görüntüsünü nasıl daha ikna edici ya da daha zayıf kıldığını ve farklı observable’ların aynı state’i nasıl farklı okuduğunu deterministik ve görsel biçimde gösterir.',
      'El tutuşmanın sona ermesine hazır olduğunda Explore moduna geç. Burada öğrendiğin her şey — strength ile örüntü ayrımı, yerel ile küresel ayrımı, observable’ın yorum olarak davranması — orada da geçerliliğini korur.',
    ],
    callouts: [
      {
        kind: 'key',
        body: 'Entanglement örüntüsü ≠ entanglement strength. İkisi de önemlidir. Toy, bu farkı hissetmek için bir yerdir.',
      },
    ],
    actionPrompt:
      'Tüm resmi zihninde tutarak kontrollere bir kez daha bak. Kapanış için Bell-like symmetric’i Gluing lens altında 0.9 strength’te dene.',
    recommendedConfig: {
      stateFamily: 'bellSymmetric',
      entanglementStrength: 0.9,
      observableMode: 'gluing',
      demoMode: true,
    },
    recommendedSelection: null,
    checkpointQuestion: 'Bu toy’da gluingScore şudur:',
    checkpointOptions: [
      {
        id: 'a',
        text: 'Yarı-klasik geometry’nin entanglement’tan ortaya çıktığının kanıtı',
        correct: false,
        feedback:
          'Toy hiçbir şey kanıtlamaz. Sezginin tek bir yönünü görselleştirir.',
      },
      {
        id: 'b',
        text: '“Glued polyhedra” sezgisi için bir proxy, bir LQG observable’ı değil',
        correct: true,
        feedback:
          'Doğru. Sezgiyi iletir; hesaplanmış bir LQG büyüklüğü değildir.',
      },
      {
        id: 'c',
        text: 'Intertwiner’lardan hesaplanmış tam bir LQG observable’ı',
        correct: false,
        feedback:
          'Toy’un tam olarak yapmadığı şey budur. Fizik doğruluğuyla bir implementasyon future work’tür.',
      },
    ],
    checkpointExplanation:
      'GluingScore pedagojik bir proxy’dir. Doğru nitel yönde tepki verir — iyi alignment’la yükselir, eşitsiz örüntülerde düşer — ama gerçek bir LQG observable’ı değildir. Bu tasarım gereği dürüstlüktür: demo sonuç kanıtlamak için değil, sezgi oluşturmak için vardır.',
    prevLessonId: 'alignment-vs-shape',
    nextLessonId: 'topology-upgrade',
  },

  {
    id: 'topology-upgrade',
    order: 8,
    title: 'Aynı family, farklı topology',
    shortGoal:
      'Bir family daha büyük bir graph üzerinde yaşarken neyin değiştiğini hissetmek.',
    conceptTags: ['state-family', 'graph-topology', 'dipole-graph', 'automorphism'],
    narrative: [
      'Şu ana kadar kurduğumuz her şey [[dipole-graph|dipole]] üzerindeydi — iki düğüm, dört paralel kenar. [[state-family|State family]] seçimi, korelasyonları bu dört pair arasında dağıtır.',
      'Kenar çubuğundan topology’i [[graph-topology|Cycle Graph (4)]]’e çevir. Family array’leri aynı — hâlâ dört kenar-başına offset ve dört kenar-başına mismatch katsayısı. Ama şimdi dört kenar, iki polyhedron arasında köprü kurmak yerine dört düğümlü bir ring üzerinde dolanıyor.',
      'Sayılar kıpırdamaz; geometry kıpırdar. Bell-like symmetric bir state korelasyonu ring etrafında eşit biçimde dağıtır; Edge-biased bir state artık ring’in belirli bir bölgesini seçer. Aynı family, aynı pair-başına değerler, gerçekten farklı bir uzamsal resim.',
    ],
    callouts: [
      {
        kind: 'key',
        body: 'Topology, family örüntüsünün *nerede* yaşayacağını seçer; family, korelasyonun *nasıl* dağılacağını seçer. Bunlar bağımsız düğmelerdir.',
      },
      {
        kind: 'in-demo',
        body: 'Dört pair-başına snapshot (yerel strength, mismatch, alignment, gluing proxy) yalnız family + strength’ten gelir. Topology bunları değiştirmez — yalnız bunların uzamsal dizilimini ve hangi graph automorphism’larına uyduğunu değiştirir.',
      },
    ],
    actionPrompt:
      'Lesson setup’ını uygulayarak uygulamayı Bell-like symmetric ile Cycle Graph (4)’e al. Sonra family’yi Edge-biased’a çevir ve “edge-biased”ın artık iki kayırılan paralel kenar olarak değil, ring etrafındaki yerelleşmiş bir bölge olarak nasıl okunduğunu izle.',
    recommendedConfig: {
      graphTopology: 'cycle4',
      stateFamily: 'bellSymmetric',
      entanglementStrength: 0.75,
      observableMode: 'alignment',
      demoMode: true,
    },
    recommendedSelection: null,
    checkpointQuestion:
      'Aynı family ve strength’te Dipole’dan Cycle Graph (4)’e geçmek:',
    checkpointOptions: [
      {
        id: 'a',
        text: 'Dört pair-başına sayıyı dramatik biçimde değiştirir.',
        correct: false,
        feedback:
          'Pair-başına snapshot’lar yalnız family + strength’ten gelir — hiçbiri değişmedi.',
      },
      {
        id: 'b',
        text: 'Pair-başına sayıları değiştirmez; ama bunların uzamsal olarak ne anlama geldiğini değiştirir.',
        correct: true,
        feedback:
          'Doğru. Topology dört pair’ı canvas’a yerleştirir; onları hesaplamaz.',
      },
      {
        id: 'c',
        text: 'Family ne olursa olsun state’i homojenleştirir.',
        correct: false,
        feedback:
          'Topology’de homojenliği zorlayan hiçbir şey yok — onu yalnız state family kontrol eder.',
      },
    ],
    checkpointExplanation:
      'Toy sayıları family + strength + observable lens’e bağlıdır. Topology o dört face pair’ı uzayda dizer: dipole onları iki düğümün arasında paketler; Cycle Graph (4) ise ring etrafına yayar. Edge-biased, “yerel pair bölgesinin yarısı aç” durumundan “ring’in bir uzamsal bölgesi aç” durumuna geçer — aynı matematik, farklı uzamsal imza.',
    prevLessonId: 'why-it-matters',
  },
];
