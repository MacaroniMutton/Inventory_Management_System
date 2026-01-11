from django.shortcuts import render
from rest_framework.viewsets import ModelViewSet
from rest_framework.response import Response
from .models import StockEntry
from .serializers import StockEntrySerializer
from .services import get_current_stock
from rest_framework.exceptions import ValidationError
from django.db import transaction
from rest_framework.views import APIView
from django.core.cache import cache
from products.models import Product
from suppliers.models import ProductSupplier, Supplier
from django_statsd.middleware import incr


class StockEntryViewSet(ModelViewSet):
    queryset = StockEntry.objects.select_related("product")
    serializer_class = StockEntrySerializer

    def perform_create(self, serializer):
        product = serializer.validated_data["product"]
        quantity = serializer.validated_data["quantity"]
        movement = serializer.validated_data["movement_type"]

        if movement == "OUT":
            current_stock = get_current_stock(product)
            if current_stock < quantity:
                raise ValidationError("Insufficient stock")

        with transaction.atomic():
            serializer.save()
            # stock entries created Metric
            incr("stock.entries.created")

class InventorySummaryView(APIView):
    def get(self, request):
        cache_key = "stats:inventory-summary"

        data = cache.get(cache_key)
        if data:
            print("CACHE HIT!!")
            return Response(data)

        print("CACHE MISS")

        product_count = Product.objects.count()
        supplier_count = Supplier.objects.count()

        total_stock_value = 0
        total_stock_units = 0
        products_with_stock = 0

        for product in Product.objects.all():
            stock = get_current_stock(product)

            if stock <= 0:
                continue

            primary_supplier = (
                ProductSupplier.objects
                .filter(product=product, is_primary=True)
                .first()
            )

            if not primary_supplier:
                continue

            products_with_stock += 1
            total_stock_units += stock
            total_stock_value += stock * primary_supplier.supply_price

        data = {
            "product_count": product_count,
            "supplier_count": supplier_count,
            "products_with_stock": products_with_stock,
            "total_stock_units": total_stock_units,
            "total_stock_value": round(total_stock_value, 2)
        }

        cache.set(cache_key, data, timeout=300)
        return Response(data)
