#!/bin/bash

# Function to wait for a service to be ready
wait_for_service() {
    echo "Waiting for $1:$2..."
    while ! nc -z $1 $2; do
      sleep 1
    done
    echo "$1:$2 is up!"
}

if [ "$1" = "web" ]; then
    wait_for_service redis 6379
    python manage.py migrate
    python manage.py collectstatic --noinput
    exec gunicorn mysite.wsgi:application --bind 0.0.0.0:8000 --workers 3

elif [ "$1" = "consumer-inventory" ]; then
    wait_for_service kafka 29092
    exec python consumers/inventory_consumer.py

elif [ "$1" = "consumer-alert" ]; then
    wait_for_service kafka 29092
    exec python consumers/alert_consumer.py

elif [ "$1" = "cron" ]; then
    # Start cron in foreground
    exec cron -f
fi