begin;
create extension if not exists pgcrypto;

create type public.account_role as enum ('customer','manufacturer','admin');
create type public.project_status as enum ('draft','submitted','under_review','matched','closed','rejected');
create type public.manufacturer_application_status as enum ('draft','submitted','under_review','approved','rejected');
create type public.match_status as enum ('invited','viewed','quoted','accepted','declined');
create type public.quote_status as enum ('draft','submitted','accepted','declined','withdrawn');

create table public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  role public.account_role not null default 'customer',
  full_name text, company_name text, phone text,
  created_at timestamptz not null default now(), updated_at timestamptz not null default now()
);
create table public.categories (
  id uuid primary key default gen_random_uuid(), slug text not null unique, name text not null,
  description text, active boolean not null default true, sort_order integer not null default 0,
  created_at timestamptz not null default now()
);
create table public.manufacturer_profiles (
  id uuid primary key default gen_random_uuid(), owner_id uuid not null unique references public.profiles(id) on delete cascade,
  slug text not null unique, business_name text not null, supplier_types text[] not null default '{}',
  business_location jsonb not null default '{}', facility_location jsonb not null default '{}',
  shipping_regions text[] not null default '{}', shipping_states text[] not null default '{}',
  packaging_types text[] not null default '{}', materials text[] not null default '{}', printing_methods text[] not null default '{}',
  finishing_capabilities text[] not null default '{}', filling_capabilities text[] not null default '{}', industries_served text[] not null default '{}',
  assembly_and_kitting boolean not null default false, sample_available boolean not null default false, prototype_available boolean not null default false,
  typical_moq integer check (typical_moq is null or typical_moq > 0), lead_time_days integer check (lead_time_days is null or lead_time_days > 0),
  monthly_capacity integer check (monthly_capacity is null or monthly_capacity > 0),
  us_based_company boolean not null default false, us_manufacturing boolean not null default false, origin_claim text,
  description text, status public.manufacturer_application_status not null default 'draft',
  created_at timestamptz not null default now(), updated_at timestamptz not null default now()
);
create table public.manufacturer_applications (
  id uuid primary key default gen_random_uuid(), owner_id uuid not null references public.profiles(id) on delete cascade,
  manufacturer_profile_id uuid references public.manufacturer_profiles(id) on delete set null,
  status public.manufacturer_application_status not null default 'draft', application_data jsonb not null default '{}',
  submitted_at timestamptz, reviewed_at timestamptz,
  created_at timestamptz not null default now(), updated_at timestamptz not null default now()
);
create table public.projects (
  id uuid primary key default gen_random_uuid(), customer_id uuid not null references public.profiles(id) on delete cascade,
  category_id uuid references public.categories(id) on delete set null, title text not null, description text not null,
  status public.project_status not null default 'draft', technical_details jsonb not null default '{}',
  quantity integer check (quantity is null or quantity > 0), minimum_budget_cents bigint check (minimum_budget_cents is null or minimum_budget_cents >= 0),
  maximum_budget_cents bigint check (maximum_budget_cents is null or maximum_budget_cents >= 0), currency text not null default 'USD' check (currency = 'USD'),
  timeline jsonb not null default '{}', shipping_address jsonb not null default '{}', submitted_at timestamptz,
  created_at timestamptz not null default now(), updated_at timestamptz not null default now(),
  check (minimum_budget_cents is null or maximum_budget_cents is null or minimum_budget_cents <= maximum_budget_cents)
);
create table public.project_files (
  id uuid primary key default gen_random_uuid(), project_id uuid not null references public.projects(id) on delete cascade,
  owner_id uuid not null references public.profiles(id) on delete cascade, storage_path text not null unique,
  file_name text not null, mime_type text, size_bytes bigint check (size_bytes is null or size_bytes >= 0), created_at timestamptz not null default now()
);
create table public.project_matches (
  id uuid primary key default gen_random_uuid(), project_id uuid not null references public.projects(id) on delete cascade,
  manufacturer_profile_id uuid not null references public.manufacturer_profiles(id) on delete cascade,
  status public.match_status not null default 'invited', matched_by uuid references public.profiles(id) on delete set null,
  created_at timestamptz not null default now(), updated_at timestamptz not null default now(), unique(project_id,manufacturer_profile_id)
);
create table public.quotes (
  id uuid primary key default gen_random_uuid(), project_id uuid not null references public.projects(id) on delete cascade,
  manufacturer_profile_id uuid not null references public.manufacturer_profiles(id) on delete cascade,
  submitted_by uuid not null references public.profiles(id) on delete cascade, amount_cents bigint not null check(amount_cents >= 0),
  currency text not null default 'USD' check(currency='USD'), lead_time_days integer check(lead_time_days is null or lead_time_days > 0),
  message text, status public.quote_status not null default 'draft', submitted_at timestamptz,
  created_at timestamptz not null default now(), updated_at timestamptz not null default now()
);
create table public.notifications (
  id uuid primary key default gen_random_uuid(), recipient_id uuid not null references public.profiles(id) on delete cascade,
  type text not null, title text not null, body text not null, data jsonb not null default '{}', read_at timestamptz, created_at timestamptz not null default now()
);
create table public.admin_events (
  id uuid primary key default gen_random_uuid(), actor_id uuid references public.profiles(id) on delete set null,
  event_type text not null, entity_type text not null, entity_id uuid, payload jsonb not null default '{}', created_at timestamptz not null default now()
);

