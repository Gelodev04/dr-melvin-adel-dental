# Clone checklist — new clinic client

Use this when fulfilling a sold website + booking package.

## Before kickoff

- [ ] Collect logo (SVG/PNG), brand colors, clinic legal name
- [ ] Services list with duration (minutes) and guide price (PHP)
- [ ] Dentists/staff names, titles, short bios, which services each offers
- [ ] Weekly hours + closed days / holidays
- [ ] Address, phone, email, Google Maps link
- [ ] Preferred domain (or use your subdomain until DNS is ready)
- [ ] Admin staff email for login

## Build steps

1. [ ] Clone this repo into a new folder / new Git repo per client
2. [ ] Update `src/lib/clinic-config.ts` (name, tagline, contact, hero, brand)
3. [ ] Align CSS tokens in `src/app/globals.css` with brand primary
4. [ ] Rewrite `prisma/seed.ts` with real services, doctors, hours, admin user
5. [ ] Set production env: `DATABASE_URL` (Postgres), `NEXTAUTH_SECRET`, `NEXTAUTH_URL`, Resend keys
6. [ ] `yarn db:setup` (or migrate) against production DB
7. [ ] Deploy (Vercel recommended) and attach custom domain
8. [ ] Smoke-test: book on mobile, confirm in admin, check emails
9. [ ] Change demo admin password immediately after first login

## Handoff

- [ ] Walk receptionist through [`HANDOFF.md`](./HANDOFF.md) (15–30 min)
- [ ] Send pricing add-ons sheet and support channel
- [ ] Schedule 1-week check-in for feedback

## Timeline (typical)

- Content received → branded site live: **5–10 business days**
- Rush: possible if content is complete on day one
