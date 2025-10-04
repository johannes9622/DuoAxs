import { View, Text, TouchableOpacity } from "react-native";
import { ProgressBar } from "../components/ProgressBar";
import { FeatureCard } from "../components/FeatureCard";

export default function OnboardingStep2({ navigation }: any) {
  return (
    <View style={{ flex: 1, backgroundColor: "#122017", padding: 24, justifyContent: "space-between" }}>
      <View>
        <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between", marginBottom: 16 }}>
          <TouchableOpacity onPress={()=>navigation.goBack()}><Text style={{ color: "white" }}>‹</Text></TouchableOpacity>
          <Text style={{ color: "rgba(255,255,255,0.4)", fontSize: 12 }}>2 of 3</Text>
          <View style={{ width: 24 }} />
        </View>
        <ProgressBar step={2} />
        <Text style={{ color: "white", fontWeight: "800", fontSize: 22, textAlign: "center" }}>Discover the DuoAxs Experience</Text>
        <View style={{ marginTop: 24, gap: 12 }}>
          <FeatureCard title="Browse Pros by Specialty" text="Find the perfect match for your fitness goals." />
          <FeatureCard title="Book Sessions Instantly" text="Schedule sessions with ease and flexibility." />
          <FeatureCard title="Track Your Progress" text="Manage your fitness journey all in one place." />
        </View>
      </View>
      <View style={{ flexDirection: "row", gap: 12 }}>
        <TouchableOpacity onPress={()=>navigation.goBack()} style={{ flex: 1, backgroundColor: "rgba(255,255,255,0.1)", paddingVertical: 12, borderRadius: 12, alignItems: "center" }}>
          <Text style={{ color: "white", fontWeight: "700" }}>Back</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={()=>navigation.navigate("Step3")} style={{ flex: 1, backgroundColor: "#38e07b", paddingVertical: 12, borderRadius: 12, alignItems: "center" }}>
          <Text style={{ color: "#122017", fontWeight: "800" }}>Next</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}
