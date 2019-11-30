from django.db import models
from products.models import Product


# Create your models here
class Trigger(models.Model):
    TRIGGER_TYPES = (
        (1, 'Restock product'),
        (2, 'Move product')
    )
    TRIGGER_STATUSES = (
        (1, 'Awaiting activation'),
        (2, 'Completed')
    )

    product = models.ForeignKey(Product, on_delete=models.CASCADE)
    name = models.CharField(max_length=255)
    type = models.IntegerField(choices=TRIGGER_TYPES, default=1)
    activation_date = models.DateField(auto_now_add=True)
    status = models.IntegerField(choices=TRIGGER_STATUSES, default=1)

    def __str__(self):
        return self.name

    class Meta:
        ordering = ['name']
