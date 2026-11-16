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

-- Organizer access to volunteer records is read-only from the dashboard.
grant insert on public.volunteers to anon, authenticated;
grant select on public.volunteers to authenticated;

-- Organizers can mark a participant withdrawn or restore an incorrectly withdrawn record.
grant update (registration_status) on public.participants to authenticated;
drop policy if exists "Active organizers can update registration status" on public.participants;
create policy "Active organizers can update registration status"
  on public.participants for update
  to authenticated
  using (exists (select 1 from public.organizer_profiles op where op.user_id = (select auth.uid()) and op.is_active = true))
  with check (exists (select 1 from public.organizer_profiles op where op.user_id = (select auth.uid()) and op.is_active = true));

-- Public totals exclude withdrawn registrations.
drop function if exists public.get_public_participant_count();
create function public.get_public_participant_count() returns bigint language sql security definer set search_path = ''
as $fn$ select count(*)::bigint from public.participants where registration_status = 'Active'; $fn$;
revoke all on function public.get_public_participant_count() from public;
grant execute on function public.get_public_participant_count() to anon, authenticated;

-- Existing insert/delete broadcasts remain; this trigger refreshes totals on status changes.
create or replace function public.broadcast_participant_count_on_status_change()
returns trigger language plpgsql security definer set search_path = '' as $fn$
begin
  perform realtime.send(jsonb_build_object('event', 'participant_count_updated'), 'participant_count_updated', 'public:participant-count', false);
  return new;
end;
$fn$;
drop trigger if exists participants_broadcast_count_on_status_change on public.participants;
create trigger participants_broadcast_count_on_status_change after update of registration_status on public.participants
for each row when (old.registration_status is distinct from new.registration_status)
execute function public.broadcast_participant_count_on_status_change();


-- Keep participant records; organizers may mark a registration withdrawn.
drop policy if exists "Active organizers can update registration status" on public.participants;
create policy "Active organizers can update registration status"
  on public.participants for update
  to authenticated
  using (
    exists (
      select 1 from public.organizer_profiles op
      where op.user_id = (select auth.uid()) and op.is_active = true
    )
  )
  with check (
    exists (
      select 1 from public.organizer_profiles op
      where op.user_id = (select auth.uid()) and op.is_active = true
    )
  );

grant update (registration_status) on public.participants to authenticated;
grant select on public.volunteers to authenticated;
grant insert on public.volunteers to anon, authenticated;

-- Count only active participants on the public site.
create or replace function public.get_public_participant_count()
returns bigint
language sql
stable
security definer
set search_path = ''
as $$
  select count(*) from public.participants where registration_status = 'Active';
$$;
revoke all on function public.get_public_participant_count() from public;
grant execute on function public.get_public_participant_count() to anon, authenticated;

-- Notify the existing public count listener when a participant withdraws.
create or replace function public.broadcast_participant_count_update()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
begin
  perform realtime.send(
    jsonb_build_object('updated_at', now()),
    'participant_count_updated',
    'public:participant-count',
    true
  );
  return new;
end;
$$;
drop trigger if exists participant_count_status_broadcast on public.participants;
create trigger participant_count_status_broadcast
  after update of registration_status on public.participants
  for each row
  when (old.registration_status is distinct from new.registration_status)
  execute function public.broadcast_participant_count_update();
