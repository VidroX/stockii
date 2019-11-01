from django.contrib import admin
from warehouses.models import Warehouse, WarehouseAccess


# Register your models here
admin.site.register(Warehouse)
admin.site.register(WarehouseAccess)
