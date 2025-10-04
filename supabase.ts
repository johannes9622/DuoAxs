import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY!;

// Note: For Expo/React Native, storage is in-memory by default. If you use secure storage,
// wire a storage adapter for persisted sessions.
export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    // Adjust as needed; PKCE is used by default with signInWithOAuth on native.
    flowType: "pkce",
    detectSessionInUrl: true,
    autoRefreshToken: true,
    persistSession: false, // set true when you add a storage adapter
  },
});
