# DuoAxs Onboarding – Goals + Completion

## Web
- **Step 1** now collects goals with Zod validation and saves to `/api/onboarding/goals`.
- **Step 3** uses Supabase OAuth; the OAuth redirect should target `/onboarding/complete`.
- **/onboarding/complete** calls `/api/onboarding/complete` to set `onboarded=true` and redirects to `/`.

### Prisma schema expectation
`User { id String @id; goals String[] @default([]); onboarded Boolean @default(false) }`
API handlers are try/catch wrapped so your app won’t break if the schema differs—adjust as needed.

## Mobile
- **Step 3** launches Supabase OAuth in a web session, then hits `/api/onboarding/complete` and navigates to Main.
- Set env:
```
EXPO_PUBLIC_SUPABASE_URL=...
EXPO_PUBLIC_SUPABASE_ANON_KEY=...
EXPO_PUBLIC_API_BASE=https://your-web-host
```
