from datetime import datetime, timedelta
from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.params import Query
from .schema import *
# from .service import *
from utils.auth import *
from sqlalchemy.orm import Session, joinedload
from .models import *
from utils.database import engine,SessionLocal  
from utils.auth import validate_token
import pandas as pd
import numpy as np

Base.metadata.create_all(bind=engine)
product=APIRouter()
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
@product.get("/list")
# async def get_products(request: Request, db: Session = Depends(get_db)):
def getAllProducts(token: str = Header(..., description="JWT Token"),decoded=Depends(validate_token),db: Session = Depends(get_db)):
    products = db.query(Product).options(joinedload(Product.category)).all()
    print(decoded)
    return [
        {
            "id": p.id,
            "name": p.name,
            "description": p.description,
            "cost_price": p.cost_price,
            "selling_price": p.selling_price,
            "stock": p.stock,
            "category": p.category.name if p.category else None,
            "unitsold": p.unitsold
        }
        for p in products
    ]


@product.post("/products", response_model=ProductResponse, status_code=status.HTTP_201_CREATED)
def create_product(product: ProductCreate,token: str = Header(..., description="JWT Token"),decoded=Depends(validate_token), db: Session = Depends(get_db)):
    category = db.query(Category).filter(Category.name == product.category_name).first()

    if not category:
        # Create new category
        category = Category(
            name=product.category_name,
            description=product.category_description
        )
        db.add(category)
        db.commit()
        db.refresh(category)

    new_product = Product(
        name=product.name,
        description=product.description,
        cost_price=product.cost_price,
        selling_price=product.selling_price,
        stock=product.stock,
        category_id=category.id,
        is_active=product.is_active
    )
    db.add(new_product)
    db.commit()
    db.refresh(new_product)

    return new_product

@product.put("/products/{product_id}")
def update_product(product_id: int, product: ProductUpdate, token: str = Header(..., description="JWT Token"),decoded=Depends(validate_token), db: Session = Depends(get_db)):
    existing_product = db.query(Product).filter(Product.id == product_id).first()
    if not existing_product:
        raise HTTPException(status_code=404, detail="Product not found")

    # If category is provided, find or create it
    if product.category_name:
        category = db.query(Category).filter(Category.name == product.category_name).first()
        if not category:
            category = Category(name=product.category_name)
            db.add(category)
            db.commit()
            db.refresh(category)
        existing_product.category_id = category.id

    # Update only provided fields
    for key, value in product.dict(exclude_unset=True).items():
        if key != "category_name":  # Already handled above
            setattr(existing_product, key, value)

    db.commit()
    db.refresh(existing_product)

    return {"message": "Product updated successfully", "product_id": existing_product.id}


@product.delete("/products/{product_id}")
def delete_product(product_id: int,token: str = Header(..., description="JWT Token"),decoded=Depends(validate_token), db: Session = Depends(get_db)):
    product = db.query(Product).filter(Product.id == product_id).first()
    if not product:
        raise HTTPException(status_code=404, detail="Product not found")

    db.delete(product)
    db.commit()

    return {"message": "Product deleted successfully"}

@product.get("/products/search")
def search_products(
    name: str = Query(..., description="Product name to search for"),
    decoded=Depends(validate_token),
    db: Session = Depends(get_db)
):
    results = db.query(Product).filter(Product.name.ilike(f"%{name}%")).all()

    if not results:
        raise HTTPException(status_code=404, detail="No products found matching the name")

    return results

@product.post("/sales")
def add_sales_record(sales_data: SalesCreate, db: Session = Depends(get_db)):
    # Create a new sales record
    new_sale = ProductSales(
        product_id=sales_data.product_id,
        date=sales_data.date,
        units_sold=sales_data.units_sold,
        price=sales_data.price
    )

    db.add(new_sale)
    db.commit()
    db.refresh(new_sale)

    return {"message": "Sales record added successfully", "sale_id": new_sale.id}


@product.get("/forecast/{product_id}")
def get_forecast(product_id: int, db: Session = Depends(get_db)):
    # 1. Fetch historical data
    sales = db.query(ProductSales).filter(ProductSales.product_id == product_id).all()

    if not sales:
        return {"error": "No sales history found"}

    df = pd.DataFrame([{
        "date": s.date,
        "units_sold": float(s.units_sold),
        "price": float(s.price)
    } for s in sales])

    # 2. Simple demand-price simulation
    prices = np.linspace(df["price"].min() * 0.9, df["price"].max() * 1.1, 10)
    forecast_data = []
    avg_units = df["units_sold"].mean()

    for p in prices:
        # Fake formula: demand decreases as price increases
        demand = max(avg_units * (1 - (p - df["price"].mean()) / df["price"].mean() * 0.5), 0)
        forecast_data.append({"price": round(p, 2), "demand": round(demand, 2)})

    return forecast_data

@product.post("/forecast/multiple")
def get_multiple_forecasts(payload: ForecastRequest, db: Session = Depends(get_db)):
    forecasts = []

    for pid in payload.products:
        # Fetch sales history for this product
        sales = db.query(ProductSales).filter(ProductSales.product_id == pid).all()
        if not sales:
            continue  # Skip products with no data

        df = pd.DataFrame([{
            "date": s.date,
            "units_sold": float(s.units_sold),
            "price": float(s.price)
        } for s in sales])

        prices = np.linspace(df["price"].min() * 0.9, df["price"].max() * 1.1, 10)
        avg_units = df["units_sold"].mean()

        # Your existing forecast logic
        forecast_data = []
        for p in prices:
            demand = max(avg_units * (1 - (p - df["price"].mean()) / df["price"].mean() * 0.5), 0)
            forecast_data.append({"price": round(p, 2), "demand": round(demand, 2)})
        product = db.query(Product).filter(Product.id == pid).first()
        forecasts.append({
            "name": product.name,
            "values": forecast_data
        })

    return forecasts