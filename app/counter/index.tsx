import { useEffect, useState } from "react";
import { Text, View, StyleSheet, Touchable, TouchableOpacity, Alert } from "react-native";
import { registerForPushNotificationsAsync } from "../../utils/registerForPushNotificationsAsync";
import * as Notifications from "expo-notifications";
import { Duration, isBefore, intervalToDuration } from "date-fns";
import { TimeSegment } from "../../components/TimeSegment";
import { getFromStorage, saveToStorage } from "../../utils/storage";

// 10 seconds from now (hardcoded for now)
const frequency = 10 * 1000;

const countdownStorageKey = "countdownState";

type CountdownStatus = {
  isOverdue: boolean;
  distance: Duration;
};

type PersistedCountdownState = {
  currentNotificationId: string | undefined;
  completedAtTimestamps: number[];
};

export default function CounterScreen() {
  const [countdownState, setCountdownState] = useState<PersistedCountdownState | null>(null);
  const [status, setStatus] = useState<CountdownStatus | null>(null);

  // console.log(status);
  const lastCompletedTimestamp = countdownState?.completedAtTimestamps[0];

  useEffect(() => {
    const loadCountdownState = async () => {
      const storedState = await getFromStorage(countdownStorageKey);
      if (storedState) {
        setCountdownState(storedState);
      }
    };

    loadCountdownState();
  }, []);

  useEffect(() => {
    const intervalId = setInterval(() => {
      const timestamp = lastCompletedTimestamp ? lastCompletedTimestamp + frequency : Date.now() + frequency;
      const isOverdue = isBefore(timestamp, Date.now());
      const distance = intervalToDuration(isOverdue ? { start: timestamp, end: Date.now() } : { start: Date.now(), end: timestamp });
      setStatus({ isOverdue, distance });
    }, 1000);

    return () => clearInterval(intervalId);
  }, [lastCompletedTimestamp]);

  const schedulePushNotification = async () => {
    let pushNotificationId;
    const result = await registerForPushNotificationsAsync();
    if (result === "granted") {
      console.log("Notification permissions granted.");
      pushNotificationId = await Notifications.scheduleNotificationAsync({
        content: {
          title: "The thing is due! 📬",
        },
        trigger: { seconds: frequency / 1000, repeats: false, channelId: "default" },
      });
    } else {
      Alert.alert("Notification permissions denied.", "Please enable notifications in your system settings.");
    }
    if (countdownState?.currentNotificationId) {
      await Notifications.cancelScheduledNotificationAsync(countdownState?.currentNotificationId);
    }
    const newCountdownState = {
      currentNotificationId: pushNotificationId,
      completedAtTimestamps: [Date.now(), ...(countdownState?.completedAtTimestamps ?? [])],
    };
    setCountdownState(newCountdownState);
    await saveToStorage(countdownStorageKey, newCountdownState);
  };

  return (
    <View style={[styles.container, status?.isOverdue ? styles.containerLate : undefined]}>
      <View>
        {status?.isOverdue ? (
          <Text style={[styles.heading, status?.isOverdue ? styles.whiteText : undefined]}>Overdue</Text>
        ) : (
          <Text style={styles.heading}>Countdown</Text>
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
