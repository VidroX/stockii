from django.db import models
from datetime import date
from polymorphic.models import PolymorphicModel
from stocked import settings
from products.models import Product
from warehouses.models import Warehouse


# Create your models here
class Trigger(PolymorphicModel):
    TRIGGER_STATUSES = (
        (1, 'Awaiting activation'),
        (2, 'Completed'),
        (3, 'Failed')
    )

    created_by = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    product = models.ForeignKey(Product, on_delete=models.CASCADE)
    name = models.CharField(max_length=255)
    creation_date = models.DateField(auto_now_add=True)
    activation_date = models.DateField(default=date.today)
    status = models.IntegerField(choices=TRIGGER_STATUSES, default=1)

    def __str__(self):
        return self.name

    class Meta:
        ordering = ['name']


class MoveTrigger(Trigger):
    from_warehouse = models.ForeignKey(Warehouse, on_delete=models.CASCADE, related_name='from_warehouse')
    to_warehouse = models.ForeignKey(Warehouse, on_delete=models.CASCADE, related_name='to_warehouse')


class RestockTrigger(Trigger):
    quantity = models.IntegerField(default=1)
