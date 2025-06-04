from datetime import datetime, timedelta, timezone
from typing import Any, Union

from fastapi import HTTPException
from jose import JWTError, jwt
from passlib.context import CryptContext

from app.db.crud import CRUDBase
from app.models.user import BaseUser, UserCandid, UserPathways
from app.schemas.user import Platform
from core.config import settings

base_user_crud = CRUDBase(model=BaseUser)
pathways_user_crud = CRUDBase(model=UserPathways)
candid_user_crud = CRUDBase(model=UserCandid)

password_context = CryptContext(schemes=["bcrypt"], deprecated="auto")


def create_access_token(
    subject: Union[str, Any], platform: Platform, expires_delta: int = None
) -> str:
    if expires_delta:
        expire = datetime.now(timezone.utc) + expires_delta
    else:
        expire = datetime.now(timezone.utc) + timedelta(
            minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES
        )

    to_encode = {"exp": expire, "sub": str(subject), "platform": platform.value}
    return jwt.encode(to_encode, settings.JWT_SECRET_KEY, settings.JWT_ALGORITHM)


# def create_refresh_token(subject: Union[str, Any], expires_delta: int = None) -> str:
#     if expires_delta is not None:
#         expires_delta = datetime.utcnow() + expires_delta
#     else:
#         expires_delta = datetime.utcnow() + timedelta(minutes=settings.REFRESH_TOKEN_EXPIRE_MINUTES)

#     to_encode = {"exp": expires_delta, "sub": str(subject)}
#     encoded_jwt = jwt.encode(to_encode, settings.JWT_SECRET_KEY, ALGORITHM)
#     return encoded_jwt


def verify_token(token: str) -> tuple[str, str]:
    try:
        payload = jwt.decode(token, settings.JWT_SECRET_KEY, algorithms=[settings.JWT_ALGORITHM])
        email: str = payload.get("sub")
        platform: str = payload.get("platform")
        if not email or not platform:
            raise HTTPException(status_code=401, detail="Invalid token payload")
        return email, platform
    except JWTError:
        raise HTTPException(status_code=401, detail="Invalid token")


def verify_password(plain_password: str, hashed_password: str) -> bool:
    return password_context.verify(plain_password, hashed_password)


def get_password_hash(password: str) -> str:
    return password_context.hash(password)
