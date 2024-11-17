import { View, Text, TouchableOpacity, StyleSheet, Alert, Pressable } from "react-native";
import { CircleX, Circle, Check } from "lucide-react-native";

type Props = {
  name: string;
  isCompleted?: boolean;
  onDeleted: () => void;
  onToggleComplete?: () => void;
};

export function ShoppingListItem({ name, isCompleted, onDeleted, onToggleComplete }: Props) {
  const handleDelete = () => {
    Alert.alert("Delete", `Are you sure you want to delete ${name}?`, [
      {
        text: "Cancel",
        style: "cancel",
      },
      {
        text: "Delete",
        style: "destructive",
        onPress: onDeleted,
      },
    ]);
  };

  return (
    <Pressable onPress={onToggleComplete} style={[styles.itemsContainer, isCompleted ? styles.completedContainer : undefined]}>
      <View style={styles.row}>
        {isCompleted ? <Check color="gray" size={20} /> : <Circle color="blue" size={20} />}
        <Text numberOfLines={2} style={[styles.itemText, isCompleted ? styles.completedText : undefined]}>
          {name}
        </Text>
      </View>
      <View style={styles.row}>
        <TouchableOpacity onPress={handleDelete} activeOpacity={0.9}>
          <CircleX color={isCompleted ? "gray" : "red"} size={20} />
        </TouchableOpacity>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  itemsContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    borderBottomWidth: 1,
    borderBottomColor: "blue",
    padding: 20,
    borderRadius: 0,
  },
  completedContainer: {
    backgroundColor: "lightgreen",
    borderBottomColor: "green",
  },
  itemText: {
    color: "#000",
    fontWeight: "bold",
    fontSize: 20,
  },
  completedText: {
    color: "gray",
    textDecorationLine: "line-through",
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    gap: 7,
  },
});
