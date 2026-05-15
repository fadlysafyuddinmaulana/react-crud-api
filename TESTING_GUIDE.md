# Testing Guide - React CRUD API dengan Python Integration

Panduan lengkap untuk menguji integrasi Python Analytics Service, Laravel Backend, dan React Frontend.

## Prasyarat

- PHP 8.2+
- Node.js 20+
- Python 3.9+
- PostgreSQL 13+
- Docker & Docker Compose (optional, untuk testing di container)

---

## 1. Testing Local Development

### 1.1 Setup Database

```bash
cd backend-laravel

# Copy env example
cp .env.example .env

# Generate app key
php artisan key:generate

# Setup database (SQLite atau PostgreSQL sesuai .env)
php artisan migrate --seed
```

**Expected Output:**
- Migrations selesai tanpa error
- DatabaseSeeder membuat 1 test user + 10 produk
- Tidak ada unique constraint error

### 1.2 Test Backend API

**Jalankan Laravel:**
```bash
cd backend-laravel
php artisan serve --port=8000
```

**Test endpoint products list** (public):
```bash
curl http://localhost:8000/api/products
```

**Expected Response:**
```json
[
  {
    "id": 1,
    "name": "Laptop Dell Inspiron 15",
    "stock": 45,
    "price": 12500000,
    "image": "https://via.placeholder.com/400x300?text=Laptop+Dell",
    "created_at": "2026-05-15T...",
    "updated_at": "2026-05-15T..."
  },
  ...
]
```

**Authentication:** Not required for quick testing — product CRUD and analysis endpoints are public.

### 1.3 Test Python Service

**Jalankan FastAPI:**
```bash
cd python-service

# Setup venv
python -m venv .venv
# Windows
.venv\Scripts\activate
# macOS/Linux
source .venv/bin/activate

# Install dependencies
pip install -r requirements.txt

# Run server
uvicorn app:app --host 0.0.0.0 --port 8001 --reload
```

**Test health check:**
```bash
curl http://localhost:8001/
```

**Expected Response:**
```json
{
  "message": "Python Analytics Running"
}
```

**Test analysis endpoint:**
```bash
curl http://localhost:8001/analysis/products
```

**Expected Response (dengan data products yang sudah di-seed):**
```json
{
  "total_products": 10,
  "total_stock": 1410,
  "average_price": 3165000.0,
  "max_price": 12500000.0,
  "min_price": 150000.0
}
```

### 1.4 Test Backend → Python Integration

**Pastikan kedua service berjalan**, lalu test endpoint `/api/products/analyze` (publik):

```bash
# Test analyze endpoint (no auth required)
curl http://localhost:8000/api/products/analyze | jq
```

**Expected Response:**
```json
{
  "status": "ok",
  "data": {
    "total_products": 10,
    "total_stock": 1410,
    "average_price": 3165000.0,
    "max_price": 12500000.0,
    "min_price": 150000.0
  }
}
```

**Jika error connection:**
```json
{
  "status": "error",
  "message": "Python service tidak bisa dihubungi: ..."
}
```
→ Pastikan Python service berjalan di port 8001

### 1.5 Test React Frontend

**Jalankan React dev server:**
```bash
cd frontend-react

npm install
npm run dev
```

**Open browser:**
- http://localhost:5173 (default Vite port)

**Test steps:**

1. **Login:** Not applicable — auth removed for quick testing.

2. **Test Product Listing:**
   - Lihat tabel product dengan 10 data yang di-seed
   - Cek kolom: ID, Image, Name, Stock, Price, Actions
   - Stock ditampilkan dengan chip warna (hijau >100, kuning >50, merah ≤50)
   - Price dalam format Rp

3. **Test Analyze Button:**
   - Klik tombol "Analyze" di atas tabel
   - Dialog akan muncul menampilkan hasil JSON
   - Lihat data:
     - total_products: 10
     - total_stock: 1410
     - average_price: ~3.2M
     - max_price: 12.5M
     - min_price: 150K

4. **Test Create Product:**
   - Klik "+ Add Product"
   - Isi form:
     - Name: "Test Product"
     - Stock: 100
     - Price: 500000
     - Upload image (optional)
   - Klik submit
   - Expected: Produk muncul di tabel, counter total menjadi 11

5. **Test Edit Product:**
   - Klik Edit pada salah satu product
   - Ubah nama/stock/price
   - Klik submit
   - Expected: Data terupdate di tabel

6. **Test Delete Product:**
   - Klik Delete pada salah satu product
   - Expected: Produk hilang dari tabel

7. **Test Search:**
   - Ketik nama produk di search box
   - Expected: Tabel difilter berdasarkan nama/ID

