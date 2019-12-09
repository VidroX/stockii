from rest_framework import serializers
from api.products.serializers import ProductNoLimitSerializer
from api.providers.serializers import ProvidersSerializer
from shipments.models import Shipment


class ShipmentsSerializer(serializers.ModelSerializer):
    product = ProductNoLimitSerializer(read_only=True)
    provider = ProvidersSerializer(read_only=True)

    class Meta:
        model = Shipment
        fields = '__all__'


class ShipmentsCreateSerializer(serializers.ModelSerializer):
    class Meta:
        model = Shipment
        fields = '__all__'
