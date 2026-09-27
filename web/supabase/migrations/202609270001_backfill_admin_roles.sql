-- Existing dashboard-created users may predate the automatic role trigger.
-- Public signup must remain disabled while every Auth user is treated as a Talora admin.
update auth.users
set raw_app_meta_data = coalesce(raw_app_meta_data, '{}'::jsonb)
  || jsonb_build_object('role', 'admin')
where coalesce(raw_app_meta_data->>'role', '') <> 'admin';
