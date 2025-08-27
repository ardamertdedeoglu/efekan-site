"use client";

import { useState } from "react";
import ThemeToggle from "../../components/ThemeToggle";

type FormData = {
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  address: string;
  complaint: string;
};

export default function AppointmentPage() {
  const [form, setForm] = useState<FormData>({
    first_name: "",
    last_name: "",
    email: "",
    phone: "",
    address: "",
    complaint: "",
  });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(null);
    try {
      const res = await fetch("/api/appointments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data?.error || "Bir hata oluştu");
      setSuccess(data?.message || "Randevu başarıyla oluşturuldu!");
      await fetch("/api/appointments-notify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      setForm({
        first_name: "",
        last_name: "",
        email: "",
        phone: "",
        address: "",
        complaint: "",
      });
    } catch (err: unknown) {
      const message =
        err instanceof Error ? err.message : "İşlem sırasında bir hata oluştu.";
      setError(message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="min-h-screen bg-white dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100">
      <div className="mx-auto max-w-3xl px-6 py-12 sm:py-16">
        <div className="flex items-center justify-between gap-4 mb-6">
          <div>
            <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
              Randevu Oluştur
            </h1>
            <p className="mt-2 text-zinc-600 dark:text-zinc-300">
              Lütfen bilgilerinizi eksiksiz doldurun. Ekibimiz en kısa sürede
              sizinle iletişime geçecektir.
            </p>
          </div>
          <ThemeToggle />
        </div>

        <form onSubmit={onSubmit} className="mt-8 grid gap-6">
          {/* İsim Soyisim */}
          <div className="grid sm:grid-cols-2 gap-6">
            <div>
              <label
                htmlFor="first_name"
                className="block text-sm font-medium mb-2"
              >
                İsim
              </label>
              <input
                id="first_name"
                name="first_name"
                required
                value={form.first_name}
                onChange={(e) =>
                  setForm((f) => ({ ...f, first_name: e.target.value }))
                }
                className="w-full rounded-xl border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-900 px-4 py-3 outline-none focus:ring-2 focus:ring-emerald-600"
                placeholder="Adınız"
              />
            </div>
            <div>
              <label
                htmlFor="last_name"
                className="block text-sm font-medium mb-2"
              >
                Soyisim
              </label>
              <input
                id="last_name"
                name="last_name"
                required
                value={form.last_name}
                onChange={(e) =>
                  setForm((f) => ({ ...f, last_name: e.target.value }))
                }
                className="w-full rounded-xl border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-900 px-4 py-3 outline-none focus:ring-2 focus:ring-emerald-600"
                placeholder="Soyadınız"
              />
            </div>
          </div>

          {/* İletişim */}
          <div className="grid sm:grid-cols-2 gap-6">
            <div>
              <label htmlFor="email" className="block text-sm font-medium mb-2">
                E‑posta
              </label>
              <input
                id="email"
                name="email"
                type="email"
                required
                value={form.email}
                onChange={(e) =>
                  setForm((f) => ({ ...f, email: e.target.value }))
                }
                className="w-full rounded-xl border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-900 px-4 py-3 outline-none focus:ring-2 focus:ring-emerald-600"
                placeholder="ornek@mail.com"
              />
            </div>
            <div>
              <label htmlFor="phone" className="block text-sm font-medium mb-2">
                Telefon
              </label>
              <input
                id="phone"
                name="phone"
                type="tel"
                inputMode="tel"
                required
                value={form.phone}
                onChange={(e) =>
                  setForm((f) => ({ ...f, phone: e.target.value }))
                }
                className="w-full rounded-xl border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-900 px-4 py-3 outline-none focus:ring-2 focus:ring-emerald-600"
                placeholder="0 (5xx) xxx xx xx"
              />
            </div>
          </div>

          {/* Adres */}
          <div>
            <label htmlFor="address" className="block text-sm font-medium mb-2">
              Adres
            </label>
            <textarea
              id="address"
              name="address"
              rows={3}
              required
              value={form.address}
              onChange={(e) =>
                setForm((f) => ({ ...f, address: e.target.value }))
              }
              className="w-full rounded-xl border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-900 px-4 py-3 outline-none focus:ring-2 focus:ring-emerald-600"
              placeholder="Açık adresinizi yazınız"
            />
          </div>

          {/* Şikayet */}
          <div>
            <label
              htmlFor="complaint"
              className="block text-sm font-medium mb-2"
            >
              Şikayetiniz
            </label>
            <textarea
              id="complaint"
              name="complaint"
              rows={5}
              required
              value={form.complaint}
              onChange={(e) =>
                setForm((f) => ({ ...f, complaint: e.target.value }))
              }
              className="w-full rounded-xl border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-900 px-4 py-3 outline-none focus:ring-2 focus:ring-emerald-600"
              placeholder="Kısa bir özet paylaşabilirsiniz"
            />
          </div>

          {error && (
            <div className="rounded-xl border border-red-200 text-red-800 bg-red-50 px-4 py-3 dark:border-red-900 dark:text-red-200 dark:bg-red-950/40">
              {error}
            </div>
          )}
          {success && (
            <div className="rounded-xl border border-emerald-200 text-emerald-900 bg-emerald-50 px-4 py-3 dark:border-emerald-900 dark:text-emerald-200 dark:bg-emerald-950/40">
              {success}
            </div>
          )}

          <div className="flex items-center gap-3">
            <button
              type="submit"
              disabled={loading}
              className="inline-flex items-center justify-center rounded-full bg-emerald-600 text-white px-6 py-3 font-medium hover:bg-emerald-700 disabled:opacity-50"
            >
              {loading ? "Gönderiliyor..." : "Randevu Oluştur"}
            </button>
            <a
              href="/"
              className="text-sm text-zinc-600 hover:text-emerald-700 dark:text-zinc-300"
            >
              Ana sayfaya dön
            </a>
          </div>
        </form>
      </div>
    </main>
  );
}
