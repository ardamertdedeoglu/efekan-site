"use client";

import { useEffect, useState } from "react";
import ThemeToggle from "../components/ThemeToggle";

type Service = {
  title: string;
  desc: string;
  color: string;
  fullDescription: string;
  features: string[];
};

const services: Service[] = [
  {
    title: "Poliklinik",
    desc: "Dahiliye, Kardiyoloji, Cildiye ve daha fazlası.",
    color: "bg-emerald-600",
    fullDescription: "Uzman hekimlerimiz ile kapsamlı poliklinik hizmetleri sunuyoruz. Modern tanı yöntemleri ve hasta odaklı yaklaşımımızla sağlığınız güvende.",
    features: [
      "Dahiliye - Genel sağlık kontrolü ve hastalık takibi",
      "Kardiyoloji - Kalp ve damar hastalıkları",
      "Cildiye - Deri hastalıkları ve estetik uygulamalar",
      "Nöroloji - Sinir sistemi hastalıkları",
      "Üroloji - Böbrek ve ürogenital sistem"
    ]
  },
  {
    title: "Laboratuvar",
    desc: "Kan, idrar, biyokimya ve mikrobioloji analizleri.",
    color: "bg-cyan-600",
    fullDescription: "Son teknoloji cihazlarımızla hızlı ve güvenilir laboratuvar sonuçları. Aynı gün sonuç garantisi ile sağlığınızı takip edin.",
    features: [
      "Tam kan sayımı ve biyokimya panelleri",
      "Hormon ve vitamin düzeyi ölçümleri",
      "Mikrobiyolojik kültür ve antibiyogram",
      "Serolojik testler ve alerji panelleri",
      "Genetik testler ve kanser belirteçleri"
    ]
  },
  {
    title: "Görüntüleme",
    desc: "Röntgen, USG, MR ve BT ile ileri görüntüleme.",
    color: "bg-indigo-600",
    fullDescription: "En güncel görüntüleme teknolojileri ile hassas tanı imkanları. Deneyimli radyolog hekimlerimiz ile detaylı raporlama.",
    features: [
      "Dijital röntgen sistemleri",
      "Renkli doppler ultrasonografi",
      "Manyetik rezonans görüntüleme (MR)",
      "Bilgisayarlı tomografi (BT)",
      "Mamografi ve kemik yoğunluğu ölçümü"
    ]
  },
  {
    title: "Acil Servis",
    desc: "7/24 hızlı ve etkin acil müdahale.",
    color: "bg-rose-600",
    fullDescription: "Yaşamsal acil durumlar için 7/24 kesintisiz hizmet. Ambulans ve ilk yardım ekibimiz ile anında müdahale garantisi.",
    features: [
      "7/24 acil müdahale ekibi",
      "Ambulans ve hasta nakil hizmeti",
      "Yoğun bakım ünitesi",
      "Travma ve kaza müdahalesi",
      "Kardiyak acil durumlar"
    ]
  },
  {
    title: "Evde Sağlık",
    desc: "Evde bakım ve takip hizmetleri.",
    color: "bg-amber-600",
    fullDescription: "Konforunuzdan vazgeçmeden kaliteli sağlık hizmeti. Evde bakım ekibimiz ile sürekli takip ve tedavi imkanı.",
    features: [
      "Evde hemşirelik bakımı",
      "Kronik hastalık takibi",
      "Yaşlı bakım hizmetleri",
      "Fizyoterapi ve rehabilitasyon",
      "İlaç tedavisi ve serum uygulaması"
    ]
  },
  {
    title: "Check-Up",
    desc: "Kişiye özel tarama paketleri.",
    color: "bg-fuchsia-600",
    fullDescription: "Yaş, cinsiyet ve risk faktörlerinize uygun kapsamlı sağlık taraması. Hastalıkları erken teşhis ile önleme fırsatı.",
    features: [
      "Genel sağlık tarama paketleri",
      "Kadın sağlığı check-up",
      "Erkek sağlığı check-up",
      "Kalp sağlığı taraması",
      "Kanser tarama programları"
    ]
  }
];

