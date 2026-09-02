begin;

create table public.admin_notes (
  id uuid primary key default gen_random_uuid(),
  entity_type text not null check (entity_type in ('project','manufacturer_application')),
  entity_id uuid not null,
  note text not null check (char_length(note) between 1 and 10000),
  created_by uuid references public.profiles(id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique(entity_type, entity_id)
);

create index projects_admin_queue_idx on public.projects(status, submitted_at desc);
create index manufacturer_applications_admin_queue_idx on public.manufacturer_applications(status, submitted_at desc);
create index admin_events_entity_idx on public.admin_events(entity_type, entity_id, created_at desc);

create trigger admin_notes_updated before update on public.admin_notes
for each row execute function public.set_updated_at();

alter table public.admin_notes enable row level security;
revoke all on public.admin_notes from anon, authenticated;
-- No user-facing policies: admin notes are accessed only through verified server-side service-role operations.

commit;
