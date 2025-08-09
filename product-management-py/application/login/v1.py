from datetime import datetime, timedelta
from fastapi import APIRouter, Depends, HTTPException, status
from .schema import *
from .service import *
from utils.auth import *
from sqlalchemy.orm import Session
from .models import *
from utils.database import engine,SessionLocal  

Base.metadata.create_all(bind=engine)
v1=APIRouter()
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

@v1.get("/")
def getAllData():
    # return {"data":"this is all data"}
    return allDataService()

@v1.post("/login", tags=['Login'])
def login(request : LoginSchema, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.email == request.email and User.password == request.password).first()
    if not user:
        raise HTTPException(status_code=400, detail="Invalid credentials")

    if request.password != user.password:
        raise HTTPException(status_code=400, detail="Invalid credentials")

    access_token = create_access_token(data={"sub": user.email,"name": user.name})
    return {"access_token": access_token, "token_type": "bearer", "name": user.name, "email": user.email}

@v1.post("/reg", status_code=status.HTTP_201_CREATED ,tags=['Login'])
def register_user(request: RegisterRequest, db: Session = Depends(get_db)):
    # Check if email already exists
    existing_user = db.query(User).filter(User.email == request.email).first()
    if existing_user:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Email already registered"
        )

    new_user = User(email=request.email,name=request.name, password=request.password)
    db.add(new_user)
    db.commit()
    db.refresh(new_user)

    return {"message": "User registered successfully", "email": new_user.email}