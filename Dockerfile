FROM python:3.12-slim

WORKDIR /app

# Install system dependencies (Python + Node.js for React build)
RUN apt-get update && apt-get install -y \
    build-essential nodejs npm \
    && rm -rf /var/lib/apt/lists/*

# Copy and install Python dependencies
COPY requirements.txt .
RUN pip install --upgrade pip setuptools wheel && \
    pip install -r requirements.txt

# Build React frontend
COPY frontend ./frontend
RUN cd frontend && npm install && npm run build

# Copy backend code
COPY backend ./backend

# Move React build into Django static files
RUN mkdir -p backend/static
RUN cp -r frontend/dist/* backend/static/

RUN python manage.py collectstatic --noinput

EXPOSE 8000

CMD ["gunicorn", "backend.wsgi:application", "--bind", "0.0.0.0:8000"]
