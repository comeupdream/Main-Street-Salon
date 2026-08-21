import Image from "next/image";

/**
 * Decorative theme pieces, cut out from the salon's real photos:
 *   • Chandelier — hangs from the top of the page (gentle sway).
 *   • Clock      — the antique station clock, mounted in the top-left corner.
 *   • Rose       — pink peonies used as accents.
 *
 * All are purely decorative (aria-hidden, pointer-events-none). Swap the PNGs
 * in /public/theme/cut to restyle — keep the aspect-ratio classes in sync.
 */

export function Chandelier({ className = "" }: { className?: string }) {
  return (
    <div
      aria-hidden
      className={`pointer-events-none absolute left-1/2 top-0 z-20 -translate-x-1/2 origin-top animate-sway ${className}`}
    >
      <div className="relative aspect-[560/780] w-[clamp(115px,14vw,195px)] drop-shadow-[0_22px_28px_rgba(28,25,24,0.14)]">
        <Image
          src="/theme/cut/chandelier.png"
          alt=""
          fill
          priority
          sizes="(max-width:768px) 40vw, 280px"
          className="object-contain"
        />
      </div>
    </div>
  );
}

export function Clock({ className = "" }: { className?: string }) {
  return (
    <div
      aria-hidden
      className={`pointer-events-none absolute left-0 top-[280px] z-20 animate-slide-in-left ${className}`}
    >
      <div className="relative aspect-[520/578] w-[clamp(124px,15vw,212px)] drop-shadow-[0_14px_20px_rgba(28,25,24,0.18)]">
        <Image
          src="/theme/cut/clock-bracket.png"
          alt=""
          fill
          priority
          sizes="(max-width:768px) 30vw, 210px"
          className="object-contain"
        />
      </div>
    </div>
  );
}

type RoseProps = {
  className?: string;
  width?: string;
  /** rotation in degrees, for natural variety */
  rotate?: number;
  /** mirror horizontally, so scattered copies don't look identical */
  flip?: boolean;
  /** z-index of the rose (default sits behind text at 10) */
  z?: number;
};

// Every rose uses the new, cleaner, more symmetrical peony.
export function Rose({ className = "", width, rotate = 0, flip = false, z = 10 }: RoseProps) {
  return (
    <div aria-hidden className={`pointer-events-none absolute ${className}`} style={{ zIndex: z }}>
      <div
        className="salon-rose relative drop-shadow-[0_12px_18px_rgba(158,58,88,0.20)]"
        style={{
          aspectRatio: "340/340",
          width: width ?? "clamp(90px,12vw,170px)",
          transform: `${flip ? "scaleX(-1) " : ""}rotate(${rotate}deg)`,
        }}
      >
        <Image src="/theme/cut/rose-2.png" alt="" fill sizes="(max-width:768px) 28vw, 170px" className="object-contain" />
      </div>
    </div>
  );
}
