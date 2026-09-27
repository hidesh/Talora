create extension if not exists pgcrypto;

create table if not exists public.leads (
  id uuid primary key default gen_random_uuid(),
  first_name text not null check (char_length(first_name) between 1 and 80),
  last_name text not null check (char_length(last_name) between 1 and 80),
  email text not null check (char_length(email) between 3 and 254),
  phone text not null check (char_length(phone) between 6 and 30),
  company text not null check (char_length(company) between 1 and 120),
  services text not null check (char_length(services) between 3 and 1200),
  message text,
  status text not null default 'new' check (status in ('new', 'in_progress', 'handled', 'archived')),
  saved boolean not null default false,
  handled_at timestamptz,
  deleted_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.contact_admissions (
  challenge text primary key,
  sender_hash text not null,
  ip_hash text not null,
  message_hash text not null,
  created_at timestamptz not null default now()
);

create index if not exists leads_created_at_idx on public.leads (created_at desc);
create index if not exists leads_status_idx on public.leads (status, deleted_at);
create index if not exists contact_admissions_sender_idx on public.contact_admissions (sender_hash, created_at);
create index if not exists contact_admissions_ip_idx on public.contact_admissions (ip_hash, created_at);
create index if not exists contact_admissions_message_idx on public.contact_admissions (message_hash, created_at);

alter table public.leads enable row level security;
alter table public.contact_admissions enable row level security;
revoke all on public.leads from anon, authenticated;
revoke all on public.contact_admissions from anon, authenticated;
grant select, update on public.leads to service_role;

drop policy if exists admin_leads_access on public.leads;
create policy admin_leads_access on public.leads for all to authenticated
using ((auth.jwt()->'app_metadata'->>'role') = 'admin')
with check ((auth.jwt()->'app_metadata'->>'role') = 'admin');

create or replace function public.set_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists leads_set_updated_at on public.leads;
create trigger leads_set_updated_at before update on public.leads
for each row execute function public.set_updated_at();

create or replace function public.submit_talora_lead(
  p_challenge text,
  p_sender_hash text,
  p_ip_hash text,
  p_message_hash text,
  p_first_name text,
  p_last_name text,
  p_email text,
  p_phone text,
  p_company text,
  p_services text,
  p_message text
) returns jsonb
language plpgsql
security definer
set search_path = public, pg_temp
as $$
declare
  lead_id uuid;
  lock_key bigint;
  retry_seconds integer;
begin
  if p_challenge is null or p_sender_hash is null or p_ip_hash is null or p_message_hash is null then
    raise exception 'missing security values';
  end if;

  for lock_key in
    select value from unnest(array[
      hashtextextended(p_sender_hash, 0),
      hashtextextended(p_ip_hash, 0),
      hashtextextended(p_message_hash, 0)
    ]) as value order by value
  loop
    perform pg_advisory_xact_lock(lock_key);
  end loop;

  delete from public.contact_admissions where created_at < now() - interval '24 hours';

  if exists (select 1 from public.contact_admissions where challenge = p_challenge) then
    return jsonb_build_object('status', 'replayed');
  end if;
  if exists (select 1 from public.contact_admissions where message_hash = p_message_hash) then
    return jsonb_build_object('status', 'duplicate');
  end if;
  if (select count(*) from public.contact_admissions where sender_hash = p_sender_hash and created_at > now() - interval '15 minutes') >= 3 then
    return jsonb_build_object('status', 'rate_limited', 'retry_after', 900);
  end if;
  if (select count(*) from public.contact_admissions where ip_hash = p_ip_hash and created_at > now() - interval '15 minutes') >= 5 then
    return jsonb_build_object('status', 'rate_limited', 'retry_after', 900);
  end if;
  if (select count(*) from public.contact_admissions where ip_hash = p_ip_hash) >= 20 then
    select greatest(1, extract(epoch from (min(created_at) + interval '24 hours' - now()))::integer)
      into retry_seconds from public.contact_admissions where ip_hash = p_ip_hash;
    return jsonb_build_object('status', 'rate_limited', 'retry_after', retry_seconds);
  end if;

  insert into public.leads (first_name, last_name, email, phone, company, services, message)
  values (p_first_name, p_last_name, p_email, p_phone, p_company, p_services, nullif(p_message, ''))
  returning id into lead_id;

  insert into public.contact_admissions (challenge, sender_hash, ip_hash, message_hash)
  values (p_challenge, p_sender_hash, p_ip_hash, p_message_hash);

  return jsonb_build_object('status', 'accepted', 'id', lead_id);
end;
$$;

revoke all on function public.submit_talora_lead(text,text,text,text,text,text,text,text,text,text,text) from public, anon, authenticated;
grant execute on function public.submit_talora_lead(text,text,text,text,text,text,text,text,text,text,text) to service_role;
