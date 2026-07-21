# Dokumentasi Spesifikasi & Konsep Aplikasi: Journal Review Questionnaire Platform

## 1. Ringkasan Eksekutif & Tujuan Sistem

Aplikasi ini adalah **Platform Kuesioner & Penilaian Jurnal Ilmiah Bilingual** berbasis web. Konsep dasarnya menggabungkan keandalan pembuatan formulir interaktif (seperti *Google Forms*) dengan fitur khusus berupa *Dual-Language PDF Viewer* dan **Dashboard Analitik/Statistik Tingkat Lanjut**.

Tujuan utama sistem ini adalah memungkinkan **Admin** mengunggah satu judul artikel jurnal ilmiah yang tersedia dalam dua versi bahasa (**Bahasa Indonesia** dan **Bahasa Inggris**), menyusun daftar pertanyaan evaluasi berbasis **Skala 1–5 (Likert & Star Rating)**, serta membagikan tautan kuesioner kepada **Partisipan/Responden**. 

Di sisi partisipan, sistem menyediakan antarmuka *split-screen* interaktif yang memungkinkan responden membaca naskah jurnal (pilih versi bahasa) sambil mengisi lembar penilaian. Di sisi Admin, seluruh data masukan diolah secara *real-time* menjadi visualisasi grafik interaktif, indikator rata-rata (*mean score*), serta fitur filter berbasis bahasa dan pertanyaan spesifik.

---

## 2. Arsitektur Teknologis & Stack Sistem

Sistem ini dirancang menggunakan arsitektur modern berbasis **Laravel Inertia**:

* **Backend Framework:** Laravel (PHP) — Mengelola logika bisnis, autentikasi admin, *file storage* (PDF), manajemen database, serta kalkulasi statistik dan agregasi data masukan.
* **Adapter / Bridge:** Inertia.js — Menghubungkan backend Laravel secara mulus dengan komponen antarmuka *Single Page Application* (SPA) tanpa perlu membangun REST API terpisah secara manual.
* **Frontend Framework:** React.js atau Vue.js (digunakan bersama Inertia) — Membangun komponen antarmuka yang sangat responsif, *state management* untuk *Form Builder*, *interactive charts*, dan *embedded PDF viewer*.
* **Styling & UI Library:** Tailwind CSS dikombinasikan dengan komponen modern (seperti Shadcn UI / Radix UI) untuk menghasil tata letak yang bersih, elegan, dan profesional.
* **Visualisasi Grafik (Charts):** Recharts atau Chart.js — Untuk menyajikan grafik statistik interaktif pada Dashboard Admin.
* **PDF Reader Engine:** Engine PDF berbasis web (seperti `react-pdf` / `PDF.js`) yang ringan, mendukung navigasi halaman, *zoom*, dan perpindahan bahasa secara cepat.

---

## 3. Fitur Utama Sisi Admin (Management & Analytics)

Sisi Admin dilindungi oleh sistem autentikasi dan berfungsi sebagai pusat kendali seluruh aktivitas kuesioner.

### 3.1. Manajemen Jurnal & Upload Berkas Dual-Bahasa
* **Metadata Jurnal:** Admin dapat menginput informasi identitas jurnal seperti Judul Artikel, Penulis/Peneliti, Abstrak/Rangkuman, Kategori/Rumpun Ilmu, dan Status Publikasi.
* **Upload Berkas PDF Dual-Bahasa:**
  * Admin mengunggah **satu berkas PDF versi Bahasa Indonesia**.
  * Admin mengunggah **satu berkas PDF versi Bahasa Inggris**.
  * Sistem menyimpan kedua berkas secara aman pada *storage* server dan mengaitkannya pada satu entitas jurnal yang sama.
* **Manajemen Akses & Link Sharing:**
  * Generasi *Unique Public Slug / URL* khusus untuk setiap jurnal yang diunggah (misalnya: `/review/jurnal-metode-ai-2026`).
  * Fitur untuk mengaktifkan/nonaktifkan status kuesioner (Buka/Tutup) serta pengaturan tanggal tenggat waktu (*deadline*).

### 3.2. Form Builder Kuesioner (Multi-Format Skala 1–5)
Admin dapat menambahkan, menyunting, menghapus, dan mengatur urutan pertanyaan kuesioner khusus untuk setiap jurnal. Setiap pertanyaan disimpan dengan nilai numerik baku **1 sampai 5**, namun Admin dapat menentukan **Format Opsi (Tipe Skala)** yang akan ditayangkan kepada partisipan:

