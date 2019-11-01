from django.db import models
from warehouses.models import Warehouse


# Create your models here
class Product(models.Model):
    warehouse = models.ForeignKey(Warehouse, on_delete=models.CASCADE)
    name = models.CharField(max_length=255)
    quantity = models.IntegerField(default=0)

    class Meta:
        ordering = ['name']


class ProductLimit(models.Model):
    product = models.OneToOneField(Product, on_delete=models.CASCADE)
    max_amount = models.IntegerField(default=100)
    min_amount = models.IntegerField(default=10)

    class Meta:
        order_with_respect_to = 'product'
