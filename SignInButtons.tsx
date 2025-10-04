"use client";
import { supabase } from "@/lib/supabase-browser";
import { useState } from "react";
import { Button } from "@/components/ds/Button";

export default function SignInButtons() {
  const [loading, setLoading] = useState<string | null>(null);

  async function sign(provider: "google" | "apple") {
    try {
      setLoading(provider);
      const redirectTo = typeof window !== "undefined" ? window.location.origin + "/onboarding/complete" : undefined;
      const { error } = await supabase.auth.signInWithOAuth({ provider, options: { redirectTo } });
      if (error) throw error;
    } catch (e) {
      console.error(e);
      setLoading(null);
      alert("Sign-in failed");
    }
  }

  return (
    <div className="grid gap-3">
      <Button onClick={()=>sign("google")} intent="primary" size="lg">
        {loading==="google" ? "Opening Google…" : "Continue with Google"}
      </Button>
      <Button onClick={()=>sign("apple")} intent="subtle" size="lg" className="text-white">
        {loading==="apple" ? "Opening Apple…" : "Continue with Apple"}
      </Button>
    </div>
  );
}
