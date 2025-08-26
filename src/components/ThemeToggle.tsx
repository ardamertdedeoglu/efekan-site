"use client";

import { useEffect, useState } from "react";

function setHtmlDark(on: boolean) {
  const root = document.documentElement;
  if (on) root.classList.add("dark");
  else root.classList.remove("dark");
}

export default function ThemeToggle({
  className = "",
}: {
  className?: string;
}) {
  const [mounted, setMounted] = useState(false);
  const [dark, setDark] = useState(false);

  useEffect(() => {
    setMounted(true);
    // Check stored theme or system preference after mount to avoid hydration mismatch
    try {
      const stored = localStorage.getItem("theme");
      const prefersDark = window.matchMedia &&
        window.matchMedia("(prefers-color-scheme: dark)").matches;
      const shouldBeDark = stored ? stored === "dark" : prefersDark;
      setDark(shouldBeDark);
      setHtmlDark(shouldBeDark);
    } catch {}
  }, []);

  function toggle() {
    const next = !dark;
    setDark(next);
    try {
      localStorage.setItem("theme", next ? "dark" : "light");
    } catch {}
    setHtmlDark(next);
  }

  // Prevent hydration mismatch by not rendering until mounted
  if (!mounted) {
    return (
      <div className={"inline-flex items-center gap-2 rounded-full border border-zinc-300 dark:border-zinc-700 px-3 py-1.5 text-sm transition-colors " + className}>
        <span className="w-4 h-4" />
        <span>Tema</span>
      </div>
    );
  }

  return (
    <button
      type="button"
      onClick={toggle}
      className={
        "inline-flex items-center gap-2 rounded-full border border-zinc-300 dark:border-zinc-700 px-3 py-1.5 text-sm hover:bg-zinc-50 dark:hover:bg-zinc-900 transition-colors " +
        className
      }
      aria-label="Tema değiştir"
      title="Tema değiştir"
    >
      <span className="relative inline-grid place-items-center w-4 h-4">
        {/* Sun/Moon icon */}
        {dark ? (
          <svg viewBox="0 0 24 24" className="w-4 h-4" aria-hidden>
            <path
              fill="currentColor"
              d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"
            />
          </svg>
        ) : (
          <img src="sunny-svgrepo-com.svg" alt="sunny" />
        )}
      </span>
      <span>{dark ? "Koyu" : "Açık"}</span>
    </button>
  );
}
