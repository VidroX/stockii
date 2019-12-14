from rest_framework import serializers
from django.contrib.auth import get_user_model, authenticate, login


class LoginSerializer(serializers.ModelSerializer):
    email = serializers.CharField()
    password = serializers.CharField()

    def validate(self, attrs):
        user = authenticate(**attrs)
        if user and user.is_active:
            return user
        raise serializers.ValidationError("E-Mail or password is incorrect.", code='invalid')

    class Meta:
        model = get_user_model()
        fields = ('id', 'email', 'password')


class RegisterSerializer(serializers.ModelSerializer):
    def create(self, validated_data):
        user = get_user_model().objects.create_user(**validated_data)
        if user:
            return user
        return serializers.ValidationError('Unable to register.', code='unable')

    class Meta:
        model = get_user_model()
        fields = ('id', 'email', 'password', 'mobile_phone', 'last_name', 'first_name', 'patronymic', 'birthday')
        extra_kwargs = {
            'password': {'write_only': True}
        }

