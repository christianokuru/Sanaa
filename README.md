# Sanaa

**Learn the craft. Earn from it.**

An online course marketplace for African hands-on skills: fashion and sewing, hair and beauty, dance and music. Teachers upload video courses and keep 80% of each sale. Sanaa keeps 20%.

## What's included

- **Mobile-first design** with an African look (kente stripes, mud cloth patterns) and a bottom menu on phones
- **Country indicator** in the header. It detects the visitor's country and shows every price in their currency. Visitors can change their country.
- **Payments with Flutterwave**: mobile money, card and bank transfer. Learners pay in their own currency where Flutterwave supports it, otherwise in USD.
- **80/20 split**: every sale records the teacher's 80% and your 20%
- **Teacher payouts** to mobile money or bank through Flutterwave Transfers, sent from the admin page
- **Video hosting with Bunny Stream**: resumable uploads from a phone, adaptive streaming, optional signed links
- **Data saver mode** that caps video at 360p
- **Moving watermark** with the student's email, to discourage piracy
- **Free preview lessons**, reviews and ratings, progress tracking
- **Certificates** that anyone can check by link
- **Admin area**: approve or reject courses, pay teachers, see sales and your earnings
- **Filming guide** for teachers
- **Installable on phones** (web app manifest)

Without any keys set, the site runs in **demo mode** with sample courses.

## Run it locally

```bash
npm install
cp .env.example .env.local
npm run dev
```

Open http://localhost:3000.

## Set up the services

### 1. Supabase (database, logins, cover photos)

1. Create a project at supabase.com.
2. Go to **SQL Editor**, paste all of `supabase/schema.sql` and run it.
3. Under **Project Settings > API**, copy the URL, the anon key and the service role key into `.env.local`.
4. Under **Authentication > URL Configuration**, set the Site URL to your domain and add `https://YOUR-DOMAIN/auth/callback` as a redirect URL.
5. Sign up on your site, then make yourself admin. In the SQL Editor, run:

```sql
update public.profiles set role = 'admin'
where id = (select id from auth.users where email = 'you@example.com');
```

### 2. Flutterwave (payments and payouts)

1. In the Flutterwave dashboard, copy your **secret key** into `FLW_SECRET_KEY`. Use test keys first.
2. Under **Settings > Webhooks**, set the URL to `https://YOUR-DOMAIN/api/webhooks/flutterwave`. Choose a secret hash and put the same value in `FLW_WEBHOOK_HASH`.
3. Payouts need a funded Flutterwave balance in the teacher's currency. Check the mobile money network codes in `lib/payout-options.ts` against the Flutterwave transfer docs before going live.

### 3. Bunny Stream (videos)

1. Create a Stream library at bunny.net.
2. Copy the library ID, API key and CDN hostname into `.env.local`.
3. Optional, but recommended: turn on **CDN token authentication** in the library's security settings and copy the key into `BUNNY_STREAM_TOKEN_KEY`. Video links then expire after a few hours. Test playback after you turn this on.

### 4. Deploy

Deploy to **Vercel** (recommended). Vercel tells the site each visitor's country, which the country indicator needs. Add every variable from `.env.example` in the Vercel project settings and set `NEXT_PUBLIC_SITE_URL` to your live domain.

## How money flows

1. A learner pays, for example ₦15,000, through Flutterwave.
2. The payment is checked with Flutterwave's servers, never trusted from the browser.
3. The sale is stored in US dollars at that day's rate: 80% to the teacher's balance, 20% to Sanaa.
4. From **Admin > Teacher payouts**, you send each teacher their balance in their own currency.

## Project layout

- `app/`: pages (home, browse, course, learn, teach, admin, account)
- `components/`: buttons, cards, player, forms
- `lib/`: currency, country, payments, video and database helpers
- `lib/actions/`: server actions (checkout, teacher, admin, auth)
- `supabase/schema.sql`: tables, security rules and storage
