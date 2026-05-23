# =========================================================================
# AquaSense — Smart Irrigation Platform
# Production container.  Build:  docker build -t aquasense .
# Run:                            docker run -p 8080:8080 aquasense
# =========================================================================
FROM python:3.11-slim

ENV PYTHONUNBUFFERED=1 \
    PIP_NO_CACHE_DIR=1 \
    PIP_DISABLE_PIP_VERSION_CHECK=1 \
    FLASK_ENV=production \
    PORT=8080

WORKDIR /app

# Minimal system deps for matplotlib + scientific stack
RUN apt-get update && apt-get install -y --no-install-recommends \
        build-essential \
        libffi-dev \
        libfreetype6-dev \
    && rm -rf /var/lib/apt/lists/*

# Install Python deps first for better layer caching
COPY requirements.txt .
RUN pip install --upgrade pip && pip install -r requirements.txt

# App source
COPY . .

# Pre-generate the plot files referenced by the dashboard (best-effort)
# Skipped if data not yet present — the dashboard handles missing plots
RUN mkdir -p results/plots

EXPOSE 8080

CMD ["sh", "-c", "gunicorn app:app --bind 0.0.0.0:${PORT} --workers 1 --threads 4 --timeout 300 --log-file -"]
