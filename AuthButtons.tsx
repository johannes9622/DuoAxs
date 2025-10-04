"use client";
import { supabase } from "../../lib/supabase-browser";

export default function AuthButtons() {
  async function signInGoogle() {
    await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: typeof window !== "undefined" ? window.location.origin + "/auth/redirect" : undefined,
      },
    });
  }
  async function signOut() {
    await supabase.auth.signOut();
    window.location.href = "/";
  }
  return (
    <div className="flex gap-2">
      <button onClick={signInGoogle} className="rounded-xl bg-primary px-3 py-1.5 text-sm font-semibold text-background-dark">Sign in</button>
      <button onClick={signOut} className="rounded-xl border border-gray-300 px-3 py-1.5 text-sm dark:border-gray-700">Sign out</button>
    </div>
  );
}
