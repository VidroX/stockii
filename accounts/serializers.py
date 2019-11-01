from rest_framework import serializers
from django.contrib.auth import get_user_model


class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = get_user_model()
        fields = (
            'id',
            'email',
            'mobile_phone',
            'last_name',
            'first_name',
            'patronymic',
            'birthday',
            'is_superuser',
            'is_active'
        )
