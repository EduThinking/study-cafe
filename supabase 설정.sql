-- 스터디카페 Supabase 설정
-- Supabase 대시보드 > SQL Editor 에 전체를 붙여 넣고 Run 을 한 번 누르면 됩니다.
-- (여러 번 실행해도 기존 기록은 지워지지 않습니다.)

create extension if not exists pgcrypto with schema extensions;

-- 1) 참가자와 공부 기록 테이블
create table if not exists public.cafe_users (
  uid text primary key,                      -- 닉네임 + 번호 4자리로 만든 식별값 (번호 자체는 저장하지 않음)
  nick text not null,
  look jsonb not null default '{}'::jsonb,   -- 캐릭터 모양
  created_at timestamptz not null default now()
);

create table if not exists public.cafe_sessions (
  id bigint generated always as identity primary key,
  uid text not null references public.cafe_users(uid) on delete cascade,
  ms bigint not null check (ms >= 0 and ms <= 86400000),   -- 공부 시간(밀리초), 최대 24시간
  ended_at timestamptz not null default now()
);
create index if not exists cafe_sessions_uid_idx on public.cafe_sessions (uid, ended_at desc);

-- 테이블은 외부에서 직접 읽거나 쓸 수 없게 잠그고, 아래 함수로만 접근합니다.
alter table public.cafe_users enable row level security;
alter table public.cafe_sessions enable row level security;

-- 2) 내부용 함수
create or replace function public.cafe_uid(p_nick text, p_pin text)
returns text language sql immutable
set search_path = public, extensions as $$
  select encode(digest(p_nick || ':' || p_pin, 'sha256'), 'hex')
$$;

create or replace function public.cafe_record(p_uid text)
returns jsonb language sql stable security definer
set search_path = public as $$
  select jsonb_build_object(
    'look', u.look,
    'total', coalesce((select sum(s.ms) from cafe_sessions s where s.uid = u.uid), 0),
    'sessions', coalesce((
      select jsonb_agg(jsonb_build_object('t', (extract(epoch from x.ended_at) * 1000)::bigint, 'ms', x.ms) order by x.ended_at)
      from (select ended_at, ms from cafe_sessions s where s.uid = u.uid order by ended_at desc limit 200) x
    ), '[]'::jsonb)
  )
  from cafe_users u where u.uid = p_uid
$$;

-- 3) 앱이 부르는 함수
-- 입장 화면에서 기존 기록이 있는지 확인
create or replace function public.cafe_lookup(p_nick text, p_pin text)
returns jsonb language sql stable security definer
set search_path = public, extensions as $$
  select cafe_record(cafe_uid(p_nick, p_pin))
$$;

-- 입장: 처음이면 만들고, 다시 오면 캐릭터만 갱신
create or replace function public.cafe_enter(p_nick text, p_pin text, p_look jsonb)
returns jsonb language plpgsql security definer
set search_path = public, extensions as $$
declare v_uid text;
begin
  if char_length(p_nick) not between 1 and 10 or p_pin !~ '^[0-9]{4}$' then
    raise exception 'invalid input';
  end if;
  v_uid := cafe_uid(p_nick, p_pin);
  insert into cafe_users (uid, nick, look) values (v_uid, p_nick, coalesce(p_look, '{}'::jsonb))
  on conflict (uid) do update set look = coalesce(p_look, cafe_users.look);
  return cafe_record(v_uid);
end $$;

-- 퇴장: 이번 공부 시간 저장
create or replace function public.cafe_leave(p_nick text, p_pin text, p_ms bigint)
returns jsonb language plpgsql security definer
set search_path = public, extensions as $$
declare v_uid text;
begin
  v_uid := cafe_uid(p_nick, p_pin);
  if not exists (select 1 from cafe_users where uid = v_uid) then
    raise exception 'unknown user';
  end if;
  if p_ms >= 1000 then
    insert into cafe_sessions (uid, ms) values (v_uid, least(p_ms, 86400000));
  end if;
  return cafe_record(v_uid);
end $$;

revoke all on function public.cafe_uid(text, text) from public, anon, authenticated;
revoke all on function public.cafe_record(text) from public, anon, authenticated;
grant execute on function public.cafe_lookup(text, text) to anon, authenticated;
grant execute on function public.cafe_enter(text, text, jsonb) to anon, authenticated;
grant execute on function public.cafe_leave(text, text, bigint) to anon, authenticated;

-- 4) 채팅 파일 공유용 저장소 (파일 하나당 최대 10MB)
insert into storage.buckets (id, name, public, file_size_limit)
values ('cafe-files', 'cafe-files', true, 10485760)
on conflict (id) do nothing;

drop policy if exists "cafe files upload" on storage.objects;
create policy "cafe files upload" on storage.objects
  for insert to anon, authenticated
  with check (bucket_id = 'cafe-files');
