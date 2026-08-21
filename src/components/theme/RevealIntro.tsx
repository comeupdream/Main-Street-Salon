"use client";

import { useEffect, useState } from "react";

/**
 * A theatrical 3-stage intro that plays over the landing page:
 *   1. A gloriously awful "before" site (the actual store wall + raw photos).
 *   2. Clicking BOOK NOW fizzles it away to reveal a mid-fi draft
 *      (real wall photo + cropped photos in place).
 *   3. Clicking "hello gorgeous" blooms the draft away to reveal the real site.
 *
 * Purely a reveal gag — it sits on top of the real homepage and removes itself.
 */
export default function RevealIntro() {
  const [crappyGone, setCrappyGone] = useState(false);
  const [draftGone, setDraftGone] = useState(false);
  const [unmounted, setUnmounted] = useState(false);

  // Lock scrolling while the intro is on screen.
  useEffect(() => {
    if (unmounted) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [unmounted]);

  if (unmounted) return null;

  function revealFinal() {
    setDraftGone(true);
    window.setTimeout(() => setUnmounted(true), 1100);
  }

  return (
    <div className="fixed inset-0 z-[100]">
      <style>{`
        @keyframes introScroll{from{transform:translateX(100%)}to{transform:translateX(-100%)}}
        @keyframes introBlink{0%,49%{opacity:1}50%,100%{opacity:.15}}
        @keyframes introPulse{0%,100%{transform:scale(1)}50%{transform:scale(1.06)}}
        .intro-comic{font-family:"Comic Sans MS","Comic Sans","Chalkboard SE",cursive}
      `}</style>

      {/* skip */}
      {!draftGone && (
        <button
          onClick={() => setUnmounted(true)}
          className="fixed right-4 top-4 z-[130] rounded-full bg-black/40 px-3 py-1.5 text-xs text-white/90 backdrop-blur hover:bg-black/60"
        >
          skip intro →
        </button>
      )}

      {/* ---------------------------------------------- STAGE 2: the draft ---- */}
      <div
        className={`absolute inset-0 z-[110] overflow-hidden bg-cover bg-center transition-all duration-[900ms] ${
          draftGone ? "scale-105 opacity-0 blur-sm" : "opacity-100"
        }`}
        style={{ backgroundImage: "url('/intro/wall.jpg')" }}
      >
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_60%_55%_at_50%_46%,_rgba(250,245,241,0.92),_rgba(250,245,241,0.55)_55%,_rgba(250,245,241,0.15))]" />

        {/* decor */}
        <img src="/intro/og-chandelier.png" alt="" className="pointer-events-none absolute left-1/2 top-0 w-[200px] -translate-x-1/2 drop-shadow-[0_18px_24px_rgba(28,25,24,0.18)]" />
        <img src="/intro/og-clock.png" alt="" className="pointer-events-none absolute left-2 top-2 w-[190px] drop-shadow-[0_12px_18px_rgba(28,25,24,0.18)]" />
        <img src="/intro/og-rose-br.png" alt="" className="pointer-events-none absolute bottom-8 right-14 w-[180px]" />
        <img src="/intro/og-rose-tl.png" alt="" className="pointer-events-none absolute left-8 top-1/2 w-[115px]" />
        <img src="/intro/og-rose-tl.png" alt="" className="pointer-events-none absolute bottom-12 left-16 w-[90px]" />

        <div className="relative z-10 flex h-full flex-col items-center justify-center px-6 text-center">
          <button
            onClick={revealFinal}
            className="group relative cursor-pointer font-script text-5xl text-accent transition-transform hover:scale-105"
            style={{ animation: "introPulse 2.4s ease-in-out infinite" }}
            aria-label="Reveal the real site"
          >
            hello gorgeous
            <span className="absolute -right-6 -top-2 text-xl">✨</span>
          </button>
          <h1 className="mt-1 font-serif text-7xl font-semibold text-ink sm:text-8xl">
            Infinite Parallel Salon
          </h1>
          <p className="mt-5 max-w-md text-lg text-muted">
            Modern cuts, lived-in color, and a chair that feels like home.
          </p>
          <p className="mt-8 animate-pulse text-sm font-medium uppercase tracking-[0.2em] text-accent">
            ↑ psst — click “hello gorgeous”
          </p>
        </div>
      </div>

      {/* ------------------------------------------- STAGE 1: the crappy site -- */}
      <div
        className={`intro-comic absolute inset-0 z-[120] overflow-y-auto text-center transition-all duration-[800ms] ${
          crappyGone ? "pointer-events-none scale-110 opacity-0 blur-lg" : "opacity-100"
        }`}
        style={{ backgroundImage: "url('/intro/wall.jpg')", backgroundRepeat: "repeat" }}
      >
        {/* marquee */}
        <div className="overflow-hidden border-y-4 border-dashed border-fuchsia-500 bg-[#39ff14] py-1.5">
          <div
            className="whitespace-nowrap text-xl font-bold text-red-600"
            style={{ animation: "introScroll 14s linear infinite" }}
          >
            ✨✨✨ GRAND RE-OPENING !!! ~ WALK INS WELLCOME ~ WE DO HAIRS AND COLOR ~
            CALL TODAY ~ BEST PRICE IN TOWN ✨✨✨
          </div>
        </div>

        <div
          className="mt-3 text-6xl font-bold"
          style={{
            color: "#ff1493",
            textShadow: "3px 3px 0 #00f, 6px 6px 0 #0ff, -2px -2px 0 #000, 2px 2px 0 #000",
            WebkitTextStroke: "2px #000",
          }}
        >
          Infinite Parallel Salon
        </div>
        <div className="mt-1 text-2xl" style={{ color: "#7a00cc", textShadow: "1px 1px 0 #fff" }}>
          ~*~ WELCOME 2 OUR WEBSITE !!! ~*~ 💇‍♀️✂️💖
        </div>
        <div className="text-xl font-bold text-red-600" style={{ animation: "introBlink 1s step-end infinite" }}>
          ★ UNDER CONSTRUCTION 🚧 plz come back soon ★
        </div>

        {/* slapped-on raw photos */}
        <div className="mt-2 flex flex-wrap items-start justify-center gap-3">
          <div className="-rotate-6">
            <img src="/intro/clock.jpg" className="mx-auto w-[170px] border-[7px] border-double border-gray-300 bg-white p-1" />
          </div>
          <div>
            <img src="/intro/chand2.jpg" className="mx-auto w-[160px] border-[7px] border-double border-gray-300 bg-white p-1" />
          </div>
          <div className="rotate-[5deg]">
            <img src="/intro/chand1.jpg" className="mx-auto w-[150px] border-[7px] border-double border-gray-300 bg-white p-1" />
          </div>
        </div>

        <div className="mx-auto mt-3 inline-block rounded border-[5px] border-fuchsia-500 bg-yellow-100/90 px-5 py-2 text-xl" style={{ color: "#cc0066" }}>
          ⭐⭐⭐⭐⭐ your neighborhood hair salon ⭐⭐⭐⭐⭐
        </div>

        {/* the trigger */}
        <div className="my-4">
          <button
            onClick={() => setCrappyGone(true)}
            className="intro-comic cursor-pointer rounded-md border-4 px-8 py-3 text-4xl font-bold"
            style={{
              color: "#ff0000",
              background: "linear-gradient(#ffff00,#ffcc00)",
              borderColor: "#ffae00",
              borderStyle: "outset",
              textShadow: "1px 1px 0 #fff",
            }}
          >
            ⇒⇒ BOOK NOW !!!! ⇐⇐
          </button>
          <div className="mt-1 text-lg" style={{ color: "#7a00cc" }}>
            or call 📞 (555) 314-1592 ask 4 the front desk
          </div>
        </div>

        <div className="pb-6">
          <span className="border-2 border-inset border-gray-500 bg-black px-2 py-0.5 font-mono text-green-400">
            You are visitor # 00000437
          </span>
          <div className="mt-2 text-sm text-blue-700 underline">
            Sign our guestbook! | Email the webmaster | Best viewed in IE6 at 800×600
          </div>
        </div>
      </div>
    </div>
  );
}
