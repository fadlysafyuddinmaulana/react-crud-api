<?php

namespace Database\Seeders;

use App\Models\Product;
use Illuminate\Database\Seeder;

class ProductSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $products = [
            [
                'name' => 'Laptop Dell Inspiron 15',
                'stock' => 45,
                'price' => 12500000,
                'image' => 'https://via.placeholder.com/400x300?text=Laptop+Dell',
            ],
            [
                'name' => 'Mouse Logitech MX Master',
                'stock' => 150,
                'price' => 1200000,
                'image' => 'https://via.placeholder.com/400x300?text=Mouse+Logitech',
            ],
            [
                'name' => 'Keyboard Mechanical RGB',
                'stock' => 80,
                'price' => 2500000,
                'image' => 'https://via.placeholder.com/400x300?text=Keyboard+RGB',
            ],
            [
                'name' => 'Monitor LG 27 inch',
                'stock' => 25,
                'price' => 5500000,
                'image' => 'https://via.placeholder.com/400x300?text=Monitor+LG',
            ],
            [
                'name' => 'Headphone Sony WH-1000XM5',
                'stock' => 60,
                'price' => 4500000,
                'image' => 'https://via.placeholder.com/400x300?text=Headphone+Sony',
            ],
            [
                'name' => 'Webcam Logitech C920',
                'stock' => 120,
                'price' => 1800000,
                'image' => 'https://via.placeholder.com/400x300?text=Webcam+Logitech',
            ],
            [
                'name' => 'External SSD Samsung 1TB',
                'stock' => 35,
                'price' => 2200000,
                'image' => 'https://via.placeholder.com/400x300?text=SSD+Samsung',
            ],
            [
                'name' => 'USB Hub 7 Port',
                'stock' => 200,
                'price' => 450000,
                'image' => 'https://via.placeholder.com/400x300?text=USB+Hub',
            ],
            [
                'name' => 'Laptop Stand Adjustable',
                'stock' => 95,
                'price' => 650000,
                'image' => 'https://via.placeholder.com/400x300?text=Laptop+Stand',
            ],
            [
                'name' => 'Cable USB-C 2M',
                'stock' => 500,
                'price' => 150000,
                'image' => 'https://via.placeholder.com/400x300?text=USB+Cable',
            ],
        ];

        foreach ($products as $product) {
            Product::create($product);
        }
    }
}
