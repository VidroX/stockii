from rest_framework import serializers

from accounts.models import User


class TriggerSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = [
            'email',
            'mobile_phone',
            'first_name',
            'last_name',
            'patronymic',
            'birthday',
            'date_joined',
            'is_superuser',
            'is_active'
        ]
