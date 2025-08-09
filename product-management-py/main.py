from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from application.login.v1 import v1
from application.product.product import product

app = FastAPI()
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
# @app.get("/")
# def read_root():
#     return {"message": "Hello, FastAPI!"}

# @app.get("/items/{item_id}")
# def read_item(item_id: int, q: str = None):
#     return {"item_id": item_id, "q": q}

app.include_router(v1,prefix='/v1/auth')
app.include_router(product,prefix='/v1/product')