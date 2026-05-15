# Quick Start Testing

Panduan cepat testing 5 menit untuk verifikasi integrasi Python-Laravel-React.

## Terminal 1: Python Service

```bash
cd python-service
python -m venv .venv
# Windows: .venv\Scripts\activate
# Mac/Linux: source .venv/bin/activate
pip install -r requirements.txt
uvicorn app:app --host 0.0.0.0 --port 8001 --reload
```

**Verify:** `curl http://localhost:8001/` → Should return `{"message": "Python Analytics Running"}`

---

## Terminal 2: Backend Laravel

```bash
cd backend-laravel
cp .env.example .env
php artisan key:generate
php artisan migrate --seed
php artisan serve --port=8000
```

**Expected:** "Laravel development server started..."

**Verify:** `curl http://localhost:8000/api/products` → Returns JSON array of 10 products

---

## Terminal 3: Frontend React

```bash
cd frontend-react
npm install
npm run dev
```

**Expected:** "Local: http://localhost:5173"

---

## Browser Testing (in order)

1. **Open:** http://localhost:5173
2. **(No login required)**: All product CRUD and analysis endpoints are public for quick testing.
3. **Verify:**
   - ✅ See 10 products in table
   - ✅ Click "Analyze" button
   - ✅ Dialog shows JSON result with: `total_products: 10`, `average_price: 3165000`
4. **CRUD Test:**
   - ✅ "+ Add Product" → Create new item
   - ✅ "Edit" → Modify existing item
   - ✅ "Delete" → Remove item

---

## Docker Quick Test

```bash
docker-compose up --build
```

- Frontend: http://localhost:5173
- API: http://localhost:8000/api/products
- Python: http://localhost:8001/

---

## Test API Endpoints

```bash
# Get products (public)
curl http://localhost:8000/api/products | jq

# Login
curl -X POST http://localhost:8000/api/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"password"}' | jq

# Analyze (public)
curl http://localhost:8000/api/products/analyze | jq
```

---

## If Something Fails

| Issue | Check |
|-------|-------|
| "Port already in use" | Change port: `php artisan serve --port=9000` |
| "Can't connect to DB" | Run: `php artisan migrate --seed` |
| "Python service not found" | Verify: `curl http://localhost:8001/` |
| "CORS error in React" | Backend running? Check `.env` VITE_API_URL |
| "Login fails" | Not applicable — auth removed for quick testing. |

---

## Seeded Test Data

-- Test user: optional (auth not required for CRUD/testing)
- **Products:** 10 items (Laptop, Mouse, Keyboard, etc.) with placeholder images
- **Analytics:** Total 1410 stock, avg price Rp 3.2M

---

**Full docs:** See `TESTING_GUIDE.md` for detailed testing scenarios and troubleshooting.
