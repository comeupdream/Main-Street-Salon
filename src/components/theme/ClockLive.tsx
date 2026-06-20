"use client";

import Image from "next/image";
import { useEffect, useState } from "react";

/**
 * The station clock with procedural hands that show the real, current time.
 * The cut-out (clock-nohands.png) keeps the original face, numerals and text —
 * only the painted hands were removed; we draw live ones over the face.
 *
 * Face geometry below is in the cut-out's intrinsic 520×578 coordinate space,
 * which the SVG viewBox shares, so the hands sit exactly on the pivot.
 */
const CX = 335;
const CY = 397;
const R = 148;

export function ClockLive({ className = "" }: { className?: string }) {
  const [now, setNow] = useState<Date | null>(null);

  useEffect(() => {
    setNow(new Date());
    const id = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(id);
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
    <div
      aria-hidden
      className={`pointer-events-none absolute left-0 top-[280px] z-20 animate-slide-in-left ${className}`}
    >
      <div className="relative aspect-[520/578] w-[clamp(124px,15vw,212px)] drop-shadow-[0_14px_20px_rgba(28,25,24,0.18)]">
        <Image
          src="/theme/cut/clock-nohands.png"
          alt=""
          fill
          priority
          sizes="(max-width:768px) 30vw, 210px"
          className="object-contain"
        />
        <svg viewBox="0 0 520 578" className="absolute inset-0 h-full w-full">
          {hands}
        </svg>
      </div>
    </div>
  );
}
