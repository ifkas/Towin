import React from "react";
import { StyleSheet, View, TextInput, Text, ScrollView, FlatList } from "react-native";
import { ShoppingListItem } from "../components/ShoppingListItem";
import { Link } from "expo-router";

type ShoppingListItem = {
  id: string;
  name: string;
  completed?: number;
};

const initialItems: ShoppingListItem[] = [
  { id: "1", name: "Coffee" },
  { id: "2", name: "Tea" },
  { id: "3", name: "Sprite" },
];

import { useState } from "react";

export default function App() {
  const [items, setItems] = useState<ShoppingListItem[]>(initialItems);
  const [value, setValue] = useState<string>("");

  const handleSubmit = () => {
    if (value.trim() === "") return;
    setItems([{ id: Math.random().toString(), name: value }, ...items]);
    setValue("");
  };

  const handleDelete = (id: string) => {
    setItems(items.filter((item) => item.id !== id));
  };

  const handleComplete = (id: string) => {
    setItems(
      items.map((item) => {
        if (item.id === id) {
          return { ...item, completed: item.completed ? undefined : Date.now() };
        }
        return item;
      })
    );
  };

  return (
    <FlatList
      data={items}
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
          isCompleted={Boolean(item.completed)}
        />
      )}
    />
  );
  {
    /* <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer} stickyHeaderIndices={[0]}> */
  }
  {
    /* <Link href="/counter" style={{ textAlign: "center", marginBottom: 18, fontSize: 24 }}>
        Go to Counter
      </Link> */
  }
  {
    /* <TextInput
          value={value}
          onChangeText={setValue}
          returnKeyType="done"
          onSubmitEditing={handleSubmit}
          placeholder="E.g. Coffee"
          style={styles.textInput}
        />
        {items.map((item) => (
          <ShoppingListItem key={item.id} name={item.name} />
        ))} */
  }
  {
    /* <ShoppingListItem name="Coffee" />
      <ShoppingListItem name="Tea" isCompleted />
      <ShoppingListItem name="Sprite" /> */
  }
  {
    /* </ScrollView> */
  }
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
