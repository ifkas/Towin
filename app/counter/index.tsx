// import { useRouter } from "expo-router";
import { useEffect, useState } from "react";
import { Text, View, StyleSheet, Touchable, TouchableOpacity, Alert } from "react-native";
import { registerForPushNotificationsAsync } from "../../utils/registerForPushNotificationsAsync";
import * as Notifications from "expo-notifications";
import { Duration, isBefore, intervalToDuration } from "date-fns";

// 10 seconds from now
const timestamp = Date.now() + 10 * 1000;

type CountdownStatus = {
  isOverdue: boolean;
  distance: Duration;
};

export default function CounterScreen() {
  // const [secondsElapsed, setSecondsElapsed] = useState(0);
  const [status, setStatus] = useState<CountdownStatus | null>(null);

  // console.log(status);

  useEffect(() => {
    const intervalId = setInterval(() => {
      const isOverdue = isBefore(timestamp, Date.now());
      const distance = intervalToDuration(isOverdue ? { start: timestamp, end: Date.now() } : { start: Date.now(), end: timestamp });
      setStatus({ isOverdue, distance });
      // setSecondsElapsed((prev) => prev + 1);
    }, 1000);

    return () => clearInterval(intervalId);
  }, []);

  // const router = useRouter();

  // const handleRequestPermission = async () => {
  //   const result = await registerForPushNotificationsAsync();
  //   // console.log(result);
  // };

  const schedulePushNotification = async () => {
    const result = await registerForPushNotificationsAsync();
    if (result === "granted") {
      console.log("Notification permissions granted.");
      await Notifications.scheduleNotificationAsync({
        content: {
          title: "I am notification from your app! 📬",
          // body: "Here is the notification body",
          // data: { data: "goes here" },
        },
        trigger: { seconds: 4, repeats: false, channelId: "default" },
      });
    } else {
      Alert.alert("Notification permissions denied.", "Please enable notifications in your system settings.");
    }
  };

  return (
    <View style={styles.container}>
      {/* <TouchableOpacity onPress={() => router.navigate("/idea")}>
        <Text style={{ textAlign: "center", marginBottom: 18, fontSize: 24 }}>Go to Idea</Text>
      </TouchableOpacity> */}
      {/* <Text style={styles.text}>This is the counter</Text> */}
      {/* <Text>{secondsElapsed}</Text> */}
      <TouchableOpacity style={styles.button} activeOpacity={0.8} onPress={schedulePushNotification}>
        {/* <Text style={styles.text}>Request Permission</Text> */}
        <Text style={styles.text}>Schedule Notification</Text>
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
