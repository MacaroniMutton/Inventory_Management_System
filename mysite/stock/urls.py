from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import StockEntryViewSet, InventorySummaryView

router = DefaultRouter()
router.register(r"stock-entries", StockEntryViewSet, basename="stock-entry")

urlpatterns = [
    path("", include(router.urls)),
    path("stats/inventory-summary/", InventorySummaryView.as_view()),
]