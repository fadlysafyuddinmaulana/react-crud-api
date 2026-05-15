# Troubleshooting - Error: "Failed to call analysis"

Panduan debugging untuk error saat mengklik tombol "Analyze" di frontend.

---

## 🔍 Quick Diagnosis

Lakukan langkah-langkah ini secara berurutan:

### 1. Cek Browser Console

Buka browser → F12 → Console tab

Cari error messages. Contoh error yang sering muncul:

```
Analysis error: Network Error
Analysis error: 401 Unauthorized
Analysis error: 500 Backend error
```

**Catat error message tepatnya** untuk langkah berikutnya.

---

### 2. Cek Backend is Running

```bash
# Test backend API
curl http://localhost:8000/api/products
```

**Expected:** JSON array dengan produk-produk

**Jika error:**
```bash
# Jalankan backend
cd backend-laravel
php artisan serve --port=8000
```

---

### 3. Cek Python Service is Running

```bash
# Test Python health
curl http://localhost:8001/
```

**Expected:** `{"message": "Python Analytics Running"}`

**Jika error:**
```bash
# Jalankan Python service
cd python-service
python -m venv .venv
.venv\Scripts\activate  # Windows
pip install -r requirements.txt
uvicorn app:app --port 8001 --reload
```

---

### 4. Test Python Endpoint Directly

```bash
curl http://localhost:8001/analysis/products
```

**Expected Response:**
```json
{
  "total_products": 10,
  "total_stock": 1410,
  "average_price": 3165000.0,
  "max_price": 12500000.0,
  "min_price": 150000.0
}
```

**Jika error:**
- [ ] Database tidak connected → Check `DATABASE_URL` di python-service
- [ ] Table products tidak ada → Run `php artisan migrate --seed` di backend
- [ ] Python error → Check terminal logs

---

### 5. Test Backend Analyze Endpoint

Test endpoint (public):
```bash
curl http://localhost:8000/api/products/analyze
```

**Expected Response:**
```json
{
   "status": "ok",
   "data": {
      "total_products": 10,
      "total_stock": 1410,
      ...
   }
}
```

**Jika error 500:**
- Check backend terminal logs: `PHP Warning/Error ...`
- Kemungkinan: Python service URL salah atau tidak bisa dihubungi

---

## 🐛 Common Errors & Solutions

### Error 1: "Network error - Check if backend is running"

**Penyebab:** Frontend tidak bisa reach backend API

**Solusi:**
```bash
# 1. Cek backend running
ps aux | grep "php artisan"

# 2. Cek port 8000
netstat -an | grep 8000  # Windows: netstat -ano | findstr 8000

# 3. Jalankan backend jika belum
cd backend-laravel
php artisan serve --port=8000

# 4. Cek .env frontend
cat frontend-react/.env.local  # Should have VITE_API_URL

# 5. Cek CORS di backend
cat backend-laravel/app/Http/Middleware/Cors.php
```

---

### Error 2: "Unauthorized / 401"

Jika Anda melihat 401 atau Unauthorized, itu awalnya berasal dari mode pengujian sebelumnya yang membutuhkan token. Setelah auth dihapus, 401 biasanya berarti ada masalah lain (misconfiguration, proxy, atau middleware). Periksa log backend dan network tab.

---

### Error 3: "Backend error - Python service may not be running"

**Penyebab:** Backend bisa dihubungi tapi Python service tidak

**Solusi:**
```bash
# 1. Cek Python running
curl http://localhost:8001/

# 2. Check backend logs
# Look for: "Python service tidak bisa dihubungi"

# 3. Jalankan Python jika belum
cd python-service
.venv\Scripts\activate
uvicorn app:app --port 8001 --reload

# 4. Cek backend .env
cat backend-laravel/.env | grep PYTHON_SERVICE_URL
# Should be: PYTHON_SERVICE_URL=http://127.0.0.1:8001

# 5. Test koneksi dari backend
# cd backend-laravel && php artisan tinker
# Http::get('http://127.0.0.1:8001/')
```

---

### Error 4: Python Error - "meson build" issue

**Penyebab:** pandas build issue (sudah fixed di codebase ini, tapi kalau terjadi):

**Solusi:**
```bash
# Gunakan binary wheel (jangan build)
pip install --only-binary :all: pandas

# Atau lebih baik: jangan pakai pandas
# Python service sudah refactored untuk langsung SQL aggregation
# Jadi error ini seharusnya tidak terjadi
```

---

## 📋 Full Diagnostic Checklist

Jalankan semua ini sekaligus:

```bash
#!/bin/bash
# Save as: diagnose.sh

echo "=== Backend Status ==="
curl -s http://localhost:8000/api/products | jq '.length' || echo "❌ Backend down"

echo "\n=== Python Status ==="
curl -s http://localhost:8001/ || echo "❌ Python down"

echo "\n=== Python Analytics ==="
curl -s http://localhost:8001/analysis/products | jq '.' || echo "❌ Analytics error"

echo "\n=== Backend .env ==="
grep "PYTHON_SERVICE_URL" backend-laravel/.env

echo "\n=== Product Count in DB ==="
cd backend-laravel && php artisan tinker -e "echo Product::count();"

echo "\n=== User Count in DB ==="
cd backend-laravel && php artisan tinker -e "echo User::count();"
```

---

## 🔧 Debug Mode

Tambahkan logging untuk detailed error tracking:

**backend-laravel/app/Services/PythonService.php:**
```php
Log::debug('Python Service Call', [
    'url' => $url,
    'timeout' => $timeout,
]);

try {
    $response = Http::timeout($timeout)->get($url . '/analysis/products');
    Log::info('Python Service Response', ['status' => $response->status()]);
} catch (ConnectionException $exception) {
    Log::error('Python Service Connection Error', [
        'message' => $exception->getMessage(),
        'url' => $url,
    ]);
}
```

**Check logs:**
```bash
cd backend-laravel
tail -f storage/logs/laravel.log | grep -i python
```

---

## 📞 If Still Stuck

Provide these details:

1. **Browser Console Error** (F12 → Console)
   ```
   Analysis error: [EXACT ERROR MESSAGE]
   ```

2. **Backend Terminal Output**
   ```
   php artisan serve output...
   ```

3. **Python Terminal Output**
   ```
   uvicorn output...
   ```

4. **Backend .env**
   ```bash
   # Share: PYTHON_SERVICE_URL and relevant vars
   ```

5. **Test Results**
   ```bash
   # Result of: curl http://localhost:8001/analysis/products
   ```

6. **Frontend .env**
   ```bash
   # Share: VITE_API_URL
   ```

---

## ✅ Success Indicators

Setelah semuanya fixed:

- [ ] `curl http://localhost:8000/api/products` returns 200
- [ ] `curl http://localhost:8001/` returns 200
- [ ] `curl http://localhost:8001/analysis/products` returns analytics
- [ ] Backend logs show no Python connection errors
- [ ] Frontend console has no errors
- [ ] Click "Analyze" button shows result dialog (not error)
- [ ] Result shows: `total_products: 10`, `average_price: ~3.2M`