create index projects_customer_id_idx on public.projects(customer_id);
create index project_files_project_id_idx on public.project_files(project_id);
create index project_matches_project_id_idx on public.project_matches(project_id);
create index project_matches_manufacturer_profile_id_idx on public.project_matches(manufacturer_profile_id);
create index quotes_project_id_idx on public.quotes(project_id);
create index notifications_recipient_id_idx on public.notifications(recipient_id);
create index manufacturer_applications_owner_id_idx on public.manufacturer_applications(owner_id);

create function public.set_updated_at() returns trigger language plpgsql set search_path='' as $$ begin new.updated_at=now(); return new; end $$;
create trigger profiles_updated before update on public.profiles for each row execute function public.set_updated_at();
create trigger manufacturer_profiles_updated before update on public.manufacturer_profiles for each row execute function public.set_updated_at();
create trigger manufacturer_applications_updated before update on public.manufacturer_applications for each row execute function public.set_updated_at();
create trigger projects_updated before update on public.projects for each row execute function public.set_updated_at();
create trigger project_matches_updated before update on public.project_matches for each row execute function public.set_updated_at();
create trigger quotes_updated before update on public.quotes for each row execute function public.set_updated_at();

create function public.handle_new_user() returns trigger language plpgsql security definer set search_path='' as $$
begin
  insert into public.profiles(id,role,full_name,company_name)
  values(new.id,case when new.raw_user_meta_data->>'account_type'='manufacturer' then 'manufacturer'::public.account_role else 'customer'::public.account_role end,new.raw_user_meta_data->>'full_name',new.raw_user_meta_data->>'company_name');
  return new;
end $$;
create trigger on_auth_user_created after insert on auth.users for each row execute function public.handle_new_user();

alter table public.profiles enable row level security;
alter table public.manufacturer_profiles enable row level security;
alter table public.manufacturer_applications enable row level security;
alter table public.projects enable row level security;
alter table public.project_files enable row level security;
alter table public.project_matches enable row level security;
alter table public.quotes enable row level security;
alter table public.categories enable row level security;
alter table public.notifications enable row level security;
alter table public.admin_events enable row level security;

grant select on public.categories,public.manufacturer_profiles to anon;
grant select,insert,update,delete on public.profiles,public.manufacturer_profiles,public.manufacturer_applications,public.projects,public.project_files,public.project_matches,public.quotes,public.notifications to authenticated;
grant select on public.categories to authenticated;
revoke all on public.admin_events from anon,authenticated;

