from django.db.models import Sum, Case, When, IntegerField, F
from .models import StockEntry


def get_current_stock(product):
    result = StockEntry.objects.filter(
        product=product
    ).aggregate(
        stock=Sum(
            Case(
                When(movement_type="IN", then=F("quantity")),
                When(movement_type="OUT", then=-F("quantity")),
                output_field=IntegerField()
            )
        )
    )
    return result["stock"] or 0