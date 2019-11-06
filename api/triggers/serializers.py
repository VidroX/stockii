from rest_framework import serializers
from triggers.models import Trigger


class TriggerSerializer(serializers.ModelSerializer):
    class Meta:
        model = Trigger
        fields = '__all__'
