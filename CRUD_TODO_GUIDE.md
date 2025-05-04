# Panduan Implementasi CRUD dengan React Native dan Supabase

Dokumen ini menjelaskan bagaimana membuat aplikasi Todo sederhana menggunakan React Native dan Supabase untuk mengimplementasikan operasi CRUD (Create, Read, Update, Delete).

## Prasyarat

1. Sudah memiliki project React Native dengan Expo
2. Sudah memiliki akun dan project Supabase
3. Sudah mengkonfigurasi autentikasi di Supabase

## 1. Setup Database di Supabase

Jalankan script SQL berikut di SQL Editor Supabase untuk membuat tabel `todos`:

```sql
-- Membuat tabel todos
CREATE TABLE IF NOT EXISTS todos (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) NOT NULL,
  task TEXT NOT NULL,
  is_complete BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT now() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Mengaktifkan Row Level Security (RLS)
ALTER TABLE todos ENABLE ROW LEVEL SECURITY;

-- Policies untuk membatasi akses ke data sesuai user yang terautentikasi
CREATE POLICY todos_select_policy ON todos
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY todos_insert_policy ON todos
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY todos_update_policy ON todos
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY todos_delete_policy ON todos
  FOR DELETE USING (auth.uid() = user_id);
```

## 2. Implementasi Komponen Todo

Komponen `Todo.tsx` kita berisi seluruh logika CRUD untuk:

- **Create**: Menambah todo baru
- **Read**: Menampilkan daftar todo dari database
- **Update**: Mengubah isi todo atau mengubah status (complete/incomplete)
- **Delete**: Menghapus todo

### Penjelasan Kode

#### Setup dan State

```javascript
const [todos, setTodos] = useState<Todo[]>([]);
const [newTask, setNewTask] = useState('');
const [loading, setLoading] = useState(true);
const [editingId, setEditingId] = useState<string | null>(null);
const [editText, setEditText] = useState('');
```

#### READ: Mengambil Data Todo

```javascript
const fetchTodos = async () => {
  try {
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      throw new Error('User not authenticated');
    }

    const { data, error } = await supabase
      .from('todos')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false });

    if (error) {
      throw error;
    }

    setTodos(data || []);
  } catch (error: any) {
    Alert.alert('Error', error.message || 'Failed to fetch todos');
    console.error('Error fetching todos:', error);
  } finally {
    setLoading(false);
  }
};
```

#### CREATE: Menambah Todo Baru

```javascript
const addTodo = async () => {
  if (!newTask.trim()) {
    Alert.alert('Error', 'Task cannot be empty');
    return;
  }

  try {
    setLoading(true);
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      throw new Error('User not authenticated');
    }

    const { data, error } = await supabase
      .from('todos')
      .insert([{ task: newTask, is_complete: false, user_id: user.id }])
      .select();

    if (error) {
      throw error;
    }

    setTodos([...(data || []), ...todos]);
    setNewTask('');
    Alert.alert('Success', 'Todo added successfully');
  } catch (error: any) {
    Alert.alert('Error', error.message || 'Failed to add todo');
    console.error('Error adding todo:', error);
  } finally {
    setLoading(false);
  }
};
```

#### UPDATE: Mengubah Todo

```javascript
const updateTodo = async (id: string, task: string) => {
  try {
    setLoading(true);
    const { error } = await supabase
      .from('todos')
      .update({ task })
      .eq('id', id);

    if (error) {
      throw error;
    }

    setTodos(todos.map(todo => todo.id === id ? { ...todo, task } : todo));
    setEditingId(null);
    Alert.alert('Success', 'Todo updated successfully');
  } catch (error: any) {
    Alert.alert('Error', error.message || 'Failed to update todo');
    console.error('Error updating todo:', error);
  } finally {
    setLoading(false);
  }
};
```

#### DELETE: Menghapus Todo

```javascript
const deleteTodo = async (id: string) => {
  try {
    setLoading(true);
    const { error } = await supabase
      .from('todos')
      .delete()
      .eq('id', id);

    if (error) {
      throw error;
    }

    setTodos(todos.filter(todo => todo.id !== id));
    Alert.alert('Success', 'Todo deleted successfully');
  } catch (error: any) {
    Alert.alert('Error', error.message || 'Failed to delete todo');
    console.error('Error deleting todo:', error);
  } finally {
    setLoading(false);
  }
};
```

## 3. Tambahkan Todo ke Navigasi

Untuk mengakses halaman Todo, perlu menambahkannya ke navigasi aplikasi. Pada file `app/(tabs)/_layout.tsx`:

```jsx
<Tabs.Screen
  name="todo"
  options={{
    title: "Todo",
    tabBarIcon: ({ color }) => (
      <IconSymbol size={28} name="checklist" color={color} />
    ),
  }}
/>
```

## 4. Buat Halaman Todo

File `app/(tabs)/todo.tsx` untuk menampilkan halaman Todo dan mengautentikasi pengguna:

```jsx
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
```

## 5. Pengujian

Untuk menguji aplikasi, pastikan:

1. Pengguna berhasil login
2. Navigasi ke tab Todo
3. Mencoba semua operasi CRUD:
   - Menambah todo baru
   - Melihat daftar todo
   - Mengedit todo
   - Menandai todo sebagai selesai
   - Menghapus todo

## 6. Pengembangan Lanjutan

Aplikasi ini dapat dikembangkan dengan menambahkan fitur:

1. Kategori todo
2. Deadline dan pengingat
3. Prioritas todo
4. Filter dan pencarian
5. Sinkronisasi offline

## Kesimpulan

Dengan kombinasi React Native dan Supabase, sangat mudah membuat aplikasi CRUD dengan autentikasi dan database real-time. Kode yang disediakan menunjukkan contoh sederhana yang dapat dikembangkan menjadi aplikasi yang lebih kompleks.
