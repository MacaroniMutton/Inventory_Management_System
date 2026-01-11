from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import SupplierViewSet, ProductSupplierViewSet

router = DefaultRouter()
router.register(r"suppliers", SupplierViewSet, basename="supplier")
router.register(r"product-suppliers", ProductSupplierViewSet)

urlpatterns = [
    path("", include(router.urls)),
]