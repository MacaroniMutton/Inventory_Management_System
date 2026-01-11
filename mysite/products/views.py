from django.shortcuts import render
from rest_framework.viewsets import ModelViewSet
from rest_framework.response import Response
from django.conf import settings
from .models import Category, Product
from .serializers import CategorySerializer, ProductSerializer, LowStockProductSerializer
from stock.services import get_current_stock
from rest_framework.decorators import action
from django.db.models import Sum, Case, When, IntegerField, F, Value
from django.db.models.functions import Coalesce
from django.core.cache import cache
from stock.serializers import StockEntrySerializer
from django_statsd.middleware import incr, with_


class CategoryViewSet(ModelViewSet):
    queryset = Category.objects.all()
    serializer_class = CategorySerializer


class ProductViewSet(ModelViewSet):
    queryset = Product.objects.select_related("category").prefetch_related("suppliers")
    serializer_class = ProductSerializer

    def get_serializer_class(self):
        if self.action == "low_stock":
            return LowStockProductSerializer
        return ProductSerializer

    def create(self, request, *args, **kwargs):
        with with_("product.create.time"):
            return super().create(request, *args, **kwargs)

    def update(self, request, *args, **kwargs):
        with with_("product.update.time"):
            return super().update(request, *args, **kwargs)

    def destroy(self, request, *args, **kwargs):
        with with_("product.delete.time"):
            return super().destroy(request, *args, **kwargs)

    def list(self, request, *args, **kwargs):
        with with_("product.list.time"):
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