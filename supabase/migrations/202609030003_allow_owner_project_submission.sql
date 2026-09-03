begin;

-- Root cause of the observed PostgreSQL 42501:
-- 202609030001_auth_rls_hardening.sql revoked table-wide UPDATE and granted
-- authenticated users UPDATE only on mutable columns. customer_id was
-- deliberately excluded, but the application submission UPDATE still put
-- customer_id (and client_draft_id) in its SET payload. PostgreSQL checks
-- column privileges before RLS, so that statement failed with 42501 even
-- though projects_customer_update allowed the owner and draft -> submitted.
--
-- Keep identity columns non-updatable. The application now sends them only
-- on INSERT and sends mutableFields on UPDATE.
revoke update on public.projects from authenticated;
grant update (
  category_id,
  title,
  description,
  status,
  technical_details,
  quantity,
  minimum_budget_cents,
  maximum_budget_cents,
  currency,
  timeline,
  shipping_address,
  submitted_at,
  updated_at
) on public.projects to authenticated;

-- Reassert the owner policy idempotently. USING evaluates the existing row;
-- WITH CHECK evaluates the new row. This allows an authenticated owner to
-- change draft -> submitted while never authorizing another customer's row.
-- It references no project_matches data, so it cannot reintroduce recursive
-- RLS between projects and project_matches.
drop policy if exists projects_customer_update on public.projects;
create policy projects_customer_update
on public.projects
for update
to authenticated
using (
  customer_id = (select auth.uid())
  and status in ('draft', 'submitted')
)
with check (
  customer_id = (select auth.uid())
  and status in ('draft', 'submitted')
);

commit;
