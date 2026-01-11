from django.db import models

# Create your models here.

class Category(models.Model):
    name = models.CharField(max_length=100, unique=True)
    description = models.TextField(blank=True)
    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ["name"]
        verbose_name_plural = "Categories"

    def __str__(self):
        return self.name

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

class Product(models.Model):
    name = models.CharField(max_length=150)
    sku = models.CharField(max_length=50, unique=True)
    category = models.ForeignKey(Category, on_delete=models.PROTECT, related_name="products")

    description = models.TextField(blank=True)
    is_active = models.BooleanField(default=True)

    suppliers = models.ManyToManyField(
        Supplier,
        through="ProductSupplier",
        related_name="supplied_products"
    )

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ["name"]
        indexes = [
            models.Index(fields=["sku"]),
            models.Index(fields=["name"]),
        ]

    def __str__(self):
        return f"{self.name} ({self.sku})"

class ProductSupplier(models.Model):
    product = models.ForeignKey(
        Product,
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

class StockEntry(models.Model):
    IN = "IN"
    OUT = "OUT"

    MOVEMENT_CHOICES = [
        (IN, "Stock In"),
        (OUT, "Stock Out"),
    ]

    product = models.ForeignKey(
        Product,
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

class StockEntryArchive(models.Model):
    product_id = models.IntegerField()
    quantity = models.IntegerField()
    movement_type = models.CharField(max_length=3)
    created_at = models.DateTimeField()
    archived_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        db_table = "stock_entry_archive"




