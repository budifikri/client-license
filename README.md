# Sistem Aktivasi Perangkat

Sebuah project full-stack yang mengimplementasikan sistem aktivasi perangkat dengan fitur pembacaan informasi perangkat komputer, integrasi dengan registry Windows, dan API backend menggunakan Express.js.

## 1. Info Kegunaan Program

Project ini merupakan sistem simulasi untuk aktivasi perangkat perangkat lunak. Aplikasi ini mencakup:

- Tampilan login yang responsif dan modern
- Proses aktivasi perangkat berjenjang (Pemilihan Produk → Pembayaran → Konfirmasi Pembayaran → Aktivasi)
- Pembacaan informasi perangkat komputer secara menyeluruh
- Integrasi dengan registry Windows untuk menyimpan informasi perangkat
- **Koneksi API Real-time**: Otomatis memeriksa koneksi ke API saat aplikasi dimuat
- **Status Koneksi Visual**: Indikator koneksi dengan ikon (🟢 Online/🔴 Offline) 
- **Tombol Aktivasi Dinamis**: Tombol "Aktivasi Software" otomatis diaktifkan/dinonaktifkan berdasarkan status koneksi
- **Endpoint Health Check**: Memverifikasi koneksi ke `/health` endpoint API
- **Simulasi status koneksi internet dan server**
- **Simulasi status aktivasi perangkat**
- **Responsive Design**: Optimal di mobile, tablet, dan desktop
- **Mobile-First Approach**: Layout adaptif dengan breakpoint yang tepat
- **Gradient Background**: Desain modern dengan Tailwind CSS v4

Aplikasi ini dirancang untuk memberikan pengalaman aktivasi perangkat yang realistis dengan memanfaatkan informasi perangkat fisik untuk keamanan lisensi.

## 2. Teknologi yang Digunakan / Infrastruktur

### Frontend
- **React** - Library JavaScript untuk membangun antarmuka pengguna
- **Vite** - Build tool cepat dengan hot module replacement untuk development
- **TypeScript** - Superset dari JavaScript dengan typed system
- **Tailwind CSS v4** - Utility-first framework CSS untuk desain yang cepat dengan konfigurasi berbasis CSS
- **Responsive Design** - Mobile-first approach dengan breakpoint untuk tablet dan desktop

### Backend
- **Express.js** - Framework web untuk Node.js
- **Node.js** - Platform untuk menjalankan JavaScript di sisi server
- **child_process** - Modul Node.js untuk eksekusi perintah shell
- **os** - Modul Node.js untuk informasi sistem operasi
- **API Endpoints** - RESTful API untuk registry operations dan system data
- **Static File Serving** - Serving React build files

### Sistem Operasi
- Windows (untuk fungsi registry)
- Kompatibel dengan berbagai sistem operasi untuk pembacaan informasi perangkat

## 3. Cara Instalasi

### Prasyarat
- Node.js (versi 14 atau lebih baru)
- npm atau yarn package manager

### Instalasi Langkah Demi Langkah

1. Clone atau buat project Anda
   ```bash
   mkdir nama-project
   cd nama-project
   ```

2. Inisialisasi project Vite dengan React dan TypeScript
   ```bash
   npm create vite@latest . -- --template react-ts
   ```

3. Install dependensi frontend dan backend
   ```bash
   npm install
   npm install express
   ```

4. Salin file `App.tsx` ke folder `src/` Anda, gantilah file `App.tsx` bawaan

5. Salin file `registryUtils.cjs` ke folder `src/utils/`

6. Salin file `server.cjs` ke root project Anda

7. Konfigurasi Tailwind CSS v4 (jika belum)
    ```bash
    npm install -D tailwindcss @tailwindcss/postcss postcss autoprefixer
    ```

8. Update file `postcss.config.js`:
    ```js
    export default {
      plugins: {
        '@tailwindcss/postcss': {},
        autoprefixer: {},
      },
    }
    ```

9. Tambahkan ke file `src/index.css`:
    ```css
    @import "tailwindcss";

    @theme {
      --color-indigo-500: #6366f1;
      --color-purple-500: #a855f7;
      --color-pink-500: #ec4899;
    }
    ```

10. **Catatan**: Tailwind CSS v4 menggunakan konfigurasi berbasis CSS, bukan JavaScript. File `tailwind.config.js` tidak diperlukan.

11. Buat file `.env` di root project untuk konfigurasi:
    ```env
    VITE_URL_API=http://localhost:3001  # URL API server (Express server)
    PORT=3001                          # Port untuk server Express
    PRODUCT_ID=...                     # ID produk Anda
    ```

12. Build aplikasi React dan jalankan server
    ```bash
    npm run build
    npm start
    ```

Aplikasi akan berjalan di `http://localhost:3001` dengan frontend dan backend terintegrasi.

## 6. Fitur Responsif

