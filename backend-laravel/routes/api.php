<?php

use App\Http\Controllers\ProductController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Route;
// NOTE: Authentication and CORS removed - all product endpoints are public for CRUD testing

// Public endpoints for frontend product listing/detail.
Route::get('products', [ProductController::class, 'index']);
Route::post('products', [ProductController::class, 'store']);

// Specific endpoints before parameterized routes
Route::get('products/analyze', [ProductController::class, 'analyze']);
Route::put('products/{id}', [ProductController::class, 'update']);
Route::delete('products/{id}', [ProductController::class, 'destroy']);

// Parameterized routes - MUST be last
Route::get('products/{id}', [ProductController::class, 'show']);
