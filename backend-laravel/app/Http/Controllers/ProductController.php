<?php

namespace App\Http\Controllers;

use App\Models\Product;
use Illuminate\Http\Request;
use App\Services\PythonService;

class ProductController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        return Product::all();
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'stock' => 'required|integer',
            'price' => 'required|numeric',
            'image' => 'nullable|image|mimes:jpg,jpeg,png,webp|max:2048',
        ]);

        if ($request->hasFile('image')) {
            $imagePath = $request->file('image')->store('products', 'public');
            $validated['image'] = $imagePath;
        }

        return Product::create($validated);
    }

    public function show($id)
    {
        return Product::findOrFail($id);
    }

    public function update(Request $request, string $id)
    {
        $validated = $request->validate([
            'name' => 'sometimes|required|string|max:255',
            'stock' => 'sometimes|required|integer',
            'price' => 'sometimes|required|numeric',
            'image' => 'nullable|image|mimes:jpg,jpeg,png,webp|max:2048',
        ]);

        if ($request->hasFile('image')) {
            $imagePath = $request->file('image')->store('products', 'public');
            $validated['image'] = $imagePath;
        }

        $product = Product::findOrFail($id);
        $product->update($validated);

        return $product;
    }

    public function destroy(string $id)
    {
        Product::destroy($id);

        return response()->json([
            'message'=> 'Deleted',
        ]);
    }

    public function analyze()
    {
        try {
            $payload = app(PythonService::class)->analyzeProducts();

            return response()->json([
                'status' => 'ok',
                'data' => $payload,
            ]);
        } catch (\Exception $e) {
            \Log::error('ProductAnalysis Error', [
                'message' => $e->getMessage(),
                'exception' => class_basename($e),
                'trace' => $e->getTraceAsString(),
            ]);

            return response()->json([
                'status' => 'error',
                'message' => $e->getMessage(),
                'debug' => app()->isLocal() ? $e->getTraceAsString() : null,
            ], 500);
        }
    }
}
