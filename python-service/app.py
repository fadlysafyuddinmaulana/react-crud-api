from fastapi import FastAPI
import pandas as pd
from sqlalchemy import create_engine
import uvicorn

app = FastAPI()

engine = create_engine(
    "postgresql://postgres:postgres@localhost/crud_db"
)

@app.get("/analysis/products")
def analyze_products():

    df = pd.read_sql("SELECT * FROM products", engine)

    result = {
        "total_stock": int(df["stock"].sum()),
        "average_price": float(df["price"].mean())
    }

    return result


if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8001)