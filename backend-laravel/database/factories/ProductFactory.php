<?php

namespace Database\Factories;

use App\Models\Product;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<Product>
 */
class ProductFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'name' => fake()->words(3, asText: true),
            'stock' => fake()->numberBetween(10, 500),
            'price' => fake()->numberBetween(50000, 5000000),
            'image' => 'https://via.placeholder.com/400x300?text=' . urlencode(fake()->word()),
        ];
    }
}
