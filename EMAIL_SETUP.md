# Email notifications

The site sends transactional email through [Resend](https://resend.com). Until
you add an API key everything below is a **safe no-op** — bookings still work,
the app just logs "skipped" instead of sending. Flip it on by setting a few env
vars; no code changes needed.

## What gets sent

| Email | To | Trigger |
| --- | --- | --- |
| Booking confirmation | Client | A booking is created (online or by staff) |
| New-booking alert | Owner | A client books online |
| Cancellation notice | Client | An appointment is set to **Cancelled** in `/admin` |
| 24-hour reminder | Client | `/api/cron/reminders` runs and the appt is within 24h |

Client emails only go out when the client gave an email address — the public
booking form now requires one.

## One-time setup (≈10 min)

1. **Create a Resend account** at https://resend.com (free tier ~3k emails/mo).
2. **Verify your sending domain.** In Resend → *Domains* → add
   `mainstreetsalon.studio`, then add the DNS records it shows (SPF, DKIM,
   and the optional DMARC) at your domain registrar. Verification is usually
   quick once DNS propagates.
   - *Skip-ahead option:* before the domain is verified you can use the sender
     `onboarding@resend.dev`, but it only delivers to your own Resend account
     email — fine for a first test, not for real clients.
3. **Create an API key** in Resend → *API Keys*.
4. **Set environment variables** (Render → your service → *Environment*):

   | Key | Value |
   | --- | --- |
   | `RESEND_API_KEY` | the key from step 3 |
   | `EMAIL_FROM` | `Infinite Parallel Salon <hello@mainstreetsalon.studio>` |
   | `OWNER_EMAIL` | the inbox that should get new-booking alerts |
   | `NEXT_PUBLIC_SITE_URL` | `https://mainstreetsalon.studio` |
   | `CRON_SECRET` | a long random string (Render's Blueprint generates one) |

   Generate a secret with:
   ```
   node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
   ```
5. **Redeploy.** Book a test appointment with your own email and confirm the
   confirmation + owner alert arrive.

## Reminders (the scheduled part)

Render's free tier has no built-in cron, so an **external scheduler** calls the
reminder endpoint. It's idempotent (`reminderSentAt` de-dupes), so hourly is
ideal and running more often is harmless.

**Endpoint:** `POST https://mainstreetsalon.studio/api/cron/reminders`
**Auth:** `Authorization: Bearer <CRON_SECRET>` _or_ `?secret=<CRON_SECRET>`

### Option A — cron-job.org (no code)
Create a job hitting
`https://mainstreetsalon.studio/api/cron/reminders?secret=YOUR_CRON_SECRET`
every hour.

### Option B — GitHub Actions (already in this repo's ecosystem)
Add `.github/workflows/reminders.yml`:

```yaml
name: Send appointment reminders
on:
  schedule:
    - cron: "0 * * * *" # hourly (UTC)
  workflow_dispatch:
jobs:
  ping:
    runs-on: ubuntu-latest
    steps:
      - run: |
          curl -fsS -X POST "https://mainstreetsalon.studio/api/cron/reminders" \
            -H "Authorization: Bearer ${{ secrets.CRON_SECRET }}"
```
Then add `CRON_SECRET` under the repo's *Settings → Secrets → Actions*.

A healthy response looks like `{"ok":true,"checked":N,"sent":M,"skipped":0}`.

## Later / nice-to-haves
- A calendar (`.ics`) attachment on confirmations so clients can one-tap add.
- A "review us" or thank-you note after an appointment is marked **Completed**.
- SMS reminders via Twilio (higher open rates, small per-message cost).
- Swap providers: only `src/lib/email.ts` talks to Resend — change that one
  file and the rest is untouched.
