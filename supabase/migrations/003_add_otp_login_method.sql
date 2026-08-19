-- 添加 otp 到 login_method 的 CHECK 约束
alter table public.login_events
  drop constraint if exists login_events_login_method_check;

alter table public.login_events
  add constraint login_events_login_method_check
  check (login_method in ('magic_link', 'password', 'otp'));
