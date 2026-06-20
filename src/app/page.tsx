import Link from "next/link";
import SiteFooter from "@/components/SiteFooter";
import SiteHeader from "@/components/SiteHeader";
import { Chandelier, Clock, Rose } from "@/components/theme/SalonDecor";
import { formatDuration, formatPrice } from "@/lib/format";
import { prisma } from "@/lib/prisma";
import { SALON, hoursForDisplay } from "@/lib/salon-config";

export const dynamic = "force-dynamic";

type ServiceCard = {
  id: string;
  name: string;
  description: string;
  durationMinutes: number;
  priceCents: number;
  category: string;
};

async function getServicesByCategory(): Promise<[string, ServiceCard[]][]> {
  const services = await prisma.service.findMany({
    where: { active: true },
    orderBy: [{ sortOrder: "asc" }, { name: "asc" }],
  });
  const groups = new Map<string, ServiceCard[]>();
  for (const s of services) {
    if (!groups.has(s.category)) groups.set(s.category, []);
    groups.get(s.category)!.push({
      id: s.id,
      name: s.name,
      description: s.description,
      durationMinutes: s.durationMinutes,
      priceCents: s.priceCents,
      category: s.category,
    });
  }
  return Array.from(groups.entries());
}

export default async function HomePage() {
  const categories = await getServicesByCategory();
  const hours = hoursForDisplay();

  return (
    <>
      <SiteHeader />

      {/* ---------------------------------------------------------------- Hero */}
      <section className="relative isolate overflow-hidden stripes">
        {/* soft cream wash keeps the headline legible over the stripes */}
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_60%_55%_at_50%_45%,_rgba(251,246,242,0.92),_rgba(251,246,242,0.55)_55%,_transparent)]" />

        <Chandelier />
        <Clock className="hidden sm:block" />
        <Rose
          variant="deep"
          className="bottom-[3%] right-[1%] sm:right-[5%]"
          width="clamp(112px,15vw,205px)"
          rotate={-6}
        />
        <Rose
          variant="blush"
          className="left-[2%] top-[44%] hidden md:block"
          width="clamp(78px,9vw,150px)"
          rotate={9}
        />
        <Rose
          variant="blush"
          className="bottom-[7%] left-[6%] hidden lg:block"
          width="clamp(64px,6vw,98px)"
          rotate={-16}
        />

        <div className="container-page relative z-30 flex min-h-[90vh] flex-col items-center pb-24 pt-48 text-center sm:pt-[290px]">
          <p className="script text-4xl text-accent animate-fade-up sm:text-5xl">
            hello beautiful
          </p>
          <h1 className="mt-2 text-balance font-serif text-6xl font-medium leading-[1.02] animate-fade-up [animation-delay:80ms] sm:text-7xl lg:text-8xl">
            {SALON.name}
          </h1>
          <p className="mt-6 max-w-xl text-balance text-lg leading-relaxed text-muted animate-fade-up [animation-delay:140ms]">
            {SALON.tagline}
          </p>
          <div className="mt-9 flex flex-wrap items-center justify-center gap-3 animate-fade-up [animation-delay:200ms]">
            <Link href="/book" className="btn-accent !px-8 !py-3.5 text-base">
              Book an appointment
            </Link>
            <Link href="#services" className="btn-ghost !px-8 !py-3.5 text-base">
              Services &amp; pricing
            </Link>
          </div>
          <p className="mt-10 text-sm text-muted animate-fade-up [animation-delay:260ms]">
            {SALON.address} · {SALON.cityLine.split(",")[0]} &nbsp;•&nbsp; Tue–Sat by
            appointment
          </p>
        </div>
      </section>

      {/* ------------------------------------------------------------ Services */}
      <section id="services" className="relative overflow-hidden border-t border-line bg-bg">
        <Rose
          variant="blush"
          className="-right-6 top-12 sm:right-4"
          width="clamp(64px,8vw,118px)"
          rotate={14}
        />
        <Rose
          variant="deep"
          className="-left-8 bottom-24 hidden sm:block"
          width="clamp(70px,9vw,128px)"
          rotate={-12}
        />
        <div className="container-page relative z-20 py-20 sm:py-28">
          <div className="mx-auto max-w-2xl text-center">
            <p className="script text-3xl text-accent">the menu</p>
            <h2 className="mt-1 font-serif text-4xl sm:text-5xl">Services &amp; pricing</h2>
            <p className="mt-4 text-muted">
              Every appointment begins with a consultation. Listed prices are a
              starting point and may vary with hair length and density — your
              stylist will always confirm first.
            </p>
          </div>

          <div className="mt-16 space-y-16">
            {categories.map(([category, items]) => (
              <div
                key={category}
                className="grid gap-x-12 gap-y-6 lg:grid-cols-[220px_1fr]"
              >
                <div className="lg:sticky lg:top-28 lg:self-start">
                  <h3 className="font-serif text-3xl text-accent">{category}</h3>
                  <div className="mt-2 h-px w-16 bg-accent/40" />
                </div>
                <div className="divide-y divide-line">
                  {items.map((s) => (
                    <div
                      key={s.id}
                      className="group flex items-baseline justify-between gap-6 py-5"
                    >
                      <div className="min-w-0">
                        <div className="flex flex-wrap items-baseline gap-x-3">
                          <h4 className="font-serif text-xl">{s.name}</h4>
                          <span className="text-xs uppercase tracking-wider text-muted">
                            {formatDuration(s.durationMinutes)}
                          </span>
                        </div>
                        <p className="mt-1 max-w-xl text-sm leading-relaxed text-muted">
                          {s.description}
                        </p>
                      </div>
                      <div className="flex shrink-0 flex-col items-end gap-1">
                        <span className="font-medium tabular-nums text-ink">
                          {formatPrice(s.priceCents)}
                        </span>
                        <Link
                          href={`/book?service=${s.id}`}
                          className="text-xs font-medium text-accent transition-opacity hover:underline lg:opacity-0 lg:group-hover:opacity-100"
                        >
                          Book →
                        </Link>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ---------------------------------------------------------- Experience */}
      <section className="relative overflow-hidden bg-ink text-cream">
        <Rose
          variant="deep"
          className="-right-8 -top-8 hidden sm:block"
          width="clamp(96px,11vw,168px)"
          rotate={22}
        />
        <Rose
          variant="blush"
          className="-bottom-10 left-[6%] hidden lg:block"
          width="clamp(80px,8vw,120px)"
          rotate={-18}
        />
        <div className="container-page relative z-20 grid gap-12 py-20 sm:py-28 lg:grid-cols-3">
          {[
            {
              t: "A real consultation",
              d: "We listen first. Bring inspo or bring nothing — we'll find the look that fits your hair and your life.",
            },
            {
              t: "Color that grows out beautifully",
              d: "Lived-in, low-maintenance color so you look great between visits, not just the day you leave the chair.",
            },
            {
              t: "Booked around your day",
              d: "Transparent pricing and easy online booking. Reschedule in a tap if life happens.",
            },
          ].map((f) => (
            <div key={f.t}>
              <div className="mb-4 h-px w-12 bg-accent" />
              <h3 className="font-serif text-2xl">{f.t}</h3>
              <p className="mt-3 leading-relaxed text-cream/70">{f.d}</p>
            </div>
          ))}
        </div>
      </section>

      {/* --------------------------------------------------------------- Visit */}
      <section id="visit" className="relative overflow-hidden stripes-soft">
        <Rose
          variant="blush"
          className="-right-6 top-[12%] hidden md:block"
          width="clamp(80px,9vw,140px)"
          rotate={-12}
        />
        <Rose
          variant="deep"
          className="-bottom-8 -left-6 hidden sm:block"
          width="clamp(72px,8vw,120px)"
          rotate={16}
        />
        <div className="container-page relative z-20 grid gap-12 py-20 sm:py-28 lg:grid-cols-2">
          <div>
            <p className="script text-3xl text-accent">come say hello</p>
            <h2 className="mt-1 font-serif text-4xl sm:text-5xl">Visit the salon</h2>
            <p className="mt-4 max-w-md text-muted">
              Tucked just off the main drag with easy parking out back. New clients
              are always welcome.
            </p>
            <div className="mt-8 space-y-4 text-sm">
              <div>
                <div className="text-muted">Address</div>
                <div className="font-medium">
                  {SALON.address}, {SALON.cityLine}
                </div>
              </div>
              <div>
                <div className="text-muted">Phone</div>
                <a
                  className="font-medium hover:text-accent"
                  href={`tel:${SALON.phone.replace(/[^\d+]/g, "")}`}
                >
                  {SALON.phone}
                </a>
              </div>
              <div>
                <div className="text-muted">Email</div>
                <a className="font-medium hover:text-accent" href={`mailto:${SALON.email}`}>
                  {SALON.email}
                </a>
              </div>
            </div>
            <Link href="/book" className="btn-accent mt-9 !px-8 !py-3.5">
              Book your visit
            </Link>
          </div>

          <div className="card overflow-hidden">
            <div className="border-b border-line bg-surface px-6 py-4">
              <h3 className="font-serif text-2xl">Hours</h3>
            </div>
            <ul className="divide-y divide-line">
              {hours.map((h) => (
                <li
                  key={h.day}
                  className="flex items-center justify-between px-6 py-3.5 text-sm"
                >
                  <span className="font-medium">{h.day}</span>
                  <span className={h.hours === "Closed" ? "text-muted/60" : "text-muted"}>
                    {h.hours}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      <SiteFooter />
    </>
  );
}
