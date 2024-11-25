import { useEffect, useState } from "react";
import { Text, View, StyleSheet, Touchable, TouchableOpacity, Alert } from "react-native";
import { registerForPushNotificationsAsync } from "../../utils/registerForPushNotificationsAsync";
import * as Notifications from "expo-notifications";
import { Duration, isBefore, intervalToDuration } from "date-fns";
import { TimeSegment } from "../../components/TimeSegment";

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
    }, 1000);

    return () => clearInterval(intervalId);
  }, []);

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
    <View style={[styles.container, status?.isOverdue ? styles.containerLate : undefined]}>
      <View>
        {status?.isOverdue ? (
          <Text style={styles.heading}>Overdue</Text>
        ) : (
          <Text style={[styles.heading, status?.isOverdue ? styles.whiteText : undefined]}>Countdown</Text>
        )}
      </View>
      <View style={styles.row}>
        <TimeSegment unit="Days" number={status?.distance.days ?? 0} textStyle={status?.isOverdue ? styles.whiteText : undefined} />
        <TimeSegment unit="Hours" number={status?.distance.hours ?? 0} textStyle={status?.isOverdue ? styles.whiteText : undefined} />
        <TimeSegment unit="Minutes" number={status?.distance.minutes ?? 0} textStyle={status?.isOverdue ? styles.whiteText : undefined} />
        <TimeSegment unit="Seconds" number={status?.distance.seconds ?? 0} textStyle={status?.isOverdue ? styles.whiteText : undefined} />
      </View>
      <TouchableOpacity style={styles.button} activeOpacity={0.8} onPress={schedulePushNotification}>
        <Text style={styles.text}>Mark as done</Text>
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
    marginTop: 24,
  },
  heading: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 24,
    color: "black",
    textTransform: "uppercase",
  },
  text: {
    color: "white",
    fontSize: 18,
    fontWeight: "bold",
    textTransform: "uppercase",
    letterSpacing: 1,
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-around",
    width: "100%",
  },
  containerLate: {
    backgroundColor: "salmon",
  },
  whiteText: {
    color: "white",
  },
});
