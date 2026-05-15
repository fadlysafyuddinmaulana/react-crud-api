from fastapi import FastAPI, HTTPException
import os
import traceback

from sqlalchemy import create_engine, text

app = FastAPI()

database_url = os.getenv(
    "DATABASE_URL",
    "postgresql+psycopg://postgres:postgres@localhost/react_crud_db",
)

engine = create_engine(database_url)

@app.get("/")
def home():

    return {
        "message": "Python Analytics Running"
    }

@app.get("/analysis/products")
def product_analysis():
    try:
        query = text("""
            SELECT
                COUNT(*) AS total_products,
                COALESCE(SUM(stock), 0) AS total_stock,
                COALESCE(AVG(price), 0) AS average_price,
                COALESCE(MAX(price), 0) AS max_price,
                COALESCE(MIN(price), 0) AS min_price
            FROM products
        """)

        with engine.connect() as connection:
            row = connection.execute(query).mappings().first()

        if not row:
            return {
                "total_products": 0,
                "total_stock": 0,
                "average_price": 0.0,
                "max_price": 0.0,
                "min_price": 0.0,
            }

        return {
            "total_products": int(row["total_products"]),
            "total_stock": int(row["total_stock"]),
            "average_price": float(row["average_price"]),
            "max_price": float(row["max_price"]),
            "min_price": float(row["min_price"]),
        }
    except Exception as e:
        error_msg = f"{type(e).__name__}: {str(e)}"
        print(f"[ERROR] /analysis/products: {error_msg}")
        print(traceback.format_exc())
        raise HTTPException(
            status_code=500,
            detail=error_msg
        )