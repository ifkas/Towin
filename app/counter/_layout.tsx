import { Stack, Link } from "expo-router";
import { Pressable } from "react-native";
import { History } from "lucide-react-native";

export default function Layout() {
  return (
    <Stack>
      <Stack.Screen
        name="index"
        options={{
          title: "Counter",
          headerRight: () => {
            return (
              <Link href="/counter/history" asChild>
                <Pressable hitSlop={20}>
                  <History color="#000" />
                </Pressable>
              </Link>
            );
          },
        }}
      />
    </Stack>
  );
}
