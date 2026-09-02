# Supabase MVP setup

1. Create a Supabase project and copy `.env.example` to `.env.local`.
2. Set `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY`, and `NEXT_PUBLIC_SITE_URL`.
3. Set `SUPABASE_SERVICE_ROLE_KEY` only in the server deployment environment. Never expose it with a `NEXT_PUBLIC_` prefix.
4. Run `supabase/migrations/202608070001_mvp_backend.sql` through the Supabase CLI or SQL editor.
5. In Authentication > URL Configuration, set the Site URL and allow `http://localhost:3000/auth/confirm` plus the production callback URL.
6. Enable Email authentication. Configure SMTP before production use.
7. Confirm that `project-files` and `manufacturer-verification` are private buckets.

The publishable/anon key is expected in the browser and is constrained by RLS. The service role bypasses RLS and is restricted to `server-only` modules.

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

The repository includes an initial hand-maintained `database.types.ts` so the integration compiles before a project is linked. Replace or reconcile it with generated types after every schema migration.
