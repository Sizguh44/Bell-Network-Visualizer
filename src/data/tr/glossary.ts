import type { GlossaryEntry } from '../../types/glossary';

/**
 * Türkçe Concept Atlas içeriği.
 *
 * Çeviri ilkesi: belirli teknik fizik terimleri (spin network, Bell-network,
 * face pair, gluing, anti-parallel alignment, state family, observable lens,
 * dipole graph, cycle graph, vector geometry, Regge geometry, intertwiner,
 * automorphism, homogeneity, cosmology, loop quantum gravity, Hilbert space,
 * SU(2), polyhedron, cohesion, mismatch angle, alignment score, gluing proxy)
 * İngilizce kalır. Bu terimlerin etrafındaki anlatım Türkçedir.
 *
 * ID'ler, relatedConceptIds, suggestedLessonIds, suggestedChallengeIds ve
 * suggestedBridgeLessonIds EN versiyonuyla birebir aynıdır — yalnız kullanıcıya
 * görünen metin alanları değişir.
 */
export const GLOSSARY_ENTRIES_TR: readonly GlossaryEntry[] = [
  {
    id: 'dipole-graph',
    label: 'Dipole graph',
    shortDefinition:
      'İki düğümlü, dört kenarlı spin network — iki quantum polyhedron’un yüz paylaştığı minimal ortam.',
    whyItMatters:
      'Polyhedra’ların yüzleri üzerinden gluing’ten tutarlı biçimde söz edebildiğimiz en küçük önemsiz-olmayan örnektir. Bu demodaki her şey onun üzerinde yaşar — Cosmology Bridge modülünün ötesine işaret ettiği her şey de.',
    inThisApp:
      'Dört renkli eğriyle bağlanmış, etiketli iki düğüm (A ve B). Her eğri paylaşılan bir yüzdür; her uç, bir normal oku taşır. İki shippable topology’den biri — ötekisi Cycle Graph (4), kenar çubuğundan seçilebilir.',
    inFullTheory:
      'Loop quantum gravity’de Hilbert space’i ayrıntılı biçimde analiz edilmiş, iyi çalışılmış bir spin network — bazen fundamental dipole olarak anılır. Tam hikâye keyfi büyüklükte graph’lara ve lattice’lere uzanır.',
    commonConfusion:
      'Dipole yararlı bir truncation’dır, tam bir cosmological state’in yerine geçmez. Burada öğretilen her şey ilk adımdır, son değil — Cosmology Bridge modülü bu çizgiyi açıkça çeker.',
    relatedConceptIds: ['face-pair', 'spin-network', 'intertwiner', 'automorphism', 'graph-topology'],
    suggestedLessonIds: ['intro-dipole', 'topology-upgrade'],
    suggestedBridgeLessonIds: ['graph-symmetry', 'dipole-truncation-limits', 'larger-graph-symmetry'],
    tags: ['graph', 'topology', 'truncation', 'dipole'],
  },

  {
    id: 'face-pair',
    label: 'Face pair',
    shortDefinition:
      'Birbirine komşu iki polyhedron arasındaki tek bir paylaşılan yüz — graph’ta bir kenar artı iki face normal vektörü.',
    whyItMatters:
      'Tekil face pair, "gluing"in fiilen gerçekleştiği yerdir. Küresel ortalamaları okumak yerine pair’ları tek tek incelemek çoğu zaman daha aydınlatıcıdır.',
    inThisApp:
      'Dört renkli eğrinin her biri ile uç noktasındaki iki ok. Her pair’ın kendi yerel strength’i, mismatch açısı ve alignment score’u vardır.',
    inFullTheory:
      'Normal vektörleri, alanları ve şekilleri birlikte iki yüzün parça-parça düz bir geometry’de tutarlı biçimde glued olup olamayacağını belirleyen eşleşen yüz çifti.',
    commonConfusion:
      'Face pair bir kenarla aynı şey değildir — kenar artı uçlarında yaşayan iki normal vektörüdür.',
    relatedConceptIds: ['dipole-graph', 'vector-geometry', 'gluing'],
    suggestedLessonIds: ['intro-dipole', 'local-pair-inspection'],
    suggestedChallengeIds: ['most-misaligned', 'global-vs-local'],
    suggestedBridgeLessonIds: ['local-vs-global'],
    tags: ['pair', 'normal', 'yüz'],
  },

  {
    id: 'spin-network',
    label: 'Spin network',
    shortDefinition:
      'Kenarları SU(2) temsilleri (spin’ler), düğümleri intertwiner’lar taşıyan bir graph.',
    whyItMatters:
      'Spin network’ler loop quantum gravity’nin kinematik Hilbert space’i için bir taban oluşturur — ayrık quantum geometry’nin doğal dilidir.',
    inThisApp:
      'Demo yalnızca tek bir spin network kullanır — dipole graph — dört kenarı da spin ½’e ayarlıdır ve iki düğüm de trivial intertwiner etiketi taşır.',
    inFullTheory:
      'Spin foam modellerinin yapı taşları: state’ler spin network süperpozisyonlarıdır ve geometrik operatörler onlara SU(2) yeniden eşlemesi yoluyla etki eder.',
    relatedConceptIds: ['dipole-graph', 'intertwiner', 'entanglement'],
    suggestedLessonIds: ['intro-dipole', 'strength-response'],
    tags: ['LQG', 'basis state', 'graph'],
  },

  {
    id: 'intertwiner',
    label: 'Intertwiner',
    shortDefinition:
      'Bir spin-network düğümünde SU(2)-invariant bir tensör — gelen yüz spin’lerinin rotasyon-invariant bir state’e nasıl birleştiğini söyler.',
    whyItMatters:
      'Her intertwiner, belirtilen yüz alanlarına sahip bir quantum polyhedron’a karşılık gelir. Farklı intertwiner’lar seçmek, farklı polyhedral şekiller seçmek demektir.',
    inThisApp:
      'Intertwiner yapısı burada doğrudan manipüle edilmez; örtük olarak sabittir. Demo, intertwiner serbestlik derecelerine değil, normal’lar arasındaki korelasyonlara odaklanır.',
    inFullTheory:
      'Bir düğümdeki intertwiner Hilbert space’i, gelen temsillerin tensör çarpımındaki SU(2) singlet’lerinin uzayıdır — ve Bell-network korelasyonları tam burada yaşar.',
    commonConfusion:
      'Intertwiner bir düğüme bağlıdır, bir kenara değil. Kenarlar spin taşır; düğümler intertwiner taşır.',
    relatedConceptIds: ['spin-network', 'face-pair', 'bell-network'],
    suggestedLessonIds: ['strength-response'],
    tags: ['SU(2)', 'düğüm', 'tensor'],
  },

  {
    id: 'entanglement',
    label: 'Entanglement',
    shortDefinition:
      'Alt sistemler arasında hiçbir klasik olasılık karışımı tarafından yeniden üretilemeyen bir quantum korelasyonu.',
    whyItMatters:
      'Entanglement, klasik geometry’nin quantum bilgi yapısından ortaya çıktığı önerilerinin arkasındaki mikroskobik yapıştırıcıdır.',
    inThisApp:
      'Entanglement-strength kaydırıcısı, iki düğümün intertwiner-uzayı derecelerinin ne kadar tutarlı bağlandığını ölçekleyen skaler bir toy düğmedir. Gerçek bir quantum state’i modellemez.',
    inFullTheory:
      'Komşu düğümler arasındaki entanglement, tam quantum state’in iki intertwiner-uzayı üzerinde faktorize olmayışıyla yakalanır.',
    commonConfusion:
      'Entanglement strength, korelasyon dağılımıyla aynı şey değildir. Homojen entangle edilmiş bir state ve çarpık dağılmış bir state aynı nominal strength’te olup çok farklı geometrik davranışlar üretebilir.',
    relatedConceptIds: ['bell-network', 'intertwiner', 'state-family'],
    suggestedLessonIds: ['strength-response', 'state-families'],
    suggestedChallengeIds: ['strength-vs-family', 'frustration-vs-weakness'],
    tags: ['korelasyon', 'quantum'],
  },

  {
    id: 'bell-network',
    label: 'Bell-network state',
    shortDefinition:
      'Düğümleri paylaşılan kenarlar üzerinden entangle olan, intertwiner’ları arasında korelasyon indüklenmiş bir spin network süperpozisyonu.',
    whyItMatters:
      'Bell-network state’leri, klasik geometric gluing’in quantum bilgiden nasıl ortaya çıkabileceğine dair somut adaylardır — polyhedra’ları state düzeyinde birbirine bağlar.',
    inThisApp:
      'Bell-like symmetric family, tamamen ve homojen biçimde entangle edilmiş bir state’in toy karşılığıdır: her face pair korelasyona eşit katılır.',
    inFullTheory:
      'Dipole ve daha genel graph’lar için açıkça inşa edilir; genellikle her kenar üzerinde maksimal entangle singlet state’lerden başlanıp intertwiner alt uzayına projekte edilerek kurulur.',
    commonConfusion:
      '"Bell-network", "kuvvetle entangle" ile eş anlamlı değildir — belirli bir inşa örüntüsüne işaret eder, bir strength seviyesine değil.',
    relatedConceptIds: ['entanglement', 'intertwiner', 'gluing'],
    suggestedLessonIds: ['strength-response', 'state-families'],
    suggestedChallengeIds: ['bell-vs-strong', 'strength-vs-family'],
    tags: ['state', 'örüntü', 'korelasyon'],
  },

  {
    id: 'alignment',
    label: 'Anti-parallel alignment',
    shortDefinition:
      'Paylaşılan bir yüzün iki yanındaki normal vektörlerinin zıt yönleri göstermesi koşulu.',
    whyItMatters:
      'Anti-parallel normal’lar, iki polyhedron’un paylaşılan bir yüz üzerinden tutarlı biçimde glued olması için gerekli bir koşuldur — gluing’in en görsel yönü.',
    inThisApp:
      'Alignment observable lens’i, her sağ kol okun sol kol partnerinden 180°’ye ne kadar yakın olduğunu cos²(mismatch) skoru üzerinden ölçer.',
    inFullTheory:
      'Regge calculus’te iyi tanımlı bir gluing, gerekli koşullardan biri olarak anti-parallel alignment ister; şekil kısıtları (alanlar, dihedral açılar) da sağlanmalıdır.',
    commonConfusion:
      'Kusursuz alignment tam geometrik gluing için gerekli ama yeterli değildir — demonun en keskin derslerinden biridir bu.',
    relatedConceptIds: ['gluing', 'vector-geometry', 'regge-geometry'],
    suggestedLessonIds: ['strength-response', 'alignment-vs-shape'],
    suggestedChallengeIds: ['alignment-vs-regge', 'most-misaligned'],
    tags: ['hizalama', 'normal', 'anti-parallel'],
  },

  {
    id: 'gluing',
    label: 'Gluing',
    shortDefinition:
      'İki polyhedron’un paylaşılan bir yüz boyunca özdeşleştirilerek tutarlı, parça-parça düz bir geometry oluşturması süreci ve koşulları.',
    whyItMatters:
      'Gluing, ayrık parçaların sürekli görünen bir geometry’ye nasıl birleştiğidir. Ne zaman ve nasıl gerçekleştiğini anlamak, emergent-geometry argümanlarının merkezidir.',
    inThisApp:
      'Gluing observable lens’i, ortalama alignment’ı, ortalama strength’i ve bir cohesion cezasını birleştirerek iki polyhedron’un ne kadar ikna edici biçimde "glued" göründüğünü izleyen bir toy skor verir.',
    inFullTheory:
      'Klasik bir glued konfigürasyon Regge-stili kısıtları karşılamalıdır: her paylaşılan kenar boyunca eşleşen yüz alanları ve tutarlı dihedral açılar.',
    commonConfusion:
      'Gluing desteği (bu demonun ölçtüğü), Regge gluing (tam teorinin istediği) ile aynı şey değildir. Demo yalnızca normal-alignment kısmına dokunur.',
    relatedConceptIds: ['alignment', 'regge-geometry', 'cohesion'],
    suggestedLessonIds: ['state-families', 'alignment-vs-shape'],
    suggestedChallengeIds: ['strength-vs-family', 'frustration-vs-weakness', 'global-vs-local'],
    suggestedBridgeLessonIds: ['local-vs-global', 'cosmology-bridge-value'],
    tags: ['yapıştırma', 'geometry'],
  },

  {
    id: 'state-family',
    label: 'State family',
    shortDefinition:
      'Belirli bir toplam strength’te korelasyonun dört face pair üzerinde nasıl dağılacağını seçen deterministik preset.',
    whyItMatters:
      'Strength kaydırıcısı "ne kadar?" sorusunu cevaplar. State family "nasıl dağılmış?" sorusunu cevaplar. Bu ikisini birbirinden ayırt etmek demonun ana pedagojik hamlesidir.',
    inThisApp:
      'Beş toy family — Uncorrelated, Weakly aligned, Bell-like symmetric, Frustrated, Edge-biased — her birinin elle seçilmiş kenar başına strength offset’leri ve mismatch katsayıları vardır. Aynı family array’leri her iki topology’de değişmeden çalışır; yalnız dört pair’ın uzamsal yerleşimi farklılaşır.',
    inFullTheory:
      'Bell-network benzeri yapılar uzayında bir state seçimine kabaca karşılık gelir; her biri intertwiner-uzayı entanglement’ının farklı bir örüntüsünü kodlar.',
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
    tags: ['family', 'örüntü', 'preset'],
  },

  {
    id: 'observable-lens',
    label: 'Observable lens',
    shortDefinition:
      'Belirli bir state’ten okunacak toy niceliğin seçimi — alignment, mismatch, gluing, correlation, uniformity.',
    whyItMatters:
      'Farklı observable’lar aynı state’in farklı yönlerini vurgular. Lens değiştirmek, farklı quantum operatörlerini ölçmenin toy karşılığıdır.',
    inThisApp:
      'Kenar çubuğundaki dropdown. Canvas’taki geometry’yi değiştirmez; yalnız vurguyu yönlendirir ve headline özetini yeniden okur.',
    inFullTheory:
      'Her observable, state’in Hilbert space’i üzerinde etki eden öz-eşlenik bir operatöre karşılık gelir; belirli bir state’teki beklenen değeri ölçüm sonucudur.',
    commonConfusion:
      'Observable’lar state’i yeniden şekillendirmez; onun farklı yüzlerini gösterir. Lens değiştirmek canvas’taki okları asla hareket ettirmez.',
    relatedConceptIds: ['state-family', 'alignment', 'gluing', 'cohesion'],
    suggestedLessonIds: ['observable-lenses'],
    suggestedChallengeIds: ['lens-not-state', 'edge-bias-lens'],
    tags: ['lens', 'ölçüm'],
  },

  {
    id: 'vector-geometry',
    label: 'Vector geometry',
    shortDefinition:
      'Bir polyhedron’un geometrik içeriğinin, ilişkili yüz alanlarıyla birlikte face-normal vektörleri kümesi olarak kaydedilmesi.',
    whyItMatters:
      'LQG’de bir düğümle ilişkilendirilen klasik polyhedron, intertwiner’ın sivrilmiş vektör verisinden — normal’lar ve yüz alanlarından — yeniden inşa edilir.',
    inThisApp:
      'Yalnızca normal’ların yönü izlenir. Yüz alanları, konumlar ve dihedral açılar modellenmez.',
    inFullTheory:
      'Bir polyhedron, kapanış koşuluna tabi face normal’ları ve alanlarıyla (eşyapı dışında) belirlenir. Minkowski teoremi şekli yeniden inşa eder.',
    relatedConceptIds: ['face-pair', 'alignment', 'regge-geometry'],
    suggestedLessonIds: ['local-pair-inspection', 'alignment-vs-shape'],
    tags: ['vektör', 'geometry', 'normal'],
  },

  {
    id: 'regge-geometry',
    label: 'Regge geometry',
    shortDefinition:
      'Düz simplex’lerin ya da polyhedra’ların eşleşen yüzler boyunca yapıştırılmasıyla kurulan, parça-parça düz ayrık bir geometry.',
    whyItMatters:
      'Regge calculus klasik genel göreliliğin doğal ayrık dili olup, spin foam’ların yeniden üretmeyi amaçladığı continuum limit’i sağlar.',
    inThisApp:
      'Uygulanmaz. Demo yalnızca face normal’ları arasındaki açısal ilişkiyi izler; Regge geometry’nin istediği şekil-eşleşme koşullarını kontrol etmez.',
    inFullTheory:
      'Paylaşılan bir kenarda tutarlı Regge gluing, eşleşen yüzlerin eşit alanlara sahip olmasını ve dihedral açıların belirli tutarlılık ilişkilerini sağlamasını ister.',
    commonConfusion:
      'Bu toy’daki yüksek alignment, Regge gluing için gereklidir ama yeterli değildir. Demonun bittiği ve tam teorinin başladığı en net yer burasıdır.',
    relatedConceptIds: ['gluing', 'vector-geometry', 'alignment'],
    suggestedLessonIds: ['alignment-vs-shape', 'why-it-matters'],
    suggestedChallengeIds: ['alignment-vs-regge'],
    tags: ['Regge', 'ayrık geometry'],
  },

  {
    id: 'cohesion',
    label: 'Cohesion',
    shortDefinition:
      'Dört face pair’ın aynı alignment’ı ne kadar homojen biçimde paylaştığını ölçen toy nicelik — uyuştuklarında 1, ayrıştıklarında 0.',
    whyItMatters:
      'Cohesion, iyi dağılmış korelasyonu (Bell-like symmetric) eşitsiz korelasyondan (Frustrated, Edge-biased) ayırır ve gluing skorunu doğrudan şekillendirir.',
    inThisApp:
      '`clamp(1 − 2·stddev(localAlignmentScore), 0, 1)` olarak tanımlanır — sade ve okunabilir bir proxy.',
    inFullTheory:
      'Tek bir "cohesion" operatörü yoktur. Tam teori karşılığı çok-pair korelatörlerini ve muhtemelen paylaşılan sınırlar üzerindeki entanglement yapısını içerirdi.',
    relatedConceptIds: ['gluing', 'state-family', 'observable-lens'],
    suggestedLessonIds: ['state-families', 'observable-lenses'],
    suggestedChallengeIds: ['edge-bias-lens', 'frustration-vs-weakness'],
    tags: ['homojenlik', 'proxy'],
  },

  {
    id: 'automorphism',
    label: 'Automorphism',
    shortDefinition:
      'Bir graph’ın düğümlerini ve kenarlarını yapısını koruyarak yeniden etiketleyen dönüşüm — graph simetrisinin formel ifadesi.',
    whyItMatters:
      'Automorphism’lar düğümler ve kenarlar için "birbirinin yerine geçebilir" ne demek onu netleştirir. Daha büyük graph’larda homogeneity ve isotropy fikrinin tohumudurlar ve pair düzeyi resminden çıkan ilk gerçek yapısal basamaktır.',
    inThisApp:
      'Dipole’un automorphism grubu A ↔ B düğüm değişimi ve dört kenarın permütasyonları tarafından üretilir (S₂ × S₄). Cycle Graph (4), D₄ dihedral grubunu — dört rotasyon ve dört yansıma — ekler. Bell-like symmetric her iki topology’de de tam gruba uyar; Frustrated ve Edge-biased, graph’a göre ayrı alt gruplar kırar.',
    inFullTheory:
      'Graph automorphism’ları spin-network Hilbert space’i üzerinde uniter dönüşümlere iner. Automorphism grubu altında invariant state’ler doğal bir alt uzay oluşturur ve doğrudan simetrik, homogeneous konfigürasyonlarla bağlantılıdır.',
    commonConfusion:
      'Graph automorphism graph’a ait bir özelliktir, belirli bir state’e ait değil. Bir state’in automorphism’a "uyup uymaması" ayrı bir sorudur — graph ve state bağımsız olarak simetrik ya da asimetrik olabilir.',
    relatedConceptIds: ['state-family', 'bell-network', 'homogeneity', 'dipole-graph', 'graph-topology'],
    suggestedLessonIds: ['state-families', 'topology-upgrade'],
    suggestedChallengeIds: ['edge-bias-lens', 'family-topology-crosstalk'],
    suggestedBridgeLessonIds: [
      'graph-symmetry',
      'automorphisms-equivalent-nodes',
      'homogeneity-structural',
      'larger-graph-symmetry',
    ],
    tags: ['simetri', 'grup'],
  },

  {
    id: 'homogeneity',
    label: 'Homogeneity',
    shortDefinition:
      'State’in altta yatan graph’ın automorphism’ları altında değişmez olma özelliği — her eşdeğer öğe aynı veriyi taşır.',
    whyItMatters:
      'Klasik cosmology büyük ölçekli homogeneity varsayar. Bunun ayrık bir quantum karşılığını — zengin simetrili graph’larda Bell-network benzeri korelasyonlardan — elde etmek, spin network’lerden cosmology’ye uzanan motive edici ipliklerden biridir.',
    inThisApp:
      'İki shippable topology üzerinden kısmen modellenir. Dipole üzerinde Bell-like symmetric S₂ × S₄’e uyar; Cycle Graph (4) üzerinde tam dihedral D₄’e uyar. Diğer family’ler her graph’ta ayrı alt gruplar kırar. Cosmology Bridge modülü bunu gerçek kısıtın bir önizlemesi olarak çerçeveler, kendisi olarak değil.',
    inFullTheory:
      'Homogeneity’nin ayrık karşılıkları loop quantum cosmology’de, lattice-üzeri-toplam yaklaşımlarında ve group-field-theory kondensatlarında görülür — her biri "simetrik tekrar" için kendi teknik tanımına sahiptir.',
    commonConfusion:
      'Görsel uniformity homogeneity’nin bir sonucudur, tanımı değildir. Homogeneity state + graph çifti hakkında yapısal bir değişmezlik iddiasıdır: state graph’ın automorphism’larıyla komütatif olmalıdır.',
    relatedConceptIds: ['state-family', 'bell-network', 'gluing', 'automorphism', 'graph-topology'],
    suggestedLessonIds: ['why-it-matters', 'topology-upgrade'],
    suggestedBridgeLessonIds: [
      'homogeneity-structural',
      'cosmology-bridge-value',
      'dipole-truncation-limits',
      'larger-graph-symmetry',
    ],
    tags: ['cosmology', 'simetri', 'homojenlik'],
  },

  {
    id: 'graph-topology',
    label: 'Graph topology',
    shortDefinition:
      'Altta yatan spin network’un kombinatoryel şekli — hangi düğümlerin bulunduğu ve kenarların onları nasıl bağladığı.',
    whyItMatters:
      'Topology, hangi graph automorphism’larının var olduğunu — dolayısıyla bir state’in hangi simetrilere uyup hangilerini kırabileceğini — sabitler. Pair düzeyinin üstündeki ilk yapısal düğmedir: aynı family array’leri bir graph’ta simetrik, başka bir graph’ta frustrated görünebilir.',
    inThisApp:
      'İki shippable topology — Dipole Graph (iki düğüm, dört paralel kenar) ve Cycle Graph (4) (halka üzerinde dört düğüm). İkisi de tam olarak dört face pair taşır, bu yüzden aynı state-family array’leri değişmeden çalışır. Yalnızca uzamsal yerleşim ve automorphism grubu farklıdır.',
    inFullTheory:
      'Tam LQG’de kombinatoryel graph, kinematik Hilbert space’in bütün bir superselection sector’ünün altında yatar. Farklı graph’lar farklı state’leri barındırır; onları ilişkilendirmek cylindrical consistency ve nihayetinde bir continuum limit ister.',
    commonConfusion:
      'Topology’yi değiştirmek pair başına sayıları değiştirmez — dört strength offset ve mismatch katsayısı aynı kalır. Değişen şey, automorphism grubunun hangi pair’ları birleştirdiği — ve dolayısıyla hangi family’lerin simetrik, hangilerinin kırılmış göründüğüdür.',
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
    tags: ['graph', 'topology', 'yapı'],
  },

  {
    id: 'edge-pattern',
    label: 'Edge pattern',
    shortDefinition:
      'Bir state family’nin korelasyonu dört face pair’a nasıl dağıttığını tanımlayan deterministik kenar-başına array’ler — strength offset’leri ve mismatch katsayıları.',
    whyItMatters:
      '"Hangi pair’lar ne kadar taşıyor?" soyut fikrinin arkasındaki somut veridir. Aynı toplam strength’teki iki family çok farklı edge pattern’lere sahip olabilir; ve farklı edge pattern’ler simetri argümanlarının bir topology’nin automorphism grubuna uymasına ya da onu kırmasına yol açar.',
    inThisApp:
      'Her state family iki adet uzunluğu-dört array taşır: pair başına global kaydırıcıya eklenen strength offset’leri ve pair başına temel mismatch açısını ölçekleyen mismatch katsayıları. Array’ler topology-agnostic’tir — aynı örüntü Dipole ya da Cycle Graph (4)’te çalışır; hangi pair’ların automorphism-eşdeğer olduğuna graph karar verir.',
    inFullTheory:
      'Kabaca, belirli bir Bell-network benzeri state’in intertwiner bazındaki katsayı yapısına — node-to-node entanglement’ın komşu kenarlara nasıl dağıldığına — karşılık gelir.',
    commonConfusion:
      'Edge pattern bir ölçüm değildir. Family tanımına gömülü bir seçimdir. Alignment, mismatch ve gluing ise bir pattern ve bir topology seçildikten sonra okunan değerlerdir.',
    relatedConceptIds: [
      'state-family',
      'graph-topology',
      'bell-network',
      'entanglement',
      'face-pair',
    ],
    suggestedLessonIds: ['state-families', 'topology-upgrade'],
    suggestedChallengeIds: ['edge-bias-lens', 'family-topology-crosstalk', 'topology-detects-bias'],
    tags: ['yapı', 'family', 'kenar'],
  },
];
