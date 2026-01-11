from django.contrib import admin
from .models import Supplier, ProductSupplier

admin.site.register(Supplier)
admin.site.register(ProductSupplier)