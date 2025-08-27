"use client";

import { useRouter } from "next/navigation";
import { useCallback, useEffect, useMemo, useState } from "react";
import { supabase } from "../../../lib/supabaseClient";
import ThemeToggle from "@/components/ThemeToggle";

type Appointment = {
  id: string;
  first_name: string;
  last_name: string;
  phone: string;
  email: string;
  address: string;
  complaint: string;
  created_at?: string;
};

export default function AdminPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [authLoading, setAuthLoading] = useState(false);
  const [session, setSession] = useState<
    "unknown" | "signed-in" | "signed-out"
  >("unknown");
  const [error, setError] = useState<string | null>(null);

  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(false);
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [detail, setDetail] = useState<Appointment | null>(null);

  useEffect(() => {
    // Oturum kontrolü (hata durumunda signed-out'a düş)
    supabase.auth
      .getSession()
      .then(({ data }) => {
        setSession(data.session ? "signed-in" : "signed-out");
        if (!data.session && typeof window !== "undefined") {
          // Anonim veya bozuk oturum izleri varsa temizle
          try {
            for (let i = 0; i < localStorage.length; i++) {
              const key = localStorage.key(i);
              if (key?.startsWith("sb-")) localStorage.removeItem(key);
            }
          } catch {}
        }
      })
      .catch(() => setSession("signed-out"));

    const { data: sub } = supabase.auth.onAuthStateChange((_event, sess) => {
      setSession(sess ? "signed-in" : "signed-out");
    });
    return () => {
      sub.subscription.unsubscribe();
    };
  }, []);

  async function login(e: React.FormEvent) {
    e.preventDefault();
    setAuthLoading(true);
    setError(null);
    const { error: authError } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    if (authError) setError(authError.message);
    setAuthLoading(false);
  }

  async function logout() {
    setError(null);
    try {
      const { error: signOutError } = await supabase.auth.signOut({
        scope: "global",
      });
      // session_not_found hata durumunu kritik saymıyoruz
      if (
        signOutError &&
        !/session[_\s-]?not[_\s-]?found/i.test(signOutError.message)
      ) {
        setError(signOutError.message);
      }
    } finally {
      // Güvenli tarafta kalmak için Supabase tokenlarını temizle
      try {
        if (typeof window !== "undefined") {
          for (let i = 0; i < localStorage.length; i++) {
            const key = localStorage.key(i);
            if (key?.startsWith("sb-")) {
              localStorage.removeItem(key);
            }
          }
        }
      } catch {}
      setSession("signed-out");
      setAppointments([]);
      setSelected(new Set());
      router.replace("/admin");
    }
  }

  const fetchAppointments = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const { data: sess } = await supabase.auth.getSession();
      const token = sess.session?.access_token;
      const res = await fetch("/api/appointments", {
        method: "GET",
        cache: "no-store",
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data?.error || "Kayıtlar alınamadı");
      setAppointments(data as Appointment[]);
      setSelected(new Set());
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Bilinmeyen hata";
      setError(msg);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (session === "signed-in") fetchAppointments();
  }, [session, fetchAppointments]);

  // ESC ile modal kapatma
  useEffect(() => {
    if (!detail) return;
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") setDetail(null);
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [detail]);

  function toggleSelect(id: string) {
    setSelected((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  }

  function toggleSelectAll() {
    setSelected((prev) => {
      if (prev.size === appointments.length) return new Set<string>();
      return new Set<string>(appointments.map((a) => a.id));
    });
  }

  const allChecked = useMemo(
    () => appointments.length > 0 && selected.size === appointments.length,
    [appointments, selected],
  );

  async function deleteSelected() {
    if (selected.size === 0) return;
    const ids = Array.from(selected);
    try {
      setLoading(true);
      const { data: sess } = await supabase.auth.getSession();
      const token = sess.session?.access_token;
      const responses = await Promise.all(
        ids.map((id) =>
          fetch("/api/appointments", {
            method: "DELETE",
            headers: {
              "Content-Type": "application/json",
              ...(token ? { Authorization: `Bearer ${token}` } : {}),
            },
            body: JSON.stringify({ id }),
          }),
        ),
      );
      const anyError = responses.find((r) => !r.ok);
      if (anyError) {
        const data = await anyError.json();
        throw new Error(data?.error || "Silme işleminde hata oluştu");
      }
      await fetchAppointments();
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Bilinmeyen hata";
      setError(msg);
    } finally {
      setLoading(false);
    }
  }

  if (session !== "signed-in") {
    return (
      <main className="min-h-screen bg-white dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100 grid place-items-center px-6">
        <form
          onSubmit={login}
          className="w-full max-w-sm rounded-2xl border border-zinc-200 dark:border-zinc-800 p-6 bg-white dark:bg-zinc-900 shadow-sm"
        >
          <h1 className="text-xl font-semibold">Admin Girişi</h1>
          <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">
            Lütfen e‑posta ve şifrenizi girin.
          </p>

          {error && (
            <div className="mt-4 rounded-lg border border-red-200 text-red-800 bg-red-50 px-3 py-2 dark:border-red-900 dark:text-red-200 dark:bg-red-950/40">
              {error}
            </div>
          )}

          <div className="mt-4 grid gap-3">
            <div>
              <label htmlFor="email" className="block text-sm font-medium mb-1">
                E‑posta
              </label>
              <input
                id="email"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full rounded-lg border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-900 px-3 py-2 outline-none focus:ring-2 focus:ring-emerald-600"
                placeholder="admin@ornek.com"
              />
            </div>
            <div>
              <label
                htmlFor="password"
                className="block text-sm font-medium mb-1"
              >
                Şifre
              </label>
              <input
                id="password"
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full rounded-lg border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-900 px-3 py-2 outline-none focus:ring-2 focus:ring-emerald-600"
                placeholder="••••••••"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={authLoading}
            className="mt-5 inline-flex items-center justify-center rounded-full bg-emerald-600 text-white px-5 py-2.5 font-medium hover:bg-emerald-700 disabled:opacity-50 w-full"
          >
            {authLoading ? "Giriş yapılıyor..." : "Giriş Yap"}
          </button>
        </form>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-white dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100">
      <div className="mx-auto max-w-6xl px-6 py-8">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <h1 className="text-2xl font-bold">Randevular</h1>
          <div className="flex flex-wrap items-center gap-3">
            <ThemeToggle className="flex-shrink-0" />
            <button
              type="button"
              onClick={fetchAppointments}
              className="rounded-full border border-zinc-300 dark:border-zinc-700 px-4 py-2 text-sm hover:bg-zinc-50 dark:hover:bg-zinc-900 flex-shrink-0"
            >
              Yenile
            </button>
            <button
              type="button"
              onClick={deleteSelected}
              disabled={selected.size === 0 || loading}
              className="rounded-full bg-rose-600 text-white px-4 py-2 text-sm hover:bg-rose-700 disabled:opacity-50 flex-shrink-0"
            >
              Seçilenleri Sil
            </button>
            <a href="/">
              <button
                type="button"
                onClick={logout}
                className="rounded-full border border-zinc-300 dark:border-zinc-700 px-4 py-2 text-sm hover:bg-zinc-50 dark:hover:bg-zinc-900 flex-shrink-0"
              >
                Çıkış
              </button>
            </a> 
          </div>
        </div>

        {error && (
          <div className="mt-4 rounded-lg border border-red-200 text-red-800 bg-red-50 px-3 py-2 dark:border-red-900 dark:text-red-200 dark:bg-red-950/40">
            {error}
          </div>
        )}

        <div className="mt-6 overflow-x-auto rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900">
          <table className="min-w-full text-sm">
            <thead className="bg-zinc-50 dark:bg-zinc-900/50 text-zinc-700 dark:text-zinc-300">
              <tr>
                <th className="p-3 text-left w-10">
                  <input
                    type="checkbox"
                    aria-label="Tümünü seç"
                    checked={allChecked}
                    onChange={toggleSelectAll}
                  />
                </th>
                <th className="p-3 text-left">Ad Soyad</th>
                <th className="p-3 text-left">E‑posta</th>
                <th className="p-3 text-left">Telefon</th>
                <th className="p-3 text-left">Şikayet</th>
                <th className="p-3 text-left">Adres</th>
                <th className="p-3 text-left">İşlemler</th>
              </tr>
            </thead>
            <tbody>
              {appointments.length === 0 && (
                <tr>
          <td className="p-4 text-center text-zinc-500" colSpan={7}>
                    {loading ? "Yükleniyor..." : "Kayıt bulunamadı"}
                  </td>
                </tr>
              )}
              {appointments.map((a) => (
                <tr
                  key={a.id}
          onClick={() => setDetail(a)}
          className="border-t border-zinc-200 dark:border-zinc-800 hover:bg-zinc-50 dark:hover:bg-zinc-900 cursor-pointer"
                >
                  <td className="p-3 align-top">
                    <input
                      type="checkbox"
                      aria-label={`Seç: ${a.first_name} ${a.last_name}`}
            checked={selected.has(a.id)}
            onClick={(e) => e.stopPropagation()}
            onChange={() => toggleSelect(a.id)}
                    />
                  </td>
                  <td className="p-3 align-top">
                    <div className="font-medium">
                      {a.first_name} {a.last_name}
                    </div>
                    <div className="text-xs text-zinc-500">#{a.id}</div>
                  </td>
                  <td className="p-3 align-top">
                    <a
                      href={`mailto:${a.email}`}
                      className="hover:underline"
                      onClick={(e) => e.stopPropagation()}
                    >
                      {a.email}
                    </a>
                  </td>
                  <td className="p-3 align-top">
                    <a
                      href={`tel:${a.phone}`}
                      className="hover:underline"
                      onClick={(e) => e.stopPropagation()}
                    >
                      {a.phone}
                    </a>
                  </td>
                  <td
                    className="p-3 align-top max-w-[28ch] truncate"
                    title={a.complaint}
                  >
                    {a.complaint}
                  </td>
                  <td
                    className="p-3 align-top max-w-[28ch] truncate"
                    title={a.address}
                  >
                    {a.address}
                  </td>
                  <td className="p-3 align-top">
                    <div className="flex items-center gap-2">
                      <a
                        href={`tel:${a.phone}`}
                        className="inline-flex items-center rounded-full border border-zinc-300 dark:border-zinc-700 px-3 py-1.5 hover:bg-zinc-50 dark:hover:bg-zinc-900"
                        aria-label="Ara"
                        title="Ara"
                        onClick={(e) => e.stopPropagation()}
                      >
                        Ara
                      </a>
                      <a
                        href={`mailto:${a.email}`}
                        className="inline-flex items-center rounded-full border border-zinc-300 dark:border-zinc-700 px-3 py-1.5 hover:bg-zinc-50 dark:hover:bg-zinc-900"
                        aria-label="E‑posta Gönder"
                        title="E‑posta Gönder"
                        onClick={(e) => e.stopPropagation()}
                      >
                        E‑posta
                      </a>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {detail && (
          <div
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
            aria-hidden={false}
          >
            <div
              className="absolute inset-0 bg-black/50"
              onClick={() => setDetail(null)}
            />
            <div
              role="dialog"
              aria-modal="true"
              aria-labelledby="appointment-dialog-title"
              className="relative z-10 w-full max-w-lg max-h-[90vh] overflow-y-auto rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 shadow-xl"
            >
              <div className="p-4 sm:p-5 border-b border-zinc-200 dark:border-zinc-800 flex items-center justify-between">
                <h2 id="appointment-dialog-title" className="text-lg font-semibold">
                  Randevu Detayları
                </h2>
                <button
                  type="button"
                  onClick={() => setDetail(null)}
                  className="rounded-full border border-zinc-300 dark:border-zinc-700 px-3 py-1.5 text-sm hover:bg-zinc-50 dark:hover:bg-zinc-800 flex-shrink-0"
                >
                  Kapat
                </button>
              </div>
              <div className="p-4 sm:p-5 grid gap-3 text-sm">
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                  <div className="text-zinc-500 font-medium">Ad</div>
                  <div className="sm:col-span-2 font-medium">{detail.first_name}</div>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                  <div className="text-zinc-500 font-medium">Soyad</div>
                  <div className="sm:col-span-2 font-medium">{detail.last_name}</div>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                  <div className="text-zinc-500 font-medium">E‑posta</div>
                  <div className="sm:col-span-2">
                    <a href={`mailto:${detail.email}`} className="hover:underline break-all">
                      {detail.email}
                    </a>
                  </div>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                  <div className="text-zinc-500 font-medium">Telefon</div>
                  <div className="sm:col-span-2">
                    <a href={`tel:${detail.phone}`} className="hover:underline">
                      {detail.phone}
                    </a>
                  </div>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                  <div className="text-zinc-500 font-medium">Adres</div>
                  <div className="sm:col-span-2 break-words">{detail.address}</div>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                  <div className="text-zinc-500 font-medium">Şikayet</div>
                  <div className="sm:col-span-2 break-words whitespace-pre-wrap">{detail.complaint}</div>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                  <div className="text-zinc-500 font-medium">Oluşturulma</div>
                  <div className="sm:col-span-2">
                    {detail.created_at
                      ? new Date(detail.created_at).toLocaleString("tr-TR")
                      : "-"}
                  </div>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                  <div className="text-zinc-500 font-medium">ID</div>
                  <div className="sm:col-span-2 text-xs text-zinc-500 break-all">{detail.id}</div>
                </div>
              </div>
              <div className="p-4 sm:p-5 border-t border-zinc-200 dark:border-zinc-800 flex flex-col sm:flex-row items-stretch sm:items-center justify-end gap-2">
                <a
                  href={`tel:${detail.phone}`}
                  className="inline-flex items-center justify-center rounded-full border border-zinc-300 dark:border-zinc-700 px-4 py-2 text-sm hover:bg-zinc-50 dark:hover:bg-zinc-800"
                >
                  Ara
                </a>
                <a
                  href={`mailto:${detail.email}`}
                  className="inline-flex items-center justify-center rounded-full border border-zinc-300 dark:border-zinc-700 px-4 py-2 text-sm hover:bg-zinc-50 dark:hover:bg-zinc-800"
                >
                  E‑posta Gönder
                </a>
              </div>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
