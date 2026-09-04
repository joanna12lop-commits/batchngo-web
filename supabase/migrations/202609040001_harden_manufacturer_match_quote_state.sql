begin;

-- Keep assigned projects visible throughout every existing match state while
-- avoiding the projects <-> project_matches policy recursion fixed previously.
drop policy if exists projects_matched_manufacturer_read on public.projects;
create policy projects_matched_manufacturer_read
on public.projects for select to authenticated
using (
  exists (
    select 1
    from public.project_matches pm
    join public.manufacturer_profiles mp on mp.id = pm.manufacturer_profile_id
    where pm.project_id = projects.id
      and mp.owner_id = (select auth.uid())
      and pm.status in ('invited', 'viewed', 'interested', 'declined', 'quoted', 'accepted')
  )
);

-- The policy enforces ownership and the set of manufacturer-writable target
-- states. The trigger below enforces the precise old -> new transition.
drop policy if exists matches_manufacturer_update on public.project_matches;
create policy matches_manufacturer_update
on public.project_matches for update to authenticated
using (
  exists (
    select 1
    from public.manufacturer_profiles mp
    where mp.id = manufacturer_profile_id
      and mp.owner_id = (select auth.uid())
  )
)
with check (
  status in ('viewed', 'interested', 'declined', 'quoted')
  and exists (
    select 1
    from public.manufacturer_profiles mp
    where mp.id = manufacturer_profile_id
      and mp.owner_id = (select auth.uid())
  )
);

create or replace function public.enforce_manufacturer_match_transition()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
declare
  acting_user uuid := auth.uid();
  manufacturer_owned boolean;
  submitted_quote_exists boolean;
begin
  if acting_user is null then
    return new;
  end if;

  select exists (
    select 1
    from public.manufacturer_profiles mp
    where mp.id = old.manufacturer_profile_id
      and mp.owner_id = acting_user
  ) into manufacturer_owned;

  -- Customer/admin operations are governed separately. This trigger only
  -- constrains the manufacturer that owns this particular match.
  if not manufacturer_owned then
    return new;
  end if;

  if (old.status = 'invited' and new.status in ('viewed', 'interested', 'declined'))
    or (old.status = 'viewed' and new.status in ('interested', 'declined'))
    or (old.status = 'interested' and new.status = 'declined') then
    return new;
  end if;

  -- `quoted` is derived only after this manufacturer has successfully created
  -- a submitted quote for the same match. A quoted -> quoted update keeps the
  -- existing quote-edit endpoint idempotent.
  if new.status = 'quoted' and old.status in ('invited', 'viewed', 'interested', 'quoted') then
    select exists (
      select 1
      from public.quotes q
      where q.project_id = old.project_id
        and q.manufacturer_profile_id = old.manufacturer_profile_id
        and q.submitted_by = acting_user
        and q.status = 'submitted'
    ) into submitted_quote_exists;

    if submitted_quote_exists then
      return new;
    end if;
  end if;

  raise exception 'Manufacturer match transition from % to % is not allowed', old.status, new.status
    using errcode = '42501';
end;
$$;

revoke all on function public.enforce_manufacturer_match_transition() from public;

drop trigger if exists enforce_manufacturer_match_transition on public.project_matches;
create trigger enforce_manufacturer_match_transition
before update of status on public.project_matches
for each row execute function public.enforce_manufacturer_match_transition();

-- A manufacturer may create a quote only for its own assigned project, and a
-- newly created row may not claim a customer/admin-controlled terminal status.
drop policy if exists quotes_matched_manufacturer_insert on public.quotes;
create policy quotes_matched_manufacturer_insert
on public.quotes for insert to authenticated
with check (
  submitted_by = (select auth.uid())
  and status in ('draft', 'submitted')
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
