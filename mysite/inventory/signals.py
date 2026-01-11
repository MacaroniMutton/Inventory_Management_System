from django.db.models.signals import post_save, post_delete
from django.dispatch import receiver
from .kafka.producer import producer
from .models import StockEntry, Product, ProductSupplier
from django.core.cache import cache

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

    producer.send("stock-entry-logs", event)

@receiver([post_save, post_delete], sender=Product)
def invalidate_product_cache(sender, **kwargs):
    cache.delete("products:list")

@receiver([post_save, post_delete], sender=StockEntry)
def invalidate_stock_cache(sender, **kwargs):
    cache.delete("products:low-stock")
    cache.delete("stats:inventory-summary")

@receiver([post_save, post_delete], sender=ProductSupplier)
def invalidate_inventory_summary_on_supplier_change(sender, instance, **kwargs):
    # Any change in supplier pricing or primary flag affects stock value
    cache.delete("stats:inventory-summary")