export default function Home() {
  const [selectedService, setSelectedService] = useState<Service | null>(null);

  // ESC ile modal kapatma
  useEffect(() => {
    if (!selectedService) return;
    
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") setSelectedService(null);
    }
    
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [selectedService]);

  return (
    <main className="min-h-screen bg-white dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100">
      {/* Üst Navigasyon */}
      <header className="sticky top-0 z-50 backdrop-blur supports-[backdrop-filter]:bg-white/70 dark:supports-[backdrop-filter]:bg-zinc-950/70 border-b border-zinc-200/60 dark:border-zinc-800/60">
        <div className="mx-auto max-w-6xl px-6 py-3 flex items-center justify-between">
          <a
            href="/"
            aria-label="Ana sayfa"
            className="flex items-center gap-2 font-semibold tracking-tight"
          >
            <span className="inline-grid place-items-center w-8 h-8 rounded-md bg-emerald-600 text-white">
              {/* Basit sağlık artı ikonu */}
              <svg
                viewBox="0 0 24 24"
                className="w-5 h-5"
                role="img"
                aria-labelledby="logo-title"
              >
                <title id="logo-title">Sağlık artı ikonu</title>
                <path
                  fill="currentColor"
                  d="M10.5 3.5h3v6h6v3h-6v6h-3v-6h-6v-3h6z"
                />
              </svg>
            </span>
            <span>Başakşehir Evlere Sağlık</span>
          </a>
          
          {/* Mobil için sadece tema toggle */}
          <div className="sm:hidden">
            <ThemeToggle />
          </div>

          {/* Desktop navigation */}
          <nav className="hidden sm:flex items-center gap-6 text-sm">
            <ThemeToggle />
            <a className="hover:text-emerald-600" href="#hizmetler">
              Hizmetler
            </a>       
            <a className="hover:text-emerald-600" href="#neden-biz">
              Neden Biz?
            </a>
            <a className="hover:text-emerald-600" href="#iletisim">
              İletişim
            </a>
            <a
              className="inline-flex items-center justify-center rounded-full bg-emerald-600 text-white px-4 py-2 font-medium hover:bg-emerald-700"
              href="/appointment"
            >
              Randevu Al
            </a>
          </nav>
        </div>
      </header>

      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 -z-10 bg-gradient-to-b from-emerald-50 to-transparent dark:from-emerald-900/20" />
        <div className="mx-auto max-w-6xl px-6 py-16 sm:py-24">
          <div className="grid lg:grid-cols-2 gap-10 items-center">
            <div>
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight">
                Sağlıkta Güven, Kalitede Öncü
              </h1>
              <p className="mt-4 text-lg text-zinc-600 dark:text-zinc-300">
                Modern altyapı, deneyimli kadro ve hasta odaklı yaklaşım ile
                7/24 yanınızdayız. Tüm tanı ve tedavi süreçlerinde şeffaf, hızlı
                ve güvenilir hizmet sunuyoruz.
              </p>
              <div className="mt-8 flex flex-col sm:flex-row gap-3">
                <a
                  href="#hizmetler"
                  className="inline-flex items-center justify-center rounded-full bg-emerald-600 text-white px-5 py-3 font-medium hover:bg-emerald-700"
                >
                  Hizmetlerimizi Keşfedin
                </a>
                <a
                  href="/appointment"
                  className="inline-flex items-center justify-center rounded-full border border-zinc-300 dark:border-zinc-700 px-5 py-3 font-medium hover:bg-zinc-50 dark:hover:bg-zinc-900"
                >
                  Randevu / Bilgi Al
                </a>
              </div>
              <div className="mt-6 flex items-center gap-4 text-sm text-zinc-600 dark:text-zinc-400">
                <div className="flex items-center gap-2">
                  <span className="inline-flex w-5 h-5 items-center justify-center rounded bg-emerald-600 text-white text-[10px]">
                    7/24
                  </span>
                  Acil Servis
                </div>
                <div className="flex items-center gap-2">
                  <span className="inline-block w-5 h-5 rounded-full bg-emerald-100 dark:bg-emerald-900/40" />
                  ISO 9001 Kalite
                </div>
              </div>
            </div>
            <div className="relative">
              <div className="aspect-[4/3] rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 shadow-sm grid place-items-center">
                {/* Temsili görsel/ikon */}
                <svg
                  viewBox="0 0 200 200"
                  className="w-3/4 h-3/4 text-emerald-600"
                  role="img"
                  aria-labelledby="hero-plus-title"
                >
                  <title id="hero-plus-title">Artı simgesi</title>
                  <circle
                    cx="100"
                    cy="100"
                    r="90"
                    fill="currentColor"
                    opacity="0.1"
                  />
                  <rect
                    x="90"
                    y="40"
                    width="20"
                    height="120"
                    rx="4"
                    fill="currentColor"
                  />
                  <rect
                    x="40"
                    y="90"
                    width="120"
                    height="20"
                    rx="4"
                    fill="currentColor"
                  />
                </svg>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Hizmetler */}
      <section id="hizmetler" className="mx-auto max-w-6xl px-6 py-16 sm:py-24">
        <div className="flex items-end justify-between gap-6 mb-10">
          <div>
            <h2 className="text-2xl sm:text-3xl font-bold tracking-tight">
              Hizmetlerimiz
            </h2>
            <p className="mt-2 text-zinc-600 dark:text-zinc-300">
              İhtiyacınıza uygun kapsamlı tanı ve tedavi çözümleri.
            </p>
          </div>
          <a
            href="/appointment"
            className="hidden sm:inline-flex items-center rounded-full border border-zinc-300 dark:border-zinc-700 px-4 py-2 text-sm hover:bg-zinc-50 dark:hover:bg-zinc-900"
          >
            Randevu Al
          </a>
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {services.map((s) => (
            <article
              key={s.title}
              onClick={() => setSelectedService(s)}
              className="rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 p-5 shadow-sm hover:shadow-md transition-all cursor-pointer hover:scale-105"
            >
              <div className="flex items-center gap-3">
                <span
                  className={`inline-grid place-items-center w-10 h-10 rounded-lg text-white ${s.color}`}
                >
                  <svg
                    viewBox="0 0 24 24"
                    className="w-5 h-5"
                    role="img"
                    aria-labelledby={`svc-${s.title}-title`}
                  >
                    <title id={`svc-${s.title}-title`}>Hizmet ikonu</title>
                    <path
                      fill="currentColor"
                      d="M10.5 3.5h3v6h6v3h-6v6h-3v-6h-6v-3h6z"
                    />
                  </svg>
                </span>
                <h3 className="text-lg font-semibold leading-tight">
                  {s.title}
                </h3>
              </div>
              <p className="mt-3 text-sm text-zinc-600 dark:text-zinc-300">
                {s.desc}
              </p>
              <div className="mt-4 flex items-center text-sm text-emerald-600 dark:text-emerald-400 font-medium">
                Detayları Gör
                <svg className="w-4 h-4 ml-1" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M8.59 16.59L13.17 12 8.59 7.41 10 6l6 6-6 6-1.41-1.41z"/>
                </svg>
              </div>
            </article>
          ))}
        </div>
      </section>

      {/* Neden Biz */}
      <section id="neden-biz" className="mx-auto max-w-6xl px-6 py-16 sm:py-24">
        <h2 className="text-2xl sm:text-3xl font-bold tracking-tight">
          Neden Bizi Tercih Etmelisiniz?
        </h2>
        <div className="mt-8 grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {[
            {
              title: "Deneyimli Kadro",
              desc: "Uzman hekimler ve alanında eğitimli sağlık personeli.",
            },
            {
              title: "Modern Teknoloji",
              desc: "Güncel cihaz ve dijital sistemlerle hızlı sonuç.",
            },
            {
              title: "Hasta Odaklılık",
              desc: "Güler yüzlü, şeffaf ve etik yaklaşım.",
            },
          ].map((f) => (
            <div
              key={f.title}
              className="rounded-2xl border border-zinc-200 dark:border-zinc-800 p-6 bg-gradient-to-b from-zinc-50 to-white dark:from-zinc-900 dark:to-zinc-950"
            >
              <div className="flex items-center gap-3">
                <span className="inline-grid place-items-center w-10 h-10 rounded-lg bg-emerald-600 text-white">
                  <svg
                    viewBox="0 0 24 24"
                    className="w-5 h-5"
                    role="img"
                    aria-labelledby={`why-${f.title}-title`}
                  >
                    <title id={`why-${f.title}-title`}>Onay ikonu</title>
                    <path
                      fill="currentColor"
                      d="M20.285 6.708a1 1 0 0 1 0 1.414l-9.9 9.9a1 1 0 0 1-1.414 0l-5.657-5.657a1 1 0 1 1 1.414-1.414l4.95 4.95 9.193-9.193a1 1 0 0 1 1.414 0z"
                    />
                  </svg>
                </span>
                <h3 className="text-lg font-semibold">{f.title}</h3>
              </div>
              <p className="mt-3 text-sm text-zinc-600 dark:text-zinc-300">
                {f.desc}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA Şeridi */}
      <section className="mx-auto max-w-6xl px-6">
        <div className="rounded-2xl border border-emerald-200 dark:border-emerald-900 bg-emerald-600 text-white p-6 sm:p-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <h3 className="text-xl font-semibold">
              Sağlığınız için bugün adım atın
            </h3>
            <p className="text-white/90 mt-1">
              Randevu ve bilgi için bizimle iletişime geçin.
            </p>
          </div>
          <a
            href="/appointment"
            className="inline-flex items-center justify-center rounded-full bg-white text-emerald-700 px-5 py-3 font-medium hover:bg-white/90"
          >
            Randevu Talebi
          </a>
        </div>
      </section>

      {/* İletişim */}
      <section id="iletisim" className="mx-auto max-w-6xl px-6 py-16 sm:py-24">
        <h2 className="text-2xl sm:text-3xl font-bold tracking-tight">
          İletişim
        </h2>
        <div className="mt-8 grid md:grid-cols-2 gap-6">
          <div className="rounded-2xl border border-zinc-200 dark:border-zinc-800 p-6">
            <h3 className="font-semibold">Telefon</h3>
            <a
              className="mt-2 block text-emerald-700 dark:text-emerald-400 hover:underline"
              href="tel:+905428366199"
            >
              0 (542) 836 61 99
            </a>
          </div>
          <div className="rounded-2xl border border-zinc-200 dark:border-zinc-800 p-6">
            <h3 className="font-semibold">E‑posta</h3>
            <a
              className="mt-2 block text-emerald-700 dark:text-emerald-400 hover:underline"
              href="mailto:efebnzr@gmail.com"
            >
              efebnzr@gmail.com
            </a>
          </div>
        </div>
      </section>

      <footer className="border-t border-zinc-200 dark:border-zinc-800 py-8">
        <div className="mx-auto max-w-6xl px-6 text-sm text-zinc-600 dark:text-zinc-400 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p>
            © {new Date().getFullYear()} Örnek Sağlık. Tüm hakları saklıdır.
          </p>
          <div className="flex items-center gap-4">
            <a href="#hizmetler" className="hover:text-emerald-600">
              Hizmetler
            </a>
            <a href="#neden-biz" className="hover:text-emerald-600">
              Neden Biz
            </a>
            <a href="#iletisim" className="hover:text-emerald-600">
              İletişim
            </a>
          </div>
        </div>
      </footer>

      {/* Hizmet Detay Modalı */}
      {selectedService && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          aria-hidden={false}
        >
          <div
            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
            onClick={() => setSelectedService(null)}
          />
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="service-dialog-title"
            className="relative z-10 w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 shadow-xl"
          >
            <div className="p-6 border-b border-zinc-200 dark:border-zinc-800 flex items-start justify-between">
              <div className="flex items-center gap-3">
                <span
                  className={`inline-grid place-items-center w-12 h-12 rounded-xl text-white ${selectedService.color}`}
                >
                  <svg
                    viewBox="0 0 24 24"
                    className="w-6 h-6"
                    role="img"
                    aria-hidden="true"
                  >
                    <path
                      fill="currentColor"
                      d="M10.5 3.5h3v6h6v3h-6v6h-3v-6h-6v-3h6z"
                    />
                  </svg>
                </span>
                <div>
                  <h2 id="service-dialog-title" className="text-xl font-bold">
                    {selectedService.title}
                  </h2>
                  <p className="text-sm text-zinc-600 dark:text-zinc-400 mt-1">
                    {selectedService.desc}
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setSelectedService(null)}
                className="rounded-full p-2 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors flex-shrink-0"
                aria-label="Modalı kapat"
              >
                <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12 19 6.41z"/>
                </svg>
              </button>
            </div>
            
            <div className="p-6">
              <p className="text-zinc-700 dark:text-zinc-300 leading-relaxed mb-6">
                {selectedService.fullDescription}
              </p>
              
              <h3 className="text-lg font-semibold mb-4">Hizmet Detayları</h3>
              <ul className="space-y-3">
                {selectedService.features.map((feature, index) => (
                  <li key={index} className="flex items-start gap-3">
                    <span className="inline-grid place-items-center w-5 h-5 rounded-full bg-emerald-600 text-white flex-shrink-0 mt-0.5">
                      <svg className="w-3 h-3" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41L9 16.17z"/>
                      </svg>
                    </span>
                    <span className="text-zinc-700 dark:text-zinc-300">{feature}</span>
                  </li>
                ))}
              </ul>
            </div>
            
            <div className="p-6 border-t border-zinc-200 dark:border-zinc-800 flex flex-col sm:flex-row gap-3">
              <a
                href="/appointment"
                className="inline-flex items-center justify-center rounded-full bg-emerald-600 text-white px-6 py-3 font-medium hover:bg-emerald-700 transition-colors"
              >
                Randevu Al
              </a>
              <a
                href="tel:+905428366199"
                className="inline-flex items-center justify-center rounded-full border border-zinc-300 dark:border-zinc-700 px-6 py-3 font-medium hover:bg-zinc-50 dark:hover:bg-zinc-800 transition-colors"
              >
                Bilgi Al
              </a>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
