from pydantic_settings import BaseSettings


class Constants(BaseSettings):
    API_DOC_NAME: str = "api_docs.json"
    API_DOC_TITLE: str = "Green Jobs API Doc"
    API_VERSION: str = "/api/v1"
    APP_EXECUTION_ENV: dict = {"PRODUCTION": "prod"}
    MIDDLEWARE_FOLDER_PATH: str = "app/middlewares"
    OPENAPI_PATHS: list = [["GET", "/docs"], ["GET", "/openapi.json"], ["GET", "/favicon.ico"]]

    PUBLIC_API_PATHS: list = [
        ["POST", f"{API_VERSION}/auth/login/self"],
        ["POST", f"{API_VERSION}/user/self"],
        ["POST", f"{API_VERSION}/password-reset-request"],
        ["PUT", f"{API_VERSION}/user/update-password"],
        ["GET", f"{API_VERSION}/public-data"],
        ["POST", f"{API_VERSION}/auth/login/google"],
        ["POST", f"{API_VERSION}/user/google"],
        ["POST", f"{API_VERSION}/user/password-reset-request"],
        ["POST", f"{API_VERSION}/user/password-reset"],
        ["GET", f"{API_VERSION}/user/public/{{id:uuid}}"],
        ["GET", f"{API_VERSION}/positions/public/{{id:uuid}}"],
    ]

    BASE_JOB_STAGES: dict = {
        "saved": False,
        "applied": False,
        "interview-1": False,
        "offer": False,
        "hired": False,
        "past-roles": False,
        "ineligible": False,
    }

    STAGE_ORDER_PREFIX: list = [
        "saved",
        "applied",
    ]

    STAGE_ORDER_SUFFIX: list = [
        "offer",
        "hired",
        "past-roles",
        "ineligible",
    ]

    PRESIGNED_URL_EXPIRATION: int = 3600
    PROFILE_IMAGE_NAME: str = "/profile"
    TEST_EXECUTION: str = "test"


constants = Constants()


class ERROR_MESSAGES(BaseSettings):
    INTERNAL_SERVER_ERROR: str = "Internal server error"
    RESOURCE_NOT_FOUND: str = "Resource not found"
    VALIDATION_ERROR: str = "Validation error"
    PERMISSION_DENIED: str = "Permission denied"
    CONFLICT_ERROR: str = "Conflict error"

    INVALID_USER_EXCEPTION: dict = {
        "EMAIL_NOT_FOUND": "Email not found",
        "INVALID_USER_NAME_PASSWORD": "Invalid username or password",
        "USER_NOT_CONFIRMED": "User not confirmed",
        "PASSWORD_RESET_REQUIRED": "Password reset required",
    }

    MILESTONE_EXCEPTIONS: dict = {
        "INVALID_TASK_FORMAT": "Invalid task format - must be a dictionary of task name and status",
        "MILESTONE_UPDATE_FAILED": "Failed to update milestone",
        "MILESTONE_CREATE_FAILED": "Failed to create milestone",
    }

    DATABASE_EXCEPTION: dict = {
        "CONNECTION_ERROR": "Database connection error",
        "INTEGRITY_ERROR": "Database integrity error",
        "UNKNOWN_ERROR": "Unknown database error",
    }

    GOOGLE_AUTH_EXCEPTION: dict = {
        "INVALID_TOKEN": "Invalid Google token",
        "EMAIL_MISMATCH": "Google email mismatch",
    }

    S3_EXCEPTION: dict = {
        "AWS_CREDENTIALS_ERROR": "AWS credentials error",
        "UNKNOWN_ERROR": "Unknown S3 error",
    }


error_messages = ERROR_MESSAGES()
