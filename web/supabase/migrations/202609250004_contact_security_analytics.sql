create table if not exists public.contact_security_events (
  id uuid primary key default gen_random_uuid(),
  event_type text not null check (event_type in (
    'honeypot',
    'altcha_failed',
    'origin_rejected',
    'oversized',
    'duplicate',
    'replayed',
    'rate_limited'
  )),
  visitor_hash text not null check (visitor_hash ~ '^[a-f0-9]{64}$'),
  is_bot boolean not null default false,
  attempts integer not null default 1 check (attempts > 0),
  event_day date not null default (timezone('utc', now()))::date,
  first_seen timestamptz not null default now(),
  last_seen timestamptz not null default now(),
  unique (event_day, event_type, visitor_hash)
);

create index if not exists contact_security_events_last_seen_idx
  on public.contact_security_events (last_seen desc);
create index if not exists contact_security_events_bot_idx
  on public.contact_security_events (is_bot, last_seen desc);

alter table public.contact_security_events enable row level security;
revoke all on public.contact_security_events from anon, authenticated;
grant select on public.contact_security_events to service_role;

create or replace function public.record_contact_security_event(
  p_event_type text,
  p_visitor_hash text,
  p_is_bot boolean
) returns void
language plpgsql
security definer
set search_path = public, pg_temp
as $$
begin
  if p_event_type not in ('honeypot', 'altcha_failed', 'origin_rejected', 'oversized', 'duplicate', 'replayed', 'rate_limited') then
    raise exception 'unsupported security event';
  end if;
  if p_visitor_hash !~ '^[a-f0-9]{64}$' then
    raise exception 'invalid visitor hash';
  end if;

  insert into public.contact_security_events (event_type, visitor_hash, is_bot)
  values (p_event_type, p_visitor_hash, p_is_bot)
  on conflict (event_day, event_type, visitor_hash)
  do update set
    attempts = public.contact_security_events.attempts + 1,
    last_seen = now(),
    is_bot = public.contact_security_events.is_bot or excluded.is_bot;

  delete from public.contact_security_events
  where event_day < (timezone('utc', now()))::date - 90;
end;
$$;

revoke all on function public.record_contact_security_event(text,text,boolean) from public, anon, authenticated;
grant execute on function public.record_contact_security_event(text,text,boolean) to service_role;

create or replace function public.get_contact_security_overview()
returns jsonb
language sql
stable
security definer
set search_path = public, pg_temp
as $$
  select jsonb_build_object(
    'blocked_total', coalesce(sum(attempts), 0),
    'blocked_24h', coalesce(sum(attempts) filter (where last_seen >= now() - interval '24 hours'), 0),
    'bot_total', coalesce(sum(attempts) filter (where is_bot), 0),
    'unique_visitors', count(distinct visitor_hash),
    'recent', coalesce((
      select jsonb_agg(to_jsonb(recent_event))
      from (
        select event_type, visitor_hash, is_bot, attempts, first_seen, last_seen
        from public.contact_security_events
        order by last_seen desc
        limit 30
      ) recent_event
    ), '[]'::jsonb)
  )
  from public.contact_security_events;
$$;

revoke all on function public.get_contact_security_overview() from public, anon, authenticated;
grant execute on function public.get_contact_security_overview() to service_role;
