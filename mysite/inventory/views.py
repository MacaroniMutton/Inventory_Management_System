from django.shortcuts import render
from rest_framework.viewsets import ModelViewSet
from rest_framework.response import Response
from rest_framework.permissions import AllowAny
from django.conf import settings
from .models import Category, Product, Supplier, StockEntry, ProductSupplier
from .serializers import CategorySerializer, ProductSerializer, SupplierSerializer, StockEntrySerializer, ProductSupplierSerializer
from .services import get_current_stock
from rest_framework.exceptions import ValidationError
from django.db import transaction
from rest_framework.decorators import action
from django.db.models import Sum, Case, When, IntegerField, F, Value
from django.db.models.functions import Coalesce
from rest_framework.views import APIView
from django.core.cache import cache

class CategoryViewSet(ModelViewSet):
    queryset = Category.objects.all()
    serializer_class = CategorySerializer

class ProductViewSet(ModelViewSet):
    queryset = Product.objects.select_related("category").prefetch_related("suppliers")
    serializer_class = ProductSerializer

    def list(self, request, *args, **kwargs):
        cache_key = "products:list"

        data = cache.get(cache_key)
        if data:
            print("CACHE HIT!!")
            return Response(data)

        print("CACHE MISS")
        response = super().list(request, *args, **kwargs)
        cache.set(cache_key, response.data, timeout=300)
        return response

    @action(detail=False, methods=["get"], url_path="low-stock")
    def low_stock(self, request):
        cache_key = "products:low-stock"

        data = cache.get(cache_key)
        if data:
            print("CACHE HIT!!")
            return Response(data)

        print("CACHE MISS")
        products = Product.objects.annotate(
            stock=Coalesce(
                Sum(
                    Case(
                        When(stock_entries__movement_type="IN", then=F("stock_entries__quantity")),
                        When(stock_entries__movement_type="OUT", then=-F("stock_entries__quantity")),
                        output_field=IntegerField()
                    )
                ), Value(0)
            ) 
        ).filter(stock__lt=settings.RESTOCK_THRESHOLD)

        serializer = self.get_serializer(products, many=True)
        cache.set(cache_key, serializer.data, timeout=300)
        return Response(serializer.data)

    @action(detail=False, methods=["get"], url_path="by-supplier/(?P<supplier_id>[^/.]+)")
    def by_supplier(self, request, supplier_id=None):
        products = self.queryset.filter(suppliers__id=supplier_id)
        serializer = self.get_serializer(products, many=True)
        return Response(serializer.data)
    
    @action(detail=False, methods=["get"], url_path="by-category/(?P<category_id>[^/.]+)")
    def by_category(self, request, category_id=None):
        products = self.queryset.filter(category_id=category_id)
        serializer = self.get_serializer(products, many=True)
        return Response(serializer.data)
    
    @action(detail=True, methods=["get"], url_path="stock-history")
    def stock_history(self, request, pk=None):
        product = self.get_object()
        entries = product.stock_entries.all()
        data = StockEntrySerializer(entries, many=True).data
        return Response(data)


class SupplierViewSet(ModelViewSet):
    queryset = Supplier.objects.all()
    serializer_class = SupplierSerializer

class ProductSupplierViewSet(ModelViewSet):
    queryset = ProductSupplier.objects.select_related("product", "supplier")
    serializer_class = ProductSupplierSerializer


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

        for product in Product.objects.all():
            stock = get_current_stock(product)

            if stock <= 0:
                continue

            primary_supplier = ProductSupplier.objects.filter(product=product, is_primary=True).first()

            if not primary_supplier:
                continue

            total_stock_value += stock * primary_supplier.supply_price

        data = {
            "product_count": product_count,
            "supplier_count": supplier_count,
            "total_stock_value": round(total_stock_value, 2)
        }
        cache.set(cache_key, data, timeout=300)
        return Response(data)
