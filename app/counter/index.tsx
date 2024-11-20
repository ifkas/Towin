import { useRouter } from "expo-router";
import { Text, View, StyleSheet, Touchable, TouchableOpacity } from "react-native";
import { registerForPushNotificationsAsync } from "../../utils/registerForPushNotificationsAsync";

export default function CounterScreen() {
  const router = useRouter();

  const handleRequestPermission = async () => {
    const result = await registerForPushNotificationsAsync();
    // console.log(result);
  };

  return (
    <View style={styles.container}>
      {/* <TouchableOpacity onPress={() => router.navigate("/idea")}>
        <Text style={{ textAlign: "center", marginBottom: 18, fontSize: 24 }}>Go to Idea</Text>
      </TouchableOpacity> */}
      {/* <Text style={styles.text}>This is the counter</Text> */}
      <TouchableOpacity style={styles.button} onPress={handleRequestPermission}>
        <Text style={styles.text}>Request Permission</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#fff",
  },
  button: {
    backgroundColor: "black",
    padding: 14,
    borderRadius: 8,
  },
  text: {
    color: "white",
    fontSize: 18,
    fontWeight: "bold",
    textTransform: "uppercase",
    letterSpacing: 1,
  },
});
