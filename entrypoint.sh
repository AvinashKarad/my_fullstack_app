#!/bin/sh
set -e

echo "=== Running database migrations ==="
python manage.py migrate --noinput
echo "=== Migrations complete ==="

echo "=== Starting Gunicorn ==="
exec gunicorn backend.wsgi:application --bind 0.0.0.0:8000
