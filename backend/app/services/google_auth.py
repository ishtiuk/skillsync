import requests
from fastapi import status

# from google.auth.transport import requests
from app.utils.exceptions import GoogleAuthException
from core.config import settings
from core.logger import logger


class GoogleAuthService:
    def __init__(self):
        self.project_id = settings.GOOGLE_PROJECT_ID
        self.client_id = settings.GOOGLE_CLIENT_ID
        self.client_secret = settings.GOOGLE_CLIENT_SECRET
        self.token_info_url = "https://oauth2.googleapis.com/tokeninfo"
        self.user_info_url = "https://www.googleapis.com/oauth2/v3/userinfo"

    def get_user_info(self, token):
        try:
            response = requests.get(
                self.user_info_url + f"?access_token={token}",
                headers={"Authorization": f"Bearer {token}"},
            )
        except Exception as e:
            logger.error(f"User info request failed: {e}")
            raise GoogleAuthException(
                message="User info request failed",
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            )

        if response.status_code != 200:
            logger.error(f"User info request failed: {response.status_code} - {response.text}")
            raise GoogleAuthException(
                message="User info request failed",
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            )

        try:
            user_info = response.json()
        except ValueError as e:
            logger.error(f"Error parsing user info response: {e}")
            raise GoogleAuthException(
                message="User info request failed",
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            )

        return user_info

    # def validate_token(self, token):

    #     try:
    #         response = id_token.verify_oauth2_token(
    #             token, requests.Request(), self.client_id
    #         )
    #     except Exception as e:
    #         logger.error(f"Token validation request failed: {e}")
    #         raise GoogleAuthException(
    #             message="Token validation request failed",
    #             status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
    #         )

    #     # try:
    #     #     token_info = response.json()
    #     # except ValueError as e:
    #     #     logger.error(f"Error parsing token info response: {e}")
    #     #     raise GoogleAuthException(message="Token validation request failed", status_code=status.HTTP_500_INTERNAL_SERVER_ERROR)

    #     if (
    #         response.get("aud") != self.client_id
    #         or response.get("azp") != self.client_id
    #     ):
    #         logger.error("Token audience does not match client ID")
    #         return None

    #     if response.get("iss") not in [
    #         "accounts.google.com",
    #         "https://accounts.google.com",
    #     ]:
    #         logger.error("Token issuer is invalid")
    #         return None

    #     return response["email"]


google_auth_service = GoogleAuthService()


# from core.logger import logger
# import requests
# from fastapi import status
# from google.auth.transport import requests as google_requests
# from google.oauth2 import id_token

# from app.utils.exceptions import GoogleAuthException
# from core.config import settings

#


# class GoogleAuthService:
#     def __init__(self):
#         self.client_id = settings.GOOGLE_CLIENT_ID

#     def validate_token(self, token: str) -> dict:
#         """
#         Validate a Google token and return user information.

#         This method distinguishes between an ID token (JWT) and an access token.
#         - For JWTs, it uses local verification.
#         - For access tokens, it calls the Google userinfo endpoint.
#         """
#         try:
#             # Check if token is a JWT (ID token) by verifying its segment count.
#             if token.count(".") == 2:
#                 # Verify the ID token locally (this checks signature, expiry, audience, etc.)
#                 id_info = id_token.verify_oauth2_token(
#                     token,
#                     google_requests.Request(),
#                     self.client_id,
#                 )
#                 logger.info("ID token verified locally.")
#             else:
#                 # Treat as an access token: call the userinfo endpoint to retrieve user details.
#                 headers = {"Authorization": f"Bearer {token}"}
#                 response = requests.get(
#                     "https://www.googleapis.com/oauth2/v3/userinfo",
#                     headers=headers,
#                 )
#                 response.raise_for_status()
#                 id_info = response.json()
#                 logger.info("Access token validated via userinfo endpoint.")
#                 # Note: The userinfo endpoint may not return an 'iss' field.

#             # If available, check that the issuer is valid (this is applicable for ID tokens).
#             if "iss" in id_info and id_info.get("iss") not in [
#                 "accounts.google.com",
#                 "https://accounts.google.com",
#             ]:
#                 raise GoogleAuthException("Wrong issuer.", status.HTTP_401_UNAUTHORIZED)

#             # Check email verification if provided (for ID tokens, email_verified is expected).
#             # For access tokens, this field might be absent; assume verified if not present.
#             if not id_info.get("email_verified", True):
#                 raise GoogleAuthException("Email not verified.", status.HTTP_401_UNAUTHORIZED)

#             return {
#                 "email": id_info.get("email"),
#                 "sub": id_info.get("sub"),
#                 "name": id_info.get("name"),
#                 "picture": id_info.get("picture"),
#                 "verified": id_info.get("email_verified", True),
#             }
#         except Exception as e:
#             logger.error(f"Token validation failed: {str(e)}")
#             raise GoogleAuthException("Authentication failed.", status.HTTP_401_UNAUTHORIZED)


# google_auth_service = GoogleAuthService()
