from django.db import models
from products.models import Product


# Create your models here
class Provider(models.Model):
    name = models.CharField(max_length=255)
    working_from = models.TimeField()
    working_to = models.TimeField()
    average_delivery_time = models.IntegerField(default=0)
    weekends = models.BooleanField(default=False)

    def __str__(self):
        return self.name

    class Meta:
        ordering = ['name']


class Shipment(models.Model):
    SHIPMENT_STATUSES = (
        (1, 'Uncompleted'),
        (2, 'Completed')
    )

    product = models.ForeignKey(Product, on_delete=models.SET_NULL, null=True)
    provider = models.ForeignKey(Provider, on_delete=models.SET_NULL, null=True)
    start_date = models.DateTimeField(auto_now_add=True)
    approximate_delivery = models.DateField(null=False)
    status = models.IntegerField(choices=SHIPMENT_STATUSES, default=1)

    def __str__(self):
        if self.product is not None and self.provider is not None:
            return self.product.name + " (" + self.provider.name + ")"
        else:
            return "Shipment Object"

    class Meta:
        ordering = ['-approximate_delivery']
