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
from django.core.mail import send_mail

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

def send_email_alert(event):
    """
    Sends a real email using Django's mail system.
    """
    recipient = getattr(settings, 'ADMIN_RECIPIENT_EMAIL', None)
    
    if not recipient:
        print("❌ Error: ADMIN_RECIPIENT_EMAIL not set in settings.py")
        return

    subject = f"⚠️ Low Stock Alert: {event['product_name']}"
    
    # Plain text version
    message = f"Product: {event['product_name']}\nRemaining Stock: {event['current_stock']}\nPlease restock immediately."
    
    # Optional: HTML version for better formatting
    html_message = f"""
        <h3>Inventory Alert</h3>
        <p>The product <strong>{event['product_name']}</strong> is running low.</p>
        <p><strong>Current Stock:</strong> {event['current_stock']}</p>
        <hr>
        <p><small>This is an automated message from the Kafka Alert System.</small></p>
    """

    try:
        send_mail(
            subject=subject,
            message=message,
            from_email=settings.DEFAULT_FROM_EMAIL,
            recipient_list=[recipient], # Change to your recipient
            html_message=html_message,
            fail_silently=False,
        )
        print(f"✅ Email sent for {event['product_name']}")
    except Exception as e:
        print(f"❌ Failed to send email: {e}")

print("📣 Alert consumer running...")

for message in consumer:
    event = message.value
    send_email_alert(event)