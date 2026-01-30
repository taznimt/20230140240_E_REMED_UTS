# Library Geo 📚✨
Backend sederhana manajemen perpustakaan dengan fitur peminjaman berbasis lokasi (geolocation).  
Autentikasi **tanpa JWT**, role disimulasikan menggunakan **HTTP Header** sesuai instruksi tugas.

## ✨ Fitur Utama
- **Public**
  - Melihat daftar buku
  - Melihat detail buku
- **Admin (x-user-role: admin)**
  - Tambah buku
  - Update buku
  - Hapus buku
- **User (x-user-role: user & x-user-id)**
  - Meminjam buku + menyimpan **latitude & longitude**
  - Stok buku otomatis berkurang saat dipinjam

---

## 🧰 Tech Stack
- **Backend:** Node.js, Express.js
- **Database:** MySQL + Sequelize ORM
- **Frontend:** React (Vite) + TailwindCSS

---

## 📦 Struktur Database
### Tabel `books`
Kolom: `id`, `title`, `author`, `stock`

### Tabel `borrow_logs`
Kolom: `id`, `user_id`, `book_id`, `borrow_date`, `latitude`, `longitude`, `created_at`, `updated_at`

> Catatan: tabel `SequelizeMeta` dibuat otomatis oleh sequelize untuk tracking migration.

---

## ⚙️ Cara Menjalankan Aplikasi

### 1) Persiapan Database (MySQL)
1. Buka MySQL Workbench
2. Buat database kosong (schema), contoh: `library_geo`
   ```sql
   CREATE DATABASE library_geo;
   ```
3. Pastikan konfigurasi database di backend sudah sesuai (file `.env`), contoh:
   ```env
   DB_HOST=localhost
   DB_USER=root
   DB_NAME=library_geo
   DB_PORT=3306
   PORT=3000
   ```

### 2) Menjalankan Backend
Masuk ke folder backend:
```bash
npm install
npm run db:migrate
npm run dev
```

Backend berjalan di:
- `http://localhost:3000`

### 3) Menjalankan Frontend
Buka terminal baru:
```bash
cd frontend
npm install
npm run dev
```

Frontend berjalan di:
- `http://localhost:5173`

---

## 🧪 Testing Endpoint API (Postman)

### Public
- `GET /api/books` → melihat semua buku  
- `GET /api/books/:id` → detail buku

### Admin (Header wajib)
Headers:
- `x-user-role: admin`

Endpoints:
- `POST /api/books`
- `PUT /api/books/:id`
- `DELETE /api/books/:id`

### User (Header wajib)
Headers:
- `x-user-role: user`
- `x-user-id: 10` (contoh)

Endpoint:
- `POST /api/borrow`

Body payload contoh:
```json
{
  "bookId": 1,
  "latitude": -6.2088,
  "longitude": 106.8456
}
```

Business Logic:
- Stok buku berkurang
- Data peminjaman tersimpan di tabel `borrow_logs` beserta koordinat

---

## ✅ Screenshot Hasil Aplikasi

> Semua screenshot ada di folder: `ss/`

### A) Tampilan Web
**Public Mode**  
![Halaman Public](ss/Halaman%20public.png)

**User Mode**  
![Halaman User](ss/Halaman%20User.png)
![Berhasil meminjam buku](ss/berhasil%20meminjam%20buku.png)

**Admin Mode**  
![Halaman Admin](ss/Halaman%20Admin.png)

---

### B) Test Endpoint API (Postman)
**GET semua buku**  
![Lihat semua buku](ss/lihat%20semua%20buku.png)

**GET detail buku**  
![Detail buku](ss/detail%20buku.png)

**POST tambah buku (Admin)**  
![Tambah buku](ss/tambah%20buku.png)  
![Tambah buku header](ss/tambahbuku(header).png)

**PUT update buku (Admin)**  
![Update buku](ss/update%20buku.png)

**DELETE buku (Admin)**  
![Delete buku](ss/delete%20buku.png)  
![Buku berhasil dihapus](ss/buku%20berhasil%20di%20hapus.png)

**POST pinjam buku (User)**  
![Header pinjam buku](ss/header%20pinjam%20buku.png)  
![Pinjam buku](ss/pinjam%20buku.png)  


---

### C) Struktur Database (MySQL Workbench)
**Borrow Logs (bukti lokasi tersimpan)**  
![Borrow log](ss/borrow%20log.png)

---

### D) Bukti Stok Berkurang
**Sebelum pinjam**  
![Sebelum pinjam](ss/sebelum%20pinjam%20buku.png)

**Setelah pinjam**  
![Setelah pinjam](ss/setelah%20pinjam%20buku.png)

---

## 🧾 Validasi Sederhana
- `title` dan `author` tidak boleh kosong (backend).  
Bukti validasi:  
![Validasi 1](ss/validasi1.png)  
![Validasi 2](ss/validasi2.png)
