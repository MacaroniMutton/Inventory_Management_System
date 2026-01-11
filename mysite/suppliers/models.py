from django.db import models


class Supplier(models.Model):
    name = models.CharField(max_length=150)
    email = models.EmailField(unique=True)
    phone = models.CharField(max_length=20, blank=True)

    is_active = models.BooleanField(default=True)

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ["name"]

    def __str__(self):
        return self.name


class ProductSupplier(models.Model):
    product = models.ForeignKey(
        "products.Product",
        on_delete=models.CASCADE
    )
    supplier = models.ForeignKey(
        Supplier,
        on_delete=models.CASCADE
    )

    supply_price = models.DecimalField(
        max_digits=10,
        decimal_places=2
    )

    lead_time_days = models.PositiveIntegerField(
        help_text="Days to deliver"
    )

    is_primary = models.BooleanField(default=False)

    class Meta:
        unique_together = ("product", "supplier")

    def __str__(self):
        return f"{self.product} - {self.supplier}"