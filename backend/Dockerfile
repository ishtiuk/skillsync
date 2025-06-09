FROM python:3.11.8

# Install system dependencies required by OpenCV and dlib
RUN apt-get update && apt-get install -y \
    build-essential \
    cmake \
    pkg-config \
    libboost-python-dev \
    libboost-all-dev \
    libglib2.0-0 \
    libgl1-mesa-glx \
    libx11-dev \
    libopenblas-dev \
    liblapack-dev \
    libatlas-base-dev \
    && rm -rf /var/lib/apt/lists/*

# Set CMake policy version and configuration for ARM compatibility
ENV CMAKE_POLICY_DEFAULT_CMP0048=NEW
ENV CMAKE_POLICY_VERSION_MINIMUM=3.22
ENV OPENBLAS_CORETYPE=ARMV8

WORKDIR /skillsync_backend/app/

COPY ./requirements.txt requirements.txt
RUN python -m pip install --upgrade pip

# Then install other requirements
RUN python -m pip install -r requirements.txt

WORKDIR /skillsync_backend/
COPY . .

ENV PYTHONPATH=/skillsync_backend
CMD alembic upgrade head && python main.py
