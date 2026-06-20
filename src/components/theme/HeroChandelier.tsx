"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";

/**
 * Hero chandelier with smooth scroll-linked motion + a small on/off toggle.
 *
 *  • "lift"  — drifts up and fades as you scroll (a gentle parallax: it moves
 *              up slower than the page, so it lingers and "drifts" away rather
 *              than snapping off — takes most of a screen of scrolling).
 *  • "float" — even slower parallax; fades late.
 *  • "off"   — hangs still.
 *
 * No sway. rAF-throttled, transform/opacity only, so it stays buttery.
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

  function render() {
    const el = wrapRef.current;
    if (!el) return;
    const m = modeRef.current;
    if (m === "off") {
      el.style.transform = "translateX(-50%)";
      el.style.opacity = "1";
      return;
    }
    const vh = window.innerHeight || 800;
    const s = window.scrollY;
    if (m === "lift") {
      // rises straight UP and out of frame; ~one screen of scroll to clear
      const p = Math.min(1, s / (vh * 1.05));
      el.style.transform = `translate(-50%, ${(-p * 60).toFixed(2)}vh)`;
      el.style.opacity = (1 - Math.min(1, p * 1.2)).toFixed(3);
    } else {
      // float: lifts up more slowly, fades late
      const p = Math.min(1, s / (vh * 1.4));
      el.style.transform = `translate(-50%, ${(-p * 30).toFixed(2)}vh)`;
      el.style.opacity = (1 - Math.max(0, (p - 0.45) / 0.55)).toFixed(3);
    }
  }

  // Load saved preference.
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

  // Persist + re-apply on mode change.
  useEffect(() => {
    modeRef.current = mode;
    try {
      localStorage.setItem(STORAGE_KEY, mode);
    } catch {
      /* ignore */
    }
    render();
  }, [mode]);

  // rAF-throttled scroll / resize.
  useEffect(() => {
    let ticking = false;
    const onScroll = () => {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(() => {
        render();
        ticking = false;
      });
    };
    render();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", render);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", render);
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
        <div className="relative aspect-[560/780] w-[clamp(160px,18vw,250px)] drop-shadow-[0_24px_30px_rgba(28,25,24,0.16)]">
          <Image
            src="/theme/cut/chandelier.png"
            alt=""
            fill
            priority
            sizes="(max-width:768px) 48vw, 350px"
            className="object-contain"
          />
        </div>
      </div>

      {/* Mode toggle — portaled to <body> so it floats above every section. */}
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
