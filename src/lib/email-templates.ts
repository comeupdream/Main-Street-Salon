/**
 * Branded, email-client-safe HTML for the salon's transactional messages.
 *
 * Email clients ignore <style>/external CSS and strip many tags, so everything
 * here is built from tables + inline styles. Each builder returns a subject and
 * both an HTML and a plain-text body.
 */
import { formatDateLong, formatDuration, formatPrice, formatTime12 } from "./format";
import { SALON } from "./salon-config";

/** The appointment fields the templates need (a Prisma Appointment satisfies this). */
export type EmailAppointment = {
  id: string;
  serviceName: string;
  date: string;
  startTime: string;
  durationMinutes: number;
  priceCents: number;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  notes: string;
};

export type BuiltEmail = { subject: string; html: string; text: string };

const ACCENT = "#C95678";
const INK = "#1C1918";
const MUTED = "#8C807A";
const CREAM = "#FBF6F2";
const LINE = "#ECE2DC";

/** Escape user-supplied text before placing it into HTML. */
function esc(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function firstName(name: string): string {
  return name.trim().split(/\s+/)[0] || "there";
}

function siteUrl(): string {
  return (process.env.NEXT_PUBLIC_SITE_URL || "https://mainstreetsalon.studio").replace(/\/$/, "");
}

/** Branded shell around a message body (raw, already-escaped HTML). */
function shell(opts: { preheader: string; hello: string; heading: string; body: string }): string {
  return `<!doctype html><html><body style="margin:0;padding:0;background:${CREAM};">
  <span style="display:none;max-height:0;overflow:hidden;opacity:0;">${esc(opts.preheader)}</span>
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:${CREAM};padding:28px 0;">
    <tr><td align="center">
      <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:540px;background:#ffffff;border:1px solid ${LINE};border-radius:18px;overflow:hidden;">
        <tr><td style="background:${ACCENT};height:6px;font-size:0;line-height:0;">&nbsp;</td></tr>
        <tr><td style="padding:34px 38px 6px;">
          <div style="font-family:'Parisienne',Georgia,cursive;color:${ACCENT};font-size:24px;line-height:1;">${esc(opts.hello)}</div>
          <h1 style="margin:6px 0 0;font-family:Georgia,'Times New Roman',serif;color:${INK};font-size:25px;font-weight:600;">${esc(opts.heading)}</h1>
        </td></tr>
        <tr><td style="padding:14px 38px 28px;font-family:Helvetica,Arial,sans-serif;color:${INK};font-size:15px;line-height:1.65;">
          ${opts.body}
        </td></tr>
        <tr><td style="padding:20px 38px 28px;border-top:1px solid ${LINE};font-family:Helvetica,Arial,sans-serif;color:${MUTED};font-size:12px;line-height:1.6;">
          <strong style="color:${INK};">${esc(SALON.name)}</strong><br/>
          ${esc(SALON.address)}, ${esc(SALON.cityLine)}<br/>
          ${esc(SALON.phone)} &middot; ${esc(SALON.email)}
        </td></tr>
      </table>
    </td></tr>
  </table>
  </body></html>`;
}

function detailsTable(a: EmailAppointment): string {
  const row = (label: string, value: string) =>
    `<tr>
      <td style="padding:7px 2px;color:${MUTED};font-size:13px;">${label}</td>
      <td style="padding:7px 2px;text-align:right;color:${INK};font-weight:600;">${value}</td>
    </tr>`;
  return `<table role="presentation" width="100%" cellpadding="0" cellspacing="0"
      style="margin:18px 0;background:${CREAM};border:1px solid ${LINE};border-radius:12px;padding:4px 16px;">
    ${row("Service", esc(a.serviceName))}
    ${row("Date", formatDateLong(a.date))}
    ${row("Time", formatTime12(a.startTime))}
    ${row("Duration", formatDuration(a.durationMinutes))}
    ${a.priceCents ? row("Price", formatPrice(a.priceCents)) : ""}
  </table>`;
}

function detailsText(a: EmailAppointment): string {
  const lines = [
    `  Service:   ${a.serviceName}`,
    `  Date:      ${formatDateLong(a.date)}`,
    `  Time:      ${formatTime12(a.startTime)}`,
    `  Duration:  ${formatDuration(a.durationMinutes)}`,
  ];
  if (a.priceCents) lines.push(`  Price:     ${formatPrice(a.priceCents)}`);
  return lines.join("\n");
}

function footerText(): string {
  return `${SALON.name}\n${SALON.address}, ${SALON.cityLine}\n${SALON.phone} · ${SALON.email}`;
}

// --------------------------------------------------------------- Client: booked
export function clientBookingConfirmation(a: EmailAppointment): BuiltEmail {
  const subject = `You're booked — ${formatDateLong(a.date)} at ${formatTime12(a.startTime)}`;
  const body = `
    <p style="margin:0 0 4px;">Hi ${esc(firstName(a.customerName))}, your appointment at ${esc(SALON.name)} is confirmed — we can't wait to see you!</p>
    ${detailsTable(a)}
    <p style="color:${MUTED};font-size:13px;margin:0;">Need to change or cancel? Just reply to this email or call us at ${esc(SALON.phone)}.</p>`;
  const text =
    `Hi ${firstName(a.customerName)}, your appointment at ${SALON.name} is confirmed.\n\n` +
    detailsText(a) +
    `\n\nNeed to change or cancel? Reply to this email or call ${SALON.phone}.\n\n${footerText()}`;
  return {
    subject,
    html: shell({ preheader: "Your appointment is confirmed.", hello: "hello gorgeous", heading: "You're booked!", body }),
    text,
  };
}

// ----------------------------------------------------------- Owner: new booking
export function ownerNewBooking(a: EmailAppointment): BuiltEmail {
  const subject = `New booking · ${a.customerName} · ${formatDateLong(a.date)} ${formatTime12(a.startTime)}`;
  const contactRow = (label: string, value: string) =>
    `<tr><td style="padding:4px 2px;color:${MUTED};font-size:13px;">${label}</td><td style="padding:4px 2px;text-align:right;color:${INK};">${value}</td></tr>`;
  const contact = `
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin:2px 0 0;">
      ${contactRow("Client", `<strong>${esc(a.customerName)}</strong>`)}
      ${a.customerPhone ? contactRow("Phone", esc(a.customerPhone)) : ""}
      ${a.customerEmail ? contactRow("Email", esc(a.customerEmail)) : ""}
    </table>`;
  const body = `
    <p style="margin:0 0 4px;">A new appointment just came in.</p>
    ${detailsTable(a)}
    ${contact}
    ${a.notes ? `<p style="margin:16px 0 0;"><span style="color:${MUTED};font-size:13px;">Notes:</span><br/>${esc(a.notes)}</p>` : ""}
    <p style="margin:18px 0 0;"><a href="${siteUrl()}/admin" style="color:${ACCENT};font-weight:600;text-decoration:none;">Open the admin calendar →</a></p>`;
  const text =
    `New appointment at ${SALON.name}.\n\n` +
    detailsText(a) +
    `\n\n  Client:    ${a.customerName}` +
    (a.customerPhone ? `\n  Phone:     ${a.customerPhone}` : "") +
    (a.customerEmail ? `\n  Email:     ${a.customerEmail}` : "") +
    (a.notes ? `\n\nNotes: ${a.notes}` : "") +
    `\n\nAdmin: ${siteUrl()}/admin`;
  return {
    subject,
    html: shell({ preheader: `${a.customerName} — ${formatDateLong(a.date)}`, hello: "new booking", heading: "New appointment", body }),
    text,
  };
}

// ------------------------------------------------------------ Client: cancelled
export function clientCancellation(a: EmailAppointment): BuiltEmail {
  const subject = `Cancelled — your ${SALON.shortName} appointment on ${formatDateLong(a.date)}`;
  const body = `
    <p style="margin:0 0 4px;">Hi ${esc(firstName(a.customerName))}, the appointment below has been cancelled.</p>
    ${detailsTable(a)}
    <p style="margin:0;">Changed your mind? We'd love to see you — <a href="${siteUrl()}/book" style="color:${ACCENT};font-weight:600;">book a new time</a> or call us at ${esc(SALON.phone)}.</p>`;
  const text =
    `Hi ${firstName(a.customerName)}, the appointment below has been cancelled.\n\n` +
    detailsText(a) +
    `\n\nBook a new time: ${siteUrl()}/book  ·  or call ${SALON.phone}\n\n${footerText()}`;
  return {
    subject,
    html: shell({ preheader: "Your appointment has been cancelled.", hello: "hello gorgeous", heading: "Appointment cancelled", body }),
    text,
  };
}

// ------------------------------------------------------------- Client: reminder
export function clientReminder(a: EmailAppointment): BuiltEmail {
  const subject = `Reminder · ${SALON.shortName} on ${formatDateLong(a.date)} at ${formatTime12(a.startTime)}`;
  const body = `
    <p style="margin:0 0 4px;">Hi ${esc(firstName(a.customerName))}, just a friendly reminder about your upcoming appointment.</p>
    ${detailsTable(a)}
    <p style="color:${MUTED};font-size:13px;margin:0;">Can't make it? Reply to this email or call ${esc(SALON.phone)} and we'll find a better time.</p>`;
  const text =
    `Hi ${firstName(a.customerName)}, a friendly reminder about your upcoming appointment.\n\n` +
    detailsText(a) +
    `\n\nCan't make it? Reply to this email or call ${SALON.phone}.\n\n${footerText()}`;
  return {
    subject,
    html: shell({ preheader: "A reminder about your upcoming appointment.", hello: "see you soon", heading: "Appointment reminder", body }),
    text,
  };
}
