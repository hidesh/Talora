-- Apply this migration to projects that already ran 202609250001.
-- Taloras backend reads and updates leads with a Supabase secret key,
-- which maps to Postgres' service_role.
grant select, update on table public.leads to service_role;