create policy profiles_select_own on public.profiles for select to authenticated using ((select auth.uid())=id);
create policy profiles_update_own on public.profiles for update to authenticated using ((select auth.uid())=id) with check ((select auth.uid())=id);
revoke update on public.profiles from authenticated;
grant update(full_name,company_name,phone,updated_at) on public.profiles to authenticated;

create policy categories_public_read on public.categories for select to anon,authenticated using(active);
create policy manufacturer_profiles_public_approved on public.manufacturer_profiles for select to anon,authenticated using(status='approved');
create policy manufacturer_profiles_owner_read on public.manufacturer_profiles for select to authenticated using(owner_id=(select auth.uid()));
create policy manufacturer_profiles_owner_insert on public.manufacturer_profiles for insert to authenticated with check(owner_id=(select auth.uid()) and status='draft');
create policy manufacturer_profiles_owner_update on public.manufacturer_profiles for update to authenticated using(owner_id=(select auth.uid())) with check(owner_id=(select auth.uid()));
revoke update on public.manufacturer_profiles from authenticated;
grant update(business_name,supplier_types,business_location,facility_location,shipping_regions,shipping_states,packaging_types,materials,printing_methods,finishing_capabilities,filling_capabilities,industries_served,assembly_and_kitting,sample_available,prototype_available,typical_moq,lead_time_days,monthly_capacity,us_based_company,us_manufacturing,origin_claim,description,updated_at) on public.manufacturer_profiles to authenticated;

create policy manufacturer_applications_owner_read on public.manufacturer_applications for select to authenticated using(owner_id=(select auth.uid()));
create policy manufacturer_applications_owner_insert on public.manufacturer_applications for insert to authenticated with check(owner_id=(select auth.uid()) and status in ('draft','submitted'));
create policy manufacturer_applications_owner_update on public.manufacturer_applications for update to authenticated using(owner_id=(select auth.uid()) and status in ('draft','submitted')) with check(owner_id=(select auth.uid()) and status in ('draft','submitted'));

create policy projects_customer_read on public.projects for select to authenticated using(customer_id=(select auth.uid()));
create policy projects_matched_manufacturer_read on public.projects for select to authenticated using(exists(select 1 from public.project_matches pm join public.manufacturer_profiles mp on mp.id=pm.manufacturer_profile_id where pm.project_id=projects.id and mp.owner_id=(select auth.uid()) and pm.status in ('invited','viewed','quoted','accepted')));
create policy projects_customer_insert on public.projects for insert to authenticated with check(customer_id=(select auth.uid()) and status in ('draft','submitted'));
create policy projects_customer_update on public.projects for update to authenticated using(customer_id=(select auth.uid()) and status in ('draft','submitted')) with check(customer_id=(select auth.uid()) and status in ('draft','submitted'));
create policy projects_customer_delete_draft on public.projects for delete to authenticated using(customer_id=(select auth.uid()) and status='draft');

create policy project_files_authorized_read on public.project_files for select to authenticated using(owner_id=(select auth.uid()) or exists(select 1 from public.project_matches pm join public.manufacturer_profiles mp on mp.id=pm.manufacturer_profile_id where pm.project_id=project_files.project_id and mp.owner_id=(select auth.uid()) and pm.status in ('invited','viewed','quoted','accepted')));
create policy project_files_owner_insert on public.project_files for insert to authenticated with check(owner_id=(select auth.uid()) and exists(select 1 from public.projects p where p.id=project_id and p.customer_id=(select auth.uid())));
create policy project_files_owner_delete on public.project_files for delete to authenticated using(owner_id=(select auth.uid()));

