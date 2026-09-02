alter type public.match_status add value if not exists 'interested' after 'viewed';

begin;

alter table public.project_matches add column decline_reason text check (decline_reason is null or char_length(decline_reason) <= 2000);
alter table public.project_matches add column responded_at timestamptz;

alter table public.quotes rename column amount_cents to estimated_unit_price_cents;
alter table public.quotes alter column estimated_unit_price_cents drop not null;
alter table public.quotes add column minimum_unit_price_cents bigint check (minimum_unit_price_cents is null or minimum_unit_price_cents >= 0);
alter table public.quotes add column maximum_unit_price_cents bigint check (maximum_unit_price_cents is null or maximum_unit_price_cents >= 0);
alter table public.quotes add column moq integer check (moq > 0);
alter table public.quotes add column tooling_setup_cost_cents bigint check (tooling_setup_cost_cents is null or tooling_setup_cost_cents >= 0);
alter table public.quotes add column sample_available boolean not null default false;
alter table public.quotes add column sample_cost_cents bigint check (sample_cost_cents is null or sample_cost_cents >= 0);
alter table public.quotes add column production_location jsonb not null default '{}';
alter table public.quotes add column expires_at date;
update public.quotes q set moq=coalesce(p.quantity,1) from public.projects p where p.id=q.project_id and q.moq is null;
update public.quotes set expires_at=coalesce(submitted_at::date,current_date)+30 where expires_at is null;
alter table public.quotes alter column moq set not null;
alter table public.quotes alter column expires_at set not null;
alter table public.quotes add constraint quotes_unit_or_range_check check (
  estimated_unit_price_cents is not null or
  (minimum_unit_price_cents is not null and maximum_unit_price_cents is not null and minimum_unit_price_cents <= maximum_unit_price_cents)
);
create unique index quotes_project_manufacturer_unique on public.quotes(project_id, manufacturer_profile_id);

drop policy if exists projects_matched_manufacturer_read on public.projects;
create policy projects_matched_manufacturer_read on public.projects for select to authenticated using(exists(select 1 from public.project_matches pm join public.manufacturer_profiles mp on mp.id=pm.manufacturer_profile_id where pm.project_id=projects.id and mp.owner_id=(select auth.uid()) and pm.status in ('invited','viewed','interested','quoted')));
drop policy if exists project_files_authorized_read on public.project_files;
create policy project_files_authorized_read on public.project_files for select to authenticated using(owner_id=(select auth.uid()) or exists(select 1 from public.project_matches pm join public.manufacturer_profiles mp on mp.id=pm.manufacturer_profile_id where pm.project_id=project_files.project_id and mp.owner_id=(select auth.uid()) and pm.status in ('invited','viewed','interested','quoted')));
drop policy if exists quotes_matched_manufacturer_insert on public.quotes;
create policy quotes_matched_manufacturer_insert on public.quotes for insert to authenticated with check(submitted_by=(select auth.uid()) and exists(select 1 from public.project_matches pm join public.manufacturer_profiles mp on mp.id=pm.manufacturer_profile_id where pm.project_id=quotes.project_id and pm.manufacturer_profile_id=quotes.manufacturer_profile_id and mp.owner_id=(select auth.uid()) and pm.status in ('invited','viewed','interested','quoted')));
drop policy if exists quotes_manufacturer_update_draft on public.quotes;
create policy quotes_manufacturer_update_own on public.quotes for update to authenticated using(submitted_by=(select auth.uid())) with check(submitted_by=(select auth.uid()) and status in ('draft','submitted','withdrawn'));

revoke update on public.project_matches from authenticated;
grant update(status,decline_reason,responded_at,updated_at) on public.project_matches to authenticated;

commit;
