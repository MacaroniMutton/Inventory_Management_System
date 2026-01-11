# messaging/kafka/producer.py
import json
from django_statsd.middleware import incr

def send_event(producer, topic, event):
    try:
        producer.send(topic, event)
        incr("kafka.producer.success")
    except Exception:
        incr("kafka.producer.failure")
        raise
