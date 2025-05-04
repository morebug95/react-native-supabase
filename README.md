# React Native Supabase CRUD Example

Proyek ini merupakan contoh implementasi operasi CRUD (Create, Read, Update, Delete) menggunakan React Native dan Supabase.

## Fitur

- Autentikasi pengguna (Login & Register)
- Todo list dengan operasi CRUD lengkap:
  - Create: Menambahkan todo baru
  - Read: Menampilkan daftar todo
  - Update: Mengedit todo dan mengubah status (complete/incomplete)
  - Delete: Menghapus todo

## Struktur File Penting

- `components/Todo.tsx`: Komponen utama yang berisi implementasi CRUD
- `app/(tabs)/todo.tsx`: Halaman Todo dalam navigasi tab
- `app/todo.tsx`: Alternative halaman Todo
- `lib/supabase.js`: Konfigurasi client Supabase
- `setup_todos_table.sql`: Script SQL untuk membuat tabel dan konfigurasi di Supabase
- `CRUD_TODO_GUIDE.md`: Dokumentasi panduan lengkap implementasi

## Cara Menggunakan

1. Clone repository ini
2. Jalankan `npm install` untuk menginstal dependensi
3. Setup proyek Supabase dan jalankan script SQL di `setup_todos_table.sql`
4. Update konfigurasi Supabase di `lib/supabase.js`
5. Jalankan aplikasi dengan `npm start` atau `expo start`

## Tentang Proyek

Proyek ini dibuat sebagai materi pembelajaran untuk mata kuliah pengembangan aplikasi mobile dengan React Native dan Supabase.
