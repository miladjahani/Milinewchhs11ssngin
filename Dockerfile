FROM python:3.12-slim-bookworm

# Set environment variables
ENV PYTHONUNBUFFERED=1 \
    PYTHONDONTWRITEBYTECODE=1 \
    PORT=8000

# Install OS dependencies
RUN apt-get update && apt-get install -y --no-install-recommends \
    curl \
    ca-certificates \
    && rm -rf /var/lib/apt/lists/*

# Create non-root user and group
RUN groupadd -g 10001 miliconfig && \
    useradd -u 10001 -g miliconfig -s /bin/bash -m miliconfig

WORKDIR /home/miliconfig/app

# Copy dependency definition
COPY requirements.txt .

# Install python dependencies
RUN pip install --no-cache-dir -r requirements.txt

# Copy application files
COPY . .

# Ensure scripts are executable and ownership is set
RUN chmod +x start.sh entrypoint.sh 2>/dev/null || true
RUN chown -R miliconfig:miliconfig /home/miliconfig/app

# Switch to non-root user
USER miliconfig

# Expose port (metadata)
EXPOSE 8000

# Health check
HEALTHCHECK --interval=30s --timeout=5s --start-period=10s --retries=3 \
    CMD python3 -c "import urllib.request, os; port = os.environ.get('PORT', '8000'); urllib.request.urlopen(f'http://127.0.0.1:{port}/health')" || exit 1

# Production startup command matching stanngv2 standard
CMD ["python3", "main.py"]
