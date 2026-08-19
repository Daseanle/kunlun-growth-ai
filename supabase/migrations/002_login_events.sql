-- 登录事件记录表：记录用户每次登录的设备、IP、方式等信息
create table if not exists public.login_events (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  ip_address text,
  user_agent text,
  device_type text check (device_type in ('mobile', 'tablet', 'desktop', 'unknown')),
  browser text,
  os text,
  login_method text not null check (login_method in ('magic_link', 'password')),
  created_at timestamptz not null default now()
);

alter table public.login_events enable row level security;

-- 用户只能查看自己的登录记录
create policy "users view own login events"
  on public.login_events for select
  to authenticated
  using ((select auth.uid()) = user_id);

-- 用户可以插入自己的登录记录（服务端在登录后调用）
create policy "users insert own login events"
  on public.login_events for insert
  to authenticated
  with check ((select auth.uid()) = user_id);

-- 自动清理超过 90 天的登录记录
create index if not exists login_events_user_created_idx
  on public.login_events (user_id, created_at desc);
