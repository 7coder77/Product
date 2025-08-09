from pydantic import BaseModel,EmailStr

class LoginSchema(BaseModel):
    email:str
    password:str

class RegisterRequest(BaseModel):
    email: EmailStr
    password: str
    name:str