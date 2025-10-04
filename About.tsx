import { View, Text, ScrollView } from "react-native";
import Svg, { Path } from "react-native-svg";

export default function AboutScreen() {
  return (
    <ScrollView contentContainerStyle={{ padding: 16, backgroundColor: "#122017", flexGrow: 1 }}>
      <View style={{ alignItems: "center", marginTop: 24 }}>
        <Svg width={96} height={96} viewBox="0 0 24 24">
          <Path
            d="M12 2C6.48 2 2 6.48 2 12C2 17.52 6.48 22 12 22C17.52 22 22 17.52 22 12C22 6.48 17.52 2 12 2ZM10.5 16.5L6 12L7.41 10.59L10.5 13.67L16.59 7.59L18 9L10.5 16.5Z"
            fill="#38e07b"
          />
        </Svg>
        <Text style={{ marginTop: 12, fontSize: 32, fontWeight: "900", color: "#f6f8f7" }}>
          Duo<Text style={{ color: "#38e07b" }}>Axs</Text>
        </Text>
      </View>

      <Text style={{ marginTop: 24, fontSize: 22, fontWeight: "700", color: "#f6f8f7" }}>Our Story</Text>
      <Text style={{ marginTop: 6, lineHeight: 22, color: "rgba(246,248,247,0.8)" }}>
        DuoAxs was born from a simple idea: to make personalized fitness and wellness accessible to everyone. Our platform connects you with top-tier professionals in one place.
      </Text>

      <Text style={{ marginTop: 18, fontSize: 22, fontWeight: "700", color: "#f6f8f7" }}>Our Mission</Text>
      <Text style={{ marginTop: 6, lineHeight: 22, color: "rgba(246,248,247,0.8)" }}>
        Empower healthier, happier lives via seamless access to personalized services and a supportive community.
      </Text>

      <Text style={{ marginTop: 18, fontSize: 22, fontWeight: "700", color: "#f6f8f7" }}>Our Values</Text>
      <Text style={{ marginTop: 6, lineHeight: 22, color: "rgba(246,248,247,0.8)" }}>
        Quality • Personalization • Community • Accessibility
      </Text>
    </ScrollView>
  );
}
