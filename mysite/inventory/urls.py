from django.urls import path, include
from rest_framework.routers import DefaultRouter

from .views import CategoryViewSet, ProductViewSet, SupplierViewSet, ProductSupplierViewSet, StockEntryViewSet, InventorySummaryView

router = DefaultRouter()
router.register(r"categories", CategoryViewSet, basename="category")
router.register(r"products", ProductViewSet, basename="product")
router.register(r"suppliers", SupplierViewSet, basename="supplier")
router.register(r"product-suppliers", ProductSupplierViewSet)
router.register(r"stock-entries", StockEntryViewSet, basename="stock-entry")

urlpatterns = [
    path("", include(router.urls)),
    path("stats/inventory-summary/", InventorySummaryView.as_view())
]
