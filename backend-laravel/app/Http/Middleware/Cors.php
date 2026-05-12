<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;

class Cors
{
    /**
     * Handle an incoming request and add CORS headers.
     */
    public function handle(Request $request, Closure $next)
    {
        if ($request->getMethod() === 'OPTIONS') {
            $response = response('', 200);
        } else {
            $response = $next($request);
        }

        $allowedOrigins = env('CORS_ALLOWED_ORIGINS', '*');

        $response->headers->set('Access-Control-Allow-Origin', $allowedOrigins);
        $response->headers->set('Access-Control-Allow-Methods', 'GET, POST, PUT, PATCH, DELETE, OPTIONS');
        $response->headers->set('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-Requested-With, X-CSRF-TOKEN');

        return $response;
    }
}
