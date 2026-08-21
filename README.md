# Infinite Parallel Salon

A complete hair-salon website with **online booking** and a password-protected
**admin appointment book** (a live spreadsheet of every appointment).

Built to be easy to re-skin: drop your own background art / procedural visuals
into a clearly-marked component and the rest of the site stays wired up.

---

## What's included

- **Public site** (`/`) — hero, full services & pricing menu, hours, and contact.
- **Online booking** (`/book`) — a 3-step flow:
  1. Pick a service
  2. Pick a date, then a time from **real, conflict-checked availability**
  3. Enter contact details → appointment saved to the database
- **Admin appointment book** (`/admin`) — password-gated spreadsheet of every
  appointment with:
  - Filter by date range / status, plus search (name, phone, email, service)
  - Inline status changes (Confirmed → Completed / Cancelled / No-show)
  - **Add walk-in / phone bookings** (skips the online lead-time limit)
  - Delete, live totals (booked value), and **CSV export**

The booking engine enforces opening hours, service duration, a booking horizon,
a minimum lead time, and prevents double-booking — all server-side.

---

## Tech stack

| Layer     | Choice                                  |
| --------- | --------------------------------------- |
| Framework | Next.js 15 (App Router) + React 19      |
| Language  | TypeScript                              |
| Styling   | Tailwind CSS (design tokens = CSS vars) |
| Database  | Prisma ORM + Postgres                   |

---

## Quick start

```bash
# 1. Install
npm install

# 2. Set up environment (needs a Postgres DATABASE_URL — local or hosted)
cp .env.example .env        # then edit the values (see below)

# 3. Create + seed the database
npm run db:push             # creates the tables in Postgres
npm run db:seed             # adds the services menu + demo appointments

# 4. Run it
npm run dev                 # http://localhost:3000
```

> Local dev needs a Postgres database. Quickest options: a free
> [Neon](https://neon.tech) dev branch, or local Postgres
> (`postgresql://USER:PASS@localhost:5432/salon`).

Then visit:

- `http://localhost:3000` — the website
- `http://localhost:3000/book` — booking flow
- `http://localhost:3000/admin` — admin spreadsheet (password from `.env`)

> The default dev admin password is `salon-admin` (set in `.env`). **Change it
> before going live.**

---

## Environment variables

See `.env.example`. The three that matter:

| Variable         | Purpose                                                         |
| ---------------- | -------------------------------------------------------------- |
| `DATABASE_URL`   | Postgres connection string (Render/Neon/Supabase/local).       |
| `ADMIN_PASSWORD` | Password for the `/admin` spreadsheet. **Change this.**        |
| `SESSION_SECRET` | Signs the admin session cookie. Use a long random string.      |

Generate a session secret:

```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

---

## Customizing

### Salon details, hours, services rules

Everything front-of-house lives in **`src/lib/salon-config.ts`** — name, phone,
address, timezone, opening hours per weekday, slot interval, lead time, and how
far ahead clients can book.

### The services menu & prices

Edit **`prisma/seed.ts`** and re-run `npm run db:seed`. Services are upserted by
a stable `id`, so editing names/prices/durations is safe to re-run. (Long term
you can manage these from an admin screen — the data model already supports it.)

### Design / colors

The entire palette is a handful of CSS variables at the top of
**`src/app/globals.css`** (`--bg`, `--ink`, `--accent`, …). Change those to
re-skin the whole site. Fonts are set in `src/app/layout.tsx`.

### 🎨 Dropping in your own backgrounds / procedurals

The animated hero background is an isolated, **swappable** component:
**`src/components/Backdrop.tsx`**. It ships with a CSS-only procedural look so
the site feels alive out of the box. To use your own art (e.g. a Higgsfield
render), replace its contents with an `<Image>` or autoplaying muted `<video>` —
there are copy-paste instructions in the file's header comment. Keep the scrim
`<div>` for text legibility.

---

## Deploying

This is a full-stack app (server-rendered pages + API + Postgres) — it needs a
host that runs Node, **not** a static host.

### Render (recommended)

**Option A — Blueprint (one click):** Render dashboard → **New → Blueprint** →
pick this repo. `render.yaml` creates the web service + a free Postgres, wires
`DATABASE_URL`, generates `SESSION_SECRET`, and prompts for `ADMIN_PASSWORD`.

**Option B — manual Web Service:**

1. Create a **Postgres** instance on Render (free) and copy its *Internal
   Database URL*.
2. Create a **Web Service** from this repo:
   - **Build command:** `npm install --include=dev && npm run build && npx prisma db push && npm run db:seed`
   - **Start command:** `npm run start`
3. Add env vars: `DATABASE_URL` (the Internal URL), `ADMIN_PASSWORD`,
   `SESSION_SECRET`, `NODE_VERSION=22`.

### Other hosts (Vercel, Fly, Railway, …)

Same idea: point `DATABASE_URL` at a hosted Postgres, set `ADMIN_PASSWORD` +
`SESSION_SECRET`, build with `npm run build`, and run `prisma db push` once to
create the tables. No code changes needed — everything goes through Prisma.

---

## Project structure

```
prisma/
  schema.prisma          # Service + Appointment models
  seed.ts                # services menu + demo appointments
src/
  app/
    page.tsx             # landing page
    book/page.tsx        # booking page (loads services, booking window)
    admin/page.tsx       # auth-gated spreadsheet
    admin/login/page.tsx # staff sign-in
    api/
      services/          # GET active services
      availability/      # GET open time slots for a date + service
      appointments/      # POST public booking
      admin/             # login, logout, list/create, update/delete
  components/
    Backdrop.tsx         # 🎨 swappable procedural background
    BookingForm.tsx      # 3-step booking UI
    SiteHeader / SiteFooter
    admin/AdminDashboard.tsx  # the spreadsheet
    admin/LoginForm.tsx
  lib/
    salon-config.ts      # ⭐ hours, timezone, booking rules, contact
    availability.ts      # slot generation + conflict checks
    booking.ts           # shared create-appointment logic + validation
    auth.ts              # signed-cookie admin sessions
    prisma.ts, time.ts, format.ts, appointment-status.ts
```

---

## API reference (for future integrations)

| Method & path                        | Auth  | Purpose                          |
| ------------------------------------ | ----- | -------------------------------- |
| `GET /api/services`                  | —     | Active services                  |
| `GET /api/availability?date=&serviceId=` | — | Open start times                 |
| `POST /api/appointments`             | —     | Create a booking                 |
| `POST /api/admin/login`              | —     | Exchange password for session    |
| `POST /api/admin/logout`             | admin | Clear session                    |
| `GET /api/admin/appointments`        | admin | List (filters: from/to/status/q) |
| `POST /api/admin/appointments`       | admin | Staff/walk-in booking            |
| `PATCH /api/admin/appointments/:id`  | admin | Update status / details          |
| `DELETE /api/admin/appointments/:id` | admin | Remove an appointment            |
