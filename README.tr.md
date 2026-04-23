# Bell-Network Visualizer

**Küçük spin network’ler üzerinde — paylaşılan yüzler arasındaki entanglement’ın glued-polyhedron geometry’sini nasıl destekleyebileceğine dair — etkileşimli, tarayıcıda çalışan bir toy model.**

İki küçük spin network ship edilir: **dipole graph** ve **dört düğümlü cycle graph**. İkisi de, rehberli lesson’lar, Sokratik challenge’lar ve cosmology-bridge reflection’larıyla desteklenen state-family / observable-lens deneylerine zemin olur.

- 🔬 Entanglement strength’in face normal’ları anti-parallel çiftlere nasıl kilitlediğini hisset.
- 🎛 Korelasyonun *ne kadar olduğunu* (strength) *nasıl dağıldığından* (state family) ayır.
- 🔭 Aynı state’i beş toy observable lens üzerinden — canvas’ı değiştirmeden — oku.
- 🧭 Sekiz lesson, on challenge, yedi bridge lesson ve on yedi girişli Concept Atlas’ı sırayla dolaş.

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
