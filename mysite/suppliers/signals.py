from django.db.models.signals import post_save, post_delete
from django.dispatch import receiver
from .models import ProductSupplier
from django.core.cache import cache


@receiver([post_save, post_delete], sender=ProductSupplier)
def invalidate_inventory_summary_on_supplier_change(sender, instance, **kwargs):
    # Any change in supplier pricing or primary flag affects stock value
    cache.delete("stats:inventory-summary")