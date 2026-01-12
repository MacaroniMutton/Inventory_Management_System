# messaging/kafka/producer.py
import json
from django_statsd.middleware import incr
from kafka import KafkaProducer
from django.conf import settings

def send_event(topic, event):
    producer = get_producer()
    try:
        producer.send(topic, event)
        incr("kafka.producer.success")
    except Exception:
        incr("kafka.producer.failure")
        raise




# producer = KafkaProducer(
#     bootstrap_servers=settings.KAFKA_BOOTSTRAP_SERVERS,
#     value_serializer=lambda v: json.dumps(v).encode("utf-8"),
# )

_producer = None

def get_producer():
    global _producer

    if not settings.KAFKA_ENABLED:
        return None

    if _producer is None:
        _producer = KafkaProducer(
            bootstrap_servers=settings.KAFKA_BOOTSTRAP_SERVERS,
            value_serializer=lambda v: json.dumps(v).encode("utf-8"),
        )

    return _producer