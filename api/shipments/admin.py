from django.contrib import admin
from shipments.models import Provider, Shipment


# Register your models here.
admin.site.register(Provider)
admin.site.register(Shipment)
