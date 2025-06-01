from datetime import datetime, timedelta
from typing import Any, Union
from jose import jwt, JWTError
from fastapi import HTTPException, Depends
from passlib.context import CryptContext

from app.models.user import Users
from app.db.crud import CRUDBase
from app.db.session import get_db
from core.config import settings

user_crud = CRUDBase(model=Users)

password_context = CryptContext(schemes=["bcrypt"], deprecated="auto")


def create_access_token(subject: Union[str, Any], platform: str = None, expires_delta: int = None) -> str:
    if expires_delta is not None:
        expires_delta = datetime.utcnow() + expires_delta
    else:
        expires_delta = datetime.utcnow() + timedelta(minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES)
    
    to_encode = {
        "exp": expires_delta,
        "sub": str(subject),
        "platform": platform
    }
    encoded_jwt = jwt.encode(to_encode, settings.JWT_SECRET_KEY, settings.JWT_ALGORITHM)
    return encoded_jwt

# def create_refresh_token(subject: Union[str, Any], expires_delta: int = None) -> str:
#     if expires_delta is not None:
#         expires_delta = datetime.utcnow() + expires_delta
#     else:
#         expires_delta = datetime.utcnow() + timedelta(minutes=settings.REFRESH_TOKEN_EXPIRE_MINUTES)
    
#     to_encode = {"exp": expires_delta, "sub": str(subject)}
#     encoded_jwt = jwt.encode(to_encode, settings.JWT_SECRET_KEY, ALGORITHM)
#     return encoded_jwt

def verify_token(token: str, db = Depends(get_db)) -> dict:
    try:
        payload = jwt.decode(token, settings.JWT_SECRET_KEY, algorithms=[settings.JWT_ALGORITHM])
        email: str = payload.get("sub")
        platform: str = payload.get("platform")

        return {
            "email": email,
            "platform": platform
        }

    except JWTError:
        raise HTTPException(status_code=401, detail="Invalid token")

def verify_password(plain_password: str, hashed_password: str) -> bool:
    return password_context.verify(plain_password, hashed_password)


def get_password_hash(password: str) -> str:
    return password_context.hash(password)