### Breakpoint Design
- **Mobile (< 640px)**: Layout vertikal, text kecil, padding minimal
- **Tablet (640px+)**: Layout horizontal untuk button, text medium
- **Desktop (1024px+)**: Container lebih lebar, layout optimal

### Komponen Responsif
- **Container**: `max-w-md sm:max-w-lg lg:max-w-xl` dengan centering yang sempurna
- **Typography**: `text-sm sm:text-base` untuk keterbacaan optimal
- **Button Layout**: Vertikal di mobile, horizontal di desktop
- **Form Elements**: Padding responsif dengan `p-3 sm:p-4`
- **Status Messages**: Text wrapping untuk mencegah overflow

### Testing Responsif
Gunakan Developer Tools (F12) untuk testing:
1. Buka `http://localhost:5173`
2. Aktifkan Device Mode (Ctrl+Shift+M)
3. Test berbagai ukuran layar
4. Verifikasi centering dan layout adaptif

## 4. Konektivitas API

Aplikasi ini dilengkapi dengan fitur cek koneksi API otomatis yang bekerja sebagai berikut:

### Fitur Utama Konektivitas
- **Pengecekan Otomatis Saat Aplikasi Dimuat**: Koneksi API diperiksa secara otomatis ketika aplikasi pertama kali dimuat
- **Endpoint Health Check**: Mengakses endpoint `/health` dari API dengan header `accept: application/json` sesuai dengan spesifikasi API
- **Tombol Aktivasi Dinamis**: Tombol "Aktivasi Software" otomatis diaktifkan saat koneksi online dan dinonaktifkan saat offline
- **Indikator Koneksi Visual**: Menampilkan status koneksi dengan ikon khusus (🟢 untuk Online, 🔴 untuk Offline)
- **Debugging Lengkap**: Implementasi logging untuk menganalisis status respons API, header, dan body response
- **Fallback URL**: Menggunakan URL API dari environment variable `VITE_URL_API` atau fallback ke `http://localhost:3000`

### Konfigurasi Environment
File `.env` harus berisi:
```
VITE_URL_API=http://localhost:3000  # API server location
PORT=3001                          # Frontend server port
PRODUCT_ID=...                     # Your product ID
```

Catatan penting: Environment variable harus diawali dengan `VITE_` agar dapat diakses di sisi klien (browser).

## 5. API Endpoints

Aplikasi ini menyediakan RESTful API endpoints untuk operasi registry dan informasi sistem:

### Endpoint Tersedia
- **GET /health** - Health check endpoint
- **GET /api/check-register** - Mengecek apakah registry key `HKCU\SOFTWARE\Fikrisoftware_LICENSE` ada
- **GET /api/read-register** - Membaca nilai dari registry key
- **POST /api/write-register** - Menulis data ke registry key (body: JSON object)
- **GET /api/system-data** - Mengembalikan informasi sistem (hostname, user, platform, dll.)

### Contoh Penggunaan API
```bash
# Check registry
curl http://localhost:3001/api/check-register

# Get system data
curl http://localhost:3001/api/system-data

# Write to registry
curl -X POST http://localhost:3001/api/write-register \
  -H "Content-Type: application/json" \
  -d '{"Nama Komputer": "TestPC", "User": "TestUser"}'
```

## 6. Fungsi registryUtils.cjs

File `registryUtils.cjs` menyediakan utilitas untuk operasi registry Windows dan pembacaan informasi sistem. Fungsi ini menggunakan perintah shell `reg` untuk interaksi dengan registry Windows.

### Fungsi Tersedia
- **getSystemData()**: Mengembalikan objek dengan informasi sistem (hostname, user, platform, CPU, memory)
- **checkRegister(callback)**: Mengecek apakah registry key `HKCU\SOFTWARE\Fikrisoftware_LICENSE` ada
- **readRegister(callback)**: Membaca nilai dari registry key
- **writeRegister(data, callback)**: Menulis objek data ke registry key

### Contoh Penggunaan
```javascript
const { checkRegister, readRegister, writeRegister, getSystemData } = require('./src/utils/registryUtils.cjs');

// Get system data
const systemData = getSystemData();
console.log(systemData);

// Check if registry key exists
checkRegister((exists) => {
  console.log('Registry exists:', exists);
});

// Read registry values
readRegister((data, error) => {
  if (error) console.error(error);
  else console.log('Registry data:', data);
});

// Write to registry
const data = { 'Nama Komputer': 'MyPC', 'User': 'MyUser' };
writeRegister(data, (success, error) => {
  if (success) console.log('Data written to registry');
  else console.error('Error:', error);
});
```

### Catatan
- Fungsi ini hanya berfungsi di Windows karena menggunakan perintah `reg`
- Semua fungsi menggunakan callback pattern karena operasi registry adalah asynchronous
- Registry key yang digunakan: `HKCU\SOFTWARE\Fikrisoftware_LICENSE`