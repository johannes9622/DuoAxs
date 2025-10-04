import { View, Text, TouchableOpacity, TextInput, Alert } from "react-native";
import { useEffect, useState } from "react";
import * as WebBrowser from "expo-web-browser";
import { supabase } from "../lib/supabase";

export default function BankAccount({ navigation }: any) {
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({ account_holder_name: "", routing_number: "", account_number: "", confirm_account_number: "", bank_name: "" });

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => setToken(data.session?.access_token ?? null));
    const { data: sub } = supabase.auth.onAuthStateChange((_e, s) => setToken(s?.access_token ?? null));
    return () => { sub.subscription?.unsubscribe(); };
  }, []);

  async function ensureAccount() {
    if (!token) return;
    await fetch((process.env.EXPO_PUBLIC_API_BASE || "") + "/api/payouts/connect-account", { method: "POST", headers: { Authorization: `Bearer ${token}` } });
  }

  async function linkWithStripe() {
    if (!token) return Alert.alert("Not signed in", "Please sign in first");
    setLoading(true);
    try {
      await ensureAccount();
      const r = await fetch((process.env.EXPO_PUBLIC_API_BASE || "") + "/api/payouts/connect-link", { method: "POST", headers: { Authorization: `Bearer ${token}` } });
      const j = await r.json();
      if (!r.ok) throw new Error(j.error || "Failed to create link");
      await WebBrowser.openBrowserAsync(j.url);
    } catch (e: any) {
      Alert.alert("Error", e.message ?? "Something went wrong");
    } finally {
      setLoading(false);
    }
  }

  async function manualAdd() {
    if (!token) return Alert.alert("Not signed in", "Please sign in first");
    if (form.account_number !== form.confirm_account_number) {
      return Alert.alert("Mismatch", "Account numbers do not match");
    }
    setLoading(true);
    try {
      const r = await fetch((process.env.EXPO_PUBLIC_API_BASE || "") + "/api/payouts/add-bank", {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify(form),
      });
      const j = await r.json();
      if (!r.ok) throw new Error(j.error || "Failed to add bank");
      Alert.alert("Success", "Bank account added");
    } catch (e: any) {
      Alert.alert("Error", e.message ?? "Failed to add bank");
    } finally {
      setLoading(false);
    }
  }

  return (
    <View style={{ flex: 1, backgroundColor: "#122017", padding: 16 }}>
      <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between", marginBottom: 16 }}>
        <TouchableOpacity onPress={()=>navigation.goBack()}><Text style={{ color: "white" }}>‹</Text></TouchableOpacity>
        <Text style={{ color: "white", fontWeight: "800" }}>Bank Account</Text>
        <View style={{ width: 24 }} />
      </View>

      <Text style={{ color: "white", fontSize: 22, fontWeight: "900", marginBottom: 8 }}>Add Bank Account</Text>
      <Text style={{ color: "rgba(255,255,255,0.7)", marginBottom: 16 }}>Securely link your account for payouts.</Text>

      <TouchableOpacity onPress={linkWithStripe} disabled={loading} style={{ backgroundColor: "#38e07b", borderRadius: 12, paddingVertical: 12, alignItems: "center", marginBottom: 16 }}>
        <Text style={{ color: "#122017", fontWeight: "800" }}>{loading ? "Opening…" : "Link with Stripe (Recommended)"}</Text>
      </TouchableOpacity>

      <View style={{ height: 1, backgroundColor: "rgba(255,255,255,0.1)", marginVertical: 16 }} />

      {["account_holder_name","routing_number","account_number","confirm_account_number","bank_name"].map((k) => (
        <View key={k} style={{ marginBottom: 10 }}>
          <Text style={{ color: "rgba(255,255,255,0.8)", marginBottom: 4 }}>{k.replace(/_/g," ").replace(/\b\w/g, s=>s.toUpperCase())}</Text>
          <TextInput
            secureTextEntry={k.includes("account_number")}
            value={(form as any)[k]}
            onChangeText={(t)=>setForm({ ...form, [k]: t })}
            placeholder={k.includes("account_number") ? "••••••••1234" : ""}
            placeholderTextColor="rgba(255,255,255,0.4)"
            style={{ borderWidth: 1, borderColor: "rgba(255,255,255,0.2)", borderRadius: 10, padding: 10, color: "white" }}
          />
        </View>
      ))}

      <TouchableOpacity onPress={manualAdd} disabled={loading} style={{ backgroundColor: "rgba(255,255,255,0.1)", borderRadius: 12, paddingVertical: 12, alignItems: "center", marginTop: 8 }}>
        <Text style={{ color: "white", fontWeight: "800" }}>{loading ? "Saving…" : "Add Account"}</Text>
      </TouchableOpacity>

      <Text style={{ color: "rgba(255,255,255,0.6)", fontSize: 12, marginTop: 8 }}>
        🔒 We recommend the Stripe-hosted flow above for the highest security.
      </Text>
    </View>
  );
}
