import React, { useState, useEffect } from "react";
import { Text, View, StyleSheet, FlatList } from "react-native";
import { getFromStorage } from "../../utils/storage";

import { countdownStorageKey, PersistedCountdownState } from ".";
import { format } from "date-fns";

const fullDateFormat = `LLL d yyyy, h:mm aaa`;

export default function HistoryScreen() {
  const [countdownState, setCountdownState] = useState<PersistedCountdownState | null>(null);

  useEffect(() => {
    const loadCountdownState = async () => {
      const storedState = await getFromStorage(countdownStorageKey);
      if (storedState) {
        setCountdownState(storedState);
      }
    };

    loadCountdownState();
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.text}>History</Text>
      <FlatList
        style={styles.list}
        contentContainerStyle={styles.contentContainer}
        data={countdownState?.completedAtTimestamps}
        ListEmptyComponent={<Text>No history yet</Text>}
        keyExtractor={(item) => item.toString()}
        renderItem={({ item }) => <Text style={styles.listItem}>{format(item, fullDateFormat)}</Text>}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 32,
  },
  text: {
    fontSize: 24,
  },
  list: {
    flex: 1,
    padding: 16,
  },
  listItem: {
    fontSize: 18,
    marginBottom: 8,
    backgroundColor: "#ccc",
    padding: 12,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: "#000",
  },
  contentContainer: {
    alignItems: "center",
  },
});
