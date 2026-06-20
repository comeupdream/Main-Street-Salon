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
      className={`pointer-events-none absolute left-0 top-0 z-20 animate-slide-in-left ${className}`}
    >
      <div className="relative aspect-[832/870] w-[clamp(120px,15vw,210px)] drop-shadow-[0_12px_18px_rgba(28,25,24,0.16)]">
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
  variant?: "br" | "tl";
  className?: string;
  width?: string;
};

export function Rose({ variant = "br", className = "", width }: RoseProps) {
  const src = variant === "br" ? "/theme/cut/rose-br.png" : "/theme/cut/rose-tl.png";
  const ratio = variant === "br" ? "220/241" : "151/168";
  return (
    <div aria-hidden className={`pointer-events-none absolute z-10 ${className}`}>
      <div
        className="relative drop-shadow-[0_10px_16px_rgba(158,58,88,0.18)]"
        style={{ aspectRatio: ratio, width: width ?? "clamp(90px,12vw,170px)" }}
      >
        <Image src={src} alt="" fill sizes="(max-width:768px) 28vw, 170px" className="object-contain" />
      </div>
    </div>
  );
}
