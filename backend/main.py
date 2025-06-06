import pathlib

import uvicorn
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.middleware.gzip import GZipMiddleware
from fastapi.openapi.utils import get_openapi

from app.middleware.auth import ValidationMiddleware
from app.routes import router as api_router
from core.config import settings
from core.constants import constants
from core.logger import logger

environment = settings.APP_ENV

app = FastAPI()

origins = [settings.CANDID_HOST, settings.PATHWAYS_HOST, settings.FRONTEND_HOST]


def custom_openapi():
    if app.openapi_schema:
        return app.openapi_schema

    openapi_schema = get_openapi(
        title="Your API",
        version="1.0.0",
        description="API documentation with JWT authentication",
        routes=app.routes,
    )

    # Define security scheme for Bearer authentication
    openapi_schema["components"] = openapi_schema.get("components", {})
    openapi_schema["components"]["securitySchemes"] = {
        "BearerAuth": {
            "type": "http",
            "scheme": "bearer",
            "bearerFormat": "JWT",
        }
    }

    # Add Bearer token to all paths except for the public ones
    for path, methods in openapi_schema["paths"].items():
        for method in methods:
            method_upper = method.upper()
            # Convert path parameters to match the format in PUBLIC_API_PATHS
            normalized_path = path.replace("{id}", "{id:uuid}")

            path_is_public = [method_upper, normalized_path] in constants.PUBLIC_API_PATHS

            if not path_is_public:
                if "security" not in openapi_schema["paths"][path][method]:
                    openapi_schema["paths"][path][method]["security"] = []
                openapi_schema["paths"][path][method]["security"].append({"BearerAuth": []})

    app.openapi_schema = openapi_schema
    return app.openapi_schema


app.openapi = custom_openapi

app.include_router(api_router)

validation_middleware = ValidationMiddleware()
app.middleware("http")(validation_middleware)
app.add_middleware(GZipMiddleware, minimum_size=1000)

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

if __name__ == "__main__":
    cwd = pathlib.Path(__file__).parent.resolve()
    logger.info("Starting uvicorn server")
    uvicorn.run("main:app", host="0.0.0.0", port=5000, reload=True)
