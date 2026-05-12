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
            throw new RuntimeException('Python service tidak bisa dihubungi: ' . $exception->getMessage(), 0, $exception);
        }

        if (! $response->successful()) {
            throw new RuntimeException('Python service mengembalikan status ' . $response->status());
        }

        $payload = $response->json();

        if (! is_array($payload)) {
            throw new RuntimeException('Respons Python service tidak valid.');
        }

        return $payload;
    }
}