import os
from typing import Optional

import boto3
from dotenv import load_dotenv
from pydantic import ConfigDict
from pydantic_settings import BaseSettings

if not os.getenv("SQLALCHEMY_DATABASE_URI"):
    load_dotenv()

boto3.setup_default_session(
    aws_access_key_id=os.environ.get("AWS_ACCESS_KEY_ID"),
    aws_secret_access_key=os.environ.get("AWS_SECRET_ACCESS_KEY"),
    region_name=os.environ.get("AWS_DEFAULT_REGION"),
)

class Settings(BaseSettings):
    model_config = ConfigDict(case_sensitive=True)

    PROJECT_NAME: str = "Green Jobs Backend"
    APP_ENV: str = os.environ["APP_ENV"]
    CANDID_HOST: str = os.environ["CANDID_HOST"]
    PATHWAYS_HOST: str = os.environ["PATHWAYS_HOST"]

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

    #openai
    OPENAI_API_KEY: Optional[str] = os.environ["OPENAI_API_KEY"]


settings = Settings()
