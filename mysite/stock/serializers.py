from rest_framework import serializers
from .models import StockEntry
from products.models import Product


class StockEntrySerializer(serializers.ModelSerializer):
    product_id = serializers.PrimaryKeyRelatedField(
        queryset=Product.objects.all(),
        source="product"
    )

    product = serializers.StringRelatedField(read_only=True)

    class Meta:
        model = StockEntry
        fields = [
            "id",
            "product",
            "product_id",
            "movement_type",
            "quantity",
            "reference",
            "created_at",
        ]
        read_only_fields = ["id", "created_at"]