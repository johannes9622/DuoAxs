import { View, Text, TouchableOpacity } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { ProgressBar } from "../components/ProgressBar";
import { useState } from "react";

const GOALS = [
  { id: "fitness", label: "Fitness" },
  { id: "nutrition", label: "Nutrition" },
  { id: "training", label: "Training" },
  { id: "wellness", label: "Wellness" },
  { id: "meal-prep", label: "Meal prep" },
] as const;

export default function OnboardingStep1({ navigation }: any) {
  const [selected, setSelected] = useState<string[]>([]);

  function toggle(id: string) {
    setSelected(s => s.includes(id) ? s.filter(x=>x!==id) : [...s, id]);
  }

  async function next() {
    if (!selected.length) return;
    await AsyncStorage.setItem("@duoaxs_goals", JSON.stringify(selected));
    navigation.navigate("Step2");
  }

  return (
    <View style={{ flex: 1, backgroundColor: "#122017", padding: 24, justifyContent: "space-between" }}>
      <View>
        <View style={{ height: 24 }} />
        <ProgressBar step={1} />
        <Text style={{ color: "white", fontSize: 28, fontWeight: "900", textAlign: "center" }}>What are your goals?</Text>
        <Text style={{ color: "rgba(255,255,255,0.6)", textAlign: "center", marginTop: 8 }}>Pick at least one to personalize your experience.</Text>

        <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 8, marginTop: 16 }}>
          {GOALS.map(g => {
            const active = selected.includes(g.id);
            return (
              <TouchableOpacity key={g.id} onPress={()=>toggle(g.id)} style={{
                borderRadius: 12,
                paddingVertical: 10, paddingHorizontal: 14,
                backgroundColor: active ? "#38e07b" : "rgba(255,255,255,0.05)",
                borderWidth: 1, borderColor: active ? "#38e07b" : "rgba(255,255,255,0.1)",
              }}>
                <Text style={{ color: active ? "#122017" : "white", fontWeight: "700" }}>{g.label}</Text>
              </TouchableOpacity>
            );
          })}
        </View>
      </View>

      <View style={{ flexDirection: "row", gap: 12 }}>
        <TouchableOpacity onPress={()=>navigation.replace("Main")} style={{ flex: 1, paddingVertical: 12, borderRadius: 12, backgroundColor: "rgba(255,255,255,0.1)", alignItems: "center" }}>
          <Text style={{ color: "white", fontWeight: "700" }}>Exit</Text>
        </TouchableOpacity>
        <TouchableOpacity disabled={!selected.length} onPress={next} style={{ flex: 1, paddingVertical: 12, borderRadius: 12, backgroundColor: "#38e07b", alignItems: "center", opacity: selected.length?1:0.5 }}>
          <Text style={{ color: "#122017", fontWeight: "800" }}>Next</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}
