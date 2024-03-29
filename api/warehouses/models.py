from django.db import models
from stocked import settings


# Create your models here.
class Warehouse(models.Model):
    location = models.CharField(max_length=255, unique=True)
    working_from = models.TimeField()
    working_to = models.TimeField()
    weekends = models.BooleanField(default=False)
    phone = models.CharField(max_length=255)

    def __str__(self):
        return self.location


class WarehouseAccess(models.Model):
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    warehouse = models.ForeignKey(Warehouse, on_delete=models.CASCADE)

    def __str__(self):
        return self.warehouse.location + " (" + self.user.email + ")"

    class Meta:
        unique_together = ['user', 'warehouse']
