FROM python:3.12-slim

WORKDIR /app

# Install system dependencies (including Node for building frontend)
RUN apt-get update && apt-get install -y \
    build-essential \
    nodejs \
    npm \
    && rm -rf /var/lib/apt/lists/*

# Copy Python requirements and install
COPY requirements.txt .
RUN pip install --upgrade pip setuptools wheel && \
    pip install -r requirements.txt

# Copy frontend and build it
COPY frontend ./frontend
RUN cd frontend && npm ci && npm run build

# Copy backend and project root files (manage.py, etc.)
COPY backend ./backend
COPY manage.py .
COPY railpack.toml . || true

# Ensure backend static dir exists and copy frontend build into it
RUN mkdir -p backend/static
RUN cp -r frontend/dist/* backend/static/ || true

# Collect static files into STATIC_ROOT
ENV DJANGO_SETTINGS_MODULE=backend.settings
RUN python manage.py collectstatic --noinput

EXPOSE 8000

CMD ["gunicorn", "backend.wsgi:application", "--bind", "0.0.0.0:8000"]
