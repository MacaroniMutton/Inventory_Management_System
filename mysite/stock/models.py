from django.db import models


class StockEntry(models.Model):
    IN = "IN"
    OUT = "OUT"

    MOVEMENT_CHOICES = [
        (IN, "Stock In"),
        (OUT, "Stock Out"),
    ]

    product = models.ForeignKey(
        "products.Product",
        on_delete=models.CASCADE,
        related_name="stock_entries"
    )

    quantity = models.PositiveIntegerField()

    movement_type = models.CharField(
        max_length=3,
        choices=MOVEMENT_CHOICES
    )

    reference = models.CharField(
        max_length=100,
        blank=True,
        help_text="Invoice / PO / Adjustment reason"
    )

    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ["-created_at"]

    def __str__(self):
        return f"{self.product} {self.movement_type} {self.quantity}"

