#!/bin/bash
# Diagnosis Script untuk Error 500 di /api/products/analyze

echo "=========================================="
echo "React CRUD API - Analyze Error Diagnosis"
echo "=========================================="

echo -e "\n[1] Checking Backend Service..."
if curl -s http://localhost:8000/api/products > /dev/null; then
    echo "✅ Backend is running"
else
    echo "❌ Backend is NOT running"
    echo "   Fix: cd backend-laravel && php artisan serve --port=8000"
fi

echo -e "\n[2] Checking Python Service..."
PYTHON_RESPONSE=$(curl -s http://localhost:8001/)
if [ ! -z "$PYTHON_RESPONSE" ]; then
    echo "✅ Python is running"
    echo "   Response: $PYTHON_RESPONSE"
else
    echo "❌ Python is NOT running"
    echo "   Fix: cd python-service && uvicorn app:app --port 8001 --reload"
fi

echo -e "\n[3] Testing Python Analysis Endpoint..."
ANALYSIS_RESPONSE=$(curl -s http://localhost:8001/analysis/products)
if echo "$ANALYSIS_RESPONSE" | grep -q "total_products"; then
    echo "✅ Python analysis working"
    echo "   Response: $ANALYSIS_RESPONSE"
elif echo "$ANALYSIS_RESPONSE" | grep -q "error"; then
    echo "⚠️  Python returned error:"
    echo "   $ANALYSIS_RESPONSE"
    echo ""
    echo "   Likely causes:"
    echo "   - Database not connected"
    echo "   - Products table not created (run: php artisan migrate --seed)"
    echo "   - DATABASE_URL env var not set"
else
    echo "❌ Python analysis endpoint not responding"
    echo "   Response: $ANALYSIS_RESPONSE"
fi

echo -e "\n[4] Checking Database Connection..."
cd backend-laravel 2>/dev/null
PRODUCT_COUNT=$(php artisan tinker -e "echo Product::count();" 2>/dev/null)
if [ ! -z "$PRODUCT_COUNT" ] && [ "$PRODUCT_COUNT" -gt 0 ]; then
    echo "✅ Database connected, $PRODUCT_COUNT products found"
else
    echo "❌ Database issue"
    echo "   Fix: php artisan migrate --seed"
fi

echo -e "\n[5] Checking Backend .env Config..."
if grep -q "PYTHON_SERVICE_URL=http://127.0.0.1:8001" backend-laravel/.env 2>/dev/null; then
    echo "✅ PYTHON_SERVICE_URL correctly set"
else
    echo "⚠️  Check PYTHON_SERVICE_URL in .env"
    echo "   Should be: PYTHON_SERVICE_URL=http://127.0.0.1:8001"
fi

echo -e "\n[6] Testing Backend → Python Connection..."
ANALYZE_RESPONSE=$(curl -s http://localhost:8000/api/products/analyze)

if echo "$ANALYZE_RESPONSE" | grep -q '"status"'; then
    echo "✅ Analyze endpoint responded"
    echo "   Response: $ANALYZE_RESPONSE"
else
    echo "❌ Analyze endpoint failed or returned unexpected data"
    echo "   Response: $ANALYZE_RESPONSE"
    echo "   Next: Check backend-laravel/storage/logs/laravel.log"
fi

echo -e "\n=========================================="
echo "Done!"
echo "=========================================="
