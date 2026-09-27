-- Talora has no public account registration. Every Auth user is created manually
-- by a project owner in the Supabase Dashboard and should therefore be an admin.
-- Keep public and anonymous sign-ups disabled while this trigger is installed.

create schema if not exists private;
revoke all on schema private from public, anon, authenticated;

create or replace function private.assign_talora_admin_role()
returns trigger
language plpgsql
security definer
set search_path = auth, private, pg_temp
as $$
begin
  new.raw_app_meta_data := coalesce(new.raw_app_meta_data, '{}'::jsonb)
    || jsonb_build_object('role', 'admin');
  return new;
end;
$$;

revoke all on function private.assign_talora_admin_role() from public, anon, authenticated;

drop trigger if exists talora_assign_admin_role on auth.users;
create trigger talora_assign_admin_role
before insert on auth.users
for each row execute function private.assign_talora_admin_role();
