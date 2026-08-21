/**
 * Central salon configuration.
 *
 * Everything the front-of-house & booking engine needs to know about the
 * business lives here so it's easy to tweak without hunting through the code.
 */

export type DayHours = { open: string; close: string } | null;

export const SALON = {
  name: "Infinite Parallel Salon",
  shortName: "Infinite Parallel",
  tagline: "Modern cuts, lived-in color, and a chair that feels like home.",
  phone: "(555) 314-1592",
  email: "hello@infiniteparallel.salon",
  address: "12 Mnemonic Lane",
  cityLine: "Parallel City, CA 00000",
  instagram: "@infiniteparallelsalon",

  /** IANA timezone the salon operates in. Drives "today" / past-slot logic. */
  timezone: "America/New_York",

  /** Spacing between offered start times, in minutes. */
  slotIntervalMinutes: 30,

  /** How far ahead clients may book, in days. */
  bookingHorizonDays: 60,

  /** Minimum lead time before an appointment can start today, in minutes. */
  minLeadMinutes: 30,

  /**
   * Opening hours per weekday in salon-local time (24h "HH:MM").
   * Index: 0 = Sunday … 6 = Saturday. `null` means closed that day.
   */
  hours: {
    0: null, // Sunday — closed
    1: null, // Monday — closed
    2: { open: "09:00", close: "19:00" }, // Tuesday
    3: { open: "09:00", close: "19:00" }, // Wednesday
    4: { open: "09:00", close: "20:00" }, // Thursday
    5: { open: "09:00", close: "19:00" }, // Friday
    6: { open: "08:00", close: "17:00" }, // Saturday
  } as Record<number, DayHours>,
} as const;

export const WEEKDAY_LABELS = [
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
] as const;

/** Human-readable hours list for display on the site. */
export function hoursForDisplay(): { day: string; hours: string }[] {
  return WEEKDAY_LABELS.map((day, i) => {
    const h = SALON.hours[i];
    return {
      day,
      hours: h ? `${to12h(h.open)} – ${to12h(h.close)}` : "Closed",
    };
  });
}

function to12h(hhmm: string): string {
  const [h, m] = hhmm.split(":").map(Number);
  const ampm = h >= 12 ? "pm" : "am";
  const h12 = h % 12 === 0 ? 12 : h % 12;
  return m === 0 ? `${h12}${ampm}` : `${h12}:${String(m).padStart(2, "0")}${ampm}`;
}

/** Current date in the salon timezone as "YYYY-MM-DD". */
export function salonTodayISO(): string {
  return new Intl.DateTimeFormat("en-CA", {
    timeZone: SALON.timezone,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(new Date());
}

/** Current time in the salon timezone as "HH:MM" (24h). */
export function salonNowHM(): string {
  return new Intl.DateTimeFormat("en-GB", {
    timeZone: SALON.timezone,
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  }).format(new Date());
}
