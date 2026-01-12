from django.db.models.signals import post_save, post_delete
from django.dispatch import receiver
from .models import StockEntry
from django.core.cache import cache
from messaging.kafka.producer import send_event


@receiver(post_save, sender=StockEntry)
def publish_stock_entry(sender, instance, created, **kwargs):
    if not created:
        return

    event = {
        "event_type": "STOCK_ENTRY_CREATED",
        "product_id": instance.product_id,
        "quantity": instance.quantity,
        "movement_type": instance.movement_type,
        "timestamp": instance.created_at.isoformat(),
    }

    # producer.send("stock-entry-logs", event)
    send_event("stock-entry-logs", event)


@receiver([post_save, post_delete], sender=StockEntry)
def invalidate_stock_cache(sender, **kwargs):
    cache.delete("products:low-stock")
    cache.delete("stats:inventory-summary")