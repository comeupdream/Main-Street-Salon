import type { Metadata } from "next";
import Link from "next/link";
import SiteFooter from "@/components/SiteFooter";
import SiteHeader from "@/components/SiteHeader";
import { Rose } from "@/components/theme/SalonDecor";
import { prisma } from "@/lib/prisma";
import { SALON } from "@/lib/salon-config";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Portfolio",
  description: `Recent work from ${SALON.name} — cuts, color, and styling on real clients.`,
  openGraph: {
    title: `Portfolio · ${SALON.name}`,
    description: `Recent work from ${SALON.name} — cuts, color, and styling on real clients.`,
  },
};

export default async function PortfolioPage() {
  const images = await prisma.portfolioImage.findMany({
    where: { published: true },
    orderBy: [{ sortOrder: "asc" }, { createdAt: "desc" }],
    select: { id: true, caption: true, alt: true, width: true, height: true },
  });

  return (
    <>
      <SiteHeader />

      {/* Heading band */}
      <section className="relative overflow-hidden border-b border-line stripes-soft">
        <Rose
          className="-right-6 top-6 hidden sm:block"
          width="clamp(70px,8vw,128px)"
          rotate={14}
          flip
        />
        <Rose
          className="-left-8 -bottom-10 hidden lg:block"
          width="clamp(70px,8vw,120px)"
          rotate={-14}
        />
        <div className="container-page relative z-20 py-16 text-center sm:py-20">
          <p className="script text-3xl text-accent">our work</p>
          <h1 className="mt-1 font-serif text-5xl sm:text-6xl">Portfolio</h1>
          <p className="mx-auto mt-4 max-w-xl text-muted">
            A look at recent cuts, color, and styling from the chair. Like
            something you see? Bring it in as inspiration.
          </p>
          <Link href="/book" className="btn-accent mt-8 !px-8 !py-3.5">
            Book your appointment
          </Link>
        </div>
      </section>

      {/* Gallery */}
      <section className="bg-bg">
        <div className="container-page py-14 sm:py-20">
          {images.length === 0 ? (
            <div className="mx-auto max-w-md rounded-xl2 border border-dashed border-line bg-surface/60 px-6 py-20 text-center">
              <p className="font-serif text-2xl">Coming soon</p>
              <p className="mt-2 text-sm text-muted">
                Fresh looks are on the way. In the meantime, follow along on
                Instagram at {SALON.instagram}.
              </p>
            </div>
          ) : (
            <div className="gap-4 [column-fill:_balance] columns-2 [&>*]:mb-4 sm:columns-3 lg:columns-4">
              {images.map((img) => (
                <figure
                  key={img.id}
                  className="group break-inside-avoid overflow-hidden rounded-xl2 border border-line bg-surface shadow-[0_1px_2px_rgba(28,25,24,0.04)]"
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={`/api/portfolio/${img.id}`}
                    alt={img.alt || img.caption || `Hair by ${SALON.name}`}
                    loading="lazy"
                    className="w-full"
                    style={{
                      aspectRatio:
                        img.width && img.height ? `${img.width} / ${img.height}` : undefined,
                    }}
                  />
                  {img.caption && (
                    <figcaption className="px-3.5 py-2.5 text-sm text-muted">
                      {img.caption}
                    </figcaption>
                  )}
                </figure>
              ))}
            </div>
          )}
        </div>
      </section>

      <SiteFooter />
    </>
  );
}
