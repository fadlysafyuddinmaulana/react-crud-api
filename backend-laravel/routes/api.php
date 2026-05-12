<?php

use App\Http\Controllers\ProductController;
use App\Http\Middleware\Cors;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Route;

Route::middleware([Cors::class])->group(function () {
    // Public login endpoint
    Route::post('login', function (Request $request) {
        $credentials = $request->validate([
            'email' => 'required|email',
            'password' => 'required',
        ]);

        if (Auth::attempt($credentials)) {
            $user = Auth::user();
            $token = $user->createToken('frontend-token')->plainTextToken;
            return response()->json(['token' => $token, 'user' => $user]);
        }

        return response()->json(['message' => 'Invalid credentials'], 401);
    });

    // Public endpoints for frontend product listing/detail.
    Route::get('products', [ProductController::class, 'index']);
    Route::get('products/{id}', [ProductController::class, 'show']);
    Route::post('products', [ProductController::class, 'store']);

    Route::get('/user', function (Request $request) {
        return $request->user();
    })->middleware('auth:sanctum');

    Route::middleware('auth:sanctum')->group(function () {
        Route::get('products/analyze', [ProductController::class, 'analyze']);
        Route::put('products/{id}', [ProductController::class, 'update']);
        Route::delete('products/{id}', [ProductController::class, 'destroy']);
    });
});
