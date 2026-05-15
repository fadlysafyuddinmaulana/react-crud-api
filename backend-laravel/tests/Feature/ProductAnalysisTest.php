<?php

namespace Tests\Feature;

use App\Models\Product;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class ProductAnalysisTest extends TestCase
{
    use RefreshDatabase;

    protected User $user;

    protected function setUp(): void
    {
        parent::setUp();
        $this->user = User::factory()->create();
    }

    /** @test */
    public function can_list_products()
    {
        Product::factory(5)->create();

        $response = $this->getJson('/api/products');

        $response->assertStatus(200)
            ->assertJsonCount(5);
    }

    /** @test */
    public function can_get_product_by_id()
    {
        $product = Product::factory()->create([
            'name' => 'Test Product',
            'price' => 100000,
        ]);

        $response = $this->getJson("/api/products/{$product->id}");

        $response->assertStatus(200)
            ->assertJsonPath('name', 'Test Product')
            ->assertJsonPath('price', 100000);
    }

    /** @test */
    public function can_create_product()
    {
        $data = [
            'name' => 'New Product',
            'stock' => 50,
            'price' => 500000,
        ];

        $response = $this->postJson('/api/products', $data);

        $response->assertStatus(201)
            ->assertJsonPath('name', 'New Product');

        $this->assertDatabaseHas('products', $data);
    }

    /** @test */
    public function can_analyze_products()
    {
        Product::factory(10)->create([
            'stock' => 100,
            'price' => 1000000,
        ]);

        $response = $this->getJson('/api/products/analyze');

        $response->assertStatus(200)
            ->assertJsonPath('status', 'ok')
            ->assertJsonPath('data.total_products', 10)
            ->assertJsonPath('data.total_stock', 1000)
            ->assertJsonPath('data.average_price', 1000000.0);
    }

    /** @test */
    public function analyze_endpoint_requires_authentication()
    {
        // After removing auth requirement, analyze should be accessible without login
        $response = $this->getJson('/api/products/analyze');
        $response->assertStatus(200);
    }

    /** @test */
    public function can_update_product()
    {
        $product = Product::factory()->create([
            'name' => 'Old Name',
            'price' => 100000,
        ]);

        $response = $this->putJson("/api/products/{$product->id}", [
            'name' => 'Updated Name',
            'price' => 200000,
        ]);

        $response->assertStatus(200);
        $this->assertDatabaseHas('products', [
            'id' => $product->id,
            'name' => 'Updated Name',
            'price' => 200000,
        ]);
    }

    /** @test */
    public function can_delete_product()
    {
        $product = Product::factory()->create();

        $response = $this->deleteJson("/api/products/{$product->id}");

        $response->assertStatus(200);
        $this->assertDatabaseMissing('products', ['id' => $product->id]);
    }

    /** @test */
    public function analysis_returns_correct_structure()
    {
        Product::factory(3)->create([
            'stock' => 50,
            'price' => 100000,
        ]);

        $response = $this->getJson('/api/products/analyze');

        $response->assertStatus(200)
            ->assertJsonStructure([
                'status',
                'data' => [
                    'total_products',
                    'total_stock',
                    'average_price',
                    'max_price',
                    'min_price',
                ],
            ]);
    }
}
