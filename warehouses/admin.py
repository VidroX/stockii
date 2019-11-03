from django.contrib import admin
from warehouses.models import Warehouse, WarehouseAccess


# Register your models here
class WarehouseAccessAdmin(admin.ModelAdmin):
    list_display = ('get_user_email', 'get_warehouse_location')

    def get_warehouse_location(self, obj):
        return obj.warehouse.location

    def get_user_email(self, obj):
        return obj.user.email

    get_warehouse_location.admin_order_field = 'warehouse'
    get_warehouse_location.short_description = 'Warehouse location'
    get_user_email.admin_order_field = 'user'
    get_user_email.short_description = 'User E-Mail'


admin.site.register(Warehouse)
admin.site.register(WarehouseAccess, WarehouseAccessAdmin)
