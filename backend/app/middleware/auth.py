import re

from fastapi import HTTPException, Request, status
from fastapi.responses import JSONResponse

from app.utils.security import verify_token
from core.constants import constants


class ValidationMiddleware:
    PARAM_PATTERNS = {
        "uuid": r"[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}",
        "int": r"[0-9]+",
        "str": r"[^/]+",
        "username": r"[\w\-.]+",
        "url": r"[a-zA-Z0-9\-._~:/?#\[\]@!$&\'()*+,;=]+",
        "email": r"[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}",
    }

    async def __call__(self, request: Request, call_next):
        try:
            if request.method == "OPTIONS":
                return await call_next(request)
            if self.check_api_accessibility(request):
                auth_header = request.headers.get("Authorization")
                if auth_header and auth_header.startswith("Bearer "):
                    token = auth_header.split(" ")[1]
                    email, platform = verify_token(token)
                    request.app.state.user = email
                    request.app.state.platform = platform
                else:
                    return JSONResponse(
                        status_code=status.HTTP_401_UNAUTHORIZED,
                        content="Authorization token missing",
                    )
            return await call_next(request)
        except HTTPException as e:
            return JSONResponse(status_code=e.status_code, content=e.detail)
        except Exception as e:
            return JSONResponse(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, content=str(e))

    def check_api_accessibility(self, request):
        api_path = request.url.path
        method = request.method

        if self._match_path_pattern(method, api_path, constants.PUBLIC_API_PATHS):
            return False
        if self._match_path_pattern(method, api_path, constants.OPENAPI_PATHS):
            return False

        return True

    def _match_path_pattern(self, method, api_path, paths_to_check):
        for path_method, path_pattern in paths_to_check:
            if method != path_method:
                continue

            # First escape the entire pattern except for our placeholder
            regex_pattern = re.escape(path_pattern)

            # Replace the escaped version of our placeholder with UUID pattern
            regex_pattern = regex_pattern.replace(r"\{id:uuid\}", self.PARAM_PATTERNS["uuid"])

            # Add start and end anchors
            regex_pattern = f"^{regex_pattern}$"

            try:
                if re.match(regex_pattern, api_path):
                    return True
            except re.error:
                continue

        return False
