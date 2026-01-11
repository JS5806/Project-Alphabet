#!/bin/bash

# [Database & Infra Team Lead]
# 이 스크립트는 Supabase DB 스키마 마이그레이션 파일과 GitHub Actions CI/CD 워크플로우 파일을 생성합니다.
# 프로젝트 루트 디렉토리에서 실행하십시오.

# 1. 디렉토리 구조 생성
mkdir -p supabase/migrations
mkdir -p .github/workflows

# 2. Supabase SQL 초기화 스크립트 작성 (DB 모델링, 인증, RLS, Realtime 설정)
cat > supabase/migrations/20240101000000_init_schema.sql << 'EOF'
-- [확장 모듈 활성화]
create extension if not exists "uuid-ossp";

-- [1. 테이블 설계: 정규화된 스키마]

-- 1-1. 카테고리 테이블
create table public.categories (
    id uuid primary key default uuid_generate_v4(),
    name text not null,
    created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 1-2. 식당 정보 테이블
create table public.restaurants (
    id uuid primary key default uuid_generate_v4(),
    category_id uuid references public.categories(id) on delete set null,
    name text not null,
    description text,
    image_url text,
    created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 1-3. 투표 로그 테이블 (누가, 언제, 어디에 투표했는지)
create table public.votes (
    id uuid primary key default uuid_generate_v4(),
    user_id uuid references auth.users(id) not null, -- Supabase Auth 연동
    restaurant_id uuid references public.restaurants(id) on delete cascade not null,
    voted_at timestamp with time zone default timezone('utc'::text, now()) not null,
    
    -- 한 유저가 같은 식당에 중복 투표 방지 (필요 시 당일 중복 방지 등으로 로직 변경 가능)
    unique(user_id, restaurant_id) 
);

-- [2. 인증 및 보안: RLS 및 도메인 제한]

-- 2-1. RLS 활성화
alter table public.categories enable row level security;
alter table public.restaurants enable row level security;
alter table public.votes enable row level security;

-- 2-2. 접근 정책 (Policies)
-- 카테고리/식당: 모든 인증된 사용자는 조회 가능 (Insert/Update는 Admin만 가능하도록 별도 설정 필요하지만 여기선 생략)
create policy "Allow read access for authenticated users" on public.categories for select to authenticated using (true);
create policy "Allow read access for authenticated users" on public.restaurants for select to authenticated using (true);

-- 투표: 본인의 투표 내역만 Insert 가능, 조회는 실시간 집계를 위해 전체 허용
create policy "Allow insert for own vote" on public.votes for insert to authenticated with check (auth.uid() = user_id);
create policy "Allow read access for all votes" on public.votes for select to authenticated using (true);

-- 2-3. 사내 이메일 도메인 제한 트리거 (Auth Hook)
-- auth.users 테이블에 insert 발생 시 실행되는 함수
create or replace function public.check_email_domain()
returns trigger as $$
begin
  -- 'mycompany.com' 도메인이 아니면 에러 발생
  if split_part(new.email, '@', 2) != 'mycompany.com' then
    raise exception 'Invalid email domain. Only mycompany.com is allowed.';
  end if;
  return new;
end;
$$ language plpgsql security definer;

-- Trigger 등록 (Supabase 대시보드에서 Auth Trigger 설정이 필요할 수 있으나 SQL로 정의)
-- 주의: Supabase hosted 환경에서는 auth 스키마에 대한 직접 트리거 생성이 제한될 수 있음. 
-- 이 경우 Supabase Edge Function을 활용한 Auth Hook 구성을 권장하나, 여기선 DB단 로직으로 명시.
drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  before insert on auth.users
  for each row execute procedure public.check_email_domain();

-- [3. 실시간 기능: Supabase Realtime]
-- 클라이언트가 투표 현황을 즉시 구독할 수 있도록 Publication에 테이블 추가
alter publication supabase_realtime add table public.votes;

-- [4. 샘플 데이터 (옵션)]
insert into public.categories (name) values ('한식'), ('중식'), ('일식'), ('양식');

EOF

# 3. GitHub Actions CI/CD 설정 작성 (Vercel 자동 배포)
cat > .github/workflows/deploy.yml << 'EOF'
name: Vercel Production Deployment

on:
  push:
    branches:
      - main
  workflow_dispatch:

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3

      # Vercel CLI를 사용한 프로덕션 배포
      # 사전에 VERCEL_TOKEN, VERCEL_ORG_ID, VERCEL_PROJECT_ID를 GitHub Secrets에 등록해야 함
      - name: Deploy to Vercel
        uses: amondnet/vercel-action@v25
        with:
          vercel-token: ${{ secrets.VERCEL_TOKEN }}
          vercel-org-id: ${{ secrets.VERCEL_ORG_ID }}
          vercel-project-id: ${{ secrets.VERCEL_PROJECT_ID }}
          vercel-args: '--prod' # 프로덕션 환경으로 배포
          working-directory: ./
EOF

# 4. 실행 권한 부여 및 완료 메시지
chmod +x supabase/migrations/20240101000000_init_schema.sql
echo "Infrastructure setup files generated."
echo "1. supabase/migrations/20240101000000_init_schema.sql created."
echo "2. .github/workflows/deploy.yml created."
