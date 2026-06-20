"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";

/**
 * The hero chandelier with scroll-linked motion + a small on/off toggle.
 *
 *  • "lift"  — as you scroll down it rises straight up and fades, like it's
 *              hoisted back to the ceiling, out of the way.
 *  • "float" — gentler parallax: drifts up slower than the page and fades late.
 *  • "off"   — hangs still (no scroll motion, no sway).
 *
 * Motion is procedural: driven continuously by scroll position, updated in a
 * rAF-throttled scroll handler for smoothness. Choice persists in localStorage.
 */

type Mode = "lift" | "float" | "off";
const ORDER: Mode[] = ["lift", "float", "off"];
const LABEL: Record<Mode, string> = { lift: "Lift up", float: "Float", off: "Off" };
const STORAGE_KEY = "salon-chandelier-mode";

export default function HeroChandelier() {
  const [mode, setMode] = useState<Mode>("lift");
  const [mounted, setMounted] = useState(false);
  const wrapRef = useRef<HTMLDivElement>(null);
  const modeRef = useRef<Mode>("lift");

  function apply() {
    const el = wrapRef.current;
    if (!el) return;
    const vh = window.innerHeight || 800;
    const p = Math.min(1, Math.max(0, window.scrollY / (vh * 0.8)));
    const m = modeRef.current;
    if (m === "off") {
      el.style.transform = "translateX(-50%)";
      el.style.opacity = "1";
    } else if (m === "lift") {
      el.style.transform = `translate(-50%, ${(-p * 58).toFixed(2)}vh)`;
      el.style.opacity = (1 - Math.min(1, p * 1.3)).toFixed(3);
    } else {
      el.style.transform = `translate(-50%, ${(-p * 26).toFixed(2)}vh)`;
      el.style.opacity = (1 - Math.max(0, (p - 0.5) / 0.5)).toFixed(3);
    }
  }

  // Load saved preference once on mount.
  useEffect(() => {
    setMounted(true);
    try {
      const saved = localStorage.getItem(STORAGE_KEY) as Mode | null;
      if (saved && ORDER.includes(saved)) {
        modeRef.current = saved;
        setMode(saved);
      }
    } catch {
      /* ignore */
    }
  }, []);

  // Persist + re-apply whenever the mode changes.
  useEffect(() => {
    modeRef.current = mode;
    try {
      localStorage.setItem(STORAGE_KEY, mode);
    } catch {
      /* ignore */
    }
    apply();
  }, [mode]);

  // Scroll / resize listeners (rAF-throttled).
  useEffect(() => {
    let ticking = false;
    const onScroll = () => {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(() => {
        apply();
        ticking = false;
      });
    };
    apply();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, []);

  return (
    <>
      <div
        ref={wrapRef}
        aria-hidden
        className="pointer-events-none absolute left-1/2 top-0 z-20 will-change-transform"
        style={{ transform: "translateX(-50%)" }}
      >
        <div className={`origin-top ${mode === "off" ? "" : "animate-sway"}`}>
          <div className="relative aspect-[560/780] w-[clamp(115px,14vw,195px)] drop-shadow-[0_22px_28px_rgba(28,25,24,0.14)]">
            <Image
              src="/theme/cut/chandelier.png"
              alt=""
              fill
              priority
              sizes="(max-width:768px) 40vw, 200px"
              className="object-contain"
            />
          </div>
        </div>
      </div>

      {/* Small, unobtrusive mode toggle — portaled to <body> so it floats
          above every section (the hero's `isolate` would otherwise trap it). */}
      {mounted &&
        createPortal(
          <button
            type="button"
            onClick={() => setMode((m) => ORDER[(ORDER.indexOf(m) + 1) % ORDER.length])}
            aria-label={`Chandelier animation: ${LABEL[mode]}. Click to change.`}
            className="fixed bottom-4 right-4 z-[60] inline-flex items-center gap-2 rounded-full border border-line bg-surface/90 px-3.5 py-2 text-xs font-medium text-muted shadow-md backdrop-blur transition-colors hover:border-accent/50 hover:text-ink"
          >
            <span aria-hidden className={mode === "off" ? "text-muted/40" : "text-accent"}>
              ✦
            </span>
            <span>
              Chandelier: <span className="text-ink">{LABEL[mode]}</span>
            </span>
          </button>,
          document.body,
        )}
    </>
  );
}
