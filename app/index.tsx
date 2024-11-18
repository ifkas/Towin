import React from "react";
import { useEffect, useState } from "react";
import { StyleSheet, View, TextInput, Text, FlatList, LayoutAnimation, UIManager, Platform } from "react-native";
import * as Haptics from "expo-haptics";

import { getFromStorage, saveToStorage } from "../utils/storage";

import { ShoppingListItem } from "../components/ShoppingListItem";

// Enable LayoutAnimation on Android
if (Platform.OS === "android") {
  if (UIManager.setLayoutAnimationEnabledExperimental) {
    UIManager.setLayoutAnimationEnabledExperimental(true);
  }
}

const storageKey = "shopping-list";

type ShoppingListItem = {
  id: string;
  name: string;
  completedAtTimestamp?: number;
  lastUpdatedTimestamp: number;
};

export default function App() {
  const [items, setItems] = useState<ShoppingListItem[]>([]);
  const [value, setValue] = useState<string>("");

  useEffect(() => {
    (async () => {
      const data = await getFromStorage(storageKey);
      if (data) {
        LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
        setItems(data);
      }
    })();
  }, []);

  const handleSubmit = () => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    if (value.trim() === "") return;
    setItems([{ id: Math.random().toString(), name: value, lastUpdatedTimestamp: Date.now() }, ...items]);
    saveToStorage(storageKey, [{ id: Math.random().toString(), name: value, lastUpdatedTimestamp: Date.now() }, ...items]);
    setValue("");
  };

  const handleDelete = (id: string) => {
    saveToStorage(
      storageKey,
      items.filter((item) => item.id !== id)
    );
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    setItems(items.filter((item) => item.id !== id));
  };

  const handleComplete = (id: string) => {
    saveToStorage(
      storageKey,
      items.map((item) => {
        if (item.id === id) {
          return { ...item, lastUpdatedTimestamp: Date.now(), completedAtTimestamp: item.completedAtTimestamp ? undefined : Date.now() };
        }
        return item;
      })
    );
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setItems(
      items.map((item) => {
        if (item.id === id) {
          if (item.completedAtTimestamp) {
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
          } else {
            Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
          }
          return { ...item, lastUpdatedTimestamp: Date.now(), completedAtTimestamp: item.completedAtTimestamp ? undefined : Date.now() };
        }
        return item;
      })
    );
  };

  return (
    <FlatList
      data={orderShoppingList(items)}
      style={styles.container}
      contentContainerStyle={styles.contentContainer}
      stickyHeaderIndices={[0]}
      ListEmptyComponent={() => (
        <View style={{ padding: 20 }}>
          <Text>No items, add some item.</Text>
        </View>
      )}
      ListHeaderComponent={
        <TextInput
          value={value}
          onChangeText={setValue}
          returnKeyType="done"
          onSubmitEditing={handleSubmit}
          placeholder="E.g. Coffee"
          style={styles.textInput}
        />
      }
      renderItem={({ item }) => (
        <ShoppingListItem
          name={item.name}
          onDeleted={() => handleDelete(item.id)}
          onToggleComplete={() => handleComplete(item.id)}
          isCompleted={Boolean(item.completedAtTimestamp)}
        />
      )}
    />
  );
}

function orderShoppingList(shoppingList: ShoppingListItem[]) {
  return shoppingList.sort((item1, item2) => {
    if (item1.completedAtTimestamp && item2.completedAtTimestamp) {
      return item2.completedAtTimestamp - item1.completedAtTimestamp;
    }

    if (item1.completedAtTimestamp && !item2.completedAtTimestamp) {
      return 1;
    }

    if (!item1.completedAtTimestamp && item2.completedAtTimestamp) {
      return -1;
    }

    if (!item1.completedAtTimestamp && !item2.completedAtTimestamp) {
      return item2.lastUpdatedTimestamp - item1.lastUpdatedTimestamp;
    }

    return 0;
  });
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    paddingVertical: 12,
  },
  contentContainer: {
    paddingBottom: 10,
  },
  textInput: {
    backgroundColor: "#f9f9f9",
    padding: 10,
    margin: 10,
    borderWidth: 1,
    marginBottom: 50,
    marginTop: 50,
    fontSize: 18,
  },
});
