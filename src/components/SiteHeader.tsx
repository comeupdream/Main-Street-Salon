import Link from "next/link";
import { SALON } from "@/lib/salon-config";

/**
 * Public site header. `transparent` lets it float over the hero on the home
 * page; on other pages it sits on a solid bar.
 */
export default function SiteHeader({
  transparent = false,
}: {
  transparent?: boolean;
}) {
  return (
    <header
      className={
        transparent
          ? "absolute inset-x-0 top-0 z-30"
          : "sticky top-0 z-30 border-b border-line bg-bg/85 backdrop-blur"
      }
    >
      <div className="container-page flex h-20 items-center justify-between">
        <Link href="/" className="group flex flex-col leading-none">
          <span className="font-serif text-xl tracking-tight">{SALON.name}</span>
          <span className="mt-0.5 text-[11px] uppercase tracking-[0.28em] text-muted">
            Hair Studio
          </span>
        </Link>

        <nav className="hidden items-center gap-8 text-sm text-ink/80 md:flex">
          <Link href="/#services" className="transition-colors hover:text-accent">
            Services
          </Link>
          <Link href="/portfolio" className="transition-colors hover:text-accent">
            Portfolio
          </Link>
          <Link href="/#visit" className="transition-colors hover:text-accent">
            Visit
          </Link>
          <a
            href={`tel:${SALON.phone.replace(/[^\d+]/g, "")}`}
            className="transition-colors hover:text-accent"
          >
            {SALON.phone}
          </a>
        </nav>

        <Link href="/book" className="btn-accent !px-5 !py-2.5">
          Book now
        </Link>
      </div>
    </header>
  );
}
