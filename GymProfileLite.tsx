import { useState } from "react";
import { View, Text, ScrollView, TextInput, Switch, TouchableOpacity, Image, Alert } from "react-native";

export default function GymProfileLite() {
  const [name, setName] = useState("");
  const [address, setAddress] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [description, setDescription] = useState("");
  const [amenities, setAmenities] = useState({ freeWeights: false, cardio: false, classes: false, training: false, lockers: false, sauna: false });
  const photos = [
    "https://lh3.googleusercontent.com/aida-public/AB6AXuBD2Z2NHx4SFqDfw5nEY61fJilQqXWA_0lTWNtYZX41Z3xx1b9pjilOWQiFVvvfzyNE5Anq-lWvsnEX1C90mB0vFziFo8IHihqjxrTwflx0Zmrv1VnmKaN46zTcRA0qsWE2s5gICOYVKveJ1z1BtFvZDwyVcqKocRd1oniAf5cFiQ2H1p0qb4Eb3ZDQXpTwssi9bRXuJYoPQe0oTuaauw_4CCAZbfvnoF1_MiulRgbvOx-WDoz7yq7ubyz5VRU6coHBiDGS0toD4tXj",
    "https://lh3.googleusercontent.com/aida-public/AB6AXuDglZanEWztNmvp43YRepN2ynVUo4Pok6MhW6pWoDoT1q-N8_QUrQLMGBH-uIzMOqorc2r-yXrjG5U-B121yVbbJZpx48wuxi8qkcujkssCIt2Rwr-CjCznirCpFR1Enxeki6rYz4mLgPjruElF7sBAyudrnfptWYcfCpBN4AuvwtQdTTySK4xpBCg_8bM3pWFJP7-4hKVEP9EdtnPLCmQk8nKYn-w4bWFsSVxtQ5t78FC3_bu4z1b244FpO0pY4DbvGB2WS2m6mK_-",
    "https://lh3.googleusercontent.com/aida-public/AB6AXuD6V6p8kfczPqgU-dmfLarZOCZz5sVQywWnAyZPqKAc8v1xHkwCSGTHbqx-GX1aGTtqqz9LAOCKOYwQrOHbfxbz_ReOnIYx3257xyuIDzX1ShP2xlg4tYU2qraCjvB5aAcm7Rg5ACFd2pBfS5yL5TBbeW_Kpy-jWBvfU7O0XRf0UT7IkegKR_Kj_GeOivLLAYetIWcWqqIH4Bmf0AntAgMmmoCRf1QEGpjRB1u9PzX9ZUBgDDKkaO008sh-eP1RYX5-TkOnf5mDbRkO",
  ];
  const [saving, setSaving] = useState(false);

  async function save() {
    try {
      setSaving(true);
      const res = await fetch(process.env.EXPO_PUBLIC_API_BASE + "/api/partner/profile", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name, address, phone, email, description, amenities,
          colors: { primary: "#38e07b", secondary: "#f6f8f7" },
          photos,
        }),
      });
      if (!res.ok) throw new Error(await res.text());
      Alert.alert("Saved", "Profile updated.");
    } catch (e: any) {
      Alert.alert("Save failed", e.message ?? "Try again.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <View style={{ flex: 1, backgroundColor: "#122017" }}>
      <View style={{ padding: 12, borderBottomWidth: 1, borderColor: "rgba(56,224,123,0.3)" }}>
        <Text style={{ color: "#f6f8f7", textAlign: "center", fontSize: 18, fontWeight: "700" }}>Gym Profile</Text>
      </View>
      <ScrollView contentContainerStyle={{ padding: 16, paddingBottom: 40 }}>
        <Section title="Business Details">
          <Field label="Gym Name" value={name} onChangeText={setName} placeholder="DuoAxs Fitness Hub" />
          <Field label="Address" value={address} onChangeText={setAddress} placeholder="123 Wellness St, Anytown" />
          <Field label="Phone Number" value={phone} onChangeText={setPhone} placeholder="(123) 456-7890" keyboardType="phone-pad" />
          <Field label="Email" value={email} onChangeText={setEmail} placeholder="contact@duoaxs.com" keyboardType="email-address" />
          <Field multiline label="Description" value={description} onChangeText={setDescription} placeholder="Tell us about your gym..." />
        </Section>

        <Section title="Amenities">
          {Object.entries(amenities).map(([key, val]) => (
            <Row key={key} label={titleize(key)} value={val} onChange={(v)=>setAmenities(a => ({...a, [key]: v}))} />
          ))}
        </Section>

        <Section title="Photos">
          <View style={{ flexDirection: "row", gap: 8 }}>
            <Image source={{ uri: photos[0] }} style={{ width: 120, height: 80, borderRadius: 10 }} />
            <Image source={{ uri: photos[1] }} style={{ width: 80, height: 80, borderRadius: 10 }} />
            <Image source={{ uri: photos[2] }} style={{ width: 80, height: 80, borderRadius: 10 }} />
          </View>
        </Section>

        <TouchableOpacity disabled={saving} onPress={save} style={{ marginTop: 12, backgroundColor: "#38e07b", borderRadius: 12, paddingVertical: 12, alignItems: "center" }}>
          <Text style={{ color: "#122017", fontWeight: "800" }}>{saving ? "Saving…" : "Save Profile"}</Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
}

function Section({ title, children }: any) {
  return (
    <View style={{ marginBottom: 16 }}>
      <Text style={{ color: "#f6f8f7", fontWeight: "800", marginBottom: 8 }}>{title}</Text>
      {children}
    </View>
  );
}

function Field({ label, ...props }: any) {
  return (
    <View style={{ marginBottom: 10 }}>
      <Text style={{ color: "rgba(246,248,247,0.7)", fontSize: 12, marginBottom: 4 }}>{label}</Text>
      <TextInput
        {...props}
        style={{ backgroundColor: "rgba(18,32,23,0.7)", borderRadius: 10, color: "#f6f8f7", paddingHorizontal: 12, paddingVertical: 10, minHeight: props.multiline ? 96 : undefined }}
        placeholderTextColor="rgba(246,248,247,0.5)"
      />
    </View>
  );
}

function Row({ label, value, onChange }: any) {
  return (
    <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between", paddingVertical: 8 }}>
      <Text style={{ color: "#f6f8f7" }}>{label}</Text>
      <Switch value={value} onValueChange={onChange} trackColor={{ false: "#2c3d31", true: "#38e07b" }} thumbColor="#f6f8f7" />
    </View>
  );
}

function titleize(k: string) {
  return k.replace(/([A-Z])/g, " $1").replace(/^./, s => s.toUpperCase());
}