---

## 2. Testing Docker Compose

```bash
# Dari root folder
docker-compose up --build
```

**Expected:**
- React container running di port 5173
- Laravel container running di port 8000
- Python container running di port 8001
- PostgreSQL container running di port 5432

**Test dari browser:**
- Frontend: http://localhost:5173
- Backend API: http://localhost:8000/api/products
- Python API: http://localhost:8001/

**Debug tips:**
```bash
# View logs
docker-compose logs -f backend
docker-compose logs -f python-service
docker-compose logs -f frontend

# Drop into container
docker-compose exec backend bash
docker-compose exec python-service bash

# Reset database
docker-compose exec backend php artisan migrate:fresh --seed
```

---

## 3. Verifikasi Checklist

Gunakan checklist ini untuk memastikan semua komponen berjalan:

### Backend (Laravel)
- [ ] Migrations selesai: `php artisan migrate:fresh --seed`
- [ ] 10 produk tersimpan di DB
- [ ] GET `/api/products` mengembalikan 10 items
- [ ] GET `/api/products/analyze` (public) memanggil Python service
- [ ] Response `/api/products/analyze` memiliki struktur: `{ status, data: { total_products, total_stock, ... } }`

### Python Service
- [ ] Requirements berhasil di-install: `pip install -r requirements.txt`
- [ ] GET `/` return: `{ "message": "Python Analytics Running" }`
- [ ] GET `/analysis/products` return analytics data
- [ ] Database connection string valid di `.env` atau Docker compose

- ### React Frontend
- [ ] Tabel produk menampilkan 10 items dari DB
- [ ] Tombol "Analyze" berfungsi, dialog muncul dengan JSON result
- [ ] Tombol "+ Add Product" berfungsi
- [ ] Tombol "Edit" berfungsi
- [ ] Tombol "Delete" berfungsi
- [ ] Search filter berfungsi

### Docker Integration
- [ ] `docker-compose up --build` berhasil tanpa error
- [ ] Semua service accessible via localhost
- [ ] Database migration auto-run saat container start
- [ ] Seeding auto-run saat backend start

---

## 4. Common Issues & Solutions

### Error 1: "Python service tidak bisa dihubungi"
**Penyebab:** Python service belum jalan atau URL salah di `.env`

**Solusi:**
```bash
# Cek Python service status
curl http://localhost:8001/

# Cek .env di backend-laravel
cat .env | grep PYTHON_SERVICE_URL

# Jika Docker: pastikan network
docker network ls
docker inspect react-crud-api_default
```

### Error 2: Database connection error
**Penyebab:** PostgreSQL belum jalan atau credential salah

**Solusi:**
```bash
# Local: Mulai PostgreSQL service
# Windows: pgAdmin atau Services
# macOS: brew services start postgresql
# Linux: sudo systemctl start postgresql

# Cek connection
psql -U postgres -d react_crud_db -c "SELECT 1"
```

### Error 3: "UNIQUE constraint failed: users.email"
**Penyebab:** Seeding dijalankan 2x tanpa truncate

**Solusi:**
```bash
php artisan migrate:fresh --seed
```

### Error 4: React tidak bisa connect ke API
**Penyebab:** CORS issue atau wrong API URL

**Solusi:**
- Check `.env` di frontend-react:
  ```env
  VITE_API_URL=http://localhost:8000/api
  ```
- Cek CORS middleware di backend: `app/Http/Middleware/Cors.php`

---

## 5. Performance & Optimization Tips

1. **Database Query:**
   - Python analytics endpoint sudah menggunakan SQL aggregation (tidak load seluruh data)
   - Index pada kolom `stock` dan `price` jika perlu

2. **Frontend Caching:**
   - React Query sudah handle caching products
   - Analyze result tidak di-cache (realtime)

3. **Image Loading:**
   - Placeholder API cepat untuk development
   - Di production: ganti dengan CDN atau local storage

---

## 6. Useful Commands

```bash
# Backend
cd backend-laravel
php artisan tinker  # Interactive shell

# Test specific user
User::where('email', 'test@example.com')->first()
Product::count()
Product::sum('stock')

# Python
cd python-service
python -c "from app import app; print(app.routes)"

# React
npm run build  # Build production
npm run preview  # Preview build locally
npm run lint   # Check linting

# Docker
docker-compose down -v  # Remove containers & volumes
docker-compose ps       # List running containers
docker-compose restart  # Restart all services
```

---

## Support

Jika mengalami error tidak terdaftar di atas, cek:
1. Console browser (F12) untuk error detail
2. Terminal logs dari masing-masing service
3. `.env` konfigurasi
4. Database state: `php artisan tinker`
