FROM python:3.11.4

# Install system dependencies
RUN apt-get update && apt-get install -y \
    libpq-dev \
    && rm -rf /var/lib/apt/lists/*

WORKDIR /skillsync_backend/app/

COPY ./requirements.txt requirements.txt
RUN python -m pip install --upgrade pip
RUN python -m pip install -r requirements.txt

WORKDIR /skillsync_backend/
COPY . .

ENV PYTHONPATH=/skillsync_backend
ENV PYTHONDONTWRITEBYTECODE=1
ENV PYTHONUNBUFFERED=1

CMD ["sh", "-c", "echo 'Running database migrations...' && alembic upgrade head && echo 'Starting FastAPI application...' && python main.py"]
