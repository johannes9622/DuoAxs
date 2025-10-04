import { View, Text, ImageBackground, TouchableOpacity } from "react-native";

export default function StitchScreen({ onGetStarted }: { onGetStarted?: () => void }) {
  return (
    <View style={{ flex: 1, backgroundColor: "#122017" }}>
      <ImageBackground
        source={{ uri: "https://lh3.googleusercontent.com/aida-public/AB6AXuAp5UjCaJ4U_U3TrfOc3F4NmRyxtY9wFY3bd-3fFmbBmGvoR4iQHUokA5fDzg9AnANcjP8XjMug2bgXK6-rvTf1pwDrZzzUpqHvKOlXOYSIPIv-9E1i7LtjNT68OnNn22B1wjx4qIcFA5EPmLzbZSDoaP90du6LtC2QhgMe-5RAj-H0GPVyV9s9MUbZeHak6PyXoNLyTHOidV5FxkwLjScvke8sfTEveF0RNt9S7HpYmkH2kbnZH0VbocHqNsnMXRjQNWwrXF2YIa45" }}
        style={{ width: "100%", height: 320 }}
        resizeMode="cover"
      />
      <View style={{ paddingHorizontal: 24, paddingVertical: 16 }}>
        <Text style={{ color: "#f6f8f7", fontSize: 24, fontWeight: "800" }}>
          Connect with top fitness and wellness Pros
        </Text>
        <Text style={{ marginTop: 8, color: "rgba(246,248,247,0.7)", fontSize: 14 }}>
          Find and book personal trainers, nutrition coaches, private chefs, and partner gyms.
        </Text>
      </View>
      <View style={{ paddingHorizontal: 24, paddingVertical: 16, marginTop: "auto" }}>
        <TouchableOpacity
          onPress={onGetStarted}
          style={{ width: "100%", backgroundColor: "#38e07b", paddingVertical: 14, borderRadius: 14, alignItems: "center", shadowColor: "#38e07b", shadowOpacity: 0.2, shadowRadius: 12 }}
        >
          <Text style={{ color: "#122017", fontWeight: "800" }}>Get Started</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}
