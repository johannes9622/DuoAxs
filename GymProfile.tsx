import { useState } from "react";
import { View, Text, TextInput, ScrollView, Switch, TouchableOpacity, Image, Alert } from "react-native";
import * as ImagePicker from "expo-image-picker";
import { supabase } from "../lib/supabase";

export default function GymProfileScreen() {
  const [name, setName] = useState("");
  const [address, setAddress] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [description, setDescription] = useState("");
  const [amenities, setAmenities] = useState({ freeWeights: false, cardio: false, classes: false, training: false, lockers: false, sauna: false });
  const [photos, setPhotos] = useState<string[]>([]);
  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);

  async function pick() {
    const perm = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!perm.granted) { Alert.alert("Permission required", "Allow photo access to upload."); return; }
    const resp = await ImagePicker.launchImageLibraryAsync({ quality: 0.85, allowsMultipleSelection: false, mediaTypes: ImagePicker.MediaTypeOptions.Images });
    if (resp.canceled) return;
    try {
      setUploading(true);
      const file = resp.assets[0];
      const path = `gym-photos/${Date.now()}-${Math.random().toString(36).slice(2)}.jpg`;
      const bin = await fetch(file.uri).then(r => r.blob());
      const { error } = await supabase.storage.from("duoaxs-media").upload(path, bin, { contentType: "image/jpeg" });
      if (error) throw error;
      const { data } = supabase.storage.from("duoaxs-media").getPublicUrl(path);
      setPhotos(p => [...p, data.publicUrl]);
    } catch (e: any) {
      Alert.alert("Upload failed", e.message ?? "Try again.");
    } finally {
      setUploading(false);
    }
  }

  async function save() {
    try {
      setSaving(true);
      // TODO: attach Authorization header (mobile Supabase auth)
      const res = await fetch(process.env.EXPO_PUBLIC_API_BASE + "/api/partner/profile", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, address, phone, email, description, amenities, colors: { primary: "#38e07b", secondary: "#f6f8f7" }, photos }),
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
          <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 8 }}>
            {photos.map((u, i) => <Image key={i} source={{ uri: u }} style={{ width: 96, height: 96, borderRadius: 10 }} />)}
            <TouchableOpacity onPress={pick} disabled={uploading} style={{ width: 96, height: 96, borderRadius: 10, borderWidth: 1, borderStyle: "dashed", borderColor: "#38e07b", alignItems: "center", justifyContent: "center" }}>
              <Text style={{ color: "#38e07b" }}>{uploading ? "..." : "+"}</Text>
            </TouchableOpacity>
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
