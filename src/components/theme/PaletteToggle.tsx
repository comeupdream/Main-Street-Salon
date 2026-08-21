"use client";

import { useEffect, useState } from "react";

const KEY = "salon-palette";

/**
 * Two-swatch palette switcher: blush/rose (default) ↔ "ice" (light blue +
 * black). Sets `data-palette="ice"` on <html>; persisted in localStorage and
 * re-applied before paint by the inline script in the root layout.
 */
export default function PaletteToggle() {
  const [ice, setIce] = useState(false);

  // Read the persisted choice after mount (SSR renders the default state).
  useEffect(() => {
    try {
      setIce(localStorage.getItem(KEY) === "ice");
    } catch {
      /* storage unavailable — stay on default */
    }
  }, []);

  function apply(next: boolean) {
    setIce(next);
    const root = document.documentElement;
    if (next) root.dataset.palette = "ice";
    else delete root.dataset.palette;
    try {
      localStorage.setItem(KEY, next ? "ice" : "blush");
    } catch {
      /* fine — just won't persist */
    }
  }

  return (
    <button
      onClick={() => apply(!ice)}
      aria-label={ice ? "Switch to the blush palette" : "Switch to the ice palette"}
      title={ice ? "Blush palette" : "Ice palette"}
      className="flex items-center gap-1.5 rounded-full border border-line bg-surface/70 px-2 py-1.5 transition-colors hover:border-accent/40"
    >
      <span
        className={`h-3.5 w-3.5 rounded-full bg-[#C95678] transition-all ${
          ice ? "opacity-35" : "ring-2 ring-[#C95678]/35 ring-offset-1"
        }`}
      />
      <span
        className={`h-3.5 w-3.5 rounded-full border border-[#8FB6D9]/60 bg-[#BDDAF0] transition-all ${
          ice ? "ring-2 ring-[#171B26]/30 ring-offset-1" : "opacity-35"
        }`}
      />
    </button>
  );
}
