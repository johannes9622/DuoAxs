import { View, Text, ActivityIndicator } from "react-native";

export default function LoadingScreen() {
  return (
    <View style={{ flex: 1, alignItems: "center", justifyContent: "center", backgroundColor: "#122017" }}>
      <ActivityIndicator size="large" color="#38e07b" />
      <Text style={{ marginTop: 20, fontSize: 18, color: "#f6f8f7" }}>Loading...</Text>
    </View>
  );
}
