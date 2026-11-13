-- Sanaa database setup.
-- Run this once in Supabase: SQL Editor > New query > paste > Run.

create extension if not exists pgcrypto;

-- ---------------------------------------------------------------
-- Profiles (one per user)
-- ---------------------------------------------------------------
create table if not exists public.profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  full_name text not null default '',
  role text not null default 'student' check (role in ('student', 'teacher', 'admin')),
  country text,
  bio text,
  created_at timestamptz not null default now()
);

create or replace function public.is_admin()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (select 1 from public.profiles where id = auth.uid() and role = 'admin');
$$;

-- Create a profile automatically when someone signs up.
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
declare
  wanted_role text := coalesce(new.raw_user_meta_data ->> 'role', 'student');
begin
  if wanted_role not in ('student', 'teacher') then
    wanted_role := 'student';
  end if;
  insert into public.profiles (id, full_name, role, country)
  values (
    new.id,
    coalesce(new.raw_user_meta_data ->> 'full_name', ''),
    wanted_role,
    new.raw_user_meta_data ->> 'country'
  );
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- Users may become teachers, but only an admin can make someone an admin.
create or replace function public.guard_profile_role()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  if new.role is distinct from old.role and not public.is_admin() and auth.uid() is not null then
    if not (old.role = 'student' and new.role = 'teacher') then
      raise exception 'Not allowed to change role';
    end if;
  end if;
  return new;
end;
$$;

drop trigger if exists guard_profile_role on public.profiles;
create trigger guard_profile_role
  before update on public.profiles
  for each row execute function public.guard_profile_role();

alter table public.profiles enable row level security;

drop policy if exists "Profiles are public" on public.profiles;
create policy "Profiles are public" on public.profiles for select using (true);

drop policy if exists "Users update own profile" on public.profiles;
create policy "Users update own profile" on public.profiles for update
  using (id = auth.uid()) with check (id = auth.uid());

-- ---------------------------------------------------------------
-- Payout details (private to the teacher and admins)
-- ---------------------------------------------------------------
create table if not exists public.payout_accounts (
  teacher_id uuid primary key references public.profiles (id) on delete cascade,
  method text not null check (method in ('mobile_money', 'bank')),
  country text not null,
  currency text not null,
  provider_code text not null,      -- Flutterwave bank code or mobile money code (e.g. MPS, MTN)
  provider_name text,
  account_number text not null,     -- bank account number or phone number
  account_name text not null,
  updated_at timestamptz not null default now()
);

alter table public.payout_accounts enable row level security;

drop policy if exists "Teacher reads own payout account" on public.payout_accounts;
create policy "Teacher reads own payout account" on public.payout_accounts for select
  using (teacher_id = auth.uid() or public.is_admin());

drop policy if exists "Teacher writes own payout account" on public.payout_accounts;
create policy "Teacher writes own payout account" on public.payout_accounts for insert
  with check (teacher_id = auth.uid());

drop policy if exists "Teacher updates own payout account" on public.payout_accounts;
create policy "Teacher updates own payout account" on public.payout_accounts for update
  using (teacher_id = auth.uid()) with check (teacher_id = auth.uid());

