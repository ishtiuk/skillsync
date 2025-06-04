FROM python:3.11.4

# Install system dependencies for OpenCV
RUN apt-get update && apt-get install -y \
    libgl1-mesa-glx \
    libglib2.0-0 \
    && rm -rf /var/lib/apt/lists/*

WORKDIR /green_jobs_backend/app/

COPY ./requirements.txt requirements.txt
RUN python -m pip install --upgrade pip
RUN python -m pip install -r requirements.txt

WORKDIR /green_jobs_backend/
COPY . .

ENV PYTHONPATH=/green_jobs_backend
CMD alembic upgrade head && python main.py
