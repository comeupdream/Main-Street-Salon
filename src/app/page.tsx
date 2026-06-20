import Link from "next/link";
import Backdrop from "@/components/Backdrop";
import SiteFooter from "@/components/SiteFooter";
import SiteHeader from "@/components/SiteHeader";
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
    const card: ServiceCard = {
      id: s.id,
      name: s.name,
      description: s.description,
      durationMinutes: s.durationMinutes,
      priceCents: s.priceCents,
      category: s.category,
    };
    if (!groups.has(s.category)) groups.set(s.category, []);
    groups.get(s.category)!.push(card);
  }
  return Array.from(groups.entries());
}

export default async function HomePage() {
  const categories = await getServicesByCategory();
  const hours = hoursForDisplay();

  return (
    <>
      <SiteHeader transparent />

      {/* ---------------------------------------------------------------- Hero */}
      <section className="relative isolate overflow-hidden">
        <Backdrop />
        <div className="container-page flex min-h-[88vh] flex-col justify-center py-32">
          <p className="eyebrow animate-fade-up">
            {SALON.cityLine.split(",")[0]} · Est. 2014
          </p>
          <h1 className="mt-5 max-w-4xl text-balance text-5xl leading-[1.05] animate-fade-up [animation-delay:60ms] sm:text-6xl lg:text-7xl">
            Beautiful hair, <span className="text-accent">by people</span> who
            love doing it.
          </h1>
          <p className="mt-6 max-w-xl text-balance text-lg leading-relaxed text-muted animate-fade-up [animation-delay:120ms]">
            {SALON.tagline} Book online in under a minute — we&apos;ll take care
            of the rest.
          </p>
          <div className="mt-9 flex flex-wrap items-center gap-3 animate-fade-up [animation-delay:180ms]">
            <Link href="/book" className="btn-accent !px-7 !py-3.5 text-base">
              Book an appointment
            </Link>
            <Link href="#services" className="btn-ghost !px-7 !py-3.5 text-base">
              View services &amp; pricing
            </Link>
          </div>
          <dl className="mt-14 flex flex-wrap gap-x-12 gap-y-4 text-sm animate-fade-up [animation-delay:240ms]">
            <div>
              <dt className="text-muted">Walk in, or book ahead</dt>
              <dd className="font-medium">{SALON.address}</dd>
            </div>
            <div>
              <dt className="text-muted">Open today &amp; this week</dt>
              <dd className="font-medium">Tue – Sat · by appointment</dd>
            </div>
          </dl>
        </div>
      </section>

      {/* ------------------------------------------------------------ Services */}
      <section id="services" className="border-t border-line bg-surface">
        <div className="container-page py-20 sm:py-28">
          <div className="max-w-2xl">
            <p className="eyebrow">The menu</p>
            <h2 className="mt-3 text-4xl sm:text-5xl">Services &amp; pricing</h2>
            <p className="mt-4 text-muted">
              Every appointment starts with a consultation. Pricing starts at the
              listed rate and may vary with hair length and density — your stylist
              will confirm before we begin.
            </p>
          </div>

          <div className="mt-14 space-y-16">
            {categories.map(([category, items]) => (
              <div key={category} className="grid gap-x-12 gap-y-6 lg:grid-cols-[200px_1fr]">
                <h3 className="text-2xl text-accent lg:sticky lg:top-28 lg:self-start">
                  {category}
                </h3>
                <div className="divide-y divide-line">
                  {items.map((s) => (
                    <div
                      key={s.id}
                      className="group flex items-baseline justify-between gap-6 py-5"
                    >
                      <div className="min-w-0">
                        <div className="flex flex-wrap items-baseline gap-x-3">
                          <h4 className="font-serif text-lg">{s.name}</h4>
                          <span className="text-xs uppercase tracking-wider text-muted">
                            {formatDuration(s.durationMinutes)}
                          </span>
                        </div>
                        <p className="mt-1 max-w-xl text-sm leading-relaxed text-muted">
                          {s.description}
                        </p>
                      </div>
                      <div className="flex shrink-0 flex-col items-end gap-1">
                        <span className="font-medium tabular-nums">
                          {formatPrice(s.priceCents)}
                        </span>
                        <Link
                          href={`/book?service=${s.id}`}
                          className="text-xs font-medium text-accent opacity-0 transition-opacity hover:underline group-hover:opacity-100 max-lg:opacity-100"
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
      <section className="bg-ink text-bg">
        <div className="container-page grid gap-12 py-20 sm:py-28 lg:grid-cols-3">
          {[
            {
              t: "A real consultation",
              d: "We listen first. Bring inspo, bring nothing — we'll find the look that fits your hair and your life.",
            },
            {
              t: "Color that grows out well",
              d: "Lived-in, low-maintenance color so you look great between visits, not just the day you leave.",
            },
            {
              t: "On your schedule",
              d: "Transparent pricing and easy online booking. Reschedule in a tap if life happens.",
            },
          ].map((f) => (
            <div key={f.t}>
              <div className="mb-4 h-px w-12 bg-accent" />
              <h3 className="text-2xl">{f.t}</h3>
              <p className="mt-3 leading-relaxed text-bg/70">{f.d}</p>
            </div>
          ))}
        </div>
      </section>

      {/* --------------------------------------------------------------- Visit */}
      <section id="visit" className="bg-bg">
        <div className="container-page grid gap-12 py-20 sm:py-28 lg:grid-cols-2">
          <div>
            <p className="eyebrow">Visit us</p>
            <h2 className="mt-3 text-4xl sm:text-5xl">Come say hello</h2>
            <p className="mt-4 max-w-md text-muted">
              Tucked just off the main drag with easy parking out back. New
              clients always welcome.
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
            <Link href="/book" className="btn-ink mt-9 !px-7 !py-3.5">
              Book your visit
            </Link>
          </div>

          <div className="card overflow-hidden">
            <div className="border-b border-line bg-surface px-6 py-4">
              <h3 className="font-serif text-xl">Hours</h3>
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