1. **Format Skala Pemahaman (Comprehension Scale):**
   * Menilai tingkat pemahaman responden terhadap materi/bab jurnal.
   * Tingkat visual: `1 = Sangat Tidak Paham`, `2 = Tidak Paham`, `3 = Cukup Paham`, `4 = Paham`, `5 = Sangat Paham`.
2. **Format Skala Keterbacaan & Kejelasan (Readability Scale):**
   * Menilai tingkat kemudahan penyampaian bahasa, grafik, atau penjelasan.
   * Tingkat visual: `1 = Sangat Sulit Dimengerti`, `2 = Sulit Dimengerti`, `3 = Cukup Dimengerti`, `4 = Mudah Dimengerti`, `5 = Sangat Mudah Dimengerti`.
3. **Format Rating Bintang (Star Rating Scale):**
   * Menilai kualitas keseluruhan (*overall quality*) visual, metodologi, atau kontribusi jurnal.
   * Tingkat visual: Tampilan ikon 5 Bintang (⭐1 = Sangat Buruk / Tidak Baik hingga ⭐5 = Sangat Baik / Kualitas Tinggi).

### 3.3. Dashboard Statistik & Analitik Profesional
Dashboard ini menjadi tempat Admin memantau hasil masukan kuesioner secara visual dan mendalam:

* **Ringkasan Ringkas (Metric Cards):**
  * Total RespondenKeseluruhan.
  * Breakdown Responden berdasarkan versi bahasa yang dibaca (Jumlah pembaca versi Indonesia vs. Inggris).
  * *Overall Average Score* (Nilai rata-rata keseluruhan jurnal).
* **Panel Filter Interaktif (Top Control Bar):**
  * **Filter Pertanyaan Spesifik:** Dropdown untuk menampilkan statistik seluruh pertanyaan sekaligus, atau memfokuskan tampilan hanya pada satu pertanyaan tertentu.
  * **Filter Versi Bahasa Responden:** Filter untuk melihat hasil masukan khusus dari responden yang membaca versi Indonesia, versi Inggris, atau gabungan keduanya.
  * **Filter Rentang Waktu / Tanggal:** Melihat tren jawaban berdasarkan periode pengisian.
  * **Pencarian Cepat:** *Search bar* untuk menemukan pertanyaan tertentu berdasarkan kata kunci.
* **Visualisasi Grafik Beragam (Multi-Chart Representation):**
  * **Horizontal / Stacked Bar Chart:** Digunakan untuk pertanyaan tipe *Skala Pemahaman* dan *Skala Keterbacaan*. Grafik memperlihatkan distribusi jumlah pengisi pada setiap skor (1 s/d 5) lengkap dengan perbandingan warna antara pembaca versi Indonesia dan Inggris.
  * **Donut / Pie Chart:** Digunakan untuk pertanyaan tipe *Star Rating*. Menampilkan proporsi persentase responden yang memberikan bintang 1 hingga bintang 5 secara estetis.
  * **Indikator Statistik Tambahan:** Setiap kartu pertanyaan menampilkan *Mean Score* (Rata-rata hitung), *Modus* (Skor yang paling banyak dipilih), serta total partisipan yang menjawab pertanyaan tersebut.
* **Ekspor Data:** Fitur untuk mengunduh seluruh data jawaban mentah dalam format spreadsheet (Excel/CSV) serta unduhan ringkasan laporan PDF.

---

## 4. Fitur Utama Sisi Partisipan / Pengisi Kuesioner (Public User)

Halaman partisipan didesain dengan pendekatan **User Experience (UX) modern berbasis Split-Screen (Layar Terbagi)**, mengutamakan kenyamanan membaca naskah ilmiah tanpa perlu berpindah-pindah tab browser.

### 4.1. Tata Letak Split-Screen Interaktif
* **Sisi Terpisah (Dual-Pane Layout):**
  * **Sisi Kiri (PDF Reader Area):** Menampilkan dokumen PDF jurnal secara penuh. Dilengkapi bilah navigasi PDF untuk *zoom in/out*, berpindah halaman, serta mode *fullscreen*.
  * **Sisi Kanan (Form Kuesioner Area):** Menampilkan daftar pertanyaan yang *sticky* (tetap di posisi atau dapat di-scroll secara independen), sehingga partisipan bisa mengisi jawaban sambil membaca naskah di sebelah kiri.
* **Peralihan Bahasa Artikel (Language Switcher Bar):**
  * Terdapat tombol *toggle/tab switcher* yang sangat jelas di bagian atas PDF Reader: **🇮🇩 Bahasa Indonesia** | **🇬🇧 English**.
  * Saat partisipan menekan tombol bahasa, tampilan PDF di sebelah kiri akan langsung berganti ke versi berkas bahasa yang dipilih tanpa merefresh seluruh halaman dan tanpa menghapus jawaban kuesioner yang sudah diisi.
  * Sistem mencatat otomatis versi bahasa mana yang aktif/terakhir dibaca oleh partisipan saat melakukan *submit*.

