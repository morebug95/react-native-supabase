import React from "react";
import { View, StyleSheet } from "react-native";
import TodoList from "../components/Todo";
import { SafeAreaView } from "react-native-safe-area-context";

export default function TodoScreen() {
  return (
    <SafeAreaView style={styles.container}>
      <TodoList />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
  },
});
