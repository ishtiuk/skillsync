import sys

from loguru import logger

logger.remove()

logger.add(
    sink=sys.stdout,
    level="INFO",
    format=(
        "<green>{time:YYYY-MM-DD HH:mm:ss.SSS}</green> | "
        "<level><bold>{level: <8}</bold></level> | "
        "<blue>{name}</blue>:<cyan>{function}</cyan>:<magenta>{line}</magenta> | "
        "<yellow>{process.name}</yellow>:<red>{thread.name}</red> | "
        "<level>{message}</level>"
    ),
    colorize=True,
    enqueue=True,
    backtrace=True,  # Enables detailed exception tracebacks
    diagnose=True,  # Shows variable values in tracebacks
)
