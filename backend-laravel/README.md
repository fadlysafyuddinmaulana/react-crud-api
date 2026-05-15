<p align="center"><a href="https://laravel.com" target="_blank"><img src="https://raw.githubusercontent.com/laravel/art/master/logo-lockup/5%20SVG/2%20CMYK/1%20Full%20Color/laravel-logolockup-cmyk-red.svg" width="400" alt="Laravel Logo"></a></p>

<p align="center">
<a href="https://github.com/laravel/framework/actions"><img src="https://github.com/laravel/framework/workflows/tests/badge.svg" alt="Build Status"></a>
<a href="https://packagist.org/packages/laravel/framework"><img src="https://img.shields.io/packagist/dt/laravel/framework" alt="Total Downloads"></a>
<a href="https://packagist.org/packages/laravel/framework"><img src="https://img.shields.io/packagist/v/laravel/framework" alt="Latest Stable Version"></a>
<a href="https://packagist.org/packages/laravel/framework"><img src="https://img.shields.io/packagist/l/laravel/framework" alt="License"></a>
</p>

## About Laravel

Laravel is a web application framework with expressive, elegant syntax. We believe development must be an enjoyable and creative experience to be truly fulfilling. Laravel takes the pain out of development by easing common tasks used in many web projects, such as:

- [Simple, fast routing engine](https://laravel.com/docs/routing).
- [Powerful dependency injection container](https://laravel.com/docs/container).
- Multiple back-ends for [session](https://laravel.com/docs/session) and [cache](https://laravel.com/docs/cache) storage.
- Expressive, intuitive [database ORM](https://laravel.com/docs/eloquent).
- Database agnostic [schema migrations](https://laravel.com/docs/migrations).
- [Robust background job processing](https://laravel.com/docs/queues).
- [Real-time event broadcasting](https://laravel.com/docs/broadcasting).

Laravel is accessible, powerful, and provides tools required for large, robust applications.

## Learning Laravel

Laravel has the most extensive and thorough [documentation](https://laravel.com/docs) and video tutorial library of all modern web application frameworks, making it a breeze to get started with the framework. You can also check out [Laravel Learn](https://laravel.com/learn), where you will be guided through building a modern Laravel application.

If you don't feel like reading, [Laracasts](https://laracasts.com) can help. Laracasts contains thousands of video tutorials on a range of topics including Laravel, modern PHP, unit testing, and JavaScript. Boost your skills by digging into our comprehensive video library.

## Laravel Sponsors

We would like to extend our thanks to the following sponsors for funding Laravel development. If you are interested in becoming a sponsor, please visit the [Laravel Partners program](https://partners.laravel.com).

### Premium Partners

- **[Vehikl](https://vehikl.com)**
- **[Tighten Co.](https://tighten.co)**
- **[Kirschbaum Development Group](https://kirschbaumdevelopment.com)**
- **[64 Robots](https://64robots.com)**
- **[Curotec](https://www.curotec.com/services/technologies/laravel)**
- **[DevSquad](https://devsquad.com/hire-laravel-developers)**
- **[Redberry](https://redberry.international/laravel-development)**
- **[Active Logic](https://activelogic.com)**

## Contributing

Thank you for considering contributing to the Laravel framework! The contribution guide can be found in the [Laravel documentation](https://laravel.com/docs/contributions).

## Code of Conduct

In order to ensure that the Laravel community is welcoming to all, please review and abide by the [Code of Conduct](https://laravel.com/docs/contributions#code-of-conduct).

## Security Vulnerabilities

If you discover a security vulnerability within Laravel, please send an e-mail to Taylor Otwell via [taylor@laravel.com](mailto:taylor@laravel.com). All security vulnerabilities will be promptly addressed.

## License

The Laravel framework is open-sourced software licensed under the [MIT license](https://opensource.org/licenses/MIT).

## Python Service Integration

Project ini terhubung dengan layanan analitik FastAPI pada folder `python-service/`.

Jalankan lokal (tanpa Docker):

```bash
cd python-service
python -m venv .venv
# Windows
.venv\Scripts\activate
pip install -r requirements.txt
uvicorn app:app --host 0.0.0.0 --port 8001 --reload
```

Konfigurasi Laravel `.env`:

```env
PYTHON_SERVICE_URL=http://127.0.0.1:8001
PYTHON_SERVICE_TIMEOUT=30
```

Jika menjalankan via Docker Compose, backend otomatis memakai:

```env
PYTHON_SERVICE_URL=http://python-service:8001
```

Endpoint API Laravel untuk analitik:

- `GET /api/products/analyze`

## Database Setup & Seeding

Jalankan migrasi dan seed database:

```bash
php artisan migrate --seed
```

Ini akan membuat:

- 1 test user dengan email `test@example.com` dan password `password`
- 10 produk contoh dengan image dari placeholder API (`https://via.placeholder.com/`)

**Produk yang di-seed:**

- Laptop Dell Inspiron 15 (Rp 12.5M, stock 45)
- Mouse Logitech MX Master (Rp 1.2M, stock 150)
- Keyboard Mechanical RGB (Rp 2.5M, stock 80)
- Monitor LG 27 inch (Rp 5.5M, stock 25)
- Headphone Sony WH-1000XM5 (Rp 4.5M, stock 60)
- Webcam Logitech C920 (Rp 1.8M, stock 120)
- External SSD Samsung 1TB (Rp 2.2M, stock 35)
- USB Hub 7 Port (Rp 450K, stock 200)
- Laptop Stand Adjustable (Rp 650K, stock 95)
- Cable USB-C 2M (Rp 150K, stock 500)

Semua image di-generate dengan placeholder API untuk testing tanpa upload file.
