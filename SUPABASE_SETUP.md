# Supabase MVP setup

## Required environment variables

Copy `.env.example` to `.env.local` and provide:

- `NEXT_PUBLIC_SUPABASE_URL` — Project URL from Supabase Dashboard → Project Settings → API.
- `NEXT_PUBLIC_SUPABASE_ANON_KEY` — anon key from the same page. This is the only key used by browser code.
- `NEXT_PUBLIC_SITE_URL` — `http://localhost:3000` locally and the canonical HTTPS origin on Vercel.
- `SUPABASE_SERVICE_ROLE_KEY` — server-only key required by the existing admin operations. Never prefix it with `NEXT_PUBLIC_` or expose it to Client Components.

The application builds without these values. Public pages remain available; authentication and private routes remain unavailable until configuration is complete.

## Supabase Dashboard

1. Create or select the Supabase project.
2. Apply the SQL files in `supabase/migrations` in filename order using the Supabase CLI or SQL Editor. Review them before applying. The application does not run migrations automatically.
3. In Authentication → Providers, enable Email. Decide whether Confirm email is required for the environment.
4. In Authentication → URL Configuration, set the production Site URL.
5. Add these Redirect URLs:
   - `http://localhost:3000/auth/confirm`
   - `https://batchngo-web.vercel.app/auth/confirm`
   - the equivalent callback for any Vercel preview origin you intentionally support.
6. Configure production SMTP before inviting real users.
7. Confirm that `project-files` and `manufacturer-verification` exist and are private buckets.
8. Create admin access only through an explicit, audited database change to `profiles.role`. The application never promotes the first user and never trusts role metadata from the browser.

## Vercel

1. Open Project Settings → Environment Variables.
2. Add the four variables listed above to the appropriate Preview and Production environments.
3. Keep `SUPABASE_SERVICE_ROLE_KEY` server-only. Do not expose it in browser-prefixed variables.
4. Set `NEXT_PUBLIC_SITE_URL` to the exact deployment origin for each environment.
5. Redeploy after changing environment variables, then test sign-up, callback, login, logout, private-route redirects, and admin denial.

## Local CLI

```bash
supabase link --project-ref YOUR_PROJECT_REF
supabase db push
npm run dev
```

Generate authoritative database types after applying migrations:

```bash
supabase gen types typescript --linked > lib/supabase/database.generated.ts
```

The repository includes a hand-maintained `database.types.ts` so builds can run before a project is linked. Reconcile it with generated types after every schema migration.
