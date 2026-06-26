import { Tabs } from "expo-router";
import { Text } from "react-native";

export default function TabsLayout() {
  return (
    <Tabs screenOptions={{ headerShown: true }}>
      <Tabs.Screen name="index" options={{ title: "Dashboard", tabBarIcon: () => <Text>$</Text> }} />
      <Tabs.Screen name="transactions" options={{ title: "Transactions", tabBarIcon: () => <Text>#</Text> }} />
      <Tabs.Screen name="add" options={{ title: "Add", tabBarIcon: () => <Text>+</Text> }} />
    </Tabs>
  );
}
