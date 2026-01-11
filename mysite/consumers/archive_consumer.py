# import os
# import sys
# import json
# import django
# from datetime import timedelta
# from kafka import KafkaConsumer

# BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
# sys.path.append(BASE_DIR)

# os.environ.setdefault("DJANGO_SETTINGS_MODULE", "mysite.settings")
# django.setup()

# from django.conf import settings
# from django.utils import timezone
# from inventory.models import StockEntryArchive


# ARCHIVE_AFTER_MINUTES = 1

# def safe_json(message):
#     try:
#         return json.loads(message.decode("utf-8"))
#     except Exception:
#         return None

# consumer = KafkaConsumer(
#     "stock-entry-logs",
#     bootstrap_servers=settings.KAFKA_BOOTSTRAP_SERVERS,
#     auto_offset_reset="earliest",
#     enable_auto_commit=True,
#     group_id="archive-group",
#     value_deserializer=safe_json,
# )

# print("🗄 Continuous archive consumer running...")


# for message in consumer:
#     event = message.value

#     # Validate event structure
#     if not isinstance(event, dict):
#         print("❌ Invalid event (not dict):", event)
#         continue

#     if "timestamp" not in event:
#         print("❌ Missing timestamp:", event)
#         continue

#     # Parse timestamp safely
#     try:
#         event_time = timezone.datetime.fromisoformat(event["timestamp"])
#         if timezone.is_naive(event_time):
#             event_time = timezone.make_aware(event_time)
#     except Exception:
#         print("❌ Invalid timestamp format:", event)
#         continue

#     # Compare with timezone-aware cutoff
#     cutoff_time = timezone.now() - timedelta(minutes=ARCHIVE_AFTER_MINUTES)

#     if event_time < cutoff_time:
#         StockEntryArchive.objects.create(
#             product_id=event["product_id"],
#             quantity=event["quantity"],
#             movement_type=event["movement_type"],
#             created_at=event_time,
#         )
#         print("✅ Archived:", event)





# import os
# import sys
# import json
# import django
# from datetime import timedelta
# from kafka import KafkaConsumer

# BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
# sys.path.append(BASE_DIR)

# os.environ.setdefault("DJANGO_SETTINGS_MODULE", "mysite.settings")
# django.setup()

# from django.conf import settings
# from django.utils import timezone
# from stock.models import StockEntryArchive


# ARCHIVE_AFTER_MINUTES = 1

# def safe_json(message):
#     try:
#         return json.loads(message.decode("utf-8"))
#     except Exception:
#         return None

# consumer = KafkaConsumer(
#     "stock-entry-logs",
#     bootstrap_servers=settings.KAFKA_BOOTSTRAP_SERVERS,
#     auto_offset_reset="earliest",
#     enable_auto_commit=True,
#     group_id="archive-group",
#     value_deserializer=safe_json,
# )

# print("🗄 Continuous archive consumer running...")


# for message in consumer:
#     event = message.value

#     # Validate event structure
#     if not isinstance(event, dict):
#         print("❌ Invalid event (not dict):", event)
#         continue

#     if "timestamp" not in event:
#         print("❌ Missing timestamp:", event)
#         continue

#     # Parse timestamp safely
#     try:
#         event_time = timezone.datetime.fromisoformat(event["timestamp"])
#         if timezone.is_naive(event_time):
#             event_time = timezone.make_aware(event_time)
#     except Exception:
#         print("❌ Invalid timestamp format:", event)
#         continue

#     # Compare with timezone-aware cutoff
#     cutoff_time = timezone.now() - timedelta(minutes=ARCHIVE_AFTER_MINUTES)

#     if event_time < cutoff_time:
#         StockEntryArchive.objects.create(
#             product_id=event["product_id"],
#             quantity=event["quantity"],
#             movement_type=event["movement_type"],
#             created_at=event_time,
#         )
#         print("✅ Archived:", event)






import os
import sys
import json
import django
from datetime import datetime
from kafka import KafkaConsumer

# Setup Django Environment
BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
sys.path.append(BASE_DIR)
os.environ.setdefault("DJANGO_SETTINGS_MODULE", "mysite.settings")
django.setup()

from django.conf import settings

# Configuration
ARCHIVE_DIR = os.path.join(BASE_DIR, "stock_archives")
os.makedirs(ARCHIVE_DIR, exist_ok=True)

def run_archive_job():
    # 1. Initialize Consumer
    # We use a unique group_id or manage offsets manually to ensure 
    # we pick up where the last cron job left off.
    consumer = KafkaConsumer(
        "stock-entry-logs",
        bootstrap_servers=settings.KAFKA_BOOTSTRAP_SERVERS,
        auto_offset_reset="earliest",
        enable_auto_commit=True,
        group_id="periodic-file-archiver",
        value_deserializer=lambda m: json.loads(m.decode("utf-8")) if m else None,
        # Stop the script if no new messages arrive for 5 seconds
        consumer_timeout_ms=5000 
    )

    date_str = datetime.now().strftime("%Y-%m-%d")
    filename = os.path.join(ARCHIVE_DIR, f"archive_{date_str}.jsonl")
    
    count = 0
    print(f"🚀 Starting archive job at {datetime.now()}...")

    try:
        # Consume available messages
        for message in consumer:
            event = message.value
            if not event:
                continue

            # Append to JSONL file
            with open(filename, "a", encoding="utf-8") as f:
                f.write(json.dumps(event) + "\n")
            
            count += 1
            
        print(f"✅ Successfully archived {count} records to {filename}.")
    
    except Exception as e:
        print(f"❌ Error during archiving: {e}")
    finally:
        consumer.close()

if __name__ == "__main__":
    run_archive_job()