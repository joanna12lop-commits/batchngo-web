begin;
alter table public.projects add column client_draft_id text;
alter table public.manufacturer_applications add column client_draft_id text;
create unique index projects_customer_client_draft_unique on public.projects(customer_id,client_draft_id) where client_draft_id is not null;
create unique index manufacturer_applications_owner_client_draft_unique on public.manufacturer_applications(owner_id,client_draft_id) where client_draft_id is not null;
create unique index manufacturer_applications_one_active_per_owner on public.manufacturer_applications(owner_id) where status in ('draft','submitted','under_review');
commit;
