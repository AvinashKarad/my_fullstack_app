FROM python:3.12-slim

WORKDIR /app

# Install system dependencies including Node for frontend build
RUN apt-get update && apt-get install -y \
    build-essential \
    nodejs \
    npm \
    && rm -rf /var/lib/apt/lists/*

# Install Python dependencies
COPY requirements.txt .
RUN pip install --upgrade pip setuptools wheel && \
    pip install -r requirements.txt

# Copy frontend and build it
COPY frontend ./frontend
RUN cd frontend && npm ci && npm run build

# Copy backend and project root files
COPY backend ./backend
COPY manage.py .
COPY entrypoint.sh .

# Conditionally copy railpack.toml if it exists
RUN if [ -f railpack.toml ]; then cp railpack.toml .; else echo "railpack.toml not found, skipping"; fi

# Ensure backend static dir exists and copy frontend build into it
RUN mkdir -p backend/static
RUN cp -r frontend/dist/* backend/static/ || true

# Set Django settings module and collect static files
ENV DJANGO_SETTINGS_MODULE=backend.settings

RUN python manage.py collectstatic --noinput

RUN chmod +x entrypoint.sh

EXPOSE 8000

CMD ["sh", "-c", "echo '=== Starting ===' && echo DATABASE_URL=$DATABASE_URL | cut -c1-30 && python manage.py migrate --noinput 2>&1 && echo '=== Migrations done ===' && exec gunicorn backend.wsgi:application --bind 0.0.0.0:$PORT"]
