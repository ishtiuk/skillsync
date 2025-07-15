import os
from typing import Optional

import boto3
from dotenv import load_dotenv
from pydantic_settings import BaseSettings, SettingsConfigDict

if not os.getenv("SQLALCHEMY_DATABASE_URI"):
    load_dotenv()

boto3.setup_default_session(
    aws_access_key_id=os.environ.get("AWS_ACCESS_KEY_ID"),
    aws_secret_access_key=os.environ.get("AWS_SECRET_ACCESS_KEY"),
    region_name=os.environ.get("AWS_DEFAULT_REGION"),
)


class Settings(BaseSettings):
    model_config = SettingsConfigDict(env_file=".env", case_sensitive=True)

    PROJECT_NAME: str = "Green Jobs Backend"
    APP_ENV: str = os.environ["APP_ENV"]
    TALENTHUB_HOST: str = os.environ["TALENTHUB_HOST"]
    CAREERFORGE_HOST: str = os.environ["CAREERFORGE_HOST"]
    FRONTEND_HOST: str = "http://localhost:8080"

    ACCESS_TOKEN_EXPIRE_MINUTES: int = 60 * 24 * 7  # one week
    JWT_ALGORITHM: str = "HS256"
    JWT_SECRET_KEY: str = os.environ["JWT_SECRET_KEY"]

    # DB
    SQLALCHEMY_DATABASE_URI: Optional[str] = os.environ["SQLALCHEMY_DATABASE_URI"]

    AWS_S3_BUCKET: Optional[str] = os.environ["AWS_S3_BUCKET"]

    # google
    GOOGLE_PROJECT_ID: Optional[str] = os.environ["GOOGLE_PROJECT_ID"]
    GOOGLE_CLIENT_ID: Optional[str] = os.environ["GOOGLE_CLIENT_ID"]
    GOOGLE_CLIENT_SECRET: Optional[str] = os.environ["GOOGLE_CLIENT_SECRET"]

    # openai
    OPENAI_API_KEY: Optional[str] = os.environ["OPENAI_API_KEY"]

    # Redis settings
    REDIS_HOST: str = "localhost"
    REDIS_PORT: int = 6379
    REDIS_PASSWORD: str = ""  # Add password if needed
    REDIS_SSL: bool = False
    REDIS_CACHE_EXPIRY: int = 300  # 5 minutes default


settings = Settings()
