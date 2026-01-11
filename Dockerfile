FROM python:3.11-slim

# Install system dependencies
RUN apt-get update && apt-get install -y \
    cron \
    netcat-openbsd \
    && rm -rf /var/lib/apt/lists/*

WORKDIR /app

# Install Python requirements
COPY mysite/requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt
RUN pip install --no-cache-dir gunicorn

# Copy the Django project code
COPY mysite/ .

# Copy and prepare entrypoint
COPY entrypoint.sh /entrypoint.sh
RUN chmod +x /entrypoint.sh

# Setup Cron for archiving
# This runs the consumer every hour and ensures it's in the /app context
RUN echo "0 * * * * cd /app && /usr/local/bin/python consumers/archive_consumer.py >> /app/archive_test.log 2>&1" > /etc/cron.d/archive-cron
RUN chmod 0644 /etc/cron.d/archive-cron
RUN crontab /etc/cron.d/archive-cron

# Create directory for static files and archives
RUN mkdir -p /app/staticfiles /app/stock_archives

ENTRYPOINT ["/entrypoint.sh"]