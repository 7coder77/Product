from pydantic import BaseModel
from typing import Optional
from datetime import date

class CategoryBase(BaseModel):
    name: str
    description: Optional[str] = None

class CategoryResponse(CategoryBase):
    id: int
    class Config:
        orm_mode = True

class ProductCreate(BaseModel):
    name: str
    description: Optional[str] = None
    cost_price: float
    selling_price: float
    stock: int = 0
    category_name: str  # category will be provided by name
    category_description: Optional[str] = None
    is_active: bool = True

class ProductResponse(BaseModel):
    id: int
    name: str
    description: Optional[str]
    cost_price: float
    selling_price: float
    stock: int
    category: CategoryResponse
    is_active: bool

    class Config:
        orm_mode = True

class ProductUpdate(BaseModel):
    name: Optional[str] = None
    description: Optional[str] = None
    cost_price: Optional[float] = None
    selling_price: Optional[float] = None
    stock: Optional[int] = None
    category_name: Optional[str] = None
    is_active: Optional[bool] = None


class SalesCreate(BaseModel):
    product_id: int
    date: date
    units_sold: int
    price: float

class ForecastRequest(BaseModel):
    products: list[int]  # List of product names for which to generate the forecast