import { Stack, Tabs } from "expo-router";
import { ShoppingCart, RotateCcw, Lightbulb } from "lucide-react-native";

export default function Layout() {
  return (
    <Tabs screenOptions={{ tabBarActiveTintColor: "#1967d2" }}>
      <Tabs.Screen
        name="index"
        options={{
          title: "Shopping Lists",
          tabBarIcon: ({ color, size }) => {
            return <ShoppingCart color={color} />;
          },
        }}
      />
      {/* <Stack.Screen name="counter" options={{ title: "Counter", presentation: "modal", animation: "slide_from_bottom" }} /> */}
      {/* <Stack.Screen name="idea" options={{ title: "The Idea", presentation: "modal", animation: "slide_from_left" }} /> */}
      <Tabs.Screen
        name="counter"
        options={{
          title: "Counter",
          tabBarIcon: ({ color, size }) => {
            return <RotateCcw color={color} />;
          },
          headerShown: false,
        }}
      />
      <Tabs.Screen
        name="idea"
        options={{
          title: "The Idea",
          tabBarIcon: ({ color, size }) => {
            return <Lightbulb color={color} />;
          },
        }}
      />
    </Tabs>
  );
}
