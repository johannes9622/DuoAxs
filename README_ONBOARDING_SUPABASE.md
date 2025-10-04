# Onboarding with Supabase (profiles)

## Table
Create a `profiles` table with RLS enabled:
```sql
create table if not exists profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  goals text[] default '{}',
  onboarded boolean default false
);
alter table profiles enable row level security;
```

## Policies
Allow users to read/write their own row:
```sql
create policy "Read own profile" on profiles
  for select using (auth.uid() = id);

create policy "Upsert own profile" on profiles
  for insert with check (auth.uid() = id);

create policy "Update own profile" on profiles
  for update using (auth.uid() = id);
```

## Environment
Set on both Web & Mobile:
```
NEXT_PUBLIC_SUPABASE_URL=...
NEXT_PUBLIC_SUPABASE_ANON_KEY=...
EXPO_PUBLIC_SUPABASE_URL=...
EXPO_PUBLIC_SUPABASE_ANON_KEY=...
EXPO_PUBLIC_API_BASE=https://your-web-host
```

The API routes authenticate via a **Bearer Supabase access token** and then upsert into `profiles` under RLS.
