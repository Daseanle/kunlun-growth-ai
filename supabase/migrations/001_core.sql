-- 昆仑增长AI实战：P0 数据模型。执行前请在 Supabase Dashboard / SQL Editor 中确认 Data API 暴露设置。
create extension if not exists "pgcrypto";

create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  display_name text check (char_length(display_name) between 1 and 80),
  bio text check (char_length(bio) <= 500),
  locale text default 'zh-CN',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.learning_progress (
  user_id uuid not null references auth.users(id) on delete cascade,
  tutorial_slug text not null,
  completed_steps jsonb not null default '[]'::jsonb,
  updated_at timestamptz not null default now(),
  primary key (user_id, tutorial_slug),
  check (jsonb_typeof(completed_steps) = 'array')
);

create table if not exists public.submissions (
  id uuid primary key default gen_random_uuid(),
  owner_id uuid not null references auth.users(id) on delete cascade,
  kind text not null check (kind in ('work', 'project', 'resource')),
  title text not null check (char_length(title) between 3 and 140),
  summary text not null check (char_length(summary) between 20 and 1600),
  public_url text not null check (public_url ~ '^https?://'),
  source_url text,
  visibility text not null default 'public' check (visibility in ('public', 'private')),
  status text not null default 'pending' check (status in ('pending', 'approved', 'changes_requested', 'hidden')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.contact_requests (
  id uuid primary key default gen_random_uuid(),
  owner_id uuid not null references auth.users(id) on delete cascade,
  requester_type text not null check (requester_type in ('business', 'project', 'institution', 'investor', 'tool_vendor')),
  organization_name text not null check (char_length(organization_name) between 2 and 160),
  region text,
  request_text text not null check (char_length(request_text) between 20 and 2000),
  status text not null default 'pending' check (status in ('pending', 'reviewing', 'matched', 'closed')),
  created_at timestamptz not null default now()
);

alter table public.profiles enable row level security;
alter table public.learning_progress enable row level security;
alter table public.submissions enable row level security;
alter table public.contact_requests enable row level security;

grant select on public.profiles to anon, authenticated;
grant select, insert, update, delete on public.learning_progress to authenticated;
grant select on public.submissions to anon, authenticated;
grant insert, update, delete on public.submissions to authenticated;
grant insert, select on public.contact_requests to authenticated;

create policy "profiles are public" on public.profiles for select using (true);
create policy "users create own profile" on public.profiles for insert to authenticated with check ((select auth.uid()) = id);
create policy "users update own profile" on public.profiles for update to authenticated using ((select auth.uid()) = id) with check ((select auth.uid()) = id);

create policy "users view own progress" on public.learning_progress for select to authenticated using ((select auth.uid()) = user_id);
create policy "users create own progress" on public.learning_progress for insert to authenticated with check ((select auth.uid()) = user_id);
create policy "users update own progress" on public.learning_progress for update to authenticated using ((select auth.uid()) = user_id) with check ((select auth.uid()) = user_id);
create policy "users delete own progress" on public.learning_progress for delete to authenticated using ((select auth.uid()) = user_id);

create policy "approved public submissions are readable" on public.submissions for select using (status = 'approved' and visibility = 'public' or (select auth.uid()) = owner_id);
create policy "users create own submissions" on public.submissions for insert to authenticated with check ((select auth.uid()) = owner_id);
create policy "users update own submissions" on public.submissions for update to authenticated using ((select auth.uid()) = owner_id) with check ((select auth.uid()) = owner_id);
create policy "users delete own submissions" on public.submissions for delete to authenticated using ((select auth.uid()) = owner_id);

create policy "users view own contact requests" on public.contact_requests for select to authenticated using ((select auth.uid()) = owner_id);
create policy "users create own contact requests" on public.contact_requests for insert to authenticated with check ((select auth.uid()) = owner_id);
