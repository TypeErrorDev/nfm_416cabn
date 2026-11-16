-- Volunteer registration and participant self-service
-- Apply this migration in the Supabase SQL Editor before deploying the matching app changes.

alter table public.participants
  add column if not exists registration_code_hash text,
  add column if not exists registration_status text not null default 'Active';

alter table public.participants
  drop constraint if exists participants_registration_status_check;

alter table public.participants
  add constraint participants_registration_status_check
  check (registration_status in ('Active', 'Withdrawn'));

create unique index if not exists participants_registration_code_hash_uidx
  on public.participants (registration_code_hash)
  where registration_code_hash is not null;

create table if not exists public.volunteers (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  full_name text not null check (length(trim(full_name)) between 1 and 160),
  email text not null check (length(trim(email)) between 3 and 254),
  assignment text not null check (assignment in (
    'Water / First Aid Station 1',
    'Water / First Aid Station 2',
    'Water / First Aid Station 3',
    'Start / Registration',
    'Turnaround',
    'Finish Line'
  )),
  emergency_contact_name text not null check (length(trim(emergency_contact_name)) between 1 and 160),
  emergency_contact_relationship text not null check (length(trim(emergency_contact_relationship)) between 1 and 80),
  emergency_contact_phone text not null check (
    length(trim(emergency_contact_phone)) between 7 and 30
    and length(regexp_replace(emergency_contact_phone, '[^0-9]', '', 'g')) >= 7
  )
);

create index if not exists volunteers_created_at_idx
  on public.volunteers (created_at desc);

create index if not exists volunteers_assignment_idx
  on public.volunteers (assignment);

alter table public.volunteers enable row level security;

drop policy if exists "Public can register volunteers" on public.volunteers;
create policy "Public can register volunteers"
  on public.volunteers for insert
  to anon, authenticated
  with check (true);

drop policy if exists "Active organizers can read volunteers" on public.volunteers;
create policy "Active organizers can read volunteers"
  on public.volunteers for select
  to authenticated
  using (
    exists (
      select 1
      from public.organizer_profiles op
      where op.user_id = (select auth.uid())
        and op.is_active = true
    )
  );

-- Public callers can only invoke this narrow operation. The code is a
-- high-entropy random token generated server-side; only its SHA-256 hash is stored.
create or replace function public.manage_participant_registration(
  p_email text,
  p_code_hash text,
  p_action text
)
returns boolean
language plpgsql
security definer
set search_path = ''
as $$
declare
  affected integer;
begin
  if p_email is null
    or length(p_email) > 254
    or p_code_hash is null
    or p_code_hash !~ '^[a-f0-9]{64}$'
    or p_action not in ('withdraw', 'non_timed')
  then
    return false;
  end if;

  if p_action = 'withdraw' then
    update public.participants
      set registration_status = 'Withdrawn'
      where lower(email) = lower(trim(p_email))
        and registration_code_hash = p_code_hash
        and registration_status = 'Active';
  elsif p_action = 'non_timed' then
    update public.participants
      set participating_for_time = false
      where lower(email) = lower(trim(p_email))
        and registration_code_hash = p_code_hash
        and registration_status = 'Active'
        and participating_for_time = true;
  end if;

  get diagnostics affected = row_count;
  return affected = 1;
end;
$$;

revoke all on function public.manage_participant_registration(text, text, text) from public;
grant execute on function public.manage_participant_registration(text, text, text) to anon, authenticated;

-- Registration codes are never readable through the public client.
revoke select, update, delete on public.volunteers from anon;
