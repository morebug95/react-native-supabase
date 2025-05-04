import React, { useEffect } from "react";
import { StyleSheet } from "react-native";
import TodoList from "../../components/Todo";
import { SafeAreaView } from "react-native-safe-area-context";
import { supabase } from "../../lib/supabase";
import { useRouter } from "expo-router";

export default function TodoScreen() {
  const router = useRouter();

  // Check if user is authenticated
  useEffect(() => {
    checkUser();
  }, []);

  const checkUser = async () => {
    const { data } = await supabase.auth.getSession();

    if (!data.session) {
      // Redirect to login if not authenticated
      router.replace("/login");
    }
  };

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
