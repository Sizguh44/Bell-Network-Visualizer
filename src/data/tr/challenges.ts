import type { Challenge } from '../../types/challenge';

/**
 * Türkçe challenge içeriği.
 *
 * Çeviri ilkesi: teknik fizik terimleri (spin network, Bell-network, face
 * pair, gluing, anti-parallel alignment, state family, observable lens,
 * dipole graph, cycle graph, vector geometry, Regge geometry, intertwiner,
 * automorphism, homogeneity, cosmology, loop quantum gravity, Hilbert space,
 * SU(2), polyhedron, cohesion, mismatch, alignment score, gluing proxy,
 * gluing score, mismatchCoeff, localStrength, strengthOffsets) İngilizce
 * kalır. Bu terimlerin etrafındaki tüm açıklamalar Türkçedir. Challenge id
 * ve sıra, difficulty, type, prev/next zinciri ile answerOptions id'leri
 * (`a`, `b`, `c`, `d`, `e`) iki dilde birebir aynıdır.
 */
export const CHALLENGES_TR: readonly Challenge[] = [
  {
    id: 'most-misaligned',
    order: 1,
    title: 'Hangi pair en kötü hizalanmış?',
    shortGoal: 'Mismatch lens altında en kötü davranan pair’ı gözle ayır.',
    difficulty: 'intro',
    type: 'diagnosis',
    prompt:
      'Mismatch lens altında dört pair’dan biri diğerlerine göre belirgin biçimde daha geniş bir açısal boşluk taşıyor. Herhangi bir pair’a tıklamadan önce yalnız canvas’a bak: en kötü davranan hangi numara?',
    setupConfig: {
      stateFamily: 'edgeBiased',
      entanglementStrength: 0.65,
      observableMode: 'mismatch',
      demoMode: true,
    },
    setupSelection: null,
    expectedObservation:
      'Soldaki iki pair net ve parlak görünmeli; sağdaki iki pair dağınık ve sönük kalmalı.',
    answerOptions: [
      {
        id: 'a',
        text: 'Pair 1',
        correct: false,
        feedback:
          'Pair 1, Edge-biased family’nin kayırılan pair’larından biri. Okları temiz biçimde kilitleniyor.',
      },
      {
        id: 'b',
        text: 'Pair 2',
        correct: false,
        feedback: 'Pair 2 de burada hizalanmış alt kümeye dahil.',
      },
      {
        id: 'c',
        text: 'Pair 3',
        correct: false,
        feedback:
          'Yakın — pair 3 hizasız, ama pair 4 biraz daha büyük katsayıya ve daha derin negatif strength offset’ine sahip.',
      },
      {
        id: 'd',
        text: 'Pair 4',
        correct: true,
        feedback:
          'Doğru. Edge-biased, en büyük mismatch katsayısını ve en negatif strength offset’ini pair 4’te birleştirir.',
      },
    ],
    explanation:
      'Edge-biased korelasyonu ilk iki pair üzerinde yoğunlaştırır. Pair 4 hem en büyük |mismatchCoeff| (0.9) hem de belirgin bir negatif strength offset (−0.3) alır, bu yüzden yerel mismatch açısı dört pair içinde en geniş olanıdır.',
    relatedConceptIds: ['state-family', 'face-pair', 'alignment', 'observable-lens'],
    relatedLessonIds: ['local-pair-inspection', 'state-families'],
    nextChallengeId: 'strength-vs-family',
  },

  {
    id: 'strength-vs-family',
    order: 2,
    title: 'Aynı strength, farklı family',
    shortGoal:
      'Yalnız family değişince Gluing skorunun nasıl hareket edeceğini tahmin et.',
    difficulty: 'intro',
    type: 'prediction',
    prompt:
      'Gluing lens altında 0.7 strength’te Bell-like symmetric’i görüyorsun. Family pill’ini Frustrated’a çevirmeden — strength’i 0.7’de tutarak — Gluing skoruna ne olacağını tahmin et.',
    setupConfig: {
      stateFamily: 'bellSymmetric',
      entanglementStrength: 0.7,
      observableMode: 'gluing',
      demoMode: true,
    },
    setupSelection: null,
    expectedObservation:
      'Frustrated’a geçtikten sonra Summary headline belirgin biçimde düşmeli ve status "fragile"a doğru kaymalı.',
    answerOptions: [
      {
        id: 'a',
        text: 'Yükselir.',
        correct: false,
        feedback:
          'Frustrated daha az homojen bir örüntüdür — cohesion cezası skoru düşürür, yükseltmez.',
      },
      {
        id: 'b',
        text: 'Aşağı yukarı aynı kalır — strength aynı.',
        correct: false,
        feedback:
          'Gluing skorunu yalnız strength sabitlemez. Korelasyonların dağılımı da önemlidir.',
      },
      {
        id: 'c',
        text: 'Belirgin biçimde düşer.',
        correct: true,
        feedback:
          'Doğru. Bell-like symmetric cohesion’ı 1’e yakın tutar; Frustrated temiz + hizasız alt kümelere bölünür, bu da cohesion’ı ve gluing skorunu düşürür.',
      },
    ],
    explanation:
      'Toy gluing skoru, ortalama alignment’ı bir cohesion terimi ve ortalama strength ile çarpar. Strength burada değişmedi; ama dört pair’dan ikisi hizalanmayı reddettiğinde cohesion keskin biçimde düşer — bu tam da Frustrated imzasıdır.',
    relatedConceptIds: ['state-family', 'gluing', 'cohesion', 'entanglement'],
    relatedLessonIds: ['state-families'],
    prevChallengeId: 'most-misaligned',
    nextChallengeId: 'lens-not-state',
  },

  {
    id: 'lens-not-state',
    order: 3,
    title: 'State’i değil lens’i değiştir',
    shortGoal:
      'Observable lens’lerin okları döndürmediğini doğrula.',
    difficulty: 'intro',
    type: 'conceptual',
    prompt:
      'Bell-like symmetric, 0.9 strength, Alignment lens’tesin. Observable dropdown’unu önce Mismatch’e, sonra Uniformity’ye, sonra geri çevir. Canvas’taki oklar gerçekten hareket ediyor mu?',
    setupConfig: {
      stateFamily: 'bellSymmetric',
      entanglementStrength: 0.9,
      observableMode: 'alignment',
      demoMode: true,
    },
    setupSelection: null,
    expectedObservation:
      'Oklar ve açıları sabit kalmalı. Yalnız pair başına vurgu (opaklık, çizgi kalınlığı) ve Summary kartı değişmeli.',
    answerOptions: [
      {
        id: 'a',
        text: 'Evet — lens değişince oklar dönüyor.',
        correct: false,
        feedback:
          'Canvas geometry’si yalnız family + strength’in fonksiyonudur. Lens açılara dokunmaz.',
      },
      {
        id: 'b',
        text: 'Hayır — sabit kalıyorlar; yalnız vurgu ve özet değişiyor.',
        correct: true,
        feedback:
          'Doğru. Observable lens bir *okuma*dır, state’in bir dönüşümü değil.',
      },
      {
        id: 'c',
        text: 'Yalnız seçili pair dönüyor.',
        correct: false,
        feedback:
          'Seçim de geometry’ye etki etmez; yalnız detail card’ın hangi pair’a sabitleneceğini vurgular.',
      },
    ],
    explanation:
      'Canvas açıları bir kez family ve strength’ten türetilir. Observable lens yalnız hangi pair değerinin görsel vurguyu yöneteceğini yeniden ağırlıklandırır ve Summary headline’ı yeniden okur. Aynı quantum state üzerinde farklı bir operator ölçmenin toy karşılığıdır.',
    relatedConceptIds: ['observable-lens', 'state-family', 'alignment'],
    relatedLessonIds: ['observable-lenses'],
    prevChallengeId: 'strength-vs-family',
    nextChallengeId: 'alignment-vs-regge',
  },

  {
    id: 'alignment-vs-regge',
    order: 4,
    title: 'Yüksek alignment Regge eşleşmesi demek mi?',
    shortGoal:
      'Anti-parallel alignment ile tam şekil eşleşmesini birbirinden ayır.',
    difficulty: 'core',
    type: 'conceptual',
    prompt:
      'Bell-like symmetric, 1.0 strength, Alignment lens’te headline 1.000’e yakın oturuyor. Bir meslektaşın şunu söylüyor: "bu, iki polyhedron’un Regge-glued olduğunu kanıtlar". Haklı mı?',
    setupConfig: {
      stateFamily: 'bellSymmetric',
      entanglementStrength: 1.0,
      observableMode: 'alignment',
      demoMode: true,
    },
    setupSelection: null,
    answerOptions: [
      {
        id: 'a',
        text: 'Evet — yüksek alignment Regge gluing için yeterlidir.',
        correct: false,
        feedback:
          'Alignment gereklidir, yeterli değildir. Ayrıca eşleşen alanlar ve dihedral açılar da istenir.',
      },
      {
        id: 'b',
        text: 'Hayır — alignment gereklidir ama Regge gluing eşleşen alanlar ve dihedral açılar da ister.',
        correct: true,
        feedback:
          'Doğru. Toy yalnız tek bir yüz-yön kısıtını takip eder. Tam şekil eşleşmesi, bu demonun hiç kontrol etmediği ek koşullardadır.',
      },
      {
        id: 'c',
        text: 'Evet, ama yalnız dipole graph için.',
        correct: false,
        feedback:
          'Dipole graph istisna değildir: Regge gluing yine anti-parallel normal’ların ötesinde koşullar ister.',
      },
    ],
    explanation:
      'Paylaşılan bir yüzeyin iki yanındaki anti-parallel face normal’lar, tutarlı bir parça-parça düz gluing için *bir* koşuldur. Klasik Regge calculus ayrıca eşleşen yüzlerin alanlarının aynı olmasını ve paylaşılan kenarlar boyunca dihedral açıların uyuşmasını ister. Bu demo yalnız birinci koşulu yakalar. Tepedeki alignment skorunu Regge gluing kanıtı sanmak, sık yapılan ama gerçek bir kategori hatasıdır.',
    relatedConceptIds: ['alignment', 'regge-geometry', 'gluing', 'vector-geometry'],
    relatedLessonIds: ['alignment-vs-shape', 'why-it-matters'],
    prevChallengeId: 'lens-not-state',
    nextChallengeId: 'edge-bias-lens',
  },

  {
    id: 'edge-bias-lens',
    order: 5,
    title: 'Edge bias’ı en iyi hangi observable gösterir?',
    shortGoal:
      'Pair başına asimetriyi en yüksek sesle söyleyen lens’i seç.',
    difficulty: 'core',
    type: 'comparison',
    prompt:
      'Edge-biased family’desin. Kenar çubuğundaki dropdown’dan her observable lens’i dene. Hangisi asimetriyi — iki pair’ın kayırıldığını, iki pair’ın aç kaldığını — en doğrudan gösterir?',
    setupConfig: {
      stateFamily: 'edgeBiased',
      entanglementStrength: 0.65,
      observableMode: 'alignment',
      demoMode: true,
    },
    setupSelection: null,
    answerOptions: [
      {
        id: 'a',
        text: 'Alignment — skor fena değil ama hiçbir şey asimetriyi bağırmıyor.',
        correct: false,
        feedback:
          'Ortalama alignment, temiz ve aç pair’lar arasındaki ayrımı gizler.',
      },
      {
        id: 'b',
        text: 'Mismatch — pair 3 ve 4’teki geniş açılar görünüyor.',
        correct: false,
        feedback:
          'Mismatch boşluğu görünür yapar ama strength ile örüntüyü tek sayıda karıştırır.',
      },
      {
        id: 'c',
        text: 'Gluing — status "fragile"a iniyor.',
        correct: false,
        feedback:
          'Gluing tüm graph’ı özetler. Pair başına sapmayı izole etmez.',
      },
      {
        id: 'd',
        text: 'Uniformity — vurgu, family ortalamasından sapmanın tam kendisidir.',
        correct: true,
        feedback:
          'Doğru. Uniformity pair başına vurgu olarak |alignment − meanAlignment| kullanır; Edge-biased family’nin taşıdığı "outlier" sinyali tam da budur.',
      },
      {
        id: 'e',
        text: 'Correlation — secondary pair aralığı yayılımı gösteriyor.',
        correct: false,
        feedback:
          'Savunulabilir — Correlation pair aralığını raporlar. Ama pair başına vurgusu localStrength’i izler; Uniformity gibi sapmayı izole etmez.',
      },
    ],
    explanation:
      'Her observable lens’in kendine özgü bir pair başına vurgu sürücüsü vardır. Uniformity’nin sürücüsü, her pair’ın alignment’ının family ortalamasından mutlak sapmasıdır; bu yüzden "diğerlerinden farklı" olan pair’ları doğrudan aydınlatır. Edge-biased family’nin tüm meselesi de budur.',
    relatedConceptIds: ['observable-lens', 'state-family', 'cohesion', 'automorphism'],
    relatedLessonIds: ['state-families', 'observable-lenses'],
    prevChallengeId: 'alignment-vs-regge',
    nextChallengeId: 'frustration-vs-weakness',
  },

  {
    id: 'frustration-vs-weakness',
    order: 6,
    title: 'Frustration ile zayıflık arasındaki fark',
    shortGoal:
      'Düşük gluing skorunun iki farklı nedenini birbirinden ayır.',
    difficulty: 'core',
    type: 'diagnosis',
    prompt:
      'Gluing lens "fragile" diyor ve headline düşük — ama entanglement strength 0.7, küçük değil. State genel olarak mı zayıf korele, yoksa korelasyon pair’lar arasında eşitsiz mi dağılmış?',
    setupConfig: {
      stateFamily: 'frustrated',
      entanglementStrength: 0.7,
      observableMode: 'gluing',
      demoMode: true,
    },
    setupSelection: null,
    answerOptions: [
      {
        id: 'a',
        text: 'Zayıf korele — dört pair da hafifçe katılıyor.',
        correct: false,
        feedback:
          'Her pair 0.7’de benzer davransaydı, canvas’ta karşılaştırılabilir parlaklıkta dört pair görürdün. Görmüyorsun.',
      },
      {
        id: 'b',
        text: 'Eşitsiz dağılmış — nominal strength iyi ama bir pair alt kümesi hizalanmaya direniyor.',
        correct: true,
        feedback:
          'Doğru. İki pair temiz, iki pair eksen dışı. Sorun büyüklük değil, örüntü.',
      },
      {
        id: 'c',
        text: 'İkisi de, aşağı yukarı eşit derecede.',
        correct: false,
        feedback:
          '0.7 küresel strength’te "zayıf" iyi bir tanı değil. Asıl sinyal pair başına uyuşmazlık.',
      },
    ],
    explanation:
      'Frustrated 0.7 strength’te iki pair’ı sıkı biçimde hizalı tutar (küçük mismatch katsayıları) ve iki pair’ı belirgin biçimde eksen dışı bırakır (büyük mismatch katsayıları). Gluing lens’in cohesion cezası, strength düğmesi zayıf-korelasyon bölgesinin çok üstünde olsa bile headline’ı aşağı çeker. Düzeltme, strength’i itmek değil, family’yi değiştirmektir.',
    relatedConceptIds: ['state-family', 'gluing', 'cohesion', 'entanglement'],
    relatedLessonIds: ['state-families', 'local-pair-inspection'],
    prevChallengeId: 'edge-bias-lens',
    nextChallengeId: 'global-vs-local',
  },

  {
    id: 'global-vs-local',
    order: 7,
    title: 'Küresel skor, yerel sorun',
    shortGoal:
      'Kırılgan bir küresel okumanın kaynağını pair başına incelemeyle bul.',
    difficulty: 'advanced',
    type: 'diagnosis',
    prompt:
      'Gluing lens 0.7 strength’te "fragile" diyor. Face Pair Detail kartını aç ve her pair üzerinde tek tek dolaş. Hatanın yapısı ne?',
    setupConfig: {
      stateFamily: 'frustrated',
      entanglementStrength: 0.7,
      observableMode: 'gluing',
      demoMode: true,
    },
    setupSelection: 'e2',
    expectedObservation:
      'Pair 2 ve pair 4 büyük mismatch açıları ve düşük alignment skorları göstermeli; pair 1 ve pair 3 temiz görünmeli.',
    answerOptions: [
      {
        id: 'a',
        text: 'Bir pair başarısız; diğer üçü temiz.',
        correct: false,
        feedback: 'Yakın, ama hata tek bir pair’dan daha geniş.',
      },
      {
        id: 'b',
        text: 'İki pair başarısız; diğer ikisi temiz.',
        correct: true,
        feedback:
          'Doğru. Frustrated family, ikişer pair’lık hizalı ve hizasız alt kümelere ayrılır.',
      },
      {
        id: 'c',
        text: 'Dört pair da benzer derecede başarısız.',
        correct: false,
        feedback:
          'Her pair benzer başarısızlıkta olsaydı cohesion terimi yüksek kalırdı — burada gördüğün bu değil.',
      },
    ],
    explanation:
      'Frustrated’ın mismatchCoeff’i yaklaşık [0.08, 0.95, 0.12, 0.9]’dır. Pair 1 ve 3 küçük gürültüyü devralır ve temiz kilitlenir; pair 2 ve 4 büyük gürültüyü devralır ve tam nominal strength’te bile geniş mismatch açısını korur. Küresel gluing skoru dört pair’ın ortalamasını alır, bu yüzden "fragile"a iner — hepsi başarısız olduğu için değil, *yarısı* başarısız olduğu için. Bu iki hata şeklini birbirinden pair başına inceleyerek ayırırsın.',
    relatedConceptIds: ['face-pair', 'gluing', 'observable-lens', 'cohesion'],
    relatedLessonIds: ['local-pair-inspection', 'state-families'],
    prevChallengeId: 'frustration-vs-weakness',
    nextChallengeId: 'bell-vs-strong',
  },

  {
    id: 'bell-vs-strong',
    order: 8,
    title: 'Bell-like sadece yüksek strength demek değildir',
    shortGoal:
      '"Güçlü korele" ile "Bell-like"ı birbirinden ayır.',
    difficulty: 'advanced',
    type: 'conceptual',
    prompt:
      'Frustrated family’yi 0.9 strength’e çıkar. Genel korelasyon her makul ölçüyle yüksek. Bu state’in 0.9 Bell-like symmetric gibi davranmasını sağlar mı?',
    setupConfig: {
      stateFamily: 'frustrated',
      entanglementStrength: 0.9,
      observableMode: 'gluing',
      demoMode: true,
    },
    setupSelection: null,
    answerOptions: [
      {
        id: 'a',
        text: 'Evet — yüksek strength’te tüm family’ler Bell-like davranışa yakınsar.',
        correct: false,
        feedback:
          'Strength, bir family’nin gömülü asimetrisini silmez. Frustrated 0.9’da bile bölünmüşlüğünü korur.',
      },
      {
        id: 'b',
        text: 'Hayır — Bell-like, korelasyonların *örüntüsünü* tanımlar, boyutunu değil.',
        correct: true,
        feedback:
          'Doğru. Family’deki yapısal asimetri herhangi bir makul strength ayarında yaşamaya devam eder.',
      },
      {
        id: 'c',
        text: 'Canvas’ta aynı görünürler ama sayısal olarak farklıdırlar.',
        correct: false,
        feedback:
          'Canvas’ın kendisi farkı gösteriyor — 0.9’da bile iki pair eksen dışı kalır.',
      },
    ],
    explanation:
      '"Bell-like" korelasyonların pair’lar arasında *nasıl* dağıldığına dair bir etikettir, ne *kadar güçlü* olduğuna dair değil. Frustrated family’nin mismatch katsayıları kalıcı bir asimetriyi — iki hizalı, iki eksen dışı pair — içe yerleştirir ve bu herhangi bir küresel strength ayarında kalıcıdır. Bell-like symmetric ise korelasyonları tasarım gereği homojen uygular. Yalnız yüksek strength birini ötekine dönüştüremez.',
    relatedConceptIds: ['bell-network', 'state-family', 'entanglement', 'gluing'],
    relatedLessonIds: ['state-families', 'why-it-matters'],
    prevChallengeId: 'global-vs-local',
    nextChallengeId: 'topology-detects-bias',
  },

  {
    id: 'topology-detects-bias',
    order: 9,
    title: 'Edge bias’ı hangi topology daha kolay gösterir?',
    shortGoal:
      'Edge-biased’ın dipole ile cycle üzerinde nasıl okunduğunu karşılaştır.',
    difficulty: 'core',
    type: 'comparison',
    prompt:
      'Uniformity lens altında 0.65 strength’te Edge-biased family’desin. Kenar çubuğundan iki topology’yi de — Dipole ve Cycle Graph (4) — dene. Hangi topology asimetriyi canvas’ta görsel olarak en çok belirginleştirir?',
    setupConfig: {
      graphTopology: 'dipole',
      stateFamily: 'edgeBiased',
      entanglementStrength: 0.65,
      observableMode: 'uniformity',
      demoMode: true,
    },
    setupSelection: null,
    expectedObservation:
      'Dipole’da kayırılan ve aç pair’lar iki düğüm arasındaki dört fanlı eğri olarak üst üste biner. Cycle (4)’te ise kayırılan kenarlar ring’in bir bölgesini oluşturur, aç olanlar başka bir bölgesini — uzamsal olarak ayrılırlar.',
    answerOptions: [
      {
        id: 'a',
        text: 'Dipole — dört pair da aynı iki düğüm arasında sıkışıyor, bu yüzden asimetri yoğunlaşmış durumda.',
        correct: false,
        feedback:
          'Yoğunlaşmış, evet — ama tam da bu yüzden uzamsal okuması zor; kayırılan ve aç eğriler canvas’ta üst üste biniyor.',
      },
      {
        id: 'b',
        text: 'Cycle Graph (4) — ring kayırılan ve aç kenarları ayrı komşuluklara dağıtıyor.',
        correct: true,
        feedback:
          'Doğru. Uzamsal ayrım, edge bias’ı üst üste binmiş eğriler yerine ring’in tanınabilir bir bölgesi yapar.',
      },
      {
        id: 'c',
        text: 'Hiçbiri — bias bir family özelliğidir ve graph’tan bağımsız aynı görünür.',
        correct: false,
        feedback:
          'Sayılar aynıdır; *görsel okunabilirlik* aynı değildir. Topology uzamsal dizilimi kontrol eder ve dizilim, gözün yakaladığını değiştirir.',
      },
    ],
    explanation:
      'Pair başına sayılar family’den gelir: mevcut strength altında strengthOffsets + mismatchCoeff. Dipole’da dört face pair aynı iki polyhedron arasında yaşar, bu yüzden "edge-biased" üst üste binmiş fanlı eğrilere çöker. Cycle Graph (4)’te aynı dört kenar ring etrafında dağılır ve kayırılan bölge ile aç bölge, üzerine parmak basabileceğin uzamsal bir özelliğe dönüşür. Matematik topology’den bağımsızdır; okunabilirlik değil.',
    relatedConceptIds: ['state-family', 'graph-topology', 'observable-lens', 'edge-pattern'],
    relatedLessonIds: ['state-families', 'topology-upgrade'],
    prevChallengeId: 'bell-vs-strong',
    nextChallengeId: 'family-topology-crosstalk',
  },

  {
    id: 'family-topology-crosstalk',
    order: 10,
    title: 'Aynı family, farklı topology',
    shortGoal:
      'Yalnız graph değişince Gluing skorunun nasıl hareket edeceğini tahmin et.',
    difficulty: 'core',
    type: 'prediction',
    prompt:
      'Gluing lens altında 0.7 strength’te Frustrated’dasın. Graph topology’sini Dipole’dan Cycle (4)’e çevirmeden önce tahmin et: headline Gluing skoruna ne olur?',
    setupConfig: {
      graphTopology: 'dipole',
      stateFamily: 'frustrated',
      entanglementStrength: 0.7,
      observableMode: 'gluing',
      demoMode: true,
    },
    setupSelection: null,
    expectedObservation:
      'Headline sayı ilk ondalığa kadar aynı kalmalı; yalnız canvas geometry’si değişmeli.',
    answerOptions: [
      {
        id: 'a',
        text: 'Belirgin biçimde yükselir.',
        correct: false,
        feedback:
          'Pair başına metrikler değişmedi — family, strength ve lens hepsi yerinde.',
      },
      {
        id: 'b',
        text: 'İlk ondalığa kadar aynı kalır.',
        correct: true,
        feedback:
          'Doğru. Dört pair başına snapshot family + strength’ten gelir; topology yalnız bunları canvas’a yerleştirir.',
      },
      {
        id: 'c',
        text: 'Belirgin biçimde düşer.',
        correct: false,
        feedback:
          'Aynı gerekçe — pair başına hesaplamada topology’ye bağlı hiçbir şey yok.',
      },
    ],
    explanation:
      'Toy gluing skoru, family ve strength’in saf fonksiyonları olan dört pair başına snapshot’ı toplar. Topology bu formüllere girmez; yalnız her pair’ın canvas’ta nereye oturduğunu ve hangi graph automorphism’larına uyabileceğini kontrol eder. Küresel sayı donarken uzamsal resim dönsün diye bekle. "Topology dizilimdir, hesaplama değil" dersinin en temiz tutamağıdır.',
    relatedConceptIds: ['gluing', 'state-family', 'graph-topology', 'cohesion'],
    relatedLessonIds: ['topology-upgrade', 'state-families'],
    prevChallengeId: 'topology-detects-bias',
  },
];