create policy matches_customer_read on public.project_matches for select to authenticated using(exists(select 1 from public.projects p where p.id=project_id and p.customer_id=(select auth.uid())));
create policy matches_manufacturer_read on public.project_matches for select to authenticated using(exists(select 1 from public.manufacturer_profiles mp where mp.id=manufacturer_profile_id and mp.owner_id=(select auth.uid())));
create policy matches_manufacturer_update on public.project_matches for update to authenticated using(exists(select 1 from public.manufacturer_profiles mp where mp.id=manufacturer_profile_id and mp.owner_id=(select auth.uid()))) with check(exists(select 1 from public.manufacturer_profiles mp where mp.id=manufacturer_profile_id and mp.owner_id=(select auth.uid())));
revoke update on public.project_matches from authenticated;
grant update(status,updated_at) on public.project_matches to authenticated;

create policy quotes_project_customer_read on public.quotes for select to authenticated using(exists(select 1 from public.projects p where p.id=project_id and p.customer_id=(select auth.uid())));
create policy quotes_manufacturer_read on public.quotes for select to authenticated using(submitted_by=(select auth.uid()));
create policy quotes_matched_manufacturer_insert on public.quotes for insert to authenticated with check(submitted_by=(select auth.uid()) and exists(select 1 from public.project_matches pm join public.manufacturer_profiles mp on mp.id=pm.manufacturer_profile_id where pm.project_id=quotes.project_id and pm.manufacturer_profile_id=quotes.manufacturer_profile_id and mp.owner_id=(select auth.uid()) and pm.status in ('invited','viewed','quoted','accepted')));
create policy quotes_manufacturer_update_draft on public.quotes for update to authenticated using(submitted_by=(select auth.uid()) and status='draft') with check(submitted_by=(select auth.uid()) and status in ('draft','submitted','withdrawn'));

create policy notifications_recipient_read on public.notifications for select to authenticated using(recipient_id=(select auth.uid()));
create policy notifications_recipient_update on public.notifications for update to authenticated using(recipient_id=(select auth.uid())) with check(recipient_id=(select auth.uid()));
revoke update on public.notifications from authenticated;
grant update(read_at) on public.notifications to authenticated;
-- admin_events intentionally has no anon/authenticated policies. Service role only.

insert into storage.buckets(id,name,public,file_size_limit,allowed_mime_types) values
('project-files','project-files',false,10485760,array['image/jpeg','image/png','application/pdf']),
('manufacturer-verification','manufacturer-verification',false,10485760,array['image/jpeg','image/png','application/pdf'])
on conflict(id) do update set public=false;

create policy project_storage_owner_insert on storage.objects for insert to authenticated with check(bucket_id='project-files' and (storage.foldername(name))[1]=(select auth.uid())::text);
create policy project_storage_owner_read on storage.objects for select to authenticated using(bucket_id='project-files' and ((storage.foldername(name))[1]=(select auth.uid())::text or exists(select 1 from public.project_files pf join public.project_matches pm on pm.project_id=pf.project_id join public.manufacturer_profiles mp on mp.id=pm.manufacturer_profile_id where pf.storage_path=name and mp.owner_id=(select auth.uid()) and pm.status in ('invited','viewed','quoted','accepted'))));
create policy project_storage_owner_delete on storage.objects for delete to authenticated using(bucket_id='project-files' and (storage.foldername(name))[1]=(select auth.uid())::text);
create policy verification_storage_owner_insert on storage.objects for insert to authenticated with check(bucket_id='manufacturer-verification' and (storage.foldername(name))[1]=(select auth.uid())::text);
create policy verification_storage_owner_read on storage.objects for select to authenticated using(bucket_id='manufacturer-verification' and (storage.foldername(name))[1]=(select auth.uid())::text);
create policy verification_storage_owner_delete on storage.objects for delete to authenticated using(bucket_id='manufacturer-verification' and (storage.foldername(name))[1]=(select auth.uid())::text);

insert into public.categories(slug,name,sort_order) values
('food-beverage','Food & Beverage',10),('beauty-personal-care','Beauty & Personal Care',20),('health-wellness','Health & Wellness',30),('home-household','Home & Household',40),('pet-products','Pet Products',50),('apparel-soft-goods','Apparel & Soft Goods',60),('retail-ecommerce','Retail & E-commerce',70),('other','Other',80)
on conflict(slug) do nothing;
commit;
