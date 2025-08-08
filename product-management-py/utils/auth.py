from fastapi import Request, HTTPException, status
from functools import wraps
import jwt

SECRET_KEY = "your_secret_key_here"
ALGORITHM = "HS256"

def token_validator(func):
    @wraps(func)
    async def wrapper(*args, **kwargs):
        # Expecting a `Request` object in the `kwargs` or `args`
        request: Request = kwargs.get("request")
        if not request:
            # Args might have Request in position 1 for instance
            for arg in args:
                if isinstance(arg, Request):
                    request = arg
                    break
        if not request:
            raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Request object required")

        auth_header = request.headers.get("Authorization")
        if not auth_header or not auth_header.startswith("Bearer "):
            raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid or missing token")

        token = auth_header[len("Bearer "):]
        try:
            payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
            # Optionally, you can extract information from the payload and pass it to the route handler
            kwargs["current_user"] = payload.get("sub")
        except jwt.PyJWTError:
            raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid or expired token")

        return await func(*args, **kwargs)
    return wrapper
