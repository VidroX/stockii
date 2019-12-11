from rest_framework import serializers
from shipments.models import Provider


class ProvidersSerializer(serializers.ModelSerializer):
    class Meta:
        model = Provider
        fields = '__all__'
