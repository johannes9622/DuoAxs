# Expo Mobile Auth with Supabase (Google & Apple)

This implementation uses `@supabase/supabase-js` directly on Expo with PKCE.

## Redirect configuration
- We rely on Expo AuthSession proxy, so no native URL scheme is required during development.
- In production, configure a custom scheme in `app.json` and set `redirectTo` accordingly.

## Flow
1. `supabase.auth.signInWithOAuth({ provider: 'google' | 'apple', options: { redirectTo } })` opens the browser.
2. After login, Supabase redirects back to your `redirectTo`.
3. `supabase.auth.onAuthStateChange` fires with a valid session; we read `session.access_token`.
4. Push goals to `/api/onboarding/goals` (Bearer token) and call `/api/onboarding/complete`.
5. Navigate to the main app.

## Env
```
EXPO_PUBLIC_SUPABASE_URL=...
EXPO_PUBLIC_SUPABASE_ANON_KEY=...
EXPO_PUBLIC_API_BASE=https://your-web-host
```

> For persistent sessions on mobile, add a storage adapter (e.g., `@react-native-async-storage/async-storage`) to Supabase client options and set `persistSession: true`.
