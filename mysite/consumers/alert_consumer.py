# import json
# from kafka import KafkaConsumer
# import sys, os
# import django

# # Setup path
# BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
# sys.path.append(BASE_DIR)

# os.environ.setdefault("DJANGO_SETTINGS_MODULE", "mysite.settings")
# django.setup()

# from django.conf import settings

# consumer = KafkaConsumer(
#     "low-stock-alerts",
#     bootstrap_servers=settings.KAFKA_BOOTSTRAP_SERVERS,
#     auto_offset_reset="latest",
#     group_id="alert-group",
#     value_deserializer=lambda m: json.loads(m.decode("utf-8")),
# )

# def send_email(event):
#     print(
#         f"📧 EMAIL ALERT → {event['product_name']} "
#         f"stock is {event['current_stock']}"
#     )

# print("📣 Alert consumer running...")

# for message in consumer:
#     event = message.value
#     send_email(event)







import json
from kafka import KafkaConsumer
import sys, os
import django

# Setup path
BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
sys.path.append(BASE_DIR)

os.environ.setdefault("DJANGO_SETTINGS_MODULE", "mysite.settings")
django.setup()

from django.conf import settings

consumer = KafkaConsumer(
    "low-stock-alerts",
    bootstrap_servers=settings.KAFKA_BOOTSTRAP_SERVERS,
    auto_offset_reset="latest",
    group_id="alert-group",
    value_deserializer=lambda m: json.loads(m.decode("utf-8")),
)

def send_email(event):
    print(
        f"📧 EMAIL ALERT → {event['product_name']} "
        f"stock is {event['current_stock']}"
    )

print("📣 Alert consumer running...")

for message in consumer:
    event = message.value
    send_email(event)