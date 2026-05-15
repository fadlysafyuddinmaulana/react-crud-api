<?php

namespace App\Services;

use Illuminate\Http\Client\ConnectionException;
use Illuminate\Support\Facades\Http;
use RuntimeException;

class PythonService
{
    public function analyzeProducts(): array
    {
        $url = rtrim((string) config('services.python.url'), '/');
        $timeout = (int) config('services.python.timeout', 30);

        try {
            $response = Http::timeout($timeout)->get($url . '/analysis/products');
        } catch (ConnectionException $exception) {
            \Log::error('Python Service Connection Error', [
                'url' => $url,
                'message' => $exception->getMessage(),
            ]);
            throw new RuntimeException('Python service tidak bisa dihubungi: ' . $exception->getMessage(), 0, $exception);
        }

        if (! $response->successful()) {
            $error_message = $response->json('detail') ?? $response->body();
            \Log::error('Python Service Response Error', [
                'status' => $response->status(),
                'detail' => $error_message,
            ]);
            throw new RuntimeException('Python service error: ' . $error_message);
        }

        $payload = $response->json();

        if (! is_array($payload)) {
            \Log::error('Python Service Invalid Response', [
                'response' => $payload,
                'type' => gettype($payload),
            ]);
            throw new RuntimeException('Respons Python service tidak valid: ' . json_encode($payload));
        }

        return $payload;
    }
}