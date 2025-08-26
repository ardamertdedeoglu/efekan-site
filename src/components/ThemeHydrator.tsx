"use client";

import { useEffect } from "react";

export default function ThemeHydrator() {
  useEffect(() => {
    try {
      const stored = localStorage.getItem("theme");
      const prefersDark = window.matchMedia &&
        window.matchMedia("(prefers-color-scheme: dark)").matches;
      const dark = stored ? stored === "dark" : prefersDark;
      const c = document.documentElement.classList;
      if (dark) c.add("dark");
      else c.remove("dark");
    } catch {}
  }, []);
  return null;
}
