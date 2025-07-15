import json
import uuid
from datetime import datetime
from typing import Any, Optional

import redis

from core.config import settings
from core.logger import logger


class RedisClient:
    def __init__(self):
        self.redis_client = redis.Redis(
            host=settings.REDIS_HOST,
            port=settings.REDIS_PORT,
            password=settings.REDIS_PASSWORD if settings.REDIS_PASSWORD else None,
            ssl=settings.REDIS_SSL,
            db=0,
            decode_responses=True,
        )

    def _serialize(self, value: Any) -> str:
        """
        Custom JSON serializer that handles datetime and UUID
        """

        def default_serializer(obj):
            if isinstance(obj, datetime):
                return obj.isoformat()
            if isinstance(obj, uuid.UUID):
                return str(obj)
            raise TypeError(f"Type {type(obj)} not serializable")

        return json.dumps(value, default=default_serializer)

    def _deserialize(self, value: str) -> Any:
        """
        Custom JSON deserializer
        """
        return json.loads(value)

    def set_with_expiry(self, key: str, value: Any, expiry_seconds: Optional[int] = None) -> bool:
        """
        Set a key with expiration time
        """
        if expiry_seconds is None:
            expiry_seconds = settings.REDIS_CACHE_EXPIRY

        try:
            serialized_value = self._serialize(value)
            return self.redis_client.setex(name=key, time=expiry_seconds, value=serialized_value)
        except Exception as e:
            logger.error(f"Redis set error: {e}")
            return False

    def get(self, key: str) -> Optional[Any]:
        """
        Get a value from Redis
        """
        try:
            value = self.redis_client.get(key)
            if value is None:
                return None
            return self._deserialize(value)
        except Exception as e:
            logger.error(f"Redis get error: {e}")
            return None

    def delete(self, key: str) -> bool:
        """
        Delete a key from Redis
        """
        try:
            return bool(self.redis_client.delete(key))
        except Exception as e:
            logger.error(f"Redis delete error: {e}")
            return False

    def delete_pattern(self, pattern: str) -> bool:
        """
        Delete all keys matching a pattern
        """
        try:
            keys = self.redis_client.keys(pattern)
            if keys:
                return bool(self.redis_client.delete(*keys))
            return True
        except Exception as e:
            logger.error(f"Redis delete pattern error: {e}")
            return False


redis_client = RedisClient()
