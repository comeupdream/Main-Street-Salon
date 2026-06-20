"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";

/**
 * Station clock with live hands. Pinned to the left of the viewport (fixed) so
 * it stays put through the hero downscroll, grows a touch as you scroll, then
 * fades out before it would cover the menu. Live hands track the real time.
 */
const CX = 335;
const CY = 397;
const R = 148;

export function ClockLive({ className = "" }: { className?: string }) {
  const [now, setNow] = useState<Date | null>(null);
  const ref = useRef<HTMLDivElement>(null);

  // Live time — re-render hands every second.
  useEffect(() => {
    setNow(new Date());
    const id = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(id);
  }, []);

  // Scroll-linked grow + fade (rAF-throttled).
  useEffect(() => {
    let ticking = false;
    const render = () => {
      const el = ref.current;
      if (!el) return;
      const vh = window.innerHeight || 800;
      const s = window.scrollY;
      const grow = Math.min(1, s / (vh * 1.3));
      el.style.transform = `scale(${(1 + grow * 0.18).toFixed(4)})`;
    };
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

  let hands = null;
  if (now) {
    const h = now.getHours() % 12;
    const m = now.getMinutes();
    const s = now.getSeconds();
    const hourA = ((h + m / 60) / 12) * 2 * Math.PI;
    const minA = ((m + s / 60) / 60) * 2 * Math.PI;
    const secA = (s / 60) * 2 * Math.PI;
    const tip = (a: number, len: number): [number, number] => [
      CX + len * Math.sin(a),
      CY - len * Math.cos(a),
    ];
    const tail = (a: number, len: number): [number, number] => [
      CX - len * Math.sin(a),
      CY + len * Math.cos(a),
    ];
    const [hx, hy] = tip(hourA, R * 0.52);
    const [mx, my] = tip(minA, R * 0.78);
    const [sx, sy] = tip(secA, R * 0.86);
    const [stx, sty] = tail(secA, R * 0.18);
    hands = (
      <>
        <line x1={CX} y1={CY} x2={hx} y2={hy} stroke="#1b1b1b" strokeWidth={7.5} strokeLinecap="round" />
        <line x1={CX} y1={CY} x2={mx} y2={my} stroke="#1b1b1b" strokeWidth={5} strokeLinecap="round" />
        <line x1={stx} y1={sty} x2={sx} y2={sy} stroke="#9e3a58" strokeWidth={2} strokeLinecap="round" />
        <circle cx={CX} cy={CY} r={6.5} fill="#1b1b1b" />
        <circle cx={CX} cy={CY} r={2.5} fill="#9e3a58" />
      </>
    );
  }

  return (
    <div aria-hidden className={`pointer-events-none fixed left-0 top-[44%] z-40 ${className}`}>
      <div ref={ref} className="origin-top-left will-change-transform">
        <div className="relative aspect-[520/578] w-[clamp(150px,16vw,225px)] drop-shadow-[0_16px_24px_rgba(28,25,24,0.22)]">
          <Image
            src="/theme/cut/clock-nohands.png"
            alt=""
            fill
            priority
            sizes="(max-width:768px) 32vw, 225px"
            className="object-contain"
          />
          <svg viewBox="0 0 520 578" className="absolute inset-0 h-full w-full">
            {hands}
          </svg>
        </div>
      </div>
    </div>
  );
}
