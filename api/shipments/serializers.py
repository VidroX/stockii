from rest_framework import serializers
from shipments.models import Shipment


class ShipmentsSerializer(serializers.ModelSerializer):
    class Meta:
        model = Shipment
        fields = '__all__'
