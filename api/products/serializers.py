from rest_framework import serializers
from products.models import Product, ProductLimit


class ProductLimitsSerializer(serializers.ModelSerializer):
    class Meta:
        model = ProductLimit
        fields = ['id', 'min_amount', 'max_amount']


class ProductSerializer(serializers.ModelSerializer):
    limit = ProductLimitsSerializer(read_only=True)

    class Meta:
        model = Product
        fields = '__all__'
