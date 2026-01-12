# import os
# import sys
# import json
# import django
# from kafka import KafkaConsumer, KafkaProducer

# # Setup path
# BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
# sys.path.append(BASE_DIR)

# os.environ.setdefault("DJANGO_SETTINGS_MODULE", "mysite.settings")
# django.setup()

# from django.conf import settings
# from inventory.models import Product
# from inventory.services import get_current_stock

# def safe_json(message):
#     try:
#         return json.loads(message.decode("utf-8"))
#     except Exception:
#         return None

# consumer = KafkaConsumer(
#     "stock-entry-logs",
#     bootstrap_servers=settings.KAFKA_BOOTSTRAP_SERVERS,
#     auto_offset_reset="latest",
#     group_id="inventory-group",
#     value_deserializer=safe_json,
# )

# producer = KafkaProducer(
#     bootstrap_servers=settings.KAFKA_BOOTSTRAP_SERVERS,
#     value_serializer=lambda v: json.dumps(v).encode("utf-8"),
# )

# print("📦 Inventory consumer running...")

# for msg in consumer:
#     event = msg.value
#     print(f"Received : {event}")
#     if not event:
#         continue

#     product_id = event.get("product_id")
#     if not product_id:
#         continue

#     product = Product.objects.get(id=product_id)
#     stock = get_current_stock(product)

#     if stock < settings.RESTOCK_THRESHOLD:
#         alert_event = {
#             "event_type": "LOW_STOCK_DETECTED",
#             "product_id": product.id,
#             "product_name": product.name,
#             "current_stock": stock,
#         }

#         producer.send("low-stock-alerts", alert_event)
#         print("🚨 Low stock event published:", alert_event)




import os
import sys
import json
import django

# Setup path
BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
sys.path.append(BASE_DIR)

os.environ.setdefault("DJANGO_SETTINGS_MODULE", "mysite.settings")
django.setup()

from django.conf import settings
from products.models import Product
from stock.services import get_current_stock
from kafka import KafkaConsumer, KafkaProducer
from messaging.kafka.producer import send_event

def safe_json(message):
    try:
        return json.loads(message.decode("utf-8"))
    except Exception:
        return None

consumer = KafkaConsumer(
    "stock-entry-logs",
    bootstrap_servers=settings.KAFKA_BOOTSTRAP_SERVERS,
    auto_offset_reset="latest",
    group_id="inventory-group",
    value_deserializer=safe_json,
)

# producer = KafkaProducer(
#     bootstrap_servers=settings.KAFKA_BOOTSTRAP_SERVERS,
#     value_serializer=lambda v: json.dumps(v).encode("utf-8"),
# )

print("📦 Inventory consumer running...")

for msg in consumer:
    event = msg.value
    print(f"Received : {event}")
    if not event:
        continue

    product_id = event.get("product_id")
    if not product_id:
        continue

    product = Product.objects.get(id=product_id)
    stock = get_current_stock(product)

    if stock < settings.RESTOCK_THRESHOLD:
        alert_event = {
            "event_type": "LOW_STOCK_DETECTED",
            "product_id": product.id,
            "product_name": product.name,
            "current_stock": stock,
        }

        # producer.send("low-stock-alerts", alert_event)
        send_event("low-stock-alerts", alert_event)
        print("🚨 Low stock event published:", alert_event)