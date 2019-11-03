from rest_framework import serializers
from warehouses.models import Warehouse


class WarehousesSerializer(serializers.ModelSerializer):
    def create(self, validated_data):
        warehouse = Warehouse.objects.create(
            location=validated_data.get('location', None),
            working_from=validated_data.get('working_from', None),
            working_to=validated_data.get('working_to', None),
            weekends=validated_data.get('weekends', None),
            phone=validated_data.get('phone', None)
        )
        return warehouse

    class Meta:
        model = Warehouse
        fields = '__all__'
