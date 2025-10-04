import { View, Text, TouchableOpacity, Alert } from "react-native";
import * as AuthSession from "expo-auth-session";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useEffect, useRef } from "react";
import { supabase } from "../lib/supabase";

async function pushGoalsWithToken(token: string) {
  const base = process.env.EXPO_PUBLIC_API_BASE || "";
  const goalsRaw = await AsyncStorage.getItem("@duoaxs_goals");
  if (!goalsRaw) return;
  const goals = JSON.parse(goalsRaw);
  await fetch(base + "/api/onboarding/goals", {
    method: "POST",
    headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
    body: JSON.stringify({ goals }),
  }).catch(()=>{});
}

async function markComplete(token: string) {
  const base = process.env.EXPO_PUBLIC_API_BASE || "";
  await fetch(base + "/api/onboarding/complete", {
    method: "POST",
    headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
    body: JSON.stringify({}),
  }).catch(()=>{});
}

export default function OnboardingStep3({ navigation }: any) {
  const handledRef = useRef(false);

  useEffect(() => {
    // Listen for auth state changes to capture the session after OAuth.
    const { data: sub } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (handledRef.current) return;
      if (event === "SIGNED_IN" && session?.access_token) {
        handledRef.current = true;
        const token = session.access_token;
        try {
          await pushGoalsWithToken(token);
          await markComplete(token);
        } finally {
          navigation.replace("Main");
        }
      }
    });
    return () => { sub.subscription?.unsubscribe(); };
  }, [navigation]);

  async function oauth(provider: "google" | "apple") {
    try {
      const redirectTo = AuthSession.makeRedirectUri({ useProxy: true });
      const { error } = await supabase.auth.signInWithOAuth({
        provider,
        options: { redirectTo, skipBrowserRedirect: false },
      });
      if (error) throw error;
      // The onAuthStateChange listener will handle the rest after redirect.
    } catch (e: any) {
      Alert.alert("Sign-in failed", e.message ?? "Try again.");
    }
  }

  return (
    <View style={{ flex: 1, backgroundColor: "#122017", padding: 24, justifyContent: "space-between" }}>
      <View>
        <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between", marginBottom: 16 }}>
          <TouchableOpacity onPress={()=>navigation.goBack()}><Text style={{ color: "white" }}>‹</Text></TouchableOpacity>
          <Text style={{ color: "rgba(255,255,255,0.4)", fontSize: 12 }}>3 of 3</Text>
          <View style={{ width: 24 }} />
        </View>
        <Text style={{ color: "white", fontSize: 28, fontWeight: "900", textAlign: "center" }}>Create your DuoAxs account</Text>
        <Text style={{ color: "rgba(255,255,255,0.6)", textAlign: "center", marginTop: 8 }}>Sign in to save progress and start booking.</Text>
      </View>

      <View style={{ gap: 12 }}>
        <TouchableOpacity onPress={()=>oauth("google")} style={{ backgroundColor: "#38e07b", borderRadius: 12, paddingVertical: 14, alignItems: "center" }}>
          <Text style={{ color: "#122017", fontWeight: "800" }}>Continue with Google</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={()=>oauth("apple")} style={{ borderRadius: 12, paddingVertical: 14, alignItems: "center", borderWidth: 1, borderColor: "rgba(255,255,255,0.5)" }}>
          <Text style={{ color: "white", fontWeight: "800" }}>Continue with Apple</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={()=>navigation.replace("Main")} style={{ paddingVertical: 12, alignItems: "center" }}>
          <Text style={{ color: "rgba(255,255,255,0.7)" }}>Skip for now</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}
