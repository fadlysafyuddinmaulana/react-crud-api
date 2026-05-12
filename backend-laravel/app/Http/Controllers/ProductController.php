<?php

namespace App\Http\Controllers;

use App\Models\Product;
use Illuminate\Http\Request;
// use App\Services\PythonService;

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
        ]);

        return Product::create($validated);
    }

    public function show($id)
    {
        return Product::findOrFail($id);
    }

    public function update(Request $request, string $id)
    {
        $product=Product::findOrFail($id);

        $product->update($request->all());

        return $product;
    }

    public function destroy(string $id)
    {
        Product::destroy($id);

        return response()->json([
            'message'=> 'Deleted',
        ]);
    }
}
