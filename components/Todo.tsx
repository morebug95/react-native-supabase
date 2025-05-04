import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  FlatList,
  StyleSheet,
  Alert,
  ActivityIndicator,
} from "react-native";
import { supabase } from "../lib/supabase";

// Tipe data untuk Todo
interface Todo {
  id: string;
  task: string;
  is_complete: boolean;
  user_id: string;
  created_at: string;
}

export default function TodoList() {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [newTask, setNewTask] = useState("");
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editText, setEditText] = useState("");

  // Mengambil daftar todos saat komponen di-mount
  useEffect(() => {
    fetchTodos();
  }, []);

  // Fungsi untuk mengambil data todos dari Supabase
  const fetchTodos = async () => {
    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        throw new Error("User not authenticated");
      }

      const { data, error } = await supabase
        .from("todos")
        .select("*")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false });

      if (error) {
        throw error;
      }

      setTodos(data || []);
    } catch (error: any) {
      Alert.alert("Error", error.message || "Failed to fetch todos");
      console.error("Error fetching todos:", error);
    } finally {
      setLoading(false);
    }
  };

  // CREATE: Fungsi untuk menambahkan todo baru
  const addTodo = async () => {
    if (!newTask.trim()) {
      Alert.alert("Error", "Task cannot be empty");
      return;
    }

    try {
      setLoading(true);
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        throw new Error("User not authenticated");
      }

      const { data, error } = await supabase
        .from("todos")
        .insert([{ task: newTask, is_complete: false, user_id: user.id }])
        .select();

      if (error) {
        throw error;
      }

      setTodos([...(data || []), ...todos]);
      setNewTask("");
      Alert.alert("Success", "Todo added successfully");
    } catch (error: any) {
      Alert.alert("Error", error.message || "Failed to add todo");
      console.error("Error adding todo:", error);
    } finally {
      setLoading(false);
    }
  };

  // UPDATE: Fungsi untuk mengedit todo
  const updateTodo = async (id: string, task: string) => {
    try {
      setLoading(true);
      const { error } = await supabase
        .from("todos")
        .update({ task })
        .eq("id", id);

      if (error) {
        throw error;
      }

      setTodos(
        todos.map((todo) => (todo.id === id ? { ...todo, task } : todo))
      );
      setEditingId(null);
      Alert.alert("Success", "Todo updated successfully");
    } catch (error: any) {
      Alert.alert("Error", error.message || "Failed to update todo");
      console.error("Error updating todo:", error);
    } finally {
      setLoading(false);
    }
  };

  // UPDATE: Fungsi untuk mengubah status todo (complete/incomplete)
  const toggleTodoStatus = async (id: string, currentStatus: boolean) => {
    try {
      setLoading(true);
      const { error } = await supabase
        .from("todos")
        .update({ is_complete: !currentStatus })
        .eq("id", id);

      if (error) {
        throw error;
      }

      setTodos(
        todos.map((todo) =>
          todo.id === id ? { ...todo, is_complete: !currentStatus } : todo
        )
      );
    } catch (error: any) {
      Alert.alert("Error", error.message || "Failed to update todo status");
      console.error("Error toggling todo status:", error);
    } finally {
      setLoading(false);
    }
  };

  // DELETE: Fungsi untuk menghapus todo
  const deleteTodo = async (id: string) => {
    try {
      setLoading(true);
      const { error } = await supabase.from("todos").delete().eq("id", id);

      if (error) {
        throw error;
      }

      setTodos(todos.filter((todo) => todo.id !== id));
      Alert.alert("Success", "Todo deleted successfully");
    } catch (error: any) {
      Alert.alert("Error", error.message || "Failed to delete todo");
      console.error("Error deleting todo:", error);
    } finally {
      setLoading(false);
    }
  };

  // Render item untuk FlatList
  const renderItem = ({ item }: { item: Todo }) => {
    const isEditing = editingId === item.id;

    return (
      <View style={styles.todoItem}>
        {isEditing ? (
          <View style={styles.editContainer}>
            <TextInput
              style={styles.editInput}
              value={editText}
              onChangeText={setEditText}
              autoFocus
            />
            <TouchableOpacity
              style={styles.saveButton}
              onPress={() => updateTodo(item.id, editText)}
            >
              <Text style={styles.buttonText}>Save</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.cancelButton}
              onPress={() => setEditingId(null)}
            >
              <Text style={styles.buttonText}>Cancel</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <View style={styles.todoContent}>
            <TouchableOpacity
              style={[styles.checkbox, item.is_complete && styles.checked]}
              onPress={() => toggleTodoStatus(item.id, item.is_complete)}
            />
            <Text
              style={[
                styles.todoText,
                item.is_complete && styles.completedText,
              ]}
            >
              {item.task}
            </Text>
            <View style={styles.actions}>
              <TouchableOpacity
                style={styles.editButton}
                onPress={() => {
                  setEditingId(item.id);
                  setEditText(item.task);
                }}
              >
                <Text style={styles.buttonText}>Edit</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.deleteButton}
                onPress={() => deleteTodo(item.id)}
              >
                <Text style={styles.buttonText}>Delete</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
      </View>
    );
  };

  if (loading && todos.length === 0) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color="#0052cc" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Todo List</Text>

      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          placeholder="Add a new task..."
          value={newTask}
          onChangeText={setNewTask}
        />
        <TouchableOpacity
          style={styles.addButton}
          onPress={addTodo}
          disabled={loading}
        >
          <Text style={styles.buttonText}>Add</Text>
        </TouchableOpacity>
      </View>

      {todos.length === 0 ? (
        <Text style={styles.emptyText}>No todos yet. Add one above!</Text>
      ) : (
        <FlatList
          data={todos}
          renderItem={renderItem}
          keyExtractor={(item) => item.id}
          style={styles.list}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#f5f5f5",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
    textAlign: "center",
  },
  inputContainer: {
    flexDirection: "row",
    marginBottom: 20,
  },
  input: {
    flex: 1,
    backgroundColor: "white",
    borderRadius: 5,
    padding: 10,
    borderWidth: 1,
    borderColor: "#ddd",
    marginRight: 10,
  },
  addButton: {
    backgroundColor: "#0052cc",
    padding: 10,
    borderRadius: 5,
    justifyContent: "center",
  },
  todoItem: {
    backgroundColor: "white",
    borderRadius: 5,
    padding: 15,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: "#ddd",
  },
  todoContent: {
    flexDirection: "row",
    alignItems: "center",
  },
  checkbox: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: "#0052cc",
    marginRight: 10,
  },
  checked: {
    backgroundColor: "#0052cc",
  },
  todoText: {
    flex: 1,
    fontSize: 16,
  },
  completedText: {
    textDecorationLine: "line-through",
    color: "#888",
  },
  actions: {
    flexDirection: "row",
  },
  editButton: {
    backgroundColor: "#4CAF50",
    padding: 8,
    borderRadius: 5,
    marginRight: 5,
  },
  deleteButton: {
    backgroundColor: "#F44336",
    padding: 8,
    borderRadius: 5,
  },
  buttonText: {
    color: "white",
    fontWeight: "bold",
  },
  centered: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  list: {
    flex: 1,
  },
  emptyText: {
    textAlign: "center",
    marginTop: 50,
    fontSize: 16,
    color: "#888",
  },
  editContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  editInput: {
    flex: 1,
    backgroundColor: "#f0f0f0",
    borderRadius: 5,
    padding: 8,
    marginRight: 10,
  },
  saveButton: {
    backgroundColor: "#4CAF50",
    padding: 8,
    borderRadius: 5,
    marginRight: 5,
  },
  cancelButton: {
    backgroundColor: "#F44336",
    padding: 8,
    borderRadius: 5,
  },
});
