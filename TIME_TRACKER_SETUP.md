# Time Tracker setup

The tracker lives at `/time` and leaves the public portfolio routes unchanged.

## 1. Create the database

Create a Supabase project, open **SQL Editor**, and run:

`supabase/time-tracker.sql`

The schema enables Row Level Security and enforces one running timer per signed-in account at database level.

## 2. Configure passwordless sign-in

In Supabase **Authentication > URL Configuration**:

- Site URL: `https://www.shanevelez.com`
- Allowed redirect URL: `https://www.shanevelez.com/time`
- For local development, also allow your local Vite `/time` URL.

The first magic-link sign-in creates your user. Because this tracker is intended for one person, disable new-user signups in Supabase after your account has been created.

## 3. Add environment variables

Copy `.env.example` to `.env.local` and set:

```text
VITE_SUPABASE_URL=https://YOUR-PROJECT.supabase.co
VITE_SUPABASE_ANON_KEY=YOUR_PUBLISHABLE_ANON_KEY
```

Add the same variables in Vercel project settings, then redeploy.

The anon/publishable key is designed to be present in browser code. **Never** use a Supabase service-role key here. Access to rows is protected by RLS.

## 4. First use

1. Open `/time` and sign in by email.
2. Open **Settings** and add your invoice name/address/payment instructions.
3. Add a client and hourly rate/currency.
4. Start and stop the timer as needed.
5. Use **Entries** to correct or manually add work.
6. Use **Invoices** to select a client/month and export.

Invoice export opens a print-optimised A4 invoice and the browser print dialog. Choose **Save as PDF**. Invoices are also snapshotted in the database so previously generated line items, rates, client details, and totals remain recorded.
