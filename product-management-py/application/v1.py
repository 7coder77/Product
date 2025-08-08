from datetime import datetime, timedelta
from fastapi import APIRouter
from .schema import *
from .service import *
from utils.auth import *
import jwt

v1=APIRouter()

@token_validator
@v1.get("/")
def getAllData():
    # return {"data":"this is all data"}
    return allDataService()

@v1.post("/login")
def login(payload:LoginSchema):
    payload=payload.model_dump()
    expire = datetime.utcnow() + timedelta(minutes=30)
    
    # Define token payload with standard claims and your email as subject
    payload = {
        "sub": payload["email"],            # subject: user email ID
        "exp": expire            # expiration time
    }
    
    # Encode the token with secret and algorithm
    token = jwt.encode(payload,"your_secret_key_here", algorithm="HS256"
)
    return token