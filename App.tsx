import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import OnboardingStep1 from "./screens/OnboardingStep1";
import OnboardingStep2 from "./screens/OnboardingStep2";
import OnboardingStep3 from "./screens/OnboardingStep3";
import { View, Text } from "react-native";

const Stack = createNativeStackNavigator();

function Main() {
  return (
    <View style={{ flex: 1, alignItems: "center", justifyContent: "center", backgroundColor: "#122017" }}>
      <Text style={{ color: "white" }}>Main App</Text>
    </View>
  );
}

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        <Stack.Screen name="Step1" component={OnboardingStep1} />
        <Stack.Screen name="Step2" component={OnboardingStep2} />
        <Stack.Screen name="Step3" component={OnboardingStep3} />
        <Stack.Screen name="Main" component={Main} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
