begin;

-- Owners may create an application only for their own manufacturer profile.
drop policy if exists manufacturer_applications_owner_insert on public.manufacturer_applications;
create policy manufacturer_applications_owner_insert
on public.manufacturer_applications for insert to authenticated
with check (
  owner_id = (select auth.uid())
  and status in ('draft', 'submitted')
  and (
    manufacturer_profile_id is null
    or exists (
      select 1 from public.manufacturer_profiles mp
      where mp.id = manufacturer_profile_id and mp.owner_id = (select auth.uid())
    )
  )
);

-- Prevent ownership and review fields from being reassigned through the client API.
revoke update on public.manufacturer_applications from authenticated;
grant update(application_data, status, submitted_at, updated_at)
on public.manufacturer_applications to authenticated;

revoke update on public.projects from authenticated;
grant update(category_id, title, description, status, technical_details, quantity,
  minimum_budget_cents, maximum_budget_cents, currency, timeline, shipping_address,
  submitted_at, client_draft_id, updated_at)
on public.projects to authenticated;

-- A manufacturer may edit quote fields, never quote ownership or relationships.
revoke update on public.quotes from authenticated;
grant update(estimated_unit_price_cents, minimum_unit_price_cents,
  maximum_unit_price_cents, moq, tooling_setup_cost_cents, sample_available,
  sample_cost_cents, lead_time_days, production_location, message, expires_at,
  status, submitted_at, updated_at)
on public.quotes to authenticated;

drop policy if exists quotes_manufacturer_update_own on public.quotes;
create policy quotes_manufacturer_update_own
on public.quotes for update to authenticated
using (submitted_by = (select auth.uid()))
with check (
  submitted_by = (select auth.uid())
  and status in ('draft', 'submitted', 'withdrawn')
  and exists (
    select 1
    from public.project_matches pm
    join public.manufacturer_profiles mp on mp.id = pm.manufacturer_profile_id
    where pm.project_id = quotes.project_id
      and pm.manufacturer_profile_id = quotes.manufacturer_profile_id
      and mp.owner_id = (select auth.uid())
      and pm.status in ('invited', 'viewed', 'interested', 'quoted')
  )
);

commit;
