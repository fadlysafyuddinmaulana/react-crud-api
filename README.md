# React CRUD API

Aplikasi full-stack CRUD untuk manajemen produk dengan arsitektur modern yang mengintegrasikan **React frontend**, **Laravel backend**, dan **Python microservice**.

## 🎯 Tentang Project

React CRUD API adalah aplikasi web yang memungkinkan pengguna untuk melakukan operasi **Create, Read, Update, Delete (CRUD)** pada data produk. Project ini dibangun dengan teknologi terkini dan best practices development.

## 📋 Fitur Utama

- ✅ **Manajemen Produk** - Tambah, lihat, ubah, dan hapus data produk
- ✅ **Dashboard Interaktif** - Interface user-friendly dengan Material-UI
- ✅ **Analisis Produk** - Python microservice untuk analisis data produk
- ✅ **Autentikasi Pengguna** - Sistem user management dengan Laravel
- ✅ **Real-time Data Sync** - Sinkronisasi data real-time dengan React Query
- ✅ **Responsive Design** - Kompatibel dengan semua ukuran layar

## 🏗️ Arsitektur Project

```
react-crud-api/
├── frontend-react/        # React TypeScript Frontend
├── backend-laravel/       # Laravel REST API Backend
├── python-service/        # FastAPI Microservice
└── docker-compose.yml     # Docker Orchestration
```

## 🛠️ Tech Stack

### Frontend

- **React 19** - Library JavaScript untuk UI
- **TypeScript** - Type-safe JavaScript
- **Vite** - Build tool modern dan cepat
- **Material-UI (MUI)** - Component library profesional
- **React Router** - Client-side routing
- **React Query** - State management untuk server data
- **Zustand** - State management lightweight
- **Axios** - HTTP client

### Backend

- **Laravel 11** - PHP framework modern
- **PostgreSQL** - Database relasional
- **Tailwind CSS** - Utility-first CSS framework
- **Laravel Sanctum** - API authentication

### Python Service

- **FastAPI** - Framework Python untuk API
- **SQLAlchemy** - ORM untuk database
- **Uvicorn** - ASGI server

## 📦 Instalasi

### Prerequisites

- Docker dan Docker Compose
- Node.js 18+ (untuk development lokal)
- PHP 8.3+ (untuk development lokal)
- Python 3.10+ (untuk development lokal)

### Cara Menjalankan dengan Docker

```bash
# Clone repository
git clone https://github.com/fadlysafyuddinmaulana/react-crud-api.git
cd react-crud-api

# Jalankan semua service dengan Docker Compose
docker-compose up -d

# Akses aplikasi:
# Frontend: http://localhost:5173
# Backend API: http://localhost:8000
# Python Service: http://localhost:8001
```

### Development Lokal

#### Backend Laravel

```bash
cd backend-laravel

# Install dependencies
composer install
npm install

# Setup environment
cp .env.example .env
php artisan key:generate

# Database
php artisan migrate
php artisan db:seed

# Run server
php artisan serve
```

#### Frontend React

```bash
cd frontend-react

# Install dependencies
npm install

# Development server
npm run dev

# Build production
npm run build
```

#### Python Service

```bash
cd python-service

# Create virtual environment
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Run server
python app.py
```

## 📚 API Documentation

### Product Endpoints

| Method | Endpoint             | Deskripsi             |
| ------ | -------------------- | --------------------- |
| GET    | `/api/products`      | Dapatkan semua produk |
| GET    | `/api/products/{id}` | Dapatkan produk by ID |
| POST   | `/api/products`      | Tambah produk baru    |
| PUT    | `/api/products/{id}` | Update produk         |
| DELETE | `/api/products/{id}` | Hapus produk          |

## 📁 Struktur Folder

### Frontend

```
frontend-react/
├── src/
│   ├── components/     # Reusable components
│   ├── pages/          # Page components
│   ├── services/       # API services
│   ├── store/          # Zustand state management
│   ├── interfaces/     # TypeScript interfaces
│   └── App.tsx         # Main component
```

### Backend

```
backend-laravel/
├── app/
│   ├── Models/         # Database models
│   ├── Http/
│   │   └── Controllers/  # API controllers
│   └── Services/       # Business logic
├── database/
│   ├── migrations/     # Database migrations
│   └── seeders/        # Database seeders
└── routes/
    └── api.php         # API routes
```

### Python Service

```
python-service/
├── app.py              # Main FastAPI app
├── analysis/           # Analysis modules
├── models/             # Data models
└── services/           # Service logic
```

## 🚀 Deployment

### Production dengan Docker

```bash
# Build dan push images
docker-compose build
docker-compose up -d
```

## 🤝 Kontribusi

Silakan berkontribusi dengan membuat pull request atau membuka issues untuk bug reports dan feature requests.

## 📝 Lisensi

Project ini dilisensikan di bawah MIT License.

---

**Dibuat oleh:** Fadly Safyuddin Maulana  
**Repository:** https://github.com/fadlysafyuddinmaulana/react-crud-api
