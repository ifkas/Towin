import { View, Text, TouchableOpacity, StyleSheet, Alert, Pressable } from "react-native";
import { CircleCheckBig, CircleX } from "lucide-react-native";

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
      <Text style={[styles.itemText, isCompleted ? styles.completedText : undefined]}>{name}</Text>
      <TouchableOpacity
        style={[styles.button, isCompleted ? styles.completedButton : undefined]}
        onPress={handleDelete}
        activeOpacity={0.9}
      >
        <View style={styles.buttonContent}>
          <Text style={styles.buttonText}>{!isCompleted ? "Delete" : "Evoke"}</Text>
          {isCompleted ? <CircleCheckBig color="white" size={24} /> : <CircleX color="white" size={24} />}
        </View>
      </TouchableOpacity>
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
    borderRadius: 10,
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
  buttonContent: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 3,
    paddingVertical: 10,
    paddingHorizontal: 15,
  },
  button: {
    backgroundColor: "blue",
    borderRadius: 5,
  },
  buttonText: {
    color: "white",
    fontSize: 18,
  },
  completedButton: {
    backgroundColor: "gray",
  },
  completedText: {
    color: "gray",
    textDecorationLine: "line-through",
  },
});
