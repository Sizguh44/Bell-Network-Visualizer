# Bell-Network Visualizer

**Küçük spin network’ler üzerinde — paylaşılan yüzler arasındaki entanglement’ın glued-polyhedron geometry’sini nasıl destekleyebileceğine dair — etkileşimli, tarayıcıda çalışan bir toy model.**

İki küçük spin network ship edilir: **dipole graph** ve **dört düğümlü cycle graph**. İkisi de, rehberli lesson’lar, Sokratik challenge’lar ve cosmology-bridge reflection’larıyla desteklenen state-family / observable-lens deneylerine zemin olur.

- 🔬 Entanglement strength’in face normal’ları anti-parallel çiftlere nasıl kilitlediğini hisset.
- 🎛 Korelasyonun *ne kadar olduğunu* (strength) *nasıl dağıldığından* (state family) ayır.
- 🔭 Aynı state’i beş toy observable lens üzerinden — canvas’ı değiştirmeden — oku.
- 🧭 Sekiz lesson, on challenge, yedi bridge lesson ve on yedi girişli Concept Atlas’ı sırayla dolaş.

> **Akademik çerçeveleme — Bell-Network Geometry Lab.** Küçük spin
> network’ler üzerinde **Bell-network states** ve **effective geometry**
> incelemek üzere kurulmuş, araştırma yönelimli pedagojik bir lab —
> odak: **dipole graph** ve **cycle-4 graph**. Lab dört epistemik
> register’ı birbirinden ayırır: (i) canvas üzerindeki pedagogical
> proxy diagnostics, (ii) minimal qubit model içinde exact finite-
> dimensional quantum-information sonuçları, (iii) keyfi spin tuple’lar
> için tek-node **SU(2) invariant subspace / intertwiner projector**
> yapıları, ve (iv) dipole ve cycle-4 graph’ları için **projected
> spin-1/2 Bell-network states** (link-singlet ürününün, her node’un
> intertwiner projektörünün tensor ürününe izdüşümü).
>
> **Bu proje tam bir LQG hesaplaması olarak sunulmuyor; pedagogical
> diagnostics, exact finite-dimensional quantum-information
> hesaplamalar, tek-node SU(2) intertwiner yapıları ve kısıtlı spin-1/2
> projected Bell-network state’lerini birbirinden ayıran katmanlı bir
> research sandbox.** Her sayısal çıktı kendi register’ı ile etiketli
> (görünür `<ProxyBadge>` chip’leri, model chip’leri, engine state
> çıktılarındaki makine-okunur `honesty: …` literal’leri);
> **proxy-vs-exact-observable** ayrımı disiplin seviyesinde uygulanır.
> **Future area, volume ve dihedral-angle operators** — bu state’ler
> üzerinde exact LQG-tadında observable’a doğru atılacak doğal sonraki
> adım — uygulanmış olarak değil, roadmap maddeleri olarak belgelenmiş
> durumda.
>
> Aşağıda [*Akademik Kapsam: Bell-Network Geometry Lab*](#akademik-kapsam-bell-network-geometry-lab)
> bölümü dört tier’ın detayını veriyor; [`docs/`](./docs) altındaki üç
> eşlik eden doküman demo akışını, honesty-class referansını ve
> future-research roadmap’ini içeriyor.

> Dil seçeneği: header’ın sağ üstündeki **EN / TR** tuşu ile uygulamayı İngilizce ya da Türkçe çalıştırabilirsin. Tercih `localStorage`’a kaydolur; paylaşılan URL’lerde `lang=en` veya `lang=tr` alanı ile dil de taşınır.

**Canlı demo:** `https://<owner>.github.io/Bell-Network-Visualizer/` — `<owner>` yerine bu fork’u host eden GitHub hesap/organizasyon adını yaz.

**English README:** [README.md](./README.md)

---

## Bir bakışta

Header’dan istediğin an seçebileceğin dört eş-seviye mod:

| mod | rolü |
| --- | --- |
| **Explore** | *Serbest deney.* Kenar çubuğundaki dört düğmeyi oynat, pair’ların üzerine gel veya tıkla. |
| **Learn** | *Önerilen başlangıç yolu.* Uygulanmış setup ve checkpoint’i olan sekiz rehberli lesson. |
| **Challenge** | *Anlayışını sına.* On Sokratik görev — tahmin, karşılaştırma, tanı, kavramsal. |
| **Bridge** | *Geri çekil.* Graph düzeyi simetri ve cosmology düşüncesi üzerine reflection tarzı yedi lesson. |

Her modun içinden açılabilen iki overlay drawer:

| drawer | rolü |
| --- | --- |
| **Concept Atlas** | Kavram-merkezli: on yedi girdi, her biri *bu uygulamada* vs *tam teoride* ayrımıyla; lesson / challenge / bridge’lere çapraz bağ. |
| **İçerik Kütüphanesi** | İçerik-merkezli: her lesson, challenge, bridge lesson ve glossary girdisi sekmeli, aranabilir tek bir listede. |

## Önerilen başlangıç yolu

Uygulamayı ilk açtığında Explore modunda dismiss edilebilir bir *Buradan başla* kartı aynı yolu işaret eder:

1. **Learn’ı aç.** Lesson 1’i al — dipole’u, dört face pair’ı ve okları tanıtır. Checkpoint’i aç, "Sıradaki adım" ipucunu takip et.
2. **Lesson 2–6’yı yürüt.** Sırasıyla strength, pair başına inceleme, state family’ler, observable lens’ler ve alignment-vs-shape sınırını anlatırlar.
3. **Explore’a sapmak** istersen family / strength / lens / topology’yi bir lesson’un önerdiği config dışında oynatabilirsin.
4. **Atlas’ı aç**, tanımadığın bir terime rastladığın an — lesson içindeki altı çizili her kavram yandaki drawer’ı açar.
5. **Challenge’ı** ayrımları sınamak için kullan (state vs lens, alignment vs Regge, frustration vs weakness, topology vs computation).
6. **Bridge’i** yerel gluing’i graph simetrisine ve — dürüstçe — demonun *cevap vermediği* cosmology sorularına bağlamak için kullan.

Modlar arasında istediğin an atlayabilirsin; hiçbir şey doğrusal değil. Header’daki "Nasıl kullanılır" tuşu başlangıç kartını her zaman geri açar.

> Masaüstü ekranda en iyi görüntüyü verir — katmanlı düzen daha geniş viewport’lara göre tasarlanmıştır, ama arayüz dar ekranlara da yanıt verir.

## Bu nedir — ve ne değildir

- ✅ Pedagojik, **statik** bir toy araç (backend yok, API key yok, tracking yok).
- ✅ Deterministik: aynı kontroller her zaman aynı resmi üretir.
- ✅ Kapsamı konusunda dürüst: tüm sayılar toy proxy, açıkça öyle etiketlenmiş.
- ❌ Gerçek bir LQG hesabı **değildir**. Hiçbir intertwiner-uzayı korelatörü hesaplanmaz.
- ❌ Genel amaçlı bir graph editor **değildir**. İki topology ship edilir (Dipole ve Cycle-4); ikisi de hard-coded’dır.
- ❌ Bir cosmology modeli **değildir**. Bridge modülü oradan uzaklığı çerçeveler.

## Akademik Yönelim

Proje, **Bell-Network Geometry Lab** kimliğine doğru yeniden konumlanıyor —
küçük spin network’lerin quantum information ile quantum geometry
kesişiminde incelendiği, odaklı, tarayıcıda çalışan bir laboratuvar. Lab’ın
etrafında şekilleneceği kavramlar (sonraki fazlarda — hiçbiri henüz tam
hesaplama değil; çoğu Concept Atlas, lesson, challenge ve bridge’lerde
zaten görünüyor):

- Sabit bir graph üzerinde tek-parametreli korelasyon ailesi olarak
  **Bell-network states**.
- Komşu intertwiner’lar arasında paylaşılan yüzler üzerinden işleyen
  **entanglement-induced gluing**.
- Her node’a eşlik eden lokal görüntüler olarak **quantum polyhedra** ve
  **twisted geometry**.
- Aynı kombinatoryal verinin iki farklı yarı-klasik limiti olarak
  **vector geometry** ve **Regge geometry**.
- Graph simetrisinin önemsiz olmadığı ama izlenebilir kaldığı en sade
  sahne olarak **automorphism-invariant homogeneous graphs** (dipole,
  cycle-4).
- Visualizer’ın şu an yaklaşık olarak okuduğu observable’lar olarak
  **one-node observables** ve **local entanglement entropy**.
- Küçük graph’larda LQG-cosmology toy bağlamlarına eşlenen
  **effective geometry on dipole graphs** ve **spherical-tetrahedron**
  okuma.
- Toy modellerde simetrik, homojen graph korelasyonlarının cosmological
  homogeneity’nin yerini nasıl tuttuğunu inceleyen **correlations in
  quantum geometry and cosmology**.

Geometry Lab fazı bu kavramları *adlandırılmış araştırma hedefleri* olarak
yeniden çerçeveler — her birini bir dürüstlük sınıfıyla etiketler (aşağıya
bak) — ve mevcut Explore / Learn / Challenge / Bridge modlarının yanına
özel bir Lab yüzeyi olarak ekler. **Bu commit’te Lab kodu ship edilmiyor;**
bu yalnızca akademik registeri önce sabitleyen dokümantasyon adımıdır.

## Dürüstlük / Kapsam

Bu proje tam bir LQG hesaplama motoru **değildir**. Şu an ekrandaki sayılar
*pedagojik proxy*’lerdir — gerçek intertwiner-uzayı korelatörlerini
hesaplamak için değil, doğru nitel yönde tepki vermek için tasarlanmış
deterministik toy formüllerdir. Bridge modülü zaten gerçek bir cosmology
iddiasından olan mesafeyi çerçeveler ve bu register her yerde korunur.

Geometry Lab fazı bunu resmileştirir: her Lab diagnostic’i, kullanıcının
(ve yazarın) hangi register’ı okuduğunu her an bilebilmesi için aşağıdaki
dört dürüstlük türünden biriyle açıkça etiketlenmek zorundadır.

| etiket | anlamı |
| --- | --- |
| **Pedagogical proxy** | Doğru yönde tepki veren ama gerçek bir LQG niceliğini hesaplamayan toy formül. (Mevcut tüm skorlar bu sınıfa düşer.) |
| **Conceptual diagnostic** | Yapısal bir özelliğin (simetri, homogeneity, alignment paterni) niteliksel okuması — ciddiye alınacak bir sayı değil, evet / hayır / zayıf / güçlü göstergesi. |
| **Curated classification** | Yazarın koruduğu sabit bir kümeden seçilmiş ayrık etiket (ör. Bell-like / frustrated / edge-biased family tipiği). Sınıflama dürüsttür çünkü küme sayılabilir; matematik tüketici olduğu için değil. |
| **Future calculable observable** | Bir Bell-network state’inden dürüstçe hesaplanabilir *olabilen* ama şu an yalnızca eskizi bulunan bir nicelik — boşluk gizlenmek yerine görünür kılınsın diye etiketlenir. |

Hiçbir Lab paneline bu etiketlerden biri olmadan diagnostic eklenmeyecek.
Bu kural runtime kontrolü değil, CLAUDE.md kısıtıdır (bkz. *Constraints
that have been deliberately preserved*) — kuralı çiğnemenin bedeli, panelin
etiketsiz ship edilmesidir; bu disiplinin tam olarak yasakladığı şey.

## Akademik Kapsam: Bell-Network Geometry Lab

Proje artık birbirinin üzerine yığılmış **dört farklı epistemic register**
ile geliyor. Her register’ın sabit bir iddia zarfı var; her UI yüzeyi
hangi register’a ait olduğu ile etiketlenmiş durumda (görünür
`<ProxyBadge>` chip’leri, model chip’leri ve engine state çıktılarındaki
makine-okunur `honesty: …` literal’leri). Merdivenin üst basamaklarında
engine daha LQG-tadında sayılar üretir; her adımda exact / proxy /
gelecek-LQG sınırı net kalır.

### Tier 1 — Pedagogical proxy katmanı
**Nedir.** Canvas / graph diagnostics, dört-düğmeli state machine,
pair-bazlı toy değerler (`localStrength`, `localAlignmentScore`,
`localGluingProxy`), global aggregate’ler (`antiParallelScore`,
`gluingScore`, `mutualInformationProxy`).

**Durum.** Pedagojik proxy — doğru nitel yönde tepki veren deterministik
toy formüller. LQG observable’ı *değildir*.

**Nerede.** Explore mode canvas, Geometry Lab → Gluing Diagnostics’in
pedagogical-proxy satırları, Geometry Lab → Correlation Summary’nin pair
profile ve global summary kartları.

### Tier 2 — Minimal qubit quantum-information katmanı
**Nedir.** `ρ = |ψ⟩⟨ψ|` density matrix’leri, herhangi bir qubit alt-
kümesi üzerinden partial trace’ler, Jacobi eigendecomposition ile
hesaplanmış von Neumann entropy, tam pairwise mutual information
`I(A : B) = S(A) + S(B) − S(A ∪ B)`. Correlation Summary panelinde
**Minimal Qubit Engine Preview** olarak yüzeylenmiş; per-qubit entropy
heatmap ve exact pairwise MI heatmap ile birlikte.

**Durum.** Minimal qubit model içinde exact — küçük bir Hilbert uzayı
üzerinde kapalı formda hesaplanmış finite-dimensional quantum-
information sonuçları. App config’ten qubit state’ine olan eşleme
elden seçilmiş, LQG’den türetilmemiş. Model chip
`[minimal qubit model]` ve makine-okunur
`honesty: 'minimal-qubit-model'` literal’i state ile birlikte taşınır.

**Nerede.** Geometry Lab → Correlation Summary → Minimal Qubit Engine
Preview. Dipole preview Bell pair verir (`I = 2` bits); cycle-4 preview
4-qubit GHZ verir (her pair’de `I = 1` bit).

### Tier 3 — Single-node SU(2) representation / intertwiner katmanı
**Nedir.** Keyfi yarım-tamsayı spin için spin-`j` matrisleri (Jx, Jy,
Jz, Casimir); tensor-product spin spaces; total angular momentum
operatörleri; `J_total²`’nin eigendecomposition’ı; tek bir node’da her
spin tuple için SU(2)-invariant subspace projektörü `P_inv = V V†`.

**Durum.** Tam SU(2) representation-theory sonuçları. Tek-node
`mult(j_total = 0)` sayıları textbook Wigner ayrışımıyla tam olarak
eşleşir (selftest tarafından `[½, ½]`, `[½, ½, ½, ½]`, `[1, 1]`,
`[1, ½, ½]` için doğrulanmış). Tek bir node intertwiner space’i kendi
başına Bell-network state *değildir*.

**Nerede.** Geometry Lab → Correlation Summary → Single-node SU(2)
Intertwiner Sandbox. Header chip’i `[single-node SU(2) model]`.

### Tier 4 — Spin-1/2 projected Bell-network prototype katmanı
**Nedir.** Bir `BellNetworkGraph` contract’ı (node’lar + spin-etiketli
edge’ler, edge-slot bookkeeping ile) ve graph-level state üretici

> |Ψ_Γ⟩ = ( ⊗_nodes P_inv(node) ) · ( ⊗_edges |S⟩_edge ) / norm

— link-singlet ürününün, her node’un SU(2)-invariant subspace
projektörünün tensor ürününe izdüşümü, ardından L2-normalizasyonu.
İki-node tek-edge graph (minimal prototype), dipole graph (endpoint dim
256 / graph invariant dim 4), ve cycle-4 graph (endpoint dim 256 /
graph invariant dim 1) için ship’lenmiş.

**Durum.** Projected construction içinde exact. Geometry observable
**değildir**, cosmological state **değildir** — state sabit bir
kombinatoryal graph üzerinde yaşar ve area / volume / dihedral
operatörlerinin uygulanmasını bekler. Model chip
`[graph contract · projected spin-1/2 states]` ve makine-okunur
`honesty: 'spin-half-projected-bell-network-state'` literal’i state ile
birlikte taşınır.

**Nerede.** Geometry Lab → Correlation Summary → Bell-network Graph
Sandbox. Üç canonical graph’ın hepsi state register / kind / endpoint
dim / graph invariant dim / per-node invariant dims / honesty marker
ile birlikte kart olarak görünür.

### Ne exact, ne proxy, ne future LQG

| katman | şu modelin içinde exact… | exact LQG değil çünkü… |
| --- | --- | --- |
| **Tier 1** (pedagogical proxy) | hiçbir model değil — toy formül | her skor dört düğmenin curated bir fonksiyonu |
| **Tier 2** (minimal qubit) | curated bir qubit state üzerinde finite-dim quantum-information aritmetiği | topology+family → qubit-state eşlemesi elle seçilmiş, LQG’den türetilmemiş |
| **Tier 3** (single-node SU(2)) | tek bir node’da SU(2) representation theory | tek-node intertwiner space graph-level state değildir |
| **Tier 4** (projected Bell-network) | projected construction `P_global · ⊗|S⟩ / norm` | ona uygulanmış geometri operatörü yok; sadece spin-1/2 |
| **future LQG** | textbook LQG kinematic Hilbert space | henüz uygulanmadı — bkz. roadmap |

### Eşlik eden dokümanlar

[`docs/`](./docs) altında üç doküman bu README’ye eşlik eder:

- **[`docs/academic-demo-flow.md`](./docs/academic-demo-flow.md)** —
  bu dört tier’a haritalanmış 5–7 dakikalık Geometry Lab walkthrough,
  sonunda tartışma soruları ile birlikte.
- **[`docs/honesty-classes.md`](./docs/honesty-classes.md)** — hangi
  register’ın ne iddia edebileceğinin canonical referansı; dört
  `<ProxyBadge>` türü, üç engine honesty literal’i, üç UI model
  chip’i ve explicit “söyleyemediklerin” sınırı listesini içerir.
- **[`docs/future-research-roadmap.md`](./docs/future-research-roadmap.md)**
  — üç-horizon plan: yakın-vade (projected state üzerinde
  area / volume / dihedral / reduced ρ), orta-vade (arbitrary-spin
  Wigner-3j / twisted-vs-Regge), uzun-vade (spin-foam vertex
  amplitude / cosmological sector mapping / refinement / coherent
  intertwiners).

## Hatırlıyor mu ne yaptığımı?

Evet. Uygulama kullanıcıya görünen tüm state’i `bell-network-visualizer:v1` anahtarı altında `localStorage`’da saklar:

- Dört düğme değeri (topology, state family, strength, observable lens)
- Hangi moddasın ve hangi lesson / challenge / bridge lesson aktif
- Learn ve Challenge’da hangi checkpoint’leri açtığın
- O anda seçili face pair
- *Buradan başla* onboarding kartını görüp görmediğin
- **Aktif dil (EN veya TR)**

Sekmeyi yenilemek seni tam bıraktığın yerde karşılar. Hesap yok, cookie yok, sunucu yok.

## Belirli bir setup’ı nasıl paylaşırım?

URL hash’i mevcut konfigürasyonu kodlar, böylece herhangi bir spesifik setup düz bir bağlantı olarak gönderilebilir — sunucu gidiş-dönüşü yok, kısaltıcı yok. Herhangi bir noktada tarayıcı URL’sini kopyala ve paylaş; alıcı aynı dilde, aynı topology, state family, strength, lens, aktif lesson / challenge / bridge ve seçili pair ile açar.

Örnek:

```
#lang=tr&mode=learn&lesson=topology-upgrade&topology=cycle4&family=frustrated&strength=0.70&lens=uniformity&edge=c23
```

Yüklendiğinde URL, alıcının yerel olarak saklanan ayarlarının önüne geçer.

## Hızlı başlangıç

```bash
npm install
npm run dev
```

Sonra Vite’ın yazdığı URL’yi aç (genellikle <http://localhost:5173>).

| komut               | açıklama                                                |
| ------------------- | ------------------------------------------------------- |
| `npm run dev`           | Vite dev sunucusunu başlatır                            |
| `npm run build`         | tip denetimi + production bundle üretir                 |
| `npm run preview`       | production bundle’ı yerel olarak servis eder            |
| `npm run typecheck`     | TypeScript’i `--noEmit` modunda çalıştırır              |
| `npm run validate:i18n` | EN ↔ TR içerik yapılarının eşleştiğini doğrular         |

> **Bakım notu — bu repo çift dillidir.** Kullanıcıya görünen her metin —
> arayüz chrome’u, lesson / challenge / bridge / glossary içeriği, buton
> etiketleri, onay diyalogları, yardımcı metinler — aynı commit’te
> `src/i18n/ui/en.ts` ↔ `src/i18n/ui/tr.ts` **ve** `src/data/en/*` ↔
> `src/data/tr/*` dosyalarında birlikte ship edilmelidir. Teknik LQG
> terimleri (spin network, Bell-network, face pair, gluing, observable
> lens, Regge geometry, …) politika gereği İngilizce kalır; etraflarındaki
> cümleler çevrilmelidir.
>
> `npm run validate:i18n` artık iki kontrolü arka arkaya çalıştırır:
> `validate-i18n.mjs` (içerik yapı parity — id’ler, order, prev/next
> zinciri, config / option / related-id şekilleri, glossary `tags`
> varlığı) ve `validate-ui-i18n.mjs` (UI string-ağacı parity — her
> derinlikte aynı anahtarlar, aynı leaf tipi, aynı dizi uzunlukları).
> Yalnız yapıyı doğrular; çeviri kalitesini değil — onu insan incelemesine
> bırakır.
>
> GitHub Actions deploy workflow’u `npm run build`’den önce aynı umbrella
> komutu çalıştırır; dolayısıyla yapısal drift CI’de fail olur ve GitHub
> Pages’a hiç ulaşmaz. Push’tan önce script’i yerelde de çalıştırmak aynı
> hataları erken yakalar.

## Toy model hakkında dürüstlük notu

Ekrandaki her sayı, dört düğmeden deterministik formüller üzerinden türetilen bir toy proxy’dir. Doğru nitel yönde tepki verirler ama gerçek intertwiner-uzayı korelatörleri hesaplamazlar. Bridge modülü, bu toy ile her dürüst cosmology iddiası arasındaki mesafeyi ayrıca çerçeveler.

Daha ayrıntılı teknik mimari, tam geliştirici kılavuzu ve formül tablosu için İngilizce [README.md](./README.md) dosyasına bak.

## Lisans

Bu proje [MIT License](./LICENSE) altında yayımlanmıştır.
