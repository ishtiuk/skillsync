from core.logger import logger
import traceback

from fastapi import status

from core.constants import error_messages




class BaseCustomException(Exception):
    def __init__(self, message, status_code):
        self.message = message
        self.status_code = status_code
        super().__init__(message)


class ResourceNotFound(BaseCustomException):
    def __init__(self, message=error_messages.RESOURCE_NOT_FOUND):
        super().__init__(message, status.HTTP_404_NOT_FOUND)


class InvalidUserException(BaseCustomException):
    def __init__(self, message):
        status_code = self.get_status_code(message)
        super().__init__(message, status_code)

    @staticmethod
    def get_status_code(message):
        if message == error_messages.INVALID_USER_EXCEPTION["INVALID_USER_NAME_PASSWORD"]:
            return status.HTTP_401_UNAUTHORIZED
        elif message == error_messages.INVALID_USER_EXCEPTION["EMAIL_NOT_FOUND"]:
            return status.HTTP_400_BAD_REQUEST
        elif message == error_messages.INVALID_USER_EXCEPTION["USER_NOT_CONFIRMED"]:
            return status.HTTP_401_UNAUTHORIZED
        elif message == error_messages.INVALID_USER_EXCEPTION["PASSWORD_RESET_REQUIRED"]:
            return status.HTTP_401_UNAUTHORIZED
        else:
            return status.HTTP_403_FORBIDDEN


class GoogleAuthException(BaseCustomException):
    def __init__(self, message, status_code=status.HTTP_401_UNAUTHORIZED):
        super().__init__(message, status_code)


class DatabaseException(BaseCustomException):
    def __init__(
        self,
        message=error_messages.INTERNAL_SERVER_ERROR,
        status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
    ):
        super().__init__(message, status_code)


class S3Exception(BaseCustomException):
    def __init__(
        self,
        message=error_messages.S3_EXCEPTION["UNKNOWN_ERROR"],
        status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
    ):
        super().__init__(message, status_code)


class ValidationException(BaseCustomException):
    def __init__(
        self,
        message=error_messages.VALIDATION_ERROR,
        status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
    ):
        super().__init__(message, status_code)


class PermissionDeniedException(BaseCustomException):
    def __init__(
        self, message=error_messages.PERMISSION_DENIED, status_code=status.HTTP_403_FORBIDDEN
    ):
        super().__init__(message, status_code)


class ConflictException(BaseCustomException):
    def __init__(self, message=error_messages.CONFLICT_ERROR, status_code=status.HTTP_409_CONFLICT):
        super().__init__(message, status_code)


class CustomException(Exception):
    def __init__(self, error):
        self.error = error
        self.status_code = self.get_status_code()
        self.message = self.get_message()
        logger.error(self.message)
        self.print_exception()
        super().__init__(error)

    def get_status_code(self):
        if isinstance(self.error, ResourceNotFound):
            return status.HTTP_404_NOT_FOUND
        else:
            return status.HTTP_500_INTERNAL_SERVER_ERROR

    def get_message(self):
        if isinstance(self.error, ResourceNotFound):
            return error_messages.RESOURCE_NOT_FOUND
        else:
            return error_messages.INTERNAL_SERVER_ERROR

    def print_exception(self):
        logger.error(traceback.format_exc())
        logger.error(self.message)
        return self.message