-- ---------------------------------------------------------------
-- Courses and lessons
-- ---------------------------------------------------------------
create table if not exists public.courses (
  id uuid primary key default gen_random_uuid(),
  teacher_id uuid not null references public.profiles (id) on delete cascade,
  slug text not null unique,
  title text not null,
  subtitle text not null default '',
  description text not null default '',
  category text not null check (category in ('fashion', 'hair-beauty', 'dance-music')),
  level text not null default 'beginner' check (level in ('beginner', 'intermediate', 'advanced')),
  price numeric(12, 2) not null default 0 check (price >= 0),
  currency text not null default 'USD',
  thumbnail_url text,
  what_you_learn text[] not null default '{}',
  status text not null default 'draft' check (status in ('draft', 'pending', 'published', 'rejected')),
  rejection_reason text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists courses_status_idx on public.courses (status, category);
create index if not exists courses_teacher_idx on public.courses (teacher_id);

-- Only admins can publish or reject a course.
create or replace function public.guard_course_status()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  new.updated_at := now();
  if auth.uid() is not null and not public.is_admin() then
    if tg_op = 'INSERT' and new.status not in ('draft', 'pending') then
      raise exception 'Only admins can publish courses';
    end if;
    if tg_op = 'UPDATE' and new.status is distinct from old.status
       and new.status not in ('draft', 'pending') then
      raise exception 'Only admins can publish courses';
    end if;
  end if;
  return new;
end;
$$;

drop trigger if exists guard_course_status on public.courses;
create trigger guard_course_status
  before insert or update on public.courses
  for each row execute function public.guard_course_status();

alter table public.courses enable row level security;

drop policy if exists "Published courses are public" on public.courses;
create policy "Published courses are public" on public.courses for select
  using (status = 'published' or teacher_id = auth.uid() or public.is_admin());

drop policy if exists "Teachers create courses" on public.courses;
create policy "Teachers create courses" on public.courses for insert
  with check (
    teacher_id = auth.uid()
    and exists (select 1 from public.profiles where id = auth.uid() and role in ('teacher', 'admin'))
  );

drop policy if exists "Teachers update own courses" on public.courses;
create policy "Teachers update own courses" on public.courses for update
  using (teacher_id = auth.uid() or public.is_admin())
  with check (teacher_id = auth.uid() or public.is_admin());

drop policy if exists "Teachers delete own draft courses" on public.courses;
create policy "Teachers delete own draft courses" on public.courses for delete
  using (teacher_id = auth.uid() and status in ('draft', 'rejected'));

create table if not exists public.lessons (
  id uuid primary key default gen_random_uuid(),
  course_id uuid not null references public.courses (id) on delete cascade,
  title text not null,
  position int not null default 0,
  video_id text,                    -- Bunny Stream video id
  duration_seconds int,
  is_preview boolean not null default false,
  created_at timestamptz not null default now()
);

create index if not exists lessons_course_idx on public.lessons (course_id, position);

alter table public.lessons enable row level security;

drop policy if exists "Lessons follow course visibility" on public.lessons;
create policy "Lessons follow course visibility" on public.lessons for select
  using (exists (
    select 1 from public.courses c
    where c.id = course_id
      and (c.status = 'published' or c.teacher_id = auth.uid() or public.is_admin())
  ));

drop policy if exists "Teachers manage own lessons" on public.lessons;
create policy "Teachers manage own lessons" on public.lessons for all
  using (exists (select 1 from public.courses c where c.id = course_id and c.teacher_id = auth.uid()))
  with check (exists (select 1 from public.courses c where c.id = course_id and c.teacher_id = auth.uid()));

-- ---------------------------------------------------------------
-- Payments and enrollments (written by the server only)
-- ---------------------------------------------------------------
create table if not exists public.payments (
  id uuid primary key default gen_random_uuid(),
  tx_ref text not null unique,
  flw_transaction_id text,
  student_id uuid not null references public.profiles (id) on delete cascade,
  course_id uuid not null references public.courses (id) on delete cascade,
  teacher_id uuid not null references public.profiles (id) on delete cascade,
  amount numeric(14, 2) not null,
  currency text not null,
  usd_rate numeric(18, 6) not null,          -- units of `currency` per 1 USD at time of sale
  amount_usd numeric(12, 2),
  platform_fee_usd numeric(12, 2),
  teacher_earning_usd numeric(12, 2),
  status text not null default 'pending' check (status in ('pending', 'successful', 'failed')),
  created_at timestamptz not null default now(),
  paid_at timestamptz
);

create index if not exists payments_teacher_idx on public.payments (teacher_id, status);

alter table public.payments enable row level security;

drop policy if exists "Read own payments" on public.payments;
create policy "Read own payments" on public.payments for select
  using (student_id = auth.uid() or teacher_id = auth.uid() or public.is_admin());

create table if not exists public.enrollments (
  id uuid primary key default gen_random_uuid(),
  course_id uuid not null references public.courses (id) on delete cascade,
  student_id uuid not null references public.profiles (id) on delete cascade,
  payment_id uuid references public.payments (id),
  created_at timestamptz not null default now(),
  completed_at timestamptz,
  unique (course_id, student_id)
);

alter table public.enrollments enable row level security;

drop policy if exists "Read own enrollments" on public.enrollments;
create policy "Read own enrollments" on public.enrollments for select
  using (
    student_id = auth.uid()
    or public.is_admin()
    or exists (select 1 from public.courses c where c.id = course_id and c.teacher_id = auth.uid())
  );

create table if not exists public.lesson_progress (
  student_id uuid not null references public.profiles (id) on delete cascade,
  lesson_id uuid not null references public.lessons (id) on delete cascade,
  completed_at timestamptz not null default now(),
  primary key (student_id, lesson_id)
);

alter table public.lesson_progress enable row level security;

drop policy if exists "Own progress" on public.lesson_progress;
create policy "Own progress" on public.lesson_progress for all
  using (student_id = auth.uid()) with check (student_id = auth.uid());

-- ---------------------------------------------------------------
-- Reviews
-- ---------------------------------------------------------------
create table if not exists public.reviews (
  id uuid primary key default gen_random_uuid(),
  course_id uuid not null references public.courses (id) on delete cascade,
  student_id uuid not null references public.profiles (id) on delete cascade,
  rating int not null check (rating between 1 and 5),
  comment text not null default '',
  created_at timestamptz not null default now(),
  unique (course_id, student_id)
);

alter table public.reviews enable row level security;

drop policy if exists "Reviews are public" on public.reviews;
create policy "Reviews are public" on public.reviews for select using (true);

drop policy if exists "Enrolled students review" on public.reviews;
create policy "Enrolled students review" on public.reviews for insert
  with check (
    student_id = auth.uid()
    and exists (select 1 from public.enrollments e where e.course_id = reviews.course_id and e.student_id = auth.uid())
  );

drop policy if exists "Students edit own review" on public.reviews;
create policy "Students edit own review" on public.reviews for update
  using (student_id = auth.uid()) with check (student_id = auth.uid());

-- ---------------------------------------------------------------
-- Teacher payouts
-- ---------------------------------------------------------------
create table if not exists public.payouts (
  id uuid primary key default gen_random_uuid(),
  teacher_id uuid not null references public.profiles (id) on delete cascade,
  amount_usd numeric(12, 2) not null,
  amount numeric(14, 2) not null,
  currency text not null,
  reference text not null unique,
  flw_transfer_id text,
  status text not null default 'processing' check (status in ('processing', 'paid', 'failed')),
  note text,
  created_at timestamptz not null default now()
);

alter table public.payouts enable row level security;

drop policy if exists "Read own payouts" on public.payouts;
create policy "Read own payouts" on public.payouts for select
  using (teacher_id = auth.uid() or public.is_admin());

-- ---------------------------------------------------------------
-- Public numbers per course (students, rating, lessons)
-- ---------------------------------------------------------------
create or replace view public.course_stats as
select
  c.id as course_id,
  (select count(*) from public.enrollments e where e.course_id = c.id)::int as student_count,
  (select count(*) from public.lessons l where l.course_id = c.id)::int as lesson_count,
  coalesce((select sum(l.duration_seconds) from public.lessons l where l.course_id = c.id), 0)::int as total_seconds,
  coalesce((select round(avg(r.rating)::numeric, 1) from public.reviews r where r.course_id = c.id), 0)::float as rating_avg,
  (select count(*) from public.reviews r where r.course_id = c.id)::int as rating_count
from public.courses c
where c.status = 'published';

grant select on public.course_stats to anon, authenticated;

-- Teacher balance = 80% of successful sales minus payouts already sent.
create or replace view public.teacher_balances as
select
  p.id as teacher_id,
  coalesce((select sum(teacher_earning_usd) from public.payments pay
            where pay.teacher_id = p.id and pay.status = 'successful'), 0)::numeric(12, 2) as earned_usd,
  coalesce((select sum(amount_usd) from public.payouts po
            where po.teacher_id = p.id and po.status in ('processing', 'paid')), 0)::numeric(12, 2) as paid_out_usd
from public.profiles p
where p.role in ('teacher', 'admin');

revoke all on public.teacher_balances from anon, authenticated;

-- ---------------------------------------------------------------
-- Storage for course thumbnails
-- ---------------------------------------------------------------
insert into storage.buckets (id, name, public)
values ('thumbnails', 'thumbnails', true)
on conflict (id) do nothing;

drop policy if exists "Thumbnails are public" on storage.objects;
create policy "Thumbnails are public" on storage.objects for select
  using (bucket_id = 'thumbnails');

drop policy if exists "Teachers upload own thumbnails" on storage.objects;
create policy "Teachers upload own thumbnails" on storage.objects for insert
  with check (bucket_id = 'thumbnails' and (storage.foldername(name))[1] = auth.uid()::text);

drop policy if exists "Teachers replace own thumbnails" on storage.objects;
create policy "Teachers replace own thumbnails" on storage.objects for update
  using (bucket_id = 'thumbnails' and (storage.foldername(name))[1] = auth.uid()::text);

-- ---------------------------------------------------------------
-- Make yourself an admin (run after you sign up, with your email):
-- update public.profiles set role = 'admin'
-- where id = (select id from auth.users where email = 'you@example.com');
-- ---------------------------------------------------------------
