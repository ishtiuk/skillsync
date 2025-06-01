import boto3
from botocore.exceptions import ClientError, NoCredentialsError, PartialCredentialsError

from app.utils.exceptions import S3Exception
from core.constants import error_messages
from core.logger import logger


class S3Services:
    def __init__(self):
        self.s3_client = boto3.client("s3")

    def generate_presigned_url(
        self,
        bucket_name: str,
        object_key: str,
        content_type: str = "",
        operation="get_object",
        expiration=3600,
    ):
        try:
            if operation == "get_object":
                presigned_url = self.s3_client.generate_presigned_url(
                    ClientMethod=operation,
                    Params={"Bucket": bucket_name, "Key": object_key},
                    ExpiresIn=expiration,
                )
            else:
                presigned_url = self.s3_client.generate_presigned_post(
                    Bucket=bucket_name,
                    Key=object_key,
                    Fields={"Content-Type": content_type},
                    Conditions=[{"Content-Type": content_type}],
                    ExpiresIn=expiration,
                )
            return presigned_url

        except (NoCredentialsError, PartialCredentialsError):
            logger.error(error_messages.S3_EXCEPTION["AWS_CREDENTIALS_MISSING"])
            raise S3Exception(error_messages.S3_EXCEPTION["AWS_CREDENTIALS_MISSING"])
        except Exception as e:
            logger.error(f"An error occurred: {e}")
            raise S3Exception(error_messages.S3_EXCEPTION["UNKNOWN_ERROR"])

    def upload_file(self, bucket_name, file_name: str, object_key: str):
        try:
            self.s3_client.upload_file(file_name, bucket_name, object_key)
            logger.info(f"File {file_name} uploaded to {bucket_name}/{object_key}")
        except (NoCredentialsError, PartialCredentialsError):
            logger.error(error_messages.S3_EXCEPTION["AWS_CREDENTIALS_MISSING"])
            raise S3Exception(error_messages.S3_EXCEPTION["AWS_CREDENTIALS_MISSING"])
        except ClientError as e:
            logger.error(f"An error occurred: {e}")
            raise S3Exception(error_messages.S3_EXCEPTION["UNKNOWN_ERROR"])
        except Exception as e:
            logger.error(f"An unexpected error occurred: {e}")
            raise S3Exception(error_messages.S3_EXCEPTION["UNKNOWN_ERROR"])

    def upload_file_content(
        self, bucket_name: str, object_key: str, file_content: bytes, content_type: str
    ):
        try:
            self.s3_client.put_object(
                Bucket=bucket_name, Key=object_key, Body=file_content, ContentType=content_type
            )
            logger.info(f"File content uploaded to {bucket_name}/{object_key}")
        except (NoCredentialsError, PartialCredentialsError):
            logger.error(error_messages.S3_EXCEPTION["AWS_CREDENTIALS_MISSING"])
            raise S3Exception(error_messages.S3_EXCEPTION["AWS_CREDENTIALS_MISSING"])
        except ClientError as e:
            logger.error(f"An error occurred while uploading file content: {e}")
            raise S3Exception(error_messages.S3_EXCEPTION["UNKNOWN_ERROR"])
        except Exception as e:
            logger.error(f"An unexpected error occurred while uploading file content: {e}")
            raise S3Exception(error_messages.S3_EXCEPTION["UNKNOWN_ERROR"])

    def download_file(self, bucket_name, object_key: str, file_name: str):
        try:
            self.s3_client.download_file(bucket_name, object_key, file_name)
            logger.info(f"File {file_name} downloaded from {bucket_name}/{object_key}")
        except (NoCredentialsError, PartialCredentialsError):
            logger.error(error_messages.S3_EXCEPTION["AWS_CREDENTIALS_MISSING"])
            raise S3Exception(error_messages.S3_EXCEPTION["AWS_CREDENTIALS_MISSING"])
        except ClientError as e:
            logger.error(f"An error occurred: {e}")
            raise S3Exception(error_messages.S3_EXCEPTION["UNKNOWN_ERROR"])
        except Exception as e:
            logger.error(f"An unexpected error occurred: {e}")
            raise S3Exception(error_messages.S3_EXCEPTION["UNKNOWN_ERROR"])

    def delete_object(self, bucket_name, object_key: str):
        try:
            self.s3_client.delete_object(Bucket=bucket_name, Key=object_key)
            logger.info(f"Object {object_key} deleted from {bucket_name}")
        except (NoCredentialsError, PartialCredentialsError):
            logger.error(error_messages.S3_EXCEPTION["AWS_CREDENTIALS_MISSING"])
            raise S3Exception(error_messages.S3_EXCEPTION["AWS_CREDENTIALS_MISSING"])
        except ClientError as e:
            logger.error(f"An error occurred: {e}")
            raise S3Exception(error_messages.S3_EXCEPTION["UNKNOWN_ERROR"])
        except Exception as e:
            logger.error(f"An unexpected error occurred: {e}")
            raise S3Exception(error_messages.S3_EXCEPTION["UNKNOWN_ERROR"])


s3_services = S3Services()
