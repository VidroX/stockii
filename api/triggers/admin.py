from django.contrib import admin
from triggers.models import Trigger, RestockTrigger, MoveTrigger

# Register your models here.
admin.site.register(Trigger)
admin.site.register(RestockTrigger)
admin.site.register(MoveTrigger)
