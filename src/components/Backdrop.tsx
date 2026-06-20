/**
 * Backdrop — the procedural/animated background behind the hero.
 *
 * ┌─────────────────────────────────────────────────────────────────────────┐
 * │ SWAP ME: This is a CSS-only placeholder so the site looks alive out of   │
 * │ the box. To drop in your own art (e.g. a Higgsfield render), replace the │
 * │ contents below with an <Image> or autoplaying muted <video>, e.g.:        │
 * │                                                                          │
 * │   <video autoPlay muted loop playsInline                                 │
 * │     className="absolute inset-0 h-full w-full object-cover">             │
 * │     <source src="/backdrops/hero.mp4" type="video/mp4" />                │
 * │   </video>                                                               │
 * │                                                                          │
 * │ Keep the trailing scrim <div> for text legibility.                       │
 * └─────────────────────────────────────────────────────────────────────────┘
 */
export default function Backdrop({ className = "" }: { className?: string }) {
  return (
    <div
      aria-hidden
      className={`pointer-events-none absolute inset-0 -z-10 overflow-hidden grain ${className}`}
    >
      {/* Drifting color fields — the "procedural" layer. */}
      <div className="absolute -left-1/4 -top-1/3 h-[70vh] w-[70vh] rounded-full bg-[radial-gradient(circle,_rgba(166,75,58,0.28),_transparent_60%)] blur-2xl animate-drift" />
      <div className="absolute right-[-15%] top-[5%] h-[55vh] w-[55vh] rounded-full bg-[radial-gradient(circle,_rgba(196,150,108,0.30),_transparent_62%)] blur-2xl animate-drift [animation-delay:-6s]" />
      <div className="absolute bottom-[-25%] left-1/3 h-[60vh] w-[60vh] rounded-full bg-[radial-gradient(circle,_rgba(125,53,40,0.22),_transparent_60%)] blur-2xl animate-drift [animation-delay:-11s]" />

      {/* Soft scrim so foreground text stays readable. */}
      <div className="absolute inset-0 bg-gradient-to-b from-bg/40 via-bg/55 to-bg" />
    </div>
  );
}
