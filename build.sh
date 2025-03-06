#!/usr/bin/env bash

# Exit script on any error
set -o errexit

# Install dependencies
pip install --upgrade pip
pip install -r requirements.txt

# Run database migrations (if using SQLite, PostgreSQL, etc.)
# Example: alembic upgrade head (only if you're using Alembic for migrations)

# Start the FastAPI server with Uvicorn
uvicorn main:app --host 0.0.0.0 --port 10000
