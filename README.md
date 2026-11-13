# Sanaa

**Learn the craft. Earn from it.**

A mobile-first PWA marketplace where African teachers sell video courses in fashion, hair, beauty, dance, music and crafts. Teachers keep 80% of each sale and Sanaa keeps 20%. Prices show in each visitor's own currency.

> **Status:** the frontend is complete. Data is saved on the device, so every flow works end to end without a backend. Connect Supabase, Flutterwave and Bunny Stream next (see "Connecting the backend" below).

## Run it

```bash
npm install
npm run dev
```

Open http://localhost:3000.

### Demo accounts

All three use the password `Sanaa2026`. The login page also has one-tap buttons for them.

| Role    | Email                  |
| ------- | ---------------------- |
| Learner | learner@sanaa.africa   |
| Teacher | teacher@sanaa.africa   |
| Admin   | admin@sanaa.africa     |

Remove the demo accounts (`DEMO_ACCOUNTS` in `src/lib/services/auth.ts`) before launch.

## What's inside

**Learners:** search, filters and sorting; category and teacher pages; course pages with free previews; wishlist; checkout by mobile money, card or bank transfer (test mode); video player with a data saver and a moving watermark; progress tracking; certificates; reviews; account settings; delete account.

**Teachers:** an earnings calculator; dashboard with earnings, a chart and recent sales; course editor with lessons, video upload, reorder and free previews; send for review; payout details for mobile money or bank.

**Admin:** overview of sales and your 20% revenue; approve or reject courses; send teacher payouts; sales table.

**Platform:** prices in all 54 African currencies plus the main diaspora currencies; installable PWA with offline page; SEO (metadata, sitemap, robots, JSON-LD, share images).

## Design

- Clean white canvas, near-black type, one action color: **ember** `#D93A16`.
- Bold course art inspired by Ndebele painting, kente, mud cloth and adire is generated per course (`src/components/brand/CourseArt.tsx`). It needs no image downloads. When a course has a real photo (`coverUrl`), the photo is shown instead.
- Fonts: DM Sans, with Instrument Serif italic for accents.
- Tokens live in `tailwind.config.ts`.

## Code structure

```
src/
  app/                 routes (pages are thin: they load data and render components)
  components/
    ui/                design system: Button, Field, Sheet, Badge, Scroller, Toaster…
    layout/            header, category bar, mobile tab bar, footer
    brand/             logo, category icons, cover art
    course/ search/ learn/ checkout/ library/ account/ teach/ admin/ …  feature components
  config/              site, categories, payment providers
  lib/
    catalog/           course data and the read API (repository.ts)
    locale/            countries, currency conversion, visitor locale
    services/          all business actions: auth, checkout, library, teaching, admin, earnings
    store/             device storage, validated against a schema on every load
    validation/        zod schemas for every form
    security/          CSP, password hashing, safe redirects
    seo/               JSON-LD and share images
```

Components never change data directly: they call `lib/services/*`. Connecting the backend means changing those services and `lib/catalog/repository.ts`, not the UI.

## Security

- **Content Security Policy** with a per-request nonce: scripts only run from this site. Also HSTS, `X-Frame-Options: DENY`, `nosniff`, a strict referrer policy and a permissions policy (`src/middleware.ts`, `next.config.mjs`).
- **Validation:** every form and URL parameter is validated with zod. Control characters are stripped and lengths are capped.
- **Passwords:** hashed with PBKDF2 (210k iterations), compared in constant time. Five wrong attempts lock the account for 5 minutes. Login errors never reveal whether an email exists.
- **Redirects:** `?next=` only accepts same-site paths, which blocks open redirects.
- **Saved data** is validated on load, so tampered storage is discarded.
- **Card details** are validated in memory only and never stored.
- **Structured data** is escaped so it can't break out of its script tag.

> Device-side auth protects the demo, but **real security must come from the server**. When Supabase is connected, use its Auth and the row-level security policies in `legacy/supabase/schema.sql`.

## Connecting the backend (next step)

1. **Supabase:** run `legacy/supabase/schema.sql`. Then swap `lib/services/auth.ts` for Supabase Auth, `lib/catalog/repository.ts` for queries, and the other services for API calls or server actions.
2. **Flutterwave:** replace `payForCourse` in `lib/services/checkout.ts` with a server action that creates the payment link, plus a webhook that verifies the transaction before enrolling. The previous version of this code in git history has a working example.
3. **Bunny Stream:** pass each lesson's HLS URL to `VideoPlayer` and set `NEXT_PUBLIC_VIDEO_CDN_HOST` so the CSP allows it.
4. **Hosting:** deploy on Vercel. It sends each visitor's country, which drives the currency.

## Scripts

- `npm run build`: production build
- `npm run lint`: lint
- `npm run typecheck`: type check
- `npm run icons`: regenerate PWA icons from `public/icons/icon.svg` (needs Playwright)