### 4.2. Pengisian Formulir & Validasi
* **Identitas Responden (Pengondisian):** Field input opsional atau wajib untuk mengisi nama, email, atau latar belakang (misal: Mahasiswa, Dosen, Peneliti, Umum).
* **Komponen Jawaban Interaktif:**
  * Pilihan jawaban skala 1–5 disajikan berupa *Radio Badge Button* yang luas dan responsif (mudah diklik baik di komputer maupun perangkat tablet/mobile).
  * Khusus pertanyaan bintang, disajikan berupa ikon *Star Rating* interaktif yang berubah warna saat diarahkan kursor (*hover effect*).
* **Auto-Save Draft (Penyimpanan Lokal):** Menggunakan *Local Storage* browser agar jawaban partisipan tersimpan sementara saat tidak sengaja menutup halaman atau mengalami gangguan koneksi.
* **Halaman Sukses & Konfirmasi:** Tampilan terima kasih yang rapi setelah masukan berhasil terkirim, beserta ringkasan singkat bahwa ulasan telah tercatat.

---

## 5. Konsep Alur Kerja Sistem (Workflow)

### Alur Admin:
1. Admin masuk ke sistem (*login*).
2. Admin membuat entitas kuesioner jurnal baru dan mengisi judul serta abstrak.
3. Admin mengunggah dua berkas: `jurnal_indonesia.pdf` dan `jurnal_inggris.pdf`.
4. Admin menyusun daftar pertanyaan kuesioner dan memilih format skalanya untuk masing-masing pertanyaan (Pemahaman, Keterbacaan, atau Rating Bintang).
5. Admin menyalin *shareable link* kuesioner dan membagikannya kepada para penilai/partisipan.
6. Admin membuka Dashboard Statistik untuk memantau grafik masukan, menggunakan filter bahasa/pertanyaan, dan mengunduh laporan.

### Alur Partisipan:
1. Partisipan membuka tautan kuesioner (*shareable link*).
2. Partisipan melihat tampilan *split-screen*: PDF jurnal di kiri, formulir di kanan.
3. Partisipan memilih bahasa artikel yang ingin dibaca (Indonesia atau Inggris) pada tombol pemilih bahasa.
4. Partisipan membaca artikel jurnal sambil menjawab setiap pertanyaan skala 1–5 pada formulir di sebelah kanan.
5. Partisipan menekan tombol *Submit*. Sistem menyimpan seluruh skor jawaban beserta rekaman versi bahasa yang dibaca oleh partisipan.

---

## 6. Struktur Data & Konsep Relasi Database (Logical Concept)

Untuk mendukung seluruh fungsionalitas di atas, sistem secara logis membutuhkan entitas data berikut:

1. **Entitas Pengguna (Users):** Mengelola data autentikasi Admin.
2. **Entitas Jurnal (Journals):** Menyimpan judul, deskripsi/abstrak, status aktif, link slug, serta jalur direktori penyimpanan berkas `file_pdf_id` (Indonesia) dan `file_pdf_en` (Inggris).
3. **Entitas Pertanyaan (Questions):** Terhubung ke Jurnal. Menyimpan teks pertanyaan, urutan tampilan (*sort order*), dan tipe skala (`comprehension`, `readability`, `star_rating`).
4. **Entitas Sesi Responden / Tanggapan (Responses):** Menyimpan data partisipan (nama/email), identifikasi bahasa yang digunakan saat membaca (`id` atau `en`), serta waktu *submit*.
5. **Entitas Jawaban (Answers):** Terhubung ke Sesi Responden dan Pertanyaan. Menyimpan skor angka mutlak (`1`, `2`, `3`, `4`, atau `5`). Nilai mutlak inilah yang digunakan oleh backend Laravel untuk menghitung rerata (*mean*), persentase, dan membentuk dataset grafik.

---

## 7. Penutup & Catatan Pengembang

Dokumen spesifikasi naratif ini dirancang sebagai acuan utama bagi pengembang AI/Human dalam membangun aplikasi **Journal Review Questionnaire Platform**. Penekanan utama dari aplikasi ini adalah keberhasilan integrasi antara **Inertia.js** dalam menangani UI *split-screen* yang *smooth*, kemudahan perpindahan berkas PDF bilingual, serta penyajian **Dashboard Statistik** berbasis grafik interaktif yang kaya akan fitur filter bagi Admin.
