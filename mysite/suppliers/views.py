from django.shortcuts import render
from rest_framework.viewsets import ModelViewSet
from .models import Supplier, ProductSupplier
from .serializers import SupplierSerializer, ProductSupplierSerializer


class SupplierViewSet(ModelViewSet):
    queryset = Supplier.objects.all()
    serializer_class = SupplierSerializer


class ProductSupplierViewSet(ModelViewSet):
    queryset = ProductSupplier.objects.select_related("product", "supplier")
    serializer_class = ProductSupplierSerializer