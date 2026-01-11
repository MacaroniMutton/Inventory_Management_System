from django.contrib import admin
from .models import Category, Product, StockEntry, Supplier, StockEntryArchive, ProductSupplier
# Register your models here.

admin.site.register(Category)
admin.site.register(Product)
admin.site.register(StockEntry)
admin.site.register(Supplier)
admin.site.register(StockEntryArchive)
admin.site.register(ProductSupplier)