import { PrismaClient } from "@prisma/client";
import { SALON } from "../src/lib/salon-config";

const prisma = new PrismaClient();

/** Services menu. `id` is a stable slug so re-seeding is idempotent. */
const SERVICES = [
  {
    id: "womens-cut",
    name: "Women's Haircut & Style",
    description: "Consultation, shampoo, precision cut, and a finished blow-dry.",
    durationMinutes: 60,
    priceCents: 4500,
    category: "Haircuts",
  },
  {
    id: "mens-cut",
    name: "Men's Haircut",
    description: "Clipper or scissor cut tailored to you, with a hot-towel finish.",
    durationMinutes: 45,
    priceCents: 2250,
    category: "Haircuts",
  },
  {
    id: "kids-cut",
    name: "Kids' Cut (12 & under)",
    description: "A patient, friendly cut for our youngest guests.",
    durationMinutes: 30,
    priceCents: 1800,
    category: "Haircuts",
  },
  {
    id: "blowout",
    name: "Blowout & Style",
    description: "Shampoo and a polished blow-dry — smooth, wavy, or full of body.",
    durationMinutes: 45,
    priceCents: 3750,
    category: "Styling",
  },
  {
    id: "updo",
    name: "Special-Occasion Updo",
    description: "An elegant upstyle for weddings, galas, and big nights out.",
    durationMinutes: 60,
    priceCents: 8250,
    category: "Styling",
  },
  {
    id: "color-root",
    name: "Root Touch-Up Color",
    description: "Seamless regrowth coverage to refresh your existing color.",
    durationMinutes: 90,
    priceCents: 9000,
    category: "Color",
  },
  {
    id: "all-over-color",
    name: "All-Over Color",
    description: "A single, even tone from root to ends.",
    durationMinutes: 120,
    priceCents: 11250,
    category: "Color",
  },
  {
    id: "partial-highlights",
    name: "Partial Highlights",
    description: "Foils through the top and crown for brightness where it shows most.",
    durationMinutes: 120,
    priceCents: 12000,
    category: "Color",
  },
  {
    id: "highlights",
    name: "Full Highlights",
    description: "A full head of foils for brightness and dimension throughout.",
    durationMinutes: 150,
    priceCents: 15000,
    category: "Color",
  },
  {
    id: "balayage",
    name: "Balayage / Lived-In Color",
    description: "Hand-painted, grown-out-gracefully color with a natural finish.",
    durationMinutes: 180,
    priceCents: 19500,
    category: "Color",
  },
  {
    id: "gloss",
    name: "Gloss & Toner",
    description: "Add shine and perfect your tone between color appointments.",
    durationMinutes: 45,
    priceCents: 4500,
    category: "Color",
  },
  {
    id: "treatment",
    name: "Bond-Builder Treatment",
    description: "Repair and strengthen with an in-chair bonding treatment.",
    durationMinutes: 30,
    priceCents: 3000,
    category: "Treatments",
  },
  {
    id: "keratin",
    name: "Keratin Smoothing",
    description: "Tame frizz and cut styling time with a smoothing treatment.",
    durationMinutes: 150,
    priceCents: 22500,
    category: "Treatments",
  },
];

function todayISO(): string {
  return new Intl.DateTimeFormat("en-CA", {
    timeZone: SALON.timezone,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(new Date());
}

function addDays(iso: string, n: number): string {
  const [y, m, d] = iso.split("-").map(Number);
  const dt = new Date(y, m - 1, d);
  dt.setDate(dt.getDate() + n);
  return `${dt.getFullYear()}-${String(dt.getMonth() + 1).padStart(2, "0")}-${String(
    dt.getDate(),
  ).padStart(2, "0")}`;
}

function weekday(iso: string): number {
  const [y, m, d] = iso.split("-").map(Number);
  return new Date(y, m - 1, d).getDay();
}

/** The next `count` open dates starting tomorrow. */
function nextOpenDays(count: number): string[] {
  const out: string[] = [];
  let cursor = todayISO();
  let guard = 0;
  while (out.length < count && guard < 30) {
    cursor = addDays(cursor, 1);
    if (SALON.hours[weekday(cursor)]) out.push(cursor);
    guard++;
  }
  return out;
}

async function main() {
  for (const [i, s] of SERVICES.entries()) {
    await prisma.service.upsert({
      where: { id: s.id },
      update: { ...s, sortOrder: i, active: true },
      create: { ...s, sortOrder: i, active: true },
    });
  }
  console.log(`Seeded ${SERVICES.length} services.`);

  const count = await prisma.appointment.count();
  if (count > 0) {
    console.log(`Skipped demo appointments (${count} already exist).`);
    return;
  }

  const byId = Object.fromEntries(SERVICES.map((s) => [s.id, s]));
  const days = nextOpenDays(3);
  const demo = [
    { day: 0, time: "10:00", svc: "balayage", name: "Ava Mitchell", phone: "(555) 201-7788", status: "CONFIRMED" },
    { day: 0, time: "14:30", svc: "mens-cut", name: "Daniel Cho", phone: "(555) 332-0091", status: "CONFIRMED" },
    { day: 1, time: "09:30", svc: "womens-cut", name: "Priya Nair", phone: "(555) 884-2310", status: "CONFIRMED" },
    { day: 1, time: "12:00", svc: "color-root", name: "Sofia Romano", phone: "(555) 119-6654", status: "CONFIRMED" },
    { day: 2, time: "11:00", svc: "highlights", name: "Grace Bennett", phone: "(555) 770-5512", status: "CONFIRMED" },
  ];

  for (const d of demo) {
    const svc = byId[d.svc];
    const date = days[d.day];
    if (!svc || !date) continue;
    await prisma.appointment.create({
      data: {
        serviceId: svc.id,
        serviceName: svc.name,
        durationMinutes: svc.durationMinutes,
        priceCents: svc.priceCents,
        date,
        startTime: d.time,
        customerName: d.name,
        customerPhone: d.phone,
        customerEmail: "",
        status: d.status,
        source: "online",
      },
    });
  }
  console.log(`Seeded ${demo.length} demo appointments.`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
