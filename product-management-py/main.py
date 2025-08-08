from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from application.v1 import v1

app = FastAPI()
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"]
)
# @app.get("/")
# def read_root():
#     return {"message": "Hello, FastAPI!"}

# @app.get("/items/{item_id}")
# def read_item(item_id: int, q: str = None):
#     return {"item_id": item_id, "q": q}

app.include_router(v1,prefix='/v1/product')